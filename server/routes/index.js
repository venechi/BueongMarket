var express = require("express");
var router = express.Router();
var SqlString = require("sqlstring");
const { auth } = require("../public/middleware/auth");
var db = require("../public/utils/db");

router.get("/allitem", auth, function (req, res, next) {
  db.query(
    `SELECT * FROM item WHERE id_code=${req.user.id_code} ORDER BY id DESC`,
    (error, results, fields) => {
      if (error) return res.json({ isSuccess: false });
      return res.json(results);
    }
  );
});

router.get("/", function (req, res, next) {
  var query;
  var sqlQuery;
  if (!req.query.query) sqlQuery = "SELECT * FROM item ORDER BY id DESC";
  else {
    query = SqlString.escape(req.query.query);
    query = query.substring(1, query.length - 1);
    sqlQuery = `SELECT * FROM item WHERE title LIKE ${
      "'%" + query + "%'"
    } ORDER BY id DESC`;
  }
  db.query(sqlQuery, function (error, results, fields) {
    if (error) return res.json({ isSuccess: false });
    return res.json(results);
  });
});

module.exports = router;
