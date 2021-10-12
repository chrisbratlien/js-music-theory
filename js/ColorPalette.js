import PubSub from "./PubSub.js";
import DOM from "./DOM.js";
import ColorPicker from "./ColorPicker.js";
const ColorPalette = function(spec) {

    let self = BSD.PubSub();

    var pickers, selectedColors, morePalettes;
    var savedColors = {};


    let wrap = DOM.div()
        .addClass('color-palette')
        .append(
            pickers = DOM.div()
            .addClass('pickers'),
            DOM.div().addClass('clear-both'),
            morePalettes = DOM.button('Redraw Palettes')
            .addClass('btn btn-default btn-more-palettes')
            .on('click', () => self.redraw()),
            selectedColors = DOM.div()
            .addClass('selected-colors')
        );

    self.redraw = () => {
        pickers.empty();
        let palettes = [];
        palettes.push(BSD.colorFromHex('000000').upTo(BSD.colorFromHex('FFFFFF'), 20));
        palettes.push(BSD.randomPalette2(10, 60));
        palettes.push(BSD.randomPalette2(10, 60));
        palettes.push(BSD.randomPalette2(10, 60));
        palettes.push(BSD.randomPalette2(10, 50));
        palettes.push(BSD.randomPalette2(10, 40));
        palettes.push(BSD.randomPalette2(10, 30));
        palettes.push(BSD.randomPalette2(10, 30));
        palettes.push(BSD.randomPalette2(10, 30));
        palettes.push(BSD.randomPalette2(10, 30));
        palettes.push(BSD.randomPalette2(10, 30));
        palettes.push(BSD.randomPalette2(10, 30));
        palettes.push(BSD.randomPalette2(10, 30));
        palettes.push(BSD.randomPalette2(10, 30));
        palettes.push(BSD.randomPalette2(10, 30));
        palettes.push(BSD.randomPalette2(10, 30));
        palettes.each(function(pal) {
            pal.each(function(randcolor) {
                var picker = ColorPicker({ color: randcolor });
                picker.renderOn(pickers);
                picker.subscribe('click', function(color) {
                    BSD.chosenColor = color;
                    var hex = color.toHex();
                    if (!savedColors[hex]) {
                        savedColors[hex] = true;
                        picker.renderOn(selectedColors);
                    }
                    self.publish('color-chosen', color);
                });
            });
        });
        return self; //for currying/chaining
    }
    self.ui = () => {
        return wrap;
    };

    return self;
};

export default ColorPalette;