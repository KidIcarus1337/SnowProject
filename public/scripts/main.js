$(document).ready(function() {
    function pop_set(element_target, pop_target, pop_content, direction, errors) {
        $(element_target).popover({
            container: "body",
            toggle: "popover",
            placement: direction,
            content: pop_content
        });
        $(element_target).on("shown.bs.popover", function () {
            if (direction === "left") {
                $(pop_target).css(direction,parseInt($(pop_target).css(direction)) - 5 + "px");
            } else {
                $(pop_target).css("left",parseInt($(pop_target).css("left")) + 5 + "px");
            }
        });
        errors.push(element_target);
    }
    
    function disable_elements() {
        $(".form_button").prop("disabled", true);
        $(".pop_target").prop("disabled", true);
        $(".checkbox_container").prop("disabled", true);
    }
    
    function enable_elements() {
        $(".form_button").prop("disabled", false);
        $(".pop_target").prop("disabled", false);
        $(".checkbox_container").prop("disabled", false);
    }
    
    $(".carousel").carousel({
        interval: 10000
    });
    
    $(".carousel").carousel('pause');
    
    $(".carousel").on("slide.bs.carousel", function() {
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
    
    $(".log_section button, #overlay_button").mousedown(function() {
        $(this).css({"background-color":"#CCCCCC", "border-color":"#00A1A1","color":"#00A1A1"});
    });
    
    $(".log_section button, #overlay_button").on("mouseup mouseleave", function() {
        $(this).css({"background-color":"#FFF", "border-color":"#00E6E6","color":"#00E6E6"});
    });
    
    $(".pop_target").focus(function() {
        $(this).popover("destroy");
    });
    
    $("#shoveler_box, #poster_box").on("focus changed", function() {
        $("#shoveler_container").popover("destroy");
    });
    
    var fb_accounts = new Firebase("https://snow-project.firebaseio.com/accounts/");
    
    $("#sign_up_button").click(function() {
        disable_elements();
        $(".pop_target").each(function() {
            $(this).popover("destroy");
        });
        
        var errors = [];
        var email = $("#email").val();
        var user_name = $("#user_name").val();
        var password = $("#password").val();
        var rp_password = $("#rp_password").val();
        var shoveler = $("#shoveler_box").is(":checked");
        var poster = $("#poster_box").is(":checked");
        var newsletter = $("#newsletter_box").is(":checked");
        
        if (email === "") {
            pop_set("#email", ".popover:contains(email)", "Please provide an email address.", "left", errors);
        } else if (email.indexOf("@") === -1) {
            pop_set("#email", ".popover:contains(Invalid email)", "Invalid email address.", "left", errors);
        }
        if (user_name === "") {
            pop_set("#user_name", ".popover:contains(user)", "Please provide a user name.", "left", errors);
        }
        if (password === "") {
            pop_set("#password", ".popover:contains(provide a password)", "Please provide a password.", "left", errors);
        }
        if (rp_password === "") {
            pop_set("#rp_password", ".popover:contains(repeat)", "Please repeat your password.", "left", errors);
        } else if (password !== rp_password) {
            pop_set("#rp_password", ".popover:contains(match)", "Your passwords do not match.", "left", errors);
        }
        if (shoveler === false && poster === false) {
            pop_set("#shoveler_container", ".popover:contains(role)", "Please choose at least one role.", "left", errors);
        }
        fb_accounts.once("value", function(dataSnapshot) {
            dataSnapshot.forEach(function(childSnapshot) {
                if (email.toLowerCase() === (childSnapshot.child("email").val()).toLowerCase()) {
                    pop_set("#email", ".popover:contains(That email)", "That email address has already been registered.", "left", errors);
                }
                if (user_name.toLowerCase() === (childSnapshot.child("user_name").val()).toLowerCase()) {
                    pop_set("#user_name", ".popover:contains(That user name)", "That user name has already been taken.", "left", errors);
                }
            });
        });
        setTimeout(function() {
            if (errors.length > 0) {
                for (var each in errors) {
                    $(errors[each]).popover("show");
                }
                enable_elements();
            } else {
                fb_accounts.child(user_name.toLowerCase()).set({
                    email: email,
                    newsletter: newsletter,
                    password: password,
                    poster: poster,
                    shoveler: shoveler,
                    user_name: user_name
                });
                alert("woot");
                enable_elements();
            }
        }, 200);
    });
    
    $("#log_in_button").click(function() {
        disable_elements();
        $(".pop_target").each(function() {
            $(this).popover("destroy");
        });
        var errors = [];
        var log_id = $("#log_id").val();
        var log_password = $("#log_password").val();
        var remember_me = $("#remember_me_box").is(":checked");
        
        if (log_id === "") {
            pop_set("#log_id", ".popover:contains(name or email)", "Please enter your user name or email.", "right", errors);
        }
        if (log_password === "") {
            pop_set("#log_password", ".popover:contains(your password)", "Please enter your password.", "right", errors);
        }
        setTimeout(function() {
            if (errors.length > 0) {
                for (var each in errors) {
                    $(errors[each]).popover("show");
                }
                enable_elements();
            } else {
                fb_accounts.once("value", function(dataSnapshot) {
                    dataSnapshot.forEach(function(childSnapshot) {
                        if (log_id !== childSnapshot.child("email").val() && log_id !== childSnapshot.child("user_name").val()) {
                            pop_set("#log_id", ".popover:contains(ID)", "Invalid log in ID.", "right", errors);
                        } else {
                            for (var i = errors.length - 1; i >=0; i--) {
                                if (errors[i] === "#log_id") {
                                    errors.splice(i, 1);
                                }
                            }
                            if (log_password !== childSnapshot.child("password").val()) {
                                pop_set("#log_password", ".popover:contains(Invalid password)", "Invalid password.", "right", errors);
                                return true;
                            } else {
                                return true;
                            }
                        }
                    });
                    setTimeout(function() {
                        if (errors.length > 0) {
                            for (var each in errors) {
                                $(errors[each]).popover("show");
                            }
                            enable_elements();
                        } else {
                            console.log("Login Succeeded!");
                            enable_elements();
                        }
                    }, 200);
                });
            }
        }, 200);
    });
});