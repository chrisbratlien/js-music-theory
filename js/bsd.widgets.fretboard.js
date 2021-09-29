BSD.Widgets.Fretboard = function(spec) {
  var cells = [];
  var showIntervals = false;

  var self = BSD.PubSub({});
  self.spec = spec;

  self.selectedNotes = function() {
    ///console.log('selectedNotes data',spec.data);

    var numbers = spec.data
      .select(function(o) {
        return o.selected;
      })
      .map(function(o) {
        if (typeof o.noteValue !== "undefined") {
          return o.noteValue;
        }
        return o.midiValue;
      });

    ////Object.keys(state).select(function(n){ return state[n]; });

    //console.log('numbers',numbers);
    var result = numbers.map(function(n) {
      return Note(n, spec.chord && spec.chord.getAccidental());
    });
    return result;
  };

  self.styleCell = function(cell, fretData) {
    cell.addClass("color-white").removeClass("color-black");
    let boolCustomColor =
      fretData.selected ||
      fretData.isScaleNote ||
      fretData.isChordNote ||
      fretData.isUpcoming ||
      fretData.isCustomColor;

    if (boolCustomColor) {
      var hex = BSD.chosenColor.toHex();
      var sum = BSD.chosenColor.r + BSD.chosenColor.g + BSD.chosenColor.b;
      if (fretData.color) {
        var hex = fretData.color.toHex();
        var sum = fretData.color.r + fretData.color.g + fretData.color.b;
      }

      ////console.log('hex',hex,'sum',sum);

      cell.css("background-color", "#" + hex);
      //cell.css('color','white');
      //cell.removeClass('color-white');
      cell.removeClass("color-grey");

      sum > 500
        ? cell.addClass("color-black").removeClass("color-white")
        : cell.addClass("color-white").removeClass("color-black");
    } else {
      ///cell.css('background-color','inherit');
      cell.css("background-color", null);
      cell.attr("style", null);
      //cell.removeClass('color-white');
    }
    if (!fretData.selected) {
      cell.addClass("color-white").removeClass("color-black");
    }
  };

  self.pick = function(progItem) {
    ///console.log('PICK! progItem',progItem,'meta',meta);
    // Now create the inputs to the neural network
    let prevChord = progItem.prev.chord;
    let currentChord = progItem.chord;
    let nextChord = progItem.next.chord;

    let inputs = [];
    let idx = 0;
    let prevChordBitmap = JSMT.noteBitmap(prevChord);
    let currentChordBitmap = JSMT.noteBitmap(currentChord);
    let nextChordBitmap = JSMT.noteBitmap(nextChord);
    /////////////////////
    var cNotP = currentChordBitmap.map(function(v, i) {
      return v && !prevChordBitmap[i] ? 1 : 0;
    });
    var cNotN = currentChordBitmap.map(function(v, i) {
      return v && !nextChordBitmap[i] ? 1 : 0;
    });
  };

  self.updateCursor = function(cursor) {
    var currentChord = cursor.chord;
    var nextChord = cursor.nextChordChange;

    let currentChordBitmap = JSMT.noteBitmap(currentChord);
    let nextChordBitmap = JSMT.noteBitmap(nextChord);
    var cNotN = currentChordBitmap.map(function(v, i) {
      return v && !nextChordBitmap[i] ? 1 : 0;
    });
    var nNotC = nextChordBitmap.map(function(v, i) {
      return v && !currentChordBitmap[i] ? 1 : 0;
    });

    var newData = spec.data.slice().map(function(o) {
      o.selected = false;
      o.color = BSD.colorFromHex("#ffffff");
      if (currentChordBitmap[o.chromaticValue]) {
        o.selected = true;
        o.color = BSD.colorFromHex("#008833");
      }
      if (cNotN[o.chromaticValue]) {
        o.selected = true; //already is, but anyway
        o.color = BSD.colorFromHex("#00aa55");
      }
      if (nNotC[o.chromaticValue]) {
        o.isUpcoming = true; //needs to be explicitly set here..
        o.color = BSD.colorFromHex("#ffbb00");
      }
      return o;
    });

    self.publish("update-cursor-cells", newData);
  };

  self.getFretData = function(string, fret) {
    var result = spec.data.detect(function(o) {
      return o.string == string && o.fret == fret;
    });
    return result;
  };

  self.showIntervals = function() {
    showIntervals = true;
    self.publish("show-interval", true);
  };
  self.showNames = function() {
    showIntervals = false;
    self.publish("show-interval", false);
  };
  let myWrap;
  self.renderOn = function(wrap) {
    myWrap = wrap;
    var inner = DOM.div().addClass("inner");
    var table = DOM.table().addClass("fretboard-table");
    table.attr("cellspacing", 0);
    table.attr("cellpadding", 0);

    var intervalMap = "1,b9,9,b3,3,4,b5,5,#5,6,b7,7".split(/,/);

    table.empty();
    //console.log('cscale',cscale);

    var openValues = BSD.guitarData
      .select(function(o) {
        return o.fret == 0;
      })
      .map(function(o) {
        return o.noteValue;
      });
    openValues.forEach(function(open, stringIdx) {
      var row = DOM.tr();
      [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
      ].each(function(fret) {
        let fretData = self.getFretData(stringIdx + 1, fret);
        //console.log('fretData',fretData);

        var cell = DOM.td();

        cell.addClass("fret fret-" + fret);
        cell.addClass("string string-" + (stringIdx + 1));

        var midiValue = open + fret;
        var note = Note(midiValue);

        var noteName = note.name(spec.chord && spec.chord.getAccidental());

        //noteName = JSMT.toUTF8(noteName);

        if (true || noteNames.indexOf(noteName) > -1) {
          cell.html(JSMT.toUTF8(noteName));
        }
        self.subscribe("show-interval", function(wish) {
          if (wish) {
            cell.text(intervalMap[fretData.interval]);
            //cell.text(intervalMap[fretData.chromaticValue]);
          } else {
            cell.text(JSMT.toUTF8(noteName));
          }
        });

        cell.click(function() {
          //console.log('click!!');
          fretData.selected = !fretData.selected; //toggle its state
          self.styleCell(cell, fretData);
        });

        self.subscribe("scale-change", function(scale) {
          fretData.isScaleNote = scale && scale.containsNote(note);
          self.styleCell(cell, fretData);
        });

        self.subscribe("update-cursor-cells", function(newData) {
          let phretData = newData.detect(function(nd) {
            return nd.string == stringIdx + 1 && nd.fret == fret;
          });

          cell.removeClass("color-black").addClass("color-white");
          self.styleCell(cell, phretData);
          //self.styleCell(cell,newData);
        });

        self.styleCell(cell, fretData);
        self.subscribe("feature-fret", function(o) {
          var hit = o.string == stringIdx + 1 && o.fret == fret;
          if (hit) {
            ///console.log('yay');
          }
          hit
            ? cell.addClass("featured was-once-featured")
            : cell.removeClass("featured");
        });

        self.subscribe("visible-fret-range", function(fretRange) {
          var visible =
            fretData.fret >= fretRange[0] && fretData.fret <= fretRange[1];
          visible ? cell.removeClass("invisible") : cell.addClass("invisible");
        });

        cell.hover(function() {
          self.publish("note-hover", note);
        });

        row.append(cell);
        cells.push(cell);
        //console.log(note.name());
      });
      table.append(row);
    });

    inner.append(
      DOM.h3((spec.chord && spec.chord.fullAbbrev()) || "no chord").addClass(
        "chord-name"
      )
    );

    inner.append(table);
    var controls = DOM.div().addClass("controls noprint");

    var playAll = DOM.button('<i class="fa fa-play"></i>').addClass(
      "btn btn-success control play-all"
    );
    playAll.click(function() {
      self.publish("play-notes", self.selectedNotes());
    });

    var scaleInput = DOM.input()
      .attr("type", "text")
      .addClass("scale-input noprint");
    scaleInput.on("blur change", function() {
      var scale = this.value.length ? makeScale(this.value) : false;
      self.publish("scale-change", scale);
    });
    inner.append(scaleInput); //i want this visible big or small.

    controls.append(playAll);

    var stickyNoteButton = DOM.button(
      '<i class="fa fa-sticky-note-o"></i>'
    ).addClass("btn btn-info");
    stickyNoteButton.click(function(e) {
      ///console.log(e,'sticky');

      var sticky = BSD.Widgets.StickyNote(e);
      sticky.renderOn(jQuery(document.body));
    });
    controls.append(stickyNoteButton);

    inner.append(controls);
    inner.append(DOM.div("&nbsp;").addClass("spacer"));

    var close = DOM.div('<i class="fa fa-3x fa-close"></i> ').addClass(
      "noprint"
    );
    close.click(function() {
      self.close();
    });
    controls.append(close);

    wrap.append(inner);

    self.close = function() {
      inner.remove();
    };
  };
  self.getWrap = function(callback) {
    callback(myWrap);
  };
  self.unfeatureFrets = function() {
    if (!myWrap) {
      return false;
    }
    myWrap.find(".featured").removeClass("featured");
  };
  self.featureFret = function(cursor) {
    self.publish("feature-fret", cursor);
  };

  return self;
};

