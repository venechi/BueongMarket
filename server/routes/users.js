var express = require("express");
const User = require("../public/models/user");
var router = express.Router();
const { auth } = require("./../public/middleware/auth");

router.post("/register", function (req, res, next) {
  User.addNewUser(
    {
      id: req.body.id,
      pw: req.body.pw,
      name: req.body.name,
      nickname: req.body.nickname,
    },
    (result) => {
      res.json(result);
    }
  );
});

router.post("/checkid", function (req, res, next) {
  User.checkEmail(req.body.email, (result) => {
    res.json(result);
  });
});

router.post("/checknickname", function (req, res, next) {
  User.checkNickname(req.body.nickname, (result) => {
    res.json(result);
  });
});

router.post("/login", function (req, res, next) {
  User.login(req.body.id, req.body.pw, (result) => {
    res.cookie("x_auth", result.user.token).json(result);
  });
});

router.get("/logout", function (req, res, next) {
  let token = req.cookies.x_auth;
  User.logout(token, (result) => {
    res.clearCookie("x_auth").json(result);
  });
});

router.get("/auth", auth, function (req, res, next) {
  res.json({
    isAuth: true,
    id: req.user.id,
    name: req.user.name,
    nickname: req.user.nickname,
  });
});

module.exports = router;
