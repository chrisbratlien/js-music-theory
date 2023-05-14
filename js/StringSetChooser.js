import DOM from "./DOM.js";
import PubSub from "./PubSub.js";

async function loadHTML() {
    var resp = await fetch(BSD.baseURL + '/data/guitar-stringsets.html');
    var html = await resp.text();
    return html;
}

function htmlToElem(html) {
    let temp = document.createElement('template');
    html = html.trim(); // Never return a space text node as a result
    temp.innerHTML = html;
    return temp.content.firstChild;
}

async function createRawSelectElement() {
    return htmlToElem(await loadHTML());
}

const rawSelect = await createRawSelectElement();

export function StringSetChooser() {
    const self = PubSub();
    const select = DOM.from(rawSelect);
    select.on('change',function(e){
        const str = e.target.value;

        const stringNumbers = str
            .split("")
            .filter(o => o && o.length)
            .map(o => Number(o))

        //console.log('str',str,stringNumbers);
       self.emit('change',stringNumbers)
    });
    self.ui = () => select;
    return self;
}

export default StringSetChooser;