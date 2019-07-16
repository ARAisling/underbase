!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.migrator=e():t.migrator=e()}(global,function(){return function(t){var e={};function i(o){if(e[o])return e[o].exports;var n=e[o]={i:o,l:!1,exports:{}};return t[o].call(n.exports,n,n.exports,i),n.l=!0,n.exports}return i.m=t,i.c=e,i.d=function(t,e,o){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(i.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)i.d(o,n,function(e){return t[e]}.bind(null,n));return o},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=0)}([function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const o=i(1);e.Migration=o.Migration;const n=new o.Migration;e.migrator=n},function(t,e,i){"use strict";var o=this&&this.__awaiter||function(t,e,i,o){return new(i||(i=Promise))(function(n,r){function s(t){try{l(o.next(t))}catch(t){r(t)}}function c(t){try{l(o.throw(t))}catch(t){r(t)}}function l(t){t.done?n(t.value):new i(function(e){e(t.value)}).then(s,c)}l((o=o.apply(t,e||[])).next())})};Object.defineProperty(e,"__esModule",{value:!0});const n=i(2),r=i(3),s=i(4),c=i(5),l=i(6),u=i(9),d=c.typeCheck;e.Migration=class{constructor(t){this.defaultMigration={version:0,up:()=>{}},this._list=[this.defaultMigration],this.options=t||{logs:!0,logger:null,logIfLatest:!0,collectionName:"migrations",db:null}}getConfig(){return this.options}getMigrations(){return this._list}isLocked(){return o(this,void 0,void 0,function*(){return null!==(yield this._collection.findOne({_id:"control",locked:!0}))})}config(t){return o(this,void 0,void 0,function*(){if(this.options=Object.assign({},this.options,t),!this.options.logger&&this.options.logs&&(this.options.logger=l.logger),!1===this.options.logs&&(this.options.logger=(t,...e)=>{}),!(this._db instanceof s.Db||this.options.db))throw new ReferenceError("Option.db canno't be null");let e;e="string"==typeof this.options.db?(yield s.MongoClient.connect(this.options.db,{promiseLibrary:n.Promise,useNewUrlParser:!0})).db():this.options.db,this._collection=e.collection(this.options.collectionName),this._db=e})}add(t){if("function"!=typeof t.up)throw new Error("Migration must supply an up function.");if("function"!=typeof t.down)throw new Error("Migration must supply a down function.");if("number"!=typeof t.version)throw new Error("Migration must supply a version number.");if(t.version<=0)throw new Error("Migration version must be greater than 0");Object.freeze(t),this._list.push(t),this._list=r.sortBy(this._list,t=>t.version)}migrateTo(t){return o(this,void 0,void 0,function*(){if(!this._db)throw new Error("Migration instance has not be configured/initialized. Call <instance>.config(..) to initialize this instance");if(r.isUndefined(t)||""===t||0===this.getMigrations().length)throw new Error("Cannot migrate using invalid command: "+t);let e,i;"number"==typeof t?e=t:(e=t.split(",")[0],i=t.split(",")[1]);try{"latest"===e?yield this.execute(r.last(this.getMigrations()).version):yield this.execute(parseFloat(e),"rerun"===i)}catch(t){throw this.options.logger("info","Encountered an error while migrating. Migration failed."),t}})}getNumberOfMigrations(){return this.getMigrations().length-1}getVersion(){return o(this,void 0,void 0,function*(){return(yield this.getControl()).version})}unlock(){return o(this,void 0,void 0,function*(){yield this._collection.updateOne({_id:"control"},{$set:{locked:!1}})})}reset(){return o(this,void 0,void 0,function*(){this._list=[this.defaultMigration],yield this._collection.deleteMany({})})}execute(t,e){return o(this,void 0,void 0,function*(){const i=this;let n=(yield this.getControl()).version;const r=(t,e)=>o(this,void 0,void 0,function*(){const n=i.getMigrations()[e];if("function"!=typeof n[t])throw yield s(),new Error("Cannot migrate "+t+" on version "+n.version);this.options.logger("info","Running "+t+"() on version "+n.version),n.describe&&this.options.logger(n.describe),"AsyncFunction"!==n[t].constructor.name&&"Promise"!==n[t].constructor.name&&this.options.logger("warning",`One of the ${t} functions is nor Async or Promise`,`(${n.describe||"not described"})`);const r={MongoClient:this._db,Migrate:e=>o(this,void 0,void 0,function*(){for(const i in e)if(e.hasOwnProperty(i)){"AsyncFunction"!==e[i][t].constructor.name&&"Promise"!==e[i][t].constructor.name&&this.options.logger("warning",`One of the ${t} functions is nor Async or Promise`,`(${e[i].describe||"not described"})`),e[i].describe&&this.options.logger(e[i].describe);try{yield e[i][t](r)}catch(t){throw new Error(t)}}}),Query:new u.QueryInterface(i._db),Logger:this.options.logger};try{yield n[t](r)}catch(t){throw new Error(t)}}),s=()=>i.setControl({locked:!1,version:n}),c=()=>o(this,void 0,void 0,function*(){return yield i.setControl({locked:!0,version:n})});if(!1===(yield(()=>o(this,void 0,void 0,function*(){const t=yield i._collection.findOneAndUpdate({_id:"control",locked:!1},{$set:{locked:!0,lockedAt:new Date}});return null!=t.value&&1===t.ok}))()))return void this.options.logger("info","Not migrating, control is locked.");if(e)return this.options.logger("info","Rerunning version "+t),yield r("up",this.findIndexByVersion(t)),this.options.logger("info","Finished migrating."),void(yield s());if(n===t)return this.options.logIfLatest&&this.options.logger("info","Not migrating, already at version "+t),void(yield s());const l=this.findIndexByVersion(n),d=this.findIndexByVersion(t);if(this.options.logger("info","Migrating from version "+this.getMigrations()[l].version+" -> "+this.getMigrations()[d].version),n<t)for(let e=l;e<d;e++)try{yield r("up",e+1),n=i.getMigrations()[e+1].version,yield c()}catch(e){throw this.options.logger("error",`Encountered an error while migrating from ${n} to ${t}`),e}else for(let e=l;e>d;e--)try{yield r("down",e),n=i.getMigrations()[e-1].version,yield c()}catch(e){throw this.options.logger("error",`Encountered an error while migrating from ${n} to ${t}`),e}yield s(),this.options.logger("info","Finished migrating.")})}getControl(){return o(this,void 0,void 0,function*(){return(yield this._collection.findOne({_id:"control"}))||(yield this.setControl({version:0,locked:!1}))})}setControl(t){return o(this,void 0,void 0,function*(){d("Number",t.version),d("Boolean",t.locked);const e=yield this._collection.updateOne({_id:"control"},{$set:{version:t.version,locked:t.locked}},{upsert:!0});return e&&e.result.ok?t:null})}findIndexByVersion(t){for(let e=0;e<this.getMigrations().length;e++)if(this.getMigrations()[e].version===t)return e;throw new Error("Can't find migration version "+t)}}},function(t,e){t.exports=require("bluebird")},function(t,e){t.exports=require("lodash")},function(t,e){t.exports=require("mongodb")},function(t,e){t.exports=require("type-check")},function(t,e,i){"use strict";(function(t){var o,n=this&&this.__awaiter||function(t,e,i,o){return new(i||(i=Promise))(function(n,r){function s(t){try{l(o.next(t))}catch(t){r(t)}}function c(t){try{l(o.throw(t))}catch(t){r(t)}}function l(t){t.done?n(t.value):new i(function(e){e(t.value)}).then(s,c)}l((o=o.apply(t,e||[])).next())})};Object.defineProperty(e,"__esModule",{value:!0});const r=i(0);e.initMigrator=t=>n(this,void 0,void 0,function*(){return e.logger("info","Connecting to MongoDB..."),yield r.migrator.config(t),r.migrator}),e.logger=(t,...e)=>{e[0]?console.log(`[${t.toUpperCase()}]`,...e):console.log(t)},e.timer=()=>{const t=(new Date).getTime();return{spent:()=>((new Date).getTime()-t)/1e3}},e.exit=(t=0)=>{process.exit()},e.importFile=e=>n(this,void 0,void 0,function*(){o=i(8)(t);try{return(yield o(e)).default}catch(t){throw new Error(t)}})}).call(this,i(7)(t))},function(t,e){t.exports=function(t){return t.webpackPolyfill||(t.deprecate=function(){},t.paths=[],t.children||(t.children=[]),Object.defineProperty(t,"loaded",{enumerable:!0,get:function(){return t.l}}),Object.defineProperty(t,"id",{enumerable:!0,get:function(){return t.i}}),t.webpackPolyfill=1),t}},function(t,e){t.exports=require("esm")},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const o=i(10);e.QueryInterface=class{constructor(t){this.collection=t=>(this._collection=this._db.collection(t),new o.MongoCollection(t,this._collection,this._db)),this._db=t}}},function(t,e,i){"use strict";var o=this&&this.__awaiter||function(t,e,i,o){return new(i||(i=Promise))(function(n,r){function s(t){try{l(o.next(t))}catch(t){r(t)}}function c(t){try{l(o.throw(t))}catch(t){r(t)}}function l(t){t.done?n(t.value):new i(function(e){e(t.value)}).then(s,c)}l((o=o.apply(t,e||[])).next())})};Object.defineProperty(e,"__esModule",{value:!0});e.MongoCollection=class{constructor(t,e,i){this.rename=(t,e)=>{const i={};return i[t]=e,this._updateQuery={$rename:i},{where:this.where}},this.unset=t=>{const e={};if("string"==typeof t)e[t]=1;else{if(!Array.isArray(t))throw new Error("Field name in .unset() must of type string or array.");for(const i of t)e[i]=1}return this._updateQuery={$unset:e},{where:this.where}},this.set=(t,e)=>{const i={};return i[t]=e,this._updateQuery={$set:i||{}},{where:this.where}},this.drop=()=>o(this,void 0,void 0,function*(){return yield this._db.dropCollection(this._collectionName)}),this.count=(t={})=>o(this,void 0,void 0,function*(){return this._whereQuery=t,yield this._collection.find(this._whereQuery,{}).count()}),this.where=(t={})=>o(this,void 0,void 0,function*(){return this._whereQuery=t,yield this.execute()}),this.reset=()=>{this._updateQuery={},this._whereQuery={},this.cursorOptions={cursor:{batchSize:500},allowDiskUse:!0}},this.execute=()=>o(this,void 0,void 0,function*(){return yield this.cursor(this._whereQuery,t=>{this._collection.updateOne({_id:t._id},this._updateQuery)})}),this.cursor=(t,e)=>o(this,void 0,void 0,function*(){return new Promise((i,n)=>o(this,void 0,void 0,function*(){const o=yield this._collection.aggregate([{$match:t||{}}],this.cursorOptions,null);o.on("data",t=>e(t)),o.on("close",()=>n("MongoDB closed the connection")),o.on("end",()=>i())}))}),this._db=i,this._collectionName=t,this._collection=e,this._updateQuery={},this._whereQuery={},this.cursorOptions={cursor:{batchSize:500},allowDiskUse:!0}}}}])});