(this["webpackJsonpmass-vocab-search-gh-pages"]=this["webpackJsonpmass-vocab-search-gh-pages"]||[]).push([[0],{21:function(e,t,n){},42:function(e){e.exports=JSON.parse('{"key":"dict.1.1.20210530T134803Z.eb14b9d158dd0367.91c5634596c93b8bc100475dc9e8af1f22972a96"}')},43:function(e){e.exports=JSON.parse('{"key":"1be91e33-f360-859c-bb8b-93d41b745d6c:fx"}')},52:function(e,t,n){},79:function(e,t,n){},82:function(e,t,n){},83:function(e,t,n){},84:function(e,t,n){},87:function(e,t,n){},90:function(e,t,n){"use strict";n.r(t);var i=n(0),a=n.n(i),s=n(12),r=n.n(s),c=(n(52),n(7)),o=n(8),d=n(10),l=n(9),u=n(46),h=n(5),f=(n(21),n(17)),p=n.n(f),j=n(22),b=n(19),x=n(20),g=n.n(x),m=(n(71),n(26)),v=n(18),O=(n(79),n(1)),y=function(e){Object(d.a)(n,e);var t=Object(l.a)(n);function n(){return Object(c.a)(this,n),t.call(this)}return Object(o.a)(n,[{key:"renderDefinition",value:function(e){if(e.definition.def&&e.definition.def.length>0){var t=e.definition.def[0].tr.map((function(e){return Object(O.jsx)("li",{children:e.text})}));return Object(O.jsx)("ol",{children:t})}if(e.definition.translations.length>0){if(""===e.definition.translations[0]||void 0===e.definition.translations[0])return"no definition found :(";var n=e.definition.translations.map((function(e){return Object(O.jsx)("li",{children:e.text})}));return Object(O.jsx)("ol",{children:n})}return"no definition found :("}},{key:"detectImageRotation",value:function(){var e=this.props.detections[0],t=e.boundingPoly.vertices[0],n=e.boundingPoly.vertices[1],i=e.boundingPoly.vertices[3],a=e.boundingPoly.vertices[2];return n.x>t.x&&Math.abs(n.x-t.x)>Math.abs(n.x-a.x)?(console.log("0 1\n3 2"),"right side up"):(console.log("the image was flipped at some point during detection and I simply don't know why :/"),n.x<t.x&&Math.abs(n.x-t.x)>Math.abs(t.x-a.x)?(console.log("2 3\n1 0"),"upside-down"):i.x>n.x&&Math.abs(i.x-n.x)>Math.abs(n.x-t.x)?(console.log("1 2\n0 3"),"rotated left"):n.x>i.x&&Math.abs(n.x-i.x)>Math.abs(n.x-t.x)?(console.log("3 0\n2 1"),"rotated right"):void 0)}},{key:"renderDetectionsOnImage",value:function(){var e=this,t=this.detectImageRotation();return this.props.detections.map((function(n,i){var a=n.boundingPoly.vertices[0],s=n.boundingPoly.vertices[1],r=n.boundingPoly.vertices[3],c=n.boundingPoly.vertices[2],o=Math.min(a.y,s.y,r.y,c.y),d=Math.min(a.x,s.x,r.x,c.x),l=Math.max(a.y,s.y,r.y,c.y),u=Math.max(a.x,s.x,r.x,c.x),h=o,f=d,p=l-o,j=u-d;"right side up"!==t&&("rotated left"===t&&(console.log("correcting left rotation"),h=d,f=e.props.imageWidth-l,p=u-d,j=l-o),"rotated right"===t&&(console.log("correcting right rotation"),h=d,f=e.props.imageWidth-l,p=u-d,j=l-o),"upside-down"===t&&(console.log("correcting upside-down rotation"),h=d,f=e.props.imageWidth-l,p=u-d,j=l-o));var b=Object(O.jsxs)(v.a,{className:"dynamic-text-size",id:n.description,children:[Object(O.jsx)(v.a.Title,{className:"large-dynamic-text-size",children:n.description}),Object(O.jsx)(v.a.Content,{children:e.renderDefinition(n)})]},n.description+h+"-popover"),x="calc("+h+" * "+e.props.imageHeight+")",g="calc("+f+" * "+e.props.imageWidth+")",y="calc("+p+" * "+e.props.imageHeight+")",k="calc("+j+" * "+e.props.imageWidth+")";return Object(O.jsx)("div",{children:Object(O.jsx)(m.a,{placement:"top",overlay:b,children:Object(O.jsx)("div",{className:"text-overlay",style:{top:x,left:g,height:y,width:k}})},n.description)},n.description+h)}))}},{key:"render",value:function(){return Object(O.jsx)("div",{className:"ImageDetections",children:Object(O.jsxs)("div",{className:"img-box",children:[this.renderDetectionsOnImage(),Object(O.jsx)("img",{src:URL.createObjectURL(this.props.images[0]),width:"calc("+this.props.imageWidth+" * 100vw)",height:"calc("+this.props.imageHeight+" * 100vh)"})]})})}}]),n}(a.a.Component),k=(n(82),n(42)),w=n(43),N=function(e){Object(d.a)(n,e);var t=Object(l.a)(n);function n(){var e;return Object(c.a)(this,n),(e=t.call(this)).state={img_files:null,img_buffers:null,imagesInput:!1,imagesParsed:!1,textDetections:null,definedDetections:null,detectionsLoaded:!1,imageWidth:0,imageHeight:0},e.changeImage=e.changeImage.bind(Object(b.a)(e)),e.setImageProps=e.setImageProps.bind(Object(b.a)(e)),e}return Object(o.a)(n,[{key:"changeImage",value:function(e){this.setState({img_files:e.target.files,img_type:".jpg",imagesInput:!0},this.parseFiles)}},{key:"parseFiles",value:function(){var e=Object(j.a)(p.a.mark((function e(){var t,n=this;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:t=Array.from(this.state.img_files).map((function(e){return n.parseFile(e)})),Promise.all(t).then((function(e){n.setState({img_buffers:e,imagesParsed:!0},n.getOCR)}));case 2:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"setImageProps",value:function(e,t){this.setState({imageWidth:e,imageHeight:t})}},{key:"parseFile",value:function(){var e=Object(j.a)(p.a.mark((function e(t){var n;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=this.setImageProps,e.abrupt("return",new Promise((function(e){var i=new FileReader;i.addEventListener("load",(function(t){var a=new Image;a.src=t.target.result,a.onload=function(){n(this.width,this.height),console.log("image",this.width,"x",this.height)},e(i.result)}),!1),i.readAsDataURL(t)})));case 2:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"getOCR",value:function(){var e=Object(j.a)(p.a.mark((function e(){var t=this;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",g.a.post("https://us-east4-true-bit-315318.cloudfunctions.net/documentTextDetection",{img:this.state.img_buffers[0]}).then((function(e){t.setState({textDetections:e.data.textAnnotations,fullText:e.data.fullTextAnnotation},t.getDefinitions)})));case 1:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"getDefinitions",value:function(){var e=Object(j.a)(p.a.mark((function e(){var t,n=this;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:t=this.state.textDetections.map((function(e,t){if(0!==t){var n=e.description.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"").toLowerCase();if(0!==n.length)return g.a.get("https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=".concat(k.key,"&lang=ru-en&text=").concat(n)).then((function(t){return Object.assign(e,{definition:t.data}),e}))}})),Promise.all(t).then((function(e){var t=e.map((function(e){if(void 0!==e){if(void 0===e.def||0===e.def.length){var t=e.description.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"").toLowerCase();return g.a.get("https://api-free.deepl.com/v2/translate?auth_key=".concat(w.key,"&text=").concat(t,"&target_lang=EN")).then((function(t){return Object.assign(e,{definition:t.data}),e}))}return e}}));Promise.all(t).then((function(e){n.setState({definedDetections:e.filter((function(e){return void 0!==e})),detectionsLoaded:!0})}))}));case 2:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"render",value:function(){return this.state.detectionsLoaded?Object(O.jsx)("div",{className:"ImageInput",children:Object(O.jsx)(y,{detections:this.state.definedDetections,images:this.state.img_files,imageWidth:this.state.imageWidth,imageHeight:this.state.imageHeight,fullText:this.state.fullText})}):this.state.imagesParsed?Object(O.jsxs)("div",{className:"ImageInput",children:["Loading image text...",Object(O.jsx)("div",{children:Object(O.jsx)("img",{src:this.state.img_buffers[0],height:"50vh"})})]}):Object(O.jsx)("div",{className:"ImageInput",children:Object(O.jsx)("input",{type:"file",id:"single",onChange:this.changeImage})})}}]),n}(a.a.Component),S=(n(83),function(e){Object(d.a)(n,e);var t=Object(l.a)(n);function n(){return Object(c.a)(this,n),t.apply(this,arguments)}return Object(o.a)(n,[{key:"render",value:function(){return Object(O.jsx)("div",{className:"tracau-banner",children:Object(O.jsx)("a",{href:"https://tracau.vn",children:Object(O.jsx)("img",{src:"https://tracau.vn/assets/img/api/banner_white.png",alt:"Powered by tra c\xe2u"})})})}}]),n}(a.a.Component)),I=(n(84),n(44)),P=n(45),C=function(e){Object(d.a)(n,e);var t=Object(l.a)(n);function n(){var e;return Object(c.a)(this,n),(e=t.call(this)).state={text:""},e}return Object(o.a)(n,[{key:"detectHotkeySubmit",value:function(e,t){e.shiftKey&&"Enter"===e.key&&this.props.submitSearch(t)}},{key:"render",value:function(){var e=this;return Object(O.jsxs)("div",{className:"InputText",children:[Object(O.jsxs)("div",{className:"main-content",children:[Object(O.jsx)("div",{children:"Enter text: "}),Object(O.jsxs)("div",{className:"upper-flex",onKeyPress:function(t){return e.detectHotkeySubmit(t,e.state.text)},children:[Object(O.jsx)("textarea",{className:"big-textbox",value:this.state.text,onChange:function(t){return e.setState({text:t.target.value})}}),Object(O.jsx)(I.a,{icon:P.a,onClick:function(t){return e.props.submitSearch(e.state.text)}})]})]}),Object(O.jsx)(S,{})]})}}]),n}(a.a.Component),L=function(e){Object(d.a)(n,e);var t=Object(l.a)(n);function n(){return Object(c.a)(this,n),t.apply(this,arguments)}return Object(o.a)(n,[{key:"render",value:function(){return this.props.defnsList[0].startsWith("See ")?this.defnsList=this.props.defnsList.slice(1):this.defnsList=this.props.defnsList,Object(O.jsx)("div",{className:"Definition",children:Object(O.jsx)("ol",{children:this.defnsList.map((function(e){return Object(O.jsx)("li",{children:e})}))})})}}]),n}(a.a.Component),T=function(e){Object(d.a)(n,e);var t=Object(l.a)(n);function n(){return Object(c.a)(this,n),t.apply(this,arguments)}return Object(o.a)(n,[{key:"render",value:function(){var e=Object(O.jsxs)(v.a,{id:this.props.word,children:[Object(O.jsx)(v.a.Title,{as:"h3",children:this.props.word}),Object(O.jsx)(v.a.Content,{children:Object(O.jsx)(L,{defnsList:this.props.defn})})]});return Object(O.jsx)("div",{className:"DefinedWord",children:Object(O.jsx)(m.a,{placement:"top",overlay:e,children:Object(O.jsx)("div",{children:this.props.word})},this.props.word)})}}]),n}(a.a.Component),_=(n(87),function(e){Object(d.a)(n,e);var t=Object(l.a)(n);function n(){var e;return Object(c.a)(this,n),(e=t.call(this)).state={isLoaded:!1,searchResults:{}},e}return Object(o.a)(n,[{key:"search",value:function(e){var t=this,n=e.split(/[ X\n]/),i={},a=n.map((function(e,a){return t.searchCompoundWord(n,a).then((function(t){if(t&&t.length>0&&!t[0].startsWith("See "))return i[e+" "+n[a+1]]=t,Promise.resolve()}))}));return Promise.all(a).then((function(){var e=Object.assign({},i);console.log("compound definitions:",e);var a=n.map((function(a,s){var r=n[s-1]+" "+a,c=a+" "+n[s+1];return r in i||c in i?Promise.resolve():t.tracauSearch(a).then((function(t){return t&&t.length>0&&(e[a]=t),Promise.resolve()}))}));return Promise.all(a).then(e)}))}},{key:"searchCompoundWord",value:function(e,t){return e.length>t+1?this.tracauSearch(e[t]+" "+e[t+1]):Promise.resolve()}},{key:"tracauSearch",value:function(e){var t=e.trim().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"");return g.a.get("https://api.tracau.vn/"+D+"/s/"+t+"/vi").then((function(e){if(e.data.tratu.length<=0)return!1;var t=e.data.tratu[0].fields.fulltext,n=t.indexOf('<article id="dict_vv" data-tab-name="Vi\u1ec7t - Anh"'),i=t.slice(n),a=i.indexOf("</article>"),s='<table id="definition_T_ve_id" border="0">',r=(i=i.slice(0,a)).indexOf(s)+s.length,c=i.slice(r),o=c.indexOf("</table>"),d=(c=c.slice(0,o)).split('<td id="I_C"><font color="#999">\u25a0</font></td><td id="C_C" colspan="2">'),l=[];return d.slice(1).forEach((function(e){var t=e.slice(0,e.indexOf("</td>")),n='Xem <font color="#1371BB">',i=t.indexOf("</font>");(t.startsWith(n)||t.startsWith('xem <font color="#1371BB">'))&&(t="See "+t.slice(n.length,i)),l.push(t)})),l}))}},{key:"componentDidMount",value:function(){var e=this;this.search(this.props.text).then((function(t){console.log("search results",t),e.setState({isLoaded:!0,searchResults:t})}))}},{key:"render",value:function(){var e=this,t=Object(O.jsxs)("div",{className:"footer",children:[Object(O.jsx)("div",{className:"submit-search",children:Object(O.jsx)("button",{onClick:this.props.returnToSearch,children:"Search again"})}),Object(O.jsx)(S,{})]});return""===this.props.text?Object(O.jsxs)("div",{className:"SearchedText",children:[Object(O.jsx)("div",{className:"text-display",children:Object(O.jsx)("div",{className:"vertical-centered",children:Object(O.jsx)("div",{children:"Oops! Looks like no text was input. Would you like to search again?"})})}),t]}):this.state.isLoaded?Object(O.jsxs)("div",{className:"SearchedText",children:[Object(O.jsx)("div",{className:"text-display",children:Object(O.jsx)("div",{className:"vertical-centered",children:Object(O.jsx)("div",{className:"words-and-definitions",children:this.props.text.split(/[ X\n]/).map((function(t,n){if(-1!==n){var i=t+" "+e.props.text.split(/[ X\n]/)[n+1];if(i in e.state.searchResults){var a=e.state.searchResults[i];return Object(O.jsx)(T,{word:i,defn:a},n)}if(t in e.state.searchResults){var s=e.state.searchResults[t];return Object(O.jsx)(T,{word:t,defn:s},n)}return Object(O.jsx)("div",{className:"definition-not-found",children:t},n)}}))})})}),t]}):Object(O.jsxs)("div",{className:"SearchedText",children:[Object(O.jsx)("div",{className:"text-display",children:Object(O.jsx)("div",{className:"vertical-centered",children:"loading..."})}),t]})}}]),n}(a.a.Component)),D="WBBcwnwQpV89",W=_,M=function(e){Object(d.a)(n,e);var t=Object(l.a)(n);function n(){var e;return Object(c.a)(this,n),(e=t.call(this)).state={searched:!1,searchedText:""},e.toggleSearch=e.toggleSearch.bind(Object(b.a)(e)),e}return Object(o.a)(n,[{key:"toggleSearch",value:function(e){this.setState((function(t){return{searched:!t.searched,searchedText:e}}))}},{key:"render",value:function(){var e=this;return this.state.searched?Object(O.jsx)("div",{className:"TextInput",children:Object(O.jsx)(W,{text:this.state.searchedText,returnToSearch:function(t){return e.toggleSearch("")}})}):Object(O.jsx)("div",{className:"TextInput",children:Object(O.jsx)("header",{className:"App-header",children:Object(O.jsx)(C,{submitSearch:this.toggleSearch})})})}}]),n}(a.a.Component),R=function(e){Object(d.a)(n,e);var t=Object(l.a)(n);function n(){return Object(c.a)(this,n),t.apply(this,arguments)}return Object(o.a)(n,[{key:"render",value:function(){return Object(O.jsx)("div",{className:"App",children:Object(O.jsx)(u.a,{children:Object(O.jsxs)(h.c,{children:[Object(O.jsx)(h.a,{path:"/text",component:M}),Object(O.jsx)(h.a,{path:"/img",component:N}),Object(O.jsx)(h.a,{exact:!0,path:"/",component:M})]})})})}}]),n}(a.a.Component),F=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,95)).then((function(t){var n=t.getCLS,i=t.getFID,a=t.getFCP,s=t.getLCP,r=t.getTTFB;n(e),i(e),a(e),s(e),r(e)}))};r.a.render(Object(O.jsx)(a.a.StrictMode,{children:Object(O.jsx)(R,{})}),document.getElementById("root")),F()}},[[90,1,2]]]);
//# sourceMappingURL=main.6e1ef958.chunk.js.map