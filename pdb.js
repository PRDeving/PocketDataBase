var PDB = new function(){
    var conf;
    var _collections = [];
    var _cindex = {};

    var TT = new TinyText();

    var evt = document.getElementsByTagName("body")[0];

    var _init = function(cb){
        _onEvent("PDB_READY",function(){_start(cb)});
        _triggerEvent("PDB_READY");
    }

    var _start = function(cb){
        console.log("STARTING");
        if(cb) cb();
    }

    var _getEntryToken = function(d){
        return btoa(d.toString().substr(0,10));
    }

    var _selectCollection = function(c){
        if(!_cindex[c]) _createCollection(c);
        return _collections[_cindex[c]];
    }

    var _createCollection = function(c){
        _collections.push(new _linkedList(c));
        _cindex[c] = _collections.length - 1;
        console.log("PDB: Collection "+c+" created");
    }

    function _onEvent(name,cb){
        evt.addEventListener(name,function(d){cb(d)});
    }

    function _triggerEvent(name,d){
        if(typeof d != "object") d = {};
        var ev = document.createEvent("Event");
        ev.initEvent("PDB_READY", true, true);
        ev.data = d;
        evt.dispatchEvent(ev);
    }

    function AJAX(url,cb,nll){
        if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
        else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");

        xmlhttp.open("GET",url,false);

        if(!nll) xmlhttp.send();
        else xmlhttp.send(null);

        if(cb)cb(xmlhttp);
        return false;
    }

    function _raiseError(id,data){
        switch(id){
            case "EXPORT_FAILURE":
                console.log("ERROR:",id,data);
            break;
        }
    }

    var _linkedList = function(colection){
        var lnode = false;
        var colection;

        var _push = function(data){
            lnode = new _node(data,lnode);
        }

        var _node = function(data,next){
            var _update = function(data){
                var d = (typeof data == "object")? JSON.stringify(data) : false;
                // this.id = _getEntryToken(d);
                this.data = data;
                this.raw = d
            }

            var d = (typeof data == "object")? JSON.stringify(data) : false;

            // this.id = _getEntryToken(d) || "";
            this.data = data || "";
            this.raw = d;
            this.next = next || false;
            this.update = _update;
        }

        var _findByIterator = function(it){
            var cn = lnode;
            var n = 0;
            while(cn){
                if(n == it) return cn;
                cn = cn.next;
                n++;
            }
        }

        var _searchWhere = function(filter){
            var cn = lnode;
            var f = [];
            while(cn){
                if(typeof cn.data !== "object") break;

                var match = (function(){
                    for(var fil in filter){
                        if(!cn.data[fil]) return false;
                        if(filter[fil] !== cn.data[fil]) return false;
                    };
                    return true;
                })();

                if(match) f.push(cn);
                cn = cn.next;
            }
            return f;
        }

        var _searchFirstWhere = function(filter){
            var cn = lnode;
            while(cn){
                if(typeof cn.data !== "object") break;

                var match = (function(){
                    for(var fil in filter){
                        if(!cn.data[fil]) return false;
                        if(filter[fil] !== cn.data[fil]) return false;
                    };
                    return true;
                })();

                if(match) return cn;
                cn = cn.next;
            }
            return f;
        }

        var _search = function(d){
            if(typeof d == "number") return _findByIterator(d);
            if(typeof d == "object") return _findWhere(d);

            var cn = lnode;
            var f = [];

            while(cn){
                var data = (!cn.raw)? cn.data : cn.raw;
                if(data.indexOf(d) >= 0){
                    f.push(cn);
                }
                cn = cn.next;
            }
            return f;
        }

        var _searchFirst = function(d){
            if(typeof d == "number") return _findByIterator(d);
            if(typeof d == "object") return _findFirstWhere(d);

            var cn = lnode;
            while(cn){
                var data = (!cn.raw)? cn.data : cn.raw;
                
                // if(new RegExp(d).test(cn.data)){
                if(data.indexOf(d) >= 0){
                   return cn;
                }
                cn = cn.next;
            }
        }

        var _findById = function(id){
            var cn = lnode;
            var f = [];
            while(cn){
                if(cn.id == id) f.push(cn);
                cn = cn.next;
            }
            return f;
        }

        var _export = function(toFile){
            var cd = [];
            var cn = lnode;
            var init = Date.now();
            console.log("PDB: Exporting, be patient, this could last several seconds...");
            while(cn){
                cd.push((!cn.raw)?cn.data:cn.raw);
                cn = cn.next;
            }
            
            try {
                localStorage.setItem("PDBDB_"+colection,TT.compress(cd.join("|")));
            } catch(e){
                _raiseError("EXPORT_FAILURE",e);
                return false;
            }
            console.log("PDB: Database exported to LocalStorage successfully in",
            (Date.now()-init)/1000,"seconds");
        }

        var _import = function(c){
            var init = Date.now();
            console.log("PDB: Importing, be patient, this could last several seconds...");

            var rawdata = localStorage.getItem("PDBDB_"+c);
            if(!rawdata) return false;

            var cd = TT.decompress(rawdata).split("|");
            for(var e in cd) _push((cd[e][0] != "{" && cd[e][0] != "[")?cd[e] : JSON.parse(cd[e]));
            console.log("PDB: Database imported from LocalStorage successfully in",
            (Date.now()-init)/1000,"seconds");
        }

        this.Save = _push;
        this.Search = _search;
        this.SearchFirst = _searchFirst;
        this.SearchFirstWhere = _searchFirstWhere;
        this.SearchWhere = _searchWhere;
        this.FindByIterator = _findByIterator;
        this.Export = _export;
        this.Import = _import;
        this.__defineGetter__("data",function(){return {lastIn: lnode}; });
        this.__defineGetter__("length",function(){var c = 0; var cn = lnode; while(cn){c++;cn = cn.next};return c});
    }



    this.Init = _init;
    this.Select = _selectCollection;
    // this.TinyText = new TinyText();






    function TinyText(){var o=String.fromCharCode,r={implode:function(o){for(var t=r.compress(o),e=new Uint8Array(2*t.length),n=0,i=t.length;i>n;n++){var s=t.charCodeAt(n);e[2*n]=s>>>8,e[2*n+1]=s%256}return e},explode:function(t){if(null===t||void 0===t)return r.decompress(t);for(var e=new Array(t.length/2),n=0,i=e.length;i>n;n++)e[n]=256*t[2*n]+t[2*n+1];var s=[];return e.forEach(function(r){s.push(o(r))}),r.decompress(s.join(""))},compress:function(t){return r._compress(t,16,function(r){return o(r)})},_compress:function(o,r,t){if(null==o)return"";var e,n,i,s={},p={},a="",h="",c="",f=2,l=3,u=2,d=[],v=0,w=0;for(i=0;i<o.length;i+=1)if(a=o.charAt(i),Object.prototype.hasOwnProperty.call(s,a)||(s[a]=l++,p[a]=!0),h=c+a,Object.prototype.hasOwnProperty.call(s,h))c=h;else{if(Object.prototype.hasOwnProperty.call(p,c)){if(c.charCodeAt(0)<256){for(e=0;u>e;e++)v<<=1,w==r-1?(w=0,d.push(t(v)),v=0):w++;for(n=c.charCodeAt(0),e=0;8>e;e++)v=v<<1|1&n,w==r-1?(w=0,d.push(t(v)),v=0):w++,n>>=1}else{for(n=1,e=0;u>e;e++)v=v<<1|n,w==r-1?(w=0,d.push(t(v)),v=0):w++,n=0;for(n=c.charCodeAt(0),e=0;16>e;e++)v=v<<1|1&n,w==r-1?(w=0,d.push(t(v)),v=0):w++,n>>=1}f--,0==f&&(f=Math.pow(2,u),u++),delete p[c]}else for(n=s[c],e=0;u>e;e++)v=v<<1|1&n,w==r-1?(w=0,d.push(t(v)),v=0):w++,n>>=1;f--,0==f&&(f=Math.pow(2,u),u++),s[h]=l++,c=String(a)}if(""!==c){if(Object.prototype.hasOwnProperty.call(p,c)){if(c.charCodeAt(0)<256){for(e=0;u>e;e++)v<<=1,w==r-1?(w=0,d.push(t(v)),v=0):w++;for(n=c.charCodeAt(0),e=0;8>e;e++)v=v<<1|1&n,w==r-1?(w=0,d.push(t(v)),v=0):w++,n>>=1}else{for(n=1,e=0;u>e;e++)v=v<<1|n,w==r-1?(w=0,d.push(t(v)),v=0):w++,n=0;for(n=c.charCodeAt(0),e=0;16>e;e++)v=v<<1|1&n,w==r-1?(w=0,d.push(t(v)),v=0):w++,n>>=1}f--,0==f&&(f=Math.pow(2,u),u++),delete p[c]}else for(n=s[c],e=0;u>e;e++)v=v<<1|1&n,w==r-1?(w=0,d.push(t(v)),v=0):w++,n>>=1;f--,0==f&&(f=Math.pow(2,u),u++)}for(n=2,e=0;u>e;e++)v=v<<1|1&n,w==r-1?(w=0,d.push(t(v)),v=0):w++,n>>=1;for(;;){if(v<<=1,w==r-1){d.push(t(v));break}w++}return d.join("")},decompress:function(o){return null==o?"":""==o?null:r._decompress(o.length,32768,function(r){return o.charCodeAt(r)})},_decompress:function(r,t,e){var n,i,s,p,a,h,c,f,l=[],u=4,d=4,v=3,w="",A=[],m={val:e(0),position:t,index:1};for(i=0;3>i;i+=1)l[i]=i;for(p=0,h=Math.pow(2,2),c=1;c!=h;)a=m.val&m.position,m.position>>=1,0==m.position&&(m.position=t,m.val=e(m.index++)),p|=(a>0?1:0)*c,c<<=1;switch(n=p){case 0:for(p=0,h=Math.pow(2,8),c=1;c!=h;)a=m.val&m.position,m.position>>=1,0==m.position&&(m.position=t,m.val=e(m.index++)),p|=(a>0?1:0)*c,c<<=1;f=o(p);break;case 1:for(p=0,h=Math.pow(2,16),c=1;c!=h;)a=m.val&m.position,m.position>>=1,0==m.position&&(m.position=t,m.val=e(m.index++)),p|=(a>0?1:0)*c,c<<=1;f=o(p);break;case 2:return""}for(l[3]=f,s=f,A.push(f);;){if(m.index>r)return"";for(p=0,h=Math.pow(2,v),c=1;c!=h;)a=m.val&m.position,m.position>>=1,0==m.position&&(m.position=t,m.val=e(m.index++)),p|=(a>0?1:0)*c,c<<=1;switch(f=p){case 0:for(p=0,h=Math.pow(2,8),c=1;c!=h;)a=m.val&m.position,m.position>>=1,0==m.position&&(m.position=t,m.val=e(m.index++)),p|=(a>0?1:0)*c,c<<=1;l[d++]=o(p),f=d-1,u--;break;case 1:for(p=0,h=Math.pow(2,16),c=1;c!=h;)a=m.val&m.position,m.position>>=1,0==m.position&&(m.position=t,m.val=e(m.index++)),p|=(a>0?1:0)*c,c<<=1;l[d++]=o(p),f=d-1,u--;break;case 2:return A.join("")}if(0==u&&(u=Math.pow(2,v),v++),l[f])w=l[f];else{if(f!==d)return null;w=s+s.charAt(0)}A.push(w),l[d++]=s+w.charAt(0),u--,s=w,0==u&&(u=Math.pow(2,v),v++)}}};return r};
};
