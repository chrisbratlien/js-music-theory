if (!('forEach' in Array.prototype)) { //IE shim
    Array.prototype.forEach= function(action, that /*opt*/) {
        for (var i= 0, n= this.length; i<n; i++)
            if (i in this)
                action.call(that, this[i], i, this);
    };
}

DOM = {
    rawTags: 'a,abbr,address,area,article,aside,audio,b,base,bdi,bdo,blockquote,body,br,button,canvas,caption,cite,code,col,colgroup,data,datalist,dd,del,details,dfn,dialog,div,dl,dt,em,embed,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,i,iframe,img,input,ins,kbd,label,legend,li,link,main,map,mark,menu,meta,meter,nav,noscript,object,ol,optgroup,option,output,p,param,picture,pre,progress,q,rp,rt,ruby,s,samp,script,section,select,slot,small,source,span,strong,style,sub,summary,sup,table,tbody,td,template,textarea,tfoot,th,thead,time,title,tr,track,u,ul,var,video,wbr',
    oldTags: 'html,head,script,link,body,div,ul,ol,li,a,i,p,strong,br,span,pre,img,table,thead,tbody,tr,th,td,h1,h2,h3,h4,h5,h6,form,fieldset,select,option,label,input,textarea,button,iframe,audio,object,video,canvas',
    svgTags: 'circle,ellipse,g,line,polygon,polyline,rect,svg,text'

};
DOM.element = function () {

    var args = Array.prototype.slice.call(arguments);    

    if (arguments.length == 0) { return "ERROR"; }

    var tag = arguments[0];
    var interface;
    if (DOM.svgTags.match(tag)) {
        let raw = document.createElementNS('http://www.w3.org/2000/svg', tag);
        interface = jQuery(raw);
    }
    else {
        interface = jQuery('<' + tag + '></' + tag + '>');
    }
    if (arguments.length == 1) {
        return interface;
    }

    var children = arguments[1];
    if (typeof children == "string" || typeof children == "number") {
        interface.html(children);
    }
    else if (typeof children == "object") { //probably another jquery object
        interface.append(children);
    }
    else if (children && typeof children.length !== "undefined") {
        children.each(function (child) {
            interface.append(child);
        });
    }

    return interface;
};

var combined = [
    ...DOM.rawTags.split(/,/),
    ...DOM.svgTags.split(/,/)
];
combined.forEach(function (tag) {
    DOM[tag] = function () {

        var args = Array.prototype.slice.call(arguments);  


        if (arguments.length == 0) { return DOM.element(tag); }
        //return DOM.element(tag, arguments[0]);
        ///var result = DOM.element(tag, arguments);

        //var result = DOM.element.apply(null,arguments);
        ////var result = DOM.element.apply(null,args);
        var result = DOM.element(tag,args);
        return result;
    }
});
