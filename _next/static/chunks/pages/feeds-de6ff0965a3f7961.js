(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[716],{9278:function(e,s,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/feeds",function(){return n(1054)}])},1054:function(e,s,n){"use strict";n.r(s),n.d(s,{__N_SSG:function(){return l},default:function(){return Feeds}});var t=n(5893),i=n(7294),d=n(6019),r=n(3485),u=n(5210),c=n.n(u),l=!0;function Feeds(e){let{list:s}=e,n=(0,i.useRef)(null),[u,l]=(0,i.useState)(""),o=(0,i.useCallback)(async e=>{if(await (0,r.jP)({url:e,visited:{}}),l(e),n.current){let e=n.current;e.showModal(),setTimeout(()=>e.close(),2e3)}},[n]);return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(d.NC,{}),(0,t.jsx)(d.h4,{}),(0,t.jsxs)("main",{children:[(0,t.jsx)("h2",{children:"Feeds suggested by users"}),(0,t.jsx)(d.dL,{link:"https://github.com/cofeed-19/cofeed-19.github.io/edit/master/data/feeds.json",title:"Suggest a feed"}),(0,t.jsxs)("dialog",{className:c().dialog,ref:n,children:[u," was added to your feeds"]}),(0,t.jsx)("ul",{className:c().feedsList,children:s.map(e=>{let{feedUrl:s,siteUrl:n,description:i}=e;return(0,t.jsxs)("li",{children:[(0,t.jsx)("button",{onClick:()=>o(s),children:"➕"}),(0,t.jsxs)("div",{children:[(0,t.jsx)(d.dL,{link:n}),(0,t.jsx)("p",{children:i})]})]},s)})})]}),(0,t.jsx)(d.$_,{})]})}},5210:function(e){e.exports={container:"feeds_container__krljv",feedsList:"feeds_feedsList__fedrh",dialog:"feeds_dialog__wKDSr"}}},function(e){e.O(0,[241,19,774,888,179],function(){return e(e.s=9278)}),_N_E=e.O()}]);