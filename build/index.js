!function(t,o){"object"==typeof exports&&"object"==typeof module?module.exports=o():"function"==typeof define&&define.amd?define([],o):"object"==typeof exports?exports.migrator=o():t.migrator=o()}(global,function(){return function(t){var o={};function e(n){if(o[n])return o[n].exports;var i=o[n]={i:n,l:!1,exports:{}};return t[n].call(i.exports,i,i.exports,e),i.l=!0,i.exports}return e.m=t,e.c=o,e.d=function(t,o,n){e.o(t,o)||Object.defineProperty(t,o,{enumerable:!0,get:n})},e.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},e.t=function(t,o){if(1&o&&(t=e(t)),8&o)return t;if(4&o&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(e.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&o&&"string"!=typeof t)for(var i in t)e.d(n,i,function(o){return t[o]}.bind(null,i));return n},e.n=function(t){var o=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(o,"a",o),o},e.o=function(t,o){return Object.prototype.hasOwnProperty.call(t,o)},e.p="",e(e.s=0)}([function(t,o,e){"use strict";Object.defineProperty(o,"__esModule",{value:!0});const n=e(2);o.Migration=n.Migration;const i=new n.Migration;o.migrator=i,process.env.MIGRATE&&i.migrateTo(process.env.MIGRATE)},function(t,o,e){"use strict";var n=this&&this.__awaiter||function(t,o,e,n){return new(e||(e=Promise))(function(i,r){function s(t){try{l(n.next(t))}catch(t){r(t)}}function c(t){try{l(n.throw(t))}catch(t){r(t)}}function l(t){t.done?i(t.value):new e(function(o){o(t.value)}).then(s,c)}l((n=n.apply(t,o||[])).next())})};Object.defineProperty(o,"__esModule",{value:!0});const i=e(0);o.initMigrator=t=>n(this,void 0,void 0,function*(){return o.logger("info","Connecting to MongoDB..."),yield i.migrator.config(t),i.migrator}),o.logger=(t,...o)=>{o[0]?console.log(`[${t.toUpperCase()}]`,...o):console.log(t)},o.timer=()=>{const t=(new Date).getTime();return{spent:()=>((new Date).getTime()-t)/1e3}},o.exit=()=>{process.exit()}},function(t,o,e){"use strict";var n=this&&this.__awaiter||function(t,o,e,n){return new(e||(e=Promise))(function(i,r){function s(t){try{l(n.next(t))}catch(t){r(t)}}function c(t){try{l(n.throw(t))}catch(t){r(t)}}function l(t){t.done?i(t.value):new e(function(o){o(t.value)}).then(s,c)}l((n=n.apply(t,o||[])).next())})};Object.defineProperty(o,"__esModule",{value:!0});const i=e(3),r=e(4),s=e(5),c=e(6),l=e(1),u=e(7),d=c.typeCheck;o.Migration=class{constructor(t){this.defaultMigration={version:0,up:()=>{}},this._list=[this.defaultMigration],this.options=t||{logs:!0,logger:null,logIfLatest:!0,collectionName:"migrations",db:null}}getConfig(){return this.options}getMigrations(){return this._list}isLocked(){return n(this,void 0,void 0,function*(){return null!==(yield this._collection.findOne({_id:"control",locked:!0}))})}config(t){return n(this,void 0,void 0,function*(){if(this.options=Object.assign({},this.options,t),!this.options.logger&&this.options.logs&&(this.options.logger=l.logger),!1===this.options.logs&&(this.options.logger=(t,...o)=>{}),!(this._db instanceof s.Db||this.options.db))throw new ReferenceError("Option.db canno't be null");let o;o="string"==typeof this.options.db?(yield s.MongoClient.connect(this.options.db,{promiseLibrary:i.Promise,useNewUrlParser:!0})).db():this.options.db,this._collection=o.collection(this.options.collectionName),this._db=o})}add(t){if("function"!=typeof t.up)throw new Error("Migration must supply an up function.");if("function"!=typeof t.down)throw new Error("Migration must supply a down function.");if("number"!=typeof t.version)throw new Error("Migration must supply a version number.");if(t.version<=0)throw new Error("Migration version must be greater than 0");Object.freeze(t),this._list.push(t),this._list=r.sortBy(this._list,t=>t.version)}migrateTo(t){return n(this,void 0,void 0,function*(){if(!this._db)throw new Error("Migration instance has not be configured/initialized. Call <instance>.config(..) to initialize this instance");if(r.isUndefined(t)||""===t||0===this.getMigrations().length)throw new Error("Cannot migrate using invalid command: "+t);let o,e;"number"==typeof t?o=t:(o=t.split(",")[0],e=t.split(",")[1]);try{"latest"===o?yield this.execute(r.last(this.getMigrations()).version):yield this.execute(parseFloat(o),"rerun"===e)}catch(t){throw this.options.logger("info","Encountered an error while migrating. Migration failed."),t}})}getNumberOfMigrations(){return this.getMigrations().length-1}getVersion(){return n(this,void 0,void 0,function*(){return(yield this.getControl()).version})}unlock(){return n(this,void 0,void 0,function*(){yield this._collection.updateOne({_id:"control"},{$set:{locked:!1}})})}reset(){return n(this,void 0,void 0,function*(){this._list=[this.defaultMigration],yield this._collection.deleteMany({})})}execute(t,o){return n(this,void 0,void 0,function*(){const e=this;let i=(yield this.getControl()).version;const r=(t,o)=>n(this,void 0,void 0,function*(){const i=e.getMigrations()[o];if("function"!=typeof i[t])throw yield s(),new Error("Cannot migrate "+t+" on version "+i.version);this.options.logger("info","Running "+t+"() on version "+i.version),i.describe&&this.options.logger(i.describe),"AsyncFunction"!==i[t].constructor.name&&"Promise"!==i[t].constructor.name&&this.options.logger("warning",`One of the ${t} functions is nor Async or Promise`,`(${i.describe||"not described"})`);const r={MongoClient:this._db,migrate:o=>n(this,void 0,void 0,function*(){for(const e in o)if(o.hasOwnProperty(e)){"AsyncFunction"!==o[e][t].constructor.name&&"Promise"!==o[e][t].constructor.name&&this.options.logger("warning",`One of the ${t} functions is nor Async or Promise`,`(${o[e].describe||"not described"})`),o[e].describe&&this.options.logger(o[e].describe);try{yield o[e][t](r)}catch(t){throw new Error(t)}}}),queryInterface:new u.QueryInterface(e._db),logger:this.options.logger};try{yield i[t](r)}catch(t){throw new Error(t)}}),s=()=>e.setControl({locked:!1,version:i}),c=()=>n(this,void 0,void 0,function*(){return yield e.setControl({locked:!0,version:i})});if(!1===(yield(()=>n(this,void 0,void 0,function*(){const t=yield e._collection.findOneAndUpdate({_id:"control",locked:!1},{$set:{locked:!0,lockedAt:new Date}});return null!=t.value&&1===t.ok}))()))return void this.options.logger("info","Not migrating, control is locked.");if(o)return this.options.logger("info","Rerunning version "+t),yield r("up",this.findIndexByVersion(t)),this.options.logger("info","Finished migrating."),void(yield s());if(i===t)return this.options.logIfLatest&&this.options.logger("info","Not migrating, already at version "+t),void(yield s());const l=this.findIndexByVersion(i),d=this.findIndexByVersion(t);if(this.options.logger("info","Migrating from version "+this.getMigrations()[l].version+" -> "+this.getMigrations()[d].version),i<t)for(let o=l;o<d;o++)try{yield r("up",o+1),i=e.getMigrations()[o+1].version,yield c()}catch(o){throw this.options.logger("error",`Encountered an error while migrating from ${i} to ${t}`),o}else for(let o=l;o>d;o--)try{yield r("down",o),i=e.getMigrations()[o-1].version,yield c()}catch(o){throw this.options.logger("error",`Encountered an error while migrating from ${i} to ${t}`),o}yield s(),this.options.logger("info","Finished migrating.")})}getControl(){return n(this,void 0,void 0,function*(){return(yield this._collection.findOne({_id:"control"}))||(yield this.setControl({version:0,locked:!1}))})}setControl(t){return n(this,void 0,void 0,function*(){d("Number",t.version),d("Boolean",t.locked);const o=yield this._collection.updateOne({_id:"control"},{$set:{version:t.version,locked:t.locked}},{upsert:!0});return o&&o.result.ok?t:null})}findIndexByVersion(t){for(let o=0;o<this.getMigrations().length;o++)if(this.getMigrations()[o].version===t)return o;throw new Error("Can't find migration version "+t)}}},function(t,o){t.exports=require("bluebird")},function(t,o){t.exports=require("lodash")},function(t,o){t.exports=require("mongodb")},function(t,o){t.exports=require("type-check")},function(t,o,e){"use strict";var n=this&&this.__awaiter||function(t,o,e,n){return new(e||(e=Promise))(function(i,r){function s(t){try{l(n.next(t))}catch(t){r(t)}}function c(t){try{l(n.throw(t))}catch(t){r(t)}}function l(t){t.done?i(t.value):new e(function(o){o(t.value)}).then(s,c)}l((n=n.apply(t,o||[])).next())})};Object.defineProperty(o,"__esModule",{value:!0});const i=e(1);o.QueryInterface=class{constructor(t){this._db=t,this._actions=[],this.cursorOptions={cursor:{batchSize:500},allowDiskUse:!0}}collection(t){const o=this;o.collectionName=t,o._collection=o.MongoClient().collection(t);let e={},r={};const s=()=>o.cursor(r||{},t=>{o._collection.updateOne({_id:t._id},e)});return{applySchema:t=>{for(const o in t)for(const n in t[o]){switch(r=t[o][n].$where||{},e[n]={},n){case"$rename":e[n][o]=t[o][n].$value;case"$set":e[n][o]=t[o][n].$value;case"$unset":e[n][o]=1;default:e[n][o]=t[o][n]}s()}},rename:(t,o)=>{const n={};return{where:i=>(r=i||{},n[t]=o,e={$rename:n},s())}},unset:t=>{const o={};return{where:n=>{if("string"==typeof t)o[t]=1;else{if(!Array.isArray(t))throw new Error("Field name in .unset() must of type string or array.");for(const e of t)o[e]=1}return r=n||{},e={$unset:o||{}},s()}}},set:(t,o)=>{const n={};return{where:i=>(n[t]=o,r=i||{},e={$set:n||{}},s())}},destroy:t=>(r=t||{},o.cursor(r,t=>{o._collection.deleteOne({_id:t._id})})),drop:()=>{const e=new Promise((e,r)=>n(this,void 0,void 0,function*(){yield o.MongoClient().dropCollection(t,(t,o)=>e()),i.logger("info","Deleted collection "+t)}));this._actions.push(e)},update:(t,o)=>{},iterate:(t,e)=>(r=t||{},o.cursor(r,e))}}save(){return n(this,void 0,void 0,function*(){try{return Promise.all(this._actions)}catch(t){return new Error(t)}})}MongoClient(){return this._db}cursor(t,o){return n(this,void 0,void 0,function*(){const e=new Promise((e,i)=>n(this,void 0,void 0,function*(){const n=yield this._collection.aggregate([{$match:t||{}}],this.cursorOptions,null);n.on("data",t=>{o(t)}),n.on("close",()=>i("MongoDB closed the connection")),n.on("end",()=>e())}));this._actions.push(e)})}}}])});