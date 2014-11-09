function doLogout() {
    $.ajax({
        url: "/logout",
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            window.location.href = "/";
        },
        error: function (xhr, status, error) {
            var errorJson = $.parseJSON(xhr.responseText);
            alert("Error: " + errorJson['message']);
        }
    });
}

$(function() {
    function checkSessionInfo() {
        $.ajax({
            url: "/session_info",
            type: "GET",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                $("#log_in_section").html("<li>Welcome, " + response.first_name +
                    "<button type='button' class='btn btn-link' onclick='doLogout()'> - LOGOUT</div></li>");
            },
            error: function (xhr, status, error) {
                $("#log_in_section").html("<li><a href='login'>LOG IN</a></li>");
            }
        });
    }
    checkSessionInfo();

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

    function toTitleCase(str) {
        return str.replace(/\w*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
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

    $(".overlay_button").hover(function() {
        $(this).css({"color":"#00E6E6"});
    })

    $(".log_section button, .overlay_button, #post_button").mousedown(function() {
        $(this).css({"background-color":"#CCCCCC", "border-color":"#00A1A1","color":"#00A1A1"});
    });
    
    $(".log_section button, .overlay_button, #post_button").on("mouseup mouseleave", function() {
        $(this).css({"background-color":"#FFF", "border-color":"#00E6E6","color":"#00E6E6"});
    });
    
    $(".pop_target").focus(function() {
        $(this).popover("destroy");
    });
    
    $("#shoveler_box, #poster_box").on("focus changed", function() {
        $("#shoveler_container").popover("destroy");
    });

    function signUp() {
        disable_elements();
        $(".pop_target").each(function() {
            $(this).popover("destroy");
        });
        
        var errors = [];
        var email = $("#email").val(),
            user_name = $("#user_name").val(),
            password = $("#password").val(),
            rp_password = $("#rp_password").val(),
            shoveler = $("#shoveler_box").is(":checked"),
            poster = $("#poster_box").is(":checked"),
            newsletter = $("#newsletter_box").is(":checked");
        
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
        $.ajax({
            url: "/name",
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ "name": name }),
            success: function (response) {
                var name = response['name'];
                updateUI(name);
            }
        });
        /*fb_accounts.once("value", function(dataSnapshot) {
            dataSnapshot.forEach(function(childSnapshot) {
                if (email.toLowerCase() === (childSnapshot.child("email").val()).toLowerCase()) {
                    pop_set("#email", ".popover:contains(That email)", "That email address has already been registered.", "left", errors);
                }
                if (user_name.toLowerCase() === (childSnapshot.child("user_name").val()).toLowerCase()) {
                    pop_set("#user_name", ".popover:contains(That user name)", "That user name has already been taken.", "left", errors);
                }
            });
        });*/
        setTimeout(function() {
            if (errors.length > 0) {
                for (var each in errors) {
                    $(errors[each]).popover("show");
                }
                enable_elements();
            } else {
                /*fb_accounts.child(user_name.toLowerCase()).set({
                    email: email,
                    newsletter: newsletter,
                    password: password,
                    poster: poster,
                    shoveler: shoveler,
                    user_name: user_name
                });
                alert("woot");
                enable_elements();*/
            }
        }, 200);
    }

    function login() {
        disable_elements();
        $(".pop_target").each(function() {
            $(this).popover("destroy");
        });
        var errors = [];
        var login_id = $("#log_id").val(),
            login_password = $("#log_password").val(),
            remember_me = $("#remember_me_box").is(":checked");

        if (login_id === "") {
            pop_set("#log_id", ".popover:contains(name or email)", "Please enter your user name or email.", "right", errors);
        }
        if (login_password === "") {
            pop_set("#log_password", ".popover:contains(your password)", "Please enter your password.", "right", errors);
        }
        setTimeout(function() {
            if (errors.length > 0) {
                for (var each in errors) {
                    $(errors[each]).popover("show");
                }
                enable_elements();
            } else {
                $.ajax({
                    url: "/check_login",
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({"login_id": login_id, "login_password": login_password}),
                    success: function (response) {
                        setTimeout(function() {
                            window.location.href = "/";
                        }, 5000);
                    },
                    error: function (xhr, status, error) {
                        var errorJson = $.parseJSON(xhr.responseText);
                        if (errorJson["message"] === "Invalid ID") {
                            pop_set("#log_id", ".popover:contains(ID)", "Invalid login ID.", "right", errors);
                        } else {
                            for (var i = errors.length - 1; i >= 0; i--) {
                                if (errors[i] === "#log_id") {
                                    errors.splice(i, 1);
                                }
                            }
                            if (errorJson["message"] === "Invalid password") {
                                pop_set("#log_password", ".popover:contains(Invalid password)", "Invalid password.", "right", errors);
                            }
                        }
                    }
                });
                setTimeout(function() {
                    if (errors.length > 0) {
                        for (var each in errors) {
                            $(errors[each]).popover("show");
                        }
                        enable_elements();
                    }
                }, 200);
            }
        }, 200);
    }

    $("#log_in_button").click(login);

    $("#log_in_form > input").keypress(function(e) {
        if (e.which === 13) {
            login();
        }
    });

    $("#sign_up_button").click(signUp);

    $("#sign_up_form > input").keypress(function(e) {
        if (e.which === 13) {
            signUp();
        }
    });

    $.getScript("scripts/autoNumeric.js", function() {
        $("#pay").autoNumeric("init");
    });

    $("#post_button").click(function() {
        disable_elements();
        $(".pop_target").each(function() {
            $(this).popover("destroy");
        });
        var errors = [];
        var first_name = $("#first_name").val(),
            last_name = $("#last_name").val(),
            country = $("#country").val(),
            city = $("#city").val(),
            street = toTitleCase(($("#street").val().toLowerCase()).replace(/_/g, " ").replace(/\./g, "").replace(/street/g, "st").replace(/drive/, "dr").replace(/lane/, "ln")),
            phone = $("#phone").val(),
            email = $("#email").val(),
            zip_code = $("#zip").val(),
            pay = "$" + $("#pay").val();
        if (first_name === "") {
            pop_set("#first_name", ".popover:contains(first name)", "Please provide your first name.", "left", errors);
        }
        if (last_name === "") {
            pop_set("#last_name", ".popover:contains(last name)", "Please provide your last name.", "left", errors);
        }
        if (street === "") {
            pop_set("#street", ".popover:contains(street)", "Please provide the street address of the job location.", "left", errors);
        }
        if (phone === "") {
            pop_set("#phone", ".popover:contains(phone)", "Please provide a phone number.", "left", errors);
        }
        if (email === "") {
            pop_set("#email", ".popover:contains(email)", "Please provide an email address.", "left", errors);
        } else if (email.indexOf("@") === -1) {
            pop_set("#email", ".popover:contains(Invalid email)", "Invalid email address.", "left", errors);
        }
        if (zip_code === "") {
            pop_set("#zip", ".popover:contains(the zip code)", "Please provide the zip code of the job location.", "left", errors);
        } else if (isNaN(zip_code)) {
            pop_set("#zip", ".popover:contains(Invalid zip)", "Invalid zip code.", "left", errors);
        }
        if (pay === "$") {
            pop_set("#pay", ".popover:contains(pay)", "Please specify the amount of pay offered for the job.", "left", errors);
        }
        /*var fb_current_jobs = new Firebase("https://snow-project.firebaseio.com/current_jobs/" + city);
        fb_current_jobs.once("value", function(dataSnapshot) {
            dataSnapshot.forEach(function(childSnapshot) {
                if (street === (childSnapshot.child("street").val())) {
                    pop_set("#street", ".popover:contains(That location)", "That location already has a post active.", "left", errors);
                }
            });
        });*/
        setTimeout(function() {
            if (errors.length > 0) {
                for (var each in errors) {
                    $(errors[each]).popover("show");
                }
                enable_elements();
            } else {
                /*fb_current_jobs.child(street.replace(/ /g, "_")).set({
                    complete_date: "none",
                    pay: pay,
                    post_date: new Date().toString(),
                    poster: first_name + " " + last_name,
                    shoveler: "none",
                    shoveler_accept_date: "none",
                    street: street,
                    zip_code: zip_code
                });
                alert("woot");
                enable_elements();*/
            }
        }, 200);
    });
});