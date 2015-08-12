(function () {
    var options = {
        "direction": "left", // 'left|right|up|down', default 'right' (Android currently only supports left and right)
        "duration": 600, // in milliseconds (ms), default 400
        "iosdelay": 50, // ms to wait for the iOS webview to update before animation kicks in, default 60
        "androiddelay": 100, // same as above but for Android, default 70
        "winphonedelay": 150, // same as above but for Windows Phone, default 200
    };
    function toPage(pageView){
        options.href=pageView;
		window.plugins.nativepagetransitions.slide(
                options,
                function (msg) {
                    console.log("success: " + msg)
                }, // called when the animation has finished
                function (msg) {
                    console.log("error: " + msg)
                } // called in case you pass in weird values
            );        
    }

    window.loginView = kendo.observable({
        submit: function () {
            if (!this.username) {
                navigator.notification.alert("Username is required.");
                return;
            }
            if (!this.password) {
                navigator.notification.alert("Password is required.");
                return;
            }
            // call validate user api if success redirect to index
        },
        toRegis: function () {
           	toPage("#register");
            // window.location.href="#register";
        },
        toAnonymous: function () {
            toPage("#index");
            // window.location.href="#index";
        }
    });
    window.registerView = kendo.observable({
        submit: function () {
            if (!this.username) {
                navigator.notification.alert("Username is required.");
                return;
            }
            if (!this.password) {
                navigator.notification.alert("Password is required.");
                return;
            }
            // call user registration api if success redirect to index
        }
    });
}());