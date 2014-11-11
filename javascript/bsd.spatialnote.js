BSD.spatialNotes = [];
BSD.SpatialNoteCollection = function(a) {
  var self = a;
  
  self.closestTo = function(other) {
		var sorted = self.sortedByDistanceTo(other);
    //console.log(sorted,'sorted');
    var result = sorted.shift();  
    //console.log('result',result);
    return result.object;
  };  

  self.furthestFrom = function(other) {
		var sorted = self.sortedByDistanceTo(other);
    //console.log(sorted,'sorted');
    var result = sorted.pop();  
    //console.log('result',result);
    return result.object;
  };  

	self.sortedByDistanceTo = function(other) {
    var candidates = self.select(function(can){
      return true; //can't decide whether to include/exclude a self-hit
      return can.hash() !== other.hash();
    }).collect(function(o) {
      return {object: o, distance: o.distanceTo(other) }; 
    });
    ///console.log(candidates,'candidates');
    var sorted = candidates.sort(function(a,b) {
      return a.distance - b.distance;
    });
		return sorted;
	};



	self.midpoint = function() {
		var avgX = self.map(function(sn) { return sn.x; }).average();
		var avgY = self.map(function(sn) { return sn.y; }).average();
		return [avgX,avgY];
	};


  self.abstractlyEqualTo = function(other) {
    var result = self.select(function(can){ return can.abstractlyEqualTo(other); });
    return BSD.SpatialNoteCollection(result);
  };

  self.equalTo = function(other) {
    var result = self.select(function(can){ return can.equalTo(other); });
    return BSD.SpatialNoteCollection(result);
  };

  self.noteValueGE = function(other) { 
    var result = self.select(function(can){ return can.value() >= other.value(); });
    return BSD.SpatialNoteCollection(result);
  };  

  self.noteValueGT = function(other) { 
    var result = self.select(function(can){ return can.value() > other.value(); });
    return BSD.SpatialNoteCollection(result);
  };  

  self.noteValueLE = function(other) { 
    var result = self.select(function(can){ return can.value() <= other.value(); });
    return BSD.SpatialNoteCollection(result);
  };  

  self.noteValueLT = function(other) { 
    var result = self.select(function(can){ return can.value() < other.value(); });
    return BSD.SpatialNoteCollection(result);
  };  

  return self;
};

BSD.spatialNotes = BSD.SpatialNoteCollection([]);

BSD.SpatialNote = function(spec) {
  var self = BSD.PubSub({});
  
  self.x = parseInt(spec.position[0],10);
  self.y = parseInt(spec.position[1],10);

  self.note = spec.note;
  self.cell = spec.cell;
    
  self.hash = function() {
    return 'SpatialNote#(' + self.x +',' + self.y + ')';
  };
 
  self.value = function() { 
    return spec.note.value();
  };
  
  self.abstractValue = function() {
    return spec.note.abstractValue();
  };
  
  self.abstractlyEqualTo = function(other) {
    return other.abstractValue() == self.abstractValue();
  };

  self.equalTo = function(other) {
    /////console.log('ok, got called',other.value(),self.value());
    return other.value() == self.value();
  };
 
  neighborsFromChord = function(chord) {
  };

  self.nearest = function(other) {
    ///return BSD.spatialNotes.
  };



   
  self.distanceTo = function(otherPoint) {
    var a = self.x - otherPoint.x;
    var b = self.y - otherPoint.y;
    
    var c = Math.sqrt(a*a + b*b); //Pythagorean, solve for c
    return c;     
  };  
  return self;
  
  
};
