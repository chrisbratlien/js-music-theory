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
var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

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


dragHandle.onmousedown = dragMouseDown;
}
export default Draggable;