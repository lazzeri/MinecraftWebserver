'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.forgotPassword =
  exports.login =
  exports.register =
  exports.verifyCode =
  exports.verifyName =
    void 0;
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'));
const jwt_decode_1 = __importDefault(require('jwt-decode'));
const nodemailer_1 = __importDefault(require('nodemailer'));
const generate_password_1 = __importDefault(require('generate-password'));
const crypto_1 = require('./crypto');
const request_1 = __importDefault(require('request'));
const database_1 = require('./database');
const verifyName = async (req, res) => {
  let { name } = req.body;
  name = name.replace(' ', '').toLowerCase();
  if (name === '') {
    return res.render('register', {
      message: 'Please enter your YouNow name',
    });
  }
  getUserId(name).then(async (foundUserId) => {
    if (foundUserId.error) {
      return res.render('register', {
        message: 'This username is not registered on YouNow',
      });
    }
    let foundUser;
    const verifiedUsersModel = database_1.database.verifiedUsers;
    try {
      foundUser = await verifiedUsersModel.findByPk(name);
    } catch (e) {
      console.log('ERROR', e);
      return res.render('register', {
        message: 'Something went wrong..',
      });
    }
    getUserInfo(foundUserId.userId).then(async (result) => {
      if (!foundUser) {
        if (result.propsLevel < 20 || !result.hasOwnProperty('propsLevel')) {
          if (!result.isPartner) {
            return res.render('register', {
              message: 'You are not above lvl 19 or a Partner on YouNow.',
            });
          }
        }
      }
      let isRegistered = await isUserRegistered(foundUserId.userId);
      if (isRegistered.error) {
        return res.render('register', {
          message: isRegistered.error,
        });
      }
      let generatedCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
      createVerifyTokenForRegistration(res, name, generatedCode, foundUserId.userId);
      return res.render('register', {
        message: generatedCode,
        showSecondPart: true,
      });
    });
  });
};
exports.verifyName = verifyName;
const verifyCode = async (req, res) => {
  const { generatedCode, userName } = getVerifyToken(req, res);
  if (false) {
    return res.render('register', {
      showThirdPart: true,
    });
  }
  await getVerificationResult(generatedCode, userName)
    .then((result) => {
      if (result) {
        return res.render('register', {
          showThirdPart: true,
        });
      }
      return res.render('register', {
        message: 'No code found, please try again.',
      });
    })
    .catch((e) => {
      return res.render('register', {
        message: e,
      });
    });
};
exports.verifyCode = verifyCode;
const register = async (req, res) => {
  const { userName, userId } = getVerifyToken(req, res);
  const { email, password, passwordConfirm } = req.body;
  let emailIsInUseAnswer = await emailIsInUse(email);
  if (emailIsInUseAnswer.error) {
    return res.render('register', {
      message: emailIsInUseAnswer.error,
      showThirdPart: true,
    });
  }
  if (password !== passwordConfirm) {
    return res.render('register', {
      message: "The two passwords don't mach",
      showThirdPart: true,
    });
  }
  const hash = (0, crypto_1.encrypt)(password);
  let userCreation = await createUser(email, hash.iv, hash.content, parseInt(userId), userName);
  if (userCreation.error) {
    return res.render('register', {
      message: userCreation.message,
      showThirdPart: true,
    });
  }
  let settingsCreation = await createSettings(userId);
  if (settingsCreation.error) {
    userCreation.newUser.destroy();
    return res.render('register', {
      message: settingsCreation.message,
      showThirdPart: true,
    });
  }
  let toolInfos = await createToolInfos(userId);
  if (toolInfos.error) {
    settingsCreation.toolSettings.destroy();
    userCreation.newUser.destroy();
    return res.render('register', {
      message: toolInfos.message,
      showThirdPart: true,
    });
  }
  loginAndCreateCookie(userId, res, 'welcomePage');
};
exports.register = register;
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).render('login', {
      message: 'Please enter the email and password to your account',
    });
  }
  let emailInUse = await emailIsInUse(email);
  if (!emailInUse.user) {
    return res.status(400).render('login', {
      message: "Email or password is incorrect, don't forget to register!",
    });
  }
  if (
    (0, crypto_1.decrypt)({
      iv: emailInUse.user.iv,
      content: emailInUse.user.content,
    }) === password ||
    emailInUse.user.content === password
  ) {
    loginAndCreateCookie(emailInUse.user.userId, res);
  } else {
    return res.status(400).render('login', {
      message: "Email or password is incorrect, don't forget to register!",
    });
  }
};
exports.login = login;
const forgotPassword = async (req, res) => {
  let email = req.body.msg.toLowerCase();
  if (!email || email === '') {
    return res.status(400).render('login', {
      message: 'Please provide your email',
    });
  }
  let emailInUse = await emailIsInUse(email);
  if (!emailInUse.user) {
    return res.render('register', {
      message: 'No email associated to an account',
      showThirdPart: true,
    });
  }
  let password = generate_password_1.default.generate({
    length: 10,
    numbers: true,
  });
  const hash = (0, crypto_1.encrypt)(password);
  emailInUse.user.update({
    iv: hash.iv,
    content: hash.content,
  });
  let transporter = nodemailer_1.default.createTransporter({
    host: 'mail.smtp2go.com',
    secure: false,
    port: 2525,
    auth: {
      user: 'supportHelper',
      pass: process.env.EMAIL_PASS || '',
    },
  });
  let mailOptions = {
    from: process.env.EMAIL_ACCOUNT || '',
    to: email,
    subject: 'New Password',
    text:
      'Your new generated password is: ' + password + ' \n' + ' No, you can not change it sorry.',
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      return res.status(400).render('login', {
        message: 'Error while sending the new password',
      });
    } else {
      return res.status(200).render('login', {
        message: 'Succesfully send password',
      });
    }
  });
};
exports.forgotPassword = forgotPassword;
function getUserId(userName) {
  if (userName === '') throw new Error('No username was set');
  let headers = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
    Accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'Accept-Language': 'en,en-US;q=0.9',
  };
  return new Promise((resolve, reject) => {
    try {
      request_1.default.get(
        {
          url: 'https://api.younow.com/php/api/broadcast/info/curId=0/user=' + userName,
          headers: headers,
          timeout: 5000,
        },
        (error, response, body) => {
          let output = JSON.parse(body);
          if (output.errorCode === 102) {
            resolve({ error: true });
          }
          resolve({
            error: false,
            userId: output.userId,
          });
        },
      );
    } catch (err) {
      reject(new Error('UserName was not foundInVerifiedList'));
    }
  });
}
async function isUserRegistered(userId) {
  let foundRegisteredUser;
  try {
    const usersModel = database_1.database.users;
    foundRegisteredUser = await usersModel.findByPk(userId);
    if (foundRegisteredUser)
      return {
        found: true,
        error: 'Users is already Registered',
      };
    else return { found: false };
  } catch (e) {
    console.log('ERROR', e);
    return {
      found: false,
      error: 'An Error occurred',
    };
  }
}
async function emailIsInUse(email) {
  let foundRegisteredUser;
  try {
    const usersModel = database_1.database.users;
    foundRegisteredUser = await usersModel.findOne({ where: { email: email } });
    if (foundRegisteredUser)
      return {
        found: true,
        error: 'This email is already in use!',
        user: foundRegisteredUser,
      };
    else return { found: false };
  } catch (e) {
    console.log('ERROR', e);
    return {
      found: false,
      error: 'An Error occurred',
    };
  }
}
function createVerifyTokenForRegistration(res, userName, generatedCode, userId) {
  const token = jsonwebtoken_1.default.sign(
    {
      userName: userName,
      generatedCode: generatedCode,
      userId: userId,
      isRegistrationProcess: true,
    },
    process.env.JWT_TOKEN || '',
    {
      expiresIn: '90d',
    },
  );
  const cookieOptions = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  res.cookie('__session', token, cookieOptions);
}
function getUserInfo(userId) {
  let headers = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
    Accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'Accept-Language': 'en,en-US;q=0.9',
  };
  return new Promise((resolve, reject) => {
    try {
      request_1.default.get(
        {
          url: 'https://cdn.younow.com/php/api/channel/getInfo/channelId=' + userId,
          headers: headers,
          timeout: 5000,
        },
        (error, response, body) => {
          resolve(JSON.parse(body));
        },
      );
    } catch (err) {
      reject(new Error('UserName was not foundInVerifiedList'));
    }
  });
}
function getVerificationResult(code, userName) {
  return new Promise(async (resolve) => {
    let bio = await getBiography(userName);
    const isInBio = checkCode(bio, code);
    resolve(isInBio);
  });
}
async function checkCode(bio, code) {
  return bio.includes(code.toString());
}
async function getBiography(userName) {
  return new Promise((resolve, reject) => {
    let headers = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'Accept-Language': 'en,en-US;q=0.9',
    };
    try {
      request_1.default.get(
        {
          url:
            'https://cdn.younow.com/php/api/channel/getInfo/includeUserKeyWords=1/user=' + userName,
          headers: headers,
          timeout: 5000,
        },
        (error, response, body) => {
          resolve(JSON.parse(body).description);
        },
      );
    } catch (err) {
      reject(new Error(err));
    }
  });
}
function getVerifyToken(req, res) {
  let token = parseCookies(req).__session;
  if (token == null) {
    return res.render('register');
  }
  let decoded = (0, jwt_decode_1.default)(token);
  if (!decoded.userName || !decoded.generatedCode || !decoded.userId) {
    return res.render('register');
  }
  return {
    userName: decoded.userName,
    generatedCode: decoded.generatedCode,
    userId: decoded.userId,
  };
}
function loginAndCreateCookie(userId, res, page = '') {
  const token = jsonwebtoken_1.default.sign(
    {
      userId: userId.toString(),
    },
    process.env.JWT_TOKEN || '',
    {
      expiresIn: '90d',
    },
  );
  const cookieOptions = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  res.cookie('__session', token, cookieOptions);
  res.status(200).redirect(`/${page}`);
}
async function createSettings(userId) {
  try {
    const toolSettingsModel = database_1.database.toolSettings;
    const toolSettings = toolSettingsModel.build({ userId });
    await toolSettings.save();
    return {
      error: false,
      toolSettings,
    };
  } catch (e) {
    console.log('ERROR', e);
    return {
      error: true,
      message: 'Failed Creating User data',
    };
  }
}
async function createToolInfos(userId) {
  try {
    const toolSettingsModel = database_1.database.toolInfos;
    const toolInfos = toolSettingsModel.build({ userId });
    await toolInfos.save();
    return {
      error: false,
      toolInfos,
    };
  } catch (e) {
    console.log('ERROR', e);
    return {
      error: true,
      message: 'Failed Creating User data',
    };
  }
}
async function createUser(email, iv, content, userId, userName) {
  try {
    const usersModel = database_1.database.users;
    const newUser = usersModel.build({
      email,
      iv,
      content,
      userId,
      userName,
    });
    await newUser.save();
    return {
      error: false,
      newUser,
    };
  } catch (e) {
    console.log('ERROR', e);
    return {
      error: true,
      message: 'Failed Creating User data',
    };
  }
}
function parseCookies(request) {
  let list = {},
    rc = request.headers.cookie;
  rc &&
    rc.split(';').forEach(function (cookie) {
      let parts = cookie.split('=');
      list[parts.shift().trim()] = decodeURI(parts.join('='));
    });
  return list;
}
//# sourceMappingURL=auth.js.map
