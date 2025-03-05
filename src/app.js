// Code taken from https://blog.logrocket.com/ci-cd-node-js-github-actions/
const express = require("express");
const app = express();

app.get("/test", (_req, res) =>  {
  res.status(200).send("Hello world")
})
module.exports = app;
