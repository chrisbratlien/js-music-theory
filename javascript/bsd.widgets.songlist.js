BSD.Widgets.SongList = function(spec) {
  var self = BSD.PubSub({});

  var ul = DOM.ul().addClass('song-list');

  songs = [];
  
  self.addSong = function(o) {
    songs.push(o);
    self.refresh();
  };
  self.refresh = function() {
    ul.empty();
    songs.each(function(song){
      var li = DOM.li(song.title);
      li.on('click',function(){
        ul.find('.selected').removeClass('selected');
        li.addClass('selected');
        self.publish('song-selected',song);
      });      
      ul.append(li);
    });
  };

  self.renderOn = function(wrap) {
    wrap.append(ul);
  };

  return self;
};


BSD.songlist = BSD.Widgets.SongList({});


var gentleRain =  'A-6|A-6|B-7b5|E7|' +
  'A-7 D7|G-7 C7|F6|F6|' +
  'F#-7b5|B7b9|E-7b5|A7b9|' +
  'D-7b5|B-7b5 E7|' + 
    //first ending
  'A-6|Bb7|' +

  //with 2nd ending
  'A-6|A-6|B-7b5|E7|' +
  'A-7 D7|G-7 C7|F6|F6|' +
  'F#-7b5|B7b9|E-7b5|A7b9|' +
  'D-7b5|B-7b5 E7|' + 
  //2nd ending
  'A-7 D7|G-7 C7|' +
  'F6|C7|F6|E-7|A-7|E7';
BSD.songlist.addSong({
  title: 'Gentle Rain',
  progression: gentleRain
});



var lullaby = 'F-7|G7 C7|F-|Bb-7 Eb7|' +
  'AbM7 F-7|Bb-7 Eb7|' +
  
  //1st ending
  'AbM7|Db7 C7|' +

  //with 2nd ending  
  'F-7|G7 C7|F-|Bb-7 Eb7|' +
  'AbM7 F-7|Bb-7 Eb7|' +
  
  //2nd ending
  'AbM7 Eb7|AbM7|F7|Bb-7|' +
  'Bb-7 Eb7|AbM7|F7|Bb-7|' +
  'Bb-7 Eb7|AbM7 C7|F-7|G7 C7|' +
  'F-7|Bb-7 Eb7|AbM7 F-7|Bb-7 Eb7|' +
  'AbM7 Eb7|AbM7';
BSD.songlist.addSong({
    title: 'Lullaby of Birdland',
    progression: lullaby  
});

var equinox = 'C-7|C-7|C-7|C-7|F-7|F-7|C-7|C-7|Ab7|G7|C-7|C-7';
BSD.songlist.addSong({
    title: 'Equinox',
    progression: equinox
});


var blueBossa = 'C-7|C-7|F-7|F-7|' +
  'D-7b5|G7|C-7|C-7|' +
  'Eb-7|Ab7|DbM7|DbM7|' +
  'D-7b5|G7|C-7|D-7b5 G7'
BSD.songlist.addSong({
    title: 'Blue Bossa',
    progression: blueBossa
});





