import PubSub from "./PubSub.js";

//fixme. refactor away from the old global dom.js so we can
//use the DOM.js module
// can't import this until refactor ready ...import DOM from "./DOM.js";

function Vindow(props) {
    let self = PubSub();
    self.props = props;
    let outer, header, pane, btnExit;


    ///drag stuff from W3 schools

    var elmnt, pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
  
    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  


    ///



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
                ]),
            pane = DOM.div()
                .addClass('pane')
        )
    
    
    
    self.append = function (content) {
        pane.append(content);

        //should this return something to enable
        //chaining?
        // I was tempted to return pane, but that's
        // going to be confusing... If so, we have
        // transformed into a jQuery object and
        // have lost our Vindow.
        //Safer to return self.
        //but I'm not in a rush.. no return for now.
    }
    

    self.ui = function () {
        return outer;
    }
    self.renderOn = function (wrap) {
        wrap.append(outer);
        elmnt = outer.get(0);
        header.get(0).onmousedown = dragMouseDown;
    }
    return self;
}
export default Vindow;