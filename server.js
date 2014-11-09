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

function checkLogin(login_id, login_password, callback) {
    console.log("Login id: " + login_id);
    fb_accounts.once("value", function(dataSnapshot) {
        dataSnapshot.forEach(function (childSnapshot) {
            if (login_id !== childSnapshot.child("email").val() && login_id !== childSnapshot.child("username").val()) {
                callback({message: 'Invalid ID'}, null);
            } else {
                if (login_password !== childSnapshot.child("password").val()) {
                    callback({message: 'Invalid password'}, null);
                } else {
                    callback(null,
                           {email: childSnapshot.child("email").val(),
                            first_name: childSnapshot.child("first_name").val(),
                            last_name: childSnapshot.child("last_name").val(),
                            username: childSnapshot.child("username").val(),
                            password: childSnapshot.child("password").val(),
                            phone: childSnapshot.child("phone").val(),
                            poster: childSnapshot.child("poster").val(),
                            shoveler: childSnapshot.child("shoveler").val(),
                            newsletter: childSnapshot.child("newsletter").val()});
                }
            }
        });
    });
}

function login(req, res) {
    checkLogin(req.body.login_id, req.body.login_password, function (err, loginResult) {
        if (err) {
            return res.json(300, err);
            }
        else {
            req.session = loginResult;
            return res.json({});
        }
    });
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
        return res.json(300, {message: ""});
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