function makeFretboardOn(wrap, opts) {
  var chord = opts.chord;
  var activeStrings = opts.activeStrings || [1, 2, 3, 4, 5, 6];
  var defaultData = JSON.parse(JSON.stringify(BSD.guitarData));
  ///console.log('defaultData',defaultData);

  abstractNoteValues = (chord && chord.abstractNoteValues()) || [];
  var newData = defaultData.map(function(o) {
    var hit = abstractNoteValues.detect(function(av) {
      if (o.chromaticValue !== av) {
        return false;
      }
      if (!chord) {
        return false;
      } //chord not mandatory
      if (
        !activeStrings.detect(function(s) {
          return o.string == s;
        })
      ) {
        return false;
      }
      var interval = o.chromaticValue - chord.rootNote.abstractValue();
      while (interval < 0) {
        interval += 12;
      }
      while (interval > 11) {
        interval -= 12;
      }
      //console.log('interval',interval);
      o.interval = interval;
      return true;
    });
    if (typeof hit == "number") {
      o.selected = true;
    }
    if (opts.colorHash[o.interval]) {
      o.color = opts.colorHash[o.interval];
      o.colorHex = "#" + o.color.toHex();
    }
    return o;
  });

  var board = BSD.Widgets.Fretboard({
    data: newData, //defaultData,
    activeStrings: activeStrings,
    chord: chord,
  });
  board.renderOn(wrap);

  board.subscribe("play-notes", function(notes) {
    campfire.publish("play-notes", notes);
  });
  board.subscribe("note-hover", function(o) {
    campfire.publish("note-hover", o);
  });

  return board;
}
