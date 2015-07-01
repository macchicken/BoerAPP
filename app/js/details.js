(function () {
    var currentPhoto;

    function transferImgUrl(imgurl) {
        var lasti = imgurl.lastIndexOf(".");
        var length = imgurl.length;
        return imgurl.substring(0, lasti - 2) + imgurl.substring(lasti, length);
    }

    window.PhotoDetail = {
        show: function () {
            //Pull the id number from the query string
            var location = window.location.toString();
            var idstr = location.substring(location.lastIndexOf('?') + 4);
           
			currentPhoto=window.Photos.data.get(idstr);
            // Create a model for the page and bind it to the view
            var photo = {
                title: currentPhoto.title + " by " + currentPhoto.ownername,
                image_url: transferImgUrl(currentPhoto.url_sq),
                descriptions: currentPhoto.tags
            };
            kendo.bind($('#photoContent'), photo, kendo.mobile.ui);
            // If the current photo views is bigger than zero,toggle the switch on the view
            if (currentPhoto.views * 1 >= 1) {
                $('#favorite').data('kendoMobileSwitch').toggle();
            }
        },
        hide: function () {
			currentPhoto=null;
        },
        openLink: function () {
            // Will use the Cordova InAppBrowser plugin when deployed to a device. Opens a new window in
            // the simulator
            var or_sq=transferImgUrl(currentPhoto.url_sq);
            window.open(or_sq, '_blank', 'location=yes');
        }
    };
}());