import CP from "./colorpalette.js";
import PianoRoll from "./PianoRoll.js";
import MIDIOutMonitor from "./MIDIOutMonitor.js";
import { lerp, invlerp, remap } from "./scalar.js";
import FreakySeq from "./FreakySeq.js";

window.App = {
  ColorPalette: CP,
  FreakySeq,
  PianoRoll,
  invlerp,
  lerp,
  remap,
  MIDIOutMonitor,
};
