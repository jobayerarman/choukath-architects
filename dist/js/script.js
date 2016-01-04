// dynamic header size
$(function dynamicHeader() {
  var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ? true : false;
  var height = $(window).height();

  if(!isMobile && height > 750) {
    $('header').css({'height': height + 2 + "px"});
  }
});
