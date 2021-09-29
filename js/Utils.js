export function nudgeBackgroundColor(selector,hue) {
    document.querySelectorAll(selector).forEach(o => { o.style.backgroundColor = `hsla(${hue}rad,50%,50%)` })
}
