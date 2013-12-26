if (typeof BSD == "undefined") { var BSD = {}; }
if (typeof BSD.Widgets == "undefined") { BSD.Widgets = {}; }

BSD.Widgets.Lightbox = function (spec) {
    var self = {};
    var wrap = DOM.div();
    wrap.addClass('bsd-widgets-lightbox');
    wrap.css('position', 'absolute');

    wrap.css('top', '0px');
    wrap.css('height', '250%');
    wrap.css('width', '100%');

    var overlay = DOM.div();
    overlay.addClass('overlay');

    overlay.css('display', 'none');
    overlay.css('position', 'absolute');
    overlay.css('top', '0px');
    overlay.css('height', '250%');
    overlay.css('width', '100%');
    overlay.css('background', '#000');
    overlay.css('opacity', 0.5);

    var box = DOM.div();
    box.addClass('content');

    box.css('display', 'none');
    box.css('position', 'absolute');
    box.css('top', '200px');
    box.css('left', '12%');
    box.css('width', '75%');
    box.css('background', 'white');
    box.css('opacity', '1.0');
    box.css('z-index', 152);
    box.css('padding', '1em');
    box.css('font-size', '1.5em');
    box.html(spec.content.html());


    var close = DOM.div();
    close.addClass('close');
    close.css('position', 'absolute');
    close.css('right', '0px');
    close.css('top', '0px');
    close.css('background', 'black');
    close.css('color', 'white');
    close.css('padding', '0.3em');
    close.css('cursor', 'pointer');
    close.html('close');

    self.show = function () {
        wrap.show();
        wrap.css('z-index', 151);
        overlay.fadeIn();
        box.fadeIn();
        overlay.css('z-index', 151);
    };
    self.hide = function () {
        overlay.fadeOut();
        box.fadeOut();
        wrap.css('z-index', 0);
        overlay.css('z-index', 0);
        wrap.hide();
    }
    wrap.append(overlay);
    wrap.append(box);
    box.append(close);


    jQuery(document.body).append(wrap);
    /////box.click(self.hide);
    overlay.click(self.hide);
    close.click(self.hide);
    return self;
};

