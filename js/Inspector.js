import DOM from "./DOM.js";
import PubSub from "./PubSub.js";
import SimplePropertyRetriever from "./SimplePropertyRetriever.js";

//https://stackoverflow.com/questions/29085197/how-do-you-json-stringify-an-es6-map
function replacer(key, value) {
    if (value instanceof Map) {
        return {
            dataType: 'Map',
            value: Array.from(value.entries()), // or with spread: value: [...value]
        };
    } else {
        return value;
    }
}

function Inspector(props) {
    const self = PubSub();

    let pre = DOM.pre().addClass('inspector');

    self.copyTextToClipboard = function() {
        navigator.clipboard.writeText(pre.raw.innerText);
    }

    let toolbar = DOM.button()
        .addClass('btn btn-sm')
        .append([
            DOM.i()
            .addClass('fa fa-copy'),
        ])
        .on('click', self.copyTextToClipboard);

    self.ui = function() {
        return [toolbar, pre]
    };

    self.renderOn = function(wrap) {
        wrap.append(self.ui());
        self.update(props);
        return self; //allow chaining
    };


    self.update = function(somethingInteresting) {

        ////console.log('here we go', SimplePropertyRetriever.getOwnAndPrototypeEnumerablesAndNonenumerables(somethingInteresting));

        pre.empty().append(JSON.stringify(somethingInteresting, replacer, 4));
    };

    return self;
}
export default Inspector;