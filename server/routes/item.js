var express = require("express");
var router = express.Router();
var db = require("../public/utils/db");
const { auth } = require("../public/middleware/auth");
var multer = require("multer");
var upload = multer();
var fs = require("fs");
const sharp = require("sharp");

const deleteItem = (userID, itemID, cb) => {
  fs.rmdir(
    `public/fileserver/${userID}/${itemID}`,
    { recursive: true },
    (err) => {
      db.query(
        `DELETE FROM photos WHERE id=${itemID}`,
        (error1, results, fields) => {
          db.query(
            `DELETE FROM content WHERE id=${itemID}`,
            (error2, results, fields) => {
              db.query(
                `DELETE FROM item WHERE id=${itemID}`,
                (error3, results, fields) => {
                  return cb(err || error1 || error2 || error3);
                }
              );
            }
          );
        }
      );
    }
  );
};

//아이템 삭제
router.get("/delete/:itemId", auth, function (req, res) {
  var itemID = req.params.itemId;
  var userID = req.user.id_code;
  db.query(
    `SELECT * FROM item WHERE id=${itemID}`,
    (error, results, fields) => {
      if (results.length === 0 || results[0].id_code !== userID)
        return res.json({ isDeleteSuccess: false });
      deleteItem(userID, itemID, (err) => {
        return res.json({ isDeleteSuccess: err ? false : true });
      });
    }
  );
});

