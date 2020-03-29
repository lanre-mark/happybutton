/**
 * Implementation of resources database for the happybutton google extension 
 * 
 * We needed to create a collection of media resources (video, picture, sound and website) in the most minimal way
 * i.e. without the need for a conventional database since the idea just a basic google extension. 
 * To compelte the project, the collection is meant to be a backend/web API that the extension commhnicates with 
 * but the collection must have the data required to be randomly released to the extension when requested.
 * 
 * After much thinking, we came up with the idea to use a hash Table to implement the database.
 * 
 * The usage of hastable will allow to create a key for the resource to be added based on
 * a couple of sub keys
 * For instance, rather than have a conventional database that will save the resources based
 * on a couple of fields/columns such as
 *                              type of resource e.g. sound, picture, website, video etc
 *                              section of type of resource above such as wildlife, pets, laughter, etc
 *                              site url e.g.
 *            These keys are to be used to generate a key for the hash table as they are passed as a concatenated string
 *            into the hash function to generate the hash location
 *
 * 
 * CHALLENGES: Using an object containing 'section' and 'type' properties {"section": "cute-baby-animals-12", "type": "picture"} to generate 
 *             a hash key was initially successful. And the data would be returned when the hash table is to be returned.
 *             When we however invoke the DB.prototype.dump() and saved the file into data/data.json and reload it back into 
 *             hash table by invoking DB.prototype.reset(), getting the resources back was not correct 100% fo the time. 
 *             In fact we had less than 45% success rate. 
 *             After investigating the cause and some research, we discovered that the JSON.stringify() method that stringifies 
 *             the object before getting it's hash key returned a varied output thereby causing the hash function to return a 
 *             different key when using data loaded back from the data.json file.
 * 
 *             We initially added the 'utf-8' encoding while writing the data to json but it did not work
 * 
 *             After a couple of research, we figured a way out by doing below;
 * 
 *            If we crypographically hashed the object {"section": "cute-baby-animals-12", "type": "picture"} without first stringifying 
 *            using JSON.stringify({"section": "cute-baby-animals-12","type": "picture"}), and then pass the cryptographic hash into the 
 *            hashCode function. The crypographic hashed value always returned the same hash key.
 * 
 *            Hence, rather than invoke the hashCode function with the object {"section": "cute-baby-animals-12", "type": "picture}, we 
 *            invoked the hashCode fucntion with a cryptographic hash of object {"section": "cute-baby-animals-12", "type": "picture"}
 *            
 */

/**
 *  Import the 'fs' (File System) internal node module 
 *  This will be handly in saving the contents of the hashTable into a file
 */
const fs = require("fs");

/**
 * Import a node npm module to create crytographic hashes of objects
 * This was used to obtain the crytographic hashes of key Objects to be used as keys 
 * in the hash Table
 */
const hash = require("object-hash");

/**
 * Import a node npm module to perform the Youtube API search
 */
const searchYoutubeVideos = require("youtube-search");
// const searchYoutubeVIdeos = require("youtube-api-v3-search");


/**
 * Database HashTable costructor
 *
 * construct a new hash table database to store the resources requried for the happyButton
 *
 */
function DB() {
    this.SIZE = 1024;
    this.length = 0;
    /**
     * The Hash Table is implemented using an Array with this.SIZE buckets
     */
    this.storage = new Array(this.SIZE);
    /**
     * 'types' is an object that saves the unique types of media resources available
     * It will be used to generate a random type of resources in the Db.prototype.generate() method
     */
    this.types = {};
    this.types["video"] = "video";
    /**
     * 'sections' is an object that saves the unique sections of media resources available 
     */
    this.sections = {};
    /**
     * 'slugs' is an object that saves the all the key objects.
     *  This slug is the key before the cryptographic hash has been obtained.
     *  Alos, note that this is stringified before being saved in the slugs object
     *  It will be used to filter the objects in the hash Table based on a randomly generated type
     *  in the Db.prototype.generate() method
     */
    this.slugs = {};
}


/**
 * The DB.prototype.keyDetails method 
 */
DB.prototype.keyDetails = function(key, invert = false) {
    if (key.type && !this.types[key.type]) {
        this.types[key.type] = key.type;
    }
    if (key.section && !this.sections[key.section]) {
        this.sections[key.section] = key.section;
    }
    if (key && !this.slugs[JSON.stringify(key)]) {
        this.slugs[JSON.stringify(key)] = JSON.stringify(key);
    }
};


/**
 * The DB.prototype.set method 
 * 
 * @param {Object|string} key - key to lookup in hash table
 * @return {integer} The current number of items in the hash Table
 */
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
 *   The DB.prototype.resize method 
 *   If adding the new item will push the number of stored items to over 75 % of
 *   the hash table's SIZE, then double the hash table's SIZE and rehash everything
 * @param {Object|string} key - key to lookup in hash table
 * @return {integer} The current number of items in the hash Table
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
 * The DB.prototype.hashUtilized method 
 * Returns number of locations/buckets used in the HashTables
 *
 * 
 * @param {Object|string} key - key to lookup in hash table
 * @return {integer} The current number of items in the hash Table
 **/
