var express = require("express");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('cookie-session');

var app = express();
app.use(bodyParser.json());
app.use(cookieParser('notsosecretkey'));
app.use(session({secret: 'notsosecretkey123'}));
app.use(express.static(__dirname + "/public"));

function getName(req, res) {
    if (req.session.name) {
        return res.json({ name: req.session.name });
    }
    else {
        return res.json({ name: '' });
    }
}

function setName(req, res) {
    if(!req.body.hasOwnProperty('name')) {
        res.statusCode = 400;
        return res.json({ error: 'Invalid message' });
    }
    else {
        req.session.name = req.body.name;
        return res.json({ name: req.body.name });
    }
}

function logout(req, res) {
    req.session = null;
    return res.json({});
}

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