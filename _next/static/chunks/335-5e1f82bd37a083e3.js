"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[335],{1335:function(e,t,n){n.d(t,{Id:function(){return _},dL:function(){return o},$_:function(){return i},NC:function(){return D},h4:function(){return N},Ob:function(){return E},lZ:function(){return R},s0:function(){return I},xx:function(){return U}});var r=n(5893);function o(e){var t=e.title,n=e.link,o=e.onClick;return(0,r.jsx)("a",{href:n,rel:"noopener",target:"_blank",onClick:o,children:t||n})}function i(){return(0,r.jsxs)("footer",{children:[(0,r.jsx)("hr",{}),"\xa9 ",(new Date).getFullYear()," ",(0,r.jsx)("a",{href:"https://github.com/strdr4605",rel:"noopener noreferrer",target:"_blank",children:"@strdr4605"}),". Try ",(0,r.jsx)("code",{children:"https://strdr4605.com/feed/rss.xml"})," as your first web feed. ",(0,r.jsx)("br",{})]})}var c=n(1664),u=n(7294),s=n(4051),a=n.n(s),l=n(4014),f=n(1438);function d(e){try{for(var t,n={},r=(e+"").split(""),o=[],i=r[0],c=256,u=1;u<r.length;u++)null!=n[i+(t=r[u])]?i+=t:(o.push(i.length>1?n[i]:i.charCodeAt(0)),n[i+t]=c,c++,i=t);o.push(i.length>1?n[i]:i.charCodeAt(0));for(var s=0;s<o.length;s++)o[s]=String.fromCharCode(o[s]);return a=o.join(""),window.btoa(unescape(encodeURIComponent(a)))}catch(l){return console.log("Failed to compress string return empty string",l),""}var a}function p(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function h(e,t,n,r,o,i,c){try{var u=e[i](c),s=u.value}catch(a){return void n(a)}u.done?t(s):Promise.resolve(s).then(r,o)}function v(e){return function(){var t=this,n=arguments;return new Promise((function(r,o){var i=e.apply(t,n);function c(e){h(i,r,o,c,u,"next",e)}function u(e){h(i,r,o,c,u,"throw",e)}c(void 0)}))}}function m(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var r,o,i=[],c=!0,u=!1;try{for(n=n.call(e);!(c=(r=n.next()).done)&&(i.push(r.value),!t||i.length!==t);c=!0);}catch(s){u=!0,o=s}finally{try{c||null==n.return||n.return()}finally{if(u)throw o}}return i}}(e,t)||function(e,t){if(!e)return;if("string"===typeof e)return p(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(n);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return p(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function x(e,t){var n=document.createElement("a");n.setAttribute("href","data:text/plain;charset=utf-8,"+encodeURIComponent(t)),n.setAttribute("download",e),n.style.display="none",document.body.appendChild(n),n.click(),document.body.removeChild(n)}function y(){return w.apply(this,arguments)}function w(){return(w=v(a().mark((function e(){var t,n,r,o;return a().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,l.lj)();case 2:return t=e.sent.map((function(e){return k(e)})),n={db:f.tr,feed:t},x((new Date).toLocaleDateString("uk-en")+"-cofeed.json",JSON.stringify(n,void 0,2)),r=d(JSON.stringify(n)),o=f.N8+r,e.abrupt("return",o);case 8:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function b(e){return j.apply(this,arguments)}function j(){return(j=v(a().mark((function e(t){var n;return a().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:(n=JSON.parse(t)).feed?(n.feed.forEach((function(e){return(0,l.jP)(g(e))})),console.log("Database updated successfully"),window.location.reload()):alert("Feed is empty");case 2:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function g(e){var t,n=e.domain,r=e.priority;return{url:n+e.url,visited:(null===(t=e.visited)||void 0===t?void 0:t.reduce((function(e,t){return e[n+t]=!0,e}),{}))||{},priority:r}}function k(e){var t,n,r=e.url,o=e.priority,i="",c="",u=null===(t=/(?<=\.).*?(?=\/)/.exec(e.url))||void 0===t?void 0:t[0];if(u){var s=m(r.split(".".concat(u,"/")),2),a=s[0],l=s[1];i="".concat(a).concat(u,"/"),c=l}else i="".concat(r,"/");var f=Object.keys(null!==(n=e.visited)&&void 0!==n?n:{}).map((function(e){return e.replace(i,"")}));return{domain:i,url:c,visited:f,priority:o}}function S(e,t,n,r,o,i,c){try{var u=e[i](c),s=u.value}catch(a){return void n(a)}u.done?t(s):Promise.resolve(s).then(r,o)}function P(e){return function(){var t=this,n=arguments;return new Promise((function(r,o){var i=e.apply(t,n);function c(e){S(i,r,o,c,u,"next",e)}function u(e){S(i,r,o,c,u,"throw",e)}c(void 0)}))}}function C(){var e=(0,u.useState)("");e[0],e[1];function t(){return(t=P(a().mark((function e(){return a().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:y();case 1:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function n(){return(n=P(a().mark((function e(t){var n,r,o;return a().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=null===(n=t.target.files)||void 0===n?void 0:n[0],e.next=4,null===r||void 0===r?void 0:r.text();case 4:(o=e.sent)&&b(o);case 6:case"end":return e.stop()}}),e)})))).apply(this,arguments)}return(0,r.jsxs)("details",{children:[(0,r.jsx)("summary",{children:"Export/Import"}),(0,r.jsx)("p",{children:"In case if you want to move to a new browser or new device you can export the current state of your feeds:"}),(0,r.jsx)("button",{onClick:function(){return t.apply(this,arguments)},children:"Export feeds"}),(0,r.jsx)("hr",{}),(0,r.jsxs)("label",{children:["Import from file",(0,r.jsx)("br",{}),(0,r.jsx)("input",{type:"file",name:"my_files[]",onChange:function(e){return n.apply(this,arguments)}})]})]})}var F=n(5682);function N(){var e=(0,u.useState)(!1),t=e[0],n=e[1];return(0,u.useEffect)((function(){(!localStorage.getItem("dark-mode")&&window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches||"true"===localStorage.getItem("dark-mode"))&&((0,F.C8)(),n(!0))}),[]),(0,r.jsxs)("header",{children:[(0,r.jsx)(c.default,{href:"/",children:(0,r.jsxs)("h1",{children:[(0,r.jsx)("span",{children:"C"}),"lient-",(0,r.jsx)("span",{children:"o"}),"nly ",(0,r.jsx)("span",{children:"Feed"})," Reader"]})}),(0,r.jsxs)("p",{children:["No backend! All your feeds are stored in this browser!",(0,r.jsx)("iframe",{src:"https://ghbtns.com/github-btn.html?user=cofeed-19&repo=cofeed-19.github.io&type=star&count=true",frameBorder:"0",scrolling:"0",width:"110",height:"20",title:"GitHub"})]}),(0,r.jsxs)("details",{children:[(0,r.jsx)("summary",{children:"Usage"}),(0,r.jsxs)("ul",{children:[(0,r.jsxs)("li",{style:{color:"red"},children:["Because we do cross-origin requests some web feeds are blocked by CORS policy\ud83d\ude22. But you can install"," ",(0,r.jsx)("a",{href:"https://mybrowseraddon.com/access-control-allow-origin.html",children:"a browser extension that allow CORS"}),"\ud83d\ude0a."]}),(0,r.jsx)("li",{children:"Supports RSS and Atom feeds"}),(0,r.jsxs)("li",{children:["Try ",(0,r.jsx)("u",{children:"http"})," and ",(0,r.jsx)("u",{children:"https"})]}),(0,r.jsxs)("li",{children:["If it's a personal blog, maybe ask the owner to"," ",(0,r.jsx)(o,{link:"https://enable-cors.org/server.html",title:"enable CORS"})]}),(0,r.jsx)("li",{children:(0,r.jsx)(c.default,{href:"/feeds",children:"Feeds added by users"})}),(0,r.jsx)("li",{children:(0,r.jsxs)("label",{children:[(0,r.jsx)("input",{type:"checkbox",checked:t,onChange:function(e){e.target.checked?(n(!0),(0,F.C8)(),localStorage.setItem("dark-mode","true")):(n(!1),(0,F.UL)(),localStorage.setItem("dark-mode","false"))}}),"Dark mode"]})})]}),(0,r.jsxs)("details",{children:[(0,r.jsx)("summary",{children:"Why to use?"}),(0,r.jsx)("div",{children:(0,r.jsxs)("ul",{children:[(0,r.jsx)("li",{children:"It's Free"}),(0,r.jsx)("li",{children:"No account"}),(0,r.jsx)("li",{children:"No tracking"}),(0,r.jsx)("li",{children:"Minimalist"}),(0,r.jsx)("li",{children:"Open source"})]})})]}),(0,r.jsxs)("details",{children:[(0,r.jsx)("summary",{children:"Why NOT to use?"}),(0,r.jsx)("div",{children:(0,r.jsxs)("ul",{children:[(0,r.jsx)("li",{children:"CORS issue"}),(0,r.jsx)("li",{children:"No sync with other devices"}),(0,r.jsx)("li",{children:"Minimalist"})]})})]}),(0,r.jsx)(C,{})]}),(0,r.jsx)("hr",{})]})}var A=n(9008);function D(){return(0,r.jsxs)(A.default,{children:[(0,r.jsx)("meta",{charSet:"UTF-8"}),(0,r.jsx)("meta",{name:"viewport",content:"width=device-width, initial-scale=1"}),(0,r.jsx)("title",{children:"Client-only Feed Reader"}),(0,r.jsx)("meta",{name:"description",content:"Client-only Free Web Feed Reader, No account, No registration, No tracking, Minimalist, Open source"}),(0,r.jsx)("meta",{property:"og:title",content:"Client-only Feed Reader"}),(0,r.jsx)("meta",{property:"og:image",content:"https://cofeed-19.github.io/banner.jpg"}),(0,r.jsx)("meta",{property:"og:type",content:"website"}),(0,r.jsx)("meta",{property:"og:locale",content:"en_US"}),(0,r.jsx)("meta",{property:"og:description",content:"Client-only Free Web Feed Reader, No account, No registration, No tracking, Minimalist, Open source"}),(0,r.jsx)("meta",{property:"og:url",content:"https://cofeed-19.github.io/"}),(0,r.jsx)("meta",{name:"twitter:card",content:"summary_large_image"}),(0,r.jsx)("meta",{name:"twitter:site",content:"https://cofeed-19.github.io/"}),(0,r.jsx)("meta",{name:"twitter:creator",content:"@strdr4605"}),(0,r.jsx)("link",{rel:"icon",href:"https://cofeed-19.github.io/favicon.ico"}),(0,r.jsx)("link",{rel:"apple-touch-icon",sizes:"180x180",href:"https://cofeed-19.github.io/apple-touch-icon.png"}),(0,r.jsx)("link",{rel:"icon",type:"image/png",sizes:"32x32",href:"https://cofeed-19.github.io/favicon-32x32.png"}),(0,r.jsx)("link",{rel:"icon",type:"image/png",sizes:"16x16",href:"https://cofeed-19.github.io/favicon-16x16.png"}),(0,r.jsx)("link",{rel:"manifest",href:"/site.webmanifest"}),(0,r.jsx)("meta",{name:"theme-color",content:"#EE802f"})]})}function E(e){var t=e.onSubmit,n=(0,u.useState)(""),o=n[0],i=n[1];return(0,r.jsxs)("form",{onSubmit:function(e){e.preventDefault(),o&&t(o)},children:[(0,r.jsx)("input",{placeholder:"https://strdr4605.com/feed/rss.xml,http://example.com/atom.xml",type:"text",value:o,onChange:function(e){i(e.target.value)}}),(0,r.jsx)("button",{type:"submit",children:"Add feeds"})]})}function I(e){var t=e.loadedFeeds;return t.loaded!==t.total?(0,r.jsxs)("h3",{children:["Loading:",(0,r.jsx)("progress",{id:"loading",value:t.loaded,max:t.total})]}):null}function O(e,t,n,r,o,i,c){try{var u=e[i](c),s=u.value}catch(a){return void n(a)}u.done?t(s):Promise.resolve(s).then(r,o)}function B(e){return function(){var t=this,n=arguments;return new Promise((function(r,o){var i=e.apply(t,n);function c(e){O(i,r,o,c,u,"next",e)}function u(e){O(i,r,o,c,u,"throw",e)}c(void 0)}))}}function R(e){var t=e.feed,n=e.feedUrl,i=e.newItems,c=e.updateFeeds;function u(){return(u=B(a().mark((function e(t,n,r){var o;return a().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n&&r){e.next=2;break}return e.abrupt("return");case 2:return t&&(t.currentTarget.style.color="var(--link-visited-color)"),e.next=5,(0,l.bd)(n);case 5:return(o=e.sent).visited&&(o.visited[r]=!0),e.next=9,(0,l.eS)(o);case 9:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function s(){return(s=B(a().mark((function e(t,n){var r,o,i,c,u,s,f;return a().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t&&n.length){e.next=2;break}return e.abrupt("return");case 2:return e.next=4,(0,l.bd)(t);case 4:if(!(r=e.sent).visited){e.next=23;break}for(o=!0,i=!1,c=void 0,e.prev=7,u=n[Symbol.iterator]();!(o=(s=u.next()).done);o=!0)f=s.value,r.visited[f]=!0;e.next=15;break;case 11:e.prev=11,e.t0=e.catch(7),i=!0,c=e.t0;case 15:e.prev=15,e.prev=16,o||null==u.return||u.return();case 18:if(e.prev=18,!i){e.next=21;break}throw c;case 21:return e.finish(18);case 22:return e.finish(15);case 23:return e.next=25,(0,l.eS)(r);case 25:case"end":return e.stop()}}),e,null,[[7,11,15,23],[16,,18,22]])})))).apply(this,arguments)}return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("ul",{children:null===i||void 0===i?void 0:i.map((function(e){return e.link?(0,r.jsxs)("li",{children:[(0,r.jsx)(_,{date:e.pubDate}),(0,r.jsx)(o,{title:e.title||e.link,link:e.link,onClick:function(t){return function(e,t,n){return u.apply(this,arguments)}(t,n,e.link)}})]},e.link):null}))}),i.length?(0,r.jsx)("button",{onClick:function(){confirm("Mark all ".concat((null===t||void 0===t?void 0:t.title)||n," as visited?"))&&(!function(e,t){s.apply(this,arguments)}(n,i.map((function(e){return e.link||""})).filter(Boolean)),c())},children:"Mark all as visited"}):null]})}function U(e){var t=e.feed,n=e.feedUrl,i=e.visitedItems;return(0,r.jsx)(r.Fragment,{children:Object.keys(t.visited||{}).length?(0,r.jsxs)("details",{children:[(0,r.jsxs)("summary",{children:["Visited from ",(null===t||void 0===t?void 0:t.title)||n]}),(0,r.jsx)("ul",{children:null===i||void 0===i?void 0:i.map((function(e){return e.link?(0,r.jsxs)("li",{children:[(0,r.jsx)(_,{date:e.pubDate}),(0,r.jsx)(o,{title:e.title||e.link,link:e.link})]},e.link):null}))})]}):null})}function _(e){var t=e.date;return(0,r.jsx)("span",{children:(0,r.jsx)("i",{children:t?new Date(t).toLocaleDateString(void 0,{timeZone:"UTC",month:"short",day:"2-digit",year:"numeric"}):"No Date"})})}},1438:function(e,t,n){n.d(t,{$P:function(){return o},tr:function(){return i},N8:function(){return c},h4:function(){return r}});var r,o="FeedDb",i=1,c="https://cofeed-19.github.io/";!function(e){e.Name="Site_Feed",e.Key="url"}(r||(r={}))},4014:function(e,t,n){n.d(t,{vs:function(){return L},bd:function(){return R},lj:function(){return O},qZ:function(){return E},jP:function(){return _},eS:function(){return $}});var r=n(4051),o=n.n(r),i=n(1438);function c(e,t,n,r,o,i,c){try{var u=e[i](c),s=u.value}catch(a){return void n(a)}u.done?t(s):Promise.resolve(s).then(r,o)}function u(e){return function(){var t=this,n=arguments;return new Promise((function(r,o){var i=e.apply(t,n);function u(e){c(i,r,o,u,s,"next",e)}function s(e){c(i,r,o,u,s,"throw",e)}u(void 0)}))}}function s(e,t){return a.apply(this,arguments)}function a(){return(a=u(o().mark((function e(t,n){return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:t.createObjectStore(n.Name,{keyPath:n.Key});case 1:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function l(e,t,n){return f.apply(this,arguments)}function f(){return f=u(o().mark((function e(t,n,r){var i,c;return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:i=t.transaction(n,"readwrite"),c=i.objectStore(n),r.forEach(function(){var e=u(o().mark((function e(t){return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,c.add(t);case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}());case 3:case"end":return e.stop()}}),e)}))),f.apply(this,arguments)}function d(e,t,n){return p.apply(this,arguments)}function p(){return(p=u(o().mark((function e(t,n,r){return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",new Promise((function(e){var o=t.transaction([n],"readonly").objectStore(n).get(r);o.onsuccess=function(){return e(o.result)}})));case 1:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function h(e,t){return v.apply(this,arguments)}function v(){return(v=u(o().mark((function e(t,n){var r;return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,new Promise((function(e){var r=t.transaction([n],"readonly").objectStore(n).getAll();r.onsuccess=function(){return e(r.result)}}));case 2:return r=e.sent,e.abrupt("return",r);case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function m(e,t,n){return x.apply(this,arguments)}function x(){return(x=u(o().mark((function e(t,n,r){var i,c;return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return i=t.transaction(n,"readwrite"),c=i.objectStore(n),e.next=4,c.get(r);case 4:if(e.sent){e.next=8;break}return console.log("ID not found",r),e.abrupt("return");case 8:return e.next=10,c.delete(r);case 10:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function y(e,t,n){return w.apply(this,arguments)}function w(){return(w=u(o().mark((function e(t,n,r){var i,c;return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return i=t.transaction(n,"readwrite"),c=i.objectStore(n),e.next=4,c.put(r);case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function b(e,t,n,r,o,i,c){try{var u=e[i](c),s=u.value}catch(a){return void n(a)}u.done?t(s):Promise.resolve(s).then(r,o)}function j(e){return function(){var t=this,n=arguments;return new Promise((function(r,o){var i=e.apply(t,n);function c(e){b(i,r,o,c,u,"next",e)}function u(e){b(i,r,o,c,u,"throw",e)}c(void 0)}))}}function g(){return(g=j(o().mark((function e(t){return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,s(t,i.h4);case 2:k().forEach((function(e){return _(e)}));case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function k(){var e=[],t=!0,n=!1,r=void 0;try{for(var o,i=Object.keys(localStorage)[Symbol.iterator]();!(t=(o=i.next()).done);t=!0){var c=o.value;if(c.startsWith("http")){var u=JSON.parse(localStorage.getItem(c)),s={};Object.keys(u.visited).forEach((function(e){return s[e]=!0})),e.push({url:c,visited:s})}}}catch(a){n=!0,r=a}finally{try{t||null==i.return||i.return()}finally{if(n)throw r}}return e}function S(e,t,n,r,o,i,c){try{var u=e[i](c),s=u.value}catch(a){return void n(a)}u.done?t(s):Promise.resolve(s).then(r,o)}function P(e){return function(){var t=this,n=arguments;return new Promise((function(r,o){var i=e.apply(t,n);function c(e){S(i,r,o,c,u,"next",e)}function u(e){S(i,r,o,c,u,"throw",e)}c(void 0)}))}}var C=[function(e){return g.apply(this,arguments)}];function F(e,t){return N.apply(this,arguments)}function N(){return(N=P(o().mark((function e(t,n){var r;return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=C.slice(t),e.abrupt("return",r.reduce((function(e,t){return e.then((function(){return t(n)}))}),Promise.resolve()).then((function(){return!0})));case 2:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function A(e,t,n,r,o,i,c){try{var u=e[i](c),s=u.value}catch(a){return void n(a)}u.done?t(s):Promise.resolve(s).then(r,o)}function D(e){return function(){var t=this,n=arguments;return new Promise((function(r,o){var i=e.apply(t,n);function c(e){A(i,r,o,c,u,"next",e)}function u(e){A(i,r,o,c,u,"throw",e)}c(void 0)}))}}function E(){return I.apply(this,arguments)}function I(){return(I=D(o().mark((function e(){return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",new Promise((function(e,t){var n=indexedDB.open(i.$P,i.tr);n.onupgradeneeded=function(t){console.log("upgrade is called. old version = ".concat(t.oldVersion,", new version ").concat(t.newVersion));var r=n.result;F(t.oldVersion,r).then((function(t){e(t),r.close()}))},n.onsuccess=function(){console.log("Database was successful created."),e(!0)},n.onerror=function(){console.log("An error occurred initDatabase() function."),t(!1)}})));case 1:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function O(){return B.apply(this,arguments)}function B(){return(B=D(o().mark((function e(){return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",new Promise((function(e,t){var n=indexedDB.open(i.$P,i.tr);n.onsuccess=D(o().mark((function t(){var r,c;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=n.result,t.next=3,h(r,i.h4.Name);case 3:c=t.sent,e(c),r.close();case 6:case"end":return t.stop()}}),t)}))),n.onerror=D(o().mark((function e(){return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:console.log("An error occurred getSiteFeeds() function."),t("An error occurred getSiteFeeds() function.");case 2:case"end":return e.stop()}}),e)})))})));case 1:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function R(e){return U.apply(this,arguments)}function U(){return(U=D(o().mark((function e(t){return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",new Promise((function(e,n){var r=indexedDB.open(i.$P,i.tr);r.onsuccess=D(o().mark((function n(){var c,u;return o().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return c=r.result,n.next=3,d(c,i.h4.Name,t);case 3:u=n.sent,e(u),c.close();case 6:case"end":return n.stop()}}),n)}))),r.onerror=D(o().mark((function e(){return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:console.log("An error occurred getSiteFeeds() function."),n("An error occurred getSiteFeeds() function.");case 2:case"end":return e.stop()}}),e)})))})));case 1:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function _(e){return M.apply(this,arguments)}function M(){return(M=D(o().mark((function e(t){var n;return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:(n=indexedDB.open(i.$P,i.tr)).onsuccess=D(o().mark((function e(){var r;return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=n.result,e.next=3,l(r,i.h4.Name,[t]);case 3:r.close();case 4:case"end":return e.stop()}}),e)}))),n.onerror=D(o().mark((function e(){return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:console.log("An error occurred insertSiteFeed() function.");case 1:case"end":return e.stop()}}),e)})));case 3:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function $(e){return T.apply(this,arguments)}function T(){return(T=D(o().mark((function e(t){return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",new Promise((function(e,n){var r=indexedDB.open(i.$P,i.tr);r.onsuccess=D(o().mark((function n(){var c;return o().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return c=r.result,n.next=3,y(c,i.h4.Name,t);case 3:c.close(),e();case 5:case"end":return n.stop()}}),n)}))),r.onerror=D(o().mark((function e(){return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:console.log("An error occurred updateSiteFeed() function."),n();case 2:case"end":return e.stop()}}),e)})))})));case 1:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function L(e){return W.apply(this,arguments)}function W(){return(W=D(o().mark((function e(t){var n;return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:(n=indexedDB.open(i.$P,i.tr)).onsuccess=D(o().mark((function e(){var r;return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=n.result,e.next=3,m(r,i.h4.Name,t);case 3:r.close();case 4:case"end":return e.stop()}}),e)}))),n.onerror=D(o().mark((function e(){return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:console.log("An error occurred deleteSiteFeed() function.");case 1:case"end":return e.stop()}}),e)})));case 3:case"end":return e.stop()}}),e)})))).apply(this,arguments)}},5682:function(e,t,n){n.d(t,{C8:function(){return s},UL:function(){return a},KU:function(){return l}});var r=n(4051),o=n.n(r),i=n(5392);function c(e,t,n,r,o,i,c){try{var u=e[i](c),s=u.value}catch(a){return void n(a)}u.done?t(s):Promise.resolve(s).then(r,o)}function u(e){return function(){var t=this,n=arguments;return new Promise((function(r,o){var i=e.apply(t,n);function u(e){c(i,r,o,u,s,"next",e)}function s(e){c(i,r,o,u,s,"throw",e)}u(void 0)}))}}function s(){document.documentElement.style.setProperty("--body-bg-color","#000"),document.documentElement.style.setProperty("--body-color","#FFF"),document.documentElement.style.setProperty("--link-color","#FFC400"),document.documentElement.style.setProperty("--link-visited-color","#C27DC0")}function a(){document.documentElement.style.setProperty("--body-bg-color","#FFF"),document.documentElement.style.setProperty("--body-color","#000"),document.documentElement.style.setProperty("--link-color","#00E"),document.documentElement.style.setProperty("--link-visited-color","#551A8B")}function l(e){return f.apply(this,arguments)}function f(){return(f=u(o().mark((function e(t){var n,r,c;return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(e.t1=t,!e.t1){e.next=16;break}return e.next=6,i.Z.getBestIcons(t);case 6:if(e.t3=n=e.sent[0],e.t2=null===e.t3,e.t2){e.next=10;break}e.t2=void 0===n;case 10:if(!e.t2){e.next=14;break}e.t4=void 0,e.next=15;break;case 14:e.t4=n.href;case 15:e.t1=e.t4;case 16:if(e.t5=r=e.t1,e.t0=null!==e.t5,!e.t0){e.next=20;break}e.t0=void 0!==r;case 20:if(!e.t0){e.next=24;break}e.t6=r,e.next=27;break;case 24:return e.next=26,fetch("".concat(t,"/favicon.ico"),{method:"HEAD"}).then((function(e){return e.ok?"".concat(t,"/favicon.ico"):void 0}));case 26:e.t6=e.sent;case 27:return c=e.t6,e.abrupt("return",c);case 29:case"end":return e.stop()}}),e)})))).apply(this,arguments)}}}]);