DB.prototype.hashUtilized = function() {
    return this.storage.reduce(function(locationsUsed, eachHashLocation) {
        return eachHashLocation && Object.keys(eachHashLocation).length > 0 ?
            ++locationsUsed :
            locationsUsed;
    }, 0);
};

/**
 * The DB.prototype.overUsed method 
 * Returns a boolean true/false is hash is over utilized
 *
 * 
 * @param {Object|string} key - key to lookup in hash table
 * @return {integer} The current number of items in the hash Table
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
 * The DB.prototype.underUsed method 
 * Returns a boolean true/false is hash is under utilized
 * i.e. the hash table is more than 1024 (which is te default size) but less than 25% utililized
 *
 * 
 * @param {Object|string} key - key to lookup in hash table
 * @return {integer} The current number of items in the hash Table
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
 * The DB.prototype.hashDirectory method 
 * list - List all key/value pairs in the hashTable
 *
 * 
 * @param {Object|string} key - key to lookup in hash table
 * @return {integer} The current number of items in the hash Table
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
 * 
 * @param {Object|string} key - key to lookup in hash table
 * @return {integer} The current number of items in the hash Table
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

/**
 * The DB.prototype.dump method 
 * Returns a boolean true/false is hash is over utilized
 *
 * 
 * @param {Object|string} key - key to lookup in hash table
 * @return {integer} The current number of items in the hash Table
 **/
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


/**
 * The DB.prototype.reset method 
 * Returns a boolean true/false is hash is over utilized
 *
 * 
 * @param {Object|string} key - key to lookup in hash table
 * @return {integer} The current number of items in the hash Table
 **/
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


/**
 * The DB.prototype.generate method 
 * Returns a boolean true/false is hash is over utilized
 *
 * 
 * @param {Object|string} key - key to lookup in hash table
 * @return {integer} The current number of items in the hash Table
 **/

DB.prototype.generate = async function() {
    // const generateResource = function(callback) {
    // randomize on the this.types
    let genType = randomizeType(Object.keys(this.types).length);
    // console.log(this.types);
    genType = Object.values(this.types)[genType];
    // console.log(genType);
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
                            resource: {
                                status: err.toString()
                            }
                        }
                    });
                // shufle results and radnomly select one video record
                // const myVideoSelection =
                //     results[randomizeType(shuffle(results).length)];
                // // console.log(myVideoSelection);

                // console.log("IN THE VIDEO AND HAS RETURNED");
                // console.log("SAVE LOCALLY");
                // if (results.length > 0) {
                //     results.forEach(async function dropLet(itm) {
                //         await this.set({
                //             section: itm.channelTitle,
                //             type: "video",
                //             data: itm.link
                //         });
                //     });
                // }
                // console.log("COMPLETED LOCAL SAVE");
                // return resolve({
                //     state: false,
                //     message: {
                //         type: genType,
                //         resource: myVideoSelection.link,
                //         title: myVideoSelection.title,
                //         description: myVideoSelection.description
                //             // {
                //             //     url: myVideoSelection.link,
                //             //     title: myVideoSelection.title,
                //             //     description: myVideoSelection.description
                //             // }
                //     }
                // });

                return resolve(results);

            });
        });
        let result = await responseWait
            .then(resp => {
                if (Array.isArray(resp)) {
                    if (resp.length > 0) {
                        const saveResultsObj = resp.slice();
                        for (let ii = 0; ii < saveResultsObj.length; ii++) {
                            if (saveResultsObj[ii]) {
                                this.set({
                                    section: saveResultsObj[ii]['channelTitle'],
                                    type: "video",
                                    data: saveResultsObj[ii]['link']
                                });
                            }
                        }
                        // shufle results and radnomly select one video record
                        const myVideoSelection =
                            resp[randomizeType(shuffle(resp).length)];
                        return {
                            state: false,
                            message: {
                                type: genType,
                                resource: myVideoSelection.link,
                                title: myVideoSelection.title,
                                description: myVideoSelection.description
                            }
                        };
                    }
                }
                return resp;
            })
            .catch(err => {
                return err;
            });
        return result;
    } else {
        let filteredSlugs = Object.values(this.slugs).filter(
            item => JSON.parse(item).type === genType
        );
        return {
            state: true,
            message: {
                type: genType,
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


/**
 * 
 */
DB.prototype.nextYoutube = function() {

    require("dotenv").config({
        path: __dirname + "/.env"
    });

    /**
     * These keywords will help provide a more randomized selection fom the Youtunbe API
     * Rather than send static paramters in the payload, we need to randomly select from the
     *      options acceptable by the youtube API
     */
    const videoDuration = ["any", "short", "medium", "long"];
    const orderVideo = ["date", "rating", "relevance", "title", "viewCount"];
    const keyWords = ["happy", "funny", "moments", "laughter", "hilarious"];

    var opts = {
        maxResults: 2,
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
        if (err) return console.log(err);
        // shufle results and radnomly select one video record
        // console.log(results);
        if (results.length > 0) {
            results.forEach(async itm => {
                // console.log(this);
                // await dropLet(itm);
                // await this.set({
                //     section: itm.channelTitle,
                //     type: "video",
                //     data: itm.link
                // });
            });
        }
        // const myVideoSelection = results[randomizeType(shuffle(results).length)];
        // console.log(myVideoSelection);
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
};