export const MIDI_CONST = {
    NOTE_OFF: 0x80,
    NOTE_ON: 0x90,
    AFTERTOUCH: 0xA0,
    CONTROL_CHANGE: 0xB0,
    PITCH_BEND: 0xE0,
    MOD_WHEEL: 0xB0,
    PROGRAM_CHANGE: 0xC0,
    CC_PAN: 10
  };
export const MIDI_MSG = MIDI_CONST;


export const TICK_RESOLUTION = Object.freeze({
  QUARTER: 96,
  QUARTER_3: 64,
  EIGHTH: 48,
  EIGHTH_3: 32,
  SIXTEENTH: 24,
  SIXTEENTH_3: 16
});



export default MIDI_CONST;