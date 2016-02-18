if (typeof JSON !== 'object') {
    JSON = {};
}

(function () {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear()     + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate())      + 'T' +
                    f(this.getUTCHours())     + ':' +
                    f(this.getUTCMinutes())   + ':' +
                    f(this.getUTCSeconds())   + 'Z'
                : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];


        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }


        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }


        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':


            return String(value);

        case 'object':

            if (!value) {
                return 'null';
            }

            gap += indent;
            partial = [];


            if (Object.prototype.toString.apply(value) === '[object Array]') {

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

                v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

            v = partial.length === 0
                ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }


    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

            var i;
            gap = '';
            indent = '';

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

            } else if (typeof space === 'string') {
                indent = space;
            }

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }


            return str('', {'': value});
        };
    }


    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

            var j;

            function walk(holder, key) {


                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }



            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }


            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {


                j = eval('(' + text + ')');


                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }


            throw new SyntaxError('JSON.parse');
        };
    }
}());jQuery.uaMatch=function(ua){ua=ua.toLowerCase();var match=/(chrome)[ \/]([\w.]+)/.exec(ua)||/(webkit)[ \/]([\w.]+)/.exec(ua)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua)||/(msie) ([\w.]+)/.exec(ua)||ua.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua)||[];return{browser:match[1]||"",version:match[2]||"0"}};if(!jQuery.browser){matched=jQuery.uaMatch(navigator.userAgent);browser={};if(matched.browser){browser[matched.browser]=true;browser.version=matched.version}if(browser.chrome){browser.webkit=true}else if(browser.webkit){browser.safari=true}jQuery.browser=browser}(function($){var keyString="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";var uTF8Encode=function(string){string=string.replace(/\x0d\x0a/g,"\x0a");var output="";for(var n=0;n<string.length;n++){var c=string.charCodeAt(n);if(c<128){output+=String.fromCharCode(c)}else if((c>127)&&(c<2048)){output+=String.fromCharCode((c>>6)|192);output+=String.fromCharCode((c&63)|128)}else{output+=String.fromCharCode((c>>12)|224);output+=String.fromCharCode(((c>>6)&63)|128);output+=String.fromCharCode((c&63)|128)}}return output};var uTF8Decode=function(input){var string="";var i=0;var c=c1=c2=0;while(i<input.length){c=input.charCodeAt(i);if(c<128){string+=String.fromCharCode(c);i++}else if((c>191)&&(c<224)){c2=input.charCodeAt(i+1);string+=String.fromCharCode(((c&31)<<6)|(c2&63));i+=2}else{c2=input.charCodeAt(i+1);c3=input.charCodeAt(i+2);string+=String.fromCharCode(((c&15)<<12)|((c2&63)<<6)|(c3&63));i+=3}}return string};$.extend({base64Encode:function(input){var output="";var chr1,chr2,chr3,enc1,enc2,enc3,enc4;var i=0;input=uTF8Encode(input);while(i<input.length){chr1=input.charCodeAt(i++);chr2=input.charCodeAt(i++);chr3=input.charCodeAt(i++);enc1=chr1>>2;enc2=((chr1&3)<<4)|(chr2>>4);enc3=((chr2&15)<<2)|(chr3>>6);enc4=chr3&63;if(isNaN(chr2)){enc3=enc4=64}else if(isNaN(chr3)){enc4=64}output=output+keyString.charAt(enc1)+keyString.charAt(enc2)+keyString.charAt(enc3)+keyString.charAt(enc4)}return output},base64Decode:function(input){var output="";var chr1,chr2,chr3;var enc1,enc2,enc3,enc4;var i=0;input=input.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(i<input.length){enc1=keyString.indexOf(input.charAt(i++));enc2=keyString.indexOf(input.charAt(i++));enc3=keyString.indexOf(input.charAt(i++));enc4=keyString.indexOf(input.charAt(i++));chr1=(enc1<<2)|(enc2>>4);chr2=((enc2&15)<<4)|(enc3>>2);chr3=((enc3&3)<<6)|enc4;output=output+String.fromCharCode(chr1);if(enc3!=64){output=output+String.fromCharCode(chr2)}if(enc4!=64){output=output+String.fromCharCode(chr3)}}output=uTF8Decode(output);return output}})})(jQuery);/*
 * jQuery Color Animations
 * Copyright 2007 John Resig
 * Released under the MIT and GPL licenses.
 */

