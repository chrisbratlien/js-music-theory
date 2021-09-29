import { MIDI_CONST } from "./MIDIConstants.js";
function MIDIRouter(props) {
    let midiAccess, self;

    self = {};

    if (!navigator.requestMIDIAccess) {
        return console.log('MIDIRouter:: no navigator.requestMIDIAccess. STOPPING!');
    }
    ////console.log('boot!!!');
    function onMIDIFailure(e) {
        return console.log('onMIDIFailure', e);
    }

  function onMIDISuccess(aMIDIAccessObject) {
    //console.log("onMIDISuccess", aMIDIAccessObject);
        // when we get a succesful response, run this code
        self.midiAccess = aMIDIAccessObject;
        aMIDIAccessObject.onstatechange = function (e) {
            //console.log('onstatechange e:', e);
            //console.log('onstatechange e.port:', e.port);
          self.newGuyPort = e.port;

          if (self.outPort && self.outPort.state == 'disconnected' && self.newGuyPort.state == "connected") {
            //if ya can't beat em...
            self.outPort = self.newGuyPort;
          }

          // Print information about the (dis)connected MIDI controller
          console.log(e.port.name, e.port.manufacturer, e.port.state);          
        };
  
  
        var inputs = aMIDIAccessObject.inputs.values();
  
        // loop over all available inputs and listen for any MIDI input
        for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
          // each time there is a midi message call the onMIDIMessage function
            ///console.log('input.value', input.value);
          input.value.onmidimessage = props.onMIDIMessage;
        }
  
        var outputs = aMIDIAccessObject.outputs.values();
  
        // loop over all available output and listen for any MIDI output
        for (var output = outputs.next(); output && !output.done; output = outputs.next()) {
          // each time there is a midi message call the onMIDIMessage function
          //console.log('MIDI output value', output.value)
          //myMIDIoutput = output;
  
          output.value.open()
            .then((okayPort) => {
              console.log('okay (output)', okayPort)
              self.outPort = okayPort;
            })
        }
  
      }
    function onRequestMIDIAccessError(e) {
        return console.log('error requesting access', e);
    }
        navigator.requestMIDIAccess({
            //sysex: false
          }).then(onMIDISuccess, onMIDIFailure)
          .catch('error', onRequestMIDIAccessError)
    
  
      ////window.allNotesOff = allNotesOff;
  self.allNotesOff = function () {
       if (!self.outPort) { return false; }
        for (var channel = 1; channel <= 16; channel += 1) {
          let noteOffWithzeroBasedChannel = 127 + channel;
          for (let nv = 0; nv < 128; nv += 1) {
            self.outPort.send([MIDI_CONST.NOTE_OFF | (channel - 1), nv, 0]);
          }
        }
      }
  
  
  
    return self;

}






export default MIDIRouter;