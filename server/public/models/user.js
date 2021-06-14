const db = require("../utils/db");
const bcrypt = require("bcrypt");
var randomToken = require("random-token").create("jasfoiwe2#@$)(T#GJAS nlj");
const saltRounds = 10;

var User = {
  login(id, plainPassword, cb) {
    db.query(
      `SELECT * FROM users WHERE id="${id}"`,
      function (error, results, fields) {
        if (error)
          return cb({
            loginSuccess: false,
            error: true,
          });
        if (results.length === 0)
          return cb({
            loginSuccess: false,
            error: "invalid ID",
          });
        let user = results[0];
        bcrypt.compare(plainPassword, user.pw, (error, same) => {
          if (error)
            return cb({
              loginSuccess: false,
              error: true,
            });
          if (!same)
            return cb({
              loginSuccess: false,
              error: "invalid PW",
            });
          else {
            db.query(
              `SELECT * FROM login_users WHERE id_code = ${user.id_code}`,
              (error, results, fileds) => {
                if (error)
                  return cb({
                    loginSuccess: false,
                    error: true,
                  });
                if (results.length === 0) {
                  var token = randomToken(32);
                  db.query(
                    `INSERT INTO login_users VALUES (${user.id_code}, "${token}")`,
                    (error, results, fields) => {
                      if (error)
                        return cb({
                          loginSuccess: false,
                          error: true,
                        });
                      return cb({
                        token: token,
                        payload: {
                          loginSuccess: true,
                          user: {
                            id_code: user.id_code,
                            id: user.id,
                            name: user.name,
                            nickname: user.nickname,
                          },
                        },
                      });
                    }
                  );
                } else {
                  return cb({
                    token: results[0].token,
                    payload: {
                      loginSuccess: true,
                      user: {
                        id_code: user.id_code,
                        id: user.id,
                        name: user.name,
                        nickname: user.nickname,
                      },
                    },
                  });
                }
              }
            );
          }
        });
      }
    );
  },

  logout(token, cb) {
    if (!token) return cb({ logoutSuccess: false, error: "invalid token" });
    db.query(
      `DELETE FROM login_users WHERE token="${token}"`,
      (error, results, fields) => {
        if (error)
          return cb({
            logoutSuccess: false,
            error,
          });
        return cb({
          logoutSuccess: true,
        });
      }
    );
  },

  addNewUser(user, cb) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err)
        return cb({
          registerSuccess: false,
        });
      bcrypt.hash(user.pw, salt, function (err, hash) {
        if (err)
          return cb({
            registerSuccess: false,
          });
        user.pw = hash;
        db.query(
          `INSERT INTO users (id, pw, name, nickname) VALUES ("${user.id}", "${user.pw}", "${user.name}", "${user.nickname}")`,
          (error, results, fields) => {
            if (error)
              return cb({
                registerSuccess: false,
              });
            return cb({
              registerSuccess: true,
            });
          }
        );
      });
    });
  },

  checkEmail(email, cb) {
    db.query(
      `SELECT * FROM users WHERE id="${email}"`,
      (error, results, fields) => {
        if (error)
          return cb({
            isVaildID: false,
          });
        return cb({ isVaildID: results.length === 0 });
      }
    );
  },

  checkNickname(nickname, cb) {
    db.query(
      `SELECT * FROM users WHERE nickname="${nickname}"`,
      (error, results, fields) => {
        if (error)
          return cb({
            isVaildNickname: false,
          });
        return cb({ isVaildNickname: results.length === 0 });
      }
    );
  },

  findByToken(token, cb) {
    db.query(
      `SELECT * FROM login_users WHERE token="${token}"`,
      (error, results, fileds) => {
        if (error) return cb(null);
        if (results.length === 0) return cb(null);
        else {
          db.query(
            `SELECT * FROM users WHERE id_code=${results[0].id_code}`,
            (error, results, fileds) => {
              if (error) return cb(null);
              return cb(results[0]);
            }
          );
        }
      }
    );
  },
};

module.exports = User;
