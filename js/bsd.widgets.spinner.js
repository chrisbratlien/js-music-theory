

 BSD.Widgets.Spinner = function(spec) {
    var self = {};
    var length = spec.items.length;
    
    var spins = 0;
    
    
    var callback = spec.callback || function(o) {};
    
    self.timeout = spec.timeout || 1000;

    var c,p,n = false;
    switch(length) {
      case 0:
        console.log('err-OR! does not compute. ');
        break;
      case 1:
        c = 0; n = 0; p = 0;
        break;
      case 2: 
        c = 0; n = 1; p = 1;
        break;
      default:
        c = 0; n = 1; p = length - 1;
        break;
    }
    var paused = false;
    
    self.pause = function() {
      paused = true;
    };
    
    self.play = function() {
      //console.log('going to play again');
      paused = false;
      self.goAgain();
    };
    self.spin = self.play;

    self.goAgain = function() { 
    
      callback({ prev: spec.items[p], current: spec.items[c], next: spec.items[n] });

      ////////console.log('c',c,'n',n,'p',p);

      ///console.log(spec.oneShot,spins,length);
      if (spec.oneShot && spins == length) {
        return false;
      }
      
      var current = spec.items[c];
      
      /////console.log(current,current.timeoutScale);
      
      if (paused) {
        return false;
      }
      
      if (typeof current.timeoutScale != "undefined") {
        //allow per-item timeout adjustment
        setTimeout(self.goAgain,self.timeout * current.timeoutScale);          
      }
      else {
        setTimeout(self.goAgain,self.timeout);          
      }
    
      //do this stuff last
      c += 1; c %= length;
      n += 1; n %= length;
      p += 1; p %= length;
      spins += 1;
    };
    return self;
  };
