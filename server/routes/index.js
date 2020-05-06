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
 * 
 * This endpoint was necessitated for a few reasons
 *        - on glitch.com where the backend app was hosted, glitch puts all applicatiosn to sleep once 
 *          they are inactive after like 1 hours. This is part of their policy to ensure that made projects
 *          launched on thier platform fast and available to everyone without hitches. But when there is a 
 *          request for the project eitehr by someone accessing the site/domain, then it comes back to live
 *        - as a result, and because our backend is not using persistent database like mysql, mssql, sqlite etc 
 *          but an in-memory hash table, everytime it got accessed and brought alive from sleep, everything 
 *          starts afresh. We would have lost all data prior to the backend app going to sleep.
 *        - this made us consider the possibility of dumping the hash table into a json file as a way to preserve
 *          the data.
 *    This had to be done by any of us by just calling this endpoint on browser.
 */

router.get("/dump", async(req, res, next) => {
    /**
     * This invokes the dump() prototype function on the database instance
     * If this call succeeds and the data is dumped successully into data.json
     * It then respnds to the client request as a downloaded file for the user
     * to keep for future use.
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
 * This defines the https://alike-sore-hail.glitch.me/reset endpoint
 * This endpoint is defined as a GET HTTP method 
 * The endpoint is responsible for loading an already saved JSON file back to the in-memory hash Table
 * This helped us overcome the rigours to re - populating our backend data (already scrapped from various 
 * websites) when glicth.com puts our backend app to sleep due to inactivity within 45mins. 
 */
router.get("/reset", async(req, res, next) => {
    /**
     * invokes the reset() prototype method of the database instance
     */
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
 * This defines the https://alike-sore-hail.glitch.me/generate endpoint
 * This endpoint is defined as a GET HTTP method
 * Its the only endpoint used in the happyButton extension and it generates a random media resource
 * randomly from a list of 4 possible resources namesly 'video', 'sound', 'picture' and 'website'
 * Based on a randomly generated type, it further generates the random resource which is returned to 
 * the happyButton extension to render.
 * 
 * The other endpoints are used to scrap the media resources from websites of interest and to manage
 * the data we have in the backend.
 */
router.get("/generate", async(req, res, next) => {
    /**
     * Invokes the generate() prototype method of the database instance
     */
    const genRate = await database.generate();
    return res.status(200).send(genRate.message);
});


/**
 * The 'router' object is exported and can be imported outside of this file using the require keyword like 
 * in server.js 
 * The router object is added/mounted to the happyButtonApp express's applciation as a middleware and you 
 * can find that on the happyButtonApp.use("/", index) line of server.js
 * This consequently maps /resources to https://alike-sore-hail.glitch.me
 *                        /generate to https://alike-sore-hail.glitch.me
 *                        /dump to https://alike-sore-hail.glitch.me
 *                        /reset to https://alike-sore-hail.glitch.me
 * 
 * You can print the object to have an idea of what it looks like as well.
 */
module.exports = router;