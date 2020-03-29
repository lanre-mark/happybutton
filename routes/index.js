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
 * 
 */
var express = require("express");

/**
 * 
 */
var path = require("path");

/**
 * 
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

module.exports = router;