import PubSub from "./PubSub.js";
import Draggable from "./Draggable.js";
import DOM from "./DOM.js";

function bringToTop(elem) {
    document.querySelectorAll('.vindow')
        .forEach(o => {
            o.style.zIndex = o == elem ? 1 : 0;
        });
}

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
            .addClass('btn btn-exit btn-close')
            .on('click', () => {
                self.emit('close', self, props)
                outer.raw.remove();
            })
        );

    outer = DOM.div()
        .addClass('vindow')
        .append(
            header = DOM.div()
            .addClass('header flex-row align-items-center space-between')
            .append([
                DOM.span()
                .addClass('title')
                .append(props.title),
                buttons
            ]),
            toolbar = DOM.div()
            .addClass('toolbar')
            .css('display', 'none'),
            pane = DOM.div()
            .addClass('pane')
        )
        .on('mousedown', () => {
            bringToTop(outer.raw)
        })



    self.append = function() {
        let children = [...arguments]
        pane.append(children);
        // tempted to return pane, but could get confusing.
        // safer and more consistent to return self
        // even safer to not return anything for now.
    }
    self.appendToToolbar = function() {
        let children = [...arguments];
        toolbar
            .append(children)
            .show();
    }

    self.ui = function() {
        return outer;
    }
    self.pane = pane;
    self.renderOn = function(wrap) {
        wrap.append(outer);
        Draggable(outer.get(0), header.get(0));
    }
    return self;
}
export default Vindow;