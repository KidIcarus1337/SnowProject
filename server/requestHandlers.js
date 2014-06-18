var querystring = require("querystring"),
    fs = require("fs"),
    formidable = require("formidable");

function home(response) {
    fs.readFile("index.html", function(err, html) {
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write(html);
        response.end();
    });
}

function logIn(response) {
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("../logIn.html");
    response.end();
}

function profile(response) {
    response.writeHead(200, {"Content-Type": "image/png"});
    response.write("../profile.html");
    response.end();
}

exports.home = home;
exports.logIn = logIn;
exports.profile = profile;