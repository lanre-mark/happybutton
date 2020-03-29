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
 * 
 */
var path = require("path");

/**
 *    After importing the express npm module, we need to invoke the Router sub module from the above express label 
 *  
 * 
 * NOTE: It is also possible to have done the below
 *        var router = require("express").Router()
 *      INSTEAD of the 2 lines 
 *        var express = require("express");
 *        var router = express.Router();
 * 
 *      Both methods would achieve the same result
 */

var router = express.Router();

/**
 * 
 */
var {
    database
} = require("../db");

router.post("/resources", async(req, res, next) => {
    await database.set(req.body);
    return res.status(200).send({
        data: req.body,
        message: "Success"
    });
});

router.get("/dump", async(req, res, next) => {
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

router.get("/generate", async(req, res, next) => {
    const genRate = await database.generate();
    return res.status(200).send(genRate.message);
});


/**
 * 
 * 
 * 
 * This is exported as an importable object outside this file using the require keyword like in the 
 * server.js 
 * You can print the object to have an idea of what it looks like as well.
 */
module.exports = router;