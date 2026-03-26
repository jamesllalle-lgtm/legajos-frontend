var app = angular.module("projectuss", []);
app.run(function ($rootScope, $timeout, $document) {

  var bodyElement = angular.element($document);
  // console.log(TimeOut_Thread);
  /// Keyboard Events
  bodyElement.bind("keydown", function (e) {
    redimension_alto_div(e);
  });
  bodyElement.bind("keyup", function (e) {
    redimension_alto_div(e);
  });

  /// Mouse Events
  bodyElement.bind("click", function (e) {
    redimension_alto_div(e);
  });
  bodyElement.bind("mousemove", function (e) {
    redimension_alto_div(e);
  });
  bodyElement.bind("DOMMouseScroll", function (e) {
    redimension_alto_div(e);
  });
  bodyElement.bind("mousewheel", function (e) {
    redimension_alto_div(e);
  });
  bodyElement.bind("mousedown", function (e) {
    redimension_alto_div(e);
  });

  /// Touch Events
  bodyElement.bind("touchstart", function (e) {
    redimension_alto_div(e);
  });
  bodyElement.bind("touchmove", function (e) {
    redimension_alto_div(e);
  });

  /// Common Events
  bodyElement.bind("scroll", function (e) {
    redimension_alto_div(e);
  });
  bodyElement.bind("focus", function (e) {
    redimension_alto_div(e);
  });


  function redimension_alto_div(e) {
    var screenhs = screen.height-470;
    var divhs = document.getElementById('divhs');
    if(divhs != null){
      divhs.style.backgroundColor = null;
      divhs.style.cssText = "height: " + screenhs.toString() + "px; overflow-y: scroll; background: #fff;" // margin-top: -20px
    }
  }
})
