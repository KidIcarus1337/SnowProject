var express = require("express");

var app = express();
app.use(express.bodyParser());
app.use(express.static(__dirname + "/public"));

function home(req, res) {
    res.sendFile("public/index.html");
}

function logIn(req, res) {
    res.sendFile("public/login.html");
}

app.get("/", home);
app.get("/index.html", home);
app.get("/login.html", logIn);

var port = process.env.PORT || 8000;
app.listen(port, function () { console.log("Listening on port " + port); });