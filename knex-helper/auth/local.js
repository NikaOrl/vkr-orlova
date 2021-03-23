const moment = require('moment');
const jwt = require('jwt-simple');
const TOKEN_SECRET = require('../../env/token.config');

function encodeToken(user) {
  const playload = {
    exp: moment().add(14, 'days').unix(),
    iat: moment().unix(),
    sub: user,
  };
  return jwt.encode(playload, TOKEN_SECRET);
}

function decodeToken(token, callback) {
  const payload = jwt.decode(token, TOKEN_SECRET);
  const now = moment().unix();
  // check if the token has expired
  if (now > payload.exp) callback('Token has expired.');
  else callback(null, payload);
}

module.exports = {
  encodeToken,
  decodeToken,
};
