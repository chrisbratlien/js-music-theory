import DOM from './DOM.js'
import PubSub from './PubSub.js'
import Vindow, { autoArrange, getPropAsFloat, Point } from './Vindow.js'
import Inspector
 from './Inspector.js';


 function VindowInfo() {
    let inspector = Inspector();
    let pane = DOM.div()
        .append([
            inspector.ui()
        ]);
    const self =  Vindow({
        title: 'Info'
    });
    self.append(pane);

    function wireUp() {

        self.on('resize', ({ outer}) => {
            ////console.log("OUTER",outer);
            //var w = getPropAsFloat(outer.raw,'width');
            //var h = getPropAsFloat(outer.raw,'height');
            //var br = outer.raw.getBoundingClientRect();
            //dimensions.text(`origin: ${br.left} x ${br.top} extent: ${w} x ${h}`);

            inspector.update({ 
                origin: self.origin(), 
                corner: self.corner(),
                extent: self.extent(),
                area: self.area()
            });


        });

    }
    wireUp();

    // setInterval(() => {
    //     self.moveTo(Point(50,100));
    // },10000);
    return self;
}

export default VindowInfo;