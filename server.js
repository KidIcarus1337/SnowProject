var express = require("express");
var Firebase = require("firebase");
var FirebaseTokenGenerator = require("firebase-token-generator");
var tokenGenerator = new FirebaseTokenGenerator("9JCywOK5CIZaidL7pb1QjpHPMtTcnudG0NSYqdCD");
var token = tokenGenerator.createToken({we: "will", rock: "you"});
var fb_data = new Firebase("https://snow-project.firebaseio.com/");

var app = express();
app.use(express.bodyParser());
app.use(express.static(__dirname + "/public"));
/*app.use("/", function(req, res, next) {
    if (req.originalUrl === "/login.html") {
        next();
    } else {
        fb_data.auth(token, function(error) {
            if(error) {
                console.log("Login Failed!", error);
            } else {
                console.log("Login Succeeded!");
            }
        });
    }
});*/

function home(req, res) {
    res.sendFile("public/index.html");
}

function logIn(req, res) {
    res.sendFile("public/login.html");
}

app.get("/", home);
app.get("/index.html", home);
app.get("/login.html", logIn);
app.get('/authToken', function(req, res){
    var token = tokenGenerator.createToken({we: "will", rock: "you"});
    res.json(token);
});

var port = process.env.PORT || 8000;
app.listen(port, function () { console.log("Listening on port " + port); });