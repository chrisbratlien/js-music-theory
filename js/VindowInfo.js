import DOM from './DOM.js'
import PubSub from './PubSub.js'
import Vindow, { autoArrange, getPropAsFloat} from './Vindow.js'
import Point from './Point.js';
import Inspector from './Inspector.js';

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

    self.on('resize', ({ outer}) => {
        inspector.update({ 
            origin: self.origin(), 
            corner: self.corner(),
            extent: self.extent(),
            area: self.area()
        });
    });
    return self;
}

export default VindowInfo;