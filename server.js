onst express = require("express");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());