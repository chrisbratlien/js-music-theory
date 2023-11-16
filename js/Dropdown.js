import PubSub from "./PubSub.js"
import DOM from "./DOM.js"



function Dropdown(props) {
    const self = PubSub();


    function handleItemClick(option){
        self.emit('click', option)
    }

    function dropdownItem(option) {
        let li = DOM.li()
            .append(
                DOM.a()
                    .attr({
                        href: '#'
                    })
                    .append(option.label)
            )
            .on('click',() => {
                li.addClass("selected active");
                handleItemClick(option)
            })
        return li;
    }

    let content = DOM.div()
        .addClass('dropdown')
        .append([
            DOM.button()
            .attr({
                'data-toggle': "dropdown"
            })
            .addClass("btn btn-default dropdown-toggle")
            .append([
                props.label,
                DOM.span()
                    .addClass('caret')
            ]),
            DOM.ul()
                .addClass('dropdown-menu')
                .append(props.options.map(option => dropdownItem(option)))
        ])


    self.ui = () => content

    self.renderOn = (wrap) => wrap.append(self.ui())
    return self;

}
export default Dropdown
