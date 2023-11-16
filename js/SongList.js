import { ascending } from "./Utils.js";
import ListGroup from "./ListGroup.js";

var byTitle = function (o) {
  return o.data.title.toLowerCase();
};

function SongList(spec) {
  var self = ListGroup({
    className: 'song-list'
  });
  self.addSong = function (song) {
    self.addItems({
      content: song.title,
      data: song,
    });
    self.sort(ascending(byTitle));
    self.refresh();
  };

  self.on('item-selected', (data) => self
    .emit('song-selected', data))

  return self;
}

export default SongList;
