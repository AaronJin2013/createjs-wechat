/**
 * Created by aaron.jin on 15/6/10.
 */

"use strict";


var orientLayer = document.getElementById("orientLayer");
//判断横屏竖屏
function checkDirect() {
    if (document.documentElement.clientHeight >= document.documentElement.clientWidth) {
        return "portrait";
    } else {
        return "landscape";
    }
}
//显示屏幕方向提示浮层
function orientNotice() {
    var orient = checkDirect();
    if (orient === "landscape") {
        orientLayer.style.display = "none";
    } else {
        orientLayer.style.display = "block";

    }
}
function init() {

//去除URL条
    setTimeout(scrollTo, 0, 0, 0);

    orientNotice();
    window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function () {
        setTimeout(orientNotice, 200);
        console.log($(window).width() + " " + $(window).height());
    });

    //防橡皮筋效果
    document.addEventListener('touchmove', preventDefault, false);

    document.body.addEventListener('touchmove', function (ev) {
        var target = ev.target;

        // 在 scroller 上滑动，阻止事件冒泡，启用浏览器默认行为。
        if (isScroller(target)) {
            ev.stopPropagation();
        }
    }, false);


    if (document.body) { setupEmbed(); }
    else { document.addEventListener("DOMContentLoaded", setupEmbed); }

    function setupEmbed() {
        if (window.top != window) {
            document.body.className += " embedded";
        }
    }

    var o = window.examples = {};
    o.showDistractor = function(id) {
        var div = id ? document.getElementById(id) : document.querySelector("div canvas").parentNode;
        div.className += " loading";
    };

    o.hideDistractor = function() {
        var div = document.querySelector(".loading");
        div.className = div.className.replace(/\bloading\b/);
    };

    // 尝试去除微信顶端导航，未成功
    //document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
    //    WeixinJSBridge.call('hideToolbar');
    //    WeixinJSBridge.call('hideOptionMenu');
    //});
}

function preventDefault(ev) {
    ev.preventDefault();
}

function isScroller(el) {

    // 判断元素是否为 scroller
    return el.classList.contains('scroller');
}



$(function () {
    init();
    $(window).resize(function () {
        $('Canvas').width($(window).width());
        $('Canvas').height($(window).height());
    }).trigger('resize');

    Brush.init();
    console.log('main!!');
});
