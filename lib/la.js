vscale = (v,factor) => v.map(n => n * factor)
vadd = (a,b) => a.map((asubi,i) => asubi + b[i]) // a-> + b-> 
vdiff = (a,b) => vadd(a,vscale(b,-1));
vlerp = (a,b,factor) => vadd(a,vscale(vdiff(b,a),factor))
vdot = (a,b) => a.reduce((accum,asubi,i) => accum + asubi * b[i],0)

/**
vdiff([0,0],[4,8])
(2) [4, 8]
vscale([0,1,2],2)
(3) [0, 2, 4]
vscale(vdiff([0,0],[4,8]),0.5)
(2) [2, 4]
vscale(vdiff([0,0],[4,8]),0.75)
(2) [3, 6]
vadd([0,0,2],[1,2,3])
(3) [1, 2, 5]
vlerp([0,0,2],[4,8,9],1)
(3) [4, 8, 9]
start = [0,0,0]
(3) [0, 0, 0]
end = [255,127,63]
(3) [255, 127, 63]
[0,1,2,3,4,5,6,7,8,9,10].map(o => vlerp(start,end,o/10))
	.forEach(stop => jQuery('body')
	.append(DOM.div('example')
	.css('color',`rgb(${stop[0]},${stop[1]},${stop[2]}`)))
**/