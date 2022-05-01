import DOM from "./DOM.js";

function DragAndDropFile(props) {
  const dropTarget = DOM.div()
    .addClass("drop-area drop-target")
    .append([
      DOM.label("Drag a file or"),
      DOM.label()
        .addClass("btn btn-primary btn-sm btn-browse")
        .append([
          "Browse",
          DOM.input()
            .attr("type", "file")
            .attr("id", "file-elem")
            .attr("accept", props.accept)
            .attr("hidden", true)
            .on("change", (e) => {
              props.handleFiles(e.target.files);
            }),
        ]),
    ]);
  const dropTargetVanilla = dropTarget.get(0);

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
    return dropTarget;
  };
  return self;
}
export default DragAndDropFile;
