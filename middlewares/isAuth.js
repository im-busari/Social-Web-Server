const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    const onlyToken = token.slice(7, token.length); // => Bearer [token]
    jwt.verify(onlyToken, 'slay$n', (err, decode) => {
      if (err) {
        return res.status(401).send({ msg: 'Invalid Token' });
      }
      req.user = decode;
      next();
    });
  } else {
    return res.status(401).send({ msg: 'You are unauthorized user.' });
  }
};
