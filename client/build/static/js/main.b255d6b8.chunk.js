(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{100:function(e,t,a){},101:function(e,t,a){},102:function(e,t,a){"use strict";a.r(t);var n=a(0),l=a.n(n),r=a(8),i=a.n(r),c=(a(73),a(22)),o=a(16),s=a(29),m=a(28),u=(a(74),a(34)),g=a(10),h=a(18),E=(a(75),a(148)),d=a(150),p=a(142),f=a(147),b=a(149),v=a(143),y=a(146),k=a(145),_=a(4),O=a(144),S=a(151),j=Object(_.a)((function(e){return{head:{backgroundColor:e.palette.common.black,color:e.palette.common.white},body:{fontSize:14}}}))(p.a),w=Object(_.a)((function(e){return{root:{"&:nth-of-type(odd)":{backgroundColor:e.palette.action.hover}}}}))(v.a),N=Object(O.a)({root:{width:"100%"},container:{maxHeight:600}});function C(){var e=N(),t=Object(n.useState)([]),a=Object(h.a)(t,2),r=a[0],i=a[1],c=l.a.useState(0),o=Object(h.a)(c,2),s=o[0],m=o[1],u=l.a.useState(10),p=Object(h.a)(u,2),_=p[0],O=p[1],C=Object(n.useState)(!1),P=Object(h.a)(C,2),x=P[0],K=P[1],A=Object(g.g)().id;A=A.slice(1),Object(n.useEffect)((function(){fetch("http://165.22.214.114/api/getData/"+A,{method:"GET"}).then((function(e){return console.log(e),e.json()})).then((function(e){console.log(e),i(e)}))}));var T=null;return x&&(T=l.a.createElement(g.a,{to:"/"})),l.a.createElement("div",{className:"table"},l.a.createElement("div",{className:"btn-table"},l.a.createElement(k.a,{variant:"contained",color:"primary",onClick:function(){K(!0)}},"Home")),l.a.createElement("h2",null,"Content Analysis- StartupTalky"),l.a.createElement(y.a,{className:e.root},l.a.createElement(f.a,{className:e.container},l.a.createElement(E.a,{stickyHeader:!0,"aria-label":"sticky table"},l.a.createElement(b.a,null,l.a.createElement(v.a,null,l.a.createElement(j,null,"Page URL"),l.a.createElement(j,{align:"right"},"Last modified"),l.a.createElement(j,{align:"right"},"Total WOrds"),l.a.createElement(j,{align:"right"},"Keywords"),l.a.createElement(j,{align:"right"},"No of int. links"),l.a.createElement(j,{align:"right"},"No of do-follow ext. link"),l.a.createElement(j,{align:"right"},"No of no-follow ext. link"),l.a.createElement(j,{align:"right"},"Keyword in 1st para"),l.a.createElement(j,{align:"right"},"Keyword in meta"),l.a.createElement(j,{align:"right"},"Keyword in title"),l.a.createElement(j,{align:"right"},"Title length"),l.a.createElement(j,{align:"right"},"Meta length"),l.a.createElement(j,{align:"right"},"Keyword density"),l.a.createElement(j,{align:"right"},"No of tags"),l.a.createElement(j,{align:"right"},"Broken image"),l.a.createElement(j,{align:"right"},"404 external link"),l.a.createElement(j,{align:"right"},"Other article linking."),l.a.createElement(j,{align:"right"},"Keyword in image alt name"),l.a.createElement(j,{align:"right"},"No of images"),l.a.createElement(j,{align:"right"},"Author anime"))),l.a.createElement(d.a,null,r.slice(s*_,s*_+_).map((function(e){return l.a.createElement(w,{key:e.url},l.a.createElement(j,{component:"th",scope:"row"},e.url),l.a.createElement(j,{align:"right"},e.lastmod),l.a.createElement(j,{align:"right"},e.total_words),l.a.createElement(j,{align:"right"},e.keyword),l.a.createElement(j,{align:"right"},e.no_int_link),l.a.createElement(j,{align:"right"},e.no_doF_link),l.a.createElement(j,{align:"right"},e.no_noF_link),l.a.createElement(j,{align:"right"},e.isKeyPresent_para),l.a.createElement(j,{align:"right"},e.isKeyPresent_meta),l.a.createElement(j,{align:"right"},e.isKeyPresent_title),l.a.createElement(j,{align:"right"},e.title_length),l.a.createElement(j,{align:"right"},e.meta_length),l.a.createElement(j,{align:"right"},e.keyword_density),l.a.createElement(j,{align:"right"},e.no_of_tags),l.a.createElement(j,{align:"right"},e.no_of_brokeimg),l.a.createElement(j,{align:"right"},e.no_of_404),l.a.createElement(j,{align:"right"},e.no_other_link),l.a.createElement(j,{align:"right"},e.isKeyPresent_img),l.a.createElement(j,{align:"right"},e.no_of_img),l.a.createElement(j,{align:"right"},e.author))}))))),l.a.createElement(S.a,{rowsPerPageOptions:[10,15,20],component:"div",count:r.length,rowsPerPage:_,page:s,onChangePage:function(e,t){m(t)},onChangeRowsPerPage:function(e){O(+e.target.value),m(0)}})),T)}var P=a(44),x=a.n(P),K=a(59),A=(a(82),a(60)),T=a.n(A),M=a(61),D=a.n(M),H=function(){return l.a.createElement("div",{className:D.a.Spinner},l.a.createElement("div",null),l.a.createElement("div",null),l.a.createElement("div",null),l.a.createElement("div",null),l.a.createElement("div",null),l.a.createElement("div",null),l.a.createElement("div",null),l.a.createElement("div",null))},J=(a(100),function(e){Object(s.a)(a,e);var t=Object(m.a)(a);function a(e){var n;return Object(c.a)(this,a),(n=t.call(this,e)).onSubmit=function(){n.setState({redirect:!0})},n.state={redirect:!1},n}return Object(o.a)(a,[{key:"render",value:function(){var e=null;return this.state.redirect&&(e=l.a.createElement(g.a,{to:"/table/:"+this.props.id})),l.a.createElement("div",null,l.a.createElement("div",{className:"added-sites"},l.a.createElement(k.a,{variant:"contained",color:"primary",onClick:this.onSubmit},this.props.name)),e)}}]),a}(n.Component));a(101);function U(e){return console.log(e.sites),l.a.createElement("div",null,l.a.createElement("div",{class:"heading"}," ",l.a.createElement("h2",null,"Sites Under Monitor")),l.a.createElement("div",{className:"card-list"},e.sites.map((function(e){return l.a.createElement(J,{id:e._id,name:e.link})}))))}var B=function(e){Object(s.a)(a,e);var t=Object(m.a)(a);function a(){var e;return Object(c.a)(this,a),(e=t.call(this)).inputChange=function(t){e.setState({page_url:t.target.value})},e.handleSubmit=function(){var t=Object(K.a)(x.a.mark((function t(a){var n,l;return x.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e.setState({message:null,willAppear:null}),a.preventDefault(),n=e.state.page_url,"http://165.22.214.114/api/addScrapper",t.prev=4,e.setState({loading:!0}),t.next=8,T.a.post("http://165.22.214.114/api/addScrapper",{pageUrl:n});case 8:l=t.sent,console.log(l),e.setState({message:l.data.message}),t.next=16;break;case 13:t.prev=13,t.t0=t.catch(4),console.log(t.t0);case 16:e.setState({loading:!1});case 17:case"end":return t.stop()}}),t,null,[[4,13]])})));return function(e){return t.apply(this,arguments)}}(),e.state={page_url:"",loading:!1,message:null,sites:[]},e}return Object(o.a)(a,[{key:"componentDidMount",value:function(){var e=this;fetch("http://165.22.214.114/api/getScrapper",{method:"GET"}).then((function(e){return e.json()})).then((function(t){e.setState({sites:t.sites})}))}},{key:"render",value:function(){var e=this.state.sites;return console.log(e),l.a.createElement("div",null,l.a.createElement("div",null,l.a.createElement("h2",null,"Enter websites to monitor"),l.a.createElement("form",{onSubmit:this.handleSubmit},l.a.createElement("input",{id:"input",className:"input",placeholder:"Add website",onChange:this.inputChange}),l.a.createElement("div",{className:"btn"},l.a.createElement(k.a,{variant:"contained",type:"submit",color:"primary"},"Add Website")))),this.state.message?l.a.createElement("div",{style:{color:"black"}},l.a.createElement("h3",null,this.state.message)):"",this.state.loading?l.a.createElement(H,null):null,0!==this.state.sites.length?l.a.createElement(U,{sites:e}):l.a.createElement("h2",null,"No sites under monitor."))}}]),a}(n.Component),F=function(e){Object(s.a)(a,e);var t=Object(m.a)(a);function a(){return Object(c.a)(this,a),t.apply(this,arguments)}return Object(o.a)(a,[{key:"render",value:function(){return l.a.createElement(u.a,null,l.a.createElement("div",{className:"App"},l.a.createElement(g.d,null,l.a.createElement(g.b,{exact:!0,path:"/"},l.a.createElement(B,null)),l.a.createElement(g.b,{path:"/table/:id"},l.a.createElement(C,null)))))}}]),a}(n.Component);i.a.render(l.a.createElement(l.a.StrictMode,null,l.a.createElement(F,null)),document.getElementById("root"))},61:function(e,t,a){e.exports={Spinner:"Spinner_Spinner__3lg6J"}},68:function(e,t,a){e.exports=a(102)},73:function(e,t,a){},74:function(e,t,a){},75:function(e,t,a){},82:function(e,t,a){}},[[68,1,2]]]);
//# sourceMappingURL=main.b255d6b8.chunk.js.map