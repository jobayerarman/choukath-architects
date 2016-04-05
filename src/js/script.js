// Global Variables
var width = $(window).width();
var height = $(window).height();

// dynamic header size
$(function dynamicHeader() {
  var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ? true : false;

  if(!isMobile && height > 750) {
    $('header').css({'height': height + 2 + "px"});
  }
});

// Navbar background opacity
$(function navOpacity() {
  var nav = $(".navbar-main");

  $(window).scroll(function() {
    if ($(this).scrollTop() > (height - 66)) {
      nav.css({'background-color': '#fff','color': '#000'});
      nav.find('a').css({'color': '#000'});
    } else{
      nav.css({'background': 'transparent','color': '#fff'});
      nav.find('a').css({'color': '#fff'});
    }
  });
});

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function pageScroll() {
  var nav        = $('.navbar-main');
  var nav_height = nav.outerHeight();

  $('body').on('click', 'nav a', function(event) {
    var $anchor = $(this);
    event.preventDefault();

    $('html, body').stop().animate({
      scrollTop: $($anchor.attr('href')).offset().top - (nav_height + 10) });

    if(width < 769) {
      $(".navbar-mobile ul.expanded").removeClass("expanded").slideUp('fast');
      $(this).removeClass("open");
    }
  });
});
