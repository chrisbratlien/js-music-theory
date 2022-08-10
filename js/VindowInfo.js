import DOM from './DOM.js'
import PubSub from './PubSub.js'
import Vindow, { getPropAsFloat } from './Vindow.js'

function VindowInfo() {


    let dimensions = DOM.span();
    let pre = DOM.pre();
    let pane = DOM.div()
        .append([
            dimensions,
            pre
        ]);
    const self =  Vindow({
        title: 'Info'
    });
    self.append(pane);

    function wireUp() {

        self.on('resize', ({ outer }) => {
            ////console.log("OUTER",outer);
            var w = getPropAsFloat(outer.raw,'width');
            var h = getPropAsFloat(outer.raw,'height');

            var br = outer.raw.getBoundingClientRect();




            dimensions.text(`origin: ${br.left} x ${br.top} extent: ${w} x ${h}`);
        });

    }
    wireUp();

    ///setTimeout(wireUp,15000);
    return self;
}

export default VindowInfo;