import DOM from './DOM.js'
import PubSub from './PubSub.js'
import Vindow from './Vindow.js'

function VindowInfo() {

    let pre = DOM.pre();
    let pane = DOM.div()
        .append(DOM.h1('Heee'),pre)
    const self =  Vindow({
        title: 'Info'
    });
    self.append(pane);

    function wireUp() {
        var p = pane.raw;
        while (p && p != window) {
            p.addEventListener('resize',function(e){
                pre.append(JSON.stringify(e,null,4));
            });    
            p = p.parentElement;
        }
    }

    setTimeout(wireUp,15000);
    return self;
}

export default VindowInfo;