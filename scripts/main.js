$(document).ready(function() {
    $(".carousel").on("slide.bs.carousel", function() {
        $(".carousel").carousel('pause');
        setTimeout(function() {
            $(".carousel").carousel({
                interval: 5000
            });
        }, 10000);
        setTimeout(function() {
            var next_index = $(".prev").index();
            var current_index = $(".active").index();
            if (next_index === -1) {
                next_index = $(".next").index();
            }
            $("[data-slide-to='" + next_index + "']").css({"background-color":"grey"});
            $("[data-slide-to='" + current_index + "']").css({"background-color":"#FFF"});
        }, 1);
    });
    $(".social_link").tooltip();
    var sp_db = new Firebase("https://snow-project.firebaseio.com/");
    
});