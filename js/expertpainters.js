$(document).ready(function() {
    var $menuIcon = $("#topheader.menu_icon");
    var $navUl = $("#nav_menu");

    $menuIcon.click(function() {
        $navUl.slideToggle();
    });

    $(window).resize(function() {
        $("#nav_menu").css('display', '');
    });

});