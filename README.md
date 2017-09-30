Image Slider
=============================

## Synopsis

Javascript code enabling the user to scroll through images, with zooming and dragging enabled. This example includes views from all angles of a utility trailer, with the ability to open the trailer and see inside.

## Code Example

First, the function that enables the carousel to scroll through all images:

```Javascript

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
```

Second, the function that enables zooming and dragging (using jQuery UI for the draggable capability):

```javascript

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

  ```
Third, the function that allows the user to take a look inside the utility trailer:

```javascript

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

```

## Motivation

I put together this functionality for a client, who wanted potential customers
to be able to see his product from many angles and zoom in on the details. 

## Dependencies

jQuery Core 3.2.1
jQuery UI basic CSS and JS (for the dragging function).

## License

MIT License

Copyright (c) 2017 Jeff Bass Design & Development

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
