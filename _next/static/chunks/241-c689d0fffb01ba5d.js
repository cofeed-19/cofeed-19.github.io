(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[241],{5392:function(e,t){"use strict";let r=e=>fetch(e),n=e=>new DOMParser().parseFromString(e,"text/html"),l=e=>r(e).then(e=>e.text()).then(n).then(e=>e.querySelectorAll("head link")),o=e=>{let t=["rel","href","sizes"],r=e=>t.reduce((t,r)=>({...t,[r]:e.getAttribute(r)}),{});return[...e].filter(e=>e.getAttribute("href")&&e.getAttribute("rel").includes("icon")).map(r)},u=e=>t=>{let r=e=>new URL(e).origin;return t.map(({sizes:t,href:n,rel:l})=>({size:parseInt(null==t?void 0:t.split("x")[0])||void 0,href:"/"===n[0]?"".concat(r(e)).concat(n):n,rel:l}))},a=e=>{let t=e=>e.includes("apple-touch-icon");return e.sort((e,r)=>t(r.rel)?1:t(e.rel)?-1:0)},i=e=>e.sort((e,t)=>t.size-e.size),f=e=>e.reduce((e,t)=>{let r=e.filter(({rel:e})=>t.rel===e)[0];if(r){if(t.size>r.size){let r=e.findIndex(({rel:e})=>t.rel===e);e[r]=t}}else e.push(t);return e},[]),c=e=>l(e).then(o).then(u(e)),s=e=>c(e).then(e=>{let t=f(e);return i(t)}),d=e=>s(e).then(e=>{let t=e[0];return t&&t.size>50?t:a(e)});t.Z={getIcons:c,getBestIcons:s,getBestIcon:d}},1516:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getDomainLocale=function(e,t,r,n){return!1},("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},5569:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=r(2648).Z,l=r(7273).Z,o=n(r(7294)),u=r(4532),a=r(3353),i=r(1410),f=r(9064),c=r(370),s=r(9955),d=r(4224),p=r(508),h=r(1516),v=r(4266);let y=new Set;function b(e,t,r,n,l){if(l||a.isLocalURL(t)){if(!n.bypassPrefetchedCheck){let l=void 0!==n.locale?n.locale:"locale"in e?e.locale:void 0,o=t+"%"+r+"%"+l;if(y.has(o))return;y.add(o)}Promise.resolve(e.prefetch(t,r,n)).catch(e=>{})}}function g(e){return"string"==typeof e?e:i.formatUrl(e)}let m=o.default.forwardRef(function(e,t){let r,n;let{href:i,as:y,children:m,prefetch:_,passHref:C,replace:M,shallow:k,scroll:j,locale:x,onClick:E,onMouseEnter:O,onTouchStart:P,legacyBehavior:w=!1}=e,L=l(e,["href","as","children","prefetch","passHref","replace","shallow","scroll","locale","onClick","onMouseEnter","onTouchStart","legacyBehavior"]);r=m,w&&("string"==typeof r||"number"==typeof r)&&(r=o.default.createElement("a",null,r));let I=!1!==_,R=o.default.useContext(s.RouterContext),S=o.default.useContext(d.AppRouterContext),z=null!=R?R:S,A=!R,{href:T,as:U}=o.default.useMemo(()=>{if(!R){let e=g(i);return{href:e,as:y?g(y):e}}let[e,t]=u.resolveHref(R,i,!0);return{href:e,as:y?u.resolveHref(R,y):t||e}},[R,i,y]),D=o.default.useRef(T),K=o.default.useRef(U);w&&(n=o.default.Children.only(r));let N=w?n&&"object"==typeof n&&n.ref:t,[H,Z,q]=p.useIntersection({rootMargin:"200px"}),B=o.default.useCallback(e=>{(K.current!==U||D.current!==T)&&(q(),K.current=U,D.current=T),H(e),N&&("function"==typeof N?N(e):"object"==typeof N&&(N.current=e))},[U,N,T,q,H]);o.default.useEffect(()=>{z&&Z&&I&&b(z,T,U,{locale:x},A)},[U,T,Z,x,I,null==R?void 0:R.locale,z,A]);let F={ref:B,onClick(e){w||"function"!=typeof E||E(e),w&&n.props&&"function"==typeof n.props.onClick&&n.props.onClick(e),z&&!e.defaultPrevented&&function(e,t,r,n,l,u,i,f,c,s){let{nodeName:d}=e.currentTarget,p="A"===d.toUpperCase();if(p&&(function(e){let t=e.currentTarget,r=t.getAttribute("target");return r&&"_self"!==r||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.nativeEvent&&2===e.nativeEvent.which}(e)||!c&&!a.isLocalURL(r)))return;e.preventDefault();let h=()=>{"beforePopState"in t?t[l?"replace":"push"](r,n,{shallow:u,locale:f,scroll:i}):t[l?"replace":"push"](n||r,{forceOptimisticNavigation:!s})};c?o.default.startTransition(h):h()}(e,z,T,U,M,k,j,x,A,I)},onMouseEnter(e){w||"function"!=typeof O||O(e),w&&n.props&&"function"==typeof n.props.onMouseEnter&&n.props.onMouseEnter(e),z&&(I||!A)&&b(z,T,U,{locale:x,priority:!0,bypassPrefetchedCheck:!0},A)},onTouchStart(e){w||"function"!=typeof P||P(e),w&&n.props&&"function"==typeof n.props.onTouchStart&&n.props.onTouchStart(e),z&&(I||!A)&&b(z,T,U,{locale:x,priority:!0,bypassPrefetchedCheck:!0},A)}};if(f.isAbsoluteUrl(U))F.href=U;else if(!w||C||"a"===n.type&&!("href"in n.props)){let e=void 0!==x?x:null==R?void 0:R.locale,t=(null==R?void 0:R.isLocaleDomain)&&h.getDomainLocale(U,e,null==R?void 0:R.locales,null==R?void 0:R.domainLocales);F.href=t||v.addBasePath(c.addLocale(U,e,null==R?void 0:R.defaultLocale))}return w?o.default.cloneElement(n,F):o.default.createElement("a",Object.assign({},L,F),r)});t.default=m,("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},508:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.useIntersection=function(e){let{rootRef:t,rootMargin:r,disabled:i}=e,f=i||!o,[c,s]=n.useState(!1),d=n.useRef(null),p=n.useCallback(e=>{d.current=e},[]);n.useEffect(()=>{if(o){if(f||c)return;let e=d.current;if(e&&e.tagName){let n=function(e,t,r){let{id:n,observer:l,elements:o}=function(e){let t;let r={root:e.root||null,margin:e.rootMargin||""},n=a.find(e=>e.root===r.root&&e.margin===r.margin);if(n&&(t=u.get(n)))return t;let l=new Map,o=new IntersectionObserver(e=>{e.forEach(e=>{let t=l.get(e.target),r=e.isIntersecting||e.intersectionRatio>0;t&&r&&t(r)})},e);return t={id:r,observer:o,elements:l},a.push(r),u.set(r,t),t}(r);return o.set(e,t),l.observe(e),function(){if(o.delete(e),l.unobserve(e),0===o.size){l.disconnect(),u.delete(n);let e=a.findIndex(e=>e.root===n.root&&e.margin===n.margin);e>-1&&a.splice(e,1)}}}(e,e=>e&&s(e),{root:null==t?void 0:t.current,rootMargin:r});return n}}else if(!c){let e=l.requestIdleCallback(()=>s(!0));return()=>l.cancelIdleCallback(e)}},[f,r,t,c,d.current]);let h=n.useCallback(()=>{s(!1)},[]);return[p,c,h]};var n=r(7294),l=r(29);let o="function"==typeof IntersectionObserver,u=new Map,a=[];("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},9008:function(e,t,r){e.exports=r(2636)},1664:function(e,t,r){e.exports=r(5569)}}]);