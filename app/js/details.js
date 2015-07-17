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
            if (currentPhoto==null||currentPhoto==undefined){
                currentPhoto=window.MyFavorites.data.get(idstr);
            }
            // Create a model for the page and bind it to the view
            var photo = {
                title: currentPhoto.title + " by " + currentPhoto.ownername,
                image_url: transferImgUrl(currentPhoto.url_sq),
                descriptions: currentPhoto.tags
            };
            // If the current photo views is bigger than zero,toggle the switch on the view
            // if (currentPhoto.views * 1 >= 1) {
            //     $('#favorite').data('kendoMobileSwitch').toggle();
            // }
            if (window.MyFavorites.data!=null&&window.MyFavorites.data!=undefined){
                var tm=window.MyFavorites.data.get(idstr);
                if(tm!=null&&tm!=undefined){
                    if (tm.favorited){
                         console.log("PhotoDetail favorited enter "+tm.favorited);
                        $('#favorite').data('kendoMobileSwitch').toggle();
                    }
                }
            }
            kendo.bind($('#photoContent'), photo, kendo.mobile.ui);
        },
        hide: function () {
			currentPhoto=null;
        },
        openLink: function () {
            // Will use the Cordova InAppBrowser plugin when deployed to a device. Opens a new window in the simulator
            var fkpage="https://www.flickr.com/photos/"+currentPhoto.owner+"/"+currentPhoto.id+"/";
            window.open(fkpage, '_blank', 'location=yes');
        },
        cphoto: function(){
            return currentPhoto;
        }
    };
    
}());