"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[4242],{1888:function(e,t,n){var r=n(2739),o=n(1376),s=n(4354),i=n(9039),c=n(4598),a=n(720),u=n(7975),h=n(5469),l=n(5265),d=n(5528),w=n(1291),p=n(4894),f=n(6166),_=n(5783),v=n(2010),Z=n(1372);class m extends w.Z{constructor(){super({handleDownEvent:x,handleDragEvent:g,handleMoveEvent:y,handleUpEvent:C}),this.coordinate_=null,this.cursor_="pointer",this.feature_=null,this.previousCursor_=void 0}}function x(e){const t=e.map.forEachFeatureAtPixel(e.pixel,(function(e){return e}));return t&&(this.coordinate_=e.coordinate,this.feature_=t),!!t}function g(e){const t=e.coordinate[0]-this.coordinate_[0],n=e.coordinate[1]-this.coordinate_[1];this.feature_.getGeometry().translate(t,n),this.coordinate_[0]=e.coordinate[0],this.coordinate_[1]=e.coordinate[1]}function y(e){if(this.cursor_){const t=e.map.forEachFeatureAtPixel(e.pixel,(function(e){return e})),n=e.map.getTargetElement();t?n.style.cursor!=this.cursor_&&(this.previousCursor_=n.style.cursor,n.style.cursor=this.cursor_):void 0!==this.previousCursor_&&(n.style.cursor=this.previousCursor_,this.previousCursor_=void 0)}}function C(){return this.coordinate_=null,this.feature_=null,!1}const b=new r.Z(new h.Z([0,0])),k=new r.Z(new l.Z([[-1e7,1e6],[-1e6,3e6]])),E=new r.Z(new d.ZP([[[-3e6,-1e6],[-3e6,1e6],[-1e6,1e6],[-1e6,-1e6],[-3e6,-1e6]]]));new o.Z({interactions:(0,p.ce)().extend([new m]),layers:[new v.Z({source:new f.Z({url:"https://a.tiles.mapbox.com/v4/aj.1x1-degrees.json?secure&access_token=pk.eyJ1IjoiYWhvY2V2YXIiLCJhIjoiY2t0cGdwMHVnMGdlbzMxbDhwazBic2xrNSJ9.WbcTL9uj8JPAsnT9mgb7oQ"})}),new Z.Z({source:new _.Z({features:[b,k,E]}),style:new i.ZP({image:new c.Z({anchor:[.5,46],anchorXUnits:"fraction",anchorYUnits:"pixels",opacity:.95,src:"data/icon.png"}),stroke:new a.Z({width:3,color:[255,0,0,1]}),fill:new u.Z({color:[0,0,255,.6]})})})],target:"map",view:new s.ZP({center:[0,0],zoom:2})})}},function(e){var t=function(t){return e(e.s=t)};t(9877),t(1888)}]);
//# sourceMappingURL=custom-interactions.js.map