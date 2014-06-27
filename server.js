var express = require("express");

var app = express();
app.use(express.bodyParser());
app.use(express.static(__dirname + "/public"));

function home(req, res) {
    res.sendfile("public/index.html");
}

function postJob(req, res) {
    res.sendfile("public/post_job.html");
}

function findJob(req, res) {
    res.sendfile("public/find_job.html");
}

function logIn(req, res) {
    res.sendfile("public/login.html");
}

function terms(req, res) {
    res.sendfile("public/terms.html");
}

function help(req, res) {
    res.sendfile("public/help.html");
}

function contact(req, res) {
    res.sendfile("public/contact.html");
}

function about(req, res) {
    res.sendfile("public/about.html");
}

app.get("/", home);
app.get("/login", logIn);
app.get("/post-job", postJob);
app.get("/find-job", findJob);
app.get("/help", help);
app.get("/terms", terms);
app.get("/contact", contact);
app.get("/about", about);

var port = process.env.PORT || 8000;
app.listen(port, function () { console.log("Listening on port " + port); });