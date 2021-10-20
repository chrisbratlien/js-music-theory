import DOM from "./DOM.js";
import MIDI_CONST from "./MIDIConstants.js";

function MIDIInfo(props) {

    let toolbar, pane;
    let txtChannel, txtPatch, spanCurrentOutputPort;

    let self = {};


    function cycleOutPort() {

        if (!props.router || !props.router.midiAccess) {
            throw "no router midiAccess";
        }
        let currentPortID = props.router.outPort && props.router.outPort.id || 'none';
        //console.log('currentPortID', currentPortID);

        let asArray = [...props.router.midiAccess.outputs];
        //console.log('MA!!!', props.router.midiAccess, 'asArray', asArray);
        let openAndConnectedPairs = asArray.filter(pair => {
            let [id, output] = pair;
            return output.connection === 'open' && output.state === 'connected';
            //console.log('id', id, 'output', output);
        });

        let newPair = openAndConnectedPairs.find(pair => {
            let [id, output] = pair;
            return output.id !== currentPortID
        });
        
        if (!newPair) { throw "no other ports"; }
        let [id, output] = newPair;
        props.router.outPort = output;
        //pane.html(output.name);
        spanCurrentOutputPort.html(output.name);
    }



    let outputToolbar = DOM.div()
        .addClass('flex-row align-items-center space-evenly output-toolbar')
        .append([
            DOM.label('Output Port '),
            '&nbsp;',
            DOM.button()
                .addClass('btn btn-sm btn-default btn-output-cycle')
                .append(
                    DOM.i()
                        .addClass('fa fa-refresh')
                )
                .on('click', cycleOutPort),
            spanCurrentOutputPort = DOM.span()
                    .addClass('lcd current-output-port')
        ])


    let patchToolbar = DOM.div()
        .addClass('flex-row align-items-center space-around')
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
                .on('change', function (e) {
                    props.channel = +e.target.value;
                }),
            'Patch ',
            txtPatch = DOM.input()
                .attr('type', 'number')
                .attr('min', 1)
                .attr('max', 128)
                .val(props.patch || 1)
                .on('change', function (e) {
                    props.patch = +e.target.value;
                    let zbChan = props.channel - 1;
                    let zbPatch = props.patch - 1;
                    props.router.outPort.send([MIDI_CONST.PROGRAM_CHANGE + zbChan, zbPatch]);
                })
        ]);

    //oh no, MIDI Office!!
    toolbar = DOM.div()
        .addClass('flex-column toolbars')
        .append([
            patchToolbar,
            outputToolbar
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