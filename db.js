/**
 * Implementation of resources database for the happybutton google extension
 * The usage of hastable will allow to create a key for the resource to be added based on
 * a couple of sub keys
 * For instance, rather than have a conventional database that will save the resources based
 * on a couple of keys such as
 *                              type of resource e.g. music, animals, website, etc
 *                              section of type of resource above such as wildlife, pets, laughter, etc
 *                              site url e.g.
 *            These keys are to be used to generate a key for the hash table as they are passed as a concatenated string
 *            into the hash function to generate the hash location
 *
 */

const fs = require("fs");
const hash = require("object-hash");
var promise = require("bluebird");
const searchYoutubeVideos = require("youtube-search");
// const searchYoutubeVIdeos = require("youtube-api-v3-search");
require("dotenv").config({ path: __dirname + "/.env" });
/**
 * Database HashTable costructor
 *
 * construct a new hash table database to store the resources requried for trh happy button
 *
 */
function DB() {
    this.SIZE = 1024;
    this.length = 0;
    this.storage = new Array(this.SIZE);
    // these other properties of the key will help maintain a better randomized response
    this.types = {};
    this.types["video"] = "video";
    this.sections = {};
    this.slugs = {};
}

DB.prototype.keyDetails = function(key, invert = false) {
    if (key.type && !this.types[key.type]) {
        // this.types[Object.keys(this.types).length] = key.type;
        this.types[key.type] = key.type;
    }
    // else {
    //     if (invert) {
    //         const typeKey = JSON.parse(key);
    //         if (typeKey.type && !this.types[typeKey.type]) {
    //             // this.types[Object.keys(this.types).length] = typeKey.type;
    //             this.types[typeKey.type] = typeKey.type;
    //         }
    //     }
    // }
    if (key.section && !this.sections[key.section]) {
        // this.sections[Object.keys(this.sections).length] = key.section;
        this.sections[key.section] = key.section;
    }
    // else {
    //     if (invert) {
    //         const typeKey = JSON.parse(key);
    //         if (typeKey.section && !this.sections[typeKey.section]) {
    //             // this.sections[Object.keys(this.sections).length] = typeKey.section;
    //             this.sections[typeKey.section] = typeKey.section;
    //         }
    //     }
    // }
    if (key && !this.slugs[JSON.stringify(key)]) {
        // this.slugs[Object.keys(this.slugs).length] = JSON.stringify(key);
        // if (invert) {
        //     this.slugs[key] = key;
        // } else {
        this.slugs[JSON.stringify(key)] = JSON.stringify(key);
        // }
    }
};

DB.prototype.set = function(key, value = null, setState = false) {
    if (this.overUsed()) {
        this.resize();
    }
    // const param = {
    //   section: "cute-baby-animals-12",
    //   type: "picture",
    //   data: "https://static.boredpanda.com/blog/wp-content/uuuploads/cute-baby-animals/cute-baby-animals-12.jpg"
    // }
    if (!setState) {
        const hashKey = {
            section: key.section,
            type: key.type
        };
        value = key;
        this.keyDetails(hashKey);
        key = hash(hashKey);
    } else {
        const hashKey = {
            section: value.section,
            type: value.type
        };
        this.keyDetails(hashKey);
    }
    const hashLocation = hashCode(key, this.SIZE);
    if (!this.storage[hashLocation]) {
        this.storage[hashLocation] = {};
    }
    this.storage[hashLocation][key] = value;
    return ++this.length;
    // if (!setState) return this.length;
};

/**
 *   If adding the new item will push the number of stored items to over 75 % of
 *   the hash table's SIZE, then double the hash table's SIZE and rehash everything
 */

DB.prototype.resize = function(state = 0) {
    // perform a resize
    // return a list of all key/value pairs in the hashTabe
    const hashListing = this.hashDirectory();
    // increase or decrease the size
    state == 0 ? (this.SIZE *= 2) : (this.SIZE /= 2);
    this.storage = new Array(this.SIZE);
    Object.keys(hashListing).forEach(item =>
        this.set(item, hashListing[item], true)
    );
};

/**
 * Returns number of locations/buckets used in the HashTables
 *
 **/
DB.prototype.hashUtilized = function() {
    return this.storage.reduce(function(locationsUsed, eachHashLocation) {
        return eachHashLocation && Object.keys(eachHashLocation).length > 0 ?
            ++locationsUsed :
            locationsUsed;
    }, 0);
};

/**
 * Returns a boolean true/false is hash is over utilized
 *
 **/
DB.prototype.overUsed = function() {
    const locationsUsed = this.hashUtilized();
    return locationsUsed > 0 ?
        (locationsUsed / this.SIZE) * 100 >= 75.0 ?
        true :
        false :
        false;
};

/**
 * Returns a boolean true/false is hash is under utilized
 * i.e. the hash table is more than 1024 (which is te default size) but less than 25% utililized
 *
 **/
DB.prototype.underUsed = function() {
    const locationsUsed = this.hashUtilized();
    return locationsUsed > 0 ?
        (locationsUsed / this.SIZE) * 100 <= 25.0 ?
        true :
        false :
        false;
};

