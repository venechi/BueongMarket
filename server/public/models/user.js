const db = require("../utils/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

var User = {
  addNewUSer() {
    var user = this;
    if (!user.isModified("password")) return next();
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
      });
    });
  },

  comparePassword(plainPassword, cb) {
    bcrypt.compare(plainPassword, this.password, cb);
  },

  generateToken(cb) {
    var user = this;
    user.token = jwt.sign(user._id.toHexString(), "secretToken");
    user.save(function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  },

  findByToken(token, cb) {
    var user = this;
    jwt.verify(token, "secretToken", function (err, decoded) {
      if (err) return cb(err);
      user.findOne({ _id: decoded, token: token }, cb);
    });
  },
};

module.exports = User;
