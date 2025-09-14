'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.sendBlackJackTrackingData =
  exports.sendHorseRaceTracking =
  exports.addPinkoTracking =
  exports.sendCasinoTracking =
  exports.addMusicQuizTracking =
  exports.sendJackpotTracking =
  exports.uploadPollTracking =
  exports.uploadGiveawayTracking =
    void 0;
const userIdVerifier_1 = require('./userIdVerifier');
const database_1 = require('./database');
const uploadGiveawayTracking = async (req, res) => {
  const { userId } = await (0, userIdVerifier_1.getUserIdFromToken)(req);
  if (!userId) {
    return res.status(400).send({
      error: true,
      message: 'Error in userId',
    });
  }
  const { data } = req.body;
  let result = await database_1.database.uploadData('giveawayAnalytics', data);
  if (result.error) {
    return res.status(400).send({
      error: true,
      message: result.message,
    });
  }
  return res.status(200).send({
    error: false,
    message: result.message,
  });
};
exports.uploadGiveawayTracking = uploadGiveawayTracking;
const uploadPollTracking = async (req, res) => {
  const { userId } = await (0, userIdVerifier_1.getUserIdFromToken)(req);
  if (!userId) {
    return res.status(400).send({
      error: true,
      message: 'Error in userId',
    });
  }
  let body = req.body;
  if (!body.broadcastId || !body.hasOwnProperty('viewCount'))
    return res.status(400).send({
      error: true,
      message: 'No broadcastId or viewCount',
    });
  let data = {
    broadcastId: body.broadcastId,
    userId: userId,
    pollName: body.question,
    levelRequired: body.minLvl,
    subscriberRequired: body.pollIsSub,
    pollDuration: body.voteDuration,
    numOfItems: body.answersSize,
    viewCount: body.viewCount,
    answerCount: body.totalVotes,
    usesRating: body.useRating ? 1 : 0,
    bestAnswer: body.bestAnswer,
  };
  let result = await database_1.database.uploadData('pollAnalytics', data);
  if (result.error) {
    return res.status(400).send({
      error: true,
      message: result.message,
    });
  }
  return res.status(200).send({
    error: false,
    message: result.message,
  });
};
exports.uploadPollTracking = uploadPollTracking;
const sendJackpotTracking = async (req, res) => {
  const { users } = req.body;
  users.forEach((elem) => {
    const { userId, userName, betAmount, winAmount, winProbability } = elem;
    database_1.database.uploadData('jackpottracking', {
      userId,
      userName,
      betAmount,
      winAmount,
      winProbability,
    });
  });
  return res.status(200).send({
    error: false,
    message: 'should be fine lol',
  });
};
exports.sendJackpotTracking = sendJackpotTracking;
const addMusicQuizTracking = async (req, res) => {
  const { userName, rewardUserId, pearlsWin, pearlsBet } = req.body;
  let data = {
    userId: rewardUserId,
    userName,
    pearlsWin,
    pearlsBet,
  };
  let result = await database_1.database.uploadData('musictracking', data);
  if (result.error) {
    return res.status(400).send({
      error: true,
      message: result.message,
    });
  }
  return res.status(200).send({
    error: false,
    message: 'Alles jut',
  });
};
exports.addMusicQuizTracking = addMusicQuizTracking;
const sendCasinoTracking = async (req, res) => {
  const { type, users } = req.body;
  users.forEach((elem) => {
    const { userId, userName, betAmount, betName, winAmount } = elem;
    if (betName.includes('Won')) console.log(elem);
    let amount = type === 'winner' ? winAmount : betAmount;
    database_1.database.uploadData('theocasinotracking', {
      type,
      userId,
      userName,
      betName,
      amount,
    });
  });
  return res.status(200).send({
    error: false,
    message: 'should be fine lol',
  });
};
exports.sendCasinoTracking = sendCasinoTracking;
const addPinkoTracking = async (req, res) => {
  const {
    rewardUserId,
    userName,
    pearlsReward,
    multiplier,
    pearlsBet,
    expectedMultiplier,
    roomName,
    xDropChord,
  } = req.body;
  let data = {
    userId: rewardUserId,
    userName,
    pearlsReward,
    multiplier,
    pearlsBet,
    expectedMultiplier,
    roomName,
    xDropChord,
  };
  if (!xDropChord) {
    console.log('DIDNT DROP 1');
    return res.status(400).send({
      error: false,
      message: 'Unknown Room',
    });
  }
  if (!roomName) {
    console.log('DIDNT DROP 2');
    return res.status(400).send({
      error: false,
      message: 'Unknown Room',
    });
  }
  if (roomName === 'unknown') {
    console.log('DIDNT DROP 3');
    return res.status(400).send({
      error: false,
      message: 'Unknown Room',
    });
  }
  let result = await database_1.database.uploadData('pinkotracking', data);
  if (result.error) {
    return res.status(400).send({
      error: true,
      message: result.message,
    });
  }
  return res.status(200).send({
    error: false,
    message: result.message,
  });
};
exports.addPinkoTracking = addPinkoTracking;
const sendHorseRaceTracking = async (req, res) => {
  const { bets } = req.body;
  bets.forEach((elem) => {
    const { betAmount, name, rewardPosition, userId, winAmount, horseId } = elem;
    database_1.database.uploadData('horseracetracking', {
      userId,
      name,
      rewardPosition,
      betAmount,
      winAmount,
      horseId,
    });
  });
  return res.status(200).send({
    error: false,
    message: 'should be fine lol',
  });
};
exports.sendHorseRaceTracking = sendHorseRaceTracking;
const sendBlackJackTrackingData = async (req, res) => {
  const { roomName, users } = req.body;
  if (!roomName || !users)
    return res.status(400).send({
      error: true,
      message: 'No roomname or users',
    });
  users.forEach((user) => {
    database_1.database.uploadData('blackjacktracking', {
      ...user,
      roomName,
    });
  });
  return res.status(200).send({
    error: false,
    message: 'should be fine lol',
  });
};
exports.sendBlackJackTrackingData = sendBlackJackTrackingData;
//# sourceMappingURL=tracking.js.map
