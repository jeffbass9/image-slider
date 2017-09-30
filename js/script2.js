var imagePosition,
    x_cursor = 0,
    y_cursor = 0,
    x_image = 0,
    y_image = 0;

//Check to see if the device has touch capabilities
// function hasTouch(){
//     return 'ontouchstart' in document.documentElement;
// }

//Define the function that fires when the user clicks and drags on the "#drag-img" element
function startDrag(){
  var imageHeight = $("#drag-img").height() * 0.5;
  var imageWidth = $("#drag-img").width() * 0.5;
  x_cursor = event.pageX - imageHeight;
  y_cursor = event.pageY - imageWidth;
  $("#drag-img").offset({ top: x_cursor, left: y_cursor });
}

//Define the function that fires when the user releases the mouse above the "#drag-img" element

function stopDrag(){

}
