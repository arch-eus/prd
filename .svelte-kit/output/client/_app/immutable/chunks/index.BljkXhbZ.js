import{n as x,R as L,S as T,f as V,v,w as z,M as j,T as W,x as X,U as I,V as N,b as Y,W as Z,X as k,Y as q,Z as G,_ as H,$ as J,a0 as K,a1 as Q,a2 as tt}from"./scheduler.DrDOSCrp.js";const B=typeof window<"u";let et=B?()=>window.performance.now():()=>Date.now(),A=B?t=>requestAnimationFrame(t):x;const y=new Set;function D(t){y.forEach(e=>{e.c(t)||(y.delete(e),e.f())}),y.size!==0&&A(D)}function nt(t){let e;return y.size===0&&A(D),{promise:new Promise(n=>{y.add(e={c:t,f:n})}),abort(){y.delete(e)}}}const E=new Map;let M=0;function st(t){let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return e>>>0}function it(t,e){const n={stylesheet:T(e),rules:{}};return E.set(t,n),n}function U(t,e,n,s,c,f,l,i=0){const u=16.666/s;let r=`{
`;for(let d=0;d<=1;d+=u){const g=e+(n-e)*f(d);r+=d*100+`%{${l(g,1-g)}}
`}const $=r+`100% {${l(n,1-n)}}
}`,o=`__svelte_${st($)}_${i}`,m=L(t),{stylesheet:p,rules:a}=E.get(m)||it(m,t);a[o]||(a[o]=!0,p.insertRule(`@keyframes ${o} ${$}`,p.cssRules.length));const _=t.style.animation||"";return t.style.animation=`${_?`${_}, `:""}${o} ${s}ms linear ${c}ms 1 both`,M+=1,o}function rt(t,e){const n=(t.style.animation||"").split(", "),s=n.filter(e?f=>f.indexOf(e)<0:f=>f.indexOf("__svelte")===-1),c=n.length-s.length;c&&(t.style.animation=s.join(", "),M-=c,M||at())}function at(){A(()=>{M||(E.forEach(t=>{const{ownerNode:e}=t.stylesheet;e&&V(e)}),E.clear())})}let w;function ot(){return w||(w=Promise.resolve(),w.then(()=>{w=null})),w}function P(t,e,n){t.dispatchEvent(W(`${e?"intro":"outro"}${n}`))}const S=new Set;let h;function ht(){h={r:0,c:[],p:h}}function mt(){h.r||v(h.c),h=h.p}function ft(t,e){t&&t.i&&(S.delete(t),t.i(e))}function pt(t,e,n,s){if(t&&t.o){if(S.has(t))return;S.add(t),h.c.push(()=>{S.delete(t),s&&(n&&t.d(1),s())}),t.o(e)}else s&&s()}const ut={duration:0};function gt(t,e,n,s){let f=e(t,n,{direction:"both"}),l=s?0:1,i=null,u=null,r=null,$;function o(){r&&rt(t,r)}function m(a,_){const d=a.b-l;return _*=Math.abs(d),{a:l,b:a.b,d,duration:_,start:a.start,end:a.start+_,group:a.group}}function p(a){const{delay:_=0,duration:d=300,easing:g=X,tick:O=x,css:R}=f||ut,C={start:et()+_,b:a};a||(C.group=h,h.r+=1),"inert"in t&&(a?$!==void 0&&(t.inert=$):($=t.inert,t.inert=!0)),i||u?u=C:(R&&(o(),r=U(t,l,a,d,_,g,R)),a&&O(0,1),i=m(C,d),j(()=>P(t,a,"start")),nt(b=>{if(u&&b>u.start&&(i=m(u,d),u=null,P(t,i.b,"start"),R&&(o(),r=U(t,l,i.b,i.duration,0,g,f.css))),i){if(b>=i.end)O(l=i.b,1-l),P(t,i.b,"end"),u||(i.b?o():--i.group.r||v(i.group.c)),i=null;else if(b>=i.start){const F=b-i.start;l=i.a+i.d*g(F/i.duration),O(l,1-l)}}return!!(i||u)}))}return{run(a){z(f)?ot().then(()=>{f=f({direction:a?"in":"out"}),p(a)}):p(a)},end(){o(),i=u=null}}}function yt(t,e,n){const s=t.$$.props[e];s!==void 0&&(t.$$.bound[s]=n,n(t.$$.ctx[s]))}function wt(t){t&&t.c()}function xt(t,e){t&&t.l(e)}function lt(t,e,n){const{fragment:s,after_update:c}=t.$$;s&&s.m(e,n),j(()=>{const f=t.$$.on_mount.map(H).filter(z);t.$$.on_destroy?t.$$.on_destroy.push(...f):v(f),t.$$.on_mount=[]}),c.forEach(j)}function ct(t,e){const n=t.$$;n.fragment!==null&&(q(n.after_update),v(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function dt(t,e){t.$$.dirty[0]===-1&&(J.push(t),K(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function vt(t,e,n,s,c,f,l=null,i=[-1]){const u=G;I(t);const r=t.$$={fragment:null,ctx:[],props:f,update:x,not_equal:c,bound:N(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(u?u.$$.context:[])),callbacks:N(),dirty:i,skip_bound:!1,root:e.target||u.$$.root};l&&l(r.root);let $=!1;if(r.ctx=n?n(t,e.props||{},(o,m,...p)=>{const a=p.length?p[0]:m;return r.ctx&&c(r.ctx[o],r.ctx[o]=a)&&(!r.skip_bound&&r.bound[o]&&r.bound[o](a),$&&dt(t,o)),m}):[],r.update(),$=!0,v(r.before_update),r.fragment=s?s(r.ctx):!1,e.target){if(e.hydrate){Q();const o=Y(e.target);r.fragment&&r.fragment.l(o),o.forEach(V)}else r.fragment&&r.fragment.c();e.intro&&ft(t.$$.fragment),lt(t,e.target,e.anchor),tt(),Z()}I(u)}class bt{$$=void 0;$$set=void 0;$destroy(){ct(this,1),this.$destroy=x}$on(e,n){if(!z(n))return x;const s=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return s.push(n),()=>{const c=s.indexOf(n);c!==-1&&s.splice(c,1)}}$set(e){this.$$set&&!k(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}const _t="4";typeof window<"u"&&(window.__svelte||(window.__svelte={v:new Set})).v.add(_t);export{bt as S,xt as a,pt as b,wt as c,ct as d,mt as e,yt as f,ht as g,gt as h,vt as i,lt as m,ft as t};
