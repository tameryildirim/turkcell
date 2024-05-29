let validation = -1;
let captchaControl = null;
$(document).ready(function () {
    Page.Init();
});

let Page = {
    Init: function () {
        Page.Clear();
        Page.Handler();
        Utility.RefreshCaptcha();
    },
    Handler: function () {
        $(document).on("click", "#btn_cancel", function (e) {
            history.back();
        });
        $(document).on("click", "#btn_clear", function (e) {
            Page.Clear();
        });
        $(document).on("click", "#btn_save", function (e) {
            User.Register();
        });
        $(document).on("click", "#btn_test", function (e) {
            $("#span_warning").html(Utility.Randomize(parseInt($("#input_name").val()), parseInt($("#input_lastname").val())));
        });

        $(document).on("click", "#span_refreshCaptcha", function (e) {
            Utility.RefreshCaptcha();
        });
    },
    Clear: function () {
        $("body :input").val("");
        $("#input_name").focus();
        Utility.RefreshCaptcha();
    },
    ClearValidation: function () {
        $("body :input").css("border-color", "#ced4da");
        $("div").css("border-color", "#ced4da");
    }
}

let User = {
    Validate: function () {
        Page.ClearValidation();
        validation = -1;
        try {
            if ($("#input_username").val() == "") validation = 1
            else if ($("#input_phone").val() == "") validation = 2
            else if ($("#input_password").val() == "") validation = 3
            else if ($("#input_password").val() != $("#input_cpassword").val()) validation = 4;
            else if (Utility.ControlCaptcha()) validation = 5;
            return validation == -1 ? false : true;
        }
        catch (e) {
            Utility.WriteConsoleError(e.message);
        }
        finally
        {
            Utility.WriteConsoleLog("Validasyon kontrolleri yapıldı")
        }

    },
    Register: function () {
        if (User.Validate()) {
            Utility.SetError();
            return false;
        }
        let user = {
            Name: $("#input_name").val(),
            Lastname: $("#input_lastname").val(),
            Username: $("#input_username").val(),
            Phone: $("#input_phone").val(),
            Email: $("#input_email").val(),
            Password: $("#input_password").val(),
            Address: $("#input_address").val()
        };

        Utility.WriteConsoleLog(user);
        $.ajax({
            type: "POST",
            data: JSON.stringify(user),
            url: "#",
            contentType: "application.json",
            async: true
        }).done(function (res) {
            Utility.WriteConsoleLog(res);
        });

        Utility.WriteSuccess("New user infos was sent to save");
        Utility.WriteConsoleLog("New user saved!");
    }
}

let Utility = {
    WriteConsoleLog: function (log) {
        console.log(log);
    },
    WriteConsoleError: function (error) {
        console.error(error);
    },
    WriteInfo: function (info) {
        $("#span_warning").html(info).css("color", "#000");
    },
    WriteSuccess: function (info) {
        $("#span_warning").html(info).css("color", "#098E09");
    },
    WriteError: function (info) {
        $("#span_warning").html(info).css("color", "#F00");
    },
    SetError: function () {
        switch (validation) {
            case 1:
                Utility.WriteError("Username is required!");
                Utility.MakeRed([$("#div_username"), $("#input_username")]);
                break;
            case 2:
                Utility.WriteError("Phone is required!");
                Utility.MakeRed([$("#div_phone"), $("#input_phone")]);
                break;
            case 3:
                Utility.WriteError("Password is required!");
                Utility.MakeRed([$("#div_password"), $("#input_password")]);
                break;
            case 4:
                Utility.WriteError("Password confirmation is not same!");
                Utility.MakeRed([$("#div_password"), $("#input_password"), $("#div_cpassword"), $("#input_cpassword")]);
                break;
            case 5:
                Utility.WriteError("Captcha control is invalid!");
                Utility.MakeRed([$("#input_captcha")]);
                break;
            default:
                Utility.WriteSuccess("New user infos was sent to save");
                break;
        }
    },
	MakeRed: function ($elem) {
	    $($elem).each(function (index, $element) {
            $element.css("border", "1px solid #f00");
		    if ((index == 1) || ($elem.length==1)) $element.focus();
	    });
    },
    Randomize: function (startValue = 0, endValue = 10) {
        return Math.floor(Math.random() * (endValue - startValue)) + startValue;
    },
    RefreshCaptcha: function () {
        let x = Utility.Randomize();
        let y = Utility.Randomize();
        let RandomProcess = Utility.Randomize(0, 3);
        if (y > x) {
            let temp = x;
            x = y;
            y = temp;
        };
        let capctha = "  | ";
        switch (RandomProcess) {
            case 0:
                captchaControl = x + y;
                capctha += x + " + " + y;
                break;
            case 1:
                captchaControl = x - y;
                capctha += x + " - " + y;
                break;
            case 2:
                captchaControl = x * y;
                capctha += x + " * " + y;
                break;
            default:
                break;
        };
        $("#span_captcha").html(capctha);
    },
    ControlCaptcha: function () {
        let userInput = $("#input_captcha").val();
        return captchaControl == userInput ? false : true;
    }
}