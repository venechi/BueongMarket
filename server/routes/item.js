var express = require("express");
var router = express.Router();
var db = require("../public/utils/db");
const { auth } = require("../public/middleware/auth");

//새 아이템 등록
router.post("/newItem", auth, function (req, res, next) {
  //todo: 인증 추가
});

//아이템 삭제
router.get("/deleteItem/:itemId", auth, function (req, res, next) {
  //todo: 인증 추가
  var id = req.params.itemId;
  if (isNaN(parseInt(id, 10)))
    return res.status("500").json({ reason: "Id must be a number" });
});

//아이템 업데이트
router.post("/updateItem/:itemId", auth, function (req, res, next) {
  //todo: 인증 추가
  var id = req.params.itemId;
  if (isNaN(parseInt(id, 10)))
    return res.status("500").json({ reason: "Id must be a number" });
});

//아이템 정보 요청
router.get("/:itemId", function (req, res, next) {
  var id = req.params.itemId;
  if (isNaN(parseInt(id, 10)))
    return res.status(500).json({ reason: "Id must be a number" });
  db.query(
    `SELECT * FROM item, content WHERE item.id = ${id} AND content.id = ${id}`,
    function (error, results, fields) {
      if (error) res.status(500).json(error);
      if (results.length === 0) res.status(404);
      db.query(
        `SELECT * FROM photos WHERE id = ${id}`,
        function (error, photos, fields) {
          if (error) res.status(500).json(error);
          res.json({ item: results[0], photoList: photos });
        }
      );
    }
  );
});

module.exports = router;
