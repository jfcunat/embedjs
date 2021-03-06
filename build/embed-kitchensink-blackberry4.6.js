var embed=dojo={};
embed.config={};
embed.global=window;
embed.doc=document;
embed.body=function(){
return document.body;
};
(function(_1){
var _2=_1._getProp;
_1._getProp=function(_3,_4,_5){
var _6=_5||_1.global;
if(_6===window&&_4&&_3.length&&typeof window[_3[0]]==="undefined"){
window[_3[0]]={};
}
return _2(_3,_4,_5);
};
}(dojo));
["indexOf","lastIndexOf","forEach","map","some","every","filter"].forEach(function(_1,_2){
dojo[_1]=function(_3,_4,_5){
if((_2>1)&&(typeof _4=="string")){
_4=new Function("item","index","array",_4);
}
return Array.prototype[_1].call(_3,_4,_5);
};
});
dojo._listener={getDispatcher:function(){
return function(){
var ap=Array.prototype,c=arguments.callee,ls=c._listeners,t=c.target;
var r=t&&t.apply(this,arguments);
var i,_1;
_1=[].concat(ls);
for(i in _1){
if(!(i in ap)){
_1[i].apply(this,arguments);
}
}
return r;
};
},add:function(_2,_3,_4){
_2=_2||dojo.global;
var f=_2[_3];
if(!f||!f._listeners){
var d=dojo._listener.getDispatcher();
d.target=f;
d._listeners=[];
f=_2[_3]=d;
}
return f._listeners.push(_4);
},remove:function(_5,_6,_7){
var f=(_5||dojo.global)[_6];
if(f&&f._listeners&&_7--){
delete f._listeners[_7];
}
}};
dojo.connect=dojo.on=function(_8,_9,_a,_b,_c){
var a=arguments,_d=[],i=0;
_d.push(dojo.isString(a[0])?null:a[i++],a[i++]);
var a1=a[i+1];
_d.push(dojo.isString(a1)||dojo.isFunction(a1)?a[i++]:null,a[i++]);
for(var l=a.length;i<l;i++){
_d.push(a[i]);
}
return dojo._connect.apply(this,_d);
};
dojo._connect=function(_e,_f,_10,_11){
var l=dojo._listener,h=l.add(_e,_f,dojo.hitch(_10,_11));
return [_e,_f,h,l];
};
dojo.disconnect=function(_12){
if(_12&&_12[0]!==undefined){
dojo._disconnect.apply(this,_12);
delete _12[0];
}
};
dojo._disconnect=function(obj,_13,_14,_15){
_15.remove(obj,_13,_14);
};
(function(){
var _1=(dojo._event_listener={add:function(_2,_3,fp){
if(!_2){
return;
}
_3=_1._normalizeEventName(_3);
_2.addEventListener(_3,fp,false);
return fp;
},remove:function(_4,_5,_6){
if(_4){
_5=_1._normalizeEventName(_5);
_4.removeEventListener(_5,_6,false);
}
},_normalizeEventName:function(_7){
return _7.slice(0,2)=="on"?_7.slice(2):_7;
}});
dojo.fixEvent=function(_8,_9){
return _1._fixEvent(_8,_9);
};
dojo.stopEvent=function(_a){
_a.preventDefault();
_a.stopPropagation();
};
dojo._connect=function(_b,_c,_d,_e,_f){
var _10=_b&&(_b.nodeType||_b.attachEvent||_b.addEventListener);
var lid=_10?1:0,l=[dojo._listener,_1][lid];
var h=l.add(_b,_c,dojo.hitch(_d,_e));
return [_b,_c,h,lid];
};
dojo._disconnect=function(obj,_11,_12,_13){
([dojo._listener,_1][_13]).remove(obj,_11,_12);
};
})();
dojo._topics={};
dojo.subscribe=function(_1,_2,_3){
return [_1,dojo._listener.add(dojo._topics,_1,dojo.hitch(_2,_3))];
};
dojo.unsubscribe=function(_4){
if(_4){
dojo._listener.remove(dojo._topics,_4[0],_4[1]);
}
};
dojo.publish=function(_5,_6){
var f=dojo._topics[_5];
if(f){
f.apply(this,_6||[]);
}
};
dojo.connectPublisher=function(_7,_8,_9){
var pf=function(){
dojo.publish(_7,arguments);
};
return _9?dojo.connect(_8,_9,pf):dojo.connect(_8,pf);
};
dojo.isString=function(it){
return (typeof it=="string"||it instanceof String);
};
dojo.isArray=function(it){
return it&&(it instanceof Array||typeof it=="array");
};
dojo.isFunction=(function(){
var _1=function(it){
var t=typeof it;
return it&&(t=="function"||it instanceof Function)&&!it.nodeType;
};
return dojo.isSafari?function(it){
if(typeof it=="function"&&it=="[object NodeList]"){
return false;
}
return _1(it);
}:_1;
})();
dojo.isObject=function(it){
return it!==undefined&&(it===null||typeof it=="object"||dojo.isArray(it)||dojo.isFunction(it));
};
dojo.isArrayLike=function(it){
var d=dojo;
return it&&it!==undefined&&!d.isString(it)&&!d.isFunction(it)&&!(it.tagName&&it.tagName.toLowerCase()=="form")&&(d.isArray(it)||isFinite(it.length));
};
dojo.isAlien=function(it){
return it&&!dojo.isFunction(it)&&/\{\s*\[native code\]\s*\}/.test(String(it));
};
dojo.isNumeric=function(n){
return n==parseFloat(n);
};
dojo.isNumber=function(n){
return typeof n=="number"||n instanceof Number;
};
dojo._hitchArgs=function(_1,_2){
var _3=dojo.toArray(arguments,2);
var _4=dojo.isString(_2);
return function(){
var _5=dojo.toArray(arguments);
var f=_4?(_1||dojo.global)[_2]:_2;
return f&&f.apply(_1||this,_3.concat(_5));
};
};
dojo.hitch=function(_6,_7){
if(arguments.length>2){
return dojo._hitchArgs.apply(dojo,arguments);
}
if(!_7){
_7=_6;
_6=null;
}
if(dojo.isString(_7)){
_6=_6||dojo.global;
if(!_6[_7]){
throw (["dojo.hitch: scope[\"",_7,"\"] is null (scope=\"",_6,"\")"].join(""));
}
return function(){
return _6[_7].apply(_6,arguments||[]);
};
}
return !_6?_7:function(){
return _7.apply(_6,arguments||[]);
};
};
(function(d){
(function(){
dojo.__mutator=function(){
};
var _1=Object.freeze||function(){
};
dojo.Promise=function(_2){
var _3,_4,_5,_6,_7;
var _8=this.promise={};
function _9(_a){
if(_4){
throw new Error("This deferred has already been resolved");
}
_3=_a;
_4=true;
_b();
};
function _b(){
var _c;
while(!_c&&_7){
var _d=_7;
_7=_7.next;
if(_c=(_d.progress==dojo.__mutator)){
_4=false;
}
var _e=(_5?_d.error:_d.resolved);
if(_e){
try{
var _f=_e(_3);
if(_f&&typeof _f.then==="function"){
_f.then(dojo.hitch(_d.deferred,"resolve"),dojo.hitch(_d.deferred,"reject"));
continue;
}
var _10=_c&&_f===undefined;
_d.deferred[_10&&_5?"reject":"resolve"](_10?_3:_f);
}
catch(e){
_d.deferred.reject(e);
}
}else{
if(_5){
_d.deferred.reject(_3);
}else{
_d.deferred.resolve(_3);
}
}
}
};
this.resolve=function(_11){
this.fired=0;
this.results=[_11,null];
_9(_11);
};
this.reject=function(_12){
_5=true;
this.fired=1;
_9(_12);
this.results=[null,_12];
if(!_12||_12.log!==false){
(dojo.config.deferredOnError||function(x){
console.error(x);
})(_12);
}
};
this.progress=function(_13){
var _14=_7;
while(_14){
var _15=_14.progress;
_15&&_15(_13);
_14=_14.next;
}
};
this.then=_8.then=function(_16,_17,_18){
var _19=_18==dojo.__mutator?this:new dojo.Promise(_8.cancel);
var _1a={resolved:_16,error:_17,progress:_18,deferred:_19};
if(_7){
_6=_6.next=_1a;
}else{
_7=_6=_1a;
}
if(_4){
_b();
}
return _19.promise;
};
var _1b=this;
this.cancel=_8.cancel=function(){
if(!_4){
var _1c=_2&&_2(_1b);
if(!_4){
if(!(_1c instanceof Error)){
_1c=new Error(_1c);
}
_1c.log=false;
_1b.reject(_1c);
}
}
};
_1(_8);
};
})();
})(dojo);
dojo.when=function(_1,_2,_3,_4){
if(_1&&typeof _1.then==="function"){
return _1.then(_2,_3,_4);
}
return _2(_1);
};
(function(d){
var _1={},_2;
for(var i in {toString:1}){
_2=[];
break;
}
dojo._extraNames=_2=_2||["hasOwnProperty","valueOf","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString"];
d._mixin=function(_3,_4){
var _5,s,i=0,l=_2.length;
for(_5 in _4){
s=_4[_5];
if(s!==_1[_5]&&s!==_3[_5]){
_3[_5]=s;
}
}
if(l&&_4){
for(;i<l;++i){
_5=_2[i];
s=_4[_5];
if(s!==_1[_5]&&s!==_3[_5]){
_3[_5]=s;
}
}
}
return _3;
};
dojo.mixin=function(_6,_7){
if(!_6){
_6={};
}
for(var i=1,l=arguments.length;i<l;i++){
d._mixin(_6,arguments[i]);
}
return _6;
};
dojo.safeMixin=function(_8,_9){
var _a,t,i=0,l=d._extraNames.length;
var op=Object.prototype,_b=op.toString,_c="constructor";
for(_a in _9){
t=_9[_a];
if((t!==op[_a]||!(_a in op))&&_a!=_c){
if(_b.call(t)=="[object Function]"){
t.nom=_a;
}
_8[_a]=t;
}
}
for(;i<l;++i){
_a=d._extraNames[i];
t=_9[_a];
if((t!==op[_a]||!(_a in op))&&_a!=_c){
if(_b.call(t)=="[object Function]"){
t.nom=_a;
}
_8[_a]=t;
}
}
return _8;
};
}(dojo));
dojo.extend=function(_1,_2){
for(var i=1,l=arguments.length;i<l;i++){
dojo._mixin(_1.prototype,arguments[i]);
}
return _1;
};
dojo.Deferred=dojo.Promise;
dojo.extend(dojo.Deferred,{callback:function(_1){
this.resolve(_1);
},errback:function(_2){
this.reject(_2);
},addCallbacks:function(_3,_4){
this.then(_3,_4,dojo.__mutator);
return this;
},addCallback:function(_5){
return this.addCallbacks(dojo.hitch.apply(dojo,arguments));
},addErrback:function(_6){
return this.addCallbacks(null,dojo.hitch.apply(dojo,arguments));
},addBoth:function(_7){
var _8=dojo.hitch.apply(dojo,arguments);
return this.addCallbacks(_8,_8);
},fired:-1});
dojo.byId=function(id,_1){
return (typeof id=="string")?(_1||document).getElementById(id):id;
};
(function(d){
var _1=null,_2;
d.destroy=function(_3){
_3=dojo.byId(_3);
try{
var _4=_3.ownerDocument;
if(!_1||_2!=_4){
_1=_4.createElement("div");
_2=_4;
}
_1.appendChild(_3.parentNode?_3.parentNode.removeChild(_3):_3);
_1.innerHTML="";
}
catch(e){
}
};
})(dojo);
(function(d){
d._getComputedStyle=function(_1){
return _1.nodeType==1?_1.ownerDocument.defaultView.getComputedStyle(_1,null):{};
};
var _2="cssFloat",_3={"cssFloat":_2,"styleFloat":_2,"float":_2};
d._style=function(_4,_5,_6){
var n=dojo.byId(_4),l=arguments.length;
_5=_3[_5]||_5;
if(l==3){
return n.style[_5]=_6;
}
var s=d._getComputedStyle(n);
if(l==2&&typeof _5!="string"){
for(var x in _5){
d._style(_4,x,_5[x]);
}
return s;
}
return (l==1)?s:parseFloat(s[_5]||n.style[_5])||s[_5];
};
})(dojo);
dojo.getComputedStyle=dojo._getComputedStyle;
dojo.style=dojo._style;
(function(d){
var _1={"class":"className","for":"htmlFor",tabindex:"tabIndex",readonly:"readOnly",colspan:"colSpan",frameborder:"frameBorder",rowspan:"rowSpan",valuetype:"valueType"},_2={classname:"class",htmlfor:"for",tabindex:"tabIndex",readonly:"readOnly"},_3={innerHTML:1,className:1,htmlFor:false,value:1};
var _4=function(_5){
return _2[_5.toLowerCase()]||_5;
};
var _6=function(_7,_8){
var _9=_7.getAttributeNode&&_7.getAttributeNode(_8);
return _9&&_9.specified;
};
dojo.hasAttr=function(_a,_b){
var lc=_b.toLowerCase();
return _3[_1[lc]||_b]||_6(d.byId(_a),_2[lc]||_b);
};
var _c={},_d=0,_e="_attrid",_f={col:1,colgroup:1,table:1,tbody:1,tfoot:1,thead:1,tr:1,title:1};
dojo.attr=function(_10,_11,_12){
_10=d.byId(_10);
var _13=arguments.length,_14;
if(_13==2&&typeof _11!="string"){
for(var x in _11){
d.attr(_10,x,_11[x]);
}
return _10;
}
var lc=_11.toLowerCase(),_15=_1[lc]||_11,_16=_3[_15],_17=_2[lc]||_11;
if(_13==3){
do{
if(_15=="style"&&typeof _12!="string"){
d.style(_10,_12);
break;
}
if(_15=="innerHTML"){
_10[_15]=_12;
break;
}
if(d.isFunction(_12)){
var _18=d.attr(_10,_e);
if(!_18){
_18=_d++;
d.attr(_10,_e,_18);
}
if(!_c[_18]){
_c[_18]={};
}
var h=_c[_18][_15];
if(h){
d.disconnect(h);
}else{
try{
delete _10[_15];
}
catch(e){
}
}
_c[_18][_15]=d.connect(_10,_15,_12);
break;
}
if(_16||typeof _12=="boolean"){
_10[_15]=_12;
break;
}
_10.setAttribute(_17,_12);
}while(false);
return _10;
}
_12=_10[_15];
if(_16&&typeof _12!="undefined"){
return _12;
}
if(_15!="href"&&(typeof _12=="boolean"||d.isFunction(_12))){
return _12;
}
return _6(_10,_17)?_10.getAttribute(_17):null;
};
dojo.removeAttr=function(_19,_1a){
d.byId(_19).removeAttribute(_4(_1a));
};
})(dojo);
(function(d){
var _1=d.byId;
var _2={option:["select"],tbody:["table"],thead:["table"],tfoot:["table"],tr:["table","tbody"],td:["table","tbody","tr"],th:["table","thead","tr"],legend:["fieldset"],caption:["table"],colgroup:["table"],col:["table","colgroup"],li:["ul"]},_3=/<\s*([\w\:]+)/,_4={},_5=0,_6="__"+d._scopeName+"ToDomId";
for(var _7 in _2){
var tw=_2[_7];
tw.pre=_7=="option"?"<select multiple=\"multiple\">":"<"+tw.join("><")+">";
tw.post="</"+tw.reverse().join("></")+">";
}
d._toDom=function(_8,_9){
_9=_9||d.doc;
var _a=_9[_6];
if(!_a){
_9[_6]=_a=++_5+"";
_4[_a]=_9.createElement("div");
}
_8+="";
var _b=_8.match(_3),_c=_b?_b[1].toLowerCase():"",_d=_4[_a],_e,i,fc,df;
if(_b&&_2[_c]){
_e=_2[_c];
_d.innerHTML=_e.pre+_8+_e.post;
for(i=_e.length;i;--i){
_d=_d.firstChild;
}
}else{
_d.innerHTML=_8;
}
if(_d.childNodes.length==1){
return _d.removeChild(_d.firstChild);
}
df=_9.createDocumentFragment();
while(fc=_d.firstChild){
df.appendChild(fc);
}
return df;
};
d._docScroll=function(){
var n=d.global;
return "pageXOffset" in n?{x:n.pageXOffset,y:n.pageYOffset}:(n=d.doc.documentElement,n.clientHeight?{x:n.scrollLeft,y:n.scrollTop}:(n=d.body(),{x:n.scrollLeft||0,y:n.scrollTop||0}));
};
var _f=function(_10,ref){
var _11=ref.parentNode;
if(_11){
_11.insertBefore(_10,ref);
}
};
var _12=function(_13,ref){
var _14=ref.parentNode;
if(_14){
if(_14.lastChild==ref){
_14.appendChild(_13);
}else{
_14.insertBefore(_13,ref.nextSibling);
}
}
};
d.place=function(_15,_16,_17){
_16=_1(_16);
if(typeof _15=="string"){
_15=_15.charAt(0)=="<"?d._toDom(_15,_16.ownerDocument):_1(_15);
}
if(typeof _17=="number"){
var cn=_16.childNodes;
if(!cn.length||cn.length<=_17){
_16.appendChild(_15);
}else{
_f(_15,cn[_17<0?0:_17]);
}
}else{
switch(_17){
case "before":
_f(_15,_16);
break;
case "after":
_12(_15,_16);
break;
case "replace":
_16.parentNode.replaceChild(_15,_16);
break;
case "only":
d.empty(_16);
_16.appendChild(_15);
break;
case "first":
if(_16.firstChild){
_f(_15,_16.firstChild);
break;
}
default:
_16.appendChild(_15);
}
}
return _15;
};
d.create=function(tag,_18,_19,pos){
var doc=d.doc;
if(_19){
_19=_1(_19);
doc=_19.ownerDocument;
}
if(typeof tag=="string"){
tag=doc.createElement(tag);
}
if(_18){
for(var _1a in _18){
switch(_1a){
case "class":
tag.className=_18[_1a];
break;
default:
tag[_1a]=_18[_1a];
}
}
}
if(_19){
d.place(tag,_19,pos);
}
return tag;
};
d.empty=function(_1b){
_1(_1b).innerHTML="";
};
})(dojo);
dojo._getProp=function(_1,_2,_3){
var _4=_3||dojo.global;
for(var i=0,p;_4&&(p=_1[i]);i++){
_4=(p in _4?_4[p]:(_2?_4[p]={}:undefined));
}
return _4;
};
dojo.setObject=function(_5,_6,_7){
var _8=_5.split("."),p=_8.pop(),_9=dojo._getProp(_8,true,_7);
return _9&&p?(_9[p]=_6):undefined;
};
dojo.getObject=function(_a,_b,_c){
return dojo._getProp(_a.split("."),_b,_c);
};
dojo.trim=String.prototype.trim?function(_1){
return _1.trim();
}:function(_2){
return _2.replace(/^\s\s*/,"").replace(/\s\s*$/,"");
};
var _pattern=/\{([^\}]+)\}/g;
dojo.replace=function(_3,_4,_5){
return _3.replace(_5||_pattern,dojo.isFunction(_4)?_4:function(_6,k){
return dojo.getObject(k,false,_4);
});
};
dojo.hasClass=function(_1,_2){
return ((" "+dojo.byId(_1).className+" ").indexOf(" "+_2+" ")>=0);
};
dojo.toggleClass=function(_3,_4,_5){
if(_5===undefined){
_5=!dojo.hasClass(_3,_4);
}
dojo[_5?"addClass":"removeClass"](_3,_4);
};
(function(){
var _6=/\s+/;
var _7=function(s){
if(typeof s=="string"||s instanceof String){
if(s.indexOf(" ")<0){
return [s];
}else{
return dojo.trim(s).split(_6);
}
}
return s;
};
dojo.addClass=function(_8,_9){
_8=dojo.byId(_8);
_9=_7(_9);
var _a=" "+_8.className+" ";
for(var i=0,_b=_9.length,c;i<_b;++i){
c=_9[i];
if(c&&_a.indexOf(" "+c+" ")<0){
_a+=c+" ";
}
}
_8.className=dojo.trim(_a);
};
dojo.removeClass=function(_c,_d){
_c=dojo.byId(_c);
var _e;
if(_d!==undefined){
_d=_7(_d);
_e=" "+_c.className+" ";
for(var i=0,_f=_d.length;i<_f;++i){
_e=_e.replace(" "+_d[i]+" "," ");
}
_e=dojo.trim(_e);
}else{
_e="";
}
if(_c.className!=_e){
_c.className=_e;
}
};
})();
(function(d){
d._loaders=[];
d._loadNotifying=false;
d._onto=function(_1,_2,fn){
if(!fn){
_1.push(_2);
}else{
if(fn){
var _3=(typeof fn=="string")?_2[fn]:fn;
_1.push(function(){
_3.call(_2);
});
}
}
};
dojo.ready=dojo.addOnLoad=function(_4,_5){
d._onto(d._loaders,_4,_5);
if(document.readyState==="complete"||(d._postLoad&&!d._loadNotifying)){
d._callLoaded();
}
};
dojo._callLoaded=function(){
setTimeout("dojo.loaded();",0);
};
dojo.loaded=function(){
d._loadNotifying=true;
d._postLoad=true;
var _6=d._loaders;
d._loaders=[];
for(var x=0;x<_6.length;x++){
_6[x]();
}
d._loadNotifying=false;
if(d._postLoad&&_6.length){
d._callLoaded();
}
};
dojo._initFired=false;
dojo._loadInit=function(){
if(!dojo._initFired){
dojo._initFired=true;
document.removeEventListener("DOMContentLoaded",dojo._loadInit,false);
dojo._callLoaded();
}
};
document.addEventListener("DOMContentLoaded",dojo._loadInit,false);
window.addEventListener("load",dojo._loadInit,false);
})(dojo);
dojo.toJson=function(_1){
return JSON.stringify(_1);
};
dojo.fromJson=function(_2){
return JSON.parse(_2);
};
dojo.toArray=function(_1,_2,_3){
return (_3||[]).concat(Array.prototype.slice.call(_1,_2||0));
};
dojo.clone=function(o){
if(!o||typeof o!="object"||dojo.isFunction(o)){
return o;
}
if(o.nodeType&&"cloneNode" in o){
return o.cloneNode(true);
}
if(o instanceof Date){
return new Date(o.getTime());
}
var r,i,l,s,_1;
if(dojo.isArray(o)){
r=[];
for(i=0,l=o.length;i<l;++i){
if(i in o){
r.push(dojo.clone(o[i]));
}
}
}else{
r=o.constructor?new o.constructor():{};
}
var _2={};
for(_1 in o){
s=o[_1];
if(!(_1 in r)||(r[_1]!==s&&(!(_1 in _2)||_2[_1]!==s))){
r[_1]=dojo.clone(s);
}
}
return r;
};
dojo.objectToQuery=function(_1){
var _2=encodeURIComponent;
var _3=[];
var _4={};
for(var _5 in _1){
var _6=_1[_5];
if(_6!=_4[_5]){
var _7=_2(_5)+"=";
if(dojo.isArray(_6)){
for(var i=0;i<_6.length;i++){
_3.push(_7+_2(_6[i]));
}
}else{
_3.push(_7+_2(_6));
}
}
}
return _3.join("&");
};
(function(_1){
var _2=_1.config;
_1._xhrObj=function(){
return new XMLHttpRequest();
};
_1._isDocumentOk=function(_3){
var _4=_3.status||0,lp=location.protocol;
return (_4>=200&&_4<300)||_4==304||_4==1223||(!_4&&(lp=="file:"||lp=="chrome:"||lp=="app:"));
};
_1._getText=function(_5,_6){
var _7=_1._xhrObj();
_7.open("GET",_5,false);
try{
_7.send(null);
if(!_1._isDocumentOk(_7)){
var _8=Error("Unable to load "+_5+" status:"+_7.status);
_8.status=_7.status;
_8.responseText=_7.responseText;
throw _8;
}
}
catch(e){
if(_6){
return null;
}
throw e;
}
return _7.responseText;
};
dojo._blockAsync=false;
var _9=_1._contentHandlers=dojo.contentHandlers={text:function(_a){
return _a.responseText;
},json:function(_b){
return _1.fromJson(_b.responseText||null);
}};
dojo._ioSetArgs=function(_c,_d,_e,_f){
var _10={args:_c,url:_c.url};
var _11=[{}];
if(_c.content){
_11.push(_c.content);
}
if(_c.preventCache){
_11.push({"dojo.preventCache":new Date().valueOf()});
}
_10.query=_1.objectToQuery(_1.mixin.apply(null,_11));
_10.handleAs=_c.handleAs||"text";
var d=new _1.Deferred(_d);
d.addCallbacks(_e,function(_12){
return _f(_12,d);
});
var ld=_c.load;
if(ld&&_1.isFunction(ld)){
d.addCallback(function(_13){
return ld.call(_c,_13,_10);
});
}
var err=_c.error;
if(err&&_1.isFunction(err)){
d.addErrback(function(_14){
return err.call(_c,_14,_10);
});
}
var _15=_c.handle;
if(_15&&_1.isFunction(_15)){
d.addBoth(function(_16){
return _15.call(_c,_16,_10);
});
}
d.ioArgs=_10;
return d;
};
var _17=function(dfd){
dfd.canceled=true;
var xhr=dfd.ioArgs.xhr;
var _18=typeof xhr.abort;
if(_18=="function"||_18=="object"||_18=="unknown"){
xhr.abort();
}
var err=dfd.ioArgs.error;
if(!err){
err=new Error("xhr cancelled");
err.dojoType="cancel";
}
return err;
};
var _19=function(dfd){
var ret=_9[dfd.ioArgs.handleAs](dfd.ioArgs.xhr);
return ret===undefined?null:ret;
};
var _1a=function(_1b,dfd){
if(!dfd.ioArgs.args.failOk){
console.error(_1b);
}
return _1b;
};
var _1c=null;
var _1d=[];
var _1e=0;
var _1f=function(dfd){
if(_1e<=0){
_1e=0;
}
};
var _20=function(){
var now=(new Date()).getTime();
if(!_1._blockAsync){
for(var i=0,tif;i<_1d.length&&(tif=_1d[i]);i++){
var dfd=tif.dfd;
var _21=function(){
if(!dfd||dfd.canceled||!tif.validCheck(dfd)){
_1d.splice(i--,1);
_1e-=1;
}else{
if(tif.ioCheck(dfd)){
_1d.splice(i--,1);
tif.resHandle(dfd);
_1e-=1;
}else{
if(dfd.startTime){
if(dfd.startTime+(dfd.ioArgs.args.timeout||0)<now){
_1d.splice(i--,1);
var err=new Error("timeout exceeded");
err.dojoType="timeout";
dfd.errback(err);
dfd.cancel();
_1e-=1;
}
}
}
}
};
if(dojo.config.debugAtAllCosts){
_21.call(this);
}else{
try{
_21.call(this);
}
catch(e){
dfd.errback(e);
}
}
}
}
_1f(dfd);
if(!_1d.length){
clearInterval(_1c);
_1c=null;
return;
}
};
dojo._ioCancelAll=function(){
try{
_1.forEach(_1d,function(i){
try{
i.dfd.cancel();
}
catch(e){
}
});
}
catch(e){
}
};
_1._ioNotifyStart=function(dfd){
};
_1._ioWatch=function(dfd,_22,_23,_24){
var _25=dfd.ioArgs.args;
if(_25.timeout){
dfd.startTime=(new Date()).getTime();
}
_1d.push({dfd:dfd,validCheck:_22,ioCheck:_23,resHandle:_24});
if(!_1c){
_1c=setInterval(_20,50);
}
if(_25.sync){
_20();
}
};
var _26="application/x-www-form-urlencoded";
var _27=function(dfd){
return dfd.ioArgs.xhr.readyState;
};
var _28=function(dfd){
return 4==dfd.ioArgs.xhr.readyState;
};
var _29=function(dfd){
var xhr=dfd.ioArgs.xhr;
if(_1._isDocumentOk(xhr)){
dfd.callback(dfd);
}else{
var err=new Error("Unable to load "+dfd.ioArgs.url+" status:"+xhr.status);
err.status=xhr.status;
err.responseText=xhr.responseText;
dfd.errback(err);
}
};
dojo._ioAddQueryToUrl=function(_2a){
if(_2a.query.length){
_2a.url+=(_2a.url.indexOf("?")==-1?"?":"&")+_2a.query;
_2a.query=null;
}
};
dojo.xhr=function(_2b,_2c,_2d){
var dfd=_1._ioSetArgs(_2c,_17,_19,_1a);
var _2e=dfd.ioArgs;
var xhr=_2e.xhr=_1._xhrObj(_2e.args);
if(!xhr){
dfd.cancel();
return dfd;
}
if("postData" in _2c){
_2e.query=_2c.postData;
}else{
if("putData" in _2c){
_2e.query=_2c.putData;
}else{
if("rawBody" in _2c){
_2e.query=_2c.rawBody;
}else{
if((arguments.length>2&&!_2d)||"POST|PUT".indexOf(_2b.toUpperCase())==-1){
_1._ioAddQueryToUrl(_2e);
}
}
}
}
xhr.open(_2b,_2e.url,_2c.sync!==true,_2c.user||undefined,_2c.password||undefined);
if(_2c.headers){
for(var hdr in _2c.headers){
if(hdr.toLowerCase()==="content-type"&&!_2c.contentType){
_2c.contentType=_2c.headers[hdr];
}else{
if(_2c.headers[hdr]){
xhr.setRequestHeader(hdr,_2c.headers[hdr]);
}
}
}
}
xhr.setRequestHeader("Content-Type",_2c.contentType||_26);
if(!_2c.headers||!("X-Requested-With" in _2c.headers)){
xhr.setRequestHeader("X-Requested-With","XMLHttpRequest");
}
if(_2c.overrideMinmeType&&xhr.overrideMimeType){
xhr.overrideMimeType(_2c.overrideMimeType);
}
_1._ioNotifyStart(dfd);
if(dojo.config.debugAtAllCosts){
xhr.send(_2e.query);
}else{
try{
xhr.send(_2e.query);
}
catch(e){
_2e.error=e;
dfd.cancel();
}
}
_1._ioWatch(dfd,_27,_28,_29);
xhr=null;
return dfd;
};
dojo.xhrGet=function(_2f){
return _1.xhr("GET",_2f);
};
dojo.rawXhrPost=dojo.xhrPost=function(_30){
return _1.xhr("POST",_30,true);
};
dojo.rawXhrPut=dojo.xhrPut=function(_31){
return _1.xhr("PUT",_31,true);
};
dojo.xhrDelete=function(_32){
return _1.xhr("DELETE",_32);
};
}(dojo));
dojo.attachScript=function(_1){
var _2=dojo.doc;
var _3=_2.createElement("script");
_3.type="text/javascript";
_3.src=_1.url;
_3.charset="utf-8";
return _2.getElementsByTagName("head")[0].appendChild(_3);
};
(function(){
var _1=0;
var _2={};
dojo.jsonp=function(_3){
if(!_3.url){
throw new Error("dojo.jsonp: No URL specified.");
}
if(!_3.jsonp){
throw new Error("dojo.jsonp: No callback param specified.");
}
_1++;
var _4="jsonp_callback_"+_1;
var _5=_3.timeout||3000;
_2[_1]=setTimeout(function(){
dojo.jsonp[_4]=function(){
};
clearTimeout(_2[_1]);
if(_3.error){
_3.error(null,{});
}
if(_3.handle){
_3.handle(null,{});
}
},_5);
_3.url+="?"+_3.jsonp+"=dojo.jsonp."+_4;
dojo.jsonp[_4]=function(_6){
clearTimeout(_2[_1]);
try{
if(_3.load){
_3.load(_6,{});
}
}
catch(e){
if(_3.error){
_3.error(null,{});
}
}
if(_3.handle){
_3.handle(_6,{});
}
};
if(_3.content){
_3.url+="&"+dojo.objectToQuery(_3.content);
}
return dojo.attachScript(_3);
};
})();
dojo.declare=function(_1,_2,_3){
var dd=arguments.callee,_4;
if(dojo.isArray(_2)){
_4=_2;
_2=_4.shift();
}
if(_4){
dojo.forEach(_4,function(m,i){
if(!m){
throw (_1+": mixin #"+i+" is null");
}
_2=dd._delegate(_2,m);
});
}
var _5=dd._delegate(_2);
_3=_3||{};
_5.extend(_3);
dojo.extend(_5,{declaredClass:_1,_constructor:_3.constructor});
_5.prototype.constructor=_5;
return dojo.setObject(_1,_5);
};
dojo.mixin(dojo.declare,{_delegate:function(_6,_7){
var bp=(_6||0).prototype,mp=(_7||0).prototype,dd=dojo.declare;
var _8=dd._makeCtor();
dojo.mixin(_8,{superclass:bp,mixin:mp,extend:dd._extend});
if(_6){
_8.prototype=dojo._delegate(bp);
}
dojo.extend(_8,dd._core,mp||0,{_constructor:null,preamble:null});
_8.prototype.constructor=_8;
_8.prototype.declaredClass=(bp||0).declaredClass+"_"+(mp||0).declaredClass;
return _8;
},_extend:function(_9){
var i,fn;
for(i in _9){
if(dojo.isFunction(fn=_9[i])&&!0[i]){
fn.nom=i;
fn.ctor=this;
}
}
dojo.extend(this,_9);
},_makeCtor:function(){
return function(){
this._construct(arguments);
};
},_core:{_construct:function(_a){
var c=_a.callee,s=c.superclass,ct=s&&s.constructor,m=c.mixin,_b=m&&m.constructor,a=_a,ii,fn;
if(a[0]){
if(((fn=a[0].preamble))){
a=fn.apply(this,a)||a;
}
}
if((fn=c.prototype.preamble)){
a=fn.apply(this,a)||a;
}
if(ct&&ct.apply){
ct.apply(this,a);
}
if(_b&&_b.apply){
_b.apply(this,a);
}
if((ii=c.prototype._constructor)){
ii.apply(this,_a);
}
if(this.constructor.prototype==c.prototype&&(ct=this.postscript)){
ct.apply(this,_a);
}
},_findMixin:function(_c){
var c=this.constructor,p,m;
while(c){
p=c.superclass;
m=c.mixin;
if(m==_c||(m instanceof _c.constructor)){
return p;
}
if(m&&m._findMixin&&(m=m._findMixin(_c))){
return m;
}
c=p&&p.constructor;
}
},_findMethod:function(_d,_e,_f,has){
var p=_f,c,m,f;
do{
c=p.constructor;
m=c.mixin;
if(m&&(m=this._findMethod(_d,_e,m,has))){
return m;
}
if((f=p[_d])&&(has==(f==_e))){
return p;
}
p=c.superclass;
}while(p);
return !has&&(p=this._findMixin(_f))&&this._findMethod(_d,_e,p,has);
},inherited:function(_10,_11,_12){
var a=arguments;
if(typeof a[0]!="string"){
_12=_11;
_11=_10;
_10=_11.callee.nom;
}
a=_12||_11;
var c=_11.callee,p=this.constructor.prototype,fn,mp;
if(this[_10]!=c||p[_10]==c){
mp=(c.ctor||0).superclass||this._findMethod(_10,c,p,true);
if(!mp){
throw (this.declaredClass+": inherited method \""+_10+"\" mismatch");
}
p=this._findMethod(_10,c,mp,false);
}
fn=p&&p[_10];
if(!fn){
throw (mp.declaredClass+": inherited method \""+_10+"\" not found");
}
return fn.apply(this,a);
}}});
dojo.delegate=dojo._delegate=(function(){
function _1(){
};
return function(_2,_3){
_1.prototype=_2;
var _4=new _1();
_1.prototype=null;
if(_3){
dojo._mixin(_4,_3);
}
return _4;
};
})();
(function(){
var _1={trim:function(_2){
_2=_2.replace(/^\s+/,"");
for(var i=_2.length-1;i>=0;i--){
if(/\S/.test(_2.charAt(i))){
_2=_2.substring(0,i+1);
break;
}
}
return _2;
},forEach:function(_3,_4,_5){
if(!_3||!_3.length){
return;
}
for(var i=0,l=_3.length;i<l;++i){
_4.call(_5||window,_3[i],i,_3);
}
},byId:function(id,_6){
if(typeof id=="string"){
return (_6||document).getElementById(id);
}else{
return id;
}
},doc:document,NodeList:Array};
var n=navigator;
var _7=n.userAgent;
var _8=n.appVersion;
var tv=parseFloat(_8);
_1.isOpera=(_7.indexOf("Opera")>=0)?tv:undefined;
_1.isKhtml=(_8.indexOf("Konqueror")>=0)?tv:undefined;
_1.isWebKit=parseFloat(_7.split("WebKit/")[1])||undefined;
_1.isChrome=parseFloat(_7.split("Chrome/")[1])||undefined;
var _9=Math.max(_8.indexOf("WebKit"),_8.indexOf("Safari"),0);
if(_9&&!_1.isChrome){
_1.isSafari=parseFloat(_8.split("Version/")[1]);
if(!_1.isSafari||parseFloat(_8.substr(_9+7))<=419.3){
_1.isSafari=2;
}
}
if(document.all&&!_1.isOpera){
_1.isIE=parseFloat(_8.split("MSIE ")[1])||undefined;
}
Array._wrap=function(_a){
return _a;
};
(function(d){
var _b=d.trim;
var _c=d.forEach;
var _d=d._NodeListCtor=d.NodeList;
var _e=function(){
return d.doc;
};
var _f=((d.isWebKit||d.isMozilla)&&((_e().compatMode)=="BackCompat"));
var _10=!!_e().firstChild["children"]?"children":"childNodes";
var _11=">~+";
var _12=false;
var _13=function(){
return true;
};
var _14=function(_15){
if(_11.indexOf(_15.slice(-1))>=0){
_15+=" * ";
}else{
_15+=" ";
}
var ts=function(s,e){
return _b(_15.slice(s,e));
};
var _16=[];
var _17=-1,_18=-1,_19=-1,_1a=-1,_1b=-1,_1c=-1,_1d=-1,lc="",cc="",_1e;
var x=0,ql=_15.length,_1f=null,_20=null;
var _21=function(){
if(_1d>=0){
var tv=(_1d==x)?null:ts(_1d,x);
_1f[(_11.indexOf(tv)<0)?"tag":"oper"]=tv;
_1d=-1;
}
};
var _22=function(){
if(_1c>=0){
_1f.id=ts(_1c,x).replace(/\\/g,"");
_1c=-1;
}
};
var _23=function(){
if(_1b>=0){
_1f.classes.push(ts(_1b+1,x).replace(/\\/g,""));
_1b=-1;
}
};
var _24=function(){
_22();
_21();
_23();
};
var _25=function(){
_24();
if(_1a>=0){
_1f.pseudos.push({name:ts(_1a+1,x)});
}
_1f.loops=(_1f.pseudos.length||_1f.attrs.length||_1f.classes.length);
_1f.oquery=_1f.query=ts(_1e,x);
_1f.otag=_1f.tag=(_1f["oper"])?null:(_1f.tag||"*");
if(_1f.tag){
_1f.tag=_1f.tag.toUpperCase();
}
if(_16.length&&(_16[_16.length-1].oper)){
_1f.infixOper=_16.pop();
_1f.query=_1f.infixOper.query+" "+_1f.query;
}
_16.push(_1f);
_1f=null;
};
for(;lc=cc,cc=_15.charAt(x),x<ql;x++){
if(lc=="\\"){
continue;
}
if(!_1f){
_1e=x;
_1f={query:null,pseudos:[],attrs:[],classes:[],tag:null,oper:null,id:null,getTag:function(){
return (_12)?this.otag:this.tag;
}};
_1d=x;
}
if(_17>=0){
if(cc=="]"){
if(!_20.attr){
_20.attr=ts(_17+1,x);
}else{
_20.matchFor=ts((_19||_17+1),x);
}
var cmf=_20.matchFor;
if(cmf){
if((cmf.charAt(0)=="\"")||(cmf.charAt(0)=="'")){
_20.matchFor=cmf.slice(1,-1);
}
}
_1f.attrs.push(_20);
_20=null;
_17=_19=-1;
}else{
if(cc=="="){
var _26=("|~^$*".indexOf(lc)>=0)?lc:"";
_20.type=_26+cc;
_20.attr=ts(_17+1,x-_26.length);
_19=x+1;
}
}
}else{
if(_18>=0){
if(cc==")"){
if(_1a>=0){
_20.value=ts(_18+1,x);
}
_1a=_18=-1;
}
}else{
if(cc=="#"){
_24();
_1c=x+1;
}else{
if(cc=="."){
_24();
_1b=x;
}else{
if(cc==":"){
_24();
_1a=x;
}else{
if(cc=="["){
_24();
_17=x;
_20={};
}else{
if(cc=="("){
if(_1a>=0){
_20={name:ts(_1a+1,x),value:null};
_1f.pseudos.push(_20);
}
_18=x;
}else{
if((cc==" ")&&(lc!=cc)){
_25();
}
}
}
}
}
}
}
}
}
return _16;
};
var _27=function(_28,_29){
if(!_28){
return _29;
}
if(!_29){
return _28;
}
return function(){
return _28.apply(window,arguments)&&_29.apply(window,arguments);
};
};
var _2a=function(i,arr){
var r=arr||[];
if(i){
r.push(i);
}
return r;
};
var _2b=function(n){
return (1==n.nodeType);
};
var _2c="";
var _2d=function(_2e,_2f){
if(!_2e){
return _2c;
}
if(_2f=="class"){
return _2e.className||_2c;
}
if(_2f=="for"){
return _2e.htmlFor||_2c;
}
if(_2f=="style"){
return _2e.style.cssText||_2c;
}
return (_12?_2e.getAttribute(_2f):_2e.getAttribute(_2f,2))||_2c;
};
var _30={"*=":function(_31,_32){
return function(_33){
return (_2d(_33,_31).indexOf(_32)>=0);
};
},"^=":function(_34,_35){
return function(_36){
return (_2d(_36,_34).indexOf(_35)==0);
};
},"$=":function(_37,_38){
var _39=" "+_38;
return function(_3a){
var ea=" "+_2d(_3a,_37);
return (ea.lastIndexOf(_38)==(ea.length-_38.length));
};
},"~=":function(_3b,_3c){
var _3d=" "+_3c+" ";
return function(_3e){
var ea=" "+_2d(_3e,_3b)+" ";
return (ea.indexOf(_3d)>=0);
};
},"|=":function(_3f,_40){
var _41=" "+_40+"-";
return function(_42){
var ea=" "+_2d(_42,_3f);
return ((ea==_40)||(ea.indexOf(_41)==0));
};
},"=":function(_43,_44){
return function(_45){
return (_2d(_45,_43)==_44);
};
}};
var _46=(typeof _e().firstChild.nextElementSibling=="undefined");
var _47=!_46?"nextElementSibling":"nextSibling";
var _48=!_46?"previousElementSibling":"previousSibling";
var _49=(_46?_2b:_13);
var _4a=function(_4b){
while(_4b=_4b[_48]){
if(_49(_4b)){
return false;
}
}
return true;
};
var _4c=function(_4d){
while(_4d=_4d[_47]){
if(_49(_4d)){
return false;
}
}
return true;
};
var _4e=function(_4f){
var _50=_4f.parentNode;
var i=0,_51=_50[_10],ci=(_4f["_i"]||-1),cl=(_50["_l"]||-1);
if(!_51){
return -1;
}
var l=_51.length;
if(cl==l&&ci>=0&&cl>=0){
return ci;
}
_50["_l"]=l;
ci=-1;
for(var te=_50["firstElementChild"]||_50["firstChild"];te;te=te[_47]){
if(_49(te)){
te["_i"]=++i;
if(_4f===te){
ci=i;
}
}
}
return ci;
};
var _52=function(_53){
return !((_4e(_53))%2);
};
var _54=function(_55){
return ((_4e(_55))%2);
};
var _56={"checked":function(_57,_58){
return function(_59){
return !!("checked" in _59?_59.checked:_59.selected);
};
},"first-child":function(){
return _4a;
},"last-child":function(){
return _4c;
},"only-child":function(_5a,_5b){
return function(_5c){
if(!_4a(_5c)){
return false;
}
if(!_4c(_5c)){
return false;
}
return true;
};
},"empty":function(_5d,_5e){
return function(_5f){
var cn=_5f.childNodes;
var cnl=_5f.childNodes.length;
for(var x=cnl-1;x>=0;x--){
var nt=cn[x].nodeType;
if((nt===1)||(nt==3)){
return false;
}
}
return true;
};
},"contains":function(_60,_61){
var cz=_61.charAt(0);
if(cz=="\""||cz=="'"){
_61=_61.slice(1,-1);
}
return function(_62){
return (_62.innerHTML.indexOf(_61)>=0);
};
},"not":function(_63,_64){
var p=_14(_64)[0];
var _65={el:1};
if(p.tag!="*"){
_65.tag=1;
}
if(!p.classes.length){
_65.classes=1;
}
var ntf=_66(p,_65);
return function(_67){
return (!ntf(_67));
};
},"nth-child":function(_68,_69){
var pi=parseInt;
if(_69=="odd"){
return _54;
}else{
if(_69=="even"){
return _52;
}
}
if(_69.indexOf("n")!=-1){
var _6a=_69.split("n",2);
var _6b=_6a[0]?((_6a[0]=="-")?-1:pi(_6a[0])):1;
var idx=_6a[1]?pi(_6a[1]):0;
var lb=0,ub=-1;
if(_6b>0){
if(idx<0){
idx=(idx%_6b)&&(_6b+(idx%_6b));
}else{
if(idx>0){
if(idx>=_6b){
lb=idx-idx%_6b;
}
idx=idx%_6b;
}
}
}else{
if(_6b<0){
_6b*=-1;
if(idx>0){
ub=idx;
idx=idx%_6b;
}
}
}
if(_6b>0){
return function(_6c){
var i=_4e(_6c);
return (i>=lb)&&(ub<0||i<=ub)&&((i%_6b)==idx);
};
}else{
_69=idx;
}
}
var _6d=pi(_69);
return function(_6e){
return (_4e(_6e)==_6d);
};
}};
var _6f=(d.isIE)?function(_70){
var clc=_70.toLowerCase();
if(clc=="class"){
_70="className";
}
return function(_71){
return (_12?_71.getAttribute(_70):_71[_70]||_71[clc]);
};
}:function(_72){
return function(_73){
return (_73&&_73.getAttribute&&_73.hasAttribute(_72));
};
};
var _66=function(_74,_75){
if(!_74){
return _13;
}
_75=_75||{};
var ff=null;
if(!("el" in _75)){
ff=_27(ff,_2b);
}
if(!("tag" in _75)){
if(_74.tag!="*"){
ff=_27(ff,function(_76){
return (_76&&(_76.tagName==_74.getTag()));
});
}
}
if(!("classes" in _75)){
_c(_74.classes,function(_77,idx,arr){
var re=new RegExp("(?:^|\\s)"+_77+"(?:\\s|$)");
ff=_27(ff,function(_78){
return re.test(_78.className);
});
ff.count=idx;
});
}
if(!("pseudos" in _75)){
_c(_74.pseudos,function(_79){
var pn=_79.name;
if(_56[pn]){
ff=_27(ff,_56[pn](pn,_79.value));
}
});
}
if(!("attrs" in _75)){
_c(_74.attrs,function(_7a){
var _7b;
var a=_7a.attr;
if(_7a.type&&_30[_7a.type]){
_7b=_30[_7a.type](a,_7a.matchFor);
}else{
if(a.length){
_7b=_6f(a);
}
}
if(_7b){
ff=_27(ff,_7b);
}
});
}
if(!("id" in _75)){
if(_74.id){
ff=_27(ff,function(_7c){
return (!!_7c&&(_7c.id==_74.id));
});
}
}
if(!ff){
if(!("default" in _75)){
ff=_13;
}
}
return ff;
};
var _7d=function(_7e){
return function(_7f,ret,bag){
while(_7f=_7f[_47]){
if(_46&&(!_2b(_7f))){
continue;
}
if((!bag||_80(_7f,bag))&&_7e(_7f)){
ret.push(_7f);
}
break;
}
return ret;
};
};
var _81=function(_82){
return function(_83,ret,bag){
var te=_83[_47];
while(te){
if(_49(te)){
if(bag&&!_80(te,bag)){
break;
}
if(_82(te)){
ret.push(te);
}
}
te=te[_47];
}
return ret;
};
};
var _84=function(_85){
_85=_85||_13;
return function(_86,ret,bag){
var te,x=0,_87=_86[_10];
while(te=_87[x++]){
if(_49(te)&&(!bag||_80(te,bag))&&(_85(te,x))){
ret.push(te);
}
}
return ret;
};
};
var _88=function(_89,_8a){
var pn=_89.parentNode;
while(pn){
if(pn==_8a){
break;
}
pn=pn.parentNode;
}
return !!pn;
};
var _8b={};
var _8c=function(_8d){
var _8e=_8b[_8d.query];
if(_8e){
return _8e;
}
var io=_8d.infixOper;
var _8f=(io?io.oper:"");
var _90=_66(_8d,{el:1});
var qt=_8d.tag;
var _91=("*"==qt);
var ecs=_e()["getElementsByClassName"];
if(!_8f){
if(_8d.id){
_90=(!_8d.loops&&_91)?_13:_66(_8d,{el:1,id:1});
_8e=function(_92,arr){
var te=d.byId(_8d.id,(_92.ownerDocument||_92));
if(!te||!_90(te)){
return;
}
if(9==_92.nodeType){
return _2a(te,arr);
}else{
if(_88(te,_92)){
return _2a(te,arr);
}
}
};
}else{
if(ecs&&/\{\s*\[native code\]\s*\}/.test(String(ecs))&&_8d.classes.length&&!_f){
_90=_66(_8d,{el:1,classes:1,id:1});
var _93=_8d.classes.join(" ");
_8e=function(_94,arr,bag){
var ret=_2a(0,arr),te,x=0;
var _95=_94.getElementsByClassName(_93);
while((te=_95[x++])){
if(_90(te,_94)&&_80(te,bag)){
ret.push(te);
}
}
return ret;
};
}else{
if(!_91&&!_8d.loops){
_8e=function(_96,arr,bag){
var ret=_2a(0,arr),te,x=0;
var _97=_96.getElementsByTagName(_8d.getTag());
while((te=_97[x++])){
if(_80(te,bag)){
ret.push(te);
}
}
return ret;
};
}else{
_90=_66(_8d,{el:1,tag:1,id:1});
_8e=function(_98,arr,bag){
var ret=_2a(0,arr),te,x=0;
var _99=_98.getElementsByTagName(_8d.getTag());
while((te=_99[x++])){
if(_90(te,_98)&&_80(te,bag)){
ret.push(te);
}
}
return ret;
};
}
}
}
}else{
var _9a={el:1};
if(_91){
_9a.tag=1;
}
_90=_66(_8d,_9a);
if("+"==_8f){
_8e=_7d(_90);
}else{
if("~"==_8f){
_8e=_81(_90);
}else{
if(">"==_8f){
_8e=_84(_90);
}
}
}
}
return _8b[_8d.query]=_8e;
};
var _9b=function(_9c,_9d){
var _9e=_2a(_9c),qp,x,te,qpl=_9d.length,bag,ret;
for(var i=0;i<qpl;i++){
ret=[];
qp=_9d[i];
x=_9e.length-1;
if(x>0){
bag={};
ret.nozip=true;
}
var gef=_8c(qp);
for(var j=0;(te=_9e[j]);j++){
gef(te,ret,bag);
}
if(!ret.length){
break;
}
_9e=ret;
}
return ret;
};
var _9f={},_a0={};
var _a1=function(_a2){
var _a3=_14(_b(_a2));
if(_a3.length==1){
var tef=_8c(_a3[0]);
return function(_a4){
var r=tef(_a4,new _d());
if(r){
r.nozip=true;
}
return r;
};
}
return function(_a5){
return _9b(_a5,_a3);
};
};
var nua=navigator.userAgent;
var wk="WebKit/";
var _a6=(d.isWebKit&&(nua.indexOf(wk)>0)&&(parseFloat(nua.split(wk)[1])>528));
var _a7=d.isIE?"commentStrip":"nozip";
var qsa="querySelectorAll";
var _a8=(!!_e()[qsa]&&(!d.isSafari||(d.isSafari>3.1)||_a6));
var _a9=/n\+\d|([^ ])?([>~+])([^ =])?/g;
var _aa=function(_ab,pre,ch,_ac){
return ch?(pre?pre+" ":"")+ch+(_ac?" "+_ac:""):_ab;
};
var _ad=function(_ae,_af){
_ae=_ae.replace(_a9,_aa);
if(_a8){
var _b0=_a0[_ae];
if(_b0&&!_af){
return _b0;
}
}
var _b1=_9f[_ae];
if(_b1){
return _b1;
}
var qcz=_ae.charAt(0);
var _b2=(-1==_ae.indexOf(" "));
if((_ae.indexOf("#")>=0)&&(_b2)){
_af=true;
}
var _b3=(_a8&&(!_af)&&(_11.indexOf(qcz)==-1)&&(!d.isIE||(_ae.indexOf(":")==-1))&&(!(_f&&(_ae.indexOf(".")>=0)))&&(_ae.indexOf(":contains")==-1)&&(_ae.indexOf(":checked")==-1)&&(_ae.indexOf("|=")==-1));
if(_b3){
var tq=(_11.indexOf(_ae.charAt(_ae.length-1))>=0)?(_ae+" *"):_ae;
return _a0[_ae]=function(_b4){
try{
if(!((9==_b4.nodeType)||_b2)){
throw "";
}
var r=_b4[qsa](tq);
r[_a7]=true;
return r;
}
catch(e){
return _ad(_ae,true)(_b4);
}
};
}else{
var _b5=_ae.split(/\s*,\s*/);
return _9f[_ae]=((_b5.length<2)?_a1(_ae):function(_b6){
var _b7=0,ret=[],tp;
while((tp=_b5[_b7++])){
ret=ret.concat(_a1(tp)(_b6));
}
return ret;
});
}
};
var _b8=0;
var _b9=d.isIE?function(_ba){
if(_12){
return (_ba.getAttribute("_uid")||_ba.setAttribute("_uid",++_b8)||_b8);
}else{
return _ba.uniqueID;
}
}:function(_bb){
return (_bb._uid||(_bb._uid=++_b8));
};
var _80=function(_bc,bag){
if(!bag){
return 1;
}
var id=_b9(_bc);
if(!bag[id]){
return bag[id]=1;
}
return 0;
};
var _bd="_zipIdx";
var _be=function(arr){
if(arr&&arr.nozip){
return (_d._wrap)?_d._wrap(arr):arr;
}
var ret=new _d();
if(!arr||!arr.length){
return ret;
}
if(arr[0]){
ret.push(arr[0]);
}
if(arr.length<2){
return ret;
}
_b8++;
if(d.isIE&&_12){
var _bf=_b8+"";
arr[0].setAttribute(_bd,_bf);
for(var x=1,te;te=arr[x];x++){
if(arr[x].getAttribute(_bd)!=_bf){
ret.push(te);
}
te.setAttribute(_bd,_bf);
}
}else{
if(d.isIE&&arr.commentStrip){
try{
for(var x=1,te;te=arr[x];x++){
if(_2b(te)){
ret.push(te);
}
}
}
catch(e){
}
}else{
if(arr[0]){
arr[0][_bd]=_b8;
}
for(var x=1,te;te=arr[x];x++){
if(arr[x][_bd]!=_b8){
ret.push(te);
}
te[_bd]=_b8;
}
}
}
return ret;
};
d.query=function(_c0,_c1){
_d=d._NodeListCtor;
if(!_c0){
return new _d();
}
if(_c0.constructor==_d){
return _c0;
}
if(typeof _c0!="string"){
return new _d(_c0);
}
if(typeof _c1=="string"){
_c1=d.byId(_c1);
if(!_c1){
return new _d();
}
}
_c1=_c1||_e();
var od=_c1.ownerDocument||_c1.documentElement;
_12=(_c1.contentType&&_c1.contentType=="application/xml")||(d.isOpera&&(_c1.doctype||od.toString()=="[object XMLDocument]"))||(!!od)&&(d.isIE?od.xml:(_c1.xmlVersion||od.xmlVersion));
var r=_ad(_c0)(_c1);
if(r&&r.nozip&&!_d._wrap){
return r;
}
return _be(r);
};
d.query.pseudos=_56;
d._filterQueryResult=function(_c2,_c3){
var _c4=new d._NodeListCtor();
var _c5=_66(_14(_c3)[0]);
for(var x=0,te;te=_c2[x];x++){
if(_c5(te)){
_c4.push(te);
}
}
return _c4;
};
})(_1);
dojo.query=dojo._query=_1.query;
})();

