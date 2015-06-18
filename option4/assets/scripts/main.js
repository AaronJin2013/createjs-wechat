/**
 * Created by frank.zhang on 6/15/15.
 */
if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined'? args[number]: match;
        });
    };
}

//loading
var imageCount=14;
var loaded=0;
var preload=function(){
    for(var i=1;i<=imageCount;i++){
        var image=new Image();
        image.src='assets/images/animation/{0}.png'.format(i);
        image.onload=function(){
            loaded++;
        }
    }
}
preload();

//adjust image size
var resizeImage=function($image){
    var left= 0,top=0;
    var windowWidth=window.innerWidth;
    var windowHeight=window.innerHeight;
    var imageWidth=$image.width();
    var imageHeight=$image.height();
    var windowScale=windowWidth/windowHeight;
    var imageScale=imageWidth/imageHeight;
    if(windowScale<=imageScale){
        imageHeight=windowHeight;
        imageWidth=imageHeight*imageScale;
        left=(windowWidth-imageWidth)/2;
    }else{
        imageWidth=windowWidth;
        imageHeight=imageWidth/imageScale;
        top=(windowHeight-imageHeight)/2;
    }
    $image.width(imageWidth);
    $image.height(imageHeight);
    $image.css('top',top);
    if($image.parent().hasClass('front')){
        $image.css('top',top-windowHeight/3);
    }
    $image.css('left',left);
}

var page1 = new Hammer($('.page1')[0]);
var page2 = new Hammer($('.page2')[0]);

page1.on('swipeleft',function(){
    $('.page').addClass('to-left');
    index=1;
    //If all Images have loaded,excute Animation
    window.animationTimer&&clearInterval(window.animationTimer);
    window.animationTimer=setInterval(function(){
        if(loaded==imageCount){
            animation();
            $('.front,.back').addClass('transition');
            clearInterval(window.animationTimer);
        }
    },1000);
});

page2.on('swiperight',function(){
    $('.page').removeClass('to-left');
    $('.front,.back').removeClass('transition');
});

$('.page1 .image-wapper img').attr('src','assets/images/home.jpg').load(function(){
    $('.loading').hide();
    resizeImage($(this));
    $(this).addClass('loaded');
});

$('.page2 img').attr('src','assets/images/animation/1.png').load(function(){
    resizeImage($(this));
    $(this).addClass('loaded');
});

var index=1;

var setImage=function(index){
    var src1='assets/images/animation/{0}.png'.format(index);
    var src2='assets/images/animation/{0}.png'.format(15-index);
    $('.back img').attr('src',src1);
    $('.front img').attr('src',src2);
}

var animation=function(){
    window.timer=setInterval(function(){
        setImage(index);
        if(index<14){
            index++;
        }else{
            clearInterval(window.timer);
        }
    },200);
}


$(window).resize(function(){
    $('.image-wapper img').each(function(){
        resizeImage($(this));
    });
});