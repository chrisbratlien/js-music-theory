// From https://www.w3schools.com/howto/howto_js_draggable.asp

function Draggable(elmnt, dragHandle, opts) {
    //dragHandle could be something inside of elmnt
    if (!dragHandle) {
        //make the whole thing draggable.
        //However, in my experience, this can
        // prevent click events being received by
        //things inside elmnt
        dragHandle = elmnt;
    }
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;

    var startPos = {
        x: 0,
        y: 0
    }
    var self;


    function dragMouseDown(e) {
        e = e || window.event;
        //e.preventDefault();

        startPos = {
            x: e.clientX,
            y: e.clientY
        }
        pos3 = e.clientX;
        pos4 = e.clientY;
        //document.onmouseup = closeDragElement;
        //document.onmousemove = elementDrag;


        document.onpointermove = elementDrag;
        document.onpointerup = closeDragElement;


    }

    function elementDrag(e) {
        e = e || window.event;
        //console.log("e?", e);

        e.preventDefault();
        ///console.log('got here');
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement(e) {
        console.log('close?', e)

        let endPos = {
            x: e.clientX,
            y: e.clientY
        }
        let disp = {
            x: endPos.x - startPos.x,
            y: endPos.y - startPos.y
        };
        console.log(startPos, endPos, disp);

        document.onpointerup = null;
        document.onpointermove = null;
        if (opts && opts.onpointerup) {
            opts.onpointerup(e, disp);
        }
    }


    //dragHandle.onmousedown = dragMouseDown;
    dragHandle.onpointerdown = dragMouseDown;


}
export default Draggable;