/**
 * list - List all key/value pairs in the hashTable
 *
 **/
DB.prototype.hashDirectory = function() {
    return this.storage.reduce(function listItems(hashItems, hasContent) {
        return Object.keys(hasContent).reduce(function itemsInRow(
                hashContentInRow,
                eachRowKey
            ) {
                hashContentInRow[eachRowKey] = hasContent[eachRowKey];
                return hashContentInRow;
            },
            hashItems);
    }, {});
};

/**
 * get - Retrieves a value stored in the hash table with a specified key
 *
 * - If more than one value is stored at the key's hashed address, then you must retrieve
 *   the correct value that was originally stored with the provided key
 *
 * @param {string} key - key to lookup in hash table
 * @return {string|number|boolean} The value stored with the specifed key in the
 * hash table
 */
DB.prototype.get = function(key) {
    // key = JSON.stringify(key);
    const hashLocation = hashCode(key, this.SIZE);
    console.log(hashLocation);
    console.log(this.storage[hashLocation]);
    return this.storage[hashLocation] &&
        this.storage[hashLocation].hasOwnProperty(key) ?
        this.storage[hashLocation][key] :
        undefined;
};

/**
 *  If the hash table 's SIZE is greater than 16 and the result of removing the
 *  item drops the number of stored items to be less than 25 % of the hash table 's SIZE
 *  (rounding down), then reduce the hash table 's SIZE by 1/2 and rehash everything.
 */
DB.prototype.remove = function(key, invert = false) {
    if (this.SIZE > 1024 && this.underUsed()) {
        // resize if under utilized hence reduce size
        this.resize(1);
    }
    if (!invert) {
        key = JSON.stringify(key);
    }
    const hashLocation = hashCode(key, this.SIZE);
    if (
        this.storage[hashLocation] &&
        this.storage[hashLocation].hasOwnProperty(key)
    ) {
        const delValue = this.storage[hashLocation][key];
        delete this.storage[hashLocation][key];
        this.length--;
        return delValue;
    }
    return undefined;
};

function hashCode(string, size) {
    "use strict";
    let hash = 0;
    if (string.length === 0) return hash;
    for (let i = 0; i < string.length; i++) {
        const letter = string.charCodeAt(i);
        hash = (hash << 5) - hash + letter;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash) % size;
}

DB.prototype.dump = async function() {
    const hashListing = this.hashDirectory();
    var jsonContent = JSON.stringify(hashListing);
    try {
        await fs.writeFileSync("data/data.json", jsonContent);
        return {
            state: true,
            message: "Ok",
            data: "data/data.json"
        };
    } catch (err) {
        console.error(err);
        return {
            state: false,
            message: err
        };
    }
};

DB.prototype.reset = async function() {
    try {
        let hashListing = await fs.readFileSync("data/data.json", "utf8");
        hashListing = JSON.parse(hashListing);
        this.storage = new Array(this.SIZE);
        // const testLoadKey = Object.keys(hashListing)[0];
        // console.log(testLoadKey);
        // console.log(hashListing[testLoadKey]);
        // this.set(testLoadKey, hashListing[testLoadKey], true);
        Object.keys(hashListing).forEach(item => {
            this.set(item, hashListing[item], true);
        });
        return {
            state: true,
            message: "Ok"
        };
    } catch (err) {
        console.error(err);
        return {
            state: false,
            message: err
        };
    }
};

const shuffle = function(collection) {
    if (collection) {
        for (let ii = collection.length - 1; ii > 0; ii--) {
            const jj = Math.floor(Math.random() * ii);
            [collection[ii], collection[jj]] = [collection[jj], collection[ii]];
        }
    }
    return collection;
};

const randomizeType = rangeSize => {
    return Number((Math.random() * (Math.floor(rangeSize) - 1)).toFixed(0));
};

