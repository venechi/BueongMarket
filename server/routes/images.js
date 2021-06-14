var express = require("express");
var router = express.Router();
var path = require("path");

const route = router.get(
  "/:userId/:itemId/:fileName",
  function (req, res, next) {
    const userId = req.params.userId;
    const itemId = req.params.itemId;
    const fileName = req.params.fileName;
    res.sendFile(
      path.resolve(
        `${__dirname}/../public/fileserver/${userId}/${itemId}/${fileName}`
      )
    );
  }
);

module.exports = router;
