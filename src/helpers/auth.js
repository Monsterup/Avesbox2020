const { sign } = require ('jsonwebtoken');

exports.createAccessToken = (user) => {
  return sign({userId: user._id}, process.env.APP_KEY, {
    expiresIn: "1d"
  });
}

exports.createRefreshToken = (user) => {
  return sign(
  {userId: user._id, tokenVersion: user.tokenVersion}, 
  process.env.APP_REFRESH_KEY, 
  {
    expiresIn: "7d"
  });
}