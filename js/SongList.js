import PubSub from "./PubSub.js";
import DOM from "./DOM.js";
import { sorter } from "./Utils.js";

function SongList(spec) {
    var self = PubSub({});

    var ul = DOM.ul().addClass('song-list');

    var songs = [];
    self.songs = songs;

    self.clear = function() {
        songs = [];
        self.songs = songs;
        self.refresh();
    };

    self.addSong = function(o) {
        songs.push(o);
        self.refresh();
    };
    self.refresh = function() {
        ul.empty();

        var byTitle = function(o) { return o.title; }

        var sorted = songs.sort(sorter(byTitle));

        songs.forEach(function(song, i) {
            var li = DOM.li(song.title);
            li.on('click', function() {

                //TODO: make find work when nothing found?
                // what about multiples vs singles.
                let sel =
                    ul.find('.selected');
                sel && sel.removeClass('selected');
                li.addClass('selected');
                self.publish('song-selected', song);
            });
            ul.append(li);
        });
    };

    self.renderOn = function(wrap) {
        wrap.append(ul);
    };

    return self;
};

export default SongList;