import DOM from "./DOM.js";

function DragAndDropFile(props) {

  const fileInput = DOM.input()
    .addClass('file-input')
    .attr("type", "file")
    .attr("id", "file-elem")
    .attr("accept", props.accept)
    //.attr("hidden", true)
    .on("change", (e) => {
      props.handleFiles(e.target.files);
    });

    const btnUpload = 
      DOM.button()
      .addClass("btn btn-default btn-sm btn-browse btn-upload")
      .append([
        DOM.i()
          .addClass('fa fa-upload'),
      ])
      .on('click',function(){
        console.log('YAAAAAY');
        fileInput.raw.dispatchEvent(new MouseEvent('click'));
      })


  const dropTarget = DOM.div()
    .addClass("drop-area drop-target")
    .append('drop file')
    const dropTargetVanilla = dropTarget.raw;

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function highlight(e) {
    dropTarget.addClass("highlight");
  }

  function unhighlight(e) {
    dropTarget.removeClass("highlight");
  }

  document.body.addEventListener("dragenter", preventDefaults, false);
  document.body.addEventListener("dragover", preventDefaults, false);
  document.body.addEventListener("dragleave", preventDefaults, false);
  document.body.addEventListener("drop", preventDefaults, false);

  const handleFile = props.handleFile;

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    var dt = e.dataTransfer;
    var files = dt.files;
    props.handleFiles(files);

    // important for browser to not just browse to the file dropped.
    e.preventDefault();
    e.stopPropagation();
  }

  // Highlight drop area when item is dragged over it
  ["dragenter", "dragover"].forEach((eventName) => {
    dropTargetVanilla.addEventListener(eventName, highlight, false);
  });

  ["dragleave", "drop"].forEach((eventName) => {
    dropTargetVanilla.addEventListener(eventName, unhighlight, false);
  });

  // Handle dropped files
  dropTargetVanilla.addEventListener("drop", handleDrop, false);

  self.ui = function() {
    return [fileInput,btnUpload,dropTarget];
  };
  return self;
}
export default DragAndDropFile;
