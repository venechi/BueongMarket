const User = require("../models/user");

let auth = (req, res, next) => {
  //인증 처리
  User.findByToken(req.cookies.x_auth ,(result) => {
    if (!result) return res.json({ isAuth: false, error: true });
    req.user = result;
    next();
  });
};

module.exports = { auth };
