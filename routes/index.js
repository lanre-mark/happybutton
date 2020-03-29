/**
 * All the endpoints exposed to the outside world on the happyButtonApp are defined in this file
 * While they are defined, the routes defined here invokes a callback that defines what will be 
 * done in the backend to meet a request's requirement.
 * They endpoints include
 *      /resources  i.e. https://alike-sore-hail.glitch.me/resources
 *      /generate   i.e. https://alike-sore-hail.glitch.me/generate
 *      /reset      i.e. https://alike-sore-hail.glitch.me/rest
 *      /dump       i.e. https://alike-sore-hail.glitch.me/dump
 *  In addition, these endpoint routes are then exported from this file and injected into the 
 *  happyButtonApp by const index = require("./routes/index"); Line in server.js
 */

/**
 * Just like in server.js, we import the express npm module and store in the express label
 * But the question is
 *                  -  Why do we need to do this again when we already did this in server.js
 *                  -  Asides the above question, this file routes/index.js is also going to be imported
 *                     into the server.js
 *           The main reason is that we need a method on the express module and that will be explained 
 *           in the 3rd line of executable code
 */
var express = require("express");

/**
 *    Imports the internal path node module to handle directory and folder administration
 *    within the app. This was actually added to help with downloading files from one of 
 *    the endpoint
 */
var path = require("path");

/**
 *    After importing the express npm module, we need to invoke the Router sub module from the above express label 
 *    This sub module refers to how happyButtonApp’s endpoints(URIs) respond to client requests. 
 *    It defines the endpoints available and the callbacks required to be invoked with view 
 *    to providing a response to client requests
 * 
 * NOTE: It is also possible to have done the below
 *        var router = require("express").Router()
 *      INSTEAD of the 2 lines 
 *        var express = require("express");
 *        var router = express.Router();
 * 
 *      Both methods would achieve the same result
 * 
 * For more https://expressjs.com/en/guide/routing.html
 *          https://expressjs.com/en/starter/basic-routing.html
 */

var router = express.Router();

/**
 * Import the functions exposes from db.js as those are the main functionalities 
 * the happyButtonApp performs
 */
var {
    database
} = require("../db");


/**
 * This defines the https://alike-sore-hail.glitch.me/resources endpoint
 * This endpoint is defined as a POST HTTP method
 * The endpoint is responsible for adding media resources such as pictures, sound and website
 * The format for its paramters/payload is
 *            {
 *              "type": "", // A string which is either 'picture', 'sound' OR 'website'       
 *              "section": "", // A string which could be anything ranging from website domain, to categories to video channels, etc
 *              "data": "" // A string representing the url/link of the data to be scrapped or saved to the happyButtonApp database
 *            }
 */
router.post("/resources", async(req, res, next) => {
    /**
     * This invokes the prototype set() method on the database instance
     * It returns with the status 200 and body argument as response to the client's request
     */
    await database.set(req.body);
    return res.status(200).send({
        data: req.body,
        message: "Success"
    });
});


/**
 * This defines the https://alike-sore-hail.glitch.me/dump endpoint
 * This endpoint is defined as a GET HTTP method 
 * The endpoint is responsible for saving the database HashTable object which is in-memory
 *     as a json file, so that it keeps the current state of the HashTable and avoid loss of work
 */

router.get("/dump", async(req, res, next) => {
    /**
     * 
     */
    const dumped = await database.dump();
    if (dumped.state) {
        res.download(path.normalize(`${__dirname}/../${dumped.data}`));
        // return res.status(200).send({
        //     data: dumped.message,
        //     message: "Success"
        // });
    } else {
        return res.status(200).send({
            data: dumped.message,
            message: "Failed to dump resources collection"
        });
    }
});


/**
 * This defines the https: //alike-sore-hail.glitch.me/resources endpoint
 * This endpoint is defined as a POST HTTP method 
 * The endpoint is responsible for adding media resources such as pictures, sound and website
 */
router.get("/reset", async(req, res, next) => {
    const dumped = await database.reset();
    if (dumped.state) {
        return res.status(200).send({
            data: dumped.message,
            message: "Success"
        });
    } else {
        return res.status(400).send({
            data: dumped.message || "",
            message: "Failed to reset the resources collection"
        });
    }
});


/**
 * 
 */
router.get("/generate", async(req, res, next) => {
    const genRate = await database.generate();
    return res.status(200).send(genRate.message);
});


/**
 * This is exported as an importable object outside this file using the require keyword like in the 
 * server.js 
 * The router object is added to the happyButtonApp express's applciation as a middleware and you can find
 * that on the happyButtonApp.use("/", index) line of server.js
 * This consequently maps /resources to https://alike-sore-hail.glitch.me
 *                        /generate to https://alike-sore-hail.glitch.me
 *                        /dump to https://alike-sore-hail.glitch.me
 *                        /reset to https://alike-sore-hail.glitch.me
 * 
 * You can print the object to have an idea of what it looks like as well.
 */
module.exports = router;