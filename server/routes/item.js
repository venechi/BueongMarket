var express = require("express");
var router = express.Router();
var db = require("../public/utils/db");
const { auth } = require("../public/middleware/auth");
var multer = require("multer");
var upload = multer({ limits: { fieldSize: 25 * 1024 * 1024 } });
var fs = require("fs");
const sharp = require("sharp");
const sanitizeHtml = require("sanitize-html");
const { resolve } = require("path");

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

  const thumbnailWidth = 640,
    thumbnailHeight = 640,
    imageWidth = 1920,
    imageHeight = 1920;

  const item = JSON.parse(req.body.item);
  item.title = sanitizeHtml(item.title);
  item.content = sanitizeHtml(item.content);
  if (item.itemID === "new") {
    //새 글 작성
    db.query(
      `INSERT INTO item(title, price, loc, reg_date, exp_date, id_code, item_class) VALUES('${item.title}', ${item.price}, '서울시 동대문구 이문동', now(), '${item.exp_date}', ${userID}, ${item.item_class});`,
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
        let path = `public/fileserver/${userID}/${item.itemID}/`;
        db.query(
          `INSERT INTO content(id, content) VALUES(${item.itemID}, '${item.content}')`,
          (error, result, fields) => {
            if (error) {
              deleteItem(userID, item.itemID, () => {
                return res.json({ isUpdateSuccess: false });
              });
            }
            if (files) {
              fs.mkdirSync(`public/fileserver/${userID}/${item.itemID}`, {
                recursive: true,
              });
              Promise.all(
                files.map((file) => {
                  return new Promise((resolve, reject) => {
                    sharp(Buffer.from(file.thumbUrl.split(",")[1], "base64"))
                      .resize(imageWidth, imageHeight, "!")
                      .toBuffer((err, buffer, info) => {
                        if (err) reject(err);
                        else resolve({ buffer: buffer, name: file.name });
                      });
                  });
                })
              )
                .then((files) => {
                  Promise.all(
                    files.map((file) => {
                      return new Promise((resolve, reject) => {
                        fs.writeFile(
                          `${path}/${file.name}`,
                          file.buffer,
                          { flag: "w" },
                          (err) => {
                            db.query(
                              `INSERT INTO photos VALUES(${item.itemID}, "${file.name}");`,
                              (error, results, fields) => {
                                if (err || error) {
                                  reject(err);
                                } else resolve(true);
                              }
                            );
                          }
                        );
                      });
                    })
                  )
                    .then(() => {
                      db.query(
                        `SELECT * FROM photos WHERE id=${item.itemID}`,
                        (error, results, fields) => {
                          if (error) {
                            deleteItem(userID, item.itemID, () => {
                              return res.json({ isUpdateSuccess: false });
                            });
                          }
                          fs.mkdirSync(path + "thumbnail");
                          sharp(path + results[0].filename)
                            .resize(thumbnailWidth, thumbnailHeight, "!")
                            .toFile(
                              path + "thumbnail/thumbnail.jpg",
                              (err, info) => {
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
                              }
                            );
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
            } else
              return res.json({ isUpdateSuccess: true, itemId: item.itemID });
          }
        );
      }
    );
  } else {
    //글 수정
    let itemID = item.itemID;
    db.query(
      `SELECT * FROM item WHERE id=${itemID}`,
      (error, results, fields) => {
        if (error || results.length === 0)
          return res.json({ isUpdateSuccess: false });
        db.query(
          `UPDATE item SET title='${item.title}', price=${item.price}, exp_date='${item.exp_date}', item_class=${item.item_class} WHERE id=${itemID}`,
          (error, results, fields) => {
            if (error) return res.json({ isUpdateSuccess: false });
            db.query(
              `UPDATE content SET content='${item.content}' WHERE id=${itemID}`,
              (error, results, fields) => {
                if (error) return res.json({ isUpdateSuccess: false });
                if (!files)
                  return res.json({
                    isUpdateSuccess: true,
                    itemId: itemID,
                  });

                let toPreserve = files
                  .map((file) => {
                    if (file.status) return file.name;
                  })
                  .filter((e) => e);

                let newFiles = files
                  .map((file) => {
                    if (!file.status)
                      return { name: file.name, thumbUrl: file.thumbUrl };
                  })
                  .filter((e) => e);

                let path = `public/fileserver/${userID}/${itemID}/`;

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
                    let tasks = [Promise.resolve(true)];

                    tasks.concat(
                      toDelete.map((filename) => {
                        return new Promise((resolve, reject) => {
                          fs.rmSync(
                            `public/fileserver/${userID}/${itemID}/${filename}`,
                            { force: true }
                          );
                          db.query(
                            `DELETE FROM photos WHERE id=${itemID} AND filename='${filename}'`,
                            (error, results, fields) => {
                              if (error) reject(false);
                              else resolve(true);
                            }
                          );
                        });
                      })
                    );

                    Promise.all(tasks)
                      .then(() => {
                        Promise.all(
                          newFiles.map((file) => {
                            return new Promise((resolve, reject) => {
                              sharp(
                                Buffer.from(
                                  file.thumbUrl.split(",")[1],
                                  "base64"
                                )
                              )
                                .resize(imageWidth, imageHeight, "!")
                                .toBuffer((err, buffer, info) => {
                                  if (err) reject(err);
                                  else
                                    resolve({
                                      buffer: buffer,
                                      name: file.name,
                                    });
                                });
                            });
                          })
                        )
                          .then((files) => {
                            Promise.all(
                              files.map((file) => {
                                return new Promise((resolve, reject) => {
                                  fs.writeFile(
                                    `${path}/${file.name}`,
                                    file.buffer,
                                    { flag: "w" },
                                    (err) => {
                                      db.query(
                                        `INSERT INTO photos VALUES(${item.itemID}, "${file.name}");`,
                                        (error, results, fields) => {
                                          if (err || error) {
                                            reject(err);
                                          } else resolve(true);
                                        }
                                      );
                                    }
                                  );
                                });
                              })
                            )
                              .then(() => {
                                db.query(
                                  `SELECT * FROM photos WHERE id=${item.itemID}`,
                                  (error, results, fields) => {
                                    if (error)
                                      return res.json({
                                        isUpdateSuccess: false,
                                      });
                                    fs.rmSync(
                                      path + "thumbnail/thumbnail.jpg",
                                      {
                                        force: true,
                                      }
                                    );
                                    if (results.length === 0)
                                      return res.json({
                                        isUpdateSuccess: true,
                                        itemId: itemID,
                                      });
                                    fs.mkdirSync(path + "thumbnail", {
                                      recursive: true,
                                    });
                                    sharp(path + results[0].filename)
                                      .resize(
                                        thumbnailWidth,
                                        thumbnailHeight,
                                        "!"
                                      )
                                      .toFile(
                                        path + "thumbnail/thumbnail.jpg",
                                        (err, info) => {
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
                          })
                          .catch(() => {
                            return res.json({ isUpdateSuccess: false });
                          });
                      })
                      .catch(() => {
                        return res.json({ isUpdateSuccess: false });
                      });
                  }
                );
              }
            );
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
