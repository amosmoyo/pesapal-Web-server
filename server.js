const express = require("express");

const http = require("https");

const fs = require("fs");

var privateKey = fs.readFileSync("cert/key.pem", "utf8");

var certificate = fs.readFileSync("cert/cert.pem", "utf8");

var credentials = { key: privateKey, cert: certificate };

const dotenv = require("dotenv");
const path = require("path");
const bodyParser = require("body-parser");

dotenv.config({ path: "./configs/config.env" });

const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  if (req.secure) {
    next();
  } else {
    res.redirect("https://" + req.headers.host + req.url);
  }
});

app.enable("trust proxy");

app.use(express.static(__dirname + "/public"));

app.get("/*", (req, res) => {
  res.header('Content-type', 'text/html');
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

app.post("/", (req, res) => {
  res.header('Content-type', 'text/html');

  res.send(
    `<div style="text-align: center;  margin-top: 20vh; font-size: 1.175em;     max-width: 800px;
    margin: 60px auto;
    background-color: rgba(130, 184, 219, 0.5);
    border: 5px solid rgb(98, 143, 228);">Hello <span style="font-weight:bold; color: rgb(98, 143, 228);">${req.body.yourname}</span>, Thank you for subcribing. You email is <span style="color:rgb(98, 143, 228);"> ${req.body.youremail}</span></div>`
  );
});

const PORT = process.env.PORT || 3443;

const server = http.createServer(credentials, app);

server.listen(PORT, () => {
  console.log(`The server is running on port  ${PORT}.`);
});