(function(jQuery){

    // We override the animation for all of these color styles
    jQuery.each(['backgroundColor', 'borderBottomColor', 'borderLeftColor', 'borderRightColor', 'borderTopColor', 'color', 'outlineColor'], function(i,attr){
        jQuery.fx.step[attr] = function(fx){
            if ( !fx.colorInit ) {
                fx.start = getColor( fx.elem, attr );
                fx.end = getRGB( fx.end );
                fx.colorInit = true;
            }

            fx.elem.style[attr] = "rgb(" + [
                Math.max(Math.min( parseInt((fx.pos * (fx.end[0] - fx.start[0])) + fx.start[0]), 255), 0),
                Math.max(Math.min( parseInt((fx.pos * (fx.end[1] - fx.start[1])) + fx.start[1]), 255), 0),
                Math.max(Math.min( parseInt((fx.pos * (fx.end[2] - fx.start[2])) + fx.start[2]), 255), 0)
            ].join(",") + ")";
        }
    });

    // Color Conversion functions from highlightFade
    // By Blair Mitchelmore
    // http://jquery.offput.ca/highlightFade/

    // Parse strings looking for color tuples [255,255,255]
    function getRGB(color) {
        var result;

        // Check if we're already dealing with an array of colors
        if ( color && color.constructor == Array && color.length == 3 )
            return color;

        // Look for rgb(num,num,num)
        if (result = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color))
            return [parseInt(result[1]), parseInt(result[2]), parseInt(result[3])];

        // Look for rgb(num%,num%,num%)
        if (result = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(color))
            return [parseFloat(result[1])*2.55, parseFloat(result[2])*2.55, parseFloat(result[3])*2.55];

        // Look for #a0b1c2
        if (result = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(color))
            return [parseInt(result[1],16), parseInt(result[2],16), parseInt(result[3],16)];

        // Look for #fff
        if (result = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(color))
            return [parseInt(result[1]+result[1],16), parseInt(result[2]+result[2],16), parseInt(result[3]+result[3],16)];

        // Look for rgba(0, 0, 0, 0) == transparent in Safari 3
        if (result = /rgba\(0, 0, 0, 0\)/.exec(color))
            return colors['transparent'];

        // Otherwise, we're most likely dealing with a named color
        return colors[jQuery.trim(color).toLowerCase()];
    }

    function getColor(elem, attr) {
        var color;

        do {
            color = jQuery.css(elem, attr);

            // Keep going until we find an element that has color, or we hit the body
            if ( color != '' && color != 'transparent' || jQuery.nodeName(elem, "body") )
                break;

            attr = "backgroundColor";
        } while ( elem = elem.parentNode );

        return getRGB(color);
    };

    // Some named colors to work with
    // From Interface by Stefan Petre
    // http://interface.eyecon.ro/

    var colors = {
        aqua:[0,255,255],
        azure:[240,255,255],
        beige:[245,245,220],
        black:[0,0,0],
        blue:[0,0,255],
        brown:[165,42,42],
        cyan:[0,255,255],
        darkblue:[0,0,139],
        darkcyan:[0,139,139],
        darkgrey:[169,169,169],
        darkgreen:[0,100,0],
        darkkhaki:[189,183,107],
        darkmagenta:[139,0,139],
        darkolivegreen:[85,107,47],
        darkorange:[255,140,0],
        darkorchid:[153,50,204],
        darkred:[139,0,0],
        darksalmon:[233,150,122],
        darkviolet:[148,0,211],
        fuchsia:[255,0,255],
        gold:[255,215,0],
        green:[0,128,0],
        indigo:[75,0,130],
        khaki:[240,230,140],
        lightblue:[173,216,230],
        lightcyan:[224,255,255],
        lightgreen:[144,238,144],
        lightgrey:[211,211,211],
        lightpink:[255,182,193],
        lightyellow:[255,255,224],
        lime:[0,255,0],
        magenta:[255,0,255],
        maroon:[128,0,0],
        navy:[0,0,128],
        olive:[128,128,0],
        orange:[255,165,0],
        pink:[255,192,203],
        purple:[128,0,128],
        violet:[128,0,128],
        red:[255,0,0],
        silver:[192,192,192],
        white:[255,255,255],
        yellow:[255,255,0],
        transparent: [255,255,255]
    };

})(jQuery);
(function($){

var TIMEOUT = 20000;
var lastTime = (new Date()).getTime();

setInterval(function() {
  var currentTime = (new Date()).getTime();
  if (currentTime > (lastTime + TIMEOUT + 2000)) {
    $(document).wake();
  }
  lastTime = currentTime;
}, TIMEOUT);

$.fn.wake = function(callback) {
  if (typeof callback === 'function') {
    return $(this).on('wake', callback);
  } else {
    return $(this).trigger('wake');
  }
};

})(jQuery);/*	SWFObject v2.2 <http://code.google.com/p/swfobject/> 
	is released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/
var swfobject=function(){var D="undefined",r="object",S="Shockwave Flash",W="ShockwaveFlash.ShockwaveFlash",q="application/x-shockwave-flash",R="SWFObjectExprInst",x="onreadystatechange",O=window,j=document,t=navigator,T=false,U=[h],o=[],N=[],I=[],l,Q,E,B,J=false,a=false,n,G,m=true,M=function(){var aa=typeof j.getElementById!=D&&typeof j.getElementsByTagName!=D&&typeof j.createElement!=D,ah=t.userAgent.toLowerCase(),Y=t.platform.toLowerCase(),ae=Y?/win/.test(Y):/win/.test(ah),ac=Y?/mac/.test(Y):/mac/.test(ah),af=/webkit/.test(ah)?parseFloat(ah.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):false,X=!+"\v1",ag=[0,0,0],ab=null;if(typeof t.plugins!=D&&typeof t.plugins[S]==r){ab=t.plugins[S].description;if(ab&&!(typeof t.mimeTypes!=D&&t.mimeTypes[q]&&!t.mimeTypes[q].enabledPlugin)){T=true;X=false;ab=ab.replace(/^.*\s+(\S+\s+\S+$)/,"$1");ag[0]=parseInt(ab.replace(/^(.*)\..*$/,"$1"),10);ag[1]=parseInt(ab.replace(/^.*\.(.*)\s.*$/,"$1"),10);ag[2]=/[a-zA-Z]/.test(ab)?parseInt(ab.replace(/^.*[a-zA-Z]+(.*)$/,"$1"),10):0}}else{if(typeof O.ActiveXObject!=D){try{var ad=new ActiveXObject(W);if(ad){ab=ad.GetVariable("$version");if(ab){X=true;ab=ab.split(" ")[1].split(",");ag=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}}catch(Z){}}}return{w3:aa,pv:ag,wk:af,ie:X,win:ae,mac:ac}}(),k=function(){if(!M.w3){return}if((typeof j.readyState!=D&&j.readyState=="complete")||(typeof j.readyState==D&&(j.getElementsByTagName("body")[0]||j.body))){f()}if(!J){if(typeof j.addEventListener!=D){j.addEventListener("DOMContentLoaded",f,false)}if(M.ie&&M.win){j.attachEvent(x,function(){if(j.readyState=="complete"){j.detachEvent(x,arguments.callee);f()}});if(O==top){(function(){if(J){return}try{j.documentElement.doScroll("left")}catch(X){setTimeout(arguments.callee,0);return}f()})()}}if(M.wk){(function(){if(J){return}if(!/loaded|complete/.test(j.readyState)){setTimeout(arguments.callee,0);return}f()})()}s(f)}}();function f(){if(J){return}try{var Z=j.getElementsByTagName("body")[0].appendChild(C("span"));Z.parentNode.removeChild(Z)}catch(aa){return}J=true;var X=U.length;for(var Y=0;Y<X;Y++){U[Y]()}}function K(X){if(J){X()}else{U[U.length]=X}}function s(Y){if(typeof O.addEventListener!=D){O.addEventListener("load",Y,false)}else{if(typeof j.addEventListener!=D){j.addEventListener("load",Y,false)}else{if(typeof O.attachEvent!=D){i(O,"onload",Y)}else{if(typeof O.onload=="function"){var X=O.onload;O.onload=function(){X();Y()}}else{O.onload=Y}}}}}function h(){if(T){V()}else{H()}}function V(){var X=j.getElementsByTagName("body")[0];var aa=C(r);aa.setAttribute("type",q);var Z=X.appendChild(aa);if(Z){var Y=0;(function(){if(typeof Z.GetVariable!=D){var ab=Z.GetVariable("$version");if(ab){ab=ab.split(" ")[1].split(",");M.pv=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}else{if(Y<10){Y++;setTimeout(arguments.callee,10);return}}X.removeChild(aa);Z=null;H()})()}else{H()}}function H(){var ag=o.length;if(ag>0){for(var af=0;af<ag;af++){var Y=o[af].id;var ab=o[af].callbackFn;var aa={success:false,id:Y};if(M.pv[0]>0){var ae=c(Y);if(ae){if(F(o[af].swfVersion)&&!(M.wk&&M.wk<312)){w(Y,true);if(ab){aa.success=true;aa.ref=z(Y);ab(aa)}}else{if(o[af].expressInstall&&A()){var ai={};ai.data=o[af].expressInstall;ai.width=ae.getAttribute("width")||"0";ai.height=ae.getAttribute("height")||"0";if(ae.getAttribute("class")){ai.styleclass=ae.getAttribute("class")}if(ae.getAttribute("align")){ai.align=ae.getAttribute("align")}var ah={};var X=ae.getElementsByTagName("param");var ac=X.length;for(var ad=0;ad<ac;ad++){if(X[ad].getAttribute("name").toLowerCase()!="movie"){ah[X[ad].getAttribute("name")]=X[ad].getAttribute("value")}}P(ai,ah,Y,ab)}else{p(ae);if(ab){ab(aa)}}}}}else{w(Y,true);if(ab){var Z=z(Y);if(Z&&typeof Z.SetVariable!=D){aa.success=true;aa.ref=Z}ab(aa)}}}}}function z(aa){var X=null;var Y=c(aa);if(Y&&Y.nodeName=="OBJECT"){if(typeof Y.SetVariable!=D){X=Y}else{var Z=Y.getElementsByTagName(r)[0];if(Z){X=Z}}}return X}function A(){return !a&&F("6.0.65")&&(M.win||M.mac)&&!(M.wk&&M.wk<312)}function P(aa,ab,X,Z){a=true;E=Z||null;B={success:false,id:X};var ae=c(X);if(ae){if(ae.nodeName=="OBJECT"){l=g(ae);Q=null}else{l=ae;Q=X}aa.id=R;if(typeof aa.width==D||(!/%$/.test(aa.width)&&parseInt(aa.width,10)<310)){aa.width="310"}if(typeof aa.height==D||(!/%$/.test(aa.height)&&parseInt(aa.height,10)<137)){aa.height="137"}j.title=j.title.slice(0,47)+" - Flash Player Installation";var ad=M.ie&&M.win?"ActiveX":"PlugIn",ac="MMredirectURL="+O.location.toString().replace(/&/g,"%26")+"&MMplayerType="+ad+"&MMdoctitle="+j.title;if(typeof ab.flashvars!=D){ab.flashvars+="&"+ac}else{ab.flashvars=ac}if(M.ie&&M.win&&ae.readyState!=4){var Y=C("div");X+="SWFObjectNew";Y.setAttribute("id",X);ae.parentNode.insertBefore(Y,ae);ae.style.display="none";(function(){if(ae.readyState==4){ae.parentNode.removeChild(ae)}else{setTimeout(arguments.callee,10)}})()}u(aa,ab,X)}}function p(Y){if(M.ie&&M.win&&Y.readyState!=4){var X=C("div");Y.parentNode.insertBefore(X,Y);X.parentNode.replaceChild(g(Y),X);Y.style.display="none";(function(){if(Y.readyState==4){Y.parentNode.removeChild(Y)}else{setTimeout(arguments.callee,10)}})()}else{Y.parentNode.replaceChild(g(Y),Y)}}function g(ab){var aa=C("div");if(M.win&&M.ie){aa.innerHTML=ab.innerHTML}else{var Y=ab.getElementsByTagName(r)[0];if(Y){var ad=Y.childNodes;if(ad){var X=ad.length;for(var Z=0;Z<X;Z++){if(!(ad[Z].nodeType==1&&ad[Z].nodeName=="PARAM")&&!(ad[Z].nodeType==8)){aa.appendChild(ad[Z].cloneNode(true))}}}}}return aa}function u(ai,ag,Y){var X,aa=c(Y);if(M.wk&&M.wk<312){return X}if(aa){if(typeof ai.id==D){ai.id=Y}if(M.ie&&M.win){var ah="";for(var ae in ai){if(ai[ae]!=Object.prototype[ae]){if(ae.toLowerCase()=="data"){ag.movie=ai[ae]}else{if(ae.toLowerCase()=="styleclass"){ah+=' class="'+ai[ae]+'"'}else{if(ae.toLowerCase()!="classid"){ah+=" "+ae+'="'+ai[ae]+'"'}}}}}var af="";for(var ad in ag){if(ag[ad]!=Object.prototype[ad]){af+='<param name="'+ad+'" value="'+ag[ad]+'" />'}}aa.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+ah+">"+af+"</object>";N[N.length]=ai.id;X=c(ai.id)}else{var Z=C(r);Z.setAttribute("type",q);for(var ac in ai){if(ai[ac]!=Object.prototype[ac]){if(ac.toLowerCase()=="styleclass"){Z.setAttribute("class",ai[ac])}else{if(ac.toLowerCase()!="classid"){Z.setAttribute(ac,ai[ac])}}}}for(var ab in ag){if(ag[ab]!=Object.prototype[ab]&&ab.toLowerCase()!="movie"){e(Z,ab,ag[ab])}}aa.parentNode.replaceChild(Z,aa);X=Z}}return X}function e(Z,X,Y){var aa=C("param");aa.setAttribute("name",X);aa.setAttribute("value",Y);Z.appendChild(aa)}function y(Y){var X=c(Y);if(X&&X.nodeName=="OBJECT"){if(M.ie&&M.win){X.style.display="none";(function(){if(X.readyState==4){b(Y)}else{setTimeout(arguments.callee,10)}})()}else{X.parentNode.removeChild(X)}}}function b(Z){var Y=c(Z);if(Y){for(var X in Y){if(typeof Y[X]=="function"){Y[X]=null}}Y.parentNode.removeChild(Y)}}function c(Z){var X=null;try{X=j.getElementById(Z)}catch(Y){}return X}function C(X){return j.createElement(X)}function i(Z,X,Y){Z.attachEvent(X,Y);I[I.length]=[Z,X,Y]}function F(Z){var Y=M.pv,X=Z.split(".");X[0]=parseInt(X[0],10);X[1]=parseInt(X[1],10)||0;X[2]=parseInt(X[2],10)||0;return(Y[0]>X[0]||(Y[0]==X[0]&&Y[1]>X[1])||(Y[0]==X[0]&&Y[1]==X[1]&&Y[2]>=X[2]))?true:false}function v(ac,Y,ad,ab){if(M.ie&&M.mac){return}var aa=j.getElementsByTagName("head")[0];if(!aa){return}var X=(ad&&typeof ad=="string")?ad:"screen";if(ab){n=null;G=null}if(!n||G!=X){var Z=C("style");Z.setAttribute("type","text/css");Z.setAttribute("media",X);n=aa.appendChild(Z);if(M.ie&&M.win&&typeof j.styleSheets!=D&&j.styleSheets.length>0){n=j.styleSheets[j.styleSheets.length-1]}G=X}if(M.ie&&M.win){if(n&&typeof n.addRule==r){n.addRule(ac,Y)}}else{if(n&&typeof j.createTextNode!=D){n.appendChild(j.createTextNode(ac+" {"+Y+"}"))}}}function w(Z,X){if(!m){return}var Y=X?"visible":"hidden";if(J&&c(Z)){c(Z).style.visibility=Y}else{v("#"+Z,"visibility:"+Y)}}function L(Y){var Z=/[\\\"<>\.;]/;var X=Z.exec(Y)!=null;return X&&typeof encodeURIComponent!=D?encodeURIComponent(Y):Y}var d=function(){if(M.ie&&M.win){window.attachEvent("onunload",function(){var ac=I.length;for(var ab=0;ab<ac;ab++){I[ab][0].detachEvent(I[ab][1],I[ab][2])}var Z=N.length;for(var aa=0;aa<Z;aa++){y(N[aa])}for(var Y in M){M[Y]=null}M=null;for(var X in swfobject){swfobject[X]=null}swfobject=null})}}();return{registerObject:function(ab,X,aa,Z){if(M.w3&&ab&&X){var Y={};Y.id=ab;Y.swfVersion=X;Y.expressInstall=aa;Y.callbackFn=Z;o[o.length]=Y;w(ab,false)}else{if(Z){Z({success:false,id:ab})}}},getObjectById:function(X){if(M.w3){return z(X)}},embedSWF:function(ab,ah,ae,ag,Y,aa,Z,ad,af,ac){var X={success:false,id:ah};if(M.w3&&!(M.wk&&M.wk<312)&&ab&&ah&&ae&&ag&&Y){w(ah,false);K(function(){ae+="";ag+="";var aj={};if(af&&typeof af===r){for(var al in af){aj[al]=af[al]}}aj.data=ab;aj.width=ae;aj.height=ag;var am={};if(ad&&typeof ad===r){for(var ak in ad){am[ak]=ad[ak]}}if(Z&&typeof Z===r){for(var ai in Z){if(typeof am.flashvars!=D){am.flashvars+="&"+ai+"="+Z[ai]}else{am.flashvars=ai+"="+Z[ai]}}}if(F(Y)){var an=u(aj,am,ah);if(aj.id==ah){w(ah,true)}X.success=true;X.ref=an}else{if(aa&&A()){aj.data=aa;P(aj,am,ah,ac);return}else{w(ah,true)}}if(ac){ac(X)}})}else{if(ac){ac(X)}}},switchOffAutoHideShow:function(){m=false},ua:M,getFlashPlayerVersion:function(){return{major:M.pv[0],minor:M.pv[1],release:M.pv[2]}},hasFlashPlayerVersion:F,createSWF:function(Z,Y,X){if(M.w3){return u(Z,Y,X)}else{return undefined}},showExpressInstall:function(Z,aa,X,Y){if(M.w3&&A()){P(Z,aa,X,Y)}},removeSWF:function(X){if(M.w3){y(X)}},createCSS:function(aa,Z,Y,X){if(M.w3){v(aa,Z,Y,X)}},addDomLoadEvent:K,addLoadEvent:s,getQueryParamValue:function(aa){var Z=j.location.search||j.location.hash;if(Z){if(/\?/.test(Z)){Z=Z.split("?")[1]}if(aa==null){return L(Z)}var Y=Z.split("&");for(var X=0;X<Y.length;X++){if(Y[X].substring(0,Y[X].indexOf("="))==aa){return L(Y[X].substring((Y[X].indexOf("=")+1)))}}}return""},expressInstallCallback:function(){if(a){var X=c(R);if(X&&l){X.parentNode.replaceChild(l,X);if(Q){w(Q,true);if(M.ie&&M.win){l.style.display="block"}}if(E){E(B)}}a=false}}}}();/*! http://mths.be/punycode by @mathias */
;(function(y){var e,a=typeof define=='function'&&typeof define.amd=='object'&&define.amd&&define,p=typeof exports=='object'&&exports,I=typeof module=='object'&&module,A=typeof require=='function'&&require,s=2147483647,l=36,n=1,q=26,i=38,m=700,o=72,h=128,G='-',d=/[^ -~]/,v=/^xn--/,r={overflow:'Overflow: input needs wider integers to process.',ucs2decode:'UCS-2(decode): illegal sequence',ucs2encode:'UCS-2(encode): illegal value','not-basic':'Illegal input >= 0x80 (not a basic code point)','invalid-input':'Invalid input'},g=l-n,B=Math.floor,x=String.fromCharCode,H;function z(J){throw RangeError(r[J])}function E(L,J){var K=L.length;while(K--){L[K]=J(L[K])}return L}function c(J,K){var L='.';return E(J.split(L),K).join(L)}function k(M){var L=[],K=0,N=M.length,O,J;while(K<N){O=M.charCodeAt(K++);if((O&63488)==55296){J=M.charCodeAt(K++);if((O&64512)!=55296||(J&64512)!=56320){z('ucs2decode')}O=((O&1023)<<10)+(J&1023)+65536}L.push(O)}return L}function D(J){return E(J,function(L){var K='';if((L&63488)==55296){z('ucs2encode')}if(L>65535){L-=65536;K+=x(L>>>10&1023|55296);L=56320|L&1023}K+=x(L);return K}).join('')}function f(J){return J-48<10?J-22:J-65<26?J-65:J-97<26?J-97:l}function w(K,J){return K+22+75*(K<26)-((J!=0)<<5)}function b(M,K,L){var J=0;M=L?B(M/m):M>>1;M+=B(M/K);for(;M>g*q>>1;J+=l){M=B(M/g)}return B(J+(g+1)*M/(M+i))}function C(K,J){K-=(K-97<26)<<5;return K+(!J&&K-65<26)<<5}function u(W){var M=[],P=W.length,R,S=0,L=h,T=o,O,Q,U,K,X,N,V,Z,J,Y;O=W.lastIndexOf(G);if(O<0){O=0}for(Q=0;Q<O;++Q){if(W.charCodeAt(Q)>=128){z('not-basic')}M.push(W.charCodeAt(Q))}for(U=O>0?O+1:0;U<P;){for(K=S,X=1,N=l;;N+=l){if(U>=P){z('invalid-input')}V=f(W.charCodeAt(U++));if(V>=l||V>B((s-S)/X)){z('overflow')}S+=V*X;Z=N<=T?n:(N>=T+q?q:N-T);if(V<Z){break}Y=l-Z;if(X>B(s/Y)){z('overflow')}X*=Y}R=M.length+1;T=b(S-K,R,K==0);if(B(S/R)>s-L){z('overflow')}L+=B(S/R);S%=R;M.splice(S++,0,L)}return D(M)}function j(V){var M,X,S,K,T,R,N,J,Q,Z,W,L=[],P,O,Y,U;V=k(V);P=V.length;M=h;X=0;T=o;for(R=0;R<P;++R){W=V[R];if(W<128){L.push(x(W))}}S=K=L.length;if(K){L.push(G)}while(S<P){for(N=s,R=0;R<P;++R){W=V[R];if(W>=M&&W<N){N=W}}O=S+1;if(N-M>B((s-X)/O)){z('overflow')}X+=(N-M)*O;M=N;for(R=0;R<P;++R){W=V[R];if(W<M&&++X>s){z('overflow')}if(W==M){for(J=X,Q=l;;Q+=l){Z=Q<=T?n:(Q>=T+q?q:Q-T);if(J<Z){break}U=J-Z;Y=l-Z;L.push(x(w(Z+U%Y,0)));J=B(U/Y)}L.push(x(w(J,0)));T=b(X,O,S==K);X=0;++S}}++X;++M}return L.join('')}function t(J){return c(J,function(K){return v.test(K)?u(K.slice(4).toLowerCase()):K})}function F(J){return c(J,function(K){return d.test(K)?'xn--'+j(K):K})}e={version:'1.0.0',ucs2:{decode:k,encode:D},decode:u,encode:j,toASCII:F,toUnicode:t};if(p){if(I&&I.exports==p){I.exports=e}else{for(H in e){e.hasOwnProperty(H)&&(p[H]=e[H])}}}else{if(a){define('punycode',e)}else{y.punycode=e}}}(this));(function(a){(jQuery.browser=jQuery.browser||{}).mobile=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))})(navigator.userAgent||navigator.vendor||window.opera);var PushClient={};
PushClient.a=function(){return navigator.userAgent&&navigator.userAgent.indexOf("ANTGalio")!==-1?"Opera":navigator.userAgent&&navigator.userAgent.indexOf("Chrome")!==-1&&navigator.userAgent.indexOf("WebKit")!==-1?"WebKit Chrome":navigator.userAgent&&navigator.userAgent.indexOf("Android")!==-1?"WebKit Android":navigator.userAgent&&navigator.userAgent.indexOf("iPhone")!==-1?"WebKit iPhone":navigator.userAgent&&navigator.userAgent.indexOf("WebKit")!==-1?"WebKit":navigator.userAgent&&navigator.userAgent.indexOf("MSIE")!==
-1?"IE":navigator.userAgent&&navigator.userAgent.indexOf("Gecko")!==-1?"Gecko":navigator.userAgent&&navigator.userAgent.indexOf("Opera Mobi")!==-1?"Opera Mobile":navigator.userAgent&&navigator.userAgent.indexOf("Opera Mini")!==-1?"unknown":window.opera?"Opera":"unknown"};PushClient.b=function(a){if(!document.body)throw"Error: The document doesn't have a body!";var b=true;if(this.c==="unknown"){b=false;if(a)if(this.d===null)throw"Error: Browser not supported!";else this.d(this.NOTIFY_UNSUPPORTED_BROWSER)}return b};
PushClient.e=function(){if(document.readyState==="complete")this.f();else if(document.addEventListener){document.addEventListener("DOMContentLoaded",this.f,false);window.addEventListener("load",this.f,false)}else if(document.attachEvent){document.attachEvent("onreadystatechange",this.f);window.attachEvent("onload",this.f);var a=false;try{a=window.frameElement==null}catch(b){}document.documentElement.doScroll&&a&&this.g()}};
PushClient.g=function(){if(!PushClient.h){try{document.documentElement.doScroll("left")}catch(a){setTimeout(PushClient.g,1);return}PushClient.f()}};PushClient.i=function(a){this.h?a():this.j.push(a)};PushClient.f=function(){if(!PushClient.h)if(document.body){PushClient.h=true;for(var a=0;a<PushClient.j.length;a++)PushClient.j[a]();PushClient.j=null}else setTimeout(PushClient.f,13)};
PushClient.k=function(a){var b=window.location.protocol,c=window.location.host,d=window.location.port;if(c.indexOf("localhost")===0)return{l:"localhost:80",m:a+"/"};if(d.length>0&&c.lastIndexOf(":")!==-1)c=c.substring(0,c.lastIndexOf(":"));var e=a.indexOf("//");if(e===-1)return null;var f=a.substring(0,e);if(b!==f)return null;a=a.substring(f.length+2);e=a.indexOf("/");if(e!==-1)a=a.substring(0,e);e=a.lastIndexOf(":");b="";if(e!==-1){b=a.substring(e+1);a=a.substring(0,e)}if(navigator.userAgent&&
navigator.userAgent.indexOf("ANTGalio")!==-1){e=80;if(f==="https:")e=443;if(b!==""&&b!==e&&d!==e)if(b!==d)return null}else if(b!==d)return null;if(a.length<4)return null;var g=-1;e=a.length-1;for(var i=c.length-1;e>=0&&i>=0;e--,i--)if(a.charAt(e)!==c.charAt(i)){g=e;break}d="";if(g===-1)if(e===-1&&i===-1){e=a.indexOf(".");d=a.substring(e+1)}else if(e===-1)if(c.charAt(i-1)===".")d=a;else{e=a.indexOf(".");if(e===-1)return null;d=a.substring(e+1)}else{if(i===-1)if(a.charAt(e-1)===".")d=c;else{e=c.indexOf(".");
if(e===-1)return null;d=c.substring(e+1)}}else{e=a.indexOf(".",g+1);if(e===-1)return null;d=a.substring(e+1)}if(d.length<4||d.indexOf(".")===-1)return null;d+=b.length>0?":"+b:"";a=f+"//"+a+(b.length>0?":"+b:"")+"/";if(this.n>=2){c=d.split(".");if(c.length>=this.n)d=c.slice(-1*this.n).join(".")}return{l:d,m:a}};PushClient.o=function(a){return this.k(a)===null};
PushClient.p=function(a,b){if(a.name)a=a.name;else{var c=a.toString();a=c.substring(c.indexOf("function")+8,c.indexOf("("));a=a.replace(/^\s+|\s+$/g,"");if(a.length===0)a="anonymous";if(a==="anonymous"&&typeof b==="object")for(var d=0;d<b.length;d++)for(var e in b[d])if(b[d].hasOwnProperty(e)&&typeof b[d][e]==="function")if(b[d][e].toString()===c)return e}return a};
PushClient.q=function(a){if(a===null||a===undefined||typeof a==="number"||typeof a==="boolean")return a;else if(typeof a==="string")return'"'+a+'"';else if(typeof a==="function")return this.p(a,this)+"()";else if(a instanceof Array)return this.r(a);var b="{",c=0;for(var d in a){if(c>0)b+=", ";if(a.hasOwnProperty(d))b+=d+":"+this.q(a[d]);c++}b+="}";return b};
PushClient.s=function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(a){var b=Math.random()*16|0;return(a=="x"?b:b&3|8).toString(16)})};
PushClient.t=function(a,b){var c=PushClient.u;if(a>0){if(a<=this.v)c=a*PushClient.w-Math.floor(Math.random()*PushClient.w);else if(PushClient.x===PushClient.TRUNCATED_EXPONENTIAL_BACKOFF){a=a-this.v;c=Math.min(PushClient.y*Math.pow(2,a)-Math.floor(Math.random()*PushClient.y*a),PushClient.z)}else c=PushClient.y;if(b!==undefined&&c<PushClient.u)c=PushClient.u}return c};
PushClient.a0=function(a,b){for(var c=0;c<a.length;c++)if(a[c]===b)return c;return-1};PushClient.a1=function(a){for(var b=[],c=0;c<a.length;c++)b.push(a[c]);return b};PushClient.a2=function(a,b){for(var c=[],d=0;d<a.length;d++)this.a0(b,a[d])===-1&&c.push(a[d]);return c};PushClient.a3=function(a,b){for(var c=[],d=0;d<a.length;d++)this.a0(b,a[d])!==-1&&c.push(a[d]);return c};
PushClient.a4=function(a,b){for(var c=this.a1(a),d=0;d<b.length;d++)this.a0(a,b[d])===-1&&c.push(b[d]);return c};
PushClient.a5=function(a,b,c,d,e){var f=this.p(arguments.callee.caller,this);if(typeof a!=="object"||typeof a.length!=="number")throw"Error: "+f+". The argument should be a list!";if(c!==null&&a.length<c)throw"Error: "+f+". The list argument should have at minimum "+c+" elements!";if(b!==null)for(var g=0;g<a.length;g++)if(typeof a[g]!==b)throw"Error: "+f+". The list argument should contain only '"+b+"' elements, the "+g+"-th element is not of type '"+b+"'!";if(typeof d==="object"&&typeof d.test===
"function")for(g=0;g<a.length;g++)if(!d.test(a[g]))throw"Error: "+f+". "+e+". The "+g+"-th element is the cause of the error!";};PushClient.r=function(a){for(var b="[",c=0;c<a.length;c++){if(c>0)b+=", ";b+=this.q(a[c])}b+="]";return b};
PushClient.a6=function(a,b){if(a===this.a7.a8)this.a9(b);else if(a===this.a7.aa)this.ab(b);else if(a===this.a7.ac)this.ad(b);else if(this.ae!==null)if(this.ae.af===this.ag&&a===this.a7.ag)this.ah(b);else if(this.ae.af===this.ai&&a===this.a7.ai)this.aj(b);else this.ae.af===this.ak&&a===this.a7.ak&&this.al(b)};
PushClient.ah=function(a){var b=a[this.a7.am];if(b!==undefined)this.an(this.ao,this.ap.aq[b]);else{if(this.ar!==this.as){b=a[this.a7.at];if(b===undefined){PushClient.an(this.ao,"server subscribe response is missing the session id");return}this.au=b;b=a[this.a7.av];if(b!==undefined&&b!==null)if(b==1)PushClient.aw=true;this.ax=a[this.a7.ay];a=this.ar;this.ar=this.as;this.b0=this.az=0;this.b1();if(a!==this.b2){this.b3.b4[this.b5].b6++;if(a===null||this.b7)this.b8({type:this.NOTIFY_SERVER_UP,
info:""})}else this.b3.b4[this.b5].b9++;this.b7=false}this.ba()}};PushClient.aj=function(a){a=a[this.a7.am];a!==undefined?this.an(this.ao,this.ap.aq[a]):this.ba()};
PushClient.a9=function(a){for(var b=[],c=0,d=0;d<a.length;d++){var e=a[d],f=this.a7.bb,g=this.a7.bc,i=this.a7.bd,k=this.a7.be,l=this.a7.bf;if(e[f]===undefined||e[g]===undefined)return;var j=false;if(e[l]!==undefined)if(e[l]==this.bg)j=true;l=[];i=e[i];k=e[k];if(i!==undefined&&k!=undefined)if(i instanceof Array)for(var m=0;m<i.length;m++)l[m]={name:i[m],value:k[m]};else l[0]={name:i,value:k};f={subject:e[f],content:e[g],fields:l,isSnapshot:j};g=this.a7.bh;if(e[g]!==undefined){g=((new Date).getTime()&
16777215)-e[g];if(g>-14400000)f.latency=g}if(PushClient.aw==true&&this.bi[f.subject]===undefined){g=parseInt(e[this.a7.bj]);e=parseInt(e[this.a7.bk]);j=this.bl[f.subject];if(j===undefined){this.bl[f.subject]={seqid:7E4,seq:0,recovery:false};j=this.bl[f.subject]}else j.seq++;if(j.seqid!==g){j.seqid=g;j.seq=e;j.recovery=false}else if(j.seq!==e)if(j.recovery==false){j.seq--;if(e<=j.seq)continue;PushClient.bm();return}else{j.recovery=false;if(e>j.seq){g={type:this.NOTIFY_DATA_RESYNC,
info:f.subject};this.b8(g)}else continue;j.seq=e}else if(j.recovery==true){j.recovery=false;g={type:this.NOTIFY_DATA_SYNC,info:f.subject};this.b8(g)}}b[c]=f;c++}if(c>0){this.b3.b4[this.b5].bn++;this.b8(b)}};PushClient.an=function(a,b){a=a+", "+b;b=this.b3.b4[this.b5].aq;if(b[a]===undefined)b[a]=1;else b[a]++;this.b0++;this.bm()};
PushClient.ab=function(a){var b=this.a7.bo,c=this.a7.bb;if(!(a[b]===undefined||a[c]===undefined))switch(a[b]){case "a":a={type:this.NOTIFY_SUBSCRIBE_ALLOW,info:a[c]};this.b8(a);break;case "d":a={type:this.NOTIFY_SUBSCRIBE_DENY,info:a[c]};this.b8(a);break}};
PushClient.b8=function(a){this.bp.push(a);setTimeout(function(){var b=PushClient.bp.shift();if(b&&b instanceof Array)PushClient.bq.call(window,b);else PushClient.d!==null&&PushClient.d.call(window,b)},0)};PushClient.al=function(a){this.ad(a);this.ba()};PushClient.ad=function(a){var b=a[this.a7.br];a=a[this.a7.bo];b!==undefined&&b!==null&&this.b8({type:PushClient.bs(a),info:b})};
PushClient.bs=function(a){if(a===undefined||a===null)return PushClient.NOTIFY_PUBLISH_FAILED;switch(a){case "NOT_SUBSCRIBED":return PushClient.NOTIFY_PUBLISH_NO_SUBSCRIBER;case "OK":return PushClient.NOTIFY_PUBLISH_OK;case "DENY":return PushClient.NOTIFY_PUBLISH_DENIED;default:return PushClient.NOTIFY_PUBLISH_FAILED}};
PushClient.bt=function(){this.b3.bu=(new Date).getTime();this.b3.b4[this.b5].bv++;this.bw!==null&&this.b1();this.ae!==null&&this.ae.af===this.bx&&this.ba();var a=(new Date).getTime();if(a-this.by>=this.bz){this.by=a;a={};a.af=this.bx;this.c0(a)}};PushClient.b1=function(){this.bw!==null&&clearTimeout(this.bw);this.bw=setTimeout(function(){PushClient.b0++;PushClient.bm()},this.c1)};
PushClient.bm=function(){this.b3.b4[this.b5].c2++;if(this.c3!==null){clearTimeout(this.c3);this.c3=null}this.c4();this.c5();this.c6();if(this.ar!==null)this.ar=this.c7;this.c8.push(this.c9[this.b5]);this.ax=this.au=this.b5=null;this.az++;if(this.bw!==null){clearTimeout(this.bw);this.bw=null}if(!this.b7&&(this.az===this.ca||this.az===this.c9.length)){this.b7=true;var a={type:this.NOTIFY_SERVER_DOWN,info:""};PushClient.d!==null&&PushClient.d.call(window,a)}a=false;if(PushClient.aw==
true){a=true;for(var b in this.bl){var c=this.bl[b];if(c.seqid!=7E4)if(c.recovery==true)a=false;else c.recovery=true}}if(PushClient.cb)if(this.c9.length>0){b={};b.af=this.cc;this.c0(b)}PushClient.cd=false;if(this.ce.length>0){b={};b.af=this.ag;if(a==true)b.cf=true;b.ce=this.ce;this.c0(b)}};
PushClient.cg=function(){this.ch();var a=this.c9[this.b5].m;if(PushClient.cb){encoding=this.ci;transport=this.cj}if("/"!==a.substring(a.length-1,a.length))a+="/";var b=PushClient.t(this.b0,this.cc);this.ck=setTimeout(function(){PushClient.ck=null;PushClient.an(PushClient.cl,PushClient.ae.af)},b);transport.call(this,a,this.b5,null)};
PushClient.cm=function(){this.ch();var a=false,b=this.c9[this.b5].m,c=this.o(b),d=null;if(!PushClient.cd&&PushClient.cn!=="")d=PushClient.cn;if(!PushClient.cb){if(!this.co||!c)b=this.cp(b);if(!c&&!this.cq(b,this.b5))return}this.ce=this.a4(this.ce,this.ae.ce);var e=c&&!this.cr?this.cs:null,f=null,g=null,i=this.ct,k=this.a7,l=null,j=null;if(PushClient.cb){i=this.cu;e=this.ci}else if(this.c==="IE"&&c&&PushClient.cv){i=this.cw;k=this.cx;e=
this.cy}if(this.ar!==this.as){if(!PushClient.cb)if(this.c==="IE"&&!c)if(this.cz){e=this.d0;i=this.d1}else{e=this.d2;f="PushClient0.d3";g=this.d4;i=this.d5;k=this.cx}else if(this.c==="IE"&&PushClient.cv&&this.cz){a=true;e=this.d0;i=this.d6;k=this.cx}else{i=this.d7;if(this.c==="WebKit Android")i=this.d8;e=c&&!this.cr?this.cs:i;i=this.d9}l=navigator.userAgent;j=this.da}var m=null;if(this.ae.db!==undefined&&this.ae.db!==null)m=this.ae.db;c="";for(var h=0;h<this.ae.ce.length;h++){if(h>
0)g=f=null;if(!PushClient.cd)PushClient.cd=true;c+=this.dc(this.ae.ce[h],e,f,g,this.au,k,this.ae.cf,d,a,l,j,m);j=l=null}if("/"!==b.substring(b.length-1,b.length))b+="/";a=PushClient.u;if(PushClient.cb===false)a=PushClient.t(this.b0,this.ag);this.ck=setTimeout(function(){PushClient.ck=null;PushClient.an(PushClient.cl,PushClient.ae.af)},a);i.call(this,b,this.b5,c)};
PushClient.dd=function(){this.ch();var a=this.c9[this.b5].m,b=this.o(a);if(!PushClient.cb){if(!this.co||!b)a=this.cp(a);if(!b&&!this.cq(a,this.b5))return}this.ce=this.a2(this.ce,this.ae.ce);if(this.ar!==this.as){this.ba();for(b=0;b<this.ae.ce.length;b++)delete this.bi[this.ae.ce[b]]}else{var c=b&&!this.cr?this.cs:null,d=this.ct,e=this.a7;if(PushClient.cb){c=this.ci;d=this.cu}else if(this.c==="IE"&&b&&PushClient.cv&&this.cz){d=this.cw;e=this.cx;c=this.cy;if("/"!==
a.substring(a.length-1,a.length))a+="/"}var f="";for(b=0;b<this.ae.ce.length;b++){f+=this.de(this.ae.ce[b],c,this.au,e);delete this.bi[this.ae.ce[b]]}this.ck=setTimeout(function(){PushClient.ck=null;PushClient.an(PushClient.cl,PushClient.ae.af)},this.u);d.call(this,a,this.b5,f)}};
PushClient.df=function(){this.ch();var a=this.c9[this.b5].m,b=this.o(a);if(!PushClient.cb){if(!this.co||!b)a=this.cp(a);if(!b&&!this.cq(a,this.b5))return}if(this.ar!==this.as)this.ba();else{var c=b&&!this.cr?this.cs:null,d=this.ct,e=this.a7,f=this.ax;if(PushClient.cb){c=this.ci;d=this.cu;f=null}else if(this.c==="IE"&&b&&PushClient.cv&&this.cz){d=this.cw;e=this.cx;c=this.cy;if("/"!==a.substring(a.length-1,a.length))a+="/"}b=PushClient.dg(this.au,e,c,f);
this.ck=setTimeout(function(){PushClient.ck=null;PushClient.an(PushClient.cl,PushClient.ae.af)},this.u);d.call(this,a,this.b5,b)}};
PushClient.dh=function(){this.ch();var a=this.c9[this.b5].m,b=this.o(a);if(!PushClient.cb){if(!this.co||!b)a=this.cp(a);if(!b&&!this.cq(a,this.b5))return}var c=b&&!this.cr?this.cs:null,d=this.ct,e=this.a7;if(this.ar!==this.as){a=this.ae.di.closure;a!==undefined&&a!==null&&this.b8({type:PushClient.NOTIFY_PUBLISH_FAILED,info:a});this.ba()}else{var f=this.cn,g=this.ax;if(PushClient.cb){d=this.cu;c=this.ci;g=f=null}else if(this.c==="IE"&&b&&PushClient.cv){d=
this.cw;e=this.cx;c=this.cy}if(this.ar===this.as){b=this.dj(this.ae.di,c,this.au,e,f,g);if("/"!==a.substring(a.length-1,a.length))a+="/";this.ck=setTimeout(function(){PushClient.ck=null;PushClient.an(PushClient.cl,PushClient.ae.af)},this.u);d.call(this,a,this.b5,b)}}};PushClient.ba=function(){if(this.dk.length!==0){this.dk.shift();this.c5();this.dl(false)}};PushClient.c0=function(a){this.dk.push(a);this.dm(false)};
PushClient.dl=function(a){this.dk.length!==0&&setTimeout(function(){PushClient.dm(a)},0)};PushClient.dm=function(a){if(this.dn)if(this.b(true))if(!(!a&&(this.ae!==null||this.dk.length===0))){this.ae=this.dk[0];switch(this.ae.af){case this.ag:this.cm();break;case this.ai:this.dd();break;case this.bx:this.df();break;case this.cc:this.cg();break;case this.ak:this.dh();break}}};PushClient.dp=function(){this.dn=true;this.dl(false)};
PushClient.c4=function(){for(;this.dk.length>0;){var a=this.dk[0];switch(a.af){case this.ag:var b=a.dq;a=this.a2(a.ce,this.ce);if(a.length>0){this.ce=this.a4(this.ce,a);for(var c=0;c<a.length;c++){this.bl[a[c]]={seqid:7E4,seq:0,recovery:false};if(b!==undefined&&b!==null&&b>=100){b=Math.floor(b/100)*100;this.bi[a[c]]=b}}}break;case this.ai:a=this.a3(a.ce,this.ce);if(a.length>0){this.ce=this.a2(this.ce,a);for(c=0;c<a.length;c++){delete this.bi[a[c]];delete this.bl[a[c]]}}break;case this.ak:if(a.di.closure!==
undefined&&a.di.closure!==null){b={type:this.NOTIFY_PUBLISH_FAILED,info:a.di.closure};PushClient.d!==null&&PushClient.d.call(window,b)}break}this.dk.shift()}};PushClient.c5=function(){this.ae=null;if(this.ck!==null){clearTimeout(this.ck);this.ck=null}if(this.dr!==null&&this.dr.readyState&&this.dr.readyState!==4){if(typeof XMLHttpRequest!=="undefined")this.dr.aborted=true;this.dr.abort()}this.dr!==null&&delete this.dr;this.dr=null};
PushClient.c6=function(){if(this.ds!==null){clearTimeout(this.ds);this.ds=null}if(this.dt!==null)if(this.dt.du!=="HTML5")if(this.dt.du==="XDR_HTML5"){var a=document.getElementById("PushClient1");a!==null&&a.contentWindow.postMessage("disconnect","*")}else if(this.dt.getElementById){a=this.dt.getElementById("dv");if(a!==null){a.src="";this.dt.body.removeChild(a);delete a}delete this.dt;this.dt=null;CollectGarbage()}else{if(PushClient.cb)this.dt.close();else{if(this.dt.dw!==
undefined){clearTimeout(this.dt.dw);this.dt.dw=undefined}this.dt.readyState&&this.dt.readyState!==4&&this.dt.abort();this.dt.du==="XDR_STREAM"&&this.dt.abort()}delete this.dt;this.dt=null}};PushClient.dx=function(){this.c5();this.c6();this.b5=null;this.c9=[];this.b3.b4=[];this.ar=null;this.ce=[];this.bi={};this.ax=this.au=null;this.c8=[];this.az=0;this.dy=this.b7=false;this.dk=[];this.bi={};this.bl={};this.aw=this.cd=false;if(this.bw!==null){clearTimeout(this.bw);this.bw=null}};
PushClient.dz=function(){if(this.o(this.c9[this.b5].m)&&!this.cr){if(this.ds!==null){clearTimeout(this.ds);this.ds=null}if(this.dt!==null){this.dt.responseText="";this.dt.e0=0}}else{this.ar=this.b2;this.c6();this.ax=this.au=null;PushClient.cd=false;if(this.ce.length>0){var a={};a.af=this.ag;if(PushClient.aw==true)a.cf=true;a.ce=this.ce;this.c0(a)}}};PushClient.ch=function(){if(this.b5===null)this.b5=this.e1()};
PushClient.e1=function(){var a=this.a2(this.c9,this.c8);if(a.length===0){this.c8=[];a=this.c9}if(a.length===0)throw"Error: e1() No available servers!";for(var b=0,c=0;c<a.length;c++)b+=a[c].e2;var d=-1;if(b===0)d=Math.floor(a.length*Math.random());else{var e=Math.floor(b*Math.random());for(c=b=0;c<a.length;c++){b+=a[c].e2;if(b>e){d=c;break}}}return this.a0(this.c9,a[d])};
PushClient.cp=function(a){var b=this.k(a);if(b===null||this.d4!==null&&b.l!==this.d4)throw"Error: Invalid common parent domain of the servers! Cause server is '"+a+"'.";if(this.d4===null){this.d4=b.l;if(b.l.indexOf(":")===-1)document.domain=b.l}return b.m};PushClient.cq=function(a,b){var c="PushClient2"+b;if(window.frames[c]===undefined||window.frames[c].e3===undefined){this.e4(a,b);return false}return true};
PushClient.e4=function(a,b){b="PushClient2"+b;var c=document.getElementById(b);if(!c){c=document.createElement("iframe");c.name=b;c.id=b;c.style.display="none";document.body.appendChild(c)}this.ck=setTimeout(function(){PushClient.ck=null;c.src="";c.parentNode.removeChild(c);PushClient.an(PushClient.cl,"iframe")},this.u);if("/"!==a.substring(a.length-1,a.length))a+="/";c.src=a+"_"+this.e5(this.d4,"e3","PushClient.e6")};
PushClient.e6=function(){clearTimeout(this.ck);this.ck=null;this.dl(true)};PushClient.e7=function(a){return this.cr?new XMLHttpRequest:this.e8(a)};
PushClient.e8=function(a){if(a){if(this.e9)this.e9.responseText="";else this.e9={open:function(b,c){b=PushClient.ea(c);PushClient.eb.connect("0",b.host,b.port,"PushClient.ec")},setRequestHeader:function(){},send:function(b){PushClient.eb.write("0","POST / HTTP/1.1\r\nContent-Length: "+b.length+"\r\n\r\n"+b)},readyState:4,status:200,responseText:"",abort:function(){this.responseText="";PushClient.eb.close("0")}};return this.e9}if(this.ed)this.ed.responseText=
"";else this.ed={open:function(b,c){b=PushClient.ea(c);PushClient.eb.connect("1",b.host,80,"PushClient.ee")},setRequestHeader:function(){},send:function(b){PushClient.eb.write("1","POST / HTTP/1.1\r\nContent-Length: "+b.length+"\r\n\r\n"+b)},readyState:4,status:200,responseText:"",abort:function(){this.responseText="";PushClient.eb.close("1")}};return this.ed};
PushClient.ea=function(a){var b,c;b=a.indexOf("https://")==0?"https://":"http://";a=a.substring(b.length);var d=a.indexOf("/");if(d!=-1){c=a.substring(0,d);a.substring(d)}else c=a;d=c.lastIndexOf(":");if(d!=-1){a=c.substring(d+1);c=c.substring(0,d)}else a=b=="https://"?"443":"80";return{host:c,port:a}};PushClient.ee=function(a){if(this.dr){this.dr.responseText+=a;this.ef()}};PushClient.ec=function(a){if(this.dt){this.dt.responseText+=a;this.eg()}};
PushClient.eh=function(){this.b(false);var a=document.createElement("div");document.body.appendChild(a);var b=document.createElement("div");b.id="PushClient3";a.appendChild(b);setTimeout(function(){var c="flash-transport.swf";if(typeof PushClientFlashTransport==="string")c=PushClientFlashTransport;swfobject.embedSWF(c,"PushClient3","0","0","9",false,{readyCallback:"PushClient.ei"},{allowFullScreen:false,allowScriptAccess:"always"},{id:"PushClient4",
name:"PushClient4"})},0)};PushClient.ei=function(){PushClient.eb=document.getElementById("PushClient4");if(!PushClient.eb)throw"Error: Could not get the reference of the flash-transport.swf!";PushClient.dp()};
PushClient.cw=function(a,b,c){b=document.getElementById("PushClient5");if(b===null){b=document.createElement("iframe");b.id="PushClient5";b.style.display="none";document.body.appendChild(b)}var d=(new Date).getTime();b.src=a+"_"+c+d};
PushClient.d5=function(a,b,c){this.dt=new ActiveXObject("htmlfile");this.dt.open();PushClient.d4.indexOf(":")===-1?this.dt.write("<html><head><script>document.domain='"+PushClient.d4+"';<\/script></head><body></body></html>"):this.dt.write("<html><head></head><body></body></html>");this.dt.close();this.dt.parentWindow.PushClient0=this;b=this.dt.createElement("iframe");b.id="dv";this.dt.body.appendChild(b);this.dt.ej=0;b.src=a+"_"+c};
PushClient.d3=function(a){PushClient.ek(a);PushClient.dt.ej+=a.length;PushClient.dt.ej>=PushClient.el&&PushClient.ae===null&&PushClient.ar!==PushClient.b2&&PushClient.dz()};
PushClient.d6=function(a,b,c){this.dt={};this.dt.du="XDR_HTML5";PushClient.ej=0;b=document.getElementById("PushClient1");if(b===null){b=document.createElement("iframe");b.id="PushClient1";b.style.display="none";document.body.appendChild(b)}var d=(new Date).getTime();b.src=a+"_"+c+d};
PushClient.em=function(a){if(a.data.indexOf(PushClient.a7.en)!==-1){PushClient.ek(a.data);PushClient.ej+=a.data.length;PushClient.ej>=PushClient.el&&PushClient.ae===null&&PushClient.ar!==PushClient.b2&&PushClient.dz()}};
PushClient.d1=function(a,b,c){window.frames["PushClient2"+b].e3("window.parent.PushClient.dt = new XDomainRequest();");this.dt.e0=0;this.dt.du="XDR_STREAM";this.dt.onload=function(){PushClient.eo()};this.dt.onprogress=function(){PushClient.eo()};this.dt.onerror=function(){};this.dt.ontimeout=function(){};try{this.dt.open("POST",a);this.dt.send(c)}catch(d){}};
PushClient.eo=function(){var a=this.dt;if(a.responseText){for(var b=a.responseText.substring(a.e0),c=b.indexOf(this.a7.ep);c!==-1;){b=b.substring(0,c);this.ek(b);a.e0+=c+1;b=a.responseText.substring(a.e0);c=b.indexOf(this.a7.ep)}a.e0>=this.el&&this.ae===null&&this.ar!==this.b2&&this.dz()}};
PushClient.d9=function(a,b,c){var d=this.o(a);if(d)this.dt=this.e7(true);else window.frames["PushClient2"+b].e3("window.parent.PushClient.dt = new XMLHttpRequest();");this.dt.e0=0;this.dt.onreadystatechange=function(){PushClient.eg()};this.dt.open("POST",a,true);d&&this.c.indexOf("WebKit")===0&&this.dt.setRequestHeader("Content-Type","text/plain");this.dt.send(c)};
PushClient.eg=function(){var a=this.dt;if(!(a===null||a.readyState!==3&&a.readyState!==4||a.status!==200)){if(this.c.indexOf("Opera")!==-1){this.dt.dw!==undefined&&clearTimeout(this.dt.dw);this.dt.dw=setTimeout(function(){PushClient.dt.dw=undefined;PushClient.eg()},this.eq)}if(a.responseText){for(var b=a.responseText.substring(a.e0),c=b.indexOf(this.a7.ep);c!==-1;){b=b.substring(0,c);this.ek(b);a.e0+=c+1;b=a.responseText.substring(a.e0);c=b.indexOf(this.a7.ep)}a.e0>=this.el&&
this.ae===null&&this.ar!==this.b2&&this.dz()}}};PushClient.er=function(){if(typeof XMLHttpRequest==="undefined"){try{return new ActiveXObject("Msxml2.XMLHTTP.6.0")}catch(a){}try{return new ActiveXObject("Msxml2.XMLHTTP.3.0")}catch(b){}try{return new ActiveXObject("Msxml2.XMLHTTP")}catch(c){}throw"Error: The browser does not support XMLHttpRequest!";}else return new XMLHttpRequest};
PushClient.ct=function(a,b,c){var d=this.o(a);if(d)this.dr=this.e7(false);else window.frames["PushClient2"+b].e3("window.parent.PushClient.dr = ("+this.er.toString()+")();");this.dr.onreadystatechange=function(){PushClient.ef()};this.dr.open("POST",a,true);d&&this.c.indexOf("WebKit")===0&&this.dr.setRequestHeader("Content-Type","text/plain");if(this.c.indexOf("IE")===0){this.dr.setRequestHeader("Content-Type","text/plain");this.dr.setRequestHeader("Connection",
"close")}this.dr.send(c)};PushClient.ef=function(){var a=this.dr;a===null||typeof XMLHttpRequest!=="undefined"&&typeof a.aborted!=="undefined"&&a.aborted!==null&&a.aborted==true||a===null||a.readyState!==4||a.status!==200||a.responseText&&this.ek(a.responseText)};
PushClient.cj=function(a){a=a.substring(0,a.indexOf("://"))==="http"?"ws://"+a.substring(a.indexOf("://")+3)+"WebSocketConnection":"wss://"+a.substring(a.indexOf("://")+3)+"WebSocketConnection-Secure";this.dt=PushClient.es(a);this.et=PushClient.s();this.dt.eu=this.et;this.dt.onmessage=function(b){PushClient.ev(b.data)};this.dt.onopen=function(){PushClient.ba()};this.dt.onclose=function(){if(PushClient.ew!=false)if(PushClient.et===this.eu){PushClient.c5();
PushClient.b0++;var b=PushClient.t(PushClient.b0);PushClient.c3=setTimeout(function(){PushClient.bm()},b)}}};PushClient.es=function(a){if(window.WebSocket)return new WebSocket(a);else if(window.MozWebSocket)return new MozWebSocket(a);return null};PushClient.cu=function(a,b,c){this.dt!=null&&this.dt.readyState===1&&this.dt.send(c)};
PushClient.ev=function(a){var b=PushClient.dt;if(!(b===null||b.readyState!==1))if(a){b=a;for(var c=b.indexOf(PushClient.a7.ep);c!==-1;){b=b.substring(0,c);PushClient.ek(b);b=a.substring(c+1);c=b.indexOf(PushClient.a7.ep)}}};
PushClient.ek=function(a){for(var b=0,c=[],d="\u0000",e={},f=0;;){var g=a.indexOf(this.a7.en,b);if(g===-1)break;if(g-b>0){b=a.substring(b,g);d=b.charAt(0);e=this.ex(b);if(d===this.a7.a8){c[f]=e;f++}else this.a6(d,e)}b=g+1}f>0&&d!=="\u0000"&&this.a6(d,c);this.bt()};
PushClient.ex=function(a){if(this.a7.ey[a.charAt(0)]!==undefined){for(var b=1,c={};;){if(b>=a.length)break;var d=a.charAt(b),e=a.indexOf(this.a7.ez,b+1);if(e===-1)return c;if(this.a7.f0[d]!==undefined){b++;var f="";switch(this.a7.f1[d]){case this.ap.f2:f=this.f3(this.a7,a.substring(b,e));break;case this.ap.f4:f=PushClient.f5(this.a7,a.substring(b,e));break}b=c[d];if(b===undefined)c[d]=f;else if(c[d]instanceof Array)c[d][c[d].length]=f;else{c[d]=[];c[d][0]=b;c[d][1]=f}}b=e+1}return c}};
PushClient.e5=function(a,b,c){var d="";d+=this.cx.f6;d+=this.cx.f7;d+=this.f8(this.cx,a);d+=this.cx.ez;d+=this.cx.f9;d+=this.f8(this.cx,b);d+=this.cx.ez;d+=this.cx.fa;d+=this.f8(this.cx,c);d+=this.cx.ez;d+=this.cx.en;return d};
PushClient.dc=function(a,b,c,d,e,f,g,i,k,l,j,m){var h="";h+=k?f.fb:f.ag;h+=f.bb;h+=this.f8(f,a);h+=f.ez;if(b!==null){h+=f.fc;h+=this.fd(f,b);h+=f.ez;if(this.c.indexOf("Opera")!==-1){h+=f.fe;h+=this.fd(f,1);h+=f.ez}}if(this.bi[a]!==undefined){h+=f.ff;h+=this.fd(f,this.bi[a]);h+=f.ez}if(c!==null){h+=f.fa;h+=this.f8(f,c);h+=f.ez}if(i!==null){h+=f.fg;h+=this.f8(f,i);h+=f.ez}if(d!==null){h+=f.f7;h+=this.f8(f,d);h+=f.ez}if(e!==null){h+=f.at;h+=this.fd(f,e);h+=f.ez}if(g!==undefined)if(this.bl[a]!==
undefined&&this.bl[a].seqid!==7E4){h+=f.bj;h+=this.fd(f,this.bl[a].seqid);h+=f.ez;h+=f.bk;h+=this.fd(f,this.bl[a].seq+1);h+=f.ez}if(l!==null){h+=f.fh;h+=this.f8(f,l);h+=f.ez}if(j!==null){h+=f.fi;h+=this.fd(f,j);h+=f.ez}if(m!==null){h+=f.fj;h+=this.fd(f,m);h+=f.ez}h+=f.en;return h};
PushClient.de=function(a,b,c,d){var e="";e+=d.ai;e+=d.bb;e+=this.f8(d,a);e+=d.ez;if(this.bi[a]!==undefined){e+=d.ff;e+=this.fd(d,this.bi[a]);e+=d.ez}if(c!==null){e+=d.at;e+=this.fd(d,c);e+=d.ez}if(b!==null){e+=d.fc;e+=this.fd(d,b);e+=d.ez}e+=d.en;return e};PushClient.dg=function(a,b,c,d){var e="";e+=b.bx;e+=b.at;e+=this.fd(b,a);e+=b.ez;if(c!==null){e+=b.fc;e+=this.fd(b,c);e+=b.ez}if(d!==null){e+=b.ay;e+=this.fd(b,d);e+=b.ez}e+=b.en;return e};
PushClient.dj=function(a,b,c,d,e,f){var g="";g+=d.ak;g+=d.bb;g+=this.f8(d,a.subject);g+=d.ez;g+=d.bc;g+=this.f8(d,a.content);g+=d.ez;if(a.closure!==undefined&&a.closure!==null){g+=d.br;g+=this.f8(d,a.closure);g+=d.ez}if(a.fields!==undefined&&a.fields!==null)for(var i=0;i<a.fields.length;i++){var k=a.fields[i].name,l=a.fields[i].value;g+=d.bd;g+=this.f8(d,k);g+=d.ez;g+=d.be;g+=this.f8(d,l);g+=d.ez}if(b!==null){g+=d.fc;g+=this.fd(d,b);g+=d.ez;if(this.c.indexOf("Opera")!==-1){g+=d.fe;g+=this.fd(d,
1);g+=d.ez}}if(c!==null){g+=d.at;g+=this.fd(d,c);g+=d.ez}if(f!==null){g+=d.ay;g+=this.fd(d,f);g+=d.ez}if(e!==null){g+=d.fg;g+=this.f8(d,e);g+=d.ez}g+=d.en;return g};PushClient.cx={};PushClient.cx.en="!";PushClient.cx.ep="z";PushClient.cx.ez="$";PushClient.cx.fk="~";PushClient.cx.fl=" ";PushClient.cx.fm='"';PushClient.cx.fn="#";PushClient.cx.fo="%";PushClient.cx.fp="'";PushClient.cx.fq="/";
PushClient.cx.fr="<";PushClient.cx.fs=">";PushClient.cx.ft="[";PushClient.cx.fu="\\";PushClient.cx.fv="]";PushClient.cx.fw="^";PushClient.cx.fx="`";PushClient.cx.fy="{";PushClient.cx.fz="|";PushClient.cx.g0="}";PushClient.cx.g1="";PushClient.cx.ag="&";PushClient.cx.ai="(";PushClient.cx.a8=")";PushClient.cx.bx="*";PushClient.cx.f6="+";
PushClient.cx.g2=",";PushClient.cx.aa="0";PushClient.cx.fb="2";PushClient.cx.ak="5";PushClient.cx.ac="8";PushClient.cx.bb="&";PushClient.cx.bc="(";PushClient.cx.bk=")";PushClient.cx.bj="*";PushClient.cx.fc="+";PushClient.cx.at=",";PushClient.cx.f7="-";PushClient.cx.fa=".";PushClient.cx.f9="?";PushClient.cx.am="0";PushClient.cx.g3="1";
PushClient.cx.bh="2";PushClient.cx.fe="3";PushClient.cx.br="4";PushClient.cx.av="5";PushClient.cx.fg="7";PushClient.cx.bo="8";PushClient.cx.ay="9";PushClient.cx.bd="D";PushClient.cx.be="E";PushClient.cx.ff="G";PushClient.cx.bf="J";PushClient.cx.fh="K";PushClient.cx.fi="L";PushClient.cx.fj="N";PushClient.cx.g4={};
(function(a){var b=a.g4;b["\u0000"]="y";for(var c=1;c<8;c++)b[String.fromCharCode(c)]=String.fromCharCode(c+39);b["\u0008"]="x";for(c=9;c<21;c++)b[String.fromCharCode(c)]=String.fromCharCode(c+39);b["\u0015"]="=";for(c=22;c<32;c++)b[String.fromCharCode(c)]=String.fromCharCode(c+41);b[a.en]="I";b[a.ep]="w";b[a.ez]="J";b[a.fk]="K";b[a.fl]="L";b[a.fm]="M";b[a.fn]="N";b[a.fo]="O";b[a.fp]="P";b[a.fq]="_";b[a.fr]="Q";b[a.fs]="R";b[a.ft]="S";b[a.fu]="T";b[a.fv]="U";b[a.fw]="V";b[a.fx]="W";b[a.fy]="X";b[a.fz]=
"Y";b[a.g0]="Z";b[a.g1]="v"})(PushClient.cx);PushClient.cx.g5={};(function(a){for(var b in a.g4)if(a.g4.hasOwnProperty(b))a.g5[a.g4[b]]=b})(PushClient.cx);PushClient.a7={};PushClient.a7.en="";PushClient.a7.ep="\u0019";PushClient.a7.ez="\u001e";PushClient.a7.fk="\u001f";PushClient.a7.g6="\u0000";PushClient.a7.g7="\n";PushClient.a7.g8="\r";PushClient.a7.fm='"';PushClient.a7.fu="\\";
PushClient.a7.ag="\u0001";PushClient.a7.ai="\u0002";PushClient.a7.a8="\u0003";PushClient.a7.bx="\u0004";PushClient.a7.f6="\u0005";PushClient.a7.g2="\u0006";PushClient.a7.aa="\t";PushClient.a7.fb="\u000c";PushClient.a7.ak="\u0010";PushClient.a7.ac="\u0013";PushClient.a7.bb="\u0001";PushClient.a7.bc="\u0002";PushClient.a7.bk="\u0003";PushClient.a7.bj="\u0004";
PushClient.a7.fc="\u0005";PushClient.a7.at="\u0006";PushClient.a7.f7="\u0007";PushClient.a7.fa="\u0008";PushClient.a7.f9="\t";PushClient.a7.am="\u000b";PushClient.a7.g3="\u000c";PushClient.a7.bh="\u000e";PushClient.a7.fe="\u000f";PushClient.a7.br="\u0010";PushClient.a7.av="\u0011";PushClient.a7.fg="\u0013";PushClient.a7.bo="\u0014";PushClient.a7.ay="\u0015";
PushClient.a7.bd="\u001b";PushClient.a7.be="\u001c";PushClient.a7.ff="\u001d";PushClient.a7.bf="'";PushClient.a7.fh="#";PushClient.a7.fi="$";PushClient.a7.fj="(";PushClient.a7.g4={};(function(a){var b=a.g4;b[a.en]="\u0001";b[a.ez]="\u0002";b[a.fk]="\u0003";b[a.g6]="\u0004";b[a.g7]="\u0005";b[a.g8]="\u0006";b[a.fm]="\u0007";b[a.fu]="\u0008";b[PushClient.cx.en]="\t";b[a.ep]="\u000b"})(PushClient.a7);
PushClient.a7.g5={};(function(a){for(var b in a.g4)if(a.g4.hasOwnProperty(b))a.g5[a.g4[b]]=b})(PushClient.a7);PushClient.a7.ey={};(function(a){a.ey[a.ag]=true;a.ey[a.ai]=true;a.ey[a.a8]=true;a.ey[a.bx]=true;a.ey[a.f6]=true;a.ey[a.g2]=true;a.ey[a.aa]=true;a.ey[a.fb]=true;a.ey[a.ak]=true;a.ey[a.ac]=true})(PushClient.a7);PushClient.a7.f0={};
(function(a){a.f0[a.bb]=true;a.f0[a.bc]=true;a.f0[a.bk]=true;a.f0[a.bj]=true;a.f0[a.fc]=true;a.f0[a.at]=true;a.f0[a.f7]=true;a.f0[a.fa]=true;a.f0[a.f9]=true;a.f0[a.am]=true;a.f0[a.g3]=true;a.f0[a.bh]=true;a.f0[a.fe]=true;a.f0[a.av]=true;a.f0[a.fg]=true;a.f0[a.bo]=true;a.f0[a.ay]=true;a.f0[a.bd]=true;a.f0[a.be]=true;a.f0[a.ff]=true;a.f0[a.bf]=true;a.f0[a.fh]=true;a.f0[a.fi]=true;a.f0[a.br]=true;a.f0[a.fj]=true})(PushClient.a7);PushClient.ap={};PushClient.ap.g9=1;
PushClient.ap.ga=2;PushClient.ap.f4=3;PushClient.ap.f2=4;PushClient.ap.gb={};(function(a){var b=a.gb;b.bb=a.f4;b.bc=a.f4;b.gc=a.f4;b.bk=a.f2;b.bj=a.f2;b.fc=a.f2;b.at=a.f2;b.f7=a.f4;b.fa=a.f4;b.f9=a.f4;b.am=a.f2;b.g3=a.f4;b.bh=a.f2;b.fe=a.f2;b.fg=a.f4;b.bo=a.f4;b.ay=a.f2;b.bd=a.f4;b.be=a.f4;b.bf=a.f4;b.fh=a.f4;b.fi=a.f2;b.br=a.f4;b.av=a.f2})(PushClient.ap);PushClient.a7.f1={};PushClient.cx.f1={};
(function(){for(var a in PushClient.ap.gb)if(PushClient.ap.gb.hasOwnProperty(a)){PushClient.a7.f1[PushClient.a7[a]]=PushClient.ap.gb[a];PushClient.cx.f1[PushClient.cx[a]]=PushClient.ap.gb[a]}})();PushClient.ap.aq={};PushClient.ap.aq[0]="UNKNOWN_SESSION_ID";PushClient.f8=function(a,b){for(var c="",d=0;d<b.length;d++){var e=a.g4[b.charAt(d)];if(e!==undefined){c+=a.fk;c+=e}else c+=b.charAt(d)}return c};
PushClient.f5=function(a,b){for(var c="",d=0;d<b.length;d++){var e=b.charAt(d);if(e===a.fk){if(d+1>=b.length||a.g5[b.charAt(d+1)]===undefined)throw"Error: f5() Illegal argument '"+b+"'!";e=a.g5[b.charAt(d+1)];d++}c+=e}return c};
PushClient.fd=function(a,b){if((b&4294967168)===0){var c=String.fromCharCode(b),d=a.g4[c];return d===undefined?c:a.fk+d}var e;e=(b&4278190080)!==0?24:(b&16711680)!==0?16:8;c=[];for(d=0;d<10;d++)c.push(0);for(var f=0,g=0;e>=0;){var i=b>>e&255;g++;c[f]|=i>>g;d=a.g4[String.fromCharCode(c[f])];if(d!==undefined){c[f]=a.fk.charCodeAt(0);c[f+1]=d.charCodeAt(0);f++}f++;c[f]|=i<<7-g&127;e-=8}d=a.g4[String.fromCharCode(c[f])];if(d!==undefined){c[f]=a.fk.charCodeAt(0);c[f+1]=d.charCodeAt(0);f++}f++;
a="";for(d=0;d<f;d++)a+=String.fromCharCode(c[d]);return a};
PushClient.f3=function(a,b){var c="Error: f3() Illegal argument '"+b+"'!",d=0,e=-1,f=0,g,i=b.length,k=0;if(i===1)return b.charCodeAt(0);else if(i===2&&b.charAt(0)===a.fk){g=a.g5[b.charAt(1)];if(g!==undefined)return g.charCodeAt(0);else throw c;}for(;i>0;i--){g=b.charAt(k);k++;if(g===a.fk){if(i-1<0)throw c;i--;g=b.charAt(k);k++;g=a.g5[g];if(g===undefined)throw c;}else g=g;if(e>0){f|=g.charCodeAt(0)>>e;d=d<<8|f;f=g.charCodeAt(0)<<8-e}else f=g.charCodeAt(0)<<-e;e=(e+7)%8}return d};
PushClient.NOTIFY_UNSUPPORTED_BROWSER="NOTIFY_UNSUPPORTED_BROWSER";PushClient.NOTIFY_SERVER_DOWN="NOTIFY_SERVER_DOWN";PushClient.NOTIFY_SERVER_UP="NOTIFY_SERVER_UP";PushClient.NOTIFY_DATA_RESYNC="NOTIFY_DATA_RESYNC";PushClient.NOTIFY_DATA_SYNC="NOTIFY_DATA_SYNC";PushClient.NOTIFY_PUBLISH_OK="NOTIFY_PUBLISH_OK";PushClient.NOTIFY_PUBLISH_FAILED="NOTIFY_PUBLISH_FAILED";PushClient.NOTIFY_PUBLISH_DENIED="NOTIFY_PUBLISH_DENIED";
PushClient.NOTIFY_PUBLISH_NO_SUBSCRIBER="NOTIFY_PUBLISH_NO_SUBSCRIBER";PushClient.NOTIFY_SUBSCRIBE_ALLOW="NOTIFY_SUBSCRIBE_ALLOW";PushClient.NOTIFY_SUBSCRIBE_DENY="NOTIFY_SUBSCRIBE_DENY";PushClient.CONSTANT_WINDOW_BACKOFF="CONSTANT_WINDOW_BACKOFF";PushClient.TRUNCATED_EXPONENTIAL_BACKOFF="TRUNCATED_EXPONENTIAL_BACKOFF";
PushClient.notifyAfterReconnectRetries=function(a){if(typeof a!=="number"||a<1)throw"Error: notifyAfterReconnectRetries() should have a positive number as an argument!";this.ca=a};
PushClient.setServers=function(a){this.ew=true;this.a5(a,"string",1,/^(\d+)?\s*https?:\/\/(\w|-)+(\.(\w|-)+)*(:\d+)?$/i,"Error: setServers() - the argument should be a list of URLs, and each URL could be optionally preceded by a weight");for(var b=[],c=0;c<a.length;c++){var d=/https?:\/\/(\w|-)+(\.(\w|-)+)*(:\d+)?$/i.exec(a[c])[0],e=/^\d+/.exec(a[c]);if(e===null)e=100;else{e=parseInt(e[0]);if(e>100)throw"Error: setServers() - the weight needs to be an integer between 0 and 100!";}this.co||
this.cp(d);b.push({m:d,e2:e})}this.c9=b;this.b3.b4=[];for(c=0;c<a.length;c++){this.b3.b4[c]={};this.b3.b4[c].b6=0;this.b3.b4[c].c2=0;this.b3.b4[c].b9=0;this.b3.b4[c].bv=0;this.b3.b4[c].bn=0;this.b3.b4[c].aq={}}if(PushClient.cb){a={};a.af=this.cc;this.c0(a)}};PushClient.getSubjects=function(){return this.a1(this.ce)};PushClient.setMessageHandler=function(a){if(typeof a!=="function")throw"Error: setMessageHandler() should have a function as an argument!";this.bq=a};
PushClient.setStatusHandler=function(a){if(typeof a!=="function")throw"Error: setStatusHandler() should have a function as an argument!";this.d=a};PushClient.subscribe=function(a){PushClient.subscribeWithHistory(a,0)};
PushClient.subscribeWithHistory=function(a,b){this.a5(a,"string",1,/^\/[^\/*]+\/([^\/*]+\/)*([^\/*]+|\*)$/,"Error: subscribe() - a subject is invalid");if(this.c9.length===0)throw"Error: subscribe() - the servers are not configured!";if(this.bq===null)throw"Error: subscribe() - the message handler is not configured!";if(typeof b!=="number"||b<0)throw"Error: subscribeWithHistory() - the second argument should be a positive number or zero!";a=this.a2(a,this.ce);if(a.length!==0){if(this.dy===
false)this.dy=true;var c={};c.af=this.ag;c.dq=0;if(b!=0)c.db=b;c.ce=a;this.c0(c)}};
PushClient.setNumberOfSubdomainLevels=function(a){if(typeof a!=="number"||a<2)throw"Error: setNumberOfSubdomainLevels() should have a positive number larger or equal to 2 as an argument!";if(this.c9.length>0)throw"Error: Error: setNumberOfSubdomainLevels() Unable to set the number of subdomain levels when servers are already configured - use the api call setNumberOfSubdomainLevels() before the api call setServers()!";this.n=a};
PushClient.subscribeWithConflation=function(a,b){this.a5(a,"string",1,/^\/[^\/*]+\/([^\/*]+\/)*([^\/*]+|\*)$/,"Error: subscribe() - a subject is invalid");if(this.c9.length===0)throw"Error: subscribeWithConflation() - the servers are not configured!";if(this.bq===null)throw"Error: subscribeWithConflation() - the message handler is not configured!";a=this.a2(a,this.ce);if(a.length!==0){if(b>=100){b=Math.floor(b/100)*100;for(var c=0;c<a.length;c++)this.bi[a[c]]=b}else b=0;if(this.dy===false)this.dy=
true;c={};c.af=this.ag;c.dq=b;c.ce=a;this.c0(c)}};PushClient.unsubscribe=function(a){this.a5(a,"string",1,/^\/[^\/*]+\/([^\/*]+\/)*([^\/*]+|\*)$/,"Error: unsubscribe() - a subject is invalid");a=this.a3(a,this.ce);if(a.length!==0){var b={};b.af=this.ai;b.ce=a;this.c0(b)}};PushClient.disconnect=function(){this.ew=false;this.b(false)&&this.dx()};
PushClient.setEntitlementToken=function(a){if(this.ce.length===0){this.cn=a;this.cd=false}else throw"Error: setEntitlementToken() - unable to set the entitlement token when there are running subject subscriptions!";};
PushClient.getInfo=function(){s="Date: "+(new Date).toString()+"\n";s+="Uptime: "+((new Date).getTime()-this.b3.gd)+" ms\n";s+="window.location: "+window.location+"\n";s+="document.domain: "+document.domain+"\n";s+="User-agent: "+navigator.userAgent+"\n";s+="Detected browser: "+this.c+"\n";s+="Servers: ";for(var a=0;a<this.c9.length;a++){if(a>0)s+=", ";s+=this.c9[a].e2+" "+this.c9[a].m}s+="\nSubjects: "+this.ce.toString()+"\n";s+="Connection status ["+(this.b5===null?null:this.c9[this.b5].m)+
"]: "+this.ar+"\n";s+="Time from last server activity: "+(this.b3.bu!==null?(new Date).getTime()-this.b3.bu:null)+" ms\n";s+="Servers down before notify: "+this.ca+"\n";s+="Consecutive server down count: "+this.az+" times\n";for(a=0;a<this.b3.b4.length;a++){s+="\nServer up ["+this.c9[a].m+"]: "+this.b3.b4[a].b6+" times\n";s+="Server down ["+this.c9[a].m+"]: "+this.b3.b4[a].c2+" times\n";s+="Server connection recycled ["+this.c9[a].m+"]: "+this.b3.b4[a].b9+" times\n";s+="Received server events ["+
this.c9[a].m+"]: "+this.b3.b4[a].bv+"\n";s+="Received messages ["+this.c9[a].m+"]: "+this.b3.b4[a].bn+"\n";for(var b in this.b3.b4[a].aq)if(this.b3.b4[a].aq.hasOwnProperty(b))s+="Error ["+this.c9[a].m+"] x"+this.b3.b4[a].aq[b]+" times : "+b+"\n"}return s};
PushClient.publish=function(a){if(this.c9.length===0)throw"Error: publish() - the servers are not configured, use setServers() first!";if(a===undefined||a===null)throw"Error: publish() - the message argument is undefined or null!";if(a.subject===undefined||a.subject===null)throw"Error: publish() - the subject of the message is undefined or null!";if(!/^\/[^\/*]+\/([^\/*]+\/)*([^\/*]+|\*)$/.test(a.subject))throw"Error: publish() - the subject of te message is invalid,  "+a.subject+" is the cause of the error!";
if(a.content===undefined||a.content===null)throw"Error: publish() - the content of the message is undefined or null!";if(a.fields!==undefined&&a.fields!==null){if(typeof a.fields!=="object"||typeof a.fields.length!=="number")throw"Error: publish() - the message.fields element should be a list!";for(var b=0;b<a.fields.length;b++){if(!("name"in a.fields[b]))throw"Error: publish() - the "+b+"-th element from fields list doesn't have the name key!";if(!("value"in a.fields[b]))throw"Error: publish() - the "+
b+"-th element from fields list doesn't have the value key!";}}if(this.dy===false){this.dy=true;this.bl[""]={seqid:7E4,seq:0,recovery:false};b={};b.af=this.ag;b.ce=[""];this.c0(b)}b={};b.af=this.ak;b.di=a;this.c0(b)};PushClient.setQuickReconnectMaxRetries=function(a){if(typeof a!=="number"||a<2)throw"Error: setQuickReconnectMaxRetries() - the argument must be higher than 2!";this.v=a};
PushClient.setQuickReconnectInitialDelay=function(a){if(typeof a!=="number"||a<1)throw"Error: setQuickReconnectInitialDelay() - the argument must be higher than 1!";this.w=a*1E3};
PushClient.setReconnectPolicy=function(a){if(a===undefined||a!==PushClient.CONSTANT_WINDOW_BACKOFF&&a!==PushClient.TRUNCATED_EXPONENTIAL_BACKOFF)throw"Error: setReconnectPolicy() - the argument must be either PushClient.CONSTANT_WINDOW_BACKOFF or PushClient.TRUNCATED_EXPONENTIAL_BACKOFF!";this.x=a};
PushClient.setReconnectTimeInterval=function(a){if(typeof a!=="number"||a<1)throw"Error: setReconnectTimeInterval() - the argument must be higher than 1!";this.y=a*1E3};PushClient.setReconnectMaxDelay=function(a){if(typeof a!=="number"||a<1)throw"Error: setReconnectMaxDelay() - the argument must be higher than 1!";this.z=a*1E3};PushClient.ew=true;PushClient.co=false;PushClient.cr=false;PushClient.cv=false;PushClient.bz=9E5;
PushClient.c1=3E4+Math.floor(Math.random()*1E4);PushClient.u=1E4;PushClient.eq=100;PushClient.el=524288;PushClient.ca=1;PushClient.n=0;PushClient.aw=false;PushClient.v=3;PushClient.w=5E3;PushClient.x=PushClient.TRUNCATED_EXPONENTIAL_BACKOFF;PushClient.y=2E4;PushClient.z=36E4;PushClient.cd=false;PushClient.cn="";PushClient.ag="SUBSCRIBE";
PushClient.ai="UNSUBSCRIBE";PushClient.bx="PING";PushClient.cc="CONNECT";PushClient.ge=0;PushClient.d2=1;PushClient.d7=2;PushClient.cs=3;PushClient.gf=4;PushClient.d8=5;PushClient.gg=6;PushClient.gh=7;PushClient.ci=8;PushClient.d0=9;PushClient.cy=10;PushClient.as="SERVER_UP";PushClient.c7="SERVER_DOWN";PushClient.b2="SERVER_RECYCLE";
PushClient.bg="1";PushClient.gi="2";PushClient.gj="3";PushClient.da=1;PushClient.cl="ERROR_TIMEOUT";PushClient.gk="ERROR_HTTP";PushClient.ao="ERROR_SERVER";PushClient.c=PushClient.a();PushClient.d4=null;PushClient.c9=[];PushClient.bq=null;PushClient.d=null;PushClient.bp=[];PushClient.dn=false;PushClient.j=[];PushClient.h=false;
PushClient.dy=false;PushClient.b5=null;PushClient.ar=null;PushClient.ce=[];PushClient.bi={};PushClient.bl={};PushClient.au=null;PushClient.ax=null;PushClient.dt=null;PushClient.by=(new Date).getTime();PushClient.bw=null;PushClient.c8=[];PushClient.az=0;PushClient.b0=0;PushClient.b7=false;PushClient.et=null;PushClient.dk=[];
PushClient.ae=null;PushClient.dr=null;PushClient.ck=null;PushClient.c3=null;PushClient.b3={};PushClient.b3.gd=(new Date).getTime();PushClient.b3.bu=null;PushClient.b3.b4=[];PushClient.cb=false;PushClient.cz=false;if(window.WebSocket)PushClient.cb=true;else if(window.MozWebSocket)PushClient.cb=true;
if(typeof PushClient_Disable_WebSocket_Transport!=="undefined"&&PushClient_Disable_WebSocket_Transport==true)PushClient.cb=false;if(PushClient.cb==false)if(window.XDomainRequest){var xdrTest=new XDomainRequest;try{xdrTest.open("GET",window.location.protocol+"//127.0.0.1");xdrTest.send();PushClient.cz=true;xdrTest.abort()}catch(e$$6){xdrTest.abort();PushClient.cz=false}}else PushClient.cz=false;
PushClient.c==="IE"?window.attachEvent("onunload",function(){PushClient.dx()}):window.addEventListener("unload",function(){PushClient.dx()},false);PushClient.e();if(PushClient.c==="WebKit iPhone")PushClient.el=65536;else if(PushClient.c==="Opera Mobile"){PushClient.el=32768;PushClient.eq=500}
if(PushClient.cb==true){PushClient.co=true;PushClient.cr=true;PushClient.cv=true}else if(PushClient.cz&&window.postMessage){PushClient.co=true;PushClient.cr=true;PushClient.cv=true;window.attachEvent("onmessage",PushClient.em)}else if(this.XMLHttpRequest&&(new XMLHttpRequest).withCredentials!==undefined){PushClient.co=true;PushClient.cr=true}else if(this.swfobject&&swfobject.hasFlashPlayerVersion("9")&&
(typeof PushClient_Allow_Flash_Transport==="undefined"||PushClient_Allow_Flash_Transport==true)){PushClient.co=true;PushClient.i(function(){PushClient.eh()})}if(!PushClient.co||PushClient.cr)PushClient.i(function(){PushClient.dp()});
/** @license
 *
 * SoundManager 2: JavaScript Sound for the Web
 * ----------------------------------------------
 * http://schillmania.com/projects/soundmanager2/
 *
 * Copyright (c) 2007, Scott Schiller. All rights reserved.
 * Code provided under the BSD License:
 * http://schillmania.com/projects/soundmanager2/license.txt
 *
 * V2.97a.20130101
 */
(function(i,g){function R(R,fa){function S(b){return c.preferFlash&&A&&!c.ignoreFlash&&c.flash[b]!==g&&c.flash[b]}function m(b){return function(c){var d=this._s;return!d||!d._a?null:b.call(this,c)}}this.setupOptions={url:R||null,flashVersion:8,debugMode:!0,debugFlash:!1,useConsole:!0,consoleOnly:!0,waitForWindowLoad:!1,bgColor:"#ffffff",useHighPerformance:!1,flashPollingInterval:null,html5PollingInterval:null,flashLoadTimeout:1E3,wmode:null,allowScriptAccess:"always",useFlashBlock:!1,useHTML5Audio:!0,
html5Test:/^(probably|maybe)$/i,preferFlash:!0,noSWFCache:!1};this.defaultOptions={autoLoad:!1,autoPlay:!1,from:null,loops:1,onid3:null,onload:null,whileloading:null,onplay:null,onpause:null,onresume:null,whileplaying:null,onposition:null,onstop:null,onfailure:null,onfinish:null,multiShot:!0,multiShotEvents:!1,position:null,pan:0,stream:!0,to:null,type:null,usePolicyFile:!1,volume:100};this.flash9Options={isMovieStar:null,usePeakData:!1,useWaveformData:!1,useEQData:!1,onbufferchange:null,ondataerror:null};
this.movieStarOptions={bufferTime:3,serverURL:null,onconnect:null,duration:null};this.audioFormats={mp3:{type:['audio/mpeg; codecs="mp3"',"audio/mpeg","audio/mp3","audio/MPA","audio/mpa-robust"],required:!0},mp4:{related:["aac","m4a","m4b"],type:['audio/mp4; codecs="mp4a.40.2"',"audio/aac","audio/x-m4a","audio/MP4A-LATM","audio/mpeg4-generic"],required:!1},ogg:{type:["audio/ogg; codecs=vorbis"],required:!1},wav:{type:['audio/wav; codecs="1"',"audio/wav","audio/wave","audio/x-wav"],required:!1}};this.movieID=
"sm2-container";this.id=fa||"sm2movie";this.debugID="soundmanager-debug";this.debugURLParam=/([#?&])debug=1/i;this.versionNumber="V2.97a.20130101";this.altURL=this.movieURL=this.version=null;this.enabled=this.swfLoaded=!1;this.oMC=null;this.sounds={};this.soundIDs=[];this.didFlashBlock=this.muted=!1;this.filePattern=null;this.filePatterns={flash8:/\.mp3(\?.*)?$/i,flash9:/\.mp3(\?.*)?$/i};this.features={buffering:!1,peakData:!1,waveformData:!1,eqData:!1,movieStar:!1};this.sandbox={};this.html5={usingFlash:null};
this.flash={};this.ignoreFlash=this.html5Only=!1;var Ga,c=this,Ha=null,h=null,T,q=navigator.userAgent,ga=i.location.href.toString(),l=document,ha,Ia,ia,k,r=[],J=!1,K=!1,j=!1,s=!1,ja=!1,L,t,ka,U,la,B,C,D,Ja,ma,V,na,W,oa,E,pa,M,qa,X,F,Ka,ra,La,sa,Ma,N=null,ta=null,v,ua,G,Y,Z,H,p,O=!1,va=!1,Na,Oa,Pa,$=0,P=null,aa,Qa=[],u=null,Ra,ba,Q,y,wa,xa,Sa,n,db=Array.prototype.slice,w=!1,ya,A,za,Ta,x,ca=q.match(/(ipad|iphone|ipod)/i),Ua=q.match(/android/i),z=q.match(/msie/i),eb=q.match(/webkit/i),Aa=q.match(/safari/i)&&
!q.match(/chrome/i),Ba=q.match(/opera/i),Ca=q.match(/(mobile|pre\/|xoom)/i)||ca||Ua,Va=!ga.match(/usehtml5audio/i)&&!ga.match(/sm2\-ignorebadua/i)&&Aa&&!q.match(/silk/i)&&q.match(/OS X 10_6_([3-7])/i),Da=l.hasFocus!==g?l.hasFocus():null,da=Aa&&(l.hasFocus===g||!l.hasFocus()),Wa=!da,Xa=/(mp3|mp4|mpa|m4a|m4b)/i,Ea=l.location?l.location.protocol.match(/http/i):null,Ya=!Ea?"http://":"",Za=/^\s*audio\/(?:x-)?(?:mpeg4|aac|flv|mov|mp4||m4v|m4a|m4b|mp4v|3gp|3g2)\s*(?:$|;)/i,$a="mpeg4 aac flv mov mp4 m4v f4v m4a m4b mp4v 3gp 3g2".split(" "),
fb=RegExp("\\.("+$a.join("|")+")(\\?.*)?$","i");this.mimePattern=/^\s*audio\/(?:x-)?(?:mp(?:eg|3))\s*(?:$|;)/i;this.useAltURL=!Ea;var Fa;try{Fa=Audio!==g&&(Ba&&opera!==g&&10>opera.version()?new Audio(null):new Audio).canPlayType!==g}catch(hb){Fa=!1}this.hasHTML5=Fa;this.setup=function(b){var e=!c.url;b!==g&&(j&&u&&c.ok()&&(b.flashVersion!==g||b.url!==g||b.html5Test!==g))&&H(v("setupLate"));ka(b);e&&(M&&b.url!==g)&&c.beginDelayedInit();!M&&(b.url!==g&&"complete"===l.readyState)&&setTimeout(E,1);return c};
this.supported=this.ok=function(){return u?j&&!s:c.useHTML5Audio&&c.hasHTML5};this.getMovie=function(b){return T(b)||l[b]||i[b]};this.createSound=function(b,e){function d(){a=Y(a);c.sounds[a.id]=new Ga(a);c.soundIDs.push(a.id);return c.sounds[a.id]}var a,f=null;if(!j||!c.ok())return H(void 0),!1;e!==g&&(b={id:b,url:e});a=t(b);a.url=aa(a.url);if(p(a.id,!0))return c.sounds[a.id];ba(a)?(f=d(),f._setup_html5(a)):(8<k&&null===a.isMovieStar&&(a.isMovieStar=!(!a.serverURL&&!(a.type&&a.type.match(Za)||a.url.match(fb)))),
a=Z(a,void 0),f=d(),8===k?h._createSound(a.id,a.loops||1,a.usePolicyFile):(h._createSound(a.id,a.url,a.usePeakData,a.useWaveformData,a.useEQData,a.isMovieStar,a.isMovieStar?a.bufferTime:!1,a.loops||1,a.serverURL,a.duration||null,a.autoPlay,!0,a.autoLoad,a.usePolicyFile),a.serverURL||(f.connected=!0,a.onconnect&&a.onconnect.apply(f))),!a.serverURL&&(a.autoLoad||a.autoPlay)&&f.load(a));!a.serverURL&&a.autoPlay&&f.play();return f};this.destroySound=function(b,e){if(!p(b))return!1;var d=c.sounds[b],a;
d._iO={};d.stop();d.unload();for(a=0;a<c.soundIDs.length;a++)if(c.soundIDs[a]===b){c.soundIDs.splice(a,1);break}e||d.destruct(!0);delete c.sounds[b];return!0};this.load=function(b,e){return!p(b)?!1:c.sounds[b].load(e)};this.unload=function(b){return!p(b)?!1:c.sounds[b].unload()};this.onposition=this.onPosition=function(b,e,d,a){return!p(b)?!1:c.sounds[b].onposition(e,d,a)};this.clearOnPosition=function(b,e,d){return!p(b)?!1:c.sounds[b].clearOnPosition(e,d)};this.start=this.play=function(b,e){var d=
!1;return!j||!c.ok()?(H("soundManager.play(): "+v(!j?"notReady":"notOK")),d):!p(b)?(e instanceof Object||(e={url:e}),e&&e.url&&(e.id=b,d=c.createSound(e).play()),d):c.sounds[b].play(e)};this.setPosition=function(b,e){return!p(b)?!1:c.sounds[b].setPosition(e)};this.stop=function(b){return!p(b)?!1:c.sounds[b].stop()};this.stopAll=function(){for(var b in c.sounds)c.sounds.hasOwnProperty(b)&&c.sounds[b].stop()};this.pause=function(b){return!p(b)?!1:c.sounds[b].pause()};this.pauseAll=function(){var b;
for(b=c.soundIDs.length-1;0<=b;b--)c.sounds[c.soundIDs[b]].pause()};this.resume=function(b){return!p(b)?!1:c.sounds[b].resume()};this.resumeAll=function(){var b;for(b=c.soundIDs.length-1;0<=b;b--)c.sounds[c.soundIDs[b]].resume()};this.togglePause=function(b){return!p(b)?!1:c.sounds[b].togglePause()};this.setPan=function(b,e){return!p(b)?!1:c.sounds[b].setPan(e)};this.setVolume=function(b,e){return!p(b)?!1:c.sounds[b].setVolume(e)};this.mute=function(b){var e=0;b instanceof String&&(b=null);if(b)return!p(b)?
!1:c.sounds[b].mute();for(e=c.soundIDs.length-1;0<=e;e--)c.sounds[c.soundIDs[e]].mute();return c.muted=!0};this.muteAll=function(){c.mute()};this.unmute=function(b){b instanceof String&&(b=null);if(b)return!p(b)?!1:c.sounds[b].unmute();for(b=c.soundIDs.length-1;0<=b;b--)c.sounds[c.soundIDs[b]].unmute();c.muted=!1;return!0};this.unmuteAll=function(){c.unmute()};this.toggleMute=function(b){return!p(b)?!1:c.sounds[b].toggleMute()};this.getMemoryUse=function(){var b=0;h&&8!==k&&(b=parseInt(h._getMemoryUse(),
10));return b};this.disable=function(b){var e;b===g&&(b=!1);if(s)return!1;s=!0;for(e=c.soundIDs.length-1;0<=e;e--)La(c.sounds[c.soundIDs[e]]);L(b);n.remove(i,"load",C);return!0};this.canPlayMIME=function(b){var e;c.hasHTML5&&(e=Q({type:b}));!e&&u&&(e=b&&c.ok()?!!(8<k&&b.match(Za)||b.match(c.mimePattern)):null);return e};this.canPlayURL=function(b){var e;c.hasHTML5&&(e=Q({url:b}));!e&&u&&(e=b&&c.ok()?!!b.match(c.filePattern):null);return e};this.canPlayLink=function(b){return b.type!==g&&b.type&&c.canPlayMIME(b.type)?
!0:c.canPlayURL(b.href)};this.getSoundById=function(b){if(!b)throw Error("soundManager.getSoundById(): sID is null/_undefined");return c.sounds[b]};this.onready=function(b,c){if("function"===typeof b)c||(c=i),la("onready",b,c),B();else throw v("needFunction","onready");return!0};this.ontimeout=function(b,c){if("function"===typeof b)c||(c=i),la("ontimeout",b,c),B({type:"ontimeout"});else throw v("needFunction","ontimeout");return!0};this._wD=this._writeDebug=function(){return!0};this._debug=function(){};
this.reboot=function(b,e){var d,a,f;for(d=c.soundIDs.length-1;0<=d;d--)c.sounds[c.soundIDs[d]].destruct();if(h)try{z&&(ta=h.innerHTML),N=h.parentNode.removeChild(h)}catch(g){}ta=N=u=h=null;c.enabled=M=j=O=va=J=K=s=w=c.swfLoaded=!1;c.soundIDs=[];c.sounds={};if(b)r=[];else for(d in r)if(r.hasOwnProperty(d)){a=0;for(f=r[d].length;a<f;a++)r[d][a].fired=!1}c.html5={usingFlash:null};c.flash={};c.html5Only=!1;c.ignoreFlash=!1;i.setTimeout(function(){oa();e||c.beginDelayedInit()},20);return c};this.reset=
function(){return c.reboot(!0,!0)};this.getMoviePercent=function(){return h&&"PercentLoaded"in h?h.PercentLoaded():null};this.beginDelayedInit=function(){ja=!0;E();setTimeout(function(){if(va)return!1;X();W();return va=!0},20);D()};this.destruct=function(){c.disable(!0)};Ga=function(b){var e,d,a=this,f,ab,i,I,l,m,q=!1,j=[],n=0,s,u,r=null;d=e=null;this.sID=this.id=b.id;this.url=b.url;this._iO=this.instanceOptions=this.options=t(b);this.pan=this.options.pan;this.volume=this.options.volume;this.isHTML5=
!1;this._a=null;this.id3={};this._debug=function(){};this.load=function(b){var c=null;b!==g?a._iO=t(b,a.options):(b=a.options,a._iO=b,r&&r!==a.url&&(a._iO.url=a.url,a.url=null));a._iO.url||(a._iO.url=a.url);a._iO.url=aa(a._iO.url);b=a.instanceOptions=a._iO;if(b.url===a.url&&0!==a.readyState&&2!==a.readyState)return 3===a.readyState&&b.onload&&b.onload.apply(a,[!!a.duration]),a;a.loaded=!1;a.readyState=1;a.playState=0;a.id3={};if(ba(b))c=a._setup_html5(b),c._called_load||(a._html5_canplay=!1,a.url!==
b.url&&(a._a.src=b.url,a.setPosition(0)),a._a.autobuffer="auto",a._a.preload="auto",a._a._called_load=!0,b.autoPlay&&a.play());else try{a.isHTML5=!1,a._iO=Z(Y(b)),b=a._iO,8===k?h._load(a.id,b.url,b.stream,b.autoPlay,b.usePolicyFile):h._load(a.id,b.url,!!b.stream,!!b.autoPlay,b.loops||1,!!b.autoLoad,b.usePolicyFile)}catch(e){F({type:"SMSOUND_LOAD_JS_EXCEPTION",fatal:!0})}a.url=b.url;return a};this.unload=function(){0!==a.readyState&&(a.isHTML5?(I(),a._a&&(a._a.pause(),wa(a._a,"about:blank"),r="about:blank")):
8===k?h._unload(a.id,"about:blank"):h._unload(a.id),f());return a};this.destruct=function(b){a.isHTML5?(I(),a._a&&(a._a.pause(),wa(a._a),w||i(),a._a._s=null,a._a=null)):(a._iO.onfailure=null,h._destroySound(a.id));b||c.destroySound(a.id,!0)};this.start=this.play=function(b,c){var e,d;d=!0;d=null;c=c===g?!0:c;b||(b={});a.url&&(a._iO.url=a.url);a._iO=t(a._iO,a.options);a._iO=t(b,a._iO);a._iO.url=aa(a._iO.url);a.instanceOptions=a._iO;if(a._iO.serverURL&&!a.connected)return a.getAutoPlay()||a.setAutoPlay(!0),
a;ba(a._iO)&&(a._setup_html5(a._iO),l());1===a.playState&&!a.paused&&((e=a._iO.multiShot)||(d=a));if(null!==d)return d;b.url&&b.url!==a.url&&a.load(a._iO);a.loaded||(0===a.readyState?(a.isHTML5||(a._iO.autoPlay=!0),a.load(a._iO),a.instanceOptions=a._iO):2===a.readyState&&(d=a));if(null!==d)return d;!a.isHTML5&&(9===k&&0<a.position&&a.position===a.duration)&&(b.position=0);if(a.paused&&0<=a.position&&(!a._iO.serverURL||0<a.position))a.resume();else{a._iO=t(b,a._iO);if(null!==a._iO.from&&null!==a._iO.to&&
0===a.instanceCount&&0===a.playState&&!a._iO.serverURL){e=function(){a._iO=t(b,a._iO);a.play(a._iO)};if(a.isHTML5&&!a._html5_canplay)a.load({oncanplay:e}),d=!1;else if(!a.isHTML5&&!a.loaded&&(!a.readyState||2!==a.readyState))a.load({onload:e}),d=!1;if(null!==d)return d;a._iO=u()}(!a.instanceCount||a._iO.multiShotEvents||!a.isHTML5&&8<k&&!a.getAutoPlay())&&a.instanceCount++;a._iO.onposition&&0===a.playState&&m(a);a.playState=1;a.paused=!1;a.position=a._iO.position!==g&&!isNaN(a._iO.position)?a._iO.position:
0;a.isHTML5||(a._iO=Z(Y(a._iO)));a._iO.onplay&&c&&(a._iO.onplay.apply(a),q=!0);a.setVolume(a._iO.volume,!0);a.setPan(a._iO.pan,!0);a.isHTML5?(l(),d=a._setup_html5(),a.setPosition(a._iO.position),d.play()):(d=h._start(a.id,a._iO.loops||1,9===k?a._iO.position:a._iO.position/1E3,a._iO.multiShot),9===k&&!d&&a._iO.onplayerror&&a._iO.onplayerror.apply(a))}return a};this.stop=function(b){var c=a._iO;1===a.playState&&(a._onbufferchange(0),a._resetOnPosition(0),a.paused=!1,a.isHTML5||(a.playState=0),s(),c.to&&
a.clearOnPosition(c.to),a.isHTML5?a._a&&(b=a.position,a.setPosition(0),a.position=b,a._a.pause(),a.playState=0,a._onTimer(),I()):(h._stop(a.id,b),c.serverURL&&a.unload()),a.instanceCount=0,a._iO={},c.onstop&&c.onstop.apply(a));return a};this.setAutoPlay=function(b){a._iO.autoPlay=b;a.isHTML5||(h._setAutoPlay(a.id,b),b&&!a.instanceCount&&1===a.readyState&&a.instanceCount++)};this.getAutoPlay=function(){return a._iO.autoPlay};this.setPosition=function(b){b===g&&(b=0);var c=a.isHTML5?Math.max(b,0):Math.min(a.duration||
a._iO.duration,Math.max(b,0));a.position=c;b=a.position/1E3;a._resetOnPosition(a.position);a._iO.position=c;if(a.isHTML5){if(a._a&&a._html5_canplay&&a._a.currentTime!==b)try{a._a.currentTime=b,(0===a.playState||a.paused)&&a._a.pause()}catch(e){}}else b=9===k?a.position:b,a.readyState&&2!==a.readyState&&h._setPosition(a.id,b,a.paused||!a.playState,a._iO.multiShot);a.isHTML5&&a.paused&&a._onTimer(!0);return a};this.pause=function(b){if(a.paused||0===a.playState&&1!==a.readyState)return a;a.paused=!0;
a.isHTML5?(a._setup_html5().pause(),I()):(b||b===g)&&h._pause(a.id,a._iO.multiShot);a._iO.onpause&&a._iO.onpause.apply(a);return a};this.resume=function(){var b=a._iO;if(!a.paused)return a;a.paused=!1;a.playState=1;a.isHTML5?(a._setup_html5().play(),l()):(b.isMovieStar&&!b.serverURL&&a.setPosition(a.position),h._pause(a.id,b.multiShot));!q&&b.onplay?(b.onplay.apply(a),q=!0):b.onresume&&b.onresume.apply(a);return a};this.togglePause=function(){if(0===a.playState)return a.play({position:9===k&&!a.isHTML5?
a.position:a.position/1E3}),a;a.paused?a.resume():a.pause();return a};this.setPan=function(b,c){b===g&&(b=0);c===g&&(c=!1);a.isHTML5||h._setPan(a.id,b);a._iO.pan=b;c||(a.pan=b,a.options.pan=b);return a};this.setVolume=function(b,e){b===g&&(b=100);e===g&&(e=!1);a.isHTML5?a._a&&(a._a.volume=Math.max(0,Math.min(1,b/100))):h._setVolume(a.id,c.muted&&!a.muted||a.muted?0:b);a._iO.volume=b;e||(a.volume=b,a.options.volume=b);return a};this.mute=function(){a.muted=!0;a.isHTML5?a._a&&(a._a.muted=!0):h._setVolume(a.id,
0);return a};this.unmute=function(){a.muted=!1;var b=a._iO.volume!==g;a.isHTML5?a._a&&(a._a.muted=!1):h._setVolume(a.id,b?a._iO.volume:a.options.volume);return a};this.toggleMute=function(){return a.muted?a.unmute():a.mute()};this.onposition=this.onPosition=function(b,c,e){j.push({position:parseInt(b,10),method:c,scope:e!==g?e:a,fired:!1});return a};this.clearOnPosition=function(a,b){var c,a=parseInt(a,10);if(isNaN(a))return!1;for(c=0;c<j.length;c++)if(a===j[c].position&&(!b||b===j[c].method))j[c].fired&&
n--,j.splice(c,1)};this._processOnPosition=function(){var b,c;b=j.length;if(!b||!a.playState||n>=b)return!1;for(b-=1;0<=b;b--)c=j[b],!c.fired&&a.position>=c.position&&(c.fired=!0,n++,c.method.apply(c.scope,[c.position]));return!0};this._resetOnPosition=function(a){var b,c;b=j.length;if(!b)return!1;for(b-=1;0<=b;b--)c=j[b],c.fired&&a<=c.position&&(c.fired=!1,n--);return!0};u=function(){var b=a._iO,c=b.from,e=b.to,d,f;f=function(){a.clearOnPosition(e,f);a.stop()};d=function(){if(null!==e&&!isNaN(e))a.onPosition(e,
f)};null!==c&&!isNaN(c)&&(b.position=c,b.multiShot=!1,d());return b};m=function(){var b,c=a._iO.onposition;if(c)for(b in c)if(c.hasOwnProperty(b))a.onPosition(parseInt(b,10),c[b])};s=function(){var b,c=a._iO.onposition;if(c)for(b in c)c.hasOwnProperty(b)&&a.clearOnPosition(parseInt(b,10))};l=function(){a.isHTML5&&Na(a)};I=function(){a.isHTML5&&Oa(a)};f=function(b){b||(j=[],n=0);q=!1;a._hasTimer=null;a._a=null;a._html5_canplay=!1;a.bytesLoaded=null;a.bytesTotal=null;a.duration=a._iO&&a._iO.duration?
a._iO.duration:null;a.durationEstimate=null;a.buffered=[];a.eqData=[];a.eqData.left=[];a.eqData.right=[];a.failures=0;a.isBuffering=!1;a.instanceOptions={};a.instanceCount=0;a.loaded=!1;a.metadata={};a.readyState=0;a.muted=!1;a.paused=!1;a.peakData={left:0,right:0};a.waveformData={left:[],right:[]};a.playState=0;a.position=null;a.id3={}};f();this._onTimer=function(b){var c,f=!1,g={};if(a._hasTimer||b){if(a._a&&(b||(0<a.playState||1===a.readyState)&&!a.paused))c=a._get_html5_duration(),c!==e&&(e=c,
a.duration=c,f=!0),a.durationEstimate=a.duration,c=1E3*a._a.currentTime||0,c!==d&&(d=c,f=!0),(f||b)&&a._whileplaying(c,g,g,g,g);return f}};this._get_html5_duration=function(){var b=a._iO;return(b=a._a&&a._a.duration?1E3*a._a.duration:b&&b.duration?b.duration:null)&&!isNaN(b)&&Infinity!==b?b:null};this._apply_loop=function(a,b){a.loop=1<b?"loop":""};this._setup_html5=function(b){var b=t(a._iO,b),c=decodeURI,e=w?Ha:a._a,d=c(b.url),g;w?d===ya&&(g=!0):d===r&&(g=!0);if(e){if(e._s)if(w)e._s&&(e._s.playState&&
!g)&&e._s.stop();else if(!w&&d===c(r))return a._apply_loop(e,b.loops),e;g||(f(!1),e.src=b.url,ya=r=a.url=b.url,e._called_load=!1)}else a._a=b.autoLoad||b.autoPlay?new Audio(b.url):Ba&&10>opera.version()?new Audio(null):new Audio,e=a._a,e._called_load=!1,w&&(Ha=e);a.isHTML5=!0;a._a=e;e._s=a;ab();a._apply_loop(e,b.loops);b.autoLoad||b.autoPlay?a.load():(e.autobuffer=!1,e.preload="auto");return e};ab=function(){if(a._a._added_events)return!1;var b;a._a._added_events=!0;for(b in x)x.hasOwnProperty(b)&&
a._a&&a._a.addEventListener(b,x[b],!1);return!0};i=function(){var b;a._a._added_events=!1;for(b in x)x.hasOwnProperty(b)&&a._a&&a._a.removeEventListener(b,x[b],!1)};this._onload=function(b){b=!!b||!a.isHTML5&&8===k&&a.duration;a.loaded=b;a.readyState=b?3:2;a._onbufferchange(0);a._iO.onload&&a._iO.onload.apply(a,[b]);return!0};this._onbufferchange=function(b){if(0===a.playState||b&&a.isBuffering||!b&&!a.isBuffering)return!1;a.isBuffering=1===b;a._iO.onbufferchange&&a._iO.onbufferchange.apply(a);return!0};
this._onsuspend=function(){a._iO.onsuspend&&a._iO.onsuspend.apply(a);return!0};this._onfailure=function(b,c,e){a.failures++;if(a._iO.onfailure&&1===a.failures)a._iO.onfailure(a,b,c,e)};this._onfinish=function(){var b=a._iO.onfinish;a._onbufferchange(0);a._resetOnPosition(0);a.instanceCount&&(a.instanceCount--,a.instanceCount||(s(),a.playState=0,a.paused=!1,a.instanceCount=0,a.instanceOptions={},a._iO={},I(),a.isHTML5&&(a.position=0)),(!a.instanceCount||a._iO.multiShotEvents)&&b&&b.apply(a))};this._whileloading=
function(b,c,e,d){var f=a._iO;a.bytesLoaded=b;a.bytesTotal=c;a.duration=Math.floor(e);a.bufferLength=d;a.durationEstimate=!a.isHTML5&&!f.isMovieStar?f.duration?a.duration>f.duration?a.duration:f.duration:parseInt(a.bytesTotal/a.bytesLoaded*a.duration,10):a.duration;a.isHTML5||(a.buffered=[{start:0,end:a.duration}]);(3!==a.readyState||a.isHTML5)&&f.whileloading&&f.whileloading.apply(a)};this._whileplaying=function(b,c,e,d,f){var h=a._iO;if(isNaN(b)||null===b)return!1;a.position=Math.max(0,b);a._processOnPosition();
!a.isHTML5&&8<k&&(h.usePeakData&&(c!==g&&c)&&(a.peakData={left:c.leftPeak,right:c.rightPeak}),h.useWaveformData&&(e!==g&&e)&&(a.waveformData={left:e.split(","),right:d.split(",")}),h.useEQData&&(f!==g&&f&&f.leftEQ)&&(b=f.leftEQ.split(","),a.eqData=b,a.eqData.left=b,f.rightEQ!==g&&f.rightEQ&&(a.eqData.right=f.rightEQ.split(","))));1===a.playState&&(!a.isHTML5&&(8===k&&!a.position&&a.isBuffering)&&a._onbufferchange(0),h.whileplaying&&h.whileplaying.apply(a));return!0};this._oncaptiondata=function(b){a.captiondata=
b;a._iO.oncaptiondata&&a._iO.oncaptiondata.apply(a,[b])};this._onmetadata=function(b,c){var e={},d,f;d=0;for(f=b.length;d<f;d++)e[b[d]]=c[d];a.metadata=e;a._iO.onmetadata&&a._iO.onmetadata.apply(a)};this._onid3=function(b,c){var e=[],d,f;d=0;for(f=b.length;d<f;d++)e[b[d]]=c[d];a.id3=t(a.id3,e);a._iO.onid3&&a._iO.onid3.apply(a)};this._onconnect=function(b){b=1===b;if(a.connected=b)a.failures=0,p(a.id)&&(a.getAutoPlay()?a.play(g,a.getAutoPlay()):a._iO.autoLoad&&a.load()),a._iO.onconnect&&a._iO.onconnect.apply(a,
[b])};this._ondataerror=function(){0<a.playState&&a._iO.ondataerror&&a._iO.ondataerror.apply(a)}};qa=function(){return l.body||l._docElement||l.getElementsByTagName("div")[0]};T=function(b){return l.getElementById(b)};t=function(b,e){var d=b||{},a,f;a=e===g?c.defaultOptions:e;for(f in a)a.hasOwnProperty(f)&&d[f]===g&&(d[f]="object"!==typeof a[f]||null===a[f]?a[f]:t(d[f],a[f]));return d};U={onready:1,ontimeout:1,defaultOptions:1,flash9Options:1,movieStarOptions:1};ka=function(b,e){var d,a=!0,f=e!==
g,h=c.setupOptions;for(d in b)if(b.hasOwnProperty(d))if("object"!==typeof b[d]||null===b[d]||b[d]instanceof Array||b[d]instanceof RegExp)f&&U[e]!==g?c[e][d]=b[d]:h[d]!==g?(c.setupOptions[d]=b[d],c[d]=b[d]):U[d]===g?(H(v(c[d]===g?"setupUndef":"setupError",d),2),a=!1):c[d]instanceof Function?c[d].apply(c,b[d]instanceof Array?b[d]:[b[d]]):c[d]=b[d];else if(U[d]===g)H(v(c[d]===g?"setupUndef":"setupError",d),2),a=!1;else return ka(b[d],d);return a};var bb=function(b){var b=db.call(b),c=b.length;ea?(b[1]=
"on"+b[1],3<c&&b.pop()):3===c&&b.push(!1);return b},cb=function(b,c){var d=b.shift(),a=[gb[c]];if(ea)d[a](b[0],b[1]);else d[a].apply(d,b)},ea=i.attachEvent,gb={add:ea?"attachEvent":"addEventListener",remove:ea?"detachEvent":"removeEventListener"};n={add:function(){cb(bb(arguments),"add")},remove:function(){cb(bb(arguments),"remove")}};x={abort:m(function(){}),canplay:m(function(){var b=this._s,c;if(b._html5_canplay)return!0;b._html5_canplay=!0;b._onbufferchange(0);c=b._iO.position!==g&&!isNaN(b._iO.position)?
b._iO.position/1E3:null;if(b.position&&this.currentTime!==c)try{this.currentTime=c}catch(d){}b._iO._oncanplay&&b._iO._oncanplay()}),canplaythrough:m(function(){var b=this._s;b.loaded||(b._onbufferchange(0),b._whileloading(b.bytesLoaded,b.bytesTotal,b._get_html5_duration()),b._onload(!0))}),ended:m(function(){this._s._onfinish()}),error:m(function(){this._s._onload(!1)}),loadeddata:m(function(){var b=this._s;!b._loaded&&!Aa&&(b.duration=b._get_html5_duration())}),loadedmetadata:m(function(){}),loadstart:m(function(){this._s._onbufferchange(1)}),
play:m(function(){this._s._onbufferchange(0)}),playing:m(function(){this._s._onbufferchange(0)}),progress:m(function(b){var c=this._s,d,a,f=0,f=b.target.buffered;d=b.loaded||0;var g=b.total||1;c.buffered=[];if(f&&f.length){d=0;for(a=f.length;d<a;d++)c.buffered.push({start:1E3*f.start(d),end:1E3*f.end(d)});f=1E3*(f.end(0)-f.start(0));d=f/(1E3*b.target.duration)}isNaN(d)||(c._onbufferchange(0),c._whileloading(d,g,c._get_html5_duration()),d&&(g&&d===g)&&x.canplaythrough.call(this,b))}),ratechange:m(function(){}),
suspend:m(function(b){var c=this._s;x.progress.call(this,b);c._onsuspend()}),stalled:m(function(){}),timeupdate:m(function(){this._s._onTimer()}),waiting:m(function(){this._s._onbufferchange(1)})};ba=function(b){return b.serverURL||b.type&&S(b.type)?!1:b.type?Q({type:b.type}):Q({url:b.url})||c.html5Only};wa=function(b,c){b&&(b.src=c,b._called_load=!1);w&&(ya=null)};Q=function(b){if(!c.useHTML5Audio||!c.hasHTML5)return!1;var e=b.url||null,b=b.type||null,d=c.audioFormats,a;if(b&&c.html5[b]!==g)return c.html5[b]&&
!S(b);if(!y){y=[];for(a in d)d.hasOwnProperty(a)&&(y.push(a),d[a].related&&(y=y.concat(d[a].related)));y=RegExp("\\.("+y.join("|")+")(\\?.*)?$","i")}a=e?e.toLowerCase().match(y):null;!a||!a.length?b&&(e=b.indexOf(";"),a=(-1!==e?b.substr(0,e):b).substr(6)):a=a[1];a&&c.html5[a]!==g?e=c.html5[a]&&!S(a):(b="audio/"+a,e=c.html5.canPlayType({type:b}),e=(c.html5[a]=e)&&c.html5[b]&&!S(b));return e};Sa=function(){function b(a){var b,d,f=b=!1;if(!e||"function"!==typeof e.canPlayType)return b;if(a instanceof
Array){b=0;for(d=a.length;b<d;b++)if(c.html5[a[b]]||e.canPlayType(a[b]).match(c.html5Test))f=!0,c.html5[a[b]]=!0,c.flash[a[b]]=!!a[b].match(Xa);b=f}else a=e&&"function"===typeof e.canPlayType?e.canPlayType(a):!1,b=!(!a||!a.match(c.html5Test));return b}if(!c.useHTML5Audio||!c.hasHTML5)return!1;var e=Audio!==g?Ba&&10>opera.version()?new Audio(null):new Audio:null,d,a,f={},h;h=c.audioFormats;for(d in h)if(h.hasOwnProperty(d)&&(a="audio/"+d,f[d]=b(h[d].type),f[a]=f[d],d.match(Xa)?(c.flash[d]=!0,c.flash[a]=
!0):(c.flash[d]=!1,c.flash[a]=!1),h[d]&&h[d].related))for(a=h[d].related.length-1;0<=a;a--)f["audio/"+h[d].related[a]]=f[d],c.html5[h[d].related[a]]=f[d],c.flash[h[d].related[a]]=f[d];f.canPlayType=e?b:null;c.html5=t(c.html5,f);return!0};na={};v=function(){};Y=function(b){8===k&&(1<b.loops&&b.stream)&&(b.stream=!1);return b};Z=function(b){if(b&&!b.usePolicyFile&&(b.onid3||b.usePeakData||b.useWaveformData||b.useEQData))b.usePolicyFile=!0;return b};H=function(){};ha=function(){return!1};La=function(b){for(var c in b)b.hasOwnProperty(c)&&
"function"===typeof b[c]&&(b[c]=ha)};sa=function(b){b===g&&(b=!1);(s||b)&&c.disable(b)};Ma=function(b){var e=null;if(b)if(b.match(/\.swf(\?.*)?$/i)){if(e=b.substr(b.toLowerCase().lastIndexOf(".swf?")+4))return b}else b.lastIndexOf("/")!==b.length-1&&(b+="/");b=(b&&-1!==b.lastIndexOf("/")?b.substr(0,b.lastIndexOf("/")+1):"./")+c.movieURL;c.noSWFCache&&(b+="?ts="+(new Date).getTime());return b};ma=function(){k=parseInt(c.flashVersion,10);8!==k&&9!==k&&(c.flashVersion=k=8);var b=c.debugMode||c.debugFlash?
"_debug.swf":".swf";c.useHTML5Audio&&(!c.html5Only&&c.audioFormats.mp4.required&&9>k)&&(c.flashVersion=k=9);c.version=c.versionNumber+(c.html5Only?" (HTML5-only mode)":9===k?" (AS3/Flash 9)":" (AS2/Flash 8)");8<k?(c.defaultOptions=t(c.defaultOptions,c.flash9Options),c.features.buffering=!0,c.defaultOptions=t(c.defaultOptions,c.movieStarOptions),c.filePatterns.flash9=RegExp("\\.(mp3|"+$a.join("|")+")(\\?.*)?$","i"),c.features.movieStar=!0):c.features.movieStar=!1;c.filePattern=c.filePatterns[8!==k?
"flash9":"flash8"];c.movieURL=(8===k?"soundmanager2.swf":"soundmanager2_flash9.swf").replace(".swf",b);c.features.peakData=c.features.waveformData=c.features.eqData=8<k};Ka=function(b,c){if(!h)return!1;h._setPolling(b,c)};ra=function(){c.debugURLParam.test(ga)&&(c.debugMode=!0)};p=this.getSoundById;G=function(){var b=[];c.debugMode&&b.push("sm2_debug");c.debugFlash&&b.push("flash_debug");c.useHighPerformance&&b.push("high_performance");return b.join(" ")};ua=function(){v("fbHandler");var b=c.getMoviePercent(),
e={type:"FLASHBLOCK"};if(c.html5Only)return!1;c.ok()?c.oMC&&(c.oMC.className=[G(),"movieContainer","swf_loaded"+(c.didFlashBlock?" swf_unblocked":"")].join(" ")):(u&&(c.oMC.className=G()+" movieContainer "+(null===b?"swf_timedout":"swf_error")),c.didFlashBlock=!0,B({type:"ontimeout",ignoreInit:!0,error:e}),F(e))};la=function(b,c,d){r[b]===g&&(r[b]=[]);r[b].push({method:c,scope:d||null,fired:!1})};B=function(b){b||(b={type:c.ok()?"onready":"ontimeout"});if(!j&&b&&!b.ignoreInit||"ontimeout"===b.type&&
(c.ok()||s&&!b.ignoreInit))return!1;var e={success:b&&b.ignoreInit?c.ok():!s},d=b&&b.type?r[b.type]||[]:[],a=[],f,e=[e],g=u&&!c.ok();b.error&&(e[0].error=b.error);b=0;for(f=d.length;b<f;b++)!0!==d[b].fired&&a.push(d[b]);if(a.length){b=0;for(f=a.length;b<f;b++)a[b].scope?a[b].method.apply(a[b].scope,e):a[b].method.apply(this,e),g||(a[b].fired=!0)}return!0};C=function(){i.setTimeout(function(){c.useFlashBlock&&ua();B();"function"===typeof c.onload&&c.onload.apply(i);c.waitForWindowLoad&&n.add(i,"load",
C)},1)};za=function(){if(A!==g)return A;var b=!1,c=navigator,d=c.plugins,a,f=i.ActiveXObject;if(d&&d.length)(c=c.mimeTypes)&&(c["application/x-shockwave-flash"]&&c["application/x-shockwave-flash"].enabledPlugin&&c["application/x-shockwave-flash"].enabledPlugin.description)&&(b=!0);else if(f!==g&&!q.match(/MSAppHost/i)){try{a=new f("ShockwaveFlash.ShockwaveFlash")}catch(h){}b=!!a}return A=b};Ra=function(){var b,e,d=c.audioFormats;if(ca&&q.match(/os (1|2|3_0|3_1)/i))c.hasHTML5=!1,c.html5Only=!0,c.oMC&&
(c.oMC.style.display="none");else if(c.useHTML5Audio&&(!c.html5||!c.html5.canPlayType))c.hasHTML5=!1;if(c.useHTML5Audio&&c.hasHTML5)for(e in d)if(d.hasOwnProperty(e)&&(d[e].required&&!c.html5.canPlayType(d[e].type)||c.preferFlash&&(c.flash[e]||c.flash[d[e].type])))b=!0;c.ignoreFlash&&(b=!1);c.html5Only=c.hasHTML5&&c.useHTML5Audio&&!b;return!c.html5Only};aa=function(b){var e,d,a=0;if(b instanceof Array){e=0;for(d=b.length;e<d;e++)if(b[e]instanceof Object){if(c.canPlayMIME(b[e].type)){a=e;break}}else if(c.canPlayURL(b[e])){a=
e;break}b[a].url&&(b[a]=b[a].url);b=b[a]}return b};Na=function(b){b._hasTimer||(b._hasTimer=!0,!Ca&&c.html5PollingInterval&&(null===P&&0===$&&(P=i.setInterval(Pa,c.html5PollingInterval)),$++))};Oa=function(b){b._hasTimer&&(b._hasTimer=!1,!Ca&&c.html5PollingInterval&&$--)};Pa=function(){var b;if(null!==P&&!$)return i.clearInterval(P),P=null,!1;for(b=c.soundIDs.length-1;0<=b;b--)c.sounds[c.soundIDs[b]].isHTML5&&c.sounds[c.soundIDs[b]]._hasTimer&&c.sounds[c.soundIDs[b]]._onTimer()};F=function(b){b=b!==
g?b:{};"function"===typeof c.onerror&&c.onerror.apply(i,[{type:b.type!==g?b.type:null}]);b.fatal!==g&&b.fatal&&c.disable()};Ta=function(){if(!Va||!za())return!1;var b=c.audioFormats,e,d;for(d in b)if(b.hasOwnProperty(d)&&("mp3"===d||"mp4"===d))if(c.html5[d]=!1,b[d]&&b[d].related)for(e=b[d].related.length-1;0<=e;e--)c.html5[b[d].related[e]]=!1};this._setSandboxType=function(){};this._externalInterfaceOK=function(){if(c.swfLoaded)return!1;c.swfLoaded=!0;da=!1;Va&&Ta();setTimeout(ia,z?100:1)};X=function(b,
e){function d(a,b){return'<param name="'+a+'" value="'+b+'" />'}if(J&&K)return!1;if(c.html5Only)return ma(),c.oMC=T(c.movieID),ia(),K=J=!0,!1;var a=e||c.url,f=c.altURL||a,h=qa(),i=G(),k=null,k=l.getElementsByTagName("html")[0],j,n,m,k=k&&k.dir&&k.dir.match(/rtl/i),b=b===g?c.id:b;ma();c.url=Ma(Ea?a:f);e=c.url;c.wmode=!c.wmode&&c.useHighPerformance?"transparent":c.wmode;if(null!==c.wmode&&(q.match(/msie 8/i)||!z&&!c.useHighPerformance)&&navigator.platform.match(/win32|win64/i))Qa.push(na.spcWmode),
c.wmode=null;h={name:b,id:b,src:e,quality:"high",allowScriptAccess:c.allowScriptAccess,bgcolor:c.bgColor,pluginspage:Ya+"www.macromedia.com/go/getflashplayer",title:"JS/Flash audio component (SoundManager 2)",type:"application/x-shockwave-flash",wmode:c.wmode,hasPriority:"true"};c.debugFlash&&(h.FlashVars="debug=1");c.wmode||delete h.wmode;if(z)a=l.createElement("div"),n=['<object id="'+b+'" data="'+e+'" type="'+h.type+'" title="'+h.title+'" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="'+
Ya+'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0">',d("movie",e),d("AllowScriptAccess",c.allowScriptAccess),d("quality",h.quality),c.wmode?d("wmode",c.wmode):"",d("bgcolor",c.bgColor),d("hasPriority","true"),c.debugFlash?d("FlashVars",h.FlashVars):"","</object>"].join("");else for(j in a=l.createElement("embed"),h)h.hasOwnProperty(j)&&a.setAttribute(j,h[j]);ra();i=G();if(h=qa())if(c.oMC=T(c.movieID)||l.createElement("div"),c.oMC.id)m=c.oMC.className,c.oMC.className=
(m?m+" ":"movieContainer")+(i?" "+i:""),c.oMC.appendChild(a),z&&(j=c.oMC.appendChild(l.createElement("div")),j.className="sm2-object-box",j.innerHTML=n),K=!0;else{c.oMC.id=c.movieID;c.oMC.className="movieContainer "+i;j=i=null;c.useFlashBlock||(c.useHighPerformance?i={position:"fixed",width:"8px",height:"8px",bottom:"0px",left:"0px",overflow:"hidden"}:(i={position:"absolute",width:"6px",height:"6px",top:"-9999px",left:"-9999px"},k&&(i.left=Math.abs(parseInt(i.left,10))+"px")));eb&&(c.oMC.style.zIndex=
1E4);if(!c.debugFlash)for(m in i)i.hasOwnProperty(m)&&(c.oMC.style[m]=i[m]);try{z||c.oMC.appendChild(a),h.appendChild(c.oMC),z&&(j=c.oMC.appendChild(l.createElement("div")),j.className="sm2-object-box",j.innerHTML=n),K=!0}catch(p){throw Error(v("domError")+" \n"+p.toString());}}return J=!0};W=function(){if(c.html5Only)return X(),!1;if(h||!c.url)return!1;h=c.getMovie(c.id);h||(N?(z?c.oMC.innerHTML=ta:c.oMC.appendChild(N),N=null,J=!0):X(c.id,c.url),h=c.getMovie(c.id));"function"===typeof c.oninitmovie&&
setTimeout(c.oninitmovie,1);return!0};D=function(){setTimeout(Ja,1E3)};Ja=function(){var b,e=!1;if(!c.url||O)return!1;O=!0;n.remove(i,"load",D);if(da&&!Da)return!1;j||(b=c.getMoviePercent(),0<b&&100>b&&(e=!0));setTimeout(function(){b=c.getMoviePercent();if(e)return O=!1,i.setTimeout(D,1),!1;!j&&Wa&&(null===b?c.useFlashBlock||0===c.flashLoadTimeout?c.useFlashBlock&&ua():B({type:"ontimeout",ignoreInit:!0}):0!==c.flashLoadTimeout&&sa(!0))},c.flashLoadTimeout)};V=function(){if(Da||!da)return n.remove(i,
"focus",V),!0;Da=Wa=!0;O=!1;D();n.remove(i,"focus",V);return!0};L=function(b){if(j)return!1;if(c.html5Only)return j=!0,C(),!0;var e=!0,d;if(!c.useFlashBlock||!c.flashLoadTimeout||c.getMoviePercent())j=!0,s&&(d={type:!A&&u?"NO_FLASH":"INIT_TIMEOUT"});if(s||b)c.useFlashBlock&&c.oMC&&(c.oMC.className=G()+" "+(null===c.getMoviePercent()?"swf_timedout":"swf_error")),B({type:"ontimeout",error:d,ignoreInit:!0}),F(d),e=!1;s||(c.waitForWindowLoad&&!ja?n.add(i,"load",C):C());return e};Ia=function(){var b,e=
c.setupOptions;for(b in e)e.hasOwnProperty(b)&&(c[b]===g?c[b]=e[b]:c[b]!==e[b]&&(c.setupOptions[b]=c[b]))};ia=function(){if(j)return!1;if(c.html5Only)return j||(n.remove(i,"load",c.beginDelayedInit),c.enabled=!0,L()),!0;W();try{h._externalInterfaceTest(!1),Ka(!0,c.flashPollingInterval||(c.useHighPerformance?10:50)),c.debugMode||h._disableDebug(),c.enabled=!0,c.html5Only||n.add(i,"unload",ha)}catch(b){return F({type:"JS_TO_FLASH_EXCEPTION",fatal:!0}),sa(!0),L(),!1}L();n.remove(i,"load",c.beginDelayedInit);
return!0};E=function(){if(M)return!1;M=!0;Ia();ra();!A&&c.hasHTML5&&c.setup({useHTML5Audio:!0,preferFlash:!1});Sa();c.html5.usingFlash=Ra();u=c.html5.usingFlash;!A&&u&&(Qa.push(na.needFlash),c.setup({flashLoadTimeout:1}));l.removeEventListener&&l.removeEventListener("DOMContentLoaded",E,!1);W();return!0};xa=function(){"complete"===l.readyState&&(E(),l.detachEvent("onreadystatechange",xa));return!0};pa=function(){ja=!0;n.remove(i,"load",pa)};oa=function(){if(Ca&&(c.setupOptions.useHTML5Audio=!0,c.setupOptions.preferFlash=
!1,ca||Ua&&!q.match(/android\s2\.3/i)))ca&&(c.ignoreFlash=!0),w=!0};oa();za();n.add(i,"focus",V);n.add(i,"load",D);n.add(i,"load",pa);l.addEventListener?l.addEventListener("DOMContentLoaded",E,!1):l.attachEvent?l.attachEvent("onreadystatechange",xa):F({type:"NO_DOM2_EVENTS",fatal:!0})}var fa=null;if(void 0===i.SM2_DEFER||!SM2_DEFER)fa=new R;i.SoundManager=R;i.soundManager=fa})(window);if (window.location.href.indexOf('network') > -1 && window.location.href.indexOf('oauth_proxy') > -1) {document.domain = window.location.host.replace('www.', '');}var hello=function(e){return hello.use(e)};hello.utils={extend:function(e){for(var t=Array.prototype.slice.call(arguments,1),n=0;n<t.length;n++){var o=t[n];if(e instanceof Object&&o instanceof Object&&e!==o)for(var i in o)e[i]=hello.utils.extend(e[i],o[i]);else e=o}return e}},hello.utils.extend(hello,{settings:{redirect_uri:window.location.href.split("#")[0],response_type:"token",display:"popup",state:"",oauth_proxy:"https://auth-server.herokuapp.com/proxy",timeout:2e4,default_service:null,force:!0,page_uri:window.location.href},service:function(e){return"undefined"!=typeof e?this.utils.store("sync_service",e):this.utils.store("sync_service")},services:{},use:function(e){var t=this.utils.objectCreate(this);return t.settings=this.utils.objectCreate(this.settings),e&&(t.settings.default_service=e),t.utils.Event.call(t),t},init:function(e,t){var n=this.utils;if(!e)return this.services;for(var o in e)e.hasOwnProperty(o)&&"object"!=typeof e[o]&&(e[o]={id:e[o]});n.extend(this.services,e);for(o in this.services)this.services.hasOwnProperty(o)&&(this.services[o].scope=this.services[o].scope||{});return t&&(n.extend(this.settings,t),"redirect_uri"in t&&(this.settings.redirect_uri=n.url(t.redirect_uri).href)),this},login:function(){function e(e,t){hello.emit(e,t)}function t(e,t){return{error:{code:e,message:t}}}function n(e){return e}var o,i=this,a=i.utils,r=a.Promise(),s=a.args({network:"s",options:"o",callback:"f"},arguments),l=s.options=a.merge(i.settings,s.options||{});if(s.network=s.network||i.settings.default_service,r.proxy.then(s.callback,s.callback),r.proxy.then(e.bind(this,"auth.login auth"),e.bind(this,"auth.failed auth")),"string"!=typeof s.network||!(s.network in i.services))return r.reject(t("invalid_network","The provided network was not recognized"));var u=i.services[s.network],c=a.globalEvent(function(e){var n;n=e?JSON.parse(e):t("cancelled","The authentication was not completed"),n.error?r.reject(n):(a.store(n.network,n),r.fulfill({network:n.network,authResponse:n}))}),d=a.url(l.redirect_uri).href,f=u.oauth.response_type||l.response_type;"code"!==f||u.oauth.grant||(f="token"),s.qs={client_id:encodeURIComponent(u.id),response_type:f,redirect_uri:encodeURIComponent(d),display:l.display,scope:"basic",state:{client_id:u.id,network:s.network,display:l.display,callback:c,state:l.state,redirect_uri:d}};var p=a.store(s.network),m=(l.scope||"").toString();if(m=(m?m+",":"")+s.qs.scope,p&&"scope"in p&&p.scope instanceof String&&(m+=","+p.scope),s.qs.state.scope=a.unique(m.split(/[,\s]+/)).join(","),s.qs.scope=m.replace(/[^,\s]+/gi,function(e){if(e in u.scope)return u.scope[e];for(var t in i.services){var n=i.services[t].scope;if(n&&e in n)return""}return e}).replace(/[,\s]+/gi,","),s.qs.scope=a.unique(s.qs.scope.split(/,+/)).join(u.scope_delim||","),l.force===!1&&p&&"access_token"in p&&p.access_token&&"expires"in p&&p.expires>(new Date).getTime()/1e3){var h=a.diff(p.scope||[],s.qs.state.scope||[]);if(0===h.length)return r.fulfill({unchanged:!0,network:s.network,authResponse:p}),r}if("page"===l.display&&l.page_uri&&(s.qs.state.page_uri=a.url(l.page_uri).href),"login"in u&&"function"==typeof u.login&&u.login(s),("token"!==f||parseInt(u.oauth.version,10)<2||"none"===l.display&&u.oauth.grant&&p&&p.refresh_token)&&(s.qs.state.oauth=u.oauth,s.qs.state.oauth_proxy=l.oauth_proxy),s.qs.state=encodeURIComponent(JSON.stringify(s.qs.state)),1===parseInt(u.oauth.version,10)?o=a.qs(l.oauth_proxy,s.qs,n):"none"===l.display&&u.oauth.grant&&p&&p.refresh_token?(s.qs.refresh_token=p.refresh_token,o=a.qs(l.oauth_proxy,s.qs,n)):o=a.qs(u.oauth.auth,s.qs,n),"none"===l.display)a.iframe(o);else if("popup"===l.display)var g=a.popup(o,d,l.window_width||500,l.window_height||550),v=setInterval(function(){if((!g||g.closed)&&(clearInterval(v),!r.state)){var e=t("cancelled","Login has been cancelled");g||(e=t("blocked","Popup was blocked")),e.network=s.network,r.reject(e)}},100);else window.location=o;return r.proxy},logout:function(){function e(e,t){hello.emit(e,t)}function t(e,t){return{error:{code:e,message:t}}}var n=this,o=n.utils,i=o.Promise(),a=o.args({name:"s",options:"o",callback:"f"},arguments);if(a.options=a.options||{},i.proxy.then(a.callback,a.callback),i.proxy.then(e.bind(this,"auth.logout auth"),e.bind(this,"error")),a.name=a.name||this.settings.default_service,!a.name||a.name in n.services)if(a.name&&o.store(a.name)){var r=function(e){o.store(a.name,""),i.fulfill(hello.utils.merge({network:a.name},e||{}))},s={};if(a.options.force){var l=n.services[a.name].logout;if(l)if("function"==typeof l&&(l=l(r)),"string"==typeof l)o.iframe(l),s.force=null,s.message="Logout success on providers site was indeterminate";else if(void 0===l)return i.proxy}r(s)}else i.reject(t("invalid_session","There was no session to remove"));else i.reject(t("invalid_network","The network was unrecognized"));return i.proxy},getAuthResponse:function(e){return e=e||this.settings.default_service,e&&e in this.services?this.utils.store(e)||null:null},events:{}}),hello.utils.extend(hello.utils,{qs:function(e,t,n){if(t){var o;for(var i in t)if(e.indexOf(i)>-1){var a="[\\?\\&]"+i+"=[^\\&]*";o=new RegExp(a),e=e.replace(o,"")}}return e+(this.isEmpty(t)?"":(e.indexOf("?")>-1?"&":"?")+this.param(t,n))},param:function(e,t){var n,o,i={};if("string"==typeof e){if(t=t||decodeURIComponent,o=e.replace(/^[\#\?]/,"").match(/([^=\/\&]+)=([^\&]+)/g))for(var a=0;a<o.length;a++)n=o[a].match(/([^=]+)=(.*)/),i[n[1]]=t(n[2]);return i}t=t||encodeURIComponent;var r=e;i=[];for(var s in r)r.hasOwnProperty(s)&&r.hasOwnProperty(s)&&i.push([s,"?"===r[s]?"?":t(r[s])].join("="));return i.join("&")},store:function(e){function t(){var t={};try{t=JSON.parse(e.getItem("hello"))||{}}catch(n){}return t}function n(t){e.setItem("hello",JSON.stringify(t))}var o=[e,window.sessionStorage],i=0;for(e=o[i++];e;)try{e.setItem(i,i),e.removeItem(i);break}catch(a){e=o[i++]}return e||(e={getItem:function(e){e+="=";for(var t=document.cookie.split(";"),n=0;n<t.length;n++){var o=t[n].replace(/(^\s+|\s+$)/,"");if(o&&0===o.indexOf(e))return o.substr(e.length)}return null},setItem:function(e,t){document.cookie=e+"="+t}}),function(e,o){var i=t();if(e&&void 0===o)return i[e]||null;if(e&&null===o)try{delete i[e]}catch(a){i[e]=null}else{if(!e)return i;i[e]=o}return n(i),i||null}}(window.localStorage),append:function(e,t,n){var o="string"==typeof e?document.createElement(e):e;if("object"==typeof t)if("tagName"in t)n=t;else for(var i in t)if(t.hasOwnProperty(i))if("object"==typeof t[i])for(var a in t[i])t[i].hasOwnProperty(a)&&(o[i][a]=t[i][a]);else"html"===i?o.innerHTML=t[i]:/^on/.test(i)?o[i]=t[i]:o.setAttribute(i,t[i]);return"body"===n?!function r(){document.body?document.body.appendChild(o):setTimeout(r,16)}():"object"==typeof n?n.appendChild(o):"string"==typeof n&&document.getElementsByTagName(n)[0].appendChild(o),o},iframe:function(e){this.append("iframe",{src:e,style:{position:"absolute",left:"-1000px",bottom:0,height:"1px",width:"1px"}},"body")},merge:function(){var e=Array.prototype.slice.call(arguments);return e.unshift({}),this.extend.apply(null,e)},args:function(e,t){var n={},o=0,i=null,a=null;for(a in e)if(e.hasOwnProperty(a))break;if(1===t.length&&"object"==typeof t[0]&&"o!"!=e[a])for(a in t[0])if(e.hasOwnProperty(a)&&a in e)return t[0];for(a in e)if(e.hasOwnProperty(a))if(i=typeof t[o],"function"==typeof e[a]&&e[a].test(t[o])||"string"==typeof e[a]&&(e[a].indexOf("s")>-1&&"string"===i||e[a].indexOf("o")>-1&&"object"===i||e[a].indexOf("i")>-1&&"number"===i||e[a].indexOf("a")>-1&&"object"===i||e[a].indexOf("f")>-1&&"function"===i))n[a]=t[o++];else if("string"==typeof e[a]&&e[a].indexOf("!")>-1)return!1;return n},url:function(e){if(e){if(window.URL&&URL instanceof Function&&0!==URL.length)return new URL(e,window.location);var t=document.createElement("a");return t.href=e,t}return window.location},diff:function(e,t){for(var n=[],o=0;o<t.length;o++)-1===this.indexOf(e,t[o])&&n.push(t[o]);return n},indexOf:function(e,t){if(e.indexOf)return e.indexOf(t);for(var n=0;n<e.length;n++)if(e[n]===t)return n;return-1},unique:function(e){if("object"!=typeof e)return[];for(var t=[],n=0;n<e.length;n++)e[n]&&0!==e[n].length&&-1===this.indexOf(t,e[n])&&t.push(e[n]);return t},isEmpty:function(e){if(!e)return!0;if(e&&e.length>0)return!1;if(e&&0===e.length)return!0;for(var t in e)if(e.hasOwnProperty(t))return!1;return!0},objectCreate:function(){function e(){}return Object.create?Object.create:function(t){if(1!=arguments.length)throw new Error("Object.create implementation only accepts one parameter.");return e.prototype=t,new e}}(),Promise:function(){var e=0,t=1,n=2,o=function(t){return this instanceof o?(this.id="Thenable/1.0.6",this.state=e,this.fulfillValue=void 0,this.rejectReason=void 0,this.onFulfilled=[],this.onRejected=[],this.proxy={then:this.then.bind(this)},void("function"==typeof t&&t.call(this,this.fulfill.bind(this),this.reject.bind(this)))):new o(t)};o.prototype={fulfill:function(e){return i(this,t,"fulfillValue",e)},reject:function(e){return i(this,n,"rejectReason",e)},then:function(e,t){var n=this,i=new o;return n.onFulfilled.push(s(e,i,"fulfill")),n.onRejected.push(s(t,i,"reject")),a(n),i.proxy}};var i=function(t,n,o,i){return t.state===e&&(t.state=n,t[o]=i,a(t)),t},a=function(e){e.state===t?r(e,"onFulfilled",e.fulfillValue):e.state===n&&r(e,"onRejected",e.rejectReason)},r=function(e,t,n){if(0!==e[t].length){var o=e[t];e[t]=[];var i=function(){for(var e=0;e<o.length;e++)o[e](n)};"object"==typeof process&&"function"==typeof process.nextTick?process.nextTick(i):"function"==typeof setImmediate?setImmediate(i):setTimeout(i,0)}},s=function(e,t,n){return function(o){if("function"!=typeof e)t[n].call(t,o);else{var i;try{i=e(o)}catch(a){return void t.reject(a)}l(t,i)}}},l=function(e,t){if(e===t||e.proxy===t)return void e.reject(new TypeError("cannot resolve promise with itself"));var n;if("object"==typeof t&&null!==t||"function"==typeof t)try{n=t.then}catch(o){return void e.reject(o)}if("function"!=typeof n)e.fulfill(t);else{var i=!1;try{n.call(t,function(n){i||(i=!0,n===t?e.reject(new TypeError("circular thenable chain")):l(e,n))},function(t){i||(i=!0,e.reject(t))})}catch(o){i||e.reject(o)}}};return o}(),Event:function(){var e=/[\s\,]+/;return this.parent={events:this.events,findEvents:this.findEvents,parent:this.parent,utils:this.utils},this.events={},this.on=function(t,n){if(n&&"function"==typeof n)for(var o=t.split(e),i=0;i<o.length;i++)this.events[o[i]]=[n].concat(this.events[o[i]]||[]);return this},this.off=function(e,t){return this.findEvents(e,function(e,n){t&&this.events[e][n]!==t||(this.events[e][n]=null)}),this},this.emit=function(e){var t=Array.prototype.slice.call(arguments,1);t.push(e);for(var n=function(n,o){t[t.length-1]="*"===n?e:n,this.events[n][o].apply(this,t)},o=this;o&&o.findEvents;)o.findEvents(e+",*",n),o=o.parent;return this},this.emitAfter=function(){var e=this,t=arguments;return setTimeout(function(){e.emit.apply(e,t)},0),this},this.findEvents=function(t,n){var o=t.split(e);for(var i in this.events)if(this.events.hasOwnProperty(i)&&hello.utils.indexOf(o,i)>-1)for(var a=0;a<this.events[i].length;a++)this.events[i][a]&&n.call(this,i,a)},this},globalEvent:function(e,t){return t=t||"_hellojs_"+parseInt(1e12*Math.random(),10).toString(36),window[t]=function(){try{bool=e.apply(this,arguments)}catch(n){console.error(n)}if(bool)try{delete window[t]}catch(n){}},t},popup:function(e,t,n,o){var i=document.documentElement,a=void 0!==window.screenLeft?window.screenLeft:screen.left,r=void 0!==window.screenTop?window.screenTop:screen.top,s=window.innerWidth||i.clientWidth||screen.width,l=window.innerHeight||i.clientHeight||screen.height,u=(s-n)/2+a,c=(l-o)/2+r,d=function(e){var i=window.open(e,"_blank","resizeable=true,height="+o+",width="+n+",left="+u+",top="+c);if(i&&i.addEventListener){var a=hello.utils.url(t),r=a.origin||a.protocol+"//"+a.hostname;i.addEventListener("loadstart",function(e){var t=e.url;if(0===t.indexOf(r)){var n=hello.utils.url(t),o={location:{assign:function(e){i.addEventListener("exit",function(){setTimeout(function(){d(e)},1e3)})},search:n.search,hash:n.hash,href:n.href},close:function(){i.close&&i.close()}};hello.utils.responseHandler(o,window),o.close()}})}return i&&i.focus&&i.focus(),i};return-1!==navigator.userAgent.indexOf("Safari")&&-1===navigator.userAgent.indexOf("Chrome")&&(e=t+"#oauth_redirect="+encodeURIComponent(encodeURIComponent(e))),d(e)},responseHandler:function(e,t){function n(e,t,n){if(a.store(e.network,e),!("display"in e&&"page"===e.display)){if(n){var i=e.callback;try{delete e.callback}catch(r){}if(a.store(e.network,e),i in n){var s=JSON.stringify(e);try{n[i](s)}catch(r){}}}o()}}function o(){try{e.close()}catch(t){}e.addEventListener&&e.addEventListener("load",function(){e.close()})}var i,a=this,r=e.location,s=function(t){r.assign?r.assign(t):e.location=t};if(i=a.param(r.search),i&&(i.code&&i.state||i.oauth_token&&i.proxy_url)){var l=JSON.parse(i.state);i.redirect_uri=l.redirect_uri||r.href.replace(/[\?\#].*$/,"");var u=(l.oauth_proxy||i.proxy_url)+"?"+a.param(i);return void s(u)}if(i=a.merge(a.param(r.search||""),a.param(r.hash||"")),i&&"state"in i){try{var c=JSON.parse(i.state);a.extend(i,c)}catch(d){console.error("Could not decode state parameter")}if("access_token"in i&&i.access_token&&i.network)i.expires_in&&0!==parseInt(i.expires_in,10)||(i.expires_in=0),i.expires_in=parseInt(i.expires_in,10),i.expires=(new Date).getTime()/1e3+(i.expires_in||31536e3),n(i,e,t);else if("error"in i&&i.error&&i.network)i.error={code:i.error,message:i.error_message||i.error_description},n(i,e,t);else if(i.callback&&i.callback in t){var f="result"in i&&i.result?JSON.parse(i.result):!1;t[i.callback](f),o()}i.page_uri&&(e.location=i.page_uri)}else if("oauth_redirect"in i)return void s(decodeURIComponent(i.oauth_redirect))}}),hello.utils.Event.call(hello),hello.utils.responseHandler(window,window.opener||window.parent),function(e){var t={},n={};e.on("auth.login, auth.logout",function(n){n&&"object"==typeof n&&n.network&&(t[n.network]=e.utils.store(n.network)||{})}),function o(){var i=(new Date).getTime()/1e3,a=function(t){e.emit("auth."+t,{network:r,authResponse:s})};for(var r in e.services)if(e.services.hasOwnProperty(r)){if(!e.services[r].id)continue;var s=e.utils.store(r)||{},l=e.services[r],u=t[r]||{};if(s&&"callback"in s){var c=s.callback;try{delete s.callback}catch(d){}e.utils.store(r,s);try{window[c](s)}catch(d){}}if(s&&"expires"in s&&s.expires<i){var f=l.refresh||s.refresh_token;!f||r in n&&!(n[r]<i)?f||r in n||(a("expired"),n[r]=!0):(e.emit("notice",r+" has expired trying to resignin"),e.login(r,{display:"none",force:!1}),n[r]=i+600);continue}if(u.access_token===s.access_token&&u.expires===s.expires)continue;!s.access_token&&u.access_token?a("logout"):s.access_token&&!u.access_token?a("login"):s.expires!==u.expires&&a("update"),t[r]=s,r in n&&delete n[r]}setTimeout(o,1e3)}()}(hello),hello.api=function(){function e(e){e=e.replace(/\@\{([a-z\_\-]+)(\|.+?)?\}/gi,function(e,n,o){var r=o?o.replace(/^\|/,""):"";return n in a.query?(r=a.query[n],delete a.query[n]):o||i.reject(t("missing_attribute","The attribute "+n+" is missing from the request")),r}),e.match(/^https?:\/\//)||(e=u.base+e),a.url=e,o.request(a,function(e,t){if(e===!0?e={success:!0}:e||(e={}),"delete"===a.method&&(e=!e||o.isEmpty(e)?{success:!0}:e),u.wrap&&(a.path in u.wrap||"default"in u.wrap)){var n=a.path in u.wrap?a.path:"default",r=((new Date).getTime(),u.wrap[n](e,t,a));r&&(e=r)}e&&"paging"in e&&e.paging.next&&("?"===e.paging.next[0]?e.paging.next=a.path+e.paging.next:e.paging.next+="#"+a.path),!e||"error"in e?i.reject(e):i.fulfill(e)})}function t(e,t){return{error:{code:e,message:t}}}var n=this,o=n.utils,i=o.Promise(),a=o.args({path:"s!",query:"o",method:"s",data:"o",timeout:"i",callback:"f"},arguments);a.method=(a.method||"get").toLowerCase(),a.headers=a.headers||{},a.query=a.query||{},("get"===a.method||"delete"===a.method)&&(o.extend(a.query,a.data),a.data={});var r=a.data=a.data||{};if(i.then(a.callback,a.callback),!a.path)return i.reject(t("invalid_path","Missing the path parameter from the request"));a.path=a.path.replace(/^\/+/,"");var s=(a.path.split(/[\/\:]/,2)||[])[0].toLowerCase();if(s in n.services){a.network=s;var l=new RegExp("^"+s+":?/?");a.path=a.path.replace(l,"")}a.network=n.settings.default_service=a.network||n.settings.default_service;var u=n.services[a.network];if(!u)return i.reject(t("invalid_network","Could not match the service requested: "+a.network));if(a.method in u&&a.path in u[a.method]&&u[a.method][a.path]===!1)return i.reject(t("invalid_path","The provided path is not available on the selected network"));a.oauth_proxy||(a.oauth_proxy=n.settings.oauth_proxy),"proxy"in a||(a.proxy=a.oauth_proxy&&u.oauth&&1===parseInt(u.oauth.version,10)),"timeout"in a||(a.timeout=n.settings.timeout);var c=n.getAuthResponse(a.network);c&&c.access_token&&(a.query.access_token=c.access_token);var d,f=a.path;a.options=o.clone(a.query),a.data=o.clone(r);var p=u[{"delete":"del"}[a.method]||a.method]||{};if("get"===a.method){var m=f.split(/[\?#]/)[1];m&&(o.extend(a.query,o.param(m)),f=f.replace(/\?.*?(#|$)/,"$1"))}return(d=f.match(/#(.+)/,""))?(f=f.split("#")[0],a.path=d[1]):f in p?(a.path=f,f=p[f]):"default"in p&&(f=p["default"]),a.redirect_uri=n.settings.redirect_uri,a.oauth=u.oauth,a.xhr=u.xhr,a.jsonp=u.jsonp,a.form=u.form,"function"==typeof f?f(a,e):e(f),i.proxy},hello.utils.extend(hello.utils,{request:function(e,t){function n(e,t){var n;e.oauth&&1===parseInt(e.oauth.version,10)&&(n=e.query.access_token,delete e.query.access_token,e.proxy=!0),!e.data||"get"!==e.method&&"delete"!==e.method||(o.extend(e.query,e.data),e.data=null);var i=o.qs(e.url,e.query);e.proxy&&(i=o.qs(e.oauth_proxy,{path:i,access_token:n||"",then:"get"===e.method.toLowerCase()?"redirect":"proxy",method:e.method.toLowerCase(),suppress_response_codes:!0})),t(i)}var o=this;if(o.isEmpty(e.data)||"FileList"in window||!o.hasBinary(e.data)||(e.xhr=!1,e.jsonp=!1),"withCredentials"in new XMLHttpRequest&&(!("xhr"in e)||e.xhr&&("function"!=typeof e.xhr||e.xhr(e,e.query))))return void n(e,function(n){var i=o.xhr(e.method,n,e.headers,e.data,t);i.onprogress=e.onprogress||null,i.upload&&e.onuploadprogress&&(i.upload.onprogress=e.onuploadprogress)});var i=e.query;if(e.query=o.clone(e.query),e.callbackID=o.globalEvent(),e.jsonp!==!1){if(e.query.callback=e.callbackID,"function"==typeof e.jsonp&&e.jsonp(e,e.query),"get"===e.method)return void n(e,function(n){o.jsonp(n,t,e.callbackID,e.timeout)});e.query=i}if(e.form!==!1){e.query.redirect_uri=e.redirect_uri,e.query.state=JSON.stringify({callback:e.callbackID});var a;if("function"==typeof e.form&&(a=e.form(e,e.query)),"post"===e.method&&a!==!1)return void n(e,function(n){o.post(n,e.data,a,t,e.callbackID,e.timeout)})}t({error:{code:"invalid_request",message:"There was no mechanism for handling this request"}})},isArray:function(e){return"[object Array]"===Object.prototype.toString.call(e)},domInstance:function(e,t){var n="HTML"+(e||"").replace(/^[a-z]/,function(e){return e.toUpperCase()})+"Element";return t?window[n]?t instanceof window[n]:window.Element?t instanceof window.Element&&(!e||t.tagName&&t.tagName.toLowerCase()===e):!(t instanceof Object||t instanceof Array||t instanceof String||t instanceof Number)&&t.tagName&&t.tagName.toLowerCase()===e:!1},clone:function(e){if(null===e||"object"!=typeof e||e instanceof Date||"nodeName"in e||this.isBinary(e))return e;var t;if(this.isArray(e)){t=[];for(var n=0;n<e.length;n++)t.push(this.clone(e[n]));return t}t={};for(var o in e)t[o]=this.clone(e[o]);return t},xhr:function(e,t,n,o,i){function a(e){for(var t,n={},o=/([a-z\-]+):\s?(.*);?/gi;t=o.exec(e);)n[t[1]]=t[2];return n}var r=new XMLHttpRequest,s=!1;"blob"===e&&(s=e,e="GET"),e=e.toUpperCase(),r.onload=function(){var t=r.response;try{t=JSON.parse(r.responseText)}catch(n){401===r.status&&(t={error:{code:"access_denied",message:r.statusText}})}var o=a(r.getAllResponseHeaders());o.statusCode=r.status,i(t||("GET"===e?{error:{code:"empty_response",message:"Could not get resource"}}:{}),o)},r.onerror=function(){var e=r.responseText;try{e=JSON.parse(r.responseText)}catch(t){}i(e||{error:{code:"access_denied",message:"Could not get resource"}})};var l;if("GET"===e||"DELETE"===e)o=null;else if(!(!o||"string"==typeof o||o instanceof FormData||o instanceof File||o instanceof Blob)){var u=new FormData;for(l in o)o.hasOwnProperty(l)&&(o[l]instanceof HTMLInputElement?"files"in o[l]&&o[l].files.length>0&&u.append(l,o[l].files[0]):o[l]instanceof Blob?u.append(l,o[l],o.name):u.append(l,o[l]));o=u}if(r.open(e,t,!0),s&&("responseType"in r?r.responseType=s:r.overrideMimeType("text/plain; charset=x-user-defined")),n)for(l in n)r.setRequestHeader(l,n[l]);return r.send(o),r},jsonp:function(e,t,n,o){var i,a,r=this,s=0,l=document.getElementsByTagName("head")[0],u={error:{message:"server_error",code:"server_error"}},c=function(){s++||window.setTimeout(function(){t(u),l.removeChild(a)},0)};n=r.globalEvent(function(e){return u=e,!0},n),e=e.replace(new RegExp("=\\?(&|$)"),"="+n+"$1"),a=r.append("script",{id:n,name:n,src:e,async:!0,onload:c,onerror:c,onreadystatechange:function(){/loaded|complete/i.test(this.readyState)&&c()}}),window.navigator.userAgent.toLowerCase().indexOf("opera")>-1&&(i=r.append("script",{text:"document.getElementById('"+cb_name+"').onerror();"}),a.async=!1),o&&window.setTimeout(function(){u={error:{message:"timeout",code:"timeout"}},c()},o),l.appendChild(a),i&&l.appendChild(i)},post:function(e,t,n,o,i,a){var r,s=this,l=document,u=null,c=[],d=0,f=null,p=0,m=function(e){p++||o(e)};s.globalEvent(m,i);var h;try{h=l.createElement('<iframe name="'+i+'">')}catch(g){h=l.createElement("iframe")}if(h.name=i,h.id=i,h.style.display="none",n&&n.callbackonload&&(h.onload=function(){m({response:"posted",message:"Content was posted"})}),a&&setTimeout(function(){m({error:{code:"timeout",message:"The post operation timed out"}})},a),l.body.appendChild(h),s.domInstance("form",t)){for(u=t.form,d=0;d<u.elements.length;d++)u.elements[d]!==t&&u.elements[d].setAttribute("disabled",!0);t=u}if(s.domInstance("form",t))for(u=t,d=0;d<u.elements.length;d++)u.elements[d].disabled||"file"!==u.elements[d].type||(u.encoding=u.enctype="multipart/form-data",u.elements[d].setAttribute("name","file"));else{for(f in t)t.hasOwnProperty(f)&&s.domInstance("input",t[f])&&"file"===t[f].type&&(u=t[f].form,u.encoding=u.enctype="multipart/form-data");u||(u=l.createElement("form"),l.body.appendChild(u),r=u);var v;for(f in t)if(t.hasOwnProperty(f)){var y=s.domInstance("input",t[f])||s.domInstance("textArea",t[f])||s.domInstance("select",t[f]);if(y&&t[f].form===u)y&&t[f].name!==f&&(t[f].setAttribute("name",f),t[f].name=f);else{var w=u.elements[f];if(v)for(w instanceof NodeList||(w=[w]),d=0;d<w.length;d++)w[d].parentNode.removeChild(w[d]);v=l.createElement("input"),v.setAttribute("type","hidden"),v.setAttribute("name",f),v.value=y?t[f].value:s.domInstance(null,t[f])?t[f].innerHTML||t[f].innerText:t[f],u.appendChild(v)}}for(d=0;d<u.elements.length;d++)v=u.elements[d],v.name in t||v.getAttribute("disabled")===!0||(v.setAttribute("disabled",!0),c.push(v))}u.setAttribute("method","POST"),u.setAttribute("target",i),u.target=i,u.setAttribute("action",e),setTimeout(function(){u.submit(),setTimeout(function(){try{r&&r.parentNode.removeChild(r)}catch(e){try{console.error("HelloJS: could not remove iframe")}catch(t){}}for(var n=0;n<c.length;n++)c[n]&&(c[n].setAttribute("disabled",!1),c[n].disabled=!1)},0)},100)},hasBinary:function(e){for(var t in e)if(e.hasOwnProperty(t)&&this.isBinary(e[t]))return!0;return!1},isBinary:function(e){return e instanceof Object&&(this.domInstance("input",e)&&"file"===e.type||"FileList"in window&&e instanceof window.FileList||"File"in window&&e instanceof window.File||"Blob"in window&&e instanceof window.Blob)},toBlob:function(e){var t=/^data\:([^;,]+(\;charset=[^;,]+)?)(\;base64)?,/i,n=e.match(t);if(!n)return e;for(var o=atob(e.replace(t,"")),i=[],a=0;a<o.length;a++)i.push(o.charCodeAt(a));return new Blob([new Uint8Array(i)],{type:n[1]})}}),function(e){var t=e.api,n=e.utils;n.extend(n,{dataToJSON:function(e){var t=this,n=window,o=e.data;if(t.domInstance("form",o)?o=t.nodeListToJSON(o.elements):"NodeList"in n&&o instanceof NodeList?o=t.nodeListToJSON(o):t.domInstance("input",o)&&(o=t.nodeListToJSON([o])),("File"in n&&o instanceof n.File||"Blob"in n&&o instanceof n.Blob||"FileList"in n&&o instanceof n.FileList)&&(o={file:o}),!("FormData"in n&&o instanceof n.FormData))for(var i in o)if(o.hasOwnProperty(i))if("FileList"in n&&o[i]instanceof n.FileList)1===o[i].length&&(o[i]=o[i][0]);else{if(t.domInstance("input",o[i])&&"file"===o[i].type)continue;t.domInstance("input",o[i])||t.domInstance("select",o[i])||t.domInstance("textArea",o[i])?o[i]=o[i].value:t.domInstance(null,o[i])&&(o[i]=o[i].innerHTML||o[i].innerText)}return e.data=o,o},nodeListToJSON:function(e){for(var t={},n=0;n<e.length;n++){var o=e[n];!o.disabled&&o.name&&(t[o.name]="file"===o.type?o:o.value||o.innerHTML)}return t}}),e.api=function(){var e=n.args({path:"s!",method:"s",data:"o",timeout:"i",callback:"f"},arguments);return e.data&&n.dataToJSON(e),t.call(this,e)}}(hello),Function.prototype.bind||(Function.prototype.bind=function(e){function t(){}if("function"!=typeof this)throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");var n=[].slice,o=n.call(arguments,1),i=this,a=function(){return i.apply(this instanceof t?this:e||window,o.concat(n.call(arguments)))};return t.prototype=this.prototype,a.prototype=new t,a}),hello.subscribe=hello.on,hello.trigger=hello.emit,hello.unsubscribe=hello.off,function(e){function t(e){e&&"error"in e&&(e.error={code:"server_error",message:e.error.message||e.error})}function n(t,n,o){if(!("object"!=typeof t||"undefined"!=typeof Blob&&t instanceof Blob||"undefined"!=typeof ArrayBuffer&&t instanceof ArrayBuffer||"error"in t)){var i=t.root+t.path.replace(/\&/g,"%26");t.thumb_exists&&(t.thumbnail=e.settings.oauth_proxy+"?path="+encodeURIComponent("https://api-content.dropbox.com/1/thumbnails/"+i+"?format=jpeg&size=m")+"&access_token="+o.query.access_token),t.type=t.is_dir?"folder":t.mime_type,t.name=t.path.replace(/.*\//g,""),t.is_dir?t.files="metadata/"+i:(t.downloadLink=e.settings.oauth_proxy+"?path="+encodeURIComponent("https://api-content.dropbox.com/1/files/"+i)+"&access_token="+o.query.access_token,t.file="https://api-content.dropbox.com/1/files/"+i),t.id||(t.id=t.path.replace(/^\//,""))}}function o(e){return function(t,n){delete t.query.limit,n(e)}}e.init({dropbox:{login:function(e){e.options.window_width=1e3,e.options.window_height=1e3},oauth:{version:"1.0",auth:"https://www.dropbox.com/1/oauth/authorize",request:"https://api.dropbox.com/1/oauth/request_token",token:"https://api.dropbox.com/1/oauth/access_token"},base:"https://api.dropbox.com/1/",root:"sandbox",get:{me:"account/info","me/files":o("metadata/@{root|sandbox}/@{parent}"),"me/folder":o("metadata/@{root|sandbox}/@{id}"),"me/folders":o("metadata/@{root|sandbox}/"),"default":function(e,t){e.path.match("https://api-content.dropbox.com/1/files/")&&(e.method="blob"),t(e.path)}},post:{"me/files":function(t,n){var o=t.data.parent,i=t.data.name;t.data={file:t.data.file},"string"==typeof t.data.file&&(t.data.file=e.utils.toBlob(t.data.file)),n("https://api-content.dropbox.com/1/files_put/@{root|sandbox}/"+o+"/"+i)},"me/folders":function(t,n){var o=t.data.name;t.data={},n("fileops/create_folder?root=@{root|sandbox}&"+e.utils.param({path:o}))}},del:{"me/files":"fileops/delete?root=@{root|sandbox}&path=@{id}","me/folder":"fileops/delete?root=@{root|sandbox}&path=@{id}"},wrap:{me:function(e){return t(e),e.uid?(e.name=e.display_name,e.first_name=e.name.split(" ")[0],e.last_name=e.name.split(" ")[1],e.id=e.uid,delete e.uid,delete e.display_name,e):e},"default":function(e,o,i){if(t(e),e.is_dir&&e.contents){e.data=e.contents,delete e.contents;for(var a=0;a<e.data.length;a++)e.data[a].root=e.root,n(e.data[a],o,i)}return n(e,o,i),e.is_deleted&&(e.success=!0),e}},xhr:function(e){if(e.data&&e.data.file){var t=e.data.file;t&&(e.data=t.files?t.files[0]:t)}return"delete"===e.method&&(e.method="post"),!0},form:function(e,t){delete t.state,delete t.redirect_uri}}})}(hello),function(e){function t(e){return e.id&&(e.thumbnail=e.picture=i+e.id+"/picture"),e}function n(e){if("data"in e)for(var n=0;n<e.data.length;n++)t(e.data[n]);return e}function o(e,t,n){if("boolean"==typeof e&&(e={success:e}),e&&"data"in e)for(var o=n.query.access_token,a=0;a<e.data.length;a++){var r=e.data[a];r.picture&&(r.thumbnail=r.picture),r.cover_photo&&(r.thumbnail=i+r.cover_photo+"/picture?access_token="+o),"album"===r.type&&(r.files=r.photos=i+r.id+"/photos"),r.can_upload&&(r.upload_location=i+r.id+"/photos")}return e}var i="https://graph.facebook.com/v2.2/";e.init({facebook:{name:"Facebook",login:function(e){e.options.window_width=580,e.options.window_height=400},oauth:{version:2,auth:"https://www.facebook.com/v2.2/dialog/oauth/",grant:i+"oauth/access_token"},refresh:!0,logout:function(t){var n=e.utils.globalEvent(t),o=encodeURIComponent(e.settings.redirect_uri+"?"+e.utils.param({callback:n,result:JSON.stringify({force:!0}),state:"{}"})),i=(e.utils.store("facebook")||{}).access_token;return e.utils.iframe("https://www.facebook.com/logout.php?next="+o+"&access_token="+i),i?void 0:!1},scope:{basic:"public_profile",email:"email",birthday:"user_birthday",events:"user_events",photos:"user_photos,user_videos",videos:"user_photos,user_videos",friends:"user_friends",files:"user_photos,user_videos",publish_files:"user_photos,user_videos,publish_actions",publish:"publish_actions",offline_access:"offline_access"},base:i,get:{me:"me?fields=email,id,name","me/friends":"me/friends","me/following":"me/friends","me/followers":"me/friends","me/share":"me/feed","me/like":"me/likes","me/files":"me/albums","me/albums":"me/albums","me/album":"@{id}/photos","me/photos":"me/photos","me/photo":"@{id}","friend/albums":"@{id}/albums","friend/photos":"@{id}/photos"},post:{"me/share":"me/feed","me/albums":"me/albums","me/album":"@{id}/photos"},del:{"me/photo":"@{id}"},wrap:{me:t,"me/friends":n,"me/following":n,"me/followers":n,"me/albums":o,"me/files":o,"default":o},xhr:function(t,n){return("get"===t.method||"post"===t.method)&&(n.suppress_response_codes=!0),"post"===t.method&&t.data&&"string"==typeof t.data.file&&(t.data.file=e.utils.toBlob(t.data.file)),!0},jsonp:function(t,n){var o=t.method;"get"===o||e.utils.hasBinary(t.data)?"delete"===t.method&&(n.method="delete",t.method="post"):(t.data.method=o,t.method="get")},form:function(){return{callbackonload:!0}}}})}(hello),function(e){function t(t,n,o){var i=(o?"":"flickr:")+"?method="+t+"&api_key="+e.init().flickr.id+"&format=json";for(var a in n)n.hasOwnProperty(a)&&(i+="&"+a+"="+n[a]);return i}function n(t){var n=e.getAuthResponse("flickr");t(n&&n.user_nsid?n.user_nsid:null)}function o(e,o){return o||(o={}),function(i,a){n(function(n){o.user_id=n,a(t(e,o,!0))})}}function i(e,t){var n="https://www.flickr.com/images/buddyicon.gif";return e.nsid&&e.iconserver&&e.iconfarm&&(n="https://farm"+e.iconfarm+".staticflickr.com/"+e.iconserver+"/buddyicons/"+e.nsid+(t?"_"+t:"")+".jpg"),n}function a(e,t,n,o,i){return i=i?"_"+i:"","https://farm"+t+".staticflickr.com/"+n+"/"+e+"_"+o+i+".jpg"}function r(e){e&&e.stat&&"ok"!=e.stat.toLowerCase()&&(e.error={code:"invalid_request",message:e.message})}function s(e){if(e.photoset||e.photos){var t="photoset"in e?"photoset":"photos";e=l(e,t),c(e),e.data=e.photo,delete e.photo;for(var n=0;n<e.data.length;n++){var o=e.data[n];o.name=o.title,o.picture=a(o.id,o.farm,o.server,o.secret,""),o.source=a(o.id,o.farm,o.server,o.secret,"b"),o.thumbnail=a(o.id,o.farm,o.server,o.secret,"m")}}return e}function l(e,t){return t in e?e=e[t]:"error"in e||(e.error={code:"invalid_request",message:e.message||"Failed to get data from Flickr"}),e}function u(e){if(r(e),e.contacts){e=l(e,"contacts"),c(e),e.data=e.contact,delete e.contact;
for(var t=0;t<e.data.length;t++){var n=e.data[t];n.id=n.nsid,n.name=n.realname||n.username,n.thumbnail=i(n,"m")}}return e}function c(e){e.page&&e.pages&&e.page!==e.pages&&(e.paging={next:"?page="+ ++e.page})}e.init({flickr:{name:"Flickr",oauth:{version:"1.0a",auth:"https://www.flickr.com/services/oauth/authorize?perms=read",request:"https://www.flickr.com/services/oauth/request_token",token:"https://www.flickr.com/services/oauth/access_token"},base:"https://api.flickr.com/services/rest",get:{me:o("flickr.people.getInfo"),"me/friends":o("flickr.contacts.getList",{per_page:"@{limit|50}"}),"me/following":o("flickr.contacts.getList",{per_page:"@{limit|50}"}),"me/followers":o("flickr.contacts.getList",{per_page:"@{limit|50}"}),"me/albums":o("flickr.photosets.getList",{per_page:"@{limit|50}"}),"me/photos":o("flickr.people.getPhotos",{per_page:"@{limit|50}"})},wrap:{me:function(e){if(r(e),e=l(e,"person"),e.id){if(e.realname){e.name=e.realname._content;var t=e.name.split(" ");e.first_name=t[0],e.last_name=t[1]}e.thumbnail=i(e,"l"),e.picture=i(e,"l")}return e},"me/friends":u,"me/followers":u,"me/following":u,"me/albums":function(e){if(r(e),e=l(e,"photosets"),c(e),e.photoset){e.data=e.photoset,delete e.photoset;for(var n=0;n<e.data.length;n++){var o=e.data[n];o.name=o.title._content,o.photos="https://api.flickr.com/services/rest"+t("flickr.photosets.getPhotos",{photoset_id:o.id},!0)}}return e},"me/photos":function(e){return r(e),s(e)},"default":function(e){return r(e),s(e)}},xhr:!1,jsonp:function(e,t){"get"==e.method&&(delete t.callback,t.jsoncallback=e.callbackID)}}})}(hello),function(e){function t(e){!e.meta||400!==e.meta.code&&401!==e.meta.code||(e.error={code:"access_denied",message:e.meta.errorDetail})}function n(e){e&&e.id&&(e.thumbnail=e.photo.prefix+"100x100"+e.photo.suffix,e.name=e.firstName+" "+e.lastName,e.first_name=e.firstName,e.last_name=e.lastName,e.contact&&e.contact.email&&(e.email=e.contact.email))}function o(e,t){var n=t.access_token;return delete t.access_token,t.oauth_token=n,t.v=20121125,!0}e.init({foursquare:{name:"FourSquare",oauth:{version:2,auth:"https://foursquare.com/oauth2/authenticate",grant:"https://foursquare.com/oauth2/access_token"},refresh:!0,base:"https://api.foursquare.com/v2/",get:{me:"users/self","me/friends":"users/self/friends","me/followers":"users/self/friends","me/following":"users/self/friends"},wrap:{me:function(e){return t(e),e&&e.response&&(e=e.response.user,n(e)),e},"default":function(e){if(t(e),e&&"response"in e&&"friends"in e.response&&"items"in e.response.friends){e.data=e.response.friends.items,delete e.response;for(var o=0;o<e.data.length;o++)n(e.data[o])}return e}},xhr:o,jsonp:o}})}(hello),function(e){function t(e,t){var n=t?t.statusCode:e&&"meta"in e&&"status"in e.meta&&e.meta.status;(401===n||403===n)&&(e.error={code:"access_denied",message:e.message||(e.data?e.data.message:"Could not get response")},delete e.message)}function n(e){e.id&&(e.thumbnail=e.picture=e.avatar_url,e.name=e.login)}function o(e,t){if(e.data&&e.data.length&&t&&t.Link){var n=t.Link.match(/<(.*?)>;\s*rel=\"next\"/);n&&(e.paging={next:n[1]})}}e.init({github:{name:"GitHub",oauth:{version:2,auth:"https://github.com/login/oauth/authorize",grant:"https://github.com/login/oauth/access_token",response_type:"code"},scope:{basic:"",email:"user:email"},base:"https://api.github.com/",get:{me:"user","me/friends":"user/following?per_page=@{limit|100}","me/following":"user/following?per_page=@{limit|100}","me/followers":"user/followers?per_page=@{limit|100}","me/like":"user/starred?per_page=@{limit|100}"},wrap:{me:function(e,o){return t(e,o),n(e),e},"default":function(e,i,a){if(t(e,i),"[object Array]"===Object.prototype.toString.call(e)){e={data:e},o(e,i,a);for(var r=0;r<e.data.length;r++)n(e.data[r])}return e}},xhr:function(e){return"get"!==e.method&&e.data&&(e.headers=e.headers||{},e.headers["Content-Type"]="application/json","object"==typeof e.data&&(e.data=JSON.stringify(e.data))),!0}}})}(hello),function(e){"use strict";function t(e){return parseInt(e,10)}function n(e){e.error||(e.name||(e.name=e.title||e.message),e.picture||(e.picture=e.thumbnailLink),e.thumbnail||(e.thumbnail=e.thumbnailLink),"application/vnd.google-apps.folder"===e.mimeType&&(e.type="folder",e.files="https://www.googleapis.com/drive/v2/files?q=%22"+e.id+"%22+in+parents"))}function o(e){r(e);var t=function(e){var t,n=e.media$group.media$content.length?e.media$group.media$content[0]:{},o=0,i={id:e.id.$t,name:e.title.$t,description:e.summary.$t,updated_time:e.updated.$t,created_time:e.published.$t,picture:n?n.url:null,thumbnail:n?n.url:null,width:n.width,height:n.height};if("link"in e)for(o=0;o<e.link.length;o++){var a=e.link[o];if(a.rel.match(/\#feed$/)){i.upload_location=i.files=i.photos=a.href;break}}if("category"in e&&e.category.length)for(t=e.category,o=0;o<t.length;o++)t[o].scheme&&t[o].scheme.match(/\#kind$/)&&(i.type=t[o].term.replace(/^.*?\#/,""));if("media$thumbnail"in e.media$group&&e.media$group.media$thumbnail.length){for(t=e.media$group.media$thumbnail,i.thumbnail=e.media$group.media$thumbnail[0].url,i.images=[],o=0;o<t.length;o++)i.images.push({source:t[o].url,width:t[o].width,height:t[o].height});t=e.media$group.media$content.length?e.media$group.media$content[0]:null,t&&i.images.push({source:t.url,width:t.width,height:t.height})}return i},o=[];if("feed"in e&&"entry"in e.feed){for(i=0;i<e.feed.entry.length;i++)o.push(t(e.feed.entry[i]));e.data=o,delete e.feed}else{if("entry"in e)return t(e.entry);if("items"in e){for(var i=0;i<e.items.length;i++)n(e.items[i]);e.data=e.items,delete e.items}else n(e)}return e}function i(e){e.name=e.displayName||e.name,e.picture=e.picture||(e.image?e.image.url:null),e.thumbnail=e.picture}function a(e,t,n){r(e);if("feed"in e&&"entry"in e.feed){for(var o=n.query.access_token,i=0;i<e.feed.entry.length;i++){var a=e.feed.entry[i];if(a.id=a.id.$t,a.name=a.title.$t,delete a.title,a.gd$email&&(a.email=a.gd$email&&a.gd$email.length>0?a.gd$email[0].address:null,a.emails=a.gd$email,delete a.gd$email),a.updated&&(a.updated=a.updated.$t),a.link){var s=a.link.length>0?a.link[0].href+"?access_token="+o:null;s&&(a.picture=s,a.thumbnail=s),delete a.link}a.category&&delete a.category}e.data=e.feed.entry,delete e.feed}return e}function r(e){if("feed"in e&&e.feed.openSearch$itemsPerPage){var n=t(e.feed.openSearch$itemsPerPage.$t),o=t(e.feed.openSearch$startIndex.$t),i=t(e.feed.openSearch$totalResults.$t);i>o+n&&(e.paging={next:"?start="+(o+n)})}else"nextPageToken"in e&&(e.paging={next:"?pageToken="+e.nextPageToken})}function s(){function e(e){var n=new FileReader;n.onload=function(n){t(btoa(n.target.result),e.type+a+"Content-Transfer-Encoding: base64")},n.readAsBinaryString(e)}function t(e,t){n.push(a+"Content-Type: "+t+a+a+e),i--,s()}var n=[],o=(1e10*Math.random()).toString(32),i=0,a="\r\n",r=a+"--"+o,s=function(){},l=/^data\:([^;,]+(\;charset=[^;,]+)?)(\;base64)?,/i;this.append=function(n,o){"string"!=typeof n&&"length"in Object(n)||(n=[n]);for(var r=0;r<n.length;r++){i++;var s=n[r];if("undefined"!=typeof File&&s instanceof File||"undefined"!=typeof Blob&&s instanceof Blob)e(s);else if("string"==typeof s&&s.match(l)){var u=s.match(l);t(s.replace(l,""),u[1]+a+"Content-Transfer-Encoding: base64")}else t(s,o)}},this.onready=function(e){(s=function(){0===i&&(n.unshift(""),n.push("--"),e(n.join(r),o),n=[])})()}}function l(e,t){var n={};e.data&&"undefined"!=typeof HTMLInputElement&&e.data instanceof HTMLInputElement&&(e.data={file:e.data}),!e.data.name&&Object(Object(e.data.file).files).length&&"post"===e.method&&(e.data.name=e.data.file.files[0].name),"post"===e.method?e.data={title:e.data.name,parents:[{id:e.data.parent||"root"}],file:e.data.file}:(n=e.data,e.data={},n.parent&&(e.data.parents=[{id:e.data.parent||"root"}]),n.file&&(e.data.file=n.file),n.name&&(e.data.title=n.name));var o;if("file"in e.data&&(o=e.data.file,delete e.data.file,"object"==typeof o&&"files"in o&&(o=o.files),!o||!o.length))return void t({error:{code:"request_invalid",message:"There were no files attached with this request to upload"}});var i=new s;i.append(JSON.stringify(e.data),"application/json"),o&&i.append(o),i.onready(function(o,i){e.headers["content-type"]='multipart/related; boundary="'+i+'"',e.data=o,t("upload/drive/v2/files"+(n.id?"/"+n.id:"")+"?uploadType=multipart")})}function u(e){if("object"==typeof e.data)try{e.data=JSON.stringify(e.data),e.headers["content-type"]="application/json"}catch(t){}}var c="https://www.google.com/m8/feeds/contacts/default/full?v=3.0&alt=json&max-results=@{limit|1000}&start-index=@{start|1}";e.init({google:{name:"Google Plus",login:function(e){"none"===e.qs.display&&(e.qs.display=""),"code"===e.qs.response_type&&(e.qs.access_type="offline")},oauth:{version:2,auth:"https://accounts.google.com/o/oauth2/auth",grant:"https://accounts.google.com/o/oauth2/token"},scope:{basic:"https://www.googleapis.com/auth/plus.me profile",email:"email",birthday:"",events:"",photos:"https://picasaweb.google.com/data/",videos:"http://gdata.youtube.com",friends:"https://www.google.com/m8/feeds, https://www.googleapis.com/auth/plus.login",files:"https://www.googleapis.com/auth/drive.readonly",publish:"",publish_files:"https://www.googleapis.com/auth/drive",create_event:"",offline_access:""},scope_delim:" ",base:"https://www.googleapis.com/",get:{me:"plus/v1/people/me","me/friends":"plus/v1/people/me/people/visible?maxResults=@{limit|100}","me/following":c,"me/followers":c,"me/contacts":c,"me/share":"plus/v1/people/me/activities/public?maxResults=@{limit|100}","me/feed":"plus/v1/people/me/activities/public?maxResults=@{limit|100}","me/albums":"https://picasaweb.google.com/data/feed/api/user/default?alt=json&max-results=@{limit|100}&start-index=@{start|1}","me/album":function(e,t){var n=e.query.id;delete e.query.id,t(n.replace("/entry/","/feed/"))},"me/photos":"https://picasaweb.google.com/data/feed/api/user/default?alt=json&kind=photo&max-results=@{limit|100}&start-index=@{start|1}","me/files":"drive/v2/files?q=%22@{parent|root}%22+in+parents+and+trashed=false&maxResults=@{limit|100}","me/folders":"drive/v2/files?q=%22@{id|root}%22+in+parents+and+mimeType+=+%22application/vnd.google-apps.folder%22+and+trashed=false&maxResults=@{limit|100}","me/folder":"drive/v2/files?q=%22@{id|root}%22+in+parents+and+trashed=false&maxResults=@{limit|100}"},post:{"me/files":l,"me/folders":function(e,t){e.data={title:e.data.name,parents:[{id:e.data.parent||"root"}],mimeType:"application/vnd.google-apps.folder"},t("drive/v2/files")}},put:{"me/files":l},del:{"me/files":"drive/v2/files/@{id}","me/folder":"drive/v2/files/@{id}"},wrap:{me:function(e){return e.id&&(e.last_name=e.family_name||(e.name?e.name.familyName:null),e.first_name=e.given_name||(e.name?e.name.givenName:null),e.emails&&e.emails.length&&(e.email=e.emails[0].value),i(e)),e},"me/friends":function(e){if(e.items){r(e),e.data=e.items,delete e.items;for(var t=0;t<e.data.length;t++)i(e.data[t])}return e},"me/contacts":a,"me/followers":a,"me/following":a,"me/share":function(e){return r(e),e.data=e.items,delete e.items,e},"me/feed":function(e){return r(e),e.data=e.items,delete e.items,e},"me/albums":o,"me/photos":o,"default":o},xhr:function(e){return("post"===e.method||"put"===e.method)&&u(e),!0},form:!1}})}(hello),function(e){function t(e){e&&"meta"in e&&"error_type"in e.meta&&(e.error={code:e.meta.error_type,message:e.meta.error_message})}function n(e){if(i(e),e&&"data"in e)for(var t=0;t<e.data.length;t++)o(e.data[t]);return e}function o(e){e.id&&(e.thumbnail=e.profile_picture,e.name=e.full_name||e.username)}function i(e){"pagination"in e&&(e.paging={next:e.pagination.next_url},delete e.pagination)}e.init({instagram:{name:"Instagram",login:function(e){e.qs.display=""},oauth:{version:2,auth:"https://instagram.com/oauth/authorize/",grant:"https://api.instagram.com/oauth/access_token"},refresh:!0,scope:{basic:"basic",friends:"relationships",publish:"likes comments"},scope_delim:" ",base:"https://api.instagram.com/v1/",get:{me:"users/self","me/feed":"users/self/feed?count=@{limit|100}","me/photos":"users/self/media/recent?min_id=0&count=@{limit|100}","me/friends":"users/self/follows?count=@{limit|100}","me/following":"users/self/follows?count=@{limit|100}","me/followers":"users/self/followed-by?count=@{limit|100}","friend/photos":"users/@{id}/media/recent?min_id=0&count=@{limit|100}"},post:{"me/like":function(e,t){var n=e.data.id;e.data={},t("media/"+n+"/likes")}},del:{"me/like":"media/@{id}/likes"},wrap:{me:function(e){return t(e),"data"in e&&(e.id=e.data.id,e.thumbnail=e.data.profile_picture,e.name=e.data.full_name||e.data.username),e},"me/friends":n,"me/following":n,"me/followers":n,"me/photos":function(e){if(t(e),i(e),"data"in e)for(var n=0;n<e.data.length;n++){var o=e.data[n];"image"===o.type?(o.thumbnail=o.images.thumbnail.url,o.picture=o.images.standard_resolution.url,o.name=o.caption?o.caption.text:null):(e.data.splice(n,1),n--)}return e},"default":function(e){return i(e),e}},xhr:function(e){var t=e.method,n="get"!==t;return n&&("post"!==t&&"put"!==t||!e.query.access_token||(e.data.access_token=e.query.access_token,delete e.query.access_token),e.proxy=n),n},form:!1}})}(hello),function(e){function t(e){e&&"errorCode"in e&&(e.error={code:e.status,message:e.message})}function n(e){e.error||(e.first_name=e.firstName,e.last_name=e.lastName,e.name=e.formattedName||e.first_name+" "+e.last_name,e.thumbnail=e.pictureUrl,e.email=e.emailAddress)}function o(e){if(t(e),i(e),e.values){e.data=e.values;for(var o=0;o<e.data.length;o++)n(e.data[o]);delete e.values}return e}function i(e){"_count"in e&&"_start"in e&&e._count+e._start<e._total&&(e.paging={next:"?start="+(e._start+e._count)+"&count="+e._count})}function a(e,t){"{}"===JSON.stringify(e)&&200===t.statusCode&&(e.success=!0)}function r(e){e.access_token&&(e.oauth2_access_token=e.access_token,delete e.access_token)}function s(e,t){e.headers["x-li-format"]="json";var n=e.data.id;e.data=("delete"!==e.method).toString(),e.method="put",t("people/~/network/updates/key="+n+"/is-liked")}e.init({linkedin:{oauth:{version:2,response_type:"code",auth:"https://www.linkedin.com/uas/oauth2/authorization",grant:"https://www.linkedin.com/uas/oauth2/accessToken"},refresh:!0,scope:{basic:"r_fullprofile",email:"r_emailaddress",friends:"r_network",publish:"rw_nus"},scope_delim:" ",base:"https://api.linkedin.com/v1/",get:{me:"people/~:(picture-url,first-name,last-name,id,formatted-name,email-address)","me/friends":"people/~/connections?count=@{limit|500}","me/followers":"people/~/connections?count=@{limit|500}","me/following":"people/~/connections?count=@{limit|500}","me/share":"people/~/network/updates?count=@{limit|250}"},post:{"me/share":function(e,t){var n={visibility:{code:"anyone"}};e.data.id?n.attribution={share:{id:e.data.id}}:(n.comment=e.data.message,e.data.picture&&e.data.link&&(n.content={"submitted-url":e.data.link,"submitted-image-url":e.data.picture})),e.data=JSON.stringify(n),t("people/~/shares?format=json")},"me/like":s},del:{"me/like":s},wrap:{me:function(e){return t(e),n(e),e},"me/friends":o,"me/following":o,"me/followers":o,"me/share":function(e){if(t(e),i(e),e.values){e.data=e.values,delete e.values;for(var o=0;o<e.data.length;o++){var a=e.data[o];n(a),a.message=a.headline}}return e},"default":function(e,n){t(e),a(e,n),i(e)}},jsonp:function(e,t){r(t),"get"===e.method&&(t.format="jsonp",t["error-callback"]=e.callbackID)},xhr:function(e,t){return"get"!==e.method?(r(t),e.headers["Content-Type"]="application/json",e.headers["x-li-format"]="json",e.proxy=!0,!0):!1}}})}(hello),function(e){function t(e){e.id&&(e.picture=e.avatar_url,e.thumbnail=e.avatar_url,e.name=e.username||e.full_name)}function n(e){"next_href"in e&&(e.paging={next:e.next_href})}function o(e,t){var n=t.access_token;return delete t.access_token,t.oauth_token=n,t["_status_code_map[302]"]=200,!0}e.init({soundcloud:{name:"SoundCloud",oauth:{version:2,auth:"https://soundcloud.com/connect",grant:"https://soundcloud.com/oauth2/token"},base:"https://api.soundcloud.com/",get:{me:"me.json","me/friends":"me/followings.json","me/followers":"me/followers.json","me/following":"me/followings.json","default":function(e,t){t(e.path+".json")}},wrap:{me:function(e){return t(e),e},"default":function(e){if(e instanceof Array){e={data:e};for(var o=0;o<e.data.length;o++)t(e.data[o])}return n(e),e}},xhr:o,jsonp:o}})}(hello),function(e){function t(e,t){e.data&&(n(e.query,e.data),e.data=null),t(e.path)}function n(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])}e.init({tumblr:{login:function(e){e.options.window_width=600,e.options.window_height=510},oauth:{version:"1.0a",auth:"https://www.tumblr.com/oauth/authorize",request:"https://www.tumblr.com/oauth/request_token",token:"https://www.tumblr.com/oauth/access_token"},base:"https://api.tumblr.com/v2/",get:{me:"user/info","me/like":"user/likes","default":function(t,n){t.path.match(/(^|\/)blog\//)&&(delete t.query.access_token,t.query.api_key=e.services.tumblr.id),n(t.path)}},post:{"me/like":function(e,n){e.path="user/like",t(e,n)}},del:{"me/like":function(e,n){e.method="post",e.path="user/unlike",t(e,n)}},wrap:{me:function(e){return e&&e.response&&e.response.user&&(e=e.response.user),e},"me/like":function(e){return e&&e.response&&e.response.liked_posts&&(e.data=e.response.liked_posts,delete e.response),e},"default":function(e){if(e.response){var t=e.response;t.posts&&(e.data=t.posts)}return e}},xhr:function(e){return"get"!==e.method?!0:!1}}})}(hello),function(e){function t(e){if(e.id){if(e.name){var t=e.name.split(" ");e.first_name=t[0],e.last_name=t[1]}e.thumbnail=e.profile_image_url_https||e.profile_image_url}}function n(e){if(o(e),i(e),e.users){e.data=e.users;for(var n=0;n<e.data.length;n++)t(e.data[n]);delete e.users}return e}function o(e){if(e.errors){var t=e.errors[0];e.error={code:"request_failed",message:t.message}}}function i(e){"next_cursor_str"in e&&(e.paging={next:"?cursor="+e.next_cursor_str})}function a(t){return e.utils.isArray(t)?{data:t}:t}var r="https://api.twitter.com/";e.init({twitter:{oauth:{version:"1.0a",auth:r+"oauth/authenticate",request:r+"oauth/request_token",token:r+"oauth/access_token"},base:r+"1.1/",get:{me:"account/verify_credentials.json","me/friends":"friends/list.json?count=@{limit|200}","me/following":"friends/list.json?count=@{limit|200}","me/followers":"followers/list.json?count=@{limit|200}","me/share":"statuses/user_timeline.json?count=@{limit|200}","me/like":"favorites/list.json?count=@{limit|200}"},post:{"me/share":function(e,t){var n=e.data;e.data=null,n.file?(e.data={status:n.message,"media[]":n.file},t("statuses/update_with_media.json")):t(n.id?"statuses/retweet/"+n.id+".json":"statuses/update.json?include_entities=1&status="+n.message)},"me/like":function(e,t){var n=e.data.id;e.data=null,t("favorites/create.json?id="+n)}},del:{"me/like":function(){p.method="post";var e=p.data.id;p.data=null,callback("favorites/destroy.json?id="+e)}},wrap:{me:function(e){return o(e),t(e),e},"me/friends":n,"me/followers":n,"me/following":n,"me/share":function(e){return o(e),i(e),!e.error&&"length"in e?{data:e}:e},"default":function(e){return e=a(e),i(e),e}},xhr:function(e){return"get"!==e.method}}})}(hello),function(e){function t(e,t,n){if(e.id){var o=n.query.access_token;if(e.emails&&(e.email=e.emails.preferred),e.is_friend!==!1){var i=e.user_id||e.id;e.thumbnail=e.picture="https://apis.live.net/v5.0/"+i+"/picture?access_token="+o}}}function n(e,n,o){if("data"in e)for(var i=0;i<e.data.length;i++)t(e.data[i],n,o);return e}e.init({windows:{name:"Windows live",oauth:{version:2,auth:"https://login.live.com/oauth20_authorize.srf",grant:"https://login.live.com/oauth20_token.srf"},refresh:!0,logout:function(){return"http://login.live.com/oauth20_logout.srf?ts="+(new Date).getTime()},scope:{basic:"wl.signin,wl.basic",email:"wl.emails",birthday:"wl.birthday",events:"wl.calendars",photos:"wl.photos",videos:"wl.photos",friends:"wl.contacts_emails",files:"wl.skydrive",publish:"wl.share",publish_files:"wl.skydrive_update",create_event:"wl.calendars_update,wl.events_create",offline_access:"wl.offline_access"},base:"https://apis.live.net/v5.0/",get:{me:"me","me/friends":"me/friends","me/following":"me/contacts","me/followers":"me/friends","me/contacts":"me/contacts","me/albums":"me/albums","me/album":"@{id}/files","me/photo":"@{id}","me/files":"@{parent|me/skydrive}/files","me/folders":"@{id|me/skydrive}/files","me/folder":"@{id|me/skydrive}/files"},post:{"me/albums":"me/albums","me/album":"@{id}/files/","me/folders":"@{id|me/skydrive/}","me/files":"@{parent|me/skydrive/}/files"},del:{"me/album":"@{id}","me/photo":"@{id}","me/folder":"@{id}","me/files":"@{id}"},wrap:{me:function(e,n,o){return t(e,n,o),e},"me/friends":n,"me/contacts":n,"me/followers":n,"me/following":n,"me/albums":function(e){if("data"in e)for(var t=0;t<e.data.length;t++){var n=e.data[t];n.photos=n.files="https://apis.live.net/v5.0/"+n.id+"/photos"}return e},"default":function(e){if("data"in e)for(var t=0;t<e.data.length;t++){var n=e.data[t];n.picture&&(n.thumbnail=n.picture)}return e}},xhr:function(t){return"get"===t.method||"delete"===t.method||e.utils.hasBinary(t.data)||("string"==typeof t.data.file?t.data.file=e.utils.toBlob(t.data.file):(t.data=JSON.stringify(t.data),t.headers={"Content-Type":"application/json"})),!0},jsonp:function(t){"get"===t.method||e.utils.hasBinary(t.data)||(t.data.method=t.method,t.method="get")}}})}(hello),function(e){function t(e){e&&"meta"in e&&"error_type"in e.meta&&(e.error={code:e.meta.error_type,message:e.meta.error_message})}function n(e,n,i){t(e),o(e,n,i);var a,r;if(e.query&&e.query.results&&e.query.results.contact){e.data=e.query.results.contact,delete e.query,e.data instanceof Array||(e.data=[e.data]);for(var s=0;s<e.data.length;s++){a=e.data[s],a.id=null;for(var l=0;l<a.fields.length;l++)r=a.fields[l],"email"===r.type&&(a.email=r.value),"name"===r.type&&(a.first_name=r.value.givenName,a.last_name=r.value.familyName,a.name=r.value.givenName+" "+r.value.familyName),"yahooid"===r.type&&(a.id=r.value)}}return e}function o(e,t,n){e.query&&e.query.count&&n.options&&(e.paging={next:"?start="+(e.query.count+(+n.options.start||1))})}var i=function(e){return"https://query.yahooapis.com/v1/yql?q="+(e+" limit @{limit|100} offset @{start|0}").replace(/\s/g,"%20")+"&format=json"};e.init({yahoo:{oauth:{version:"1.0a",auth:"https://api.login.yahoo.com/oauth/v2/request_auth",request:"https://api.login.yahoo.com/oauth/v2/get_request_token",token:"https://api.login.yahoo.com/oauth/v2/get_token"},login:function(e){e.options.window_width=560;try{delete e.qs.state.scope}catch(t){}},base:"https://social.yahooapis.com/v1/",get:{me:i("select * from social.profile(0) where guid=me"),"me/friends":i("select * from social.contacts(0) where guid=me"),"me/following":i("select * from social.contacts(0) where guid=me")},wrap:{me:function(e){if(t(e),e.query&&e.query.results&&e.query.results.profile){e=e.query.results.profile,e.id=e.guid,e.last_name=e.familyName,e.first_name=e.givenName||e.nickname;var n=[];e.first_name&&n.push(e.first_name),e.last_name&&n.push(e.last_name),e.name=n.join(" "),e.email=e.emails&&e.emails[0]?e.emails[0].handle:null,e.thumbnail=e.image?e.image.imageUrl:null}return e},"me/friends":n,"me/following":n,"default":function(e){return o(e),e}}}})}(hello),"function"==typeof define&&define.amd&&define(function(){return hello}),"object"==typeof module&&module.exports&&(module.exports=hello);/*!

 handlebars v3.0.1

Copyright (C) 2011-2014 by Yehuda Katz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

@license
*/
/* exported Handlebars */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Handlebars = factory();
  }
}(this, function () {
// handlebars/utils.js
var __module2__ = (function() {
  "use strict";
  var __exports__ = {};
  /*jshint -W004 */
  var escape = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "`": "&#x60;"
  };

  var badChars = /[&<>"'`]/g;
  var possible = /[&<>"'`]/;

  function escapeChar(chr) {
    return escape[chr];
  }

  function extend(obj /* , ...source */) {
    for (var i = 1; i < arguments.length; i++) {
      for (var key in arguments[i]) {
        if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
          obj[key] = arguments[i][key];
        }
      }
    }

    return obj;
  }

  __exports__.extend = extend;var toString = Object.prototype.toString;
  __exports__.toString = toString;
  // Sourced from lodash
  // https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
  var isFunction = function(value) {
    return typeof value === 'function';
  };
  // fallback for older versions of Chrome and Safari
  /* istanbul ignore next */
  if (isFunction(/x/)) {
    isFunction = function(value) {
      return typeof value === 'function' && toString.call(value) === '[object Function]';
    };
  }
  var isFunction;
  __exports__.isFunction = isFunction;
  /* istanbul ignore next */
  var isArray = Array.isArray || function(value) {
    return (value && typeof value === 'object') ? toString.call(value) === '[object Array]' : false;
  };
  __exports__.isArray = isArray;
  // Older IE versions do not directly support indexOf so we must implement our own, sadly.
  function indexOf(array, value) {
    for (var i = 0, len = array.length; i < len; i++) {
      if (array[i] === value) {
        return i;
      }
    }
    return -1;
  }

  __exports__.indexOf = indexOf;
  function escapeExpression(string) {
    if (typeof string !== 'string') {
      // don't escape SafeStrings, since they're already safe
      if (string && string.toHTML) {
        return string.toHTML();
      } else if (string == null) {
        return '';
      } else if (!string) {
        return string + '';
      }

      // Force a string conversion as this will be done by the append regardless and
      // the regex test will do this transparently behind the scenes, causing issues if
      // an object's to string has escaped characters in it.
      string = '' + string;
    }

    if (!possible.test(string)) { return string; }
    return string.replace(badChars, escapeChar);
  }

  __exports__.escapeExpression = escapeExpression;function isEmpty(value) {
    if (!value && value !== 0) {
      return true;
    } else if (isArray(value) && value.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  __exports__.isEmpty = isEmpty;function blockParams(params, ids) {
    params.path = ids;
    return params;
  }

  __exports__.blockParams = blockParams;function appendContextPath(contextPath, id) {
    return (contextPath ? contextPath + '.' : '') + id;
  }

  __exports__.appendContextPath = appendContextPath;
  return __exports__;
})();

// handlebars/exception.js
var __module3__ = (function() {
  "use strict";
  var __exports__;

  var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

  function Exception(message, node) {
    var loc = node && node.loc,
        line,
        column;
    if (loc) {
      line = loc.start.line;
      column = loc.start.column;

      message += ' - ' + line + ':' + column;
    }

    var tmp = Error.prototype.constructor.call(this, message);

    // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
    for (var idx = 0; idx < errorProps.length; idx++) {
      this[errorProps[idx]] = tmp[errorProps[idx]];
    }

    if (loc) {
      this.lineNumber = line;
      this.column = column;
    }
  }

  Exception.prototype = new Error();

  __exports__ = Exception;
  return __exports__;
})();

// handlebars/base.js
var __module1__ = (function(__dependency1__, __dependency2__) {
  "use strict";
  var __exports__ = {};
  var Utils = __dependency1__;
  var Exception = __dependency2__;

  var VERSION = "3.0.1";
  __exports__.VERSION = VERSION;var COMPILER_REVISION = 6;
  __exports__.COMPILER_REVISION = COMPILER_REVISION;
  var REVISION_CHANGES = {
    1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
    2: '== 1.0.0-rc.3',
    3: '== 1.0.0-rc.4',
    4: '== 1.x.x',
    5: '== 2.0.0-alpha.x',
    6: '>= 2.0.0-beta.1'
  };
  __exports__.REVISION_CHANGES = REVISION_CHANGES;
  var isArray = Utils.isArray,
      isFunction = Utils.isFunction,
      toString = Utils.toString,
      objectType = '[object Object]';

  function HandlebarsEnvironment(helpers, partials) {
    this.helpers = helpers || {};
    this.partials = partials || {};

    registerDefaultHelpers(this);
  }

  __exports__.HandlebarsEnvironment = HandlebarsEnvironment;HandlebarsEnvironment.prototype = {
    constructor: HandlebarsEnvironment,

    logger: logger,
    log: log,

    registerHelper: function(name, fn) {
      if (toString.call(name) === objectType) {
        if (fn) { throw new Exception('Arg not supported with multiple helpers'); }
        Utils.extend(this.helpers, name);
      } else {
        this.helpers[name] = fn;
      }
    },
    unregisterHelper: function(name) {
      delete this.helpers[name];
    },

    registerPartial: function(name, partial) {
      if (toString.call(name) === objectType) {
        Utils.extend(this.partials,  name);
      } else {
        if (typeof partial === 'undefined') {
          throw new Exception('Attempting to register a partial as undefined');
        }
        this.partials[name] = partial;
      }
    },
    unregisterPartial: function(name) {
      delete this.partials[name];
    }
  };

  function registerDefaultHelpers(instance) {
    instance.registerHelper('helperMissing', function(/* [args, ]options */) {
      if(arguments.length === 1) {
        // A missing field in a {{foo}} constuct.
        return undefined;
      } else {
        // Someone is actually trying to call something, blow up.
        throw new Exception("Missing helper: '" + arguments[arguments.length-1].name + "'");
      }
    });

    instance.registerHelper('blockHelperMissing', function(context, options) {
      var inverse = options.inverse,
          fn = options.fn;

      if(context === true) {
        return fn(this);
      } else if(context === false || context == null) {
        return inverse(this);
      } else if (isArray(context)) {
        if(context.length > 0) {
          if (options.ids) {
            options.ids = [options.name];
          }

          return instance.helpers.each(context, options);
        } else {
          return inverse(this);
        }
      } else {
        if (options.data && options.ids) {
          var data = createFrame(options.data);
          data.contextPath = Utils.appendContextPath(options.data.contextPath, options.name);
          options = {data: data};
        }

        return fn(context, options);
      }
    });

    instance.registerHelper('each', function(context, options) {
      if (!options) {
        throw new Exception('Must pass iterator to #each');
      }

      var fn = options.fn, inverse = options.inverse;
      var i = 0, ret = "", data;

      var contextPath;
      if (options.data && options.ids) {
        contextPath = Utils.appendContextPath(options.data.contextPath, options.ids[0]) + '.';
      }

      if (isFunction(context)) { context = context.call(this); }

      if (options.data) {
        data = createFrame(options.data);
      }

      function execIteration(key, i, last) {
        if (data) {
          data.key = key;
          data.index = i;
          data.first = i === 0;
          data.last  = !!last;

          if (contextPath) {
            data.contextPath = contextPath + key;
          }
        }

        ret = ret + fn(context[key], {
          data: data,
          blockParams: Utils.blockParams([context[key], key], [contextPath + key, null])
        });
      }

      if(context && typeof context === 'object') {
        if (isArray(context)) {
          for(var j = context.length; i<j; i++) {
            execIteration(i, i, i === context.length-1);
          }
        } else {
          var priorKey;

          for(var key in context) {
            if(context.hasOwnProperty(key)) {
              // We're running the iterations one step out of sync so we can detect
              // the last iteration without have to scan the object twice and create
              // an itermediate keys array. 
              if (priorKey) {
                execIteration(priorKey, i-1);
              }
              priorKey = key;
              i++;
            }
          }
          if (priorKey) {
            execIteration(priorKey, i-1, true);
          }
        }
      }

      if(i === 0){
        ret = inverse(this);
      }

      return ret;
    });

    instance.registerHelper('if', function(conditional, options) {
      if (isFunction(conditional)) { conditional = conditional.call(this); }

      // Default behavior is to render the positive path if the value is truthy and not empty.
      // The `includeZero` option may be set to treat the condtional as purely not empty based on the
      // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
      if ((!options.hash.includeZero && !conditional) || Utils.isEmpty(conditional)) {
        return options.inverse(this);
      } else {
        return options.fn(this);
      }
    });

    instance.registerHelper('unless', function(conditional, options) {
      return instance.helpers['if'].call(this, conditional, {fn: options.inverse, inverse: options.fn, hash: options.hash});
    });

    instance.registerHelper('with', function(context, options) {
      if (isFunction(context)) { context = context.call(this); }

      var fn = options.fn;

      if (!Utils.isEmpty(context)) {
        if (options.data && options.ids) {
          var data = createFrame(options.data);
          data.contextPath = Utils.appendContextPath(options.data.contextPath, options.ids[0]);
          options = {data:data};
        }

        return fn(context, options);
      } else {
        return options.inverse(this);
      }
    });

    instance.registerHelper('log', function(message, options) {
      var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
      instance.log(level, message);
    });

    instance.registerHelper('lookup', function(obj, field) {
      return obj && obj[field];
    });
  }

  var logger = {
    methodMap: { 0: 'debug', 1: 'info', 2: 'warn', 3: 'error' },

    // State enum
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    level: 1,

    // Can be overridden in the host environment
    log: function(level, message) {
      if (typeof console !== 'undefined' && logger.level <= level) {
        var method = logger.methodMap[level];
        (console[method] || console.log).call(console, message);
      }
    }
  };
  __exports__.logger = logger;
  var log = logger.log;
  __exports__.log = log;
  var createFrame = function(object) {
    var frame = Utils.extend({}, object);
    frame._parent = object;
    return frame;
  };
  __exports__.createFrame = createFrame;
  return __exports__;
})(__module2__, __module3__);

// handlebars/safe-string.js
var __module4__ = (function() {
  "use strict";
  var __exports__;
  // Build out our basic SafeString type
  function SafeString(string) {
    this.string = string;
  }

  SafeString.prototype.toString = SafeString.prototype.toHTML = function() {
    return "" + this.string;
  };

  __exports__ = SafeString;
  return __exports__;
})();

// handlebars/runtime.js
var __module5__ = (function(__dependency1__, __dependency2__, __dependency3__) {
  "use strict";
  var __exports__ = {};
  var Utils = __dependency1__;
  var Exception = __dependency2__;
  var COMPILER_REVISION = __dependency3__.COMPILER_REVISION;
  var REVISION_CHANGES = __dependency3__.REVISION_CHANGES;
  var createFrame = __dependency3__.createFrame;

  function checkRevision(compilerInfo) {
    var compilerRevision = compilerInfo && compilerInfo[0] || 1,
        currentRevision = COMPILER_REVISION;

    if (compilerRevision !== currentRevision) {
      if (compilerRevision < currentRevision) {
        var runtimeVersions = REVISION_CHANGES[currentRevision],
            compilerVersions = REVISION_CHANGES[compilerRevision];
        throw new Exception("Template was precompiled with an older version of Handlebars than the current runtime. "+
              "Please update your precompiler to a newer version ("+runtimeVersions+") or downgrade your runtime to an older version ("+compilerVersions+").");
      } else {
        // Use the embedded version info since the runtime doesn't know about this revision yet
        throw new Exception("Template was precompiled with a newer version of Handlebars than the current runtime. "+
              "Please update your runtime to a newer version ("+compilerInfo[1]+").");
      }
    }
  }

  __exports__.checkRevision = checkRevision;// TODO: Remove this line and break up compilePartial

  function template(templateSpec, env) {
    /* istanbul ignore next */
    if (!env) {
      throw new Exception("No environment passed to template");
    }
    if (!templateSpec || !templateSpec.main) {
      throw new Exception('Unknown template object: ' + typeof templateSpec);
    }

    // Note: Using env.VM references rather than local var references throughout this section to allow
    // for external users to override these as psuedo-supported APIs.
    env.VM.checkRevision(templateSpec.compiler);

    var invokePartialWrapper = function(partial, context, options) {
      if (options.hash) {
        context = Utils.extend({}, context, options.hash);
      }

      partial = env.VM.resolvePartial.call(this, partial, context, options);
      var result = env.VM.invokePartial.call(this, partial, context, options);

      if (result == null && env.compile) {
        options.partials[options.name] = env.compile(partial, templateSpec.compilerOptions, env);
        result = options.partials[options.name](context, options);
      }
      if (result != null) {
        if (options.indent) {
          var lines = result.split('\n');
          for (var i = 0, l = lines.length; i < l; i++) {
            if (!lines[i] && i + 1 === l) {
              break;
            }

            lines[i] = options.indent + lines[i];
          }
          result = lines.join('\n');
        }
        return result;
      } else {
        throw new Exception("The partial " + options.name + " could not be compiled when running in runtime-only mode");
      }
    };

    // Just add water
    var container = {
      strict: function(obj, name) {
        if (!(name in obj)) {
          throw new Exception('"' + name + '" not defined in ' + obj);
        }
        return obj[name];
      },
      lookup: function(depths, name) {
        var len = depths.length;
        for (var i = 0; i < len; i++) {
          if (depths[i] && depths[i][name] != null) {
            return depths[i][name];
          }
        }
      },
      lambda: function(current, context) {
        return typeof current === 'function' ? current.call(context) : current;
      },

      escapeExpression: Utils.escapeExpression,
      invokePartial: invokePartialWrapper,

      fn: function(i) {
        return templateSpec[i];
      },

      programs: [],
      program: function(i, data, declaredBlockParams, blockParams, depths) {
        var programWrapper = this.programs[i],
            fn = this.fn(i);
        if (data || depths || blockParams || declaredBlockParams) {
          programWrapper = program(this, i, fn, data, declaredBlockParams, blockParams, depths);
        } else if (!programWrapper) {
          programWrapper = this.programs[i] = program(this, i, fn);
        }
        return programWrapper;
      },

      data: function(data, depth) {
        while (data && depth--) {
          data = data._parent;
        }
        return data;
      },
      merge: function(param, common) {
        var ret = param || common;

        if (param && common && (param !== common)) {
          ret = Utils.extend({}, common, param);
        }

        return ret;
      },

      noop: env.VM.noop,
      compilerInfo: templateSpec.compiler
    };

    var ret = function(context, options) {
      options = options || {};
      var data = options.data;

      ret._setup(options);
      if (!options.partial && templateSpec.useData) {
        data = initData(context, data);
      }
      var depths,
          blockParams = templateSpec.useBlockParams ? [] : undefined;
      if (templateSpec.useDepths) {
        depths = options.depths ? [context].concat(options.depths) : [context];
      }

      return templateSpec.main.call(container, context, container.helpers, container.partials, data, blockParams, depths);
    };
    ret.isTop = true;

    ret._setup = function(options) {
      if (!options.partial) {
        container.helpers = container.merge(options.helpers, env.helpers);

        if (templateSpec.usePartial) {
          container.partials = container.merge(options.partials, env.partials);
        }
      } else {
        container.helpers = options.helpers;
        container.partials = options.partials;
      }
    };

    ret._child = function(i, data, blockParams, depths) {
      if (templateSpec.useBlockParams && !blockParams) {
        throw new Exception('must pass block params');
      }
      if (templateSpec.useDepths && !depths) {
        throw new Exception('must pass parent depths');
      }

      return program(container, i, templateSpec[i], data, 0, blockParams, depths);
    };
    return ret;
  }

  __exports__.template = template;function program(container, i, fn, data, declaredBlockParams, blockParams, depths) {
    var prog = function(context, options) {
      options = options || {};

      return fn.call(container,
          context,
          container.helpers, container.partials,
          options.data || data,
          blockParams && [options.blockParams].concat(blockParams),
          depths && [context].concat(depths));
    };
    prog.program = i;
    prog.depth = depths ? depths.length : 0;
    prog.blockParams = declaredBlockParams || 0;
    return prog;
  }

  __exports__.program = program;function resolvePartial(partial, context, options) {
    if (!partial) {
      partial = options.partials[options.name];
    } else if (!partial.call && !options.name) {
      // This is a dynamic partial that returned a string
      options.name = partial;
      partial = options.partials[partial];
    }
    return partial;
  }

  __exports__.resolvePartial = resolvePartial;function invokePartial(partial, context, options) {
    options.partial = true;

    if(partial === undefined) {
      throw new Exception("The partial " + options.name + " could not be found");
    } else if(partial instanceof Function) {
      return partial(context, options);
    }
  }

  __exports__.invokePartial = invokePartial;function noop() { return ""; }

  __exports__.noop = noop;function initData(context, data) {
    if (!data || !('root' in data)) {
      data = data ? createFrame(data) : {};
      data.root = context;
    }
    return data;
  }
  return __exports__;
})(__module2__, __module3__, __module1__);

// handlebars.runtime.js
var __module0__ = (function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__) {
  "use strict";
  var __exports__;
  /*globals Handlebars: true */
  var base = __dependency1__;

  // Each of these augment the Handlebars object. No need to setup here.
  // (This is done to easily share code between commonjs and browse envs)
  var SafeString = __dependency2__;
  var Exception = __dependency3__;
  var Utils = __dependency4__;
  var runtime = __dependency5__;

  // For compatibility and usage outside of module systems, make the Handlebars object a namespace
  var create = function() {
    var hb = new base.HandlebarsEnvironment();

    Utils.extend(hb, base);
    hb.SafeString = SafeString;
    hb.Exception = Exception;
    hb.Utils = Utils;
    hb.escapeExpression = Utils.escapeExpression;

    hb.VM = runtime;
    hb.template = function(spec) {
      return runtime.template(spec, hb);
    };

    return hb;
  };

  var Handlebars = create();
  Handlebars.create = create;

  /*jshint -W040 */
  /* istanbul ignore next */
  var root = typeof global !== 'undefined' ? global : window,
      $Handlebars = root.Handlebars;
  /* istanbul ignore next */
  Handlebars.noConflict = function() {
    if (root.Handlebars === Handlebars) {
      root.Handlebars = $Handlebars;
    }
  };

  Handlebars['default'] = Handlebars;

  __exports__ = Handlebars;
  return __exports__;
})(__module1__, __module4__, __module3__, __module2__, __module5__);

  return __module0__;
}));
