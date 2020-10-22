// var http = require("http"),
fs = require("fs");
// const express = require("express");
// const app = express();

// const bodyParser = require("body-parser");

// app.use(bodyParser.json());
// app.get("/", function (req, res) {
//   console.log("Here ?@@@@@@@@@@@@@@@@@@@@@@@@ ");
// });
// app.use(express.static(process.cwd() + "/"));

// http
//   .createServer(function (req, res) {
//     console.log("Started");
//     res.writeHead(200);
//     res.end("Welcome to Node.js HTTPS Servern");
//   })
//   .listen(process.env.PORT || 3000, () => {
//     console.log("Server running on 3000");
//   });

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");

app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/index.html");
});
app.get("*", (req, res) => {
  const extention = req.url.split(".")[req.url.split(".").length - 1];
  if (extention !== "html") {
    res.sendFile(path.join(__dirname, req.url));
  } else {
    res.sendFile(process.cwd() + "/index.html");
  }
});

function onRequest(request, response) {
  response.writeHead(200, { "Content-Type": "text/html" });
  fs.readFile("./index.html", null, function (error, data) {
    if (error) {
      response.writeHead(404);
      response.write("File not found");
    } else {
      response.write(data);
    }
    response.end();
  });
}
// app.use(function (req, res) {
//   res.sendFile(process.cwd() + "/");
//   //   console.log("404 ", req);
// });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
