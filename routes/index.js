var express = require("express");
var router = express.Router();

var {
    database
} = require("../db");

router.post("/resources", async(req, res, next) => {
    await database.set(req.body.key, req.body.data);
    return res.status(200).send({
        data: req.body,
        message: "Success"
    });
});

router.get("/dump", async(req, res, next) => {
    const dumped = await database.dump();
    if (dumped.state) {
        return res.status(200).send({
            data: dumped.message,
            message: "Success"
        });
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
            data: dumped.message,
            message: "Failed to reset the resources collection"
        });
    }
});

router.get("/generate", async(req, res, next) => {
    res.send(200);
});

module.exports = router;