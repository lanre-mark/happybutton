var express = require("express");
const fs = require("fs");
var logger = require("morgan");
var bodyParser = require("body-parser");
require("dotenv").config({ path: __dirname + "/.env" });

const index = require("./routes/index");

const happyButtonApp = express();

happyButtonApp.use(
    bodyParser.urlencoded({
        extended: true
    })
);
happyButtonApp.use(bodyParser.json());

happyButtonApp.use(logger("dev"));
happyButtonApp.use(express.static("public"));

// Enable CORS from client-side
happyButtonApp.use(function(req, res, next) {
    if (req.headers.origin != undefined) {
        res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
    }
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials, x-auth, x-version, x-route"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});

// // catch 404 and forward to error handler
// happyButtonApp.use(function(req, res, next) {
//     var err = new Error("Not Found");
//     err.status = 404;
//     next(err);
// });

// error handler
happyButtonApp.use(function(err, req, res, next) {
    // set locals, only providing error in development

    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    // res.render("error");
});

happyButtonApp.get("/", function(req, res, next) {
    res.sendFile(`${__dirname}/views/index.html`);
});

happyButtonApp.use("/", index);

module.exports = happyButtonApp;