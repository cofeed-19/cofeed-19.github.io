(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{8312:function(t,e,i){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return i(4186)}])},1049:function(t,e,i){"use strict";function n(t){let{src:e}=t;return e}i.r(e),i.d(e,{default:function(){return n}})},4186:function(t,e,i){"use strict";i.r(e),i.d(e,{default:function(){return h}});var n=i(5893),r=i(5675),o=i.n(r),l=i(7294),s=i(5003),a=i.n(s),c=i(7290),u=i(5491),d=i(8048),f=i(7840),p=i.n(f);let y=new(a());async function w(){await (0,u.qZ)();let t=await (0,u.lj)(),e={};for(let i of t)e[i.url]=i;return e}function h(){let[t,e]=(0,l.useState)(0),[i,r]=(0,l.useState)({}),[s,a]=(0,l.useState)({total:0,loaded:0});async function f(){let t=0,n=await w(),o=Object.keys(n).length;for(let e of(a(t=>({...t,total:o})),Object.keys(n))){if(e in i){n[e]=i[e];continue}try{let i=await y.parseURL(e),r=await (0,d.KU)(i.link),o={...i,url:e,favicon:r,visited:n[e].visited||{},priority:n[e].priority};o.priority&&o.priority>t&&(t=o.priority),n[e]=o}catch(t){console.error("Could not update feed for ".concat(e))}a(t=>({...t,loaded:t.loaded+1}))}e(t),r(n)}async function h(t){let e=t.trim().split(",").filter(Boolean),i=[];for(let t of e){let e;try{e=await y.parseURL(t)}catch(e){i.push(t)}e&&!await (0,u.bd)(t)&&await (0,u.jP)({url:t,visited:{}})}i.length&&alert("Could not add:\n".concat(i.join("\n"),"\n\nProbable CORS issue\uD83D\uDE22!\nMaybe ask website owner to enable CORS\uD83E\uDD14!\nOr install browser extension to allow CORS: https://mybrowseraddon.com/access-control-allow-origin.html")),f()}let j=(0,l.useMemo)(()=>{let t=Object.keys(i);return t.sort((t,e)=>{var n,r;let o=i[t],l=i[e],s=null!==(n=o.priority)&&void 0!==n?n:0,a=null!==(r=l.priority)&&void 0!==r?r:0;return s>a?-1:s<a?1:0}),t},[i]),m=(0,l.useCallback)(async n=>{let r=j.map(t=>i[t]).map(e=>e.url===n.url?{...e,priority:n.priority?void 0:t+1}:e);r.sort((t,e)=>t.priority&&e.priority?t.priority-e.priority:t.priority?-1:e.priority?1:0);let o=r.map((t,e)=>t.priority?{...t,priority:e+1}:t);for(let t of o)await (0,u.eS)(t);e(o.length),f()},[t,j,i]);return(0,l.useEffect)(()=>{f()},[]),(0,l.useEffect)(()=>{s.loaded>s.total&&a({...s,loaded:s.total})},[s]),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(c.NC,{}),(0,n.jsx)(c.h4,{}),(0,n.jsxs)("main",{className:p().container,children:[(0,n.jsx)(c.Ob,{onSubmit:h}),(0,n.jsx)(c.s0,{loadedFeeds:s}),j.map(t=>{let e=i[t],r=e.items.filter(t=>t.link&&(!e.visited||!e.visited[t.link])),l=e.items.filter(t=>t.link&&e.visited&&e.visited[t.link]);return(0,n.jsxs)("section",{className:p().feed,children:[(0,n.jsxs)("h3",{children:[(0,n.jsx)(c.fE,{feed:e,onClick:m}),e.link?(0,n.jsxs)(n.Fragment,{children:[e.favicon&&(0,n.jsx)(o(),{alt:e.title||t,src:e.favicon,width:16,height:16,unoptimized:!0}),(0,n.jsx)(c.dL,{link:e.link,title:e.title})]}):e.title||t," ",(0,n.jsx)("button",{onClick:()=>{var i;return i=e.title,void(confirm("Delete ".concat(i," from feeds?"))&&((0,u.vs)(t),f()))},children:"❌"})]}),(0,n.jsx)(c.lZ,{feed:e,feedUrl:t,newItems:r,updateFeeds:f}),(0,n.jsx)(c.xx,{feed:e,feedUrl:t,visitedItems:l})]},t)})]}),(0,n.jsx)(c.$_,{})]})}},7840:function(t){t.exports={container:"styles_container__Nwnoi",feed:"styles_feed__fEf5I"}}},function(t){t.O(0,[241,214,290,774,888,179],function(){return t(t.s=8312)}),_N_E=t.O()}]);