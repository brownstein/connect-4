"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const pug = require("pug");
const pino = require("pino");
const morgan = require("morgan");
const setupGameRoutes = require("./game.js");

const app = express();
const logger = pino();

app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(function (req, res, next) {
  req.log = logger;
  next();
});

setupGameRoutes(app);

app.get("/", function (req, res) {
  const html = pug.renderFile("./server/templates/index.pug", {});
  res.status(200).send(html);
});

app.use(express.static("dist"));

app.listen(8080, function() {
  logger.info("connect-4 server listening on port 8080");
});
