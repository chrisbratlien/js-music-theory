import DOM from "./DOM.js";
import MIDI_CONST from "./MIDIConstants.js";

function MIDIInfo(props) {

    let toolbar, pane;
    let txtChannel, txtPatch;

    let self = {};

    toolbar = DOM.div()
        .addClass('not-a-btn-group flex-row align-items-center space-around')
        .append([
            //DOM.button('woo')
            //.addClass('btn btn-sm'),
            DOM.label('Patch Change '),
            '&nbsp;',
            'Channel ',
            txtChannel = DOM.input()
            .attr('type', 'number')
            .attr('min', 1)
            .attr('max', 16)
            .val(props.channel || 1)
            .on('change', function(e) {
                props.channel = +e.target.value;
            }),
            'Patch ',
            txtPatch = DOM.input()
            .attr('type', 'number')
            .attr('min', 1)
            .attr('max', 128)
            .val(props.patch || 1)
            .on('change', function(e) {
                props.patch = +e.target.value;
                let zbChan = props.channel - 1;
                let zbPatch = props.patch - 1;
                props.router.outPort.send([MIDI_CONST.PROGRAM_CHANGE + zbChan, zbPatch]);
            })
        ])

    pane = DOM.div()
        .addClass('midi-info lcd')

    props.router.on('statechange', function(e, outPort) {
        if (!e.port) { return false; }

        let str = `${e.port.manufacturer} ${e.port.name} [${e.port.type}] ${e.port.state}`;
        pane
        //.empty()
            .html(str);
    });
    self.ui = function() {
        return [toolbar, pane];
    };

    return self;

}



export default MIDIInfo;