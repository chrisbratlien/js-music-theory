import PubSub from "./PubSub.js";
import Draggable from "./Draggable.js";

//fixme. refactor away from the old global dom.js so we can
//use the DOM.js module
// can't import this until refactor ready ...import DOM from "./DOM.js";

function Vindow(props) {
    let self = PubSub();
    self.props = props;
    let outer, header, toolbar, pane, btnExit;

    let buttons = DOM.div()
        .addClass('btn-group')
        .append(
        
            btnExit = DOM.button()
                .append(
                    DOM.i()
                        .addClass('fa fa-close')
                )
                .addClass('btn btn-exit')
                .on('click', () => self.emit('close', self, props))
                

    )

    outer = DOM.div()
        .addClass('vindow')
        .append(
            header = DOM.div()
                .addClass('header flex-row align-items-center space-between')
                .append([
                    DOM.span()
                        .addClass('title')
                        .append(props.title),
                    btnExit
                ]), null, null,
            toolbar = DOM.div()
                .addClass('toolbar')
                .css('display','none'),
            pane = DOM.div()
                .addClass('pane')
        )
    
    
    
    self.append = function (content) {
        pane.append(content);
        // tempted to return pane, but could get confusing.
        // safer and more consistent to return self
        // even safer to not return anything for now.
    }
    self.appendToToolbar = function (content) {
        toolbar
            .append(content)
            .show();
    }

    self.ui = function () {
        return outer;
    }
    self.renderOn = function (wrap) {
        wrap.append(outer);
        Draggable(outer.get(0), header.get(0));        
    }
    return self;
}
export default Vindow;