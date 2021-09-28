function MIDIRouter(props) {
    let midi, midiAccess, outPort;

    if (!navigator.requestMIDIAccess) {
        return console.log('MIDIRouter:: no navigator.requestMIDIAccess. STOPPING!');
    }
    ////console.log('boot!!!');
    function onMIDIFailure(e) {
        return console.log('onMIDIFailure', e);
    }
    function wASonMIDISuccess(e) {
        return console.log('success',e)
    }

    function onMIDISuccess(aMIDIAccessObject) {
        // when we get a succesful response, run this code
        midi = aMIDIAccessObject; // this is our raw MIDI data, inputs, outputs, and sysex status
        midiAccess = aMIDIAccessObject;
        midiAccess.onstatechange = function (e) {
            //console.log('onstatechange e:', e);
            //console.log('onstatechange e.port:', e.port);
            
          // Print information about the (dis)connected MIDI controller
          console.log(e.port.name, e.port.manufacturer, e.port.state);
        };
  
  
        var inputs = midiAccess.inputs.values();
  
        // loop over all available inputs and listen for any MIDI input
        for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
          // each time there is a midi message call the onMIDIMessage function
            ///console.log('input.value', input.value);
          input.value.onmidimessage = props.onMIDIMessage;
        }
  
        var outputs = midiAccess.outputs.values();
  
        // loop over all available output and listen for any MIDI output
        for (var output = outputs.next(); output && !output.done; output = outputs.next()) {
          // each time there is a midi message call the onMIDIMessage function
          //console.log('MIDI output value', output.value)
          //myMIDIoutput = output;
  
          output.value.open()
            .then((okayPort) => {
              ///console.log('okay', okayPort)
              outPort = okayPort;
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
    
    return {
        midiAccess,
        outPort
    }

}
export default MIDIRouter;