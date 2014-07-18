var express = require("express");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('cookie-session');
var Firebase = require('firebase');

var app = express();
app.use(bodyParser.json());
app.use(cookieParser('notsosecretkey'));
app.use(session({secret: 'notsosecretkey123'}));
app.use(express.static(__dirname + "/public"));

var fb_accounts = new Firebase("https://snow-project.firebaseio.com/accounts/");

function getName(req, res) {
    if (req.session.name) {
        return res.json({ name: req.session.name });
    }
    else {
        return res.json({ name: '' });
    }
}

function setName(req, res) {
    if (!req.body.hasOwnProperty('name')) {
        res.statusCode = 400;
        return res.json({ error: 'Invalid message' });
    }
    else {
        req.session.name = req.body.name;
        return res.json({ name: req.body.name });
    }
}

function checkLogin(login_id, login_password) {
    if (login_id == 'jared' && login_password == 'sasser') {
       return {first_name: "Jared", username: "Motrax"};
    }
    else {
       return null;
    }
}

function login(req, res) {
    if (!req.body.hasOwnProperty('login_id') || !req.body.hasOwnProperty('login_password')) {
        return res.json(400, { message: 'Missing username or password' });
    }
    else {
        var loginResult = checkLogin(req.body.login_id, req.body.login_password);
        if (loginResult) {
            req.session = loginResult;
            return res.json(loginResult);
        }
        else {
            return res.json(300, { message: 'Invalid username or password' });
        }
    }
}

function logout(req, res) {
    req.session = null;
    return res.json({});
}

function getSessionInfo(req, res) {
    res.setHeader("Last-Modified", (new Date()).toUTCString());
    if (req.session !== null && "first_name" in req.session) {
        return res.json(req.session);
    } else {
        return res.json(400, {message: ""});
    }
}

function homePage(req, res) {
    res.sendfile("public/index.html");
}

function postJobPage(req, res) {
    res.sendfile("public/post_job.html");
}

function findJobPage(req, res) {
    res.sendfile("public/find_job.html");
}

function loginPage(req, res) {
    res.sendfile("public/login.html");
}

function termsPage(req, res) {
    res.sendfile("public/terms.html");
}

function helpPage(req, res) {
    res.sendfile("public/help.html");
}

function contactPage(req, res) {
    res.sendfile("public/contact.html");
}

function aboutPage(req, res) {
    res.sendfile("public/about.html");
}

app.get("/", homePage);
app.get("/login", loginPage);
app.get("/post-job", postJobPage);
app.get("/find-job", findJobPage);
app.get("/help", helpPage);
app.get("/terms", termsPage);
app.get("/contact", contactPage);
app.get("/about", aboutPage);
app.post("/check_login", login);
app.get("/session_info", getSessionInfo);
app.get("/logout", logout);

var port = process.env.PORT || 8000;
app.listen(port, function () { console.log("Listening on port " + port); });