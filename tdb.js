
var TDB = new function(){
    var ready = 0;
    var IP;
    var conf;

    var _collections = [];
    var _cindex = {};

    var evt = document.getElementsByTagName("body")[0];

    var _init = function(cb){
        //_onEvent("TDB_READY",function(){_start(cb)});
        _start(cb);
        //_getIP();
        //_getConf();
    }

    var _start = function(cb){
        console.log("STARTING");

        cb();
    }

    var _getEntryToken = function(d){
        return btoa(d.toString().substr(0,10));
    }

    var _selectCollection = function(c){
        if(!_cindex[c]) _createCollection(c);
        return _collections[_cindex[c]];
    }

    var _createCollection = function(c){
        _collections.push(new _linkedList());
        _cindex[c] = _collections.length - 1;
        console.log("TDB: Collection "+c+" created");
    }

    var _login = function(admin, password){
        var at = conf.adminToken;
        var et = _encriptToToken(admin,password);
        return (at==et)? true : false;
    }

    var _getIP = function(){
        AJAX("http://jsonip.com?callback=?", function(data){
            IP = JSON.parse(data.responseText.replace(")","").replace("?(","")).ip;
            if(typeof IP == "string"){
                console.log("Connection from ",IP);
                ready++;
                if(ready == 2) _triggerEvent("TDB_READY");
            }else{
                _raiseError("IP_NOT_RETRIEVED");
            }
        })
    }

    var _getConf = function(){
        AJAX("tdbconf.json", function(data){
            conf = JSON.parse(data.responseText);
            if(typeof conf == "object"){
                console.log("Configuration file loaded");
                ready++;
                if(ready == 2) _triggerEvent("TDB_READY");
            }else{
                _raiseError("CONFIGURATION_NOT_FOUND");
            }
        },true);
    }

    function _onEvent(name,cb){
        evt.addEventListener(name,function(d){cb(d)});
    }
    function _triggerEvent(name,d){
        if(typeof d != "object") d = {};
        var ev = document.createEvent("Event");
        ev.initEvent("TDB_READY", true, true);
        ev.data = d;
        evt.dispatchEvent(ev);
    }

    function _genAdminToken(){
        // var token = 
    }

    function _encriptToToken(admin, password){
        var str = encrypt((admin+IP+password).split("").sort().toString().replace(/,/g, ""));
        console.log(str);

        return str;
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

    function encrypt(str) {var rotate_left = function(n, s) {var t4 = (n << s) | (n >>> (32 - s));return t4;};var cvt_hex = function(val) {var str = '';var i;var v;for (i = 7; i >= 0; i--) {v = (val >>> (i * 4)) & 0x0f;str += v.toString(16);}return str;};var blockstart;var i, j;var W = new Array(80);var H0 = 0x67452301;var H1 = 0xEFCDAB89;var H2 = 0x98BADCFE;var H3 = 0x10325476;var H4 = 0xC3D2E1F0;var A, B, C, D, E;var temp;str = unescape(encodeURIComponent(str));var str_len = str.length;var word_array = [];for (i = 0; i < str_len - 3; i += 4) {j = str.charCodeAt(i) << 24 | str.charCodeAt(i + 1) << 16 | str.charCodeAt(i + 2) << 8 | str.charCodeAt(i + 3);word_array.push(j);}switch (str_len % 4) {case 0:i = 0x080000000;break;case 1:i = str.charCodeAt(str_len - 1) << 24 | 0x0800000;break;case 2:i = str.charCodeAt(str_len - 2) << 24 | str.charCodeAt(str_len - 1) << 16 | 0x08000;break;case 3:i = str.charCodeAt(str_len - 3) << 24 | str.charCodeAt(str_len - 2) << 16 | str.charCodeAt(str_len - 1) <<8 | 0x80;break;}word_array.push(i);while ((word_array.length % 16) != 14) {word_array.push(0);}word_array.push(str_len >>> 29);word_array.push((str_len << 3) & 0x0ffffffff);for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {for (i = 0; i < 16; i++) {W[i] = word_array[blockstart + i];}for (i = 16; i <= 79; i++) {W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);}A = H0;B = H1;C = H2;D = H3;E = H4;for (i = 0; i <= 19; i++) {temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;E = D;D = C;C = rotate_left(B, 30);B = A;A = temp;}for (i = 20; i <= 39; i++) {temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;E = D;D = C;C = rotate_left(B, 30);B = A;A = temp;}for (i = 40; i <= 59; i++) {temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;E = D;D = C;C = rotate_left(B, 30);B = A;A = temp;}for (i = 60; i <= 79; i++) {temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;E = D;D = C;C = rotate_left(B, 30);B = A;A = temp;}H0 = (H0 + A) & 0x0ffffffff;H1 = (H1 + B) & 0x0ffffffff;H2 = (H2 + C) & 0x0ffffffff;H3 = (H3 + D) & 0x0ffffffff;H4 = (H4 + E) & 0x0ffffffff;}temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);return temp.toLowerCase();}

    function _raiseError(id){
        switch(id){
            case "IP_NOT_RETRIEVED":
                console.log("Error: IP could not be retrieved");
            break;
            case "CONFIGURATION_NOT_FOUND":
                console.log("Error: There's no configuration file");
            break;
        }
    }

    var _linkedList = function(){
        var lnode = false;

        var _push = function(data){
            lnode = new _node(_getEntryToken(data),data,lnode);
        }

        var _node = function(id,data,next){
            var _update = function(d){
                this.id = _getEntryToken(d);
                this.data = d;
            }

            this.id = id || "";
            this.data = data || "";
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

        var _search = function(d){
            if(typeof d == "number") return _findByIterator(d);

            var id = _getEntryToken(d);
            var cn = lnode;
            var f = [];
            while(cn){
                //     if(!window.aasd)console.log(id, cn.id);
                //         window.aasd = true;
                // if(new RegExp(cn.id).test(id)){
                //     f.push(cn);
                // }else if(new RegExp(d.substr(0,30)).test(cn.data)){
                if(new RegExp(d.substr(0,30)).test(cn.data)){
                    f.push(cn);
                }
                cn = cn.next;
            }
            return f;
        }

        var _searchFirst = function(d){
            if(typeof d == "number") return _findByIterator(d);

            var id = _getEntryToken(d);
            var cn = lnode;
            while(cn){
                //     if(!window.aasd)console.log(id, cn.id);
                //         window.aasd = true;
                // if(new RegExp(cn.id).test(id)){
                //     f.push(cn);
                // }else if(new RegExp(d.substr(0,30)).test(cn.data)){
                if(new RegExp(d.substr(0,30)).test(cn.data)){
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

        this.Save = _push;
        this.Search = _search;
        this.SearchFirst = _searchFirst;
        this.FindByIterator = _findByIterator;
        this.__defineGetter__("data",function(){return {numberOfNodes: n, lastIn: lnode}; });
    }



    this.Init = _init;
    this.Login = _login;
    // this.Save = _save;
    this.Select = _selectCollection;
    // this.Search = _search;
};