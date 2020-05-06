var DOM = window.DOM || {
    regularTagString: 'a,abbr,address,area,article,aside,audio,b,base,bdi,bdo,blockquote,body,br,button,canvas,caption,cite,code,col,colgroup,data,datalist,dd,del,details,dfn,dialog,div,dl,dt,em,embed,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,i,iframe,img,input,ins,kbd,label,legend,li,link,main,map,mark,menu,meta,meter,nav,noscript,object,ol,optgroup,option,output,p,param,picture,pre,progress,q,rp,rt,ruby,s,samp,script,section,select,slot,small,source,span,strong,style,sub,summary,sup,table,tbody,td,template,textarea,tfoot,th,thead,time,title,tr,track,u,ul,var,video,wbr',
    svgTagString: 'circle,ellipse,g,line,path,polygon,polyline,rect,svg,text'
};

DOM.regularTags = DOM.regularTagString
    .split(',')
    .filter( function(o) { return o; });
DOM.svgTags = DOM.svgTagString
    .split(',')
    .filter( function(o) { return o; });

DOM.element = function () {

    var args = Array.prototype.slice.call(arguments);    

    if (arguments.length == 0) { return "ERROR"; }

    var tag = arguments[0];
    var self;

    if ( DOM.svgTags.find( function(o) { return  o == tag; }) ) {
        var raw = document.createElementNS('http://www.w3.org/2000/svg', tag);
        self = jQuery(raw);
    }
    else {
        self = jQuery('<' + tag + '></' + tag + '>');
    }
    if (arguments.length == 1) {
        return self;
    }

    var children = arguments[1];
    if (typeof children == "string" || typeof children == "number") {
        self.html(children);
    }
    else if (typeof children == "object") { //probably another jquery object
        self.append(children);
    }
    else if (children && typeof children.length !== "undefined") {
        children.each(function (child) {
            self.append(child);
        });
    }

    return self;
};

var combined = new Set(
    []
    .concat(DOM.regularTags)
    .concat(DOM.svgTags)
);

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
