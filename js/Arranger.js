import DOM from './DOM.js'
import PubSub from './PubSub.js'
import Vindow, { autoArrange, getPropAsFloat } from './Vindow.js'
import Point from './Point.js';
import Inspector from './Inspector.js';
import Draggable from "./Draggable.js";
import Sortable from '../lib/sortable.complete.esm.js';
 function Arranger() {


    var sectionNames = "ABCDEFG";

    var sections = []; //just the concepts

    var sectionsDiv = DOM.div()
        .addClass('sections')


    function newBlock() {
        var idx = sections.length;
        var sectionName = sectionNames.substring(idx, idx + 1);
        var sectionDiv = DOM.div()
            .addClass('block arranger-block section')
            .text(sectionName);            
        Draggable(sectionDiv.raw, sectionDiv.raw);
        //FIXME: terminology. 
        //one of these needs to be the concepts, the other, the UI
        sections.push({
            sectionName
        });
        sectionsDiv.append(sectionDiv);
    }


    var toolbar = DOM.div()
        .append([
            DOM.button()
                .addClass('btn btn-plus')
                .append([
                    DOM.i()
                        .addClass('fa fa-plus')
                ])
                .on('click',newBlock)
        ])


    const self =  Vindow({
        title: 'Arranger',
        className: 'arranger'
    });

    self.append(sectionsDiv);
    new Sortable(sectionsDiv.raw, {
        animation: 150,
        onEnd: function(evt) {
            console.log('EVT',evt);
        }
    });
    self.appendToToolbar(toolbar);
    
    return self;
}

export default Arranger;