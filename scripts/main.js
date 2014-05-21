$(document).ready(function() {
    /*function reviews_slideshow() {
        $("#review_radios > input").click(function() {
            
        });
        var cycling - setInterval(function() {
            switch ($("[checked]").val()) {
                case "first_review":
                    $('[value="second_review"]').prop("checked", true);
                    $('[value="second_review"]').fadeIn(0);
                    $('[value="first_review"]').animate({left:"0"});
                    
            }
        }, 5000);
    });*/
    $(".social_link").tooltip();
    var myDataRef = new Firebase("https://snow-project.firebaseio.com/“);
});