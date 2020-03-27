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
}


DB.prototype.set = function(key, value, setState = false) {
    if (this.overUsed()) {
        this.resize()
    }
    key = JSON.stringify(key);
    const hashLocation = hashCode(key, this.SIZE);
    if (!this.storage[hashLocation]) {
        this.storage[hashLocation] = {}
    }
    this.storage[hashLocation][key] = value;
    if (!setState) return ++this.length;
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
    (state == 0) ? this.SIZE *= 2: this.SIZE /= 2;
    this.storage = new Array(this.SIZE);
    Object.keys(hashListing).forEach(item => this.set(item, hashListing[item], true));
}

/**
 * Returns number of locations/buckets used in the HashTables
 *
 **/
DB.prototype.hashUtilized = function() {
    return this.storage.reduce(function(locationsUsed, eachHashLocation) {
        return eachHashLocation && Object.keys(eachHashLocation).length > 0 ? ++locationsUsed : locationsUsed;
    }, 0);
}

/**
 * Returns a boolean true/false is hash is over utilized
 *
 **/
DB.prototype.overUsed = function() {
    const locationsUsed = this.hashUtilized();
    return locationsUsed > 0 ? ((locationsUsed / this.SIZE) * 100) >= 75.0 ? true : false : false
}

/**
 * Returns a boolean true/false is hash is under utilized
 * i.e. the hash table is more than 1024 (which is te default size) but less than 25% utililized
 *
 **/
DB.prototype.underUsed = function() {
    const locationsUsed = this.hashUtilized();
    return locationsUsed > 0 ? ((locationsUsed / this.SIZE) * 100) <= 25.0 ? true : false : false
}

/**
 * list - List all key/value pairs in the hashTable
 *
 **/
DB.prototype.hashDirectory = function() {
    return this.storage.reduce(function listItems(hashItems, hasContent) {
        return Object.keys(hasContent).reduce(function itemsInRow(hashContentInRow, eachRowKey) {
            hashContentInRow[eachRowKey] = hasContent[eachRowKey]
            return hashContentInRow;
        }, hashItems)
    }, {})
}

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
    key = JSON.stringify(key);
    const hashLocation = hashCode(key, this.SIZE);
    return this.storage[hashLocation] && this.storage[hashLocation].hasOwnProperty(key) ? this.storage[hashLocation][key] : undefined;
};


/**
 *  If the hash table 's SIZE is greater than 16 and the result of removing the
 *  item drops the number of stored items to be less than 25 % of the hash table 's SIZE
 *  (rounding down), then reduce the hash table 's SIZE by 1/2 and rehash everything.
 */
DB.prototype.remove = function(key) {
    if (this.SIZE > 1024 && this.underUsed()) {
        // resize if under utilized hence reduce size
        this.resize(1);
    }
    key = JSON.stringify(key);
    const hashLocation = hashCode(key, this.SIZE);
    if (this.storage[hashLocation] && this.storage[hashLocation].hasOwnProperty(key)) {
        const delValue = this.storage[hashLocation][key];
        delete this.storage[hashLocation][key]
        this.length--;
        return delValue;
    }
    return undefined;
};

function hashCode(string, size) {
    'use strict';
    let hash = 0;
    if (string.length === 0) return hash;
    for (let i = 0; i < string.length; i++) {
        const letter = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + letter;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash) % size;
}

/**
 * Export a closed version of DB as a static object 
 * for use in the rest of the entire application
 */
module.exports = new DB();