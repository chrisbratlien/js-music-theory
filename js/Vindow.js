import PubSub from "./PubSub.js";
import Draggable from "./Draggable.js";
import DOM from "./DOM.js";

function bringToTop(elem) {
    document.querySelectorAll('.vindow')
        .forEach(o => {
            o.style.zIndex = o == elem ? 1 : 0;
        });
}



/*Make resizable div by Hung Nguyen
https://medium.com/the-z/making-a-resizable-div-in-js-is-not-easy-as-you-think-bda19a1bc53d
https://codepen.io/ZeroX-DG/pen/vjdoYe
*/
function makeResizableDiv(element, resizers) {
    //const element = document.querySelector(div);
    //const resizers = document.querySelectorAll(div + ' .resizer')
    const minimum_size = 20;
    let original_width = 0;
    let original_height = 0;
    let original_x = 0;
    let original_y = 0;
    let original_mouse_x = 0;
    let original_mouse_y = 0;
    for (let i = 0; i < resizers.length; i++) {
        const currentResizer = resizers[i];
        currentResizer.addEventListener('mousedown', function(e) {
            e.preventDefault()
            original_width = parseFloat(getComputedStyle(element, null).getPropertyValue('width').replace('px', ''));
            original_height = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
            original_x = element.getBoundingClientRect().left;
            original_y = element.getBoundingClientRect().top;
            original_mouse_x = e.pageX;
            original_mouse_y = e.pageY;
            window.addEventListener('mousemove', resize)
            window.addEventListener('mouseup', stopResize)
        })

        function resize(e) {
            if (currentResizer.classList.contains('bottom-right')) {
                const width = original_width + (e.pageX - original_mouse_x);
                const height = original_height + (e.pageY - original_mouse_y)
                if (width > minimum_size) {
                    element.style.width = width + 'px'
                }
                if (height > minimum_size) {
                    element.style.height = height + 'px'
                }
            } else if (currentResizer.classList.contains('bottom-left')) {
                const height = original_height + (e.pageY - original_mouse_y)
                const width = original_width - (e.pageX - original_mouse_x)
                if (height > minimum_size) {
                    element.style.height = height + 'px'
                }
                if (width > minimum_size) {
                    element.style.width = width + 'px'
                    element.style.left = original_x + (e.pageX - original_mouse_x) + 'px'
                }
            } else if (currentResizer.classList.contains('top-right')) {
                const width = original_width + (e.pageX - original_mouse_x)
                const height = original_height - (e.pageY - original_mouse_y)
                if (width > minimum_size) {
                    element.style.width = width + 'px'
                }
                if (height > minimum_size) {
                    element.style.height = height + 'px'
                    element.style.top = original_y + (e.pageY - original_mouse_y) + 'px'
                }
            } else {
                const width = original_width - (e.pageX - original_mouse_x)
                const height = original_height - (e.pageY - original_mouse_y)
                if (width > minimum_size) {
                    element.style.width = width + 'px'
                    element.style.left = original_x + (e.pageX - original_mouse_x) + 'px'
                }
                if (height > minimum_size) {
                    element.style.height = height + 'px'
                    element.style.top = original_y + (e.pageY - original_mouse_y) + 'px'
                }
            }
        }

        function stopResize() {
            window.removeEventListener('mousemove', resize)
        }
    }
}

//makeResizableDiv('.resizable')

let resizerSlugs = [
    'bottom-left',
    'top-left',
    'top-right', //seems buggy. can't increase X to the right
    'bottom-right'
];




function Vindow(props) {
    let self = PubSub();
    self.props = props;
    let outer, header, toolbar, pane, resizers, btnExit;

    resizers = resizerSlugs.map(classSlug => {
        return DOM.div()
            .addClass(`handle sw resizer ${classSlug}`)
            .raw
    });

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
            ///swHandle,
            ...resizers,
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
        Draggable(outer.raw, header.raw);
        makeResizableDiv(outer.raw, resizers);

    }
    return self;
}
export default Vindow;