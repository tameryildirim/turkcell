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
    }
}

let User = {
    Validate: function () {
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
            Utility.WriteError();
            return false;
        }
        let user = {

        };
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
    WriteError: function () {
        let errorMessage = null;
        switch (validation) {
            case 1:
                errorMessage = "Username is required!";
                break;
            case 2:
                errorMessage = "Phone is required!";
                break;
            case 3:
                errorMessage = "Password is required!";
                break;
            case 4:
                errorMessage = "Password are not same!";
                break;
            case 5:
                errorMessage = "Captcha is wrong!";
                Utility.RefreshCaptcha();
                break;
        }
        $("#span_warning").html(errorMessage).css("color", "#F00");
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