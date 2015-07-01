(function () {
    var app;

    window.Photos = {
        data: new kendo.data.DataSource({
            transport: {
                read: {
                    url: "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=8d3fb09eae35f2c1e056e7aee9a9cf84&tags=apple&extras=tags,url_sq,owner_name,views&per_page=10&page=1&format=json&nojsoncallback=1",
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
        }
    };

    document.addEventListener("deviceready", function () {
        navigator.splashscreen.hide();

        app = new kendo.mobile.Application(document.body, {
            layout: "main-layout"
        });
    }, false);

    window.app = app;
}());