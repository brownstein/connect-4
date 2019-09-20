"use strict";
const express = require("express");
const pug = require("pug");
const pino = require("pino");

const app = express();
const logger = pino();

app.get("/", function (req, res) {
  const html = pug.renderFile("./server/templates/index.pug", {});
  res.status(200).send(html);
});

app.use(express.static("dist"));

app.listen(8080, function() {
  logger.info("connect-4 server listening on port 8080");
});
