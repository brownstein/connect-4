"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const pug = require("pug");
const pino = require("pino");
const morgan = require("morgan");
const setupGameRoutes = require("./game.js");

const app = express();
const logger = pino();

// accept JSON requests
app.use(bodyParser.json());

// use a simple logger for request logging
app.use(morgan("tiny"));

// provide a logger for structured logs
// ideally this would only use structured logs, but I'm in a hurry for this
// challenge
app.use(function (req, res, next) {
  req.log = logger;
  next();
});

// set up API routes for game
setupGameRoutes(app);

// serve template and static assets
app.get("/", function (req, res) {
  const html = pug.renderFile("./server/templates/index.pug", {});
  res.status(200).send(html);
});
app.use(express.static("dist"));

// listen on a hard-coded port - would normally make this configurable
app.listen(8080, function() {
  logger.info("connect-4 server listening on port 8080");
});
