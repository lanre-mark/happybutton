var search = require("youtube-search");
const searchYoutube = require("youtube-api-v3-search");
require("dotenv").config({ path: __dirname + "/.env" });

var opts = {
    maxResults: 30,
    type: "video",
    videoDuration: "medium", // flexible
    safeSearch: "moderate",
    // order: "", // flexible
    key: process.env.YOUTUBE_API_KEY
};

const searchYou = async() => {
    const options = {
        q: "nodejs",
        part: "snippet",
        type: "video",
        videoCaption: "closedCaption"
    };
    let result = await searchYoutube(process.env.YOUTUBE_API_KEY, options);
    console.log(result);
};

search("happy|funny|moments|laughter|hilarious", opts, function(err, results) {
    if (err) return console.log(err);

    console.dir(results);
    // callback(results);
});

module.exports = {
    searchYoutube: search
};