//아이템 추가 혹은 업데이트
router.post("/update", auth, upload.array(), function (req, res) {
  var userID = req.user.id_code;
  var files = req.body.files;
  if (files) {
    if (Array.isArray(files)) files = files.map((file) => JSON.parse(file));
    else files = [JSON.parse(files)];
  }
  const item = JSON.parse(req.body.item);
  if (item.itemID === "new") {
    //새 글 작성
    db.query(
      `INSERT INTO item(title, price, loc, reg_date, exp_date, id_code) VALUES('${item.title}', ${item.price}, '서울시 동대문구 이문동', now(), '${item.exp_date}', ${userID});`,
      (error, results, fields) => {
        if (error) {
          db.query(
            `DELETE FROM item WHERE title='${item.title}' AND id_code=${userID}`,
            (error, results, fields) => {
              return res.json({ isUpdateSuccess: false });
            }
          );
        }
        item.itemID = results.insertId;
        db.query(
          `INSERT INTO content(id, content) VALUES(${item.itemID}, '${item.content}')`,
          (error, result, fields) => {
            if (error) {
              deleteItem(userID, item.itemID, () => {
                return res.json({ isUpdateSuccess: false });
              });
            }
            if (files)
              fs.mkdir(
                `public/fileserver/${userID}/${item.itemID}`,
                { recursive: true },
                (err, path) => {
                  if (err) {
                    deleteItem(userID, item.itemID, () => {
                      return res.json({ isUpdateSuccess: false });
                    });
                  }
                  Promise.all(
                    files.map((file) => {
                      fs.writeFile(
                        `${path}/${file.name}`,
                        file.thumbUrl.replace(/^data:image\/png;base64,/, ""),
                        "base64",
                        (err) =>
                          new Promise((resolve, reject) => {
                            if (err) reject(err);
                            else resolve(true);
                          })
                      );
                    })
                  )
                    .then(() => {
                      Promise.all(
                        files.map((file) => {
                          db.query(
                            `INSERT INTO photos VALUES(${item.itemID}, "${file.name}");`,
                            (error, results, fields) => {
                              return new Promise((resolve, reject) => {
                                if (error) reject(error);
                                else resolve(true);
                              });
                            }
                          );
                        })
                      )
                        .then(() => {
                          db.query(
                            `SELECT * FROM photos WHERE id=${item.itemID}`,
                            (error, results, fields) => {
                              let path = `public/fileserver/${userID}/${item.itemID}/`;
                              sharp(path + results[0].filename)
                                .resize(300, 300, "!")
                                .toFile(path + "thumbnail.jpg", (err, info) => {
                                  //todo: 섬네일 경로 재지정할것(사용자가 tumbnail.jpg를 업로드해도 정상작동하도록)
                                  if (err) {
                                    deleteItem(userID, item.itemID, () => {
                                      return res.json({
                                        isUpdateSuccess: false,
                                      });
                                    });
                                  } else
                                    return res.json({
                                      isUpdateSuccess: true,
                                      itemId: item.itemID,
                                    });
                                });
                            }
                          );
                        })
                        .catch(() => {
                          deleteItem(userID, item.itemID, () => {
                            return res.json({ isUpdateSuccess: false });
                          });
                        });
                    })
                    .catch(() => {
                      deleteItem(userID, item.itemID, () => {
                        return res.json({ isUpdateSuccess: false });
                      });
                    });
                }
              );
            else
              return res.json({ isUpdateSuccess: true, itemId: item.itemID });
          }
        );
      }
    );
  } else {
    let toPreserve = files
      .map((file) => {
        if (file.status) return file.name;
      })
      .filter((e) => e);
    let newFiles = files
      .map((file) => {
        if (!file.status) return { name: file.name, thumbUrl: file.thumbUrl };
      })
      .filter((e) => e);

    let itemID = item.itemID;
    db.query(
      `SELECT * FROM item WHERE id=${itemID}`,
      (error, results, fields) => {
        if (error || results.length === 0)
          return res.json({ isUpdateSuccess: false });
        db.query(
          `SELECT * FROM photos WHERE id=${itemID}`,
          (error, results, fields) => {
            if (error) return res.json({ isUpdateSuccess: false });
            let toDelete = results.map((result) => {
              return result.filename;
            });
            for (let i = 0; i < toPreserve.length; ++i) {
              let pos = toDelete.indexOf(toPreserve[i]);
              if (pos !== -1) toDelete.splice(pos, 1);
            }
            Promise.all(
              toDelete.length !== 0
                ? toDelete.map((filename) => {
                    fs.rm(
                      `public/fileserver/${userID}/${itemID}/${filename}`,
                      (fserr) => {
                        return db.query(
                          `DELETE FROM photos WHERE id=${itemID} AND filename='${filename}'`,
                          (error, results, fields) => {
                            return new Promise((resolve, reject) => {
                              if (fserr || error) reject(false);
                              else resolve(true);
                            });
                          }
                        );
                      }
                    );
                  })
                : [
                    new Promise((resolve, reject) => {
                      resolve(true);
                    }),
                  ]
            )
              .then(() => {
                db.query(
                  `UPDATE item SET title='${item.title}', price=${item.price}, exp_date='${item.exp_date}' WHERE id=${itemID}`,
                  (error, results, fields) => {
                    if (error) return res.json({ isUpdateSuccess: false });
                    db.query(
                      `UPDATE content SET content='${item.content}' WHERE id=${itemID}`,
                      (error, results, fields) => {
                        if (error) return res.json({ isUpdateSuccess: false });
                        let path = `public/fileserver/${userID}/${itemID}/`;
                        Promise.all(
                          newFiles.length !== 0
                            ? newFiles.map((file) => {
                                fs.writeFile(
                                  `${path}/${file.name}`,
                                  file.thumbUrl.replace(
                                    /^data:image\/png;base64,/,
                                    ""
                                  ),
                                  "base64",
                                  (fserr) => {
                                    return db.query(
                                      `INSERT INTO photos VALUES(${itemID}, "${file.name}");`,
                                      (error, results, fields) => {
                                        return new Promise(
                                          (resolve, reject) => {
                                            if (fserr || error) reject(false);
                                            else resolve(true);
                                          }
                                        );
                                      }
                                    );
                                  }
                                );
                              })
                            : [
                                new Promise((resolve, reject) => {
                                  resolve(true);
                                }),
                              ]
                        )
                          .then(() => {
                            if (
                              toDelete.length === 0 &&
                              newFiles.length === 0
                            )
                              return res.json({
                                isUpdateSuccess: true,
                                itemId: itemID,
                              });
                            else
                              db.query(
                                `SELECT * FROM photos WHERE id=${item.itemID}`,
                                (error, results, fields) => {
                                  if (error)
                                    return res.json({ isUpdateSuccess: false });
                                  fs.rmSync(path + "thumbnail.jpg", {
                                    force: true,
                                  });
                                  sharp(path + results[0].filename)
                                    .resize(300, 300, "!")
                                    .toFile(
                                      path + "thumbnail.jpg",
                                      (err, info) => {
                                        //todo: 섬네일 경로 재지정할것(사용자가 tumbnail.jpg를 업로드해도 정상작동하도록)
                                        if (err)
                                          return res.json({
                                            isUpdateSuccess: false,
                                          });
                                        else
                                          return res.json({
                                            isUpdateSuccess: true,
                                            itemId: itemID,
                                          });
                                      }
                                    );
                                }
                              );
                          })
                          .catch(() => {
                            return res.json({ isUpdateSuccess: false });
                          });
                      }
                    );
                  }
                );
              })
              .catch(() => {
                return res.json({ isUpdateSuccess: false });
              });
          }
        );
      }
    );
  }
});

//아이템 정보 요청
router.get("/:itemId", function (req, res) {
  var id = req.params.itemId;
  if (isNaN(parseInt(id, 10))) return res.json({ isSuccess: false });
  db.query(
    `SELECT * FROM item, content WHERE item.id = ${id} AND content.id = ${id}`,
    function (error, results, fields) {
      if (error) return res.json({ isSuccess: false });
      if (results.length === 0) return res.json({ isSuccess: false });
      db.query(
        `SELECT * FROM photos WHERE id = ${id}`,
        function (error, photos, fields) {
          if (error) return res.json({ isSuccess: false });
          return res.json({
            isSuccess: true,
            item: results[0],
            photoList: photos,
          });
        }
      );
    }
  );
});

module.exports = router;
