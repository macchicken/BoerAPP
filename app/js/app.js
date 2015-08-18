(function () {
    var app;
    var db;
    var apikey = "8d3fb09eae35f2c1e056e7aee9a9cf84";
    var kw, pageNum = 0,
        searched = false;
    var fields = "tags,url_sq,owner_name,views";
    var patt1 = new RegExp("\\w+");
    var slibOptions = {
        "direction": "left", // 'left|right|up|down', default 'right' (Android currently only supports left and right)
        "duration": 600, // in milliseconds (ms), default 400
        "iosdelay": 50, // ms to wait for the iOS webview to update before animation kicks in, default 60
        "androiddelay": 100, // same as above but for Android, default 70
        "winphonedelay": 150, // same as above but for Windows Phone, default 200
    };
    var currLatitude, currLongitude, todayWeather, savedColour;
    var isbno=0, savedDiatime;
    var today = new Date();

    function idel(element) {
        return document.getElementById(element);
    }

    function getTimeStr(dtime) {
        return dtime.getFullYear().toString() +'-'+ (dtime.getMonth() + 1).toString() +'-'+ dtime.getDate().toString() +'-'+ dtime.getHours().toString() +'-'+ dtime.getMinutes().toString()+'-'+dtime.getDay();
    }

    window.BoaerTools = {
        atagpress: function (element) {
            console.log(" atagpress delete ");
            console.log(element);
            navigator.notification.confirm(
            'delete this diary?',  // message
            function(buttonIndex){// callback to invoke with index of button pressed
                        if (buttonIndex==1){
                            var delid=element.nextElementSibling.value;console.log('delid '+delid);
                            deleteTodo(delid);
                        }
                    },                
            null,            // title
            ['OK','Cancel']          // buttonLabels
            );
        }
    };

    function openDb() {
        var dbName = "Diaries.sqlite";
        if (window.navigator.simulator === true) {
            // For debugin in simulator fallback to native SQL Lite
            console.log("Use built in SQL Lite");
            db = window.openDatabase(dbName, "1.0", "Diaries", 200000);
        } else {
            db = window.sqlitePlugin.openDatabase(dbName);
        }
    }

    function onError(tx, e) {
        console.log("Error: " + e.message);
        // alert("Error: " + e.message);
    }

    function refresh(diatime,refreshid) {
        console.log('refresh ' + diatime);
        var diariesrow = function (row) {
            console.log(row);
            var temp=row.CREATEDTIME.split('-');
            return "<li><table border='0'><tr><th><a href='views/details.html?id="+row.ID+"' class='km-listview-link' data-role='listview-link'>" + temp[0]+"/"+temp[1]+"/"+temp[2]+"&nbsp"+temp[3] + "H&nbsp&nbsp&nbsp"+transferDayToEnglish(temp[5]*1)+"</a></th><th><img src='" + row.FACE_URL + "' height='42' width='42' onclick='BoaerTools.atagpress(this);'><input hidden type='text' value='"+row.ID+"'/></th></tr><tr><td>" + row.TITLE + "</td></tr></table></li>";
        }

        var render = function (tx, rs) {
            var rowOutput = "";
            var diariesdata = idel("DiariesData");
            for (var i = 0; i < rs.rows.length; i++) {
                var t = rs.rows.item(i);
                console.log("render " + t.ID);
                if (refreshid==t.ID){
                    console.log("refresh "+t.ID);
                    window.Diaries.data.get(t.ID).set("notes",t.NOTES);
                }else{
                    console.log("add "+t.ID);
                	window.Diaries.data.add({id: t.ID,title: t.TITLE,notes: t.NOTES,face_url: t.FACE_URL,diatime: t.DIATIME,createdTime: t.CREATEDTIME});    
                }
                rowOutput += diariesrow(t);
            }
            diariesdata.innerHTML = rowOutput;
        }

        db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM diaries where DIATIME=?", [diatime], render, onError);
        });
    }

    function onSuccess(tx, r) {
        console.log('onSuccess ' + savedDiatime);
        refresh(savedDiatime,-1);
    }

    function initData() {
        var thisMonth = (today.getMonth() + 1).toString() + today.getFullYear().toString();
        db.transaction(function (tx) {
            console.log("initial data insertion");
            addTodo("100", "JavaScript: The Good Parts", "Douglas Crockford", "img/minions/pic-1.jpg", thisMonth);
            addTodo("102", "javaScript: The Definitive Guide", "David Flanagan", "img/minions/pic-2.jpg", thisMonth);
            addTodo("103", "The Principles of Object-Oriented JavaScript", "Nicholas C. Zakas", "img/minions/pic-3.jpg", thisMonth);
            addTodo("104", "Eloquent JavaScript: A Modern Introduction to Programming", "Marijn Haverbeke", "img/minions/pic-4.jpg", thisMonth);
            addTodo("105", "Speaking JavaScript", "Axel Rauschmayer", "img/minions/pic-5.jpg", thisMonth);
            addTodo("106", "jQuery UI in Action", "T.J. VanToll", "img/minions/pic-6.jpg", thisMonth);
            addTodo("107", "JavaScript and JQuery: Interactive Front-End Web Development", "Joe Duckett", "img/minions/pic-3.jpg", thisMonth);
            thisMonth = (today.getMonth() + 2).toString() + today.getFullYear().toString();
            addTodo("108", "JavaScript: The Good Parts", "Douglas Crockford", "img/minions/pic-1.jpg", thisMonth);
            addTodo("109", "javaScript: The Definitive Guide", "David Flanagan", "img/minions/pic-2.jpg", thisMonth);
            addTodo("110", "The Principles of Object-Oriented JavaScript", "Nicholas C. Zakas", "img/minions/pic-3.jpg", thisMonth);
            addTodo("111", "Eloquent JavaScript: A Modern Introduction to Programming", "Marijn Haverbeke", "img/minions/pic-4.jpg", thisMonth);
            addTodo("112", "Speaking JavaScript", "Axel Rauschmayer", "img/minions/pic-5.jpg", thisMonth);
            addTodo("113", "jQuery UI in Action", "T.J. VanToll", "img/minions/pic-6.jpg", thisMonth);
            addTodo("114", "JavaScript and JQuery: Interactive Front-End Web Development", "Joe Duckett", "img/minions/pic-3.jpg", thisMonth);
        });
    }

    function createTable() {
        db.transaction(function (tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS diaries(ID TEXT,TITLE TEXT,NOTES TEXT,FACE_URL TEXT,DIATIME TEXT,CREATEDTIME TEXT,UPDATEDTIME TEXT)",[],function(tx,tr){},onError);
            // tx.executeSql("drop table diaries");
        });
    }

    function addTodo(id, titletext, notestext, faceUrl, diatime) {
        db.transaction(function (tx) {
            console.log('addto ' + diatime);
            savedDiatime = diatime;
            var timeStr = getTimeStr(new Date());
            tx.executeSql("INSERT INTO diaries(ID, TITLE, NOTES, FACE_URL, DIATIME, CREATEDTIME, UPDATEDTIME) VALUES (?,?,?,?,?,?,?)", [id, titletext, notestext, faceUrl, diatime, timeStr, timeStr], onSuccess, onError);
        });
    }

    function updateTodo(id, titletext, notestext, faceUrl, diatime) {
        db.transaction(function (tx) {
            console.log('updateTodo ' + id);
            var timeStr = getTimeStr(new Date());
            tx.executeSql("UPDATE diaries set NOTES=?,UPDATEDTIME=? where ID=?", [notestext, timeStr, id], function(tx,r){}, onError);
        });
    }

    function deleteTodo(id) {
        db.transaction(function (tx) {
            tx.executeSql("DELETE FROM diaries WHERE ID=?", [id], onSuccess, onError);
        });
    }

    function toPage(pageView) {
        slibOptions.href = pageView;
        window.plugins.nativepagetransitions.slide(
            slibOptions,
            function (msg) {
                console.log("success: " + msg)
            },
            function (msg) {
                console.log("error: " + msg)
            }
        );
    }

    function transferToEnglish(intMonth) {
        switch (intMonth) {
            case 0:
                return 'Jan';
                break;
            case 1:
                return 'Feb';
                break;
            case 2:
                return 'Mar';
                break;
            case 3:
                return 'Apr';
                break;
            case 4:
                return 'May';
                break;
            case 5:
                return 'June';
                break;
            case 6:
                return 'July';
                break;
            case 7:
                return 'August';
                break;
            case 8:
                return 'Sep';
                break;
            case 9:
                return 'October';
                break;
            case 10:
                return 'Nov';
                break;
            case 11:
                return 'Dec';
                break;
            default:
                return 'Opps';
                break;
        }
    };

    function transferDayToEnglish(intDay) {
        switch (intDay) {
            case 1:
                return 'Monday';
                break;
            case 2:
                return 'Tuesday';
                break;
            case 3:
                return 'Wednesday';
                break;
            case 4:
                return 'Thursday';
                break;
            case 5:
                return 'Friday';
                break;
            case 6:
                return 'Saturday';
                break;
            case 0:
                return 'Sunday';
                break;
            default:
                return 'Opps';
                break;
        }
    };

    window.Diaries = {
        data: new kendo.data.DataSource({
            // transport: {
            //     read: {
            //         // url: function () {
            //         //     var keywd;
            //         //     if (kw == null || kw === "") {
            //         //         keywd = "apple";
            //         //     } else {
            //         //         keywd = kw;
            //         //     }
            //         //     if (pageNum < 0) {
            //         //         pageNum = 0;
            //         //     }
            //         //     if (!searched) {
            //         //         pageNum = pageNum + 1;
            //         //     }
            //         //     searched = false;
            //         //     return "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + apikey + "&tags=" + keywd + "&extras=" + fields + "&per_page=10&page=" + pageNum + "&format=json&nojsoncallback=1";
            //         // },
            //         url: "data/books.js",
            //         type: "get",
            //         dataType: "json"
            //     }
            // },
            // schema: {
            //     // data: function (response) {
            //     //     return response.photos.photo;
            //     // }
            //     data: "books"
            // }
            data: []
        }),
        back: function () {
            app.navigate("#:back");
        },
        initMood: function () {
            navigator.geolocation.getCurrentPosition(function (position) {
                currLatitude = position.coords.latitude;
                currLongitude = position.coords.longitude;
                console.log(currLatitude + ',' + currLongitude)
            }, function (error) {
                console.log('code: ' + error.code + ' ' + 'message: ' + error.message);
            });
            $.ajax({
                url: "http://api.openweathermap.org/data/2.5/weather?lat=" + currLatitude + "&lon=" + currLongitude + "&APPID=6e2c6de718a5f98d2ca2a48f9d38c86b",
                success: function (result) {
                    console.log(result);
                    todayWeather = result.weather[0];
                    console.log(todayWeather);
                    idel("diaryToday").innerHTML = today.getDate() + ' ' + transferToEnglish(today.getMonth()) + ' ' + today.getFullYear() + " with " + todayWeather.description;
                }
            });
        },
        queryDiary: function (id) {
            console.log('queryDiary');
            return this.data.get(id);
        },
        save: function () {
            var moodImage = idel("moodImage");
            // this.data.add({
            //     id: isbno,
            //     name: d.getDate() + ' ' + transferToEnglish(d.getMonth()) + ' ' + d.getFullYear() + " with " + todayWeather.description,
            //     author: idel("diaryNotes").value,
            //     isbn: isbno.toString(),
            //     amazon_url: "",
            //     image_url: moodImage.src,
            //     is_favorite: false
            // });
            var tdiatime = (today.getMonth() + 1).toString() + today.getFullYear().toString();
            var faceurl=moodImage.src;
            if (faceurl===""){
                faceurl="img/minions/pic-1.jpg";
            }
            addTodo(UUID.genV1().toString(), today.getDate() + ' ' + transferToEnglish(today.getMonth()) + ' ' + today.getFullYear() + " with " + todayWeather.description, idel("diaryNotes").value, faceurl, tdiatime);
            console.log("diary saved");
            idel("diaryNotes").value = '';
            moodImage.style.display = 'none';
            // app.navigate("#:back");
            window.location.href = "#index";
        },
        todayDiary: function () {
            // toPage("#todayDiary");
            window.location.href = "#todayDiary";
        },
        updateDiary: function (id, title, notes, faceUrl, tdiatime) {
            console.log('updateDiary '+id+' notes '+notes);
            updateTodo(id, title, notes, faceUrl, tdiatime);
            app.navigate("#:back");
            refresh(savedDiatime,id);
        },
        toDiaries: function(){
            var diariesTime=idel("diaryCTime").value;
            var temp=diariesTime.split('-');
            if (temp[1].indexOf("0")!=0){
                diariesTime=temp[1]+temp[0];
            }else{
                diariesTime=temp[1].slice(1)+temp[0];
            }
            console.log(" toDiaries "+diariesTime);
            this.data = new kendo.data.DataSource({
                data: []
            });
            refresh(diariesTime,-1);
            window.location.href = "#index";
        },
        appexit: function(){
            console.log('exitApp');
            navigator.app.exitApp();
        }

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
                // that.capturePhoto.apply(that, arguments);
                that.getPhoto(that.pictureSource.SAVEDPHOTOALBUM, arguments);
            });
        },

        capturePhoto: function () {
            console.log("-capturePhoto");
            var that = this;
            navigator.camera.Direction = 1; //front camera
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
            var moodImage = document.getElementById('moodImage');
            moodImage.style.display = 'block';
            // Show the captured photo.
            // moodImage.src = "data:image/jpeg;base64," + imageData;
            console.log(moodImage.src);
            // navigator.notification.vibrate(3000);
        },

        onFail: function (message) {
            console.log("error " + message);
        },

        getPhoto: function (source, arguments) {
            var that = this;
            // Retrieve image file location from specified source.
            navigator.camera.getPicture(function () {
                that.onPhotoDataSuccess.apply(that, arguments);
            }, function () {
                cameraApp.onFail.apply(that, arguments);
            }, {
                quality: 50,
                destinationType: cameraApp.destinationType.FILE_URI,
                sourceType: source
            });
        }
    };


    document.addEventListener("deviceready", function () {
        var month = today.getMonth();
        var year = today.getFullYear();
        // $(idel("index")).attr("data-title", transferToEnglish(month) + ' ' + year);
        idel("indexHeaer").innerHTML = transferToEnglish(month) + ' ' + year;
        cameraApp = new cameraApp();
        cameraApp.run();
        navigator.splashscreen.hide();
        app = new kendo.mobile.Application(document.body, {});
        openDb();
        createTable();
        // initData();
        refresh((month + 1).toString() + year.toString(),-1);
        savedDiatime=(month + 1).toString() + year.toString();
        if (month<=8){
            month='0'+(month+1).toString();
        }
        var day=today.getDate().toString();
        if (day<=9){
            day='0'+day;
        }
        idel("diaryCTime").value=year.toString()+'-'+month+'-'+day;
    }, false);
    document.addEventListener("touchstart", function(){}, false);
    document.addEventListener("backbutton",function(){},false);
    document.addEventListener("menubutton", function(){return false;}, false);


    window.app = app;
    
}());