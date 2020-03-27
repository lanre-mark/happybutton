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
function DB() {
    this.SIZE = 16;
    this.length = 0;
    this.storage = new Array(this.SIZE);
}