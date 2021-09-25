import CP from "./colorpalette.js";
import PianoRoll from "./PianoRoll.js";
import MIDIOutMonitor from "./MIDIOutMonitor.js";
import { lerp, invlerp, remap } from "./scalar.js";
import FreakySeq from "./FreakySeq.js";

import Timer from "./Timer.js";

window.App = {
  ColorPalette: CP,
  FreakySeq,
  PianoRoll,
  Timer,
  invlerp,
  lerp,
  remap,
  MIDIOutMonitor,
};

console.log('inside the module, what is this?', this);