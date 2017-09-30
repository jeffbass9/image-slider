//Push all 360 images to the images array
var images = $('.carousel-image');
var currentIndex = 0;
var imgAmt = images.length;

//Define the variable for the image at the current step of the loop
function cycleImages(){
  images.removeClass('show-360');
  $(".opened-image").removeClass("show-360").hide();
  $(images).find('img').css({"left": "0", "top": "0"});
  $(images).find('img').css({"height": "auto", "width": "100%"});

  var image = $('.carousel-image').eq(currentIndex);

  image.addClass('show-360');
  images.children('img').removeAttr('id');
  images.hide();
  image.show();

  //Enable image with class 'open-image' to reveal image class 'opened-image'
  if(image.hasClass("open-image")){
    $(".photo-caption").fadeIn(400);
  }
  else{
    $(".photo-caption").hide();
  }
}
//End cycleImages

//Hide all images when document loads, then display the first image in the carousel cycle
$(document).ready(function(){
  images.hide();
  $(".opened-image").hide();
  cycleImages();

});

//Scroll images when buttons are clicked:
$('.right-arrow').click(function(){
  currentIndex += 1;
  if(currentIndex > imgAmt - 1){
    currentIndex = 0;
  }
  cycleImages();
});

$('.left-arrow').click(function(){
  currentIndex -= 1;
  if(currentIndex < 0){
    currentIndex = imgAmt -1;
  }
  cycleImages();
});

//Zoom functions

  //Zoom in and out when the zoom buttons are clicked:
  var zoomIn = function(){
    var $image = $('.show-360').find('img');
    var $height = $image.height();
    var $width = $image.width();
    // var $position = $image.position();

    var $imageWindow = $(".image-box");

    //Enable dragging once zoom has been clicked
    $image.draggable({
      drag: function( event, ui ){
        //Trying to re-initialize these variables so that the drag function uses
        //updated values
        var $image = $('.show-360').find('img');
        var $height = $image.height();
        var $width = $image.width();
        //Constrain the drag function to keep the edges of the image from entering
        //the visible window
        ui.position.left = Math.max(Math.min(ui.position.left, 0), -($width - $imageWindow.width() ) );
        ui.position.top = Math.max(Math.min(ui.position.top, 0), -($height - $imageWindow.height() ) );

      }
    });

    //Swap out the image for the highest resolution possible, and then zoom in
    if($image.width() <= 2700){
      var $position = $image.position();

      var image_src = $image.attr("src");
      var zoom_keyword = "@zoom";
      var src_position = (image_src.length) - 4;
      var zoom_src = [image_src.slice(0, src_position), zoom_keyword, image_src.slice(src_position)].join('');

      if( image_src.includes("@zoom")){
        //Leave the src attribute alone
      }
      else{
        $(".show-360").html('<img src="' + zoom_src + '"/>');
      }

      $image.animate({
        'height' : $height*1.5,
        'width'  : $width*1.5,
        'top'    : - ( ( ($height*1.5) - $imageWindow.height() )/2 ),
        'left'   : - ( ( ($width*1.5) - $imageWindow.width() )/2 ),
      });
    }
    else{
      //Do nothing
    }
  }
  //End zoomIn

  var zoomOut = function(){
    var $image = $('.show-360').find('img');
    var $height = $image.height();
    var $width = $image.width();
    var $position = $image.position();

    if($image.width() > 720){
      $image.animate({
        'height' : '100%',
        'width'  : '100%',
        'top'    : 0,
        'left'   : 0
      });
    }
    else{
      //Do nothing
    }
  }
  //End zoomOut

  //Pinch zoom
  //Source:https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events/Pinch_zoom_gestures
  //Global vars to cache event state
  var evCache = new Array();
  var prevDiff = -1;

  function init() {
    //Install event handlers for the pointer target
    // var el= document.getElementById("target");
    var el= $(".show-360").find("img");
    el.onpointerdown = pointerdown_handler;
    el.onpointermove = pointermove_handler;

    //Use same handler for pointer{up,cancel,out,leave} events
    //since the semantics for these events in this widget are the same
    el.onpointerup = pointerup_handler;
    el.onpointercancel = pointerup_handler;
    el.onpointerout = pointerup_handler;
    el.onpointerleave = pointerup_handler
  }

  function pointerdown_handler(ev){
    //The pointerdown event signals the start of a touch interaciton.
    //This event is cached to support 2-finger gestures
    evCache.push(ev);
    log("pointerDown", ev);
  }

  function pointermove_handler(ev){
    //This function implements a 2-pointer horizontal pinch/zoom gesture.
    log("pointerMove", ev);
    // ev.target.style.border = "dashed";


    //Find this event in the cache and update its record with this event
    for( var i = 0; i< evCache.length; i++){
      if(ev.pointerId == evCache[i].pointerId){
        evCache[i] = ev;
        break;
      }
    }

    //If two pointers are down, check for pinch gestures
    if(evCache.lenght == 2){
      //Calculate the distance between the two pointers
      var curDiff = Math.abs(evCache[0].clientX - evCache[1].clientX);

      if(prevDiff > 0){
        if(curDiff > prevDiff){
          //The distance between the two pointers has increased
          log("Pinch moving OUT -> Zoom in", ev);
          zoomIn();
        }
        if(curDiff < prevDiff){
          //The distance between the two pointers has decreased
          log("Pinch moving IN -> Zoom out", ev);
          zoomOut();

        }
      }
      //Cache the distance for the next move event
      prevDiff = curDiff;
    }
  }
  //End pointermove_handler

  function pointerup_handler(ev){
    log(ev.type, ev);
    //Remove this pointer from the cache and reset the target
    remove_event(ev);

    //If the number of pointers down is less than two then reset diff tracker
    if(evCache.length < 2) prevDiff = -1;
  }

  //This function helps manage the global event caches evCache
  function remove_event(ev){
    //Remove this event from the target's cache
    for (var i = 0; i < evCache.length; i++){
      if(evCache[i].pointerId == ev.pointerId){
        evCache.splice(i,1);
        break;
      }
    }
  }

  //Log events flag
  var logEvents = false;

  //Logging/debugging functions
  function enableLog(ev){
    logEvents = logEvents ? false : true;
  }

  function log(prefix, ev){
    if(!logEvents) return;
    var o = document.getElementsByTagName('output')[0];
    var s = prefix + ": pointerID = " + ev.pointerId +
                    " ; pointerType = " + ev.pointerType +
                    " ; isPrimary = " + ev.isPrimary;
    o.innerHTML += s + "";
  }

  function clearLog(event) {
    var o = document.getElementsByTagName('output')[0];
    o.innerHTML = "";
  }
//End pinch zoom functionality

  $('.zoom-in').click(function(){
      zoomIn();
  });

  $('.zoom-out').click(function(){
      zoomOut();
  });

//Reveal open trailer picture when photo-caption button is clicked:
$(".photo-caption").click(function(){

  if($(".photo-caption").text() === "Close Hatch"){
    $(".opened-image").removeClass("show-360").hide();
    $(".open-image").addClass("show-360").show();
    $(".photo-caption").text("Click to Open Hatch")
  }
  else{
    $(".open-image").removeClass("show-360").hide();
    $(".opened-image").addClass("show-360").show();
    $(".photo-caption").text("Close Hatch");
  }
});
