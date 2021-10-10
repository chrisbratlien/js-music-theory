export function setBackgroundHue(elem, hueRads) {
    elem.style.backgroundColor = `hsl(${hueRads}rad,50%,50%)`;
}

function wasNudgeBackgroundColor(selector, hue) {
    document.querySelectorAll(selector).forEach(o => { o.style.backgroundColor = `hsla(${hue}rad,50%,50%)` })
}