DB.prototype.generate = async function() {
    // const generateResource = function(callback) {
    // randomize on the this.types
    let genType = randomizeType(Object.keys(this.types).length);
    // console.log(this.types);
    genType = Object.values(this.types)[genType];
    if (genType === "video") {
        // handle the YOUTUBE API SEARCH

        /**
         * These keywords will help provide a more randomized selection fom the Youtunbe API
         * Rather than send static paramters in the payload, we need to randomly select from the
         *      options acceptable by the youtube API
         */
        const videoDuration = ["any", "short", "medium", "long"];
        const orderVideo = ["date", "rating", "relevance", "title", "viewCount"];
        const keyWords = ["happy", "funny", "moments", "laughter", "hilarious"];

        var opts = {
            maxResults: 30,
            type: "video",
            videoDuration: videoDuration[randomizeType(shuffle(videoDuration).length)], //"medium", // flexible
            safeSearch: "moderate",
            order: orderVideo[randomizeType(shuffle(orderVideo).length)], // flexible
            key: process.env.YOUTUBE_API_KEY
        };

        const srchKeys = shuffle(keyWords).join("|"); //"happy|funny|moments|laughter|hilarious";
        // searchYoutubeVideos(srchKeys, opts, function(
        //   // searchYoutubeVideos(shuffle(keyWords).join("|"), opts, function(
        //   err,
        //   results
        // ) {
        //   if (err)
        //     return {
        //       state: false,
        //       message: {
        //         type: genType,
        //         resource: { status: "Youtube API Error" }
        //       }
        //     };
        //   // shufle results and radnomly select one video record
        //   const myVideoSelection = results[randomizeType(shuffle(results).length)];
        //   // console.log(myVideoSelection);

        //   return {
        //     state: false,
        //     message: {
        //       type: genType,
        //       resource: {
        //         url: myVideoSelection.link,
        //         title: myVideoSelection.title,
        //         description: myVideoSelection.description
        //       }
        //     }
        //   };
        // });
        const responseWait = new Promise((resolve, reject) => {
            searchYoutubeVideos(srchKeys, opts, function(
                // searchYoutubeVideos(shuffle(keyWords).join("|"), opts, function(
                err,
                results
            ) {
                if (err)
                    return reject({
                        state: false,
                        message: {
                            type: genType,
                            resource: { status: "Youtube API Error" }
                        }
                    });
                // shufle results and radnomly select one video record
                const myVideoSelection =
                    results[randomizeType(shuffle(results).length)];
                // console.log(myVideoSelection);

                return resolve({
                    state: false,
                    message: {
                        type: genType,
                        resource: myVideoSelection.link,
                        title: myVideoSelection.title,
                        description: myVideoSelection.description
                            // {
                            //     url: myVideoSelection.link,
                            //     title: myVideoSelection.title,
                            //     description: myVideoSelection.description
                            // }
                    }
                });
            });
        });
        let result = await responseWait.then(resp => {
            return resp;
        });
        return result;

        //   .then(rsp => {
        //     return rsp;
        // });
        // console.log("returning");
        // return response;
        // return {
        //     state: false,
        //     message: {
        //         type: genType,
        //         resource: "Youtube video url/link"
        //     }
        // };
    } else {
        let filteredSlugs = Object.values(this.slugs).filter(
            item => JSON.parse(item).type === genType
        );
        // console.log(filteredSlugs);
        // console.log(filteredSlugs[randomizeType(shuffle(filteredSlugs).length)]);
        // console.log(
        //     JSON.parse(filteredSlugs[randomizeType(shuffle(filteredSlugs).length)])
        // );
        // console.log(
        //     hash(
        //         JSON.parse(filteredSlugs[randomizeType(shuffle(filteredSlugs).length)])
        //     )
        // );
        return {
            state: true,
            message: {
                type: genType,
                // resource: this.get(
                //     filteredSlugs[randomizeType(shuffle(filteredSlugs).length)]
                // )
                resource: this.get(
                    hash(
                        JSON.parse(
                            filteredSlugs[randomizeType(shuffle(filteredSlugs).length)]
                        )
                    )
                ).data
            }
        };
    }
};

DB.prototype.nextYoutube = function() {
    /**
     * These keywords will help provide a more randomized selection fom the Youtunbe API
     * Rather than send static paramters in the payload, we need to randomly select from the
     *      options acceptable by the youtube API
     */
    const videoDuration = ["any", "short", "medium", "long"];
    const orderVideo = ["date", "rating", "relevance", "title", "viewCount"];
    const keyWords = ["happy", "funny", "moments", "laughter", "hilarious"];

    var opts = {
        maxResults: 30,
        type: "video",
        videoDuration: videoDuration[randomizeType(shuffle(videoDuration).length)], //"medium", // flexible
        safeSearch: "moderate",
        order: orderVideo[randomizeType(shuffle(orderVideo).length)], // flexible
        key: process.env.YOUTUBE_API_KEY
    };
    const srchKeys = shuffle(keyWords).join("|"); //"happy|funny|moments|laughter|hilarious";
    // console.log(opts);
    searchYoutubeVideos(srchKeys, opts, function(
        // searchYoutubeVideos(shuffle(keyWords).join("|"), opts, function(
        err,
        results
    ) {
        if (err) return ""; //console.log(err);
        // shufle results and radnomly select one video record
        const myVideoSelection = results[randomizeType(shuffle(results).length)];
        console.log(myVideoSelection);
    });
};

// const newHash = new DB();

// newHash.nextYoutube();

// newHash.reset();
// setTimeout(() => {
//     console.log(newHash.generate());
// }, 1000);
// console.log(newHash);
// let param = {
//     section: "cute-baby-animals-12",
//     type: "picture",
//     data: "https://static.boredpanda.com/blog/wp-content/uuuploads/cute-baby-animals/cute-baby-animals-12.jpg"
// };

// newHash.set(param);
// param = {
//     section: "cute-baby-animals",
//     type: "picture",
//     data: "https://static.boredpanda.com/blog/wp-content/uuuploads/cute-baby-animals/cute-baby-animals-12.jpg"
// };

// newHash.set(param);
// console.log(newHash);

// newHash.dump();

// console.log(newHash.generate());
/**
 * Export a closed version of DB as a static object
 * for use in the rest of the entire application
 */
module.exports = {
    database: new DB()
        // happyResource: promise.promisify(generateResource)
};