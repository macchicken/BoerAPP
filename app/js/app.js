(function () {
    var app;
    var apikey = "8d3fb09eae35f2c1e056e7aee9a9cf84";
    var kw, pageNum = 0,
        searched = false;
    var fields = "tags,url_sq,owner_name,views";
    var patt1 = new RegExp("\\w+");
	var aboutOptions = {
          "direction" : "left",
          "duration"  : 500,
          "iosdelay"     : 0,
          "androiddelay" : 0,
          "winphonedelay": 0,
          "href" : "views/about.html"
     };
    
    window.Photos = {
        data: new kendo.data.DataSource({
            transport: {
                read: {
                    url: function () {
                        var keywd;
                        if (kw == null || kw === "") {
                            keywd = "apple";
                        } else {
                            keywd = kw;
                        }
                        if (pageNum < 0) {
                            pageNum = 0;
                        }
                        if (!searched) {
                            pageNum = pageNum + 1;
                        }
                        searched = false;
                        return "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + apikey + "&tags=" + keywd + "&extras=" + fields + "&per_page=10&page=" + pageNum + "&format=json&nojsoncallback=1";
                    },
                    dataType: "json"
                }
            },
            schema: {
                data: function (response) {
                    return response.photos.photo;
                }
            }
        }),
        back: function () {
            app.navigate("#:back");
        },
        settings: function () {
            app.navigate("views/settings.html");
        },
        search: function () {
            var kwt = $.trim($("#searchContent").find("#kwords").val());
            if (kwt === "") {
                navigator.notification.alert("search key words should not be empty");
                return;
            }
            if (!patt1.test(kwt)) {
                navigator.notification.alert("search key words should be only words");
                return;
            }
            var pageNumT = $("#searchContent").find("#page").val() * 1;
            if (pageNumT <= 0 || isNaN(pageNumT)) {
                navigator.notification.alert("page number should be bigger than zero.");
                return;
            }
            kw = kwt;
            pageNum = pageNumT;
            searched = true;
            app.navigate("#index");
        }
    };

    window.MyFavorites = {
        data: new kendo.data.DataSource({
            pageSize: 10,
            schema: {
                model: {
                    id: "id",
                    owner: "owner",
                    title: "title",
                    views: 0,
                    tags: "tags",
                    ownername: "ownername",
                    url_sql: "url_sql",
                    height_sq: 75,
                    width_sq: 75,
                    favorited: false
                }
            }
        }),
        show: function () {
            if (window.MyFavorites.data != undefined) {
                window.MyFavorites.data.filter({
                    field: "favorited",
                    operator: "eq",
                    value: true
                });
            }
        },
        hide: function () {
            if (window.MyFavorites.data != undefined) {
                window.MyFavorites.data.filter([]);
            }
        },
        add: function (photo, favorited) {
            var tm = this.data.get(photo.id);
            console.log(photo.id + " favorited add " + favorited);
            if (tm == null || tm == undefined) {
                this.data.add({
                    id: photo.id,
                    owner: photo.owner,
                    title: photo.title,
                    views: photo.views,
                    tags: photo.tags,
                    ownername: photo.ownername,
                    url_sq: photo.url_sq,
                    height_sq: photo.height_sq,
                    width_sq: photo.width_sq,
                    favorited: favorited
                });
            } else {
                tm.set("favorited", favorited);
            }
            this.data.sync();
        }
    };

    function idel(element) {
    	return document.getElementById(element);
	};
    function cameraApp() {};
    cameraApp.prototype = {
        pictureSource: null,

        destinationType: null,

        run: function () {
            var that = this;
            that.pictureSource = navigator.camera.PictureSourceType;
            that.destinationType = navigator.camera.DestinationType;
            idel("capturePhotoButton").addEventListener("click", function () {
                that.capturePhoto.apply(that, arguments);
            });
        },

        capturePhoto: function () {
            console.log("-capturePhoto");
            var that = this;
			navigator.camera.Direction=1;//front camera
            // Take picture using device camera and retrieve image as base64-encoded string.
            navigator.camera.getPicture(function () {
                that.onPhotoDataSuccess.apply(that, arguments);
            }, function () {
                that.onFail.apply(that, arguments);
            }, {
                quality: 50,
                destinationType: that.destinationType.DATA_URL,
                saveToPhotoAlbum: true
            });
        },

        onPhotoDataSuccess: function (imageData) {
            var smallImage = document.getElementById('smallImage');
            smallImage.style.display = 'block';
            // Show the captured photo.
            smallImage.src = "data:image/jpeg;base64," + imageData;
            console.log(smallImage.src);
            navigator.notification.vibrate(3000);
        },

        onFail: function (message) {
            console.log("error "+message);
        }
    };

    window.AppFlip={
        flip: function(){
            window.plugins.nativepagetransitions.flip(
              aboutOptions,
              function (msg) {console.log("SUCCESS: " + JSON.stringify(msg))},
              function (msg) {alert("ERROR: "   + JSON.stringify(msg))}
            );
        }
    };

    document.addEventListener("deviceready", function () {
        cameraApp = new cameraApp();
        cameraApp.run();
        navigator.splashscreen.hide();
        app = new kendo.mobile.Application(document.body, {
            layout: "main-layout"
        });
    }, false);

    window.app = app;
}());