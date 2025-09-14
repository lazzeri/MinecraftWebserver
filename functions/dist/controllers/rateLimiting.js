'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.startRateLimitDataCollector = exports.minuteRateLimiterMiddleware = void 0;
const rate_limiter_flexible_1 = require('rate-limiter-flexible');
const database_1 = require('./database');
const io = __importStar(require('@pm2/io'));
const request_1 = __importDefault(require('request'));
let requestPer10Minutes = 0;
let requestPerMinute = 0;
let requestNames = {};
let requestPer10MinuteArray = [];
let requestPerMinuteArray = [];
const averageRequestPer10MinuteMetric = io.metric({
  name: 'Avg. requests per 10 Minutes',
  id: 'streamnow/realtime/requestPer10MinuteAvg',
});
const requestPer10MinutesMetric = io.metric({
  name: 'Requests Per 10 Minutes',
  id: 'streamnow/realtime/requestPer10Minute',
});
const averageRequestPerMinuteMetric = io.metric({
  name: 'Avg.Requests Per Minute',
  id: 'streamnow/realtime/ratePerMinuteAvg',
});
const requestPerMinuteMetric = io.metric({
  name: 'Requests Per Minute',
  id: 'streamnow/realtime/ratePerMinute',
});
const startRateLimitDataCollector = function () {
  setInterval(
    function () {
      requestPer10MinuteArray.push(requestPer10Minutes);
      averageRequestPer10MinuteMetric.set(average(requestPer10MinuteArray));
      database_1.database.uploadData('ratesTracking', {
        requestPer10Minutes,
        requestNames: JSON.stringify(requestNames),
        avgRequestPerMinute: average(requestPerMinuteArray),
        avgRequestPer10Minute: average(requestPer10MinuteArray),
      });
      requestPer10Minutes = 0;
      requestNames = {};
    },
    1000 * 60 * 60,
  );
  setInterval(function () {
    requestPerMinuteArray.push(requestPerMinute);
    averageRequestPerMinuteMetric.set(average(requestPerMinuteArray));
    requestPerMinute = 0;
  }, 1000 * 60);
};
exports.startRateLimitDataCollector = startRateLimitDataCollector;
const minuteOptions = {
  points: 3000,
  duration: 60,
};
const minute10Options = {
  points: 15000,
  duration: 600,
};
const minutesLimiter = new rate_limiter_flexible_1.RateLimiterMemory(minuteOptions);
const minutes10Limiter = new rate_limiter_flexible_1.RateLimiterMemory(minute10Options);
const minuteRateLimiterMiddleware = (req, res, next) => {
  minutesLimiter
    .consume(req.originalUrl.split('?')[0], 1)
    .then(() => {
      addRequest(req);
    })
    .catch((_) => {
      addRequest(req);
      let ip = req.headers['cf-connecting-ip'] || req.socket.remoteAddress;
      console.log('To Many Requests at: ', req.originalUrl, ip);
      res.status(429).send('Too Many Requests');
      sendAlert(
        'To many Requests per Minute',
        'To Many Requests at: ' + req.originalUrl + '          ' + ip,
      );
    });
  minutes10Limiter
    .consume('overall', 1)
    .then(() => {
      next();
    })
    .catch((_) => {
      let ip = req.headers['cf-connecting-ip'] || req.socket.remoteAddress;
      console.log('To Many Requests for 10 Minutes at: ', req.originalUrl, ip);
      sendAlert(
        'To many Requests per 10 Minutes',
        'To Many Requests at: ' + req.originalUrl + '          ' + ip,
      );
      res.status(429).send('Too Many Requests');
    });
};
exports.minuteRateLimiterMiddleware = minuteRateLimiterMiddleware;
function addRequest(req) {
  requestPerMinute++;
  requestPer10Minutes++;
  if (req.originalUrl.includes('getYnData')) {
    addToRequestNames('/getYnData/' + req.query.cid);
  } else addToRequestNames(req.originalUrl.split('?')[0]);
  requestPer10MinutesMetric.set(requestPer10Minutes);
  requestPerMinuteMetric.set(requestPerMinute);
}
function addToRequestNames(name) {
  if (requestNames.hasOwnProperty(name)) requestNames[name]++;
  else requestNames[name] = 1;
}
function average(array) {
  return array.reduce((a, b) => a + b) / array.length;
}
function getUserIdFromRequest(string) {
  const urlParams = new URLSearchParams(string);
  return urlParams.get('url');
}
function sendAlert(title, message) {
  let headers = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
    Accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'Accept-Language': 'en,en-US;q=0.9',
  };
  const setUrl =
    'https://wirepusher.com/send?id=p9T8mpsFT&title=' +
    title +
    '+&message=' +
    message +
    '&type=Default';
  try {
    request_1.default.get(
      { url: setUrl, headers: headers, timeout: 5000 },
      (error, response, body) => {},
    );
  } catch (err) {
    console.log('Error', err);
  }
}
//# sourceMappingURL=rateLimiting.js.map
