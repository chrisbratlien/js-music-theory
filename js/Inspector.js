import DOM from "./DOM.js";
import PubSub from "./PubSub.js";

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
        pre.empty().append(JSON.stringify(somethingInteresting, null, 4));
    };

    return self;
}
export default Inspector;