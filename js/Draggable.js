// From https://www.w3schools.com/howto/howto_js_draggable.asp

function Draggable(elmnt, dragHandle) {
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

    function dragMouseDown(e) {
        e = e || window.event;

        console.log("DOWN e?", e);
        //e.preventDefault();

        pos3 = e.clientX;
        pos4 = e.clientY;
        //document.onmouseup = closeDragElement;
        //document.onmousemove = elementDrag;


        document.onpointermove = elementDrag;
        document.ontouchmove = elementDrag;
        document.onmousemove = elementDrag;

        document.onpointerup = closeDragElement;
        document.ontouchend = closeDragElement;
        document.onmouseup = closeDragElement;

        dragHandle.onpointerup = closeDragElement;
        dragHandle.ontouchend = closeDragElement;
        dragHandle.onmouseup = closeDragElement;


    }

    function elementDrag(e) {
        let origE = e;
        e = e || window.event;
        console.log("drag(move) e?", e);

        //magic touch!
        e = e.touches && e.touches[0] || e;

        
        ///console.log('got here');
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        //seems to prevent drag on touchmove events ///

        //origE.preventDefault();
    }

    function closeDragElement() {
        //console.log('close?')
        document.onpointerup = null;
        document.onmouseup = null;
        document.ontouchend = null;

        document.onpointermove = null;
        document.onmousemove = null;
        document.ontouchmove = null;
    }


    dragHandle.onmousedown = dragMouseDown;
    dragHandle.onpointerdown = dragMouseDown;
    dragHandle.ontouchstart = dragMouseDown;

}
export default Draggable;