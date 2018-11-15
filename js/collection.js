class Collection extends Array {
 

}

Collection.prototype.select = Collection.prototype.filter;
Collection.prototype.collect = Collection.prototype.map;
Collection.prototype.detect = Collection.prototype.find;