/** 
 *   The www file is the entry point of this project. This is file creates the Node.js server
 *   using hte http module in node. 
 *   It setups up debugging and loads the entire app using the server.js as the nucleus/proxy
 *   Declares the port in which the server runs and add an error listerner on the routes
 * 
 * 
 * 
 */

/**
 * Loads the most common module on node. The express modele added to the project from 
 * npm using npm install express on the command line of the project's root. 
 * The module handles the routes exposed by the application as a REST API
 */
var express = require("express");
/**
 * Load the fs internal file module in node for File System access and Directory operations
 */
const fs = require("fs");
/**
 * Loads the morgam npm node module. This was installed using npm install morgan on the command line of the project.
 * This module is used for logging activities on any endpoint.  
 * On backend serves, because the need for introspection of activites for debugging is beyond the  
 * console.log which is called only on user request, there is often the need to log every action on the server
 * A module such as morgan is used to achieve this purpose. 
 * This module is better used as a middleware
 */
var logger = require("morgan");
/**
 *  The body-parser installed using npm install body-parser on the command line of the project's folder
 *  is an npm module 
 *  Data is communicated in node by streams. This is one of the strengths of node. These data 
 *  regardless of type is transfered over the internet via streams and using the socket communication and the data
 *  it arrives at the destination in chunks. What the body-parser which is a middleware does is to intercept these chunks
 *  until the data from a socket connection has finally arrived. Then based on the type of data json, binary, files, etc
 *  converts them into the readable type makes data avaiable on the request.body field.
 *  For more https: //medium.com/@adamzerner/how-bodyparser-works-247897a93b90
 */
var bodyParser = require("body-parser");
/**
 * Loads the .env file as early as possible before the variables in the Environment variable is ever accessed
 * This is achieved by using the dotenv module from npm
 */
require("dotenv").config({
    path: __dirname + "/.env"
});

/**
 * Loads all routes delacred for happybutton backend rest endpoints here and 
 * assign them into the index label
 */
const index = require("./routes/index");

/**
 * declare a lahel happyButtonApp declared as an express application
 * This is the entire application (backend application) saved in the happyButtonApp as an object
 * that will contain properties such as methods and functinons, etc and will be hosted on a cloud 
 * to make it available at any time time when the backend endpoints are required
 *  As an illustration or further understanding, console.log(happyButton) and the end of this file 
 * to see structure of the entire object
 */
const happyButtonApp = express();


/**
 * the .use on an express application is used to load middlewares.
 * These are functions/methods that intercept any request and transforms them to 
 * we require to complete a request and respond to same
 */


/**
 * The extended option allows to choose between parsing the URL - encoded data 
 * with the querystring library(when false) or the qs library(when true).
 * The "extended" syntax allows for rich objects and arrays to be encoded into 
 * the URL - encoded format, allowing for a JSON - like experience with URL - encoded
 * For more https://stackoverflow.com/questions/29960764/what-does-extended-mean-in-express-4-0
 */
happyButtonApp.use(
    bodyParser.urlencoded({
        extended: true
    })
);

/**
 *  Adding the body-parser json parser functionailty to the middleware. 
 *  For more https: //expressjs.com/en/resources/middleware/body-parser.html#bodyparserjsonoptions
 */
happyButtonApp.use(bodyParser.json());

/**
 * This middleware utilizes the morgan module to log activities on the application
 * Request activities such as the url, files served, time details, etc are logged onto the screen
 * or on anyother provided in the setup of morgan's configuration. For the purpose of this project
 * we used the default, loggin to console.
 */
happyButtonApp.use(logger("dev"));

/**
 * This middleware ensures that all files and items in the public folder are served static
 * Such files include html, css, images and icon assets, etc.
 * Without this middleware, only the rest endpoints will work and other static files will not be
 */
happyButtonApp.use(express.static("public"));


/**
 * 
 */
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


/**
 * 
 */
// error handler
happyButtonApp.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    // render the error page
    res.status(err.status || 500);
    // res.render("error");
});



/**
 * 
 */
happyButtonApp.get("/", function(req, res, next) {
    res.sendFile(`${__dirname}/views/index.html`);
});


/**
 * 
 */
happyButtonApp.use("/", index);


/**
 * 
 */
module.exports = happyButtonApp;