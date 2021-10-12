import PubSub from "./PubSub.js";
import DOM from "./DOM.js";

function ColorPicker(spec) {
    var self = PubSub({});
    self.renderOn = function(wrap) {
        ///console.log('hello');
        var square = DOM.div('').addClass('color-picker');
        square.css('background-color', '#' + spec.color.toHex());

        var handler = function() {
            BSD.chosenColor = spec.color;
        };

        square.on('click', function() {
            self.publish('click', spec.color);
            ////handler();
            ///var newGuy = square.clone();
            //newGuy.click(handler);
            //wrap.append(newGuy);    
        });
        ////console.log('html',html);
        wrap.append(square);
    };
    return self;
};
export default ColorPicker;