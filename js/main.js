import CP from "./ColorPalette.js";
import PianoRoll from "./PianoRoll.js";
import MIDIOutMonitor from "./MIDIOutMonitor.js";
import { lerp, invlerp, remap } from "./scalar.js";
import FreakySeq from "./FreakySeq.js";

import Timer from "./Timer.js";
import BSDMixer from "./BSDMixer.js"

window.App = {
  BSDMixer,
  ColorPalette: CP,
  FreakySeq,
  PianoRoll,
  Timer,
  invlerp,
  lerp,
  remap,
  MIDIOutMonitor,
};
