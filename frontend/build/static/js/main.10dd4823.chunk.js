(this.webpackJsonpfrontend=this.webpackJsonpfrontend||[]).push([[0],{26:function(e,t,n){e.exports=n(54)},31:function(e,t,n){},49:function(e,t,n){},53:function(e,t,n){},54:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),o=n(11),c=n.n(o),i=(n(31),n(7)),l=n(13),s=n(25),u=n(10),d=n(8),f=n(5),m={RUN:1,DRAWNODE:2,MOVE:3,REMOVENODE:4,REMOVEEDGE:5,DRAWEDGE:6,RESETGRAPH:7,FINISH:8,RESETALGO:9},h={0:"#eb4034",1:"#f7a92a",2:"#f7e62a",3:"#b6f72a",4:"#2af7f0",5:"#2a7ff7",6:"#5a2af7",7:"#d12af7",8:"#f72acb",9:"#f72a67",10:"#f72a2a"};function g(e,t,n){var a,r=Object(u.a)(n);try{for(r.s();!(a=r.n()).done;){var o=a.value;if(Math.sqrt(Math.pow(e-o.x,2)+Math.pow(t-o.y,2))<60)return!0}}catch(c){r.e(c)}finally{r.f()}return!1}function E(e,t){var n,a;do{n=Math.floor(1e3*Math.random()+30),a=Math.floor(700*Math.random()+20)}while(g(n,a,t));return{x:n,y:a,id:e,neighbors:[]}}function b(e){for(var t=[],n=0;n<e;++n)t.push(E(n,t));for(var a=parseInt(e/2),r=0;r<t.length;++r)for(var o=t[r],c=0;c<t.length&&o.neighbors.length<a;++c)if(c!=r){var i=t[c];Math.round(1*Math.random())&&o.neighbors.push(i.id)}return{nodes:t,edges:function(e){var t,n=[],a=Object(u.a)(e);try{var r=function(){var e=t.value,a=e.neighbors.map((function(t){return{from:e.id,to:t,weight:0,id:"".concat(e.id," ").concat(t)}}));n=n.concat(a)};for(a.s();!(t=a.n()).done;)r()}catch(o){a.e(o)}finally{a.f()}return n}(t)}}var v=n(15),p=n.n(v),O=(n(49),function(e,t,n,a){var r=Math.sqrt((n-e)*(n-e)+(a-t)*(a-t)),o=(r-30)/r;return{x:e+(n-e)*o,y:t+(a-t)*o}});var y=function(e){var t=b(5),n=Object(a.useState)(t.nodes),o=Object(i.a)(n,2),c=o[0],l=o[1],s=Object(a.useState)(t.edges),g=Object(i.a)(s,2),E=g[0],v=g[1],y=Object(a.useState)(c.length),j=Object(i.a)(y,2),R=j[0],w=j[1],N=Object(a.useState)({from:void 0,to:void 0}),M=Object(i.a)(N,2),D=M[0],T=M[1],x=Object(a.useState)(!0),k=Object(i.a)(x,2),A=k[0],S=k[1],C=e.mode,G=e.algo,I=e.service,V=e.handleChangeMode,W=Object(a.useRef)(),P=Object(a.useRef)(),H=function(e,t,n){var a=n.findIndex((function(t){return t.id===e}));if(a>-1){var r=Object(d.a)(n);return r[a]=Object(f.a)(Object(f.a)({},n[a]),t),r}return n},L=function(e,t,n,a){var r=a.findIndex((function(n){return n.from===e&&n.to===t}));if(r>-1){var o=Object(d.a)(a);return o[r]=Object(f.a)(Object(f.a)({},a[r]),n),o}return a},_=function(e,t){if(!function(e,t){var n,a=Object(u.a)(c);try{for(a.s();!(n=a.n()).done;){var r=n.value;if(Math.sqrt(Math.pow(e-r.x,2)+Math.pow(t-r.y,2))<=30)return!0}}catch(o){a.e(o)}finally{a.f()}return!1}(e,t)){var n={id:R,x:e,y:t,color:0,neighbors:[]};l([].concat(Object(d.a)(c),[n])),w(R+1)}};return void 0!==C&&(C===m.MOVE?(W.current.onclick=void 0,W.current.onmousedown=function(e){var t=e.target;t.classList.contains("draggable")&&(P.current=t)},W.current.onmousemove=function(e){if(e.target.classList.contains("draggable")&&P.current){var t=e.offsetX,n=e.offsetY;P.current.setAttribute("cx",t),P.current.setAttribute("cy",n),P.current.nextElementSibling.setAttribute("x",t),P.current.nextElementSibling.setAttribute("y",n+4),function(e,t,n){var a=H(e,{id:e,x:t,y:n},c);l(a)}(parseInt(P.current.getAttribute("id")),t,n)}},W.current.onmouseup=function(e){P.current=void 0}):([m.DRAWNODE,m.DRAWEDGE,m.REMOVEEDGE,m.REMOVENODE].includes(C)?W.current.onclick=function(e){if(C===m.DRAWNODE)console.log(e),_(e.offsetX,e.offsetY);else if(C===m.REMOVENODE&&e.target.classList.contains("node")){var t=parseInt(e.target.getAttribute("id"));(0==t||t)&&function(e){var t=c.findIndex((function(t){return t.id===e}));if(t>-1){var n=Object(d.a)(c);n.splice(t,1),n=n.map((function(t){return t.neighbors=t.neighbors.filter((function(t){return t!==e})),t}));var a=E.filter((function(t){return t.from!==e&&t.to!==e}));v(a),l(n)}}(t)}else if(C==m.DRAWEDGE&&e.target.classList.contains("node")){var n=parseInt(e.target.getAttribute("id"));if(0==n||n)if(void 0==D.from){var a=H(n,{color:"red"},c);T(Object(f.a)(Object(f.a)({},D),{},{from:n})),l(a)}else if(void 0==D.to){var r=H(n,{color:"green"},c);T(Object(f.a)(Object(f.a)({},D),{},{to:n})),l(r),setTimeout((function(){var e=c.find((function(e){return e.id===D.from})),t=c.find((function(e){return e.id===n}));e.color=t.color="white",e.neighbors.push(t.id);var a=[].concat(Object(d.a)(E),[{from:e.id,to:t.id,weight:0,id:"".concat(e.id," ").concat(t.id)}]),r=Object(d.a)(c);T({}),l(r),v(a)}),300)}}else if(C==m.REMOVEEDGE&&e.target.classList.contains("edge")){var o=e.target.getAttribute("id").split(" "),i=parseInt(o[0]),s=parseInt(o[1]),u=E.filter((function(e){return e.from!==i||e.to!==s})),h=c.find((function(e){return e.id===i})),g=c.find((function(e){return e.id===s}));h.neighbors=h.neighbors.filter((function(e){return e!==s})),g.neighbors=g.neighbors.filter((function(e){return e!==i}));var b=Object(d.a)(c);v(u),l(b)}}:C===m.RESETGRAPH&&(W.current.onclick=void 0),W.current.onmousedown=void 0,W.current.onmousemove=void 0,W.current.onmouseup=void 0)),Object(a.useEffect)((function(){if(C===m.RESETGRAPH)v([]),l([]),S(!0),w(0);else if(C===m.RUN){if(A)if(0==c.length)alert("Please add some nodes in order to run algorithms");else if("bfs"===G||"dfs"===G)p()({url:"".concat("http://localhost:5000","/api/").concat(I,"/").concat(G),method:"post",headers:{"Content-Type":"application/json"},data:{nodes:c.map((function(e){return{id:e.id,neighbors:e.neighbors}})),edges:E,startNode:{id:c[0].id,neighbors:c[0].neighbors}}}).then((function(e){var t,n=e.data,a=1,r=c,o=E,i=Object(u.a)(n);try{var s=function(){var e=t.value,n=setTimeout((function(){o=L(e.parent,e.id,{color:"green"},o),v(o),clearTimeout(n)}),900*a),c=setTimeout((function(){r=H(e.id,{color:"red"},r),l(r),clearTimeout(c)}),901*a);a++};for(i.s();!(t=i.n()).done;)s()}catch(d){i.e(d)}finally{i.f()}S(!1)})).catch((function(e){}));else if("coloring"==G){var e={};c.map((function(t){return e[t.id]=t.neighbors})),p()({url:"".concat("http://localhost:5000","/api/").concat(I,"/").concat(G),method:"post",headers:{"Content-Type":"application/json"},data:{nodes:c.map((function(e){return{id:e.id,neighbors:e.neighbors}})),edges:E}}).then((function(e){var t,n=e.data,a=c.map((function(e){return Object(f.a)(Object(f.a)({},e),{},{color:h[n[e.id]]})})),r=1,o=c,i=Object(u.a)(a);try{var s=function(){var e=t.value,n=setTimeout((function(){o=H(e.id,{color:e.color},o),l(o),clearTimeout(n)}),900*r);r++};for(i.s();!(t=i.n()).done;)s()}catch(d){i.e(d)}finally{i.f()}S(!1)}))}else"dijkstra"==G?p()({url:"".concat("http://localhost:5000","/api/").concat(I,"/").concat(G),method:"post",headers:{"Content-Type":"application/json"},data:{nodes:c.map((function(e){return{id:e.id,neighbors:e.neighbors}})),edges:E,startNode:{id:c[0].id,neighbors:c[0].neighbors}}}).then((function(e){var t,n=e.data,a=1,r=c,o=E,i=Object(u.a)(n);try{var s=function(){var e=t.value;if("visited"==e.status)var n=setTimeout((function(){r=H(e.id,{color:"red"},r),l(r),clearTimeout(n)}),1e3*a),c=setTimeout((function(){o=L(e.parent,e.id,{color:"green"},o),v(o),clearTimeout(c)}),1002*a);else var i=setTimeout((function(){o=L(e.parent,e.id,{color:"red"},o),v(o),clearTimeout(i);var t=setTimeout((function(){o=L(e.parent,e.id,{color:"white"},o),v(o),clearTimeout(t)}),1e3)}),1e3*a);a++};for(i.s();!(t=i.n()).done;)s()}catch(d){i.e(d)}finally{i.f()}S(!1)})):"mst"==G&&p()({url:"".concat("http://localhost:5000","/api/").concat(I,"/").concat(G),method:"post",headers:{"Content-Type":"application/json"},data:{nodes:c.map((function(e){return{id:e.id,neighbors:e.neighbors}})),edges:E}}).then((function(e){var t,n=e.data,a=Object(d.a)(E),r=0,o=Object(u.a)(n);try{var c=function(){var e=t.value,n=setTimeout((function(){if(a=L(e.from,e.to,{color:"red"},a),v(a),clearTimeout(n),e.selected)var t=setTimeout((function(){a=L(e.from,e.to,{color:"green"},a),v(a),clearTimeout(t)}),1e3);else var r=setTimeout((function(){a=L(e.from,e.to,{color:"white"},a),v(a),clearTimeout(r)}),1e3)}),1e3*r);r++};for(o.s();!(t=o.n()).done;)c()}catch(i){o.e(i)}finally{o.f()}S(!1)}));else alert('Please reset the algorithm by clicking "Reset algorithm" button before running new one');V(m.FINISH)}else C==m.RESETALGO&&function(){var e=c.map((function(e){return Object(f.a)(Object(f.a)({},e),{},{color:"white"})})),t=E.map((function(e){return Object(f.a)(Object(f.a)({},e),{},{color:"white"})}));l(e),v(t),S(!0)}()}),[C]),r.a.createElement("svg",{ref:W,className:"graph"},c.map((function(e,t){return r.a.createElement("g",{className:"nodegroup"},r.a.createElement("circle",{className:"draggable node",style:{fill:e.color||"white"},cx:e.x,cy:e.y,r:30,id:e.id}),r.a.createElement("text",{className:"nodelabel",x:e.x,y:e.y+4},e.id))})),E.map((function(e,t){var n=c.find((function(t){return t.id==e.from})),a=c.find((function(t){return t.id==e.to})),o=O(n.x,n.y,a.x,a.y),i=O(a.x,a.y,n.x,n.y),l=function(e,t,n,a){var r=Math.atan2(a-t,n-e)-Math.PI/2;return{x:.5*(n+e)+50*Math.cos(r),y:.5*(a+t)+50*Math.sin(r)}}(i.x,i.y,o.x,o.y);return r.a.createElement("g",null,r.a.createElement("marker",{className:"arrow",id:"arrowhead".concat(e.from).concat(e.to),markerWidth:"10",markerHeight:"7",refX:"8.7",refY:"3.5",orient:"auto"},r.a.createElement("polygon",{points:"0 0, 10 3.5, 0 7"})),r.a.createElement("path",{d:"M".concat(i.x," ").concat(i.y," Q").concat(l.x," ").concat(l.y," ").concat(o.x," ").concat(o.y),className:"edge",id:e.id,style:{stroke:e.color||"white"},markerEnd:"url(#arrowhead".concat(e.from).concat(e.to,")"),onClick:function(){if(C!=m.REMOVEEDGE){var t=parseInt(prompt("Please set a weight for edge from node ".concat(e.from," to node ").concat(e.to)));if(t>=0){var n=Object(d.a)(E);n.find((function(t){return e.id==t.id})).weight=t,v(n)}else t<0&&alert("Weight must be a number and non-negative")}}}),r.a.createElement("text",{className:"edge-weight",x:(Math.atan2(n.y-a.y,n.x-a.x),l.x),y:Math.atan2(n.y-a.y,n.x-a.x)<0?l.y-5:l.y+5},e.weight))})))},j=n(3),R=n.n(j);var w=function(){var e=Object(a.useState)(),t=Object(i.a)(e,2),n=t[0],o=t[1],c=Object(a.useState)("bfs"),u=Object(i.a)(c,2),d=u[0],f=u[1],h=Object(a.useState)("python"),g=Object(i.a)(h,2),E=g[0],b=g[1],v=Object(a.useState)(!0),p=Object(i.a)(v,2),O=p[0],j=p[1],w=function(e){o(e)},N=function(){return j(!1)};return r.a.createElement("div",null,r.a.createElement("div",{className:"header"},r.a.createElement("form",null,r.a.createElement("div",{className:"form-group row"},r.a.createElement("label",{className:"col-sm-2 col-form-label",for:"algo-select"},"Choose an algorithm:"),r.a.createElement("div",{className:"col-sm-10"},r.a.createElement("select",{name:"algo",id:"algo-select",onChange:function(e){return f(e.target.value)}},r.a.createElement("option",{value:"bfs"},"Breadth First Search"),r.a.createElement("option",{value:"dfs"},"Depth First Search"),r.a.createElement("option",{value:"coloring"},"Graph coloring with minimum number of colors"),r.a.createElement("option",{value:"dijkstra"},"Shortest Path - Dijkstra algorithm"),r.a.createElement("option",{value:"mst"},"Minimum Spanning Tree - Kruskal algorithm")))),r.a.createElement("div",{className:"form-group row"},r.a.createElement("label",{className:"col-sm-2 col-form-label",for:"service-select"},"Choose a server:"),r.a.createElement("div",{className:"col-sm-10"},r.a.createElement("select",{name:"service",id:"service-select",onChange:function(e){return b(e.target.value)}},r.a.createElement("option",{value:"python"},"Python"),r.a.createElement("option",{value:"go"},"Golang"))))),r.a.createElement("div",{className:"row"},r.a.createElement("button",{className:R()({btn_focus:n==m.RUN}),onClick:function(){return w(m.RUN)}},"Run algorithm"),r.a.createElement("button",{className:R()({btn_focus:n==m.DRAWNODE}),onClick:function(){return w(m.DRAWNODE)}},"Draw node"),r.a.createElement("button",{className:R()({btn_focus:n==m.MOVE}),onClick:function(){return w(m.MOVE)}},"Move node"),r.a.createElement("button",{className:R()({btn_focus:n==m.REMOVENODE}),onClick:function(){return w(m.REMOVENODE)}},"Remove node"),r.a.createElement("button",{className:R()({btn_focus:n==m.DRAWEDGE}),onClick:function(){return w(m.DRAWEDGE)}},"Draw edge"),r.a.createElement("button",{className:R()({btn_focus:n==m.REMOVEEDGE}),onClick:function(){return w(m.REMOVEEDGE)}},"Remove edge"),r.a.createElement("button",{className:R()({btn_focus:n==m.RESETALGO}),onClick:function(){return w(m.RESETALGO)}},"Reset algorithm"),r.a.createElement("button",{className:R()({btn_focus:n==m.RESETGRAPH}),onClick:function(){return w(m.RESETGRAPH)}},"Reset graph"),r.a.createElement("button",{onClick:function(){return j(!0)}},"Instructions"))),r.a.createElement("div",{className:"graph-board"},r.a.createElement(y,{mode:n,algo:d,service:E,handleChangeMode:w})),r.a.createElement(l.a,{show:O,onHide:N},r.a.createElement(l.a.Header,{closeButton:!0},r.a.createElement(l.a.Title,null,"App instructions")),r.a.createElement(l.a.Body,null,"This app is developed to visualize some graph algorithms.",r.a.createElement("p",null,"There are a header, which includes buttons, and canvas, which is the main area to display graph"),r.a.createElement("p",null,"There are 9 buttons on the header, all of which will help you interact with graph by specific operations:"),r.a.createElement("p",null,"1.",r.a.createElement("strong",null,"Run algorithm"),": Send request to run an algorithm to a chosen server"),r.a.createElement("p",null,"2.",r.a.createElement("strong",null,"Draw node"),": Draw nodes by clicking on canvas"),r.a.createElement("p",null,"3.",r.a.createElement("strong",null,"Move node"),": Move nodes around by dragging them"),r.a.createElement("p",null,"4.",r.a.createElement("strong",null,"Remove node"),": Remove nodes by clicking on them"),r.a.createElement("p",null,"5.",r.a.createElement("strong",null,"Draw edge"),": Draw a new edge by clicking a source node(red) and a target node(green)."),r.a.createElement("p",null,"6.",r.a.createElement("strong",null,"Remove edge"),": Remove edges by clicking on them"),r.a.createElement("p",null,"7.",r.a.createElement("strong",null,"Reset algorithm"),": Reset the algorithm and reset color to run new one"),r.a.createElement("p",null,"8.",r.a.createElement("strong",null,"Reset graph"),": Remove all nodes and edges"),r.a.createElement("p",null,"9.",r.a.createElement("strong",null,"Instruction"),": Display instruction"),r.a.createElement("p",null,r.a.createElement("strong",null,"Note"),': You can edit edge weight by clicking on each edge. You can only do this when you are not in "Remove edge" mode.')),r.a.createElement(l.a.Footer,null,r.a.createElement(s.a,{variant:"secondary",onClick:N},"Close"))))};n(53);var N=function(){return r.a.createElement(w,null)};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(N,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[26,1,2]]]);
//# sourceMappingURL=main.10dd4823.chunk.js.map