import PubSub from "./PubSub.js";
import DOM from "./DOM.js";
import {makeArray} from "./Utils.js";

function ListGroup(spec) {
    const self = PubSub({});

    let className = spec.hasOwnProperty('className') ? spec.className : '';

    const ul = DOM.ul()
        .addClass(`list-group ${className}`);

    var items = [];
    self.items = items

    self.clear = function() {
        self.items = [];
        items = self.items;
    };

    self.addItems = function(o) {
        let them = makeArray(o);
        them.forEach(p => { 
            items.push(p) 
        })
        //them.map(items.push);
    };

    self.sort = function(sorter) {
        items.sort(sorter);
    }

    self.refresh = function() {
        ul.empty();

        items.forEach(function(item, i) {
            var li = DOM.li(item.content)
                .addClass('list-group-item')
                .on('click', function() {
                    let sel =
                        ul.find('.selected');
                    sel && sel.removeClass('selected');
                    li.addClass('selected');
                    self.emit('item-selected', item.data);
            });
            ul.append(li);
        });
    };

    self.ui = () => ul;
    self.renderOn = function(wrap) {
        wrap.append(self.ui());
    };

    return self;
};

export default ListGroup;