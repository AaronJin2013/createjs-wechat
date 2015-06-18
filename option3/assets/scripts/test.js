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




$('.image-wapper img').attr('src','assets/images/home.jpg').load(function(){
    $('.message').html('image-load');
});


$('.test').on('click',function(){
    $('.message').html('click');
});

//$('.test').on('swipeleft',function(){
//    $('.message').html('swipe-left');
//});
//
//$('.test').on('swiperight',function(){
//    $('.message').html('swipe-right');
//});


var test = new Hammer($('.test')[0]);
//test.on('swipe', function() {
//    $('.message').html('swipe');
//});

test.on('swipeleft', function() {
    $('.message').html('swipeleft');
});

test.on('swiperight', function() {
    $('.message').html('swiperight');
});