/**
 * Created by aaron.jin on 15/6/10.
 */

"use strict";

var Brush = (function () {
    var stage, w, h, loader, container;
    var bg1Img, bg2Img, shoes, grant, direction, bg1Alpha, bg2Alpha, currentFrame, currentBg, directionBg;
    var bgImg = [], bgImgSize = 7;
    var bgAlpha = 0;
    var allowaction = true, actionTime=0;
    var manifest = [
        {src: "bg-1.jpg", id: "bg1"},
        {src: "bg-2.jpg", id: "bg2"},
        {src: "bg-3.jpg", id: "bg3"},
        {src: "bg-4.jpg", id: "bg4"},
        {src: "bg-5.jpg", id: "bg5"},
        {src: "bg-6.jpg", id: "bg6"},
        {src: "bg-7.jpg", id: "bg7"},
        {src: "shoesall.png", id: "shoes"}
    ];

    var canvas = {
        width: 700,
        height: 444
    };
    var shoe = {
        width: 416,
        height: 208
    };

    var animationSpeed = 0.5;

    var animationList = [
        {name: 'shoes1', start: 0, end: 7, speed: animationSpeed},
        {name: 'shoes2', start: 8, end: 15, speed: animationSpeed},
        {name: 'shoes3', start: 16, end: 23, speed: animationSpeed},
        {name: 'shoes4', start: 24, end: 31, speed: animationSpeed},
        {name: 'shoes5', start: 32, end: 39, speed: animationSpeed},
        {name: 'shoes6', start: 40, end: 47, speed: animationSpeed}
    ];

    var animations = creatShoesAnimation(animationList);


    return {
        init: function () {
            examples.showDistractor();
            stage = new createjs.Stage("Canvas");
            w = stage.canvas.width;
            h = stage.canvas.height;
            loader = new createjs.LoadQueue(false);
            loader.addEventListener("complete", handleComplete);
            loader.loadManifest(manifest, true, "publish/images/");
        }
    };


    function handleComplete() {
        bg1Alpha = 0;
        bg2Alpha = 0;
        examples.hideDistractor();

        container = new createjs.Container();

        //bg1Img = new createjs.Bitmap(loader.getResult("bg1"));
        //bg1Img.setTransform(0, 0, h / canvas.height, h / canvas.height);
        //bg1Img.alpha = 1;
        //
        //bg2Img = new createjs.Bitmap(loader.getResult("bg2"));
        //bg2Img.setTransform(0, 0, h / canvas.height, h / canvas.height);
        //bg2Img.alpha = 0;
        //
        //container.addChild(bg1Img);
        //container.addChild(bg2Img);

        for (var i = 1; i <= bgImgSize; i++) {
            bgImg[i] = new createjs.Bitmap(loader.getResult("bg" + i));
            bgImg[i].setTransform(0, 0, h / canvas.height, h / canvas.height);
            bgImg[i].alpha = 0;

            container.addChild(bgImg[i]);
        }
        bgImg[1].alpha = 1;


        var spriteShoes = new createjs.SpriteSheet({
            framerate: 30,
            "images": [loader.getResult("shoes")],
            "frames": {"count": 48, "width": shoe.width, "height": shoe.height},
            "animations": animations
        });


        grant = new createjs.Sprite(spriteShoes, "shoes1start");
        grant.x = canvas.width / 2 - shoe.width / 2;
        grant.y = canvas.height / 2 - shoe.height / 2;


        stage.addChild(container, grant);
        stage.update();

        direction = 'Forward';
        directionBg = 'Forward';
        currentFrame = 1;
        currentBg = 1;
        stage.addEventListener("stagemousedown", handleJumpStart);

        createjs.Ticker.timingMode = createjs.Ticker.RAF;
        createjs.Ticker.addEventListener("tick", tick);
    }

    function creatShoesAnimation(list) {
        var animations = {};
        for (var item in list) {
            animations[list[item].name + 'start'] = list[item].start;
            animations[list[item].name + 'end'] = list[item].end;
            animations[list[item].name + 'run'] = {};
            animations[list[item].name + 'run']['frames'] = frameToArray(list[item].start, list[item].end);
            animations[list[item].name + 'run']['next'] = list[item].name + 'end';
            animations[list[item].name + 'run']['speed'] = list[item].speed;
            animations[list[item].name + 'back'] = {};
            animations[list[item].name + 'back']['frames'] = frameToArray(list[item].end, list[item].start);
            animations[list[item].name + 'back']['next'] = list[item].name + 'start';
            animations[list[item].name + 'back']['speed'] = list[item].speed;
        }
        return animations;
    }

    function frameToArray(start, end) {
        var frameArray = [];
        if (start < end) {
            for (var i = start; i <= end; i++) {
                frameArray.push(i);
            }
        } else {
            for (var i = start; i >= end; i--) {
                frameArray.push(i);
            }
        }
        return frameArray;
    }

    function handleJumpStart() {
        bgAlpha = 0.03;
        if (allowaction) {
            allowaction = false;
            actionTime=0;
            if (direction === 'Forward') {
                handleAnimation(0, "run", 1, (currentFrame + 1 > animationList.length), 'Reverse');
            } else {
                handleAnimation(1, "back", -1, (currentFrame - 1 < 1), 'Forward');
            }
        }
    }

    function handleAnimation(offset, animation, step, boolLength, direct) {
        currentBg = currentFrame;
        directionBg = direction;
        for (var i = 1; i <= bgImgSize; i++) {
            bgImg[i].alpha = 0;
        }
        bgImg[currentBg + offset].alpha = 1;
        grant.gotoAndPlay('shoes' + currentFrame + animation);
        currentFrame += step;
        if (boolLength) {
            direction = direct;
            currentFrame -= step;
        }
    }

    function tick(event) {
        if (actionTime <60){
            actionTime++;
        }else{
            allowaction = true;
        }
        if (directionBg === 'Forward') {
            bgImg[currentBg].alpha -= bgAlpha;
            bgImg[currentBg + 1].alpha += bgAlpha;
        } else {
            bgImg[currentBg + 1].alpha -= bgAlpha;
            bgImg[currentBg].alpha += bgAlpha;
        }

        stage.update(event);
    }

})();
