if (typeof BSD == "undefined") { var BSD = {}; }
if (typeof BSD.Widgets == "undefined") {  BSD.Widgets = {}; }

BSD.Widgets.StickyNote = function(spec) {
  var self = {};
  self.renderOn = function(wrap) {
        var div = jQuery('<div class="sticky-note"></div>');
        var textarea = jQuery('<textarea></textarea>');
        textarea.click(function() {
          textarea.focus();
        });
        div.append(textarea);
        wrap.append(div); 
        
        if (spec.pageY) {
          BSD.e = spec;
          div.css('top',spec.pageY + 'px');
        
        }
        
        
        /////console.log(stickyNoteDiv[0]);
        
        var drug = Draggy(div[0],{});
        drug.hookupEvents();
  };
  return self;
};

BSD.Widgets.currentDraggyImage = false;
BSD.Widgets.DraggyImage = function(spec) {
  var zIndex = 0;
  var self = {};
  self.renderOn = function(wrap) {
        var div = DOM.div().addClass('draggy-image');////jQuery('<div class="sticky-note"></div>');




        /*
        var handle = DOM.div().addClass('draggy-image-handle');
        handle.css('width','30px');
        handle.css('height','30px');
        handle.css('background-color','#456');
        handle.css('position','relative');
        handle.css('top',0);
        handle.css('left',0);
        
        handle.click(function() { div.css('position','absolute'); });
        div.append(handle);
        */


        var image = DOM.img().attr('src',spec.url);
        div.append(image);
        div.click(function() { 
          zIndex += 1;
        
          div.css('position','absolute'); 
          div.css('z-index',zIndex);
        });
        
        
        wrap.append(div); 
        
        var drug = Draggy(div[0],{});
        drug.hookupEvents();
        
        
        
  }
  return self;
};



