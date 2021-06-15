var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bodyParser = require("body-parser");
var cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var itemRouter = require("./routes/item");
var imagesRouter = require("./routes/images");

var app = express();

app.use(cors({ origin: "http://localhost:5000", credentials: true }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/", indexRouter);
app.use("/api/users/", usersRouter);
app.use("/api/item/", itemRouter);
app.use("/api/images", imagesRouter);

module.exports = app;
