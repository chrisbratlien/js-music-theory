import { MIDI_CONST } from "./MIDIConstants.js";
import PubSub from "./PubSub.js";

function MIDIRouter(props) {
    let midiAccess, self;

    self = PubSub();

    if (!navigator.requestMIDIAccess) {
        return console.log('MIDIRouter:: no navigator.requestMIDIAccess. STOPPING!');
    }
    ////console.log('boot!!!');
    function onMIDIFailure(e) {
        return console.log('onMIDIFailure', e);
    }


    function shouldBecomeOutPort(port) {
        if (port.type == 'input') { return false; }
        //FIXME: kludge for ignoring the KORG MICROKEY CTRL as output
        if (port.name.match(/CTRL/)) { return false; }
        if (self.outPort && self.outPort.state == 'connected') {
            return false;
        }
        return port.state === "connected";
    }

    function onMIDISuccess(aMIDIAccessObject) {
        //console.log("onMIDISuccess", aMIDIAccessObject);
        // when we get a succesful response, run this code
        self.midiAccess = aMIDIAccessObject;
        aMIDIAccessObject.onstatechange = function(e) {
            //console.log('onstatechange e:', e);
            //console.log('onstatechange e.port:', e.port);

            if (shouldBecomeOutPort(e.port)) {
                //if ya can't beat em...
                self.outPort = e.port;
            }
            if (e.port.type == 'input' && self.inPort && self.inPort.state == 'disconnected' && e.port.state == "connected") {
                //if ya can't beat em...
                self.inPort = e.port;
            }


            // Print information about the (dis)connected MIDI controller
            console.log(e.port.name, e.port.manufacturer, e.port.state);
            if (props.onstatechange) {
                props.onstatechange(e, self.outPort); //FIXME: stop sending outport as 2nd arg eventually
            }
            self.publish('statechange', e, self.outPort); //FIXME: stop sending outport as 2nd arg eventually
        };


        var inputs = aMIDIAccessObject.inputs.values();

        // loop over all available inputs and listen for any MIDI input
        for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
            // each time there is a midi message call the onMIDIMessage function
            ///console.log('input.value', input.value);
            self.inPort = input.value;
            self.inPort.onmidimessage = props.onMIDIMessage;
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
                    if (shouldBecomeOutPort(okayPort)) {
                        //if ya can't beat em...
                        self.outPort = okayPort;
                    }

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
    self.allNotesOff = function() {
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