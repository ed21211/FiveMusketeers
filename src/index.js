// // Code taken from https://blog.logrocket.com/ci-cd-node-js-github-actions/
// import app from './app';
// const port = process.env.PORT || 3000;

// app.listen(port, () =>
//   console.log('Example app listening on port 3000!'),
// );
import express from 'express';
// const express = require("express");

const app = express();

const PORT = 5000;

app.get("/", (req, res) => {
	res.json({ message: "Hello World"  });
})

app.get("/health-check", (req, res) => {
	res.json({ message: "Server up and running"  });
})

app.listen(PORT, () => {
	console.log("Server Running on PORT", PORT);
})