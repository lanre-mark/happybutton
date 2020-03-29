var express = require("express");
var path = require("path");
var router = express.Router();

var { database, happyResource } = require("../db");

router.post("/resources", async(req, res, next) => {
    // console.log(req.body);
    await database.set(req.body);
    // console.log(database);
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
    // console.log(dumped);
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
    // console.log(genRate);
    // console.log(database);
    return res.status(200).send(genRate.message);
    // happyResource.then(rsp => {
    //     console.log(rsp);
    // });
});

module.exports = router;