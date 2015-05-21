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

var atprog =     
  'CM7|CM7|D7b5|D7b5|D-7|G7|CM7|CM7|' +
  'CM7|CM7|D7b5|D7b5|D-7|G7|CM7|C7|' +
  'FM7|FM7|FM7|FM7|' +
  'D7|D7|D-7|G7 G7b9|' +
  'CM7|CM7|D7b5|D7b5|D-7|G7|CM7|CM7';
BSD.songlist.addSong({
  title: 'Take the "A" Train',
  progression: atprog  
});

var orpheusProg = 'A-7|B-7b5 E7b9|A-7|B-7b5 E7b9|A-7|D-7 G7|CM7|C#o7 A7b9|D-7|G7|C6|FM7|B-7b5|E7b9|A-7|B-7b5 E7b9|A-7|B-7b5 E7b9|A-7|B-7b5 E7b9|E-7b5|A7b9|D-7|D-7|D-7|B-7b5 E7b9|A-7|FM7|B-7b5|E7b9|A-7|B-7b5 E7b9';
BSD.songlist.addSong({
  title: 'Black Orpheus',
  progression: orpheusProg
});
  
var allOfMeProg = 'CM7|CM7|E7|E7|A7|A7|D-7|D-7|E7|E7|A-7|A-7|D7|D7|D-7|G7|CM7|CM7|E7|E7|A7|A7|D-7|D-7|FM7|F-7|E-7|A7|D-7|G7|C6 D#o7|D-7 G7';
BSD.songlist.addSong({
  title: 'All of Me',
  progression:  allOfMeProg
});

var stLouisProg ='G7|G7|G7|G7|C7|C7|G7|E7+9|A-7|D7|G7 Bb7|A-7 D7'; 
BSD.songlist.addSong({
    title: 'St. Louis Blues',
    progression: stLouisProg,
});

BSD.songlist.addSong({
    progression: 'F-7|F-7|Eb7|Eb7|Db7|C7sus4|F-7|F-7|F-7|F-7|Eb7|Eb7|Db7|C7sus4|F-7|F-7|Eb7|Eb7|F-7|F-7|Eb7 Db7|C7|F-7|F-7',
    title: 'Song For My Father'
});

BSD.songlist.addSong({
  progression: 'CM7|CM7|F-7|Bb7|CM7|CM7|Bb-7|Eb7|AbM7|AbM7|A-7|D7|D-7|G7|CM7 EbM7|AbM7 DbM7',
  title: 'Lady Bird'
});



BSD.songlist.addSong({
  progression: (
    'A-7|D7|GM7|CM7|F#-7b5|B7b9|E-7|E-7|' +
    'A-7|D7|GM7|CM7|F#-7b5|B7b9|E-7|E-7|' +
    'F#-7b5|B7b9|E-7|E-7|A-7|D7|GM7|CM7|' +
    'F#-7b5|B7b9|E-7 Eb7|D-7 Db7|' +
    'CM7|B7b9|E-7|E-7'
    ),
  title: 'Autumn Leaves'
});


BSD.songlist.addSong({
  progression: (
    'D-7|D-7|D-7|D-7|D-7|D-7|D-7|D-7|' + 
    'D-7|D-7|D-7|D-7|D-7|D-7|D-7|D-7|' + 

    'EbM7|EbM7|EbM7|EbM7|DM7|DM7|DM7|DM7|' +     
    'EbM7|EbM7|EbM7|EbM7|DM7|DM7|DM7|DM7'
    ),
  title: 'Little Sunflower'
});


BSD.songlist.addSong({
  progression: (
    'F7|Bb7|F7|F7|' + 
    'Bb7|Bb7|F7|F7|' + 
    'G-7|C7|F7|C7' 
    ),
  title: 'Walkin\''
});







