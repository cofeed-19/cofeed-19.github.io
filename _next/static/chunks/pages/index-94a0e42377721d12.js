(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{5301:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return n(5075)}])},5075:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return m}});var r=n(4051),a=n.n(r),i=n(5893),s=n(5675),c=n(7294),o=n(5003),u=n.n(o),l=n(1335),f=n(4014),d=n(5682);function p(e,t,n,r,a,i,s){try{var c=e[i](s),o=c.value}catch(u){return void n(u)}c.done?t(o):Promise.resolve(o).then(r,a)}function v(e){return function(){var t=this,n=arguments;return new Promise((function(r,a){var i=e.apply(t,n);function s(e){p(i,r,a,s,c,"next",e)}function c(e){p(i,r,a,s,c,"throw",e)}s(void 0)}))}}function h(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function x(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},r=Object.keys(n);"function"===typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(n).filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable})))),r.forEach((function(t){h(e,t,n[t])}))}return e}var b=new(u());function k(){return w.apply(this,arguments)}function w(){return(w=v(a().mark((function e(){var t,n,r,i,s,c,o,u;return a().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,f.qZ)();case 2:return e.next=4,(0,f.lj)();case 4:for(t=e.sent,n={},r=!0,i=!1,s=void 0,e.prev=7,c=t[Symbol.iterator]();!(r=(o=c.next()).done);r=!0)u=o.value,n[u.url]=u;e.next=15;break;case 11:e.prev=11,e.t0=e.catch(7),i=!0,s=e.t0;case 15:e.prev=15,e.prev=16,r||null==c.return||c.return();case 18:if(e.prev=18,!i){e.next=21;break}throw s;case 21:return e.finish(18);case 22:return e.finish(15);case 23:return e.abrupt("return",n);case 24:case"end":return e.stop()}}),e,null,[[7,11,15,23],[16,,18,22]])})))).apply(this,arguments)}function m(){var e=(0,c.useState)({}),t=e[0],n=e[1],r=(0,c.useState)({total:0,loaded:0}),o=r[0],u=r[1];function p(){return h.apply(this,arguments)}function h(){return(h=v(a().mark((function e(){var t,r,i,s,c,o,l,f,p,v,h;return a().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,k();case 2:t=e.sent,r=Object.keys(t).length,u((function(e){return x({},e,{total:r})})),i=!0,s=!1,c=void 0,e.prev=6,o=Object.keys(t)[Symbol.iterator]();case 8:if(i=(l=o.next()).done){e.next=28;break}return f=l.value,e.prev=10,e.next=13,b.parseURL(f);case 13:return p=e.sent,e.next=16,(0,d.KU)(p.link);case 16:v=e.sent,h=x({},p,{url:f,favicon:v,visited:t[f].visited||{}}),t[f]=h,e.next=24;break;case 21:e.prev=21,e.t0=e.catch(10),console.error("Could not update feed for ".concat(f));case 24:u((function(e){return x({},e,{loaded:e.loaded+1})}));case 25:i=!0,e.next=8;break;case 28:e.next=34;break;case 30:e.prev=30,e.t1=e.catch(6),s=!0,c=e.t1;case 34:e.prev=34,e.prev=35,i||null==o.return||o.return();case 37:if(e.prev=37,!s){e.next=40;break}throw c;case 40:return e.finish(37);case 41:return e.finish(34);case 42:n(t);case 43:case"end":return e.stop()}}),e,null,[[6,30,34,42],[10,21],[35,,37,41]])})))).apply(this,arguments)}function w(){return(w=v(a().mark((function e(t){var n,r,i,s,c,o,u,l,d;return a().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:n=t.trim().split(",").filter(Boolean),r=[],i=!0,s=!1,c=void 0,e.prev=3,o=n[Symbol.iterator]();case 5:if(i=(u=o.next()).done){e.next=28;break}return l=u.value,e.prev=8,e.next=11,b.parseURL(l);case 11:d=e.sent,e.next=17;break;case 14:e.prev=14,e.t0=e.catch(8),r.push(l);case 17:if(e.t1=d,!e.t1){e.next=22;break}return e.next=21,(0,f.bd)(l);case 21:e.t1=!e.sent;case 22:if(!e.t1){e.next=25;break}return e.next=25,(0,f.jP)({url:l,visited:{}});case 25:i=!0,e.next=5;break;case 28:e.next=34;break;case 30:e.prev=30,e.t2=e.catch(3),s=!0,c=e.t2;case 34:e.prev=34,e.prev=35,i||null==o.return||o.return();case 37:if(e.prev=37,!s){e.next=40;break}throw c;case 40:return e.finish(37);case 41:return e.finish(34);case 42:r.length&&alert("Could not add:\n".concat(r.join("\n"),"\n\nProbable CORS issue\ud83d\ude22!\nMaybe ask website owner to enable CORS\ud83e\udd14!\nOr install browser extension to allow CORS: https://mybrowseraddon.com/access-control-allow-origin.html")),p();case 44:case"end":return e.stop()}}),e,null,[[3,30,34,42],[8,14],[35,,37,41]])})))).apply(this,arguments)}return(0,c.useEffect)((function(){p()}),[]),(0,c.useEffect)((function(){o.loaded>o.total&&u(x({},o,{loaded:o.total}))}),[o]),(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(l.NC,{}),(0,i.jsx)(l.h4,{}),(0,i.jsxs)("main",{children:[(0,i.jsx)(l.Ob,{onSubmit:function(e){return w.apply(this,arguments)}}),(0,i.jsx)(l.s0,{loadedFeeds:o}),Object.keys(t).map((function(e){var n=t[e],r=n.items.filter((function(e){return e.link&&(!n.visited||!n.visited[e.link])})),a=n.items.filter((function(e){return e.link&&n.visited&&n.visited[e.link]}));return(0,i.jsxs)("section",{children:[(0,i.jsxs)("h3",{children:[n.link?(0,i.jsxs)(i.Fragment,{children:[n.favicon&&(0,i.jsx)(s.default,{alt:n.title,src:n.favicon,width:16,height:16,unoptimized:!0}),(0,i.jsx)(l.dL,{link:n.link,title:n.title})]}):n.title||e," ",(0,i.jsx)("button",{onClick:function(){return function(e,t){confirm("Delete ".concat(t," from feeds?"))&&((0,f.vs)(e),p())}(e,n.title)},children:"\u274c"})]}),(0,i.jsx)(l.lZ,{feed:n,feedUrl:e,newItems:r,updateFeeds:p}),(0,i.jsx)(l.xx,{feed:n,feedUrl:e,visitedItems:a})]},e)}))]}),(0,i.jsx)(l.$_,{})]})}}},function(e){e.O(0,[392,335,774,888,179],(function(){return t=5301,e(e.s=t);var t}));var t=e.O();_N_E=t}]);