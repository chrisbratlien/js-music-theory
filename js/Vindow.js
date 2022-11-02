import PubSub from "./PubSub.js";
import Draggable from "./Draggable.js";
import DOM from "./DOM.js";
import { ascendingSorter, descendingSorter } from "./Utils.js";

import Point from "./Point.js";

export const allVindows = [];

export function allRawVindows() {
    return document.querySelectorAll('.vindow')
}

export function bringToTop(elem) {
    allRawVindows()
        .forEach(o => {
            o.style.zIndex = o == elem ? 1 : 0;
        });
}
export function justXY({ x, y }) {
    return { x, y };
}

export function getPropAsFloat(elem,prop) {
    const result = getComputedStyle(elem, null)
        .getPropertyValue(prop)
        .replace(/[a-z].*/,'') //NOTE: parseFloat will get rid of these too...maybe remove this?
    return parseFloat(result);
}

export function sortVindowsDesc(vindows) {
    return vindows.sort(descendingSorter(v => v.area()));
}

export function autoArrange(vindows, origin, corner) {
    var sorted = sortVindowsDesc(vindows);
    var destinations = [origin];
    sorted.map(function(vindow){
        var destination = destinations.find(d => 
            !d.visited && d.x + vindow.extent().x <= corner.x);
        vindow.moveTo(destination);
        destination.visited = true;
        var vo = vindow.origin();
        var vc = vindow.corner();
        //after placing, its UR and LL corners become new dests
        destinations.push(
            Point(vc.x, vo.y), //UR has priority
            Point(vo.x, vc.y)  //LL
        );
        destinations.sort(descendingSorter(d => d.x)) //RTL
    });
}

/*Make resizable div by Hung Nguyen
https://medium.com/the-z/making-a-resizable-div-in-js-is-not-easy-as-you-think-bda19a1bc53d
https://codepen.io/ZeroX-DG/pen/vjdoYe
*/
function makeResizableDiv(element, resizers) {
    const minimum_size = 20;
    let original_width = 0;
    let original_height = 0;
    let original_x = 0;
    let original_y = 0;
    let original_mouse_x = 0;
    let original_mouse_y = 0;
    for (let i = 0; i < resizers.length; i++) {
        const currentResizer = resizers[i];

        function handleDown(e) {
            e.preventDefault()
            bringToTop(element);

            original_width = getPropAsFloat(element, 'width');
            original_height = getPropAsFloat(element, 'height');

            original_x = element.getBoundingClientRect().left;

            original_y = element.offsetTop || element.getBoundingClientRect().top;
            original_mouse_x = e.pageX;
            original_mouse_y = e.pageY;
            window.addEventListener('mousemove', resize)
            window.addEventListener('touchmove', resize)
            window.addEventListener('pointermove', resize)

            window.addEventListener('mouseup', stopResize)
            window.addEventListener('pointerup', stopResize)
            window.addEventListener('touchend', stopResize)
        }
        currentResizer.addEventListener('pointerdown', handleDown);
        currentResizer.addEventListener('mousedown', handleDown);
        currentResizer.addEventListener('touchstart', handleDown);

        function leftish(e) {
            const width = original_width - (e.pageX - original_mouse_x)
            if (width <= minimum_size) { return false; }
            element.style.width = width + 'px'
            element.style.left = original_x + (e.pageX - original_mouse_x) + 'px'
        }

        function rightish(e) {
            const width = original_width + (e.pageX - original_mouse_x)
            if (width <= minimum_size) { return false; }
            element.style.width = width + 'px'
        }

        function bottomish(e) {
            const height = original_height + (e.pageY - original_mouse_y)
            if (height <= minimum_size) { return false; }
            element.style.height = height + 'px'

        }

        function topish(e) {
            const height = original_height - (e.pageY - original_mouse_y)
            if (height <= minimum_size) { return false; }
            element.style.height = height + 'px'
            element.style.top = original_y + (e.pageY - original_mouse_y) + 'px'

        }


        function resize(e) {
            if (currentResizer.classList.contains('top')) {
                topish(e);
            } else if (currentResizer.classList.contains('top-right')) {
                topish(e);
                rightish(e);
            } else if (currentResizer.classList.contains('right')) {
                rightish(e);
            } else if (currentResizer.classList.contains('bottom-right')) {
                bottomish(e);
                rightish(e);
            } else if (currentResizer.classList.contains('bottom')) {
                bottomish(e);
            } else if (currentResizer.classList.contains('bottom-left')) {
                bottomish(e);
                leftish(e);
            } else if (currentResizer.classList.contains('left')) {
                leftish(e);
            } else if (currentResizer.classList.contains('top-left')) {
                topish(e);
                leftish(e);
            }

            element.dispatchEvent(new CustomEvent('vindow-resize'), {detail: { element } })
        }

        function stopResize() {
            window.removeEventListener('mousemove', resize)
            window.removeEventListener('touchmove', resize)
            window.removeEventListener('pointermove', resize)
        }
    }
}


let resizerSlugs = [
    'bottom-left',
    'top-left',
    'top-right',
    'bottom-right',
    'bottom',
    'left',
    'right',
    'top'
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
        .addClass(`vindow ${props.className ? props.className : ''}`)
        .append(
            ///swHandle,
            ...resizers,
            header = DOM.div()
            .addClass('header flex-row align-items-center space-between')
            .append([
                DOM.span()
                .addClass('title noselect')
                .append(props.title),
                buttons
            ]),
            toolbar = DOM.div()
            .addClass('toolbar')
            .css('display', 'none'),
            pane = DOM.div()
            .addClass('pane')
        )
        .on('mousedown touchstart', () => {
            bringToTop(outer.raw)
        })

    //capture the raw element's CustomEvent emitted witin makeResizableDiv's resize function
    outer.raw.addEventListener('vindow-resize',function(e){
        self.emit('resize',{ self, outer, e });
    });

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

    self.getBoundingClientRect = function() {
        return outer.raw.getBoundingClientRect();
    }
    self.origin = function() {
        var br = self.getBoundingClientRect();
        return Point(br.x, br.y);

    }
    self.corner = function() {
        var br = self.getBoundingClientRect();
        return Point(br.right, br.bottom);
    }


    self.extent = function() {
        var br = self.getBoundingClientRect();
        return Point(br.width, br.height);
    }
    self.area = function() {
        var extent = self.extent();
        return extent.x * extent.y;        
    }

    self.moveTo = function(aPoint) {
        outer.raw.style.left = aPoint.x + 'px';
        outer.raw.style.top = aPoint.y + 'px';
    }


    self.intersects = function(aVindow) {
        const maxo = self.origin()
            .max(aVindow.origin());
        const minc = self.corner()
            .min(aVindow.corner());
        return maxo.lessThan(minc);
    };



    self.pane = pane;
    self.renderOn = function(wrap) {
        wrap.append(outer);
        Draggable(outer.raw, header.raw);
        makeResizableDiv(outer.raw, resizers);

    }
    allVindows.push(self);
    return self;
}
export default Vindow;