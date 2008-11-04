/*
 * Google Maps Utility Lib to ESRI ArcGIS Server
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function(){var a=Math.PI/180;ESRI_GEOMETRY_POINT="esriGeometryPoint";ESRI_GEOMETRY_POLYLINE="esriGeometryPolyline";ESRI_GEOMETRY_POLYGON="esriGeometryPolygon";ESRI_GEOMETRY_MULTIPOINT="esriGeometryMultipoint";ESRI_GEOMETRY_ENVELOPE="esriGeometryEnvelope";ESRI_SPATIALREL_INTERSECTS="esriSpatialRelIntersects";ESRI_SPATIALREL_CONTAINS="esriSpatialRelContains";ESRI_SPATIALREL_CROSSES="esriSpatialRelCrosses";ESRI_SPATIALREL_ENVELOPEINTERSECTS="esriSpatialRelEnvelopeIntersects";ESRI_SPATIALREL_INDEXINTERSECTS="esriSpatialRelIndexIntersects";ESRI_SPATIALREL_OVERLAPS="esriSpatialRelOverlaps";ESRI_SPATIALREL_TOUCHES="esriSpatialRelTouches";ESRI_SPATIALREL_WITHIN="esriSpatialRelWithin";function S(h){h=h||{};this.wkid=h.wkid}S.prototype.fromLatLngToCoords=function(h){return h};S.prototype.fromCoordsToLatLng=function(h){return h};S.prototype.getWrapWidth=function(){return 360};S.prototype.transform=function(j){if(j.spatialReference.wkid!=this.wkid){var i=D.getSpatialReference(j.spatialReference.wkid);var h=i.fromCoordsToLatLng([j.xmin,j.ymin]);var k=i.fromCoordsToLatLng([j.ymin,j.ymax]);h=this.fromLatLngToCoords(h);k=this.fromLatLngToCoords(k);return{xmin:h[0],ymin:h[1],xmax:k[0],ymax:k[1],spatialReference:{wkid:this.wkid}}}else{return j}};function W(h){h=h||{};S.call(this,h)}W.prototype=new S();function g(h){h=h||{};S.call(this,h);var l=h.inverse_flattening;var o=h.standard_parallel_1*a;var n=h.standard_parallel_2*a;var p=h.latitude_of_origin*a;this.a_=h.semi_major/h.unit;this.lamdaF_=h.central_meridian*a;this.FE_=h.false_easting;this.FN_=h.false_northing;var k=1/l;var q=2*k-k*k;this.e_=Math.sqrt(q);var s=this.calc_m_(o,q);var r=this.calc_m_(n,q);var m=this.calc_t_(p,this.e_);var j=this.calc_t_(o,this.e_);var i=this.calc_t_(n,this.e_);this.n_=Math.log(s/r)/Math.log(j/i);this.F_=s/(this.n_*Math.pow(j,this.n_));this.rF_=this.calc_r_(this.a_,this.F_,m,this.n_)}g.prototype=new S();g.prototype.calc_m_=function(i,j){var h=Math.sin(i);return Math.cos(i)/Math.sqrt(1-j*h*h)};g.prototype.calc_t_=function(i,j){var h=j*Math.sin(i);return Math.tan(Math.PI/4-i/2)/Math.pow((1-h)/(1+h),j/2)};g.prototype.calc_r_=function(h,j,i,k){return h*j*Math.pow(i,k)};g.prototype.calc_phi_=function(h,k,j){var i=k*Math.sin(j);return Math.PI/2-2*Math.atan(h*Math.pow((1-i)/(1+i),k/2))};g.prototype.solve_phi_=function(k,m,n){var j=0;var l=n;var h=this.calc_phi_(k,m,l);while(Math.abs(h-l)>1e-9&&j<10){j++;l=h;h=this.calc_phi_(k,m,l)}return h};g.prototype.fromLatLngToCoords=function(h){var m=h[1]*a;var i=h[0]*a;var k=this.calc_t_(m,this.e_);var l=this.calc_r_(this.a_,this.F_,k,this.n_);var j=this.n_*(i-this.lamdaF_);var n=this.FE_+l*Math.sin(j);var o=this.FN_+this.rF_-l*Math.cos(j);return[n,o]};g.prototype.fromCoordsToLatLng=function(n){var m=n[0];var o=n[1];var j=Math.atan((m-this.FE_)/(this.rF_-(o-this.FN_)));var i=(this.n_>0?1:-1)*Math.sqrt((m-this.FE_)*(m-this.FE_)+(this.rF_-(o-this.FN_))*(this.rF_-(o-this.FN_)));var k=Math.pow((i/(this.a_*this.F_)),1/this.n_);var l=this.solve_phi_(k,this.e_,0);var h=j/this.n_+this.lamdaF_;return[h/a,l/a]};g.prototype.getWrapWidth=function(){return Math.PI*2*this.a_};function Y(k){k=k||{};S.call(this,k);this.a_=k.semi_major/k.unit;var i=k.inverse_flattening;this.k0_=k.scale_factor;var h=k.latitude_of_origin*a;this.lamdaF_=k.central_meridian*a;this.FE_=k.false_easting;this.FN_=k.false_northing;var j=1/i;this.es_=2*j-j*j;this.ep4_=this.es_*this.es_;this.ep6_=this.ep4_*this.es_;this.eas_=this.es_/(1-this.es_);this.M0_=this.calc_m_(h,this.a_,this.es_,this.ep4_,this.ep6_)}Y.prototype=new S();Y.prototype.calc_m_=function(i,h,l,k,j){return h*((1-l/4-3*k/64-5*j/256)*i-(3*l/8+3*k/32+45*j/1024)*Math.sin(2*i)+(15*k/256+45*j/1024)*Math.sin(4*i)-(35*j/3072)*Math.sin(6*i))};Y.prototype.fromLatLngToCoords=function(k){var m=k[1]*a;var p=k[0]*a;var l=this.a_/Math.sqrt(1-this.es_*Math.pow(Math.sin(m),2));var j=Math.pow(Math.tan(m),2);var h=this.eas_*Math.pow(Math.cos(m),2);var i=(p-this.lamdaF_)*Math.cos(m);var n=this.calc_m_(m,this.a_,this.es_,this.ep4_,this.ep6_);var o=this.FE_+this.k0_*l*(i+(1-j+h)*Math.pow(i,3)/6+(5-18*j+j*j+72*h-58*this.eas_)*Math.pow(i,5)/120);var l=this.FN_+this.k0_*(n-this.M0_)+l*Math.tan(m)*(i*i/2+(5-j+9*h+4*h*h)*Math.pow(i,4)/120+(61-58*j+j*j+600*h-330*this.eas_)*Math.pow(i,6)/720);return[o,l]};Y.prototype.fromCoordsToLatLng=function(r){var u=r[0];var m=r[1];var p=(1-Math.sqrt(1-this.es_))/(1+Math.sqrt(1-this.es_));var i=this.M0_+(m-this.FN_)/this.k0_;var s=i/(this.a_*(1-this.es_/4-3*this.ep4_/64-5*this.ep6_/256));var q=s+(3*p/2-27*Math.pow(p,3)/32)*Math.sin(2*s)+(21*p*p/16-55*Math.pow(p,4)/32)*Math.sin(4*s)+(151*Math.pow(p,3)/6)*Math.sin(6*s)+(1097*Math.pow(p,4)/512)*Math.sin(8*s);var k=this.eas_*Math.pow(Math.cos(q),2);var n=Math.pow(Math.tan(q),2);var o=this.a_/Math.sqrt(1-this.es_*Math.pow(Math.sin(q),2));var j=this.a_*(1-this.es_)/Math.pow((1-this.es_*Math.pow(Math.sin(q),2)),3/2);var h=(u-this.FE_)/(o*this.k0_);var l=q-(o*Math.tan(q)/j)*(h*h/2-(5+3*n+10*k-4*k*k-9*this.eas_)*Math.pow(h,4)/24+(61+90*n+28*k+45*n*n-252*this.eas_-3*k*k)*Math.pow(h,6)/720);var t=this.lamdaF_+(h-(1+2*n+k)*Math.pow(h,3)/6+(5-2*k+28*n-3*k*k+8*this.eas_+24*n*n)*Math.pow(h,5)/120)/Math.cos(q);return[t/a,l/a]};Y.prototype.getWrapWidth=function(){return Math.PI*2*this.a_};function A(h){h=h||{};S.call(this,h);this.a_=(h.semi_major||6378137)/(h.unit||1);this.lamdaF_=(h.central_meridian||0)*a}A.prototype=new S();A.prototype.fromLatLngToCoords=function(h){var j=h[1]*a;var i=h[0]*a;var k=this.a_*(i-this.lamdaF_);var l=(this.a_/2)*Math.log((1+Math.sin(j))/(1-Math.sin(j)));return[k,l]};A.prototype.fromCoordsToLatLng=function(k){var j=k[0];var l=k[1];var i=Math.PI/2-2*Math.atan(Math.exp(-l/this.a_));var h=j/this.a_+this.lamdaF_;return[h/a,i/a]};A.prototype.getWrapWidth=function(){return Math.PI*2*this.a_};function L(h){h=h||{};S.call(this,h);this.lng_=h.latlng.xmin;this.lat_=h.latlng.ymin;this.x_=h.coords.xmin;this.y_=h.coords.ymin;this.xscale_=(h.coords.xmax-h.coords.xmin)/(h.latlng.xmax-h.latlng.xmin);this.yscale_=(h.coords.ymax-h.coords.ymin)/(h.latlng.ymax-h.latlng.ymin)}L.prototype=new S();L.prototype.fromLatLngToCoords=function(h){var i=this.x_+(h[0]-this.lng_)*this.xscale_;var j=this.y_+(h[1]-this.lat_)*this.yscale_;return[i,j]};L.prototype.fromCoordsToLatLng=function(i){var h=this.lng_+(i[0]-this.x_)/this.xscale_;var j=this.lat_+(i[1]-this.y_)/this.yscale_;return[h,j]};L.prototype.getWrapWidth=function(){return this.xscale_*360};var E=new W({wkid:4326});var O=new W({wkid:4269});var e=new A({wkid:102113,semi_major:6378137,central_meridian:0,unit:1});var D={"4326":E,"4269":O,"102113":e};D.addSpatialReference=function(l,n){var j=this[""+l];if(j!=null){return j}if(n instanceof S){this[""+l]=n;return n}var k=n;var m={wkid:l};var i=N(k,'PROJECTION["','"]');var h=N(k,"SPHEROID[","]").split(",");if(i!==""){m.unit=parseFloat(N(N(k,"PROJECTION",""),"UNIT[","]").split(",")[1]);m.semi_major=parseFloat(h[1]);m.inverse_flattening=parseFloat(h[2]);m.latitude_of_origin=parseFloat(N(k,'"Latitude_Of_Origin",',"]"));m.central_meridian=parseFloat(N(k,'"Central_Meridian",',"]"));m.false_easting=parseFloat(N(k,'"False_Easting",',"]"));m.false_northing=parseFloat(N(k,'"False_Northing",',"]"))}switch(i){case"":j=new S(m);break;case"Lambert_Conformal_Conic":m.standard_parallel_1=parseFloat(N(k,'"Standard_Parallel_1",',"]"));m.standard_parallel_2=parseFloat(N(k,'"Standard_Parallel_2",',"]"));j=new g(m);break;case"Transverse_Mercator":m.scale_factor=parseFloat(N(k,'"Scale_Factor",',"]"));j=new Y(m);break;default:}if(j){this[""+l]=j}return j};D.getSpatialReference=function(h){return this[""+h]};function F(i,h){this.url=i;var k=i.split("/");this.name=k[k.length-2].replace(/_/g," ");var j=this;this.loaded_=false;this.correct_=false;U.getJSON(i,{f:"json"},"callback",function(l){j.init_(l,h)})}F.prototype.init_=function(r,q){var p=this;if(r.error){this.correct_=false}else{this.correct_=true;X(r,this);var l=[];var h=[];for(var m=0,o=r.layers.length;m<o;m++){var j=r.layers[m];var n=new G(this.url+"/"+j.id);X(j,n);n.visible=j.defaultVisibility;l.push(n);h.push(j.id)}this.layers_=l;delete this.layers;this.spatialReference_=D.getSpatialReference(""+r.spatialReference.wkid);if(!this.spatialReference_){this.exportMap({bbox:r.fullExtent,bboxSR:r.spatialReference.wkid,size:"1,1",imageSR:4326,layers:"hide:"+h.join(",")},function(s){var i=new L({wkid:r.spatialReference.wkid,latlng:s.extent,coords:r.fullExtent});D.addSpatialReference(r.spatialReference.wkid,i);p.spatialReference_=i;k(r)})}else{k(r)}}function k(y){p.loaded_=true;for(var w=0,z=p.layers_.length;w<z;w++){var v=p.layers_[w];if(v.subLayerIds){v.subLayers=[];for(var t=0,s=v.subLayerIds.length;t<s;t++){var u=p.getLayer(v.subLayerIds[t]);v.subLayers.push(u);u.parentLayer=v}}}p.initialExtent.xmin=Math.max(p.initialExtent.xmin,p.fullExtent.xmin);p.initialExtent.ymin=Math.max(p.initialExtent.ymin,p.fullExtent.ymin);p.initialExtent.xmax=Math.min(p.initialExtent.xmax,p.fullExtent.xmax);p.initialExtent.ymax=Math.min(p.initialExtent.ymax,p.fullExtent.ymax);C(p,"load");if(q){q()}}};F.prototype.hasLoaded=function(){return this.loaded_};F.prototype.loadedCorrectly=function(){return this.loaded_&&this.correct_};F.prototype.getSpatialReference=function(){return this.spatialReference_};F.prototype.getLayers=function(){return this.layers_};F.prototype.getLayer=function(j){var k=this.layers_;if(k){for(var h=0,l=k.length;h<l;h++){if(j===k[h].id){return k[h]}if(T(j)&&k[h].name.toLowerCase()==j.toLowerCase()){return k[h]}}}return null};F.prototype.getLayerIds=function(h){var k;if(T(h)){k=this.getLayer(h);if(k){return k.id}}else{if(Q(h)){var l=[];for(var j=0,m=h.length;j<m;j++){k=this.getLayer(h[j]);l.push(k?k.id:-1)}return l}}return -1};F.prototype.exportMap=function(h,t){if(!h){return }var k=X(h,{});k.f=k.f||"json";var u=k.bbox;if(u.xmin){k.bbox=""+u.xmin+","+u.ymin+","+u.xmax+","+u.ymax}k.size=k.size||""+k.width+","+k.height;k.transparent=(k.transparent===false?false:true);var p=[];var s=[];var n=false;var o;for(var m=0,q=this.layers_.length;m<q;m++){o=this.layers_[m];if(o.subLayers){for(var l=0,r=o.subLayers.length;l<r;l++){if(o.subLayers[l].visible===false){o.visible=false;break}}}}for(var m=0,q=this.layers_.length;m<q;m++){o=this.layers_[m];if(o.visible!=o.defaultVisibility){n=true}if(o.visible===true){p.push(o.id)}if(o.definition){s.push(o.id+":"+o.definition)}}if(n===true){if(!k.layers||!T(k.layers)){k.layers="show:"+p.join(",")}}if(s.length>0){if(!k.layerDefs||!T(k.layerDefs)){k.layerDefs=s.join(";")}}if(p.length==0){t({})}else{U.getJSON(this.url+"/export",k,"callback",t)}};F.prototype.identify=function(i,k){if(!i){return }var j=X(i,{});j.f=j.f||"json";if(!T(j.geometry)){j.geometry=U.fromGeometryToJSON(j.geometry)}var h=j.mapExtent;if(h.xmin){j.mapExtent=""+h.xmin+","+h.ymin+","+h.xmax+","+h.ymax}if(!j.imageDisplay){j.imageDisplay=""+j.width+","+j.height+","+j.dpi}if(j.layers&&!T(j.layers)){j.layers="all:"+this.getLayerIds(j.layers).join(",")}j.returnGeometry=(j.returnGeometry===false?false:true);U.getJSON(this.url+"/identify",j,"callback",k)};F.prototype.find=function(h,j){if(!h){return }var i=X(h,{});i.f=i.f||"json";if(i.layers&&!T(i.layers)){i.layers=this.getLayerIds(i.layers).join(",")}if(i.searchFields&&!T(i.searchFields)){i.searchFields=i.searchFields.join(",")}i.contains=(i.contains===false?false:true);i.returnGeometry=(i.returnGeometry===false?false:true);U.getJSON(this.url+"/find",i,"callback",j)};F.prototype.generateKML=function(h){};F.prototype.queryLayer=function(h,j,k){var i=this.getLayer(h);if(i){i.query(j,k)}};function G(h){this.url=h;this.loaded_=false;this.correct_=false;this.definition=null}G.prototype.loadInfo=function(h){var i=this;if(this.loaded_&&this.correct_){return }U.getJSON(this.url,{f:json},"callback",function(j){if(j.error){i.correct_=false}else{i.correct_=true;X(j,i)}i.loaded_=true;C(i,"load");if(h){h()}})};G.prototype.hasLoaded=function(){return this.loaded_};G.prototype.query=function(j,i){if(!j){return }var h=X(j,{});h.f=h.f||"json";if(h.geometry&&!T(h.geometry)){h.geometry=U.fromGeometryToJSON(h.geometry)}if(h.geometry){h.spatialRel=h.spatialRel||ESRI_SPATIALREL_INTERSECTS}if(h.outFields&&!T(h.outFields)){h.outFields=h.outFields.join(",")}h.returnGeometry=h.returnGeometry===false?false:true;U.getJSON(this.url+"/query",h,"callback",i)};function P(h){this.url=h}P.prototype.project=function(h,i){if(!h){return }h.f=h.f||"json";if(!T(h.geometries)){h.geometries=U.fromGeometriesToJSON(h.geometries)}U.getJSON(this.url+"/project",h,"callback",i)};function J(h){this.url=h;var i=this;U.getJSON(h,{f:"json"},"callback",function(j){i.init_(j)})}J.prototype.init_=function(h){X(h,this);C(this,"load")};J.prototype.hasLoaded=function(){return this.addressFields!=null};J.prototype.findAddressCandidates=function(h,j){var i=X(h,{});i.f=i.f||"json";if(i.inputs){X(i.inputs,i);delete i.inputs}if(Q(i.outFields)){i.outFields=i.outFields.join(",")}U.getJSON(this.url+"/findAddressCandidates",i,"callback",j)};J.prototype.geocode=function(h,i){this.findAddressCandidates(h,i)};J.prototype.reverseGeocode=function(h,i){h.f=h.f||"json";if(!T(h.location)){h.location=U.fromGeometryToJSON(h.location)}U.getJSON(this.url+"/reverseGeocode",h,"callback",i)};function N(k,m,h){var j=(m=="")?0:k.indexOf(m);var l=h==""?k.length:k.indexOf(h,j+m.length);return k.substring(j+m.length,l)}function T(h){return typeof h==="string"}function Q(h){return h&&h.length&&h.splice}function X(k,h,i){if(k&&h){var j;for(j in k){if(i||!(j in h)){h[j]=k[j]}}}return h}function C(j,i,h){if(window.GEvent){GEvent.trigger.apply(this,arguments)}}function B(h,l,j){if(h&&l){if(h.indexOf&&!j){return h.indexOf(l)}else{for(var k=0,m=h.length;k<m;k++){if(h[k]===l||(j===true&&h[k].toString().toLowerCase()===l.toString().toLowerCase())){return k}}}}return -1}function d(h,k){for(var j=0,l=k.length;j<l;j++){h.push(k[j])}return h}function R(h,k){var j=B(h,k);if(j!=-1){h.splice(j,1)}}function V(h){for(x in h){if(h.hasOwnProperty(x)){window[x]=h[x]}}}var U={};var H=0;window._xdc_=window._xdc_||{};var K=window._xdc_;U.getJSON=function(h,j,o,m){var i="ags_jsonp"+(H++)+"_"+Math.floor(Math.random()*1000000);var l=h+(h.indexOf("?")==-1?"?":"&");if(j){for(var q in j){if(j.hasOwnProperty(q)){l+=(q+"="+escape(j[q])+"&")}}}var p=document.getElementsByTagName("head")[0];if(!p){throw new Error("document must have header tag")}var n=document.createElement("script");n.src=l+o+"=_xdc_."+i;n.id=i;var k=function(){delete K[i];p.removeChild(n);n=null;m.apply(null,arguments);C(U,"jsonpend",i)};K[i]=k;p.appendChild(n);C(U,"jsonpstart",i);return i};U.getOptionValue=function(h,k,m,o,j){var n=X(h,{});if(k){n=X(k[m],n,true);if(o&&k.serviceOptions&&k.serviceOptions[o]){var l=k.serviceOptions[o];n=X(l[m],n,true);if(j&&l.layerOptions&&l.layerOptions[j]){var i=l.layerOptions[j];n=X(i[m],n,true)}}}return n};U.getAttributeValue=function(j,i){if(typeof j[i]!="undefined"){return j[i]}for(var h in j){if(j.hasOwnProperty(h)){if(i.toLowerCase()===h.toString().toLowerCase()){return j[h]}}}return null};U.fromGeometryToJSON=function(i,l){function k(o){var m=[];for(var n=0,p=o.length;n<p;n++){m.push("["+o[n][0]+","+o[n][1]+"]")}return"["+m.join(",")+"]"}function j(n){var m=[];for(var o=0,p=n.length;o<p;o++){m.push(k(n[o]))}return"["+m.join(",")+"]"}var h="{";if(i.x){h+="x:"+i.x+",y:"+i.y}else{if(i.xmin){h+="xmin:"+i.xmin+",ymin:"+i.ymin+",xmax:"+i.xmax+",ymax:"+i.ymax}else{if(i.points){h+="points:"+k(i.points)}else{if(i.paths){h+="paths:"+j(i.paths)}else{if(i.rings){h+="rings:"+j(i.rings)}}}}}if(l&&i.spatialReference){h+=",spatialReference:{wkid:"+i.spatialReference.wkid+"}"}h+="}";return h};U.groupResultsByLayer=function(r){var m={};var n,k;var h=r.results;for(var j=0,o=h.length;j<o;j++){n=h[j];k=n.layerName;if(!m[k]){var l=[];for(var p in n.attributes){if(n.attributes.hasOwnProperty(p)){l.push(p)}}var q={displayFieldName:n.displayFieldName,spatialReference:n.geometry?n.geometry.spatialReference:null,geometryType:n.geometryType,fieldAliases:l,features:[]};m[k]=q}m[k].features.push(n)}return m};U.getResultSetHtml=function(m){var l='<table class="ags-resultset">';l+="<tr>";var k,h,p,n;for(k=0,p=m.fieldAliases.length;k<p;k++){l+='<th class="ags-fieldname">'+m.fieldAliases[k]+"</th>"}l+="</tr>";for(k=0,p=m.features.length;k<p;k++){l+="<tr>";var o=m.features[k].attributes;for(h=0,n=m.fieldAliases.length;h<n;h++){l+='<td class="ags-fieldvalue">'+o[m.fieldAliases[h]]+"</td>"}l+="</tr>"}l+="</table>";return l};var c={maxPolyPoints:1000,style:{icon:null,strokeColor:"#FF0000",strokeWeight:2,strokeOpacity:0.5,outlineColor:"#FF0000",outlineWeight:2,outlineOpacity:0.5,fillColor:"#FFFF00",fillOpacity:0.5}};V({SpatialReference:S,Geographic:W,LambertConformalConic:g,SphereMercator:A,TransverseMercator:Y,FlatSpatialReference:L,SpatialReferences:D,MapService:F,GeocodeService:J,GeometryService:P,ArcGISUtil:U,ArcGISConfig:c});if(window.GMap2){function M(h,i){if(!h){throw new Error("map service is not tiled")}this.tileInfo_=h;this.spatialReference_=D.getSpatialReference(h.spatialReference.wkid);if(!this.spatialReference_){throw new Error("unsupported Spatial Reference")}this.zoomOffset_=Math.floor(Math.log(this.spatialReference_.getWrapWidth()/this.tileInfo_.lods[0].resolution/256)/Math.LN2+0.5);this.fullExtent_=i}M.prototype=new GProjection();M.prototype.fromLatLngToPixel=function(n,k){if(n==null||isNaN(n.lat())||isNaN(n.lng())){return null}var l=this.spatialReference_.fromLatLngToCoords([n.lng(),n.lat()]);var m=k-this.zoomOffset_;var j=this.getResolution_(k);var i=Math.round((l[0]-this.tileInfo_.origin.x)/j);var h=Math.round((this.tileInfo_.origin.y-l[1])/j);return new GPoint(i,h)};M.prototype.getResolution_=function(j){var k=j-this.zoomOffset_;var i=Number.MAX_VALUE;if(this.tileInfo_.lods[k]){i=this.tileInfo_.lods[k].resolution}else{var h=Math.pow(2,j-this.maxResolution());i=this.tileInfo_.lods[this.tileInfo_.lods.length-1].resolution/h}return i};M.prototype.getScale=function(j){var k=j-this.zoomOffset_;var i=0;if(this.tileInfo_.lods[k]){i=this.tileInfo_.lods[k].scale}else{var h=Math.pow(2,j-this.maxResolution());i=this.tileInfo_.lods[this.tileInfo_.lods.length-1].scale/h}return i};M.prototype.fromPixelToLatLng=function(i,k,l){if(i==null){return null}var n=k-this.zoomOffset_;var j=this.getResolution_(k);var h=i.x*j+this.tileInfo_.origin.x;var o=this.tileInfo_.origin.y-i.y*j;var m=this.spatialReference_.fromCoordsToLatLng([h,o]);return new GLatLng(m[1],m[0])};M.prototype.tileCheckRange=function(m,p,l){var o=p-this.zoomOffset_;if(this.tileInfo_.lods[o]){var n=this.fullExtent_;if(!n){return true}var k=m.x*l*this.tileInfo_.lods[o].resolution+this.tileInfo_.origin.x;var j=this.tileInfo_.origin.y-(m.y+1)*l*this.tileInfo_.lods[o].resolution;var i=(m.x+1)*l*this.tileInfo_.lods[o].resolution+this.tileInfo_.origin.x;var h=this.tileInfo_.origin.y-m.y*l*this.tileInfo_.lods[o].resolution;return !(n.xmin>i||n.xmax<k||n.ymax<j||n.ymin>h)}else{return false}};M.prototype.getWrapWidth=function(h){var i=h-this.zoomOffset_;if(this.tileInfo_.lods[i]){return this.spatialReference_.getWrapWidth()/this.tileInfo_.lods[i].resolution}else{return Number.MAX_VALUE}};M.prototype.getTileSize=function(){return this.tileInfo_.rows};M.prototype.minResolution=function(){return this.zoomOffset_};M.prototype.maxResolution=function(){return this.zoomOffset_+this.tileInfo_.lods.length-1};M.prototype.getSpatialReference=function(){return this.spatialReference_};function Z(k,j){j=j||{};this.mapService_=(k instanceof F)?k:new F(k);if(j.name){this.mapService_.name=j.name}if(j.hosts){var n=N(this.mapService_.url,"","://");var o=N(this.mapService_.url,"://","/");var p=N(this.mapService_.url,n+"://"+o,"");this.urlTemplate_=n+"://"+j.hosts+p;this.numOfHosts_=parseInt(N(j.hosts,"[","]"))}if(this.mapService_.hasLoaded()){this.init_(j)}else{var l=this;GEvent.addListener(this.mapService_,"load",function(){l.init_(j)});var h=j.copyrights;this.projection_=j.projection;var i=j.minResolution||(this.projection_?this.projection_.minResolution():0);var m=j.maxResolution||(this.projection_?this.projection_.maxResolution():19);GTileLayer.call(this,h,i,m,j)}}Z.prototype=new GTileLayer();Z.prototype.init_=function(i){this.projection_=new M(this.mapService_.tileInfo,this.mapService_.fullExtent);var k=i.copyrights;if(!k){k=new GCopyrightCollection("");k.addCopyright(new GCopyright(1,U.fromExtentToGLatLngBounds(this.mapService_.fullExtent),this.projection_.zoomOffset_,this.mapService_.copyrightText))}var j=i.minResolution||this.projection_.minResolution();var h=i.maxResolution||this.projection_.maxResolution();if(i.tileUrlTemplate){delete i.tileUrlTemplate}GTileLayer.call(this,k,j,h,i);GEvent.trigger(this,"load")};Z.prototype.getMapService=function(){return this.mapService_};Z.prototype.getFullBounds=function(){this.fullBounds_=this.fullBounds_||U.fromExtentToGLatLngBounds(this.mapService_.fullExtent);return this.fullBounds_};Z.prototype.getInitialBounds=function(){this.initialBounds_=this.initialBounds_||U.fromExtentToGLatLngBounds(this.mapService_.initialExtent);return this.initialBounds_};Z.prototype.getName=function(){return this.mapService_.name};Z.prototype.getProjection=function(){return this.projection_};Z.prototype.getTileUrl=function(j,i){var k=i-(this.projection_?this.projection_.minResolution():this.minResolution());if(!isNaN(j.x)&&!isNaN(j.y)&&k>=0){var h=this.mapService_.url;if(this.urlTemplate_){h=this.urlTemplate_.replace("["+this.numOfHosts_+"]",""+((j.y+j.x)%this.numOfHosts_))}return h+"/tile/"+k+"/"+j.y+"/"+j.x}return""};Z.prototype.hasLoaded=function(){return this.mapService_.hasLoaded()};function I(p,o){var m=this;o=o||{};var n=p;if(T(p)){n=[new Z(p)]}else{if(p instanceof Z){n=[p]}}var k=0;for(var l=0;l<n.length;l++){var h=n[l].getMapService();if(h.hasLoaded()===false){GEvent.addListener(h,"load",function(){k++;if(k==n.length){m.init_(n,o)}})}else{k++}}if(k==n.length){this.init_(n,o)}else{var j=null;if(o.projection){j=o.projection;for(var l=0;l<n.length;l++){if(!n[l].projection_){n[l].projection_=j}}}else{j=n[0].projection_}if(j){o.tileSize=j.getTileSize()}GMapType.call(this,n,j||new GMercatorProjection(20),o.name||n[0].getMapService().name,o)}}I.prototype=new GMapType();I.prototype.init_=function(j,i){i.tileSize=j[0].getProjection().getTileSize();var h=i.name||j[0].getMapService().name;GMapType.call(this,j,j[0].getProjection(),h,i);GEvent.trigger(this,"load")};function f(i,h){h=h||{};this.mapService_=(i instanceof F)?i:new F(i);if(h.name){this.mapService_.name=h.name}this.minZoom_=h.minResolution;this.maxZoom_=h.maxResolution;if(this.mapService_.hasLoaded()){this.init_(h)}else{var j=this;GEvent.addListener(this.mapService_,"load",function(){j.init_(h)})}}f.prototype=new GOverlay();f.prototype.init_=function(h){this.opacity_=h.opacity||1;this.exportParams_=h.exportParams||{};this.drawing_=false;this.redraw_=false;if(this.img_==null){this.refresh()}if(this.map_!=null){this.setupMapType_()}GEvent.trigger(this,"load")};f.prototype.setupMapType_=function(k){if(k){k.agsOvs_=k.agsOvs_||[];if(B(k.agsOvs_,this)==-1){k.agsOvs_.push(this)}}else{var j=this.map_.getMapTypes();for(var h=0;h<j.length;h++){k=j[h];k.agsOvs_=k.agsOvs_||[];if(B(k.agsOvs_,this)==-1){k.agsOvs_.push(this)}}}};f.prototype.getMapService=function(){return this.mapService_};f.prototype.getFullBounds=function(){this.fullBounds_=this.fullBounds_||U.fromExtentToGLatLngBounds(this.mapService_.fullExtent);return this.fullBounds_};f.prototype.getInitialBounds=function(){this.initialBounds_=this.initialBounds_||U.fromExtentToGLatLngBounds(this.mapService_.initialExtent);return this.initialBounds_};f.prototype.getName=function(){return this.mapService_.name};f.prototype.setOpacity=function(j){var k=Math.min(Math.max(j,0),1);this.opacity_=k;var h=this.img_;if(!h){return }var i=h.style;if(typeof i.opacity!=="undefined"){i.opacity=k}if(typeof i.filters!=="undefined"){i.filters.alpha.opacity=Math.floor(100*k)}if(typeof i.filter!=="undefined"){i.filter="alpha(opacity:"+Math.floor(k*100)+")"}};f.prototype.getOpacity=function(){return this.opacity_};f.prototype.hasLoaded=function(){return this.mapService_.hasLoaded()};f.prototype.refresh=function(){if(!this.mapService_.hasLoaded()||this.map_==null){return }if(this.drawing_===true){this.redraw_=true;return }if(this.img_!=null){this.div_.removeChild(this.img_);this.img_=null}if(this.isHidden()){return }var k=this.map_.getBounds();var h=this.map_.getCurrentMapType().getProjection().getSpatialReference();var i=this;var j=this.exportParams_;j.size=""+this.map_.getSize().width+","+this.map_.getSize().height;j.bbox=U.fromGLatLngBoundsToExtent(k,h);j.bboxSR=h.wkid;j.imageSR=h.wkid;this.drawing_=true;GEvent.trigger(this,"drawstart");this.mapService_.exportMap(j,function(m){i.drawing_=false;if(i.redraw_===true){i.redraw_=false;i.refresh();return }if(m.href){var r=i.div_;var l=document.createElement("img");var q=U.fromExtentToGLatLngBounds(m.extent);var n=i.map_.getCurrentMapType().getProjection().getWrapWidth(i.map_.getZoom());var p=i.map_.fromLatLngToDivPixel(q.getSouthWest());var o=i.map_.fromLatLngToDivPixel(q.getNorthEast());r.style.width=m.width+"px";r.style.height=m.height+"px";r.style.left=p.x%n+"px";r.style.top=o.y+"px";l.src=m.href;r.appendChild(l);i.img_=l;i.setOpacity(i.opacity_)}GEvent.trigger(i,"drawend",m)})};f.prototype.initialize=function(h){var i=document.createElement("div");i.style.position="absolute";h.getPane(G_MAP_OVERLAY_LAYER_PANE).appendChild(i);this.map_=h;this.zoomLevel_=h.getZoom();this.div_=i;this.img_=null;this.moveEndListener_=GEvent.bind(this.map_,"moveend",this,this.refresh);this.mapTypeChangeListener_=GEvent.bind(this.map_,"maptypechanged",this,this.refresh);this.mapTypeAddListener_=GEvent.bind(this.map_,"addmaptype",this,this.setupMapType_);this.map_.getArcGISServiceOverlays().push(this);if(this.hasLoaded()){this.setupMapType_()}this.show()};f.prototype.remove=function(){GEvent.removeListener(this.moveEndListener_);GEvent.removeListener(this.mapTypeChangeListener_);this.div_.parentNode.removeChild(this.div_);R(this.map_.getArcGISServiceOverlays(),this);var j=this.map_.getMapTypes();for(var h=0;h<j.length;h++){var k=j[h];if(k.agsOvs_){R(k.agsOvs_,this)}}};f.prototype.getCopyright=function(i,h){if(!this.isHidden()&&this.getFullBounds().intersects(i)&&this.isInZoomRange_()){return this.mapService_.copyrightText}};f.prototype.copy=function(){return new f(this.url)};f.prototype.isHidden=function(){return !(this.visible_&&this.isInZoomRange_()&&this.getFullBounds().intersects(this.map_.getBounds()))};f.prototype.isInZoomRange_=function(){var h=this.map_.getZoom();if(this.minZoom_!=undefined&&h<this.minZoom_){return false}if(this.maxZoom_!=undefined&&h>this.maxZoom_){return false}return true};f.prototype.show=function(){this.visible_=true;this.div_.style.visibility="visible";this.refresh()};f.prototype.hide=function(){this.visible_=false;this.div_.style.visibility="hidden"};f.prototype.redraw=function(h){};function b(l,i){var k=this;i=i||{};var j=l;if(T(l)){j=new Z(l)}var h=j.getMapService();if(h.hasLoaded()===false){GEvent.addListener(h,"load",function(){k.init_(j,i)})}else{this.init_(j,i)}GTileLayerOverlay.call(this,j,i)}b.prototype=new GTileLayerOverlay();b.prototype.init_=function(i,h){GTileLayerOverlay.call(this,i,h);GEvent.trigger(this,"load");if(this.map_){this.refresh()}};b.prototype.initialize=function(h){this.map_=h;h.getArcGISServiceOverlays().push(this);GTileLayerOverlay.prototype.initialize.call(this,h);this.mapTypeChangeHide_=false;this.mapTypeChangeListener_=GEvent.bind(this.map_,"maptypechanged",this,this.onMapTypeChanged_)};b.prototype.onMapTypeChanged_=function(){var h=this.getTileLayer().getProjection().getSpatialReference().wkid;var i=this.map_.getCurrentMapType().getProjection().getSpatialReference().wkid;if(h!=i){this.mapTypeChangeHide_=true;this.hide()}else{if(this.mapTypeChangeHide_==true){this.show();this.mapTypeChangeHide_=false}}};b.prototype.remove=function(){R(this.map_.getArcGISServiceOverlays(),this);GEvent.removeListener(this.mapTypeChangeListener_);GTileLayerOverlay.prototype.remove.call(this)};b.prototype.getName=function(){return this.getTileLayer().getName()};GMercatorProjection.prototype.getSpatialReference=function(){return D.getSpatialReference("102113")};GMapType.prototype.getCopyrights=function(l,k){var n=[];var h=this.getTileLayers();for(var j=0;j<h.length;j++){var m=h[j].getCopyright(l,k);if(m){n.push(m)}}if(this.agsOvs_){for(var j=0;j<this.agsOvs_.length;j++){var m=this.agsOvs_[j].getCopyright(l,k);if(m&&B(n,m,true)==-1){n.push(m)}}}return n};GMap2.prototype.setBounds=function(j){var h=j.getCenter();var i=this.getBoundsZoomLevel(j)+1;this.setCenter(h,i)};GMap2.prototype.getSpatialReference=function(){return this.getCurrentMapType().getProjection().getSpatialReference()};GMap2.prototype.getArcGISServiceOverlays=function(){if(!this.agsOvs_){this.agsOvs_=[]}return this.agsOvs_};GMap2.prototype.getArcGISResults=function(){if(!this.agsResults_){this.agsResults_=[]}return this.agsResults_};GMap2.prototype.clearArcGISResults=function(){if(this.agsResults_){for(var h=0,j=this.agsResults_.length;h<j;h++){GEvent.clearInstanceListeners(this.agsResults_[h]);this.removeOverlay(this.agsResults_[h]);delete this.agsResults_[h]}}this.agsResults_=[]};GMap2.prototype.removeOverlays=function(j){if(Q(j)){for(var h=0,k=j.length;h<k;h++){this.removeOverlays(j[h])}}else{if(j){this.removeOverlay(j)}}};GMap2.prototype.addOverlays=function(j){if(Q(j)){for(var h=0,k=j.length;h<k;h++){this.addOverlays(j[h])}}else{if(j){this.addOverlay(j)}}};GMap2.prototype.addArcGISMap=function(j,i){var k=this;var h=new F(j,function(){if(h.singleFusedMapCache){var n=new Z(h);var m=new I([n]);k.addMapType(m);if(i){i(m)}}else{var l=new f(h);k.addOverlay(l);if(i){i(l)}}})};GMap2.prototype.enableArcGISClick=function(){if(this.agsClickListener_==null){this.agsClickListener_=GEvent.addListener(this,"click",this.doArcGISIdentify_)}};GMap2.prototype.arcgisClickEnabled=function(){return this.agsClickListener_!=null};GMap2.prototype.disableArcGISClick=function(){if(this.agsClickListener_!=null){GEvent.removeListener(this.agsClickListener_);this.agsClickListener_=null}};GMap2.prototype.setArcGISClickOptions=function(h){this.agsClickOpts_=h||{}};GMap2.prototype.doArcGISIdentify_=function(n,j,k){var q=this;var h=this.agsClickOpts_||{};var t;var r;var m=96;function p(AD,AH){var AC="";if(AH.results){for(var AB=0,AE=AH.results.length;AB<AE;AB++){var u=AH.results[AB];if(AB>0){AC+="<hr/>"}AC+="<div><table>";AC+='<tr><td class="ags-layername">'+u.layerName+"</td></tr>";AC+="<tr><td><table>";var AG=u.attributes;var AI=true;for(x in AG){if(AG.hasOwnProperty(x)){AI=!AI;AC+='<tr class="ags-row-'+(AI?"odd":"even")+'">';AC+='<td class="ags-fieldname">'+x+"</td>";var z=""+AG[x];if(z.toLowerCase()=="null"){z=""}AC+='<td class="ags-fieldvalue">'+z+"</td></tr>"}}AC+="</table></td></tr></table></div>";if(u.geometry){var w=U.getOptionValue(c.defaultStyle,h,"style",AD.name,u.layerName);var v=U.fromFeatureToGOverlays(u,null,w);for(var AA=0;AA<v.length;AA++){v[AA].html=AC;q.agsResults_.push(v[AA]);q.addOverlay(v[AA])}}}}else{if(AH.error){AC='<div class="ags-error">error code: '+AH.error.code+" <br/>message:"+AH.error.message+"<br/>details:"+AH.error.details.join(";")+"</div>"}}if(AC.length>0){var AF=q.getInfoWindow().getTabs();var y=new GInfoWindowTab(AD.name,'<div class="ags-infowindow">'+AC+"</div>");AF.push(y);q.openInfoWindowTabsHtml(j,AF)}}function l(z){var u=q.agsSessionID_;var i=z.getSpatialReference();var y=q.getBounds();var v=U.fromGLatLngBoundsToExtent(y,i);var AC=q.getSize();var AB=U.fromGLatLngToPoint(j,i);var AA={geometry:""+AB.x+","+AB.y,geometryType:ESRI_GEOMETRY_POINT,sr:i.wkid,layers:h.layers||"top",tolerance:h.tolerance||5,mapExtent:v,imageDisplay:""+AC.width+","+AC.height+","+m,returnGeometry:h.returnGeometry===true};var w=AA;if(h.serviceOptions&&h.serviceOptions[z.name]){w=X(h.serviceOptions[z.name],AA,true)}z.identify(w,function(AD){if(u==q.agsSessionID_){p(z,AD)}else{}})}function s(){var z=null;var u=[];var w=q.getArcGISServiceOverlays();for(var v=0;v<w.length;v++){if(!w[v].isHidden()){if(w[v] instanceof f){if(w[v].getFullBounds().containsLatLng(j)){u.push(w[v].getMapService())}}else{if(w[v] instanceof b){var y=w[v].getTileLayer();if(y.getFullBounds().containsLatLng(j)){u.push(y.getMapService())}}}}}var AB=q.getCurrentMapType();if(AB instanceof I){var AA=AB.getTileLayers();for(var v=0;v<AA.length;v++){var y=AA[v];if(v==0){m=y.getMapService().tileInfo.dpi}if(y.getFullBounds().containsLatLng(j)){u.push(y.getMapService())}}}return u}if(n==null){if(j==null){return }this.getInfoWindow().getTabs().length=0;this.clearArcGISResults();this.agsSessionID_=Math.floor(Math.random()*100000);t=s();for(var o=0;o<t.length;o++){l(t[o])}}else{if(k==null){return }if(n.html){this.openInfoWindowHtml(k,'<div class="ags-infowindow">'+n.html+"</div>")}}};U.fromExtentToGLatLngBounds=function(j){var i=D.getSpatialReference(j.spatialReference.wkid);if(i==null){i=E}var h=i.fromCoordsToLatLng([j.xmin,j.ymin]);var k=i.fromCoordsToLatLng([j.xmax,j.ymax]);return new GLatLngBounds(new GLatLng(h[1],h[0]),new GLatLng(k[1],k[0]))};U.fromGLatLngBoundsToExtent=function(k,i){var h=i.fromLatLngToCoords([k.getSouthWest().lng(),k.getSouthWest().lat()]);var j=i.fromLatLngToCoords([k.getNorthEast().lng(),k.getNorthEast().lat()]);return{xmin:h[0],ymin:h[1],xmax:j[0],ymax:j[1],spatialReference:{wkid:i.wkid}}};U.fromPointToGLatLng=function(h,k){var i=h.spatialReference||k;var j=i?D.getSpatialReference(i.wkid):E;if(j==null){j=E}if(isNaN(h.x)||isNaN(h.y)){return null}var l=j.fromCoordsToLatLng([h.x,h.y]);return new GLatLng(l[1],l[0])};U.fromGLatLngToPoint=function(k,i){var h=null;if(i){h=(i instanceof S)?i:D.getSpatialReference(i.wkid)}h=h||E;var j=h.fromLatLngToCoords([k.lng(),k.lat()]);return{x:j[0],y:j[1],spatialReference:{wkid:h.wkid}}};U.fromFeatureToGOverlays=function(z,v,s){var k=[];var h=null;var o;var w=z.geometry;if(v){if(v instanceof S){h=v}else{h=D.getSpatialReference(v.wkid)}}else{h=D.getSpatialReference(w.spatialReference.wkid)}if(h==null){return k}var l=s||c.style;var t,n,r,y,q,m,p,u,o;if(w.x){p=h.fromCoordsToLatLng([w.x,w.y]);o=new GMarker(new GLatLng(p[1],p[0]),{icon:l.icon});o.attributes=z.attributes;k.push(o)}else{q=w.points||w.paths||w.rings;if(!q){return k}for(t=0,n=q.length;t<n;t++){m=q[t];if(w.points){p=h.fromCoordsToLatLng(m);o=new GMarker(new GLatLng(p[1],p[0]),{icon:l.icon})}else{if(m.length>c.maxPolyPoints){continue}u=[];for(r=0,y=m.length;r<y;r++){p=h.fromCoordsToLatLng(m[r]);u.push(new GLatLng(p[1],p[0]))}if(w.paths){o=new GPolyline(u,l.strokeColor,l.strokeWeight,l.strokeOpacity)}else{if(w.rings){o=new GPolygon(u,l.outlineColor,l.outlineWeight,l.outlineOpacity,l.fillColor,l.fillOpacity)}}}o.attributes=z.attributes;k.push(o)}}return k};V({ArcGISProjection:M,ArcGISTileLayer:Z,ArcGISTileLayerOverlay:b,ArcGISMapOverlay:f,ArcGISMapType:I,ArcGISUtil:U})}})();