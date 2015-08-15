(function () {
    var currentDiary;

    function transferImgUrl(imgurl) {
        var lasti = imgurl.lastIndexOf(".");
        var length = imgurl.length;
        return imgurl.substring(0, lasti - 2) + imgurl.substring(lasti, length);
    }
    window.DiaryDetail = {
        show: function () {
            //Pull the id number from the query string
            var location = window.location.toString();
            var idstr = location.substring(location.lastIndexOf('?') + 4);
           console.log(idstr);
			currentDiary=window.Diaries.queryDiary(idstr*1);
            // Create a model for the page and bind it to the view
            console.log(' DiaryDetail');
            console.log(currentDiary);
            var diary = {
                // title: currentDiary.name + " by " + currentDiary.author,
                name:currentDiary.title,
                author:currentDiary.notes,
                // image_url: transferImgUrl(currentDiary.url_sq),
                image_url: currentDiary.face_url
                // amazon_url: currentDiary.amazon_url
                // descriptions: currentDiary.tags
            };// load 
            kendo.bind($('#diaryContent'), diary, kendo.mobile.ui);
        },
        hide: function () {
			currentDiary=null;
        },
        openLink: function () {
            // Will use the Cordova InAppBrowser plugin when deployed to a device. Opens a new window in the simulator
            // var fkpage="https://www.flickr.com/photos/"+currentDiary.owner+"/"+currentDiary.id+"/";
            window.open(currentDiary.amazon_url, '_blank', 'location=yes');
        },
        cphoto: function(){
            return currentDiary;
        },
        save: function(){
            window.Diaries.updateDiary(currentDiary.id,currentDiary.title,document.getElementById("dianotes").value,currentDiary.face_url,currentDiary.diatime);
        }
    };
    
}());