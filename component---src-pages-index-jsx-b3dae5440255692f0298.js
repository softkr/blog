(self.webpackChunkgatsby_starter_hoodie=self.webpackChunkgatsby_starter_hoodie||[]).push([[279],{3416:function(e,t,n){"use strict";var o=n(6540),l=n(2568),a=n(1612),i=n(7008),r=n(1960);const c=l.default.div.withConfig({displayName:"Bio__BioWrapper",componentId:"sc-5v8ml6-0"})(["display:flex;align-items:center;@media (max-width:768px){padding:0 15px;}"]),s="undefined"!=typeof window&&"localhost:8000"===window.location.host?"http://localhost:8000":r.siteUrl,m=l.default.div.withConfig({displayName:"Bio__Profile",componentId:"sc-5v8ml6-1"})(["flex:0 0 auto;margin-right:16px;width:128px;height:128px;border-radius:999px;background-image:url(","/profile.png);background-size:cover;background-position:center;"],s),d=l.default.div.withConfig({displayName:"Bio__Author",componentId:"sc-5v8ml6-2"})(["margin-bottom:4.8px;font-size:24px;font-weight:700;color:",";"],(e=>e.theme.colors.text)),p=l.default.div.withConfig({displayName:"Bio__Description",componentId:"sc-5v8ml6-3"})(["margin-bottom:11.2px;line-height:1.5;font-size:16px;color:",";"],(e=>e.theme.colors.secondaryText)),u=l.default.div.withConfig({displayName:"Bio__LinksWrapper",componentId:"sc-5v8ml6-4"})(["& a{margin-right:9.6px;}& svg{width:25.6px;height:25.6px;cursor:pointer;}& svg path{fill:",";transition:fill 0.3s;}& a:hover svg path{fill:",";}"],(e=>e.theme.colors.icon),(e=>e.theme.colors.text)),g=e=>{let{link:t,children:n}=e;return t?o.createElement("a",{href:t,target:"_blank",rel:"noreferrer"},n):null};t.A=()=>{const{github:e,kaggle:t,instagram:n,facebook:l,twitter:s,x:f,blogger:h,medium:x,linkedIn:E,email:b,resume:k,link:v}=r.links;return o.createElement(c,{id:"bio"},o.createElement(m,null),o.createElement("div",null,o.createElement(d,null,"@",r.author),o.createElement(p,null,r.description),o.createElement(u,null,o.createElement(g,{link:e},o.createElement(a.hL4,null)),o.createElement(g,{link:t},o.createElement(a.jJF,null)),o.createElement(g,{link:n},o.createElement(a.ao$,null)),o.createElement(g,{link:l},o.createElement(a.iYk,null)),o.createElement(g,{link:s},o.createElement(a.feZ,null)),o.createElement(g,{link:f},o.createElement(i.TCj,null)),o.createElement(g,{link:x},o.createElement(i.DC0,null)),o.createElement(g,{link:h},o.createElement(i.KRq,null)),o.createElement(g,{link:E},o.createElement(a.QEs,null)),o.createElement(g,{link:b},o.createElement(i.Wjb,null)),o.createElement(g,{link:k},o.createElement(i.HkI,null)),o.createElement(g,{link:v},o.createElement(i.AnD,null)))))}},5608:function(e,t,n){"use strict";var o=n(7350),l=n.n(o),a=n(6540),i=n(2568),r=n(4794),c=n(2912),s=n(3173),m=n(786);const d=i.default.div.withConfig({displayName:"PostList__PostListWrapper",componentId:"sc-1oqnm6-0"})(["@media (max-width:768px){padding:0 10px;}"]),p=i.default.div.withConfig({displayName:"PostList__PostWrapper",componentId:"sc-1oqnm6-1"})(["position:relative;top:0;transition:all 0.5s;@media (max-width:768px){padding:0 5px;}"]),u=i.default.p.withConfig({displayName:"PostList__Date",componentId:"sc-1oqnm6-2"})(["margin-bottom:16px;font-size:14.4px;color:",";"],(e=>e.theme.colors.tertiaryText)),g=i.default.p.withConfig({displayName:"PostList__Excerpt",componentId:"sc-1oqnm6-3"})(["margin-bottom:32px;line-height:1.7;font-size:15px;color:",";word-break:break-all;"],(e=>e.theme.colors.secondaryText));t.A=e=>{let{postList:t}=e;const{0:n,1:o}=(0,a.useState)(10),i=l()((()=>{document.documentElement.scrollHeight-document.documentElement.scrollTop<=document.documentElement.clientHeight+100&&n<t.length&&setTimeout((()=>o(n+10)),300)}),250);return(0,a.useEffect)((()=>(window.addEventListener("scroll",i),()=>{window.removeEventListener("scroll",i)})),[n,t]),(0,a.useEffect)((()=>{o(10)}),[t]),a.createElement(d,null,t.slice(0,n).map(((e,o)=>{const{title:l,date:i,tags:d}=e.frontmatter,{excerpt:f}=e,{slug:h}=e.fields;return a.createElement(a.Fragment,{key:JSON.stringify({slug:h,date:i})},a.createElement(p,null,a.createElement(c.A,{size:"bg"},a.createElement(r.Link,{to:h},l)),a.createElement(u,null,i),a.createElement(g,null,f),a.createElement(m.A,{tagList:d})),n-1!==o&&t.length-1!==o&&a.createElement(s.A,{mt:"48px",mb:"32px"}))})))}},9775:function(e,t,n){"use strict";var o=n(6540),l=n(2568),a=n(4794),i=n(3173),r=n(1960);const c=l.default.div.withConfig({displayName:"Tab__TabWrapper",componentId:"sc-1ebif1p-0"})(["display:flex;justify-content:center;gap:15px;border-bottom:1px solid ",";margin-top:35px;margin-bottom:48px;& a{text-decoration:none;}"],(e=>e.theme.colors.divider)),s=l.default.button.withConfig({displayName:"Tab__TabButton",componentId:"sc-1ebif1p-1"})(["display:flex;align-items:center;padding:0 10px;height:43px;background-color:transparent;border:none;border-bottom:2px solid;border-bottom-color:",";font-size:14px;color:",";font-weight:",";letter-spacing:1px;cursor:pointer;transition:all 0.2s;&:hover{color:",";border-bottom-color:",";}& svg{margin-right:10px;height:20px;}"],(e=>e.active?e.theme.colors.text:"transparent"),(e=>e.active?e.theme.colors.text:e.theme.colors.tertiaryText),(e=>e.active?"bold":"normal"),(e=>e.theme.colors.text),(e=>e.active?e.theme.colors.text:e.theme.colors.divider)),m=l.default.span.withConfig({displayName:"Tab__Badge",componentId:"sc-1ebif1p-2"})(["display:inline-block;margin-left:7px;padding:3px 6px;border-radius:50px;background-color:",";color:",";font-weight:normal;font-size:13px;letter-spacing:0.3px;transition:all 0.2s;"],(e=>e.theme.colors.tagBackground),(e=>e.theme.colors.tagText));t.A=e=>{let{postsCount:t,activeTab:n}=e;return r.useAbout?o.createElement(c,null,o.createElement(a.Link,{to:"/"},o.createElement(s,{active:"posts"==n},"POSTS ",o.createElement(m,null,t))),o.createElement(a.Link,{to:"/about"},o.createElement(s,{active:"about"==n},"ABOUT"))):o.createElement(i.A,null)}},786:function(e,t,n){"use strict";var o=n(6540),l=n(2568),a=n(4794);const i=l.default.div.withConfig({displayName:"TagList__TagListWrapper",componentId:"sc-s1uz5f-0"})(["margin-bottom:16px;word-break:break-all;"]),r=l.default.div.withConfig({displayName:"TagList__TagLink",componentId:"sc-s1uz5f-1"})(["display:inline-block;padding:9.6px 11.2px;margin-right:8px;margin-bottom:8px;border-radius:50px;background-color:",";color:",";text-decoration:none;font-size:14.4px;transition:all 0.2s;&:hover{background-color:",";}"],(e=>e.selected?e.theme.colors.selectedTagBackground:e.theme.colors.tagBackground),(e=>e.selected?e.theme.colors.selectedTagText:e.theme.colors.tagText),(e=>e.selected?e.theme.colors.hoveredSelectedTagBackground:e.theme.colors.hoveredTagBackground)),c=e=>e.replace(/\s+/g,"-");t.A=e=>{let{tagList:t,count:n,selected:l}=e;return t?n?o.createElement(i,null,t.map(((e,t)=>o.createElement(a.Link,{key:JSON.stringify({tag:e,i:t}),to:l===e.fieldValue?"/tags":"/tags?q="+e.fieldValue},o.createElement(r,{selected:e.fieldValue===l},c(e.fieldValue)," (",e.totalCount,")"))))):o.createElement(i,null,t.map(((e,t)=>o.createElement(a.Link,{key:JSON.stringify({tag:e,i:t}),to:"/tags?q="+e},o.createElement(r,null,c(e)))))):null}},7352:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return y}});var o=n(3031),l=n.n(o),a=n(6540),i=n(6288),r=n(5482),c=n(3416),s=n(5608),m=n(5378),d=n.n(m),p=n(2568),u=n(4794);const g=p.default.div.withConfig({displayName:"SideTagList__RelativeWrapper",componentId:"sc-11pn9fc-0"})(["position:relative;"]),f=p.default.aside.withConfig({displayName:"SideTagList__Wrapper",componentId:"sc-11pn9fc-1"})(["position:absolute;left:112%;top:0px;width:200px;height:100px;font-size:16px;@media (max-width:1300px){display:none;}"]),h=p.default.div.withConfig({displayName:"SideTagList__Title",componentId:"sc-11pn9fc-2"})(["margin-bottom:25px;font-weight:bold;color:",";"],(e=>e.theme.colors.secondaryText)),x=p.default.li.withConfig({displayName:"SideTagList__Tag",componentId:"sc-11pn9fc-3"})(["margin-bottom:16px;color:",";cursor:pointer;transition:color 0.3s;&:hover{color:",";}& > a{color:inherit;text-decoration:none;}"],(e=>e.theme.colors.tertiaryText),(e=>e.theme.colors.text));var E=e=>{let{tags:t,postCount:n}=e;return a.createElement(g,null,a.createElement(f,null,a.createElement(h,null,"TAG LIST"),a.createElement("ul",null,a.createElement(x,null,a.createElement(u.Link,{to:"/tags"},"all (",n,")")),d()(t,(e=>a.createElement(x,{key:e.fieldValue},a.createElement(u.Link,{to:"/tags?q="+e.fieldValue},e.fieldValue," (",e.totalCount,")")))))))},b=n(698),k=n(9775),v=n(1960);var y=e=>{let{data:t}=e;const n=t.allMarkdownRemark.nodes,o=l()(t.allMarkdownRemark.group,["totalCount"]).reverse();return 0===n.length?a.createElement("p",null,'No blog posts found. Add markdown posts to "content/blog" (or the directory you specified for the "gatsby-source-filesystem" plugin in gatsby-config.js).'):a.createElement(i.A,null,a.createElement(r.A,{title:v.title,description:v.description,url:v.siteUrl}),a.createElement(b.A,{size:48}),a.createElement(c.A,null),a.createElement(k.A,{postsCount:n.length,activeTab:"posts"}),a.createElement(E,{tags:o,postCount:n.length}),a.createElement(s.A,{postList:n}))}},5378:function(e,t,n){var o=n(4932),l=n(5389),a=n(5128),i=n(6449);e.exports=function(e,t){return(i(e)?o:a)(e,l(t,3))}}}]);
//# sourceMappingURL=component---src-pages-index-jsx-b3dae5440255692f0298.js.map