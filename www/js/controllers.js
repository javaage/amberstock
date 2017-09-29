angular.module('starter.controllers', ['ngTable'])
    .controller('AppCtrl', function ($rootScope,$scope, $ionicModal, $timeout, $http, $interval, NgTableParams, $location, $cordovaLocalNotification) {
        Highcharts.setOptions({ global: { useUTC: false } });
        var dailyUrlTmp = "https://image.sinajs.cn/newchart/daily/n/sh600000.gif";
        var miniteUrlTmp = "https://image.sinajs.cn/newchart/min/n/sh600000.gif";
        var maxImgWidth = document.body.clientWidth * 0.9;
        $scope.ting = {};
        $scope.location = $location;

        $scope.socketUrl = '';

        var socket;
        if($scope.player)
            $scope.player.pause();

        $scope.notify = function(title,message) {
            if($scope.player)
                $scope.player.pause();
            isPlay = true;
            $scope.player = document.getElementById('buymp3');
            $scope.player.play();  

          var alarmTime = new Date();
          alarmTime.setSeconds(alarmTime.getSeconds() + 1);
          $cordovaLocalNotification.add({
            id: "1234",
            date: alarmTime,
            message: message,
            title: title,
            autoCancel: true,
            sound: "file://system/media/audio/notifications/Default.ogg"
          }).then(function () {
            alert("The notification has been set");
            console.log("The notification has been set");
          });
        };

        $scope.isScheduled = function() {
          $cordovaLocalNotification.isScheduled("1234").then(function(isScheduled) {
            alert("Notification 1234 Scheduled: " + isScheduled);
          });
        };

        $scope.initWebSocket = function(){
          if (window.WebSocket) {
            if (socket == null || socket.readyState !== 1) {
                socket = new WebSocket($scope.socketUrl);
                socket.onmessage = function(event) { 
                  console.log(event.data);

                  var title = '';
                  var message = '';

                  var body = eval('(' + event.data + ')');

                  if(body.title){
                    title = body.title;
                  }

                  if(body.message){
                    message = body.message;
                  }

                  $scope.notify(title,message);
                }; 

                socket.onclose = function(event) { 
                  console.log(event);
                }; 
                
                socket.onopen = function(event) { 
                    console.log(event);
                }; 
                socket.onerror =function(event){
                  alert("web socket 出错。");
                };
            }  
          } else {
            alert("你的浏览器不支持web socket.");
          }
        };

        $scope.send = function(message) {
            $scope.initWebSocket();
            socket.send(message);
        };

        $scope.getSocketUrl = function(){
            $http.get('https://ichess.sinaapp.com/ext/channel.php')//('https://ichess.sinaapp.com/ext/channel.php')
            .success(function (data) {
                $scope.socketUrl = data;
                $scope.initWebSocket();
                $interval(function (){ 
                    $scope.initWebSocket();   
                }, 10000);
            });
        };

        var addGif = function () {
            $("table.table tr").each(function () {
                var td = $("<td></td>");
                $(this).append(td);
                var url = gifUrl.replace("sh600000", $(this).find("td:first").text().toLowerCase());
                var img = new Image();
                img.onload = function () {
                    td.append(img);
                };
                img.src = url;
            });
        };

        $scope.getTing = function(){
            $http.get('https://ichess.sinaapp.com/daily/ting20.php')
            .success(function(data){
                $scope.ting=data;
            });
        };

        $scope.reload = function(){
            location.reload();
        }

        // Form data for the login modal
        $scope.loginData = {};
        $scope.player = null;

        $scope.getTing();

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/detail-modal.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function () {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.login = function () {
            $scope.modal.show();
        };

        // Perform the login action when the user submits the login form
        $scope.doLogin = function () {
            console.log('Doing login', $scope.loginData);

            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function () {
                $scope.closeLogin();
            }, 1000);
        };

        $scope.addAttend = function(code){

            var urlAdd = "https://ichess.sinaapp.com/attend.php?a=a&c=" + code;
            $http.get(urlAdd)
                .success(function (data) {
                    $scope.getCounter($scope.url);
                });
        };

        $scope.deleteAttend = function(code){
            var urlDetete = "https://ichess.sinaapp.com/attend.php?a=d&c=" + code;
            $http.get(urlDetete)
                .success(function (data) {
                    $scope.getCounter($scope.url);
                });
        };

        $scope.openModal = function (code) {
            $scope.code = code.toLowerCase();
            code = code.toLowerCase();
            $scope.modal.show();
            $("#prefBuy").text("");
            $("#prefSell").text("");
            $("#current").text("");
            $("#high").text("");
            $("#low").text("");
            $("#divMinite").empty();
            $("#divDaily").empty();

            if(code=='sz399001'){
                var url = 'https://ichess.sinaapp.com/prefindex.php?code=' + code;
            }else{
                var url = 'https://ichess.sinaapp.com/prefprice.php?code=' + code
            }

            $http.post(url)
                .success(function (data) {
                    console.log(data);
                    $("#prefBuy").text(data.prefBuy);
                    $("#prefSell").text(data.prefSell);
                    $("#current").text(data.current);
                    $("#high").text(data.high);
                    $("#low").text(data.low);
                    $("#price").text(data.price4 + ' ' + data.price3)
                    dailyUrl = dailyUrlTmp.replace("sh600000", code) + "?t=" + Math.random();
                    miniteUrl = miniteUrlTmp.replace("sh600000", code) + "?t=" + Math.random();

                    var imgMinite = new Image();
                    imgMinite.onload = function () {
                        if (imgMinite.width > maxImgWidth) {
                            imgMinite.width = maxImgWidth;
                            imgMinite.height = imgMinite.height * maxImgWidth / imgMinite.width;
                        }
                        $("#divMinite").append(imgMinite);
                    };
                    imgMinite.src = miniteUrl;

                    var imgDaily = new Image();
                    imgDaily.onload = function () {
                        if (imgDaily.width > maxImgWidth) {
                            imgDaily.width = maxImgWidth;
                            imgDaily.height = imgDaily.height * maxImgWidth / imgDaily.width;
                        }
                        $("#divDaily").append(imgDaily);
                    };
                    imgDaily.src = dailyUrl;
                });
        };
        $scope.closeModal = function () {
            $scope.modal.hide();
            console.log(window.location.href);
            if(window.location.href.indexOf('app/my/attend')>0)
                $scope.getCounter($scope.url);
                //window.location.reload();
        };

        $scope.getCounter = function (url,scope) {
            $scope.url = url;

            $http.get(url)
                .success(function (data) {
                    console.log(data);

                    if(url.indexOf('actionList')>=0){
                        var frequency = [];

                        for(var index = data.length-1; index>=0; index--){
                            var item = data[index];
                            var names = item.pref.split(',');
                            var codes = item.pref1.split(',');
                            var arr = [];

                            for(var i in names){
                                frequency[codes[i]] = frequency[codes[i]]? ++frequency[codes[i]] : 1;
                            }

                            for(var i in names){
                                arr[i] = [names[i],codes[i],frequency[codes[i]]];
                            }
                            arr = arr.sort(function(a,b){
                                return b[2]-a[2];
                            });
                            item.pref = arr;
                        }
                    }
                    
                    for(var i = 0; i < data.length; i++){
                        var item = data[i];
                        if(item.rate){
                            item.rate = parseFloat(item.rate);
                        }
                        if(item.increase){
                            item.increase = parseFloat(item.increase);
                        }
                        if(item.a){
                            item.a = parseFloat(item.a);
                        }
                        if(item.trans){
                            item.trans = parseFloat(item.trans);
                        }
                        if(item.signal){
                            item.signal = parseInt(item.signal);
                        }
                        if(item.current){
                            item.current = parseFloat(item.current);
                        }
                        if(item.level){
                            item.level = parseFloat(item.level);
                        }
                        if(item.price){
                            item.price = parseFloat(item.price);
                        }
                    }

                    $scope.tableParams = new NgTableParams(
                        {
                            page: 1,            // show first page
                            count: 10,           // count per page
                            sorting: { r: 'desc', rate: 'asc', a: 'desc' ,buy: 'desc'}
                        },
                        {
                            total: 0, // length of data
                            dataset: data
                        });
                })
                .finally(function() {
                    $scope.$broadcast('scroll.refreshComplete');
                });
        };

        //$scope.getSocketUrl();

        var locationChangeStart = function(){
            if($rootScope.loop){
                $interval.cancel($rootScope.loop);
                $rootScope.loop = null;
            }
        };

        $rootScope.$on('$locationChangeStart', locationChangeStart);        
    })
    .controller('CalCtrl', function ($rootScope,$scope, $http, $ionicModal,$cordovaLocalNotification, NgTableParams) {

        $scope.add = function() {
            if($scope.player)
                $scope.player.pause();
            isPlay = true;
            $scope.player = document.getElementById('buymp3');
            $scope.player.play();    

          var alarmTime = new Date();
          alarmTime.setSeconds(alarmTime.getSeconds() + 1);
          $cordovaLocalNotification.add({
            id: "1234",
            date: alarmTime,
            message: "This is a message",
            title: "This is a title",
            autoCancel: true,
            sound: "file://system/media/audio/notifications/Default.ogg"
          }).then(function () {
            alert("The notification has been set");
            console.log("The notification has been set");
          });
        };
        $scope.isScheduled = function() {
          $cordovaLocalNotification.isScheduled("1234").then(function(isScheduled) {
            alert("Notification 1234 Scheduled: " + isScheduled);
          });
        };

        $scope.levels = [5, 6, 7, 8, 9, 10, 11];

        $scope.changeLevel = function (level) {
            calindex(level);
        };

        function createChart(data) {
            $('#container').highcharts('StockChart', {
                rangeSelector: {
                    selected: 1
                },
                title: {
                    text: null
                },
                navigator: {
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                scrollbar: {
                    enabled: false
                },
                series: [{
                    name: 'real',
                    data: data.reals,
                    tooltip: {
                        valueDecimals: 2
                    }
                }, {
                    name: 'cal',
                    data: data.cals,
                    tooltip: {
                        valueDecimals: 2
                    }
                }]
            });
        }

        function calindex(n) {
            $http.get('https://ichess.sinaapp.com/calindex.php?n=' + n)
                .success(function (data) {
                    console.log(data);
                    createChart(data);
                });
        }

       calindex(5);

    })
    .controller('ActionCtrl', function ($rootScope,$scope, $http, $ionicModal, NgTableParams) {
        $scope.action=[];
        $scope.action[0] = 'Pre Sell';
        $scope.action[1] = 'Sell';
        $scope.action[2] = 'Pre Buy';
        $scope.action[3] = 'Buy';

        $scope.url = "https://ichess.sinaapp.com/actionList.php";
        $scope.getCounter($scope.url,$scope);
    })
    .controller('ShortCtrl', function ($rootScope,$scope, $http, $ionicModal, NgTableParams, $location) {
        var id = $location.search().id? $location.search().id : '';

        $scope.q = {};
        $scope.loadShort = function(id){
            $scope.url = "https://ichess.sinaapp.com/actionDetail.php?id=" + id;
            $scope.getCounter($scope.url,$scope);
        };

        $scope.changeTime = function(id){
            $scope.url = "https://ichess.sinaapp.com/actionDetail.php?id=" + id;
            $scope.getCounter($scope.url,$scope);
        };

        var urlTime = "https://ichess.sinaapp.com/actionDetail.php?t=1";
        $http.get(urlTime)
            .success(function(data){
                if(data.length>0){
                    $scope.times=data;
                    if(id > 0){
                        $scope.q.id = id;
                    }else{
                        $scope.q.id = $scope.times[0].id;
                    }
                    
                    $scope.loadShort(id);
                }else{
                    $scope.times = [];
                }
        });

    }).controller('OtherCtrl', function ($rootScope,$scope, $http, $ionicModal, NgTableParams) {
        
    }).controller('InspectCtrl', function ($rootScope,$scope, $http, $ionicModal, NgTableParams) {
        $scope.search = {};
        $scope.q = {};
        $scope.types = ["val", "rate"];
        $scope.opts = [">", "<"];
        
        $scope.searchStock = function(q){
            if(q.trim()==''){
                $scope.searchStocks=[];
                return;
            }
            var urlSearch = "https://ichess.sinaapp.com/searchStock.php?q=" + q;
            $http.get(urlSearch)
                .success(function (data) {
                    $scope.searchStocks = data;
                });
        };

        $scope.selectCode = function(item){
            $scope.q.stock.code = item.code;
            $scope.q.stock.name = item.name;
            $scope.searchStocks = [];
        };

        $scope.addInspect = function(q){
            var data = {
                a: "a",
                code: $scope.q.stock.code,
                name: $scope.q.stock.name,
                type: $scope.q.type,
                opt: $scope.q.opt,
                value: $scope.q.value
            };
             var urlAdd = "https://ichess.sinaapp.com/inspect.php?" + $.param(data);
             $http.get(urlAdd)
                .success(function (data) {
                    $scope.loadInspect();
                    console.log(data);
                });
        };

        $scope.deleteInspect = function(id){
            var data = {
                a: "d",
                id: id
            };
            var urlDelete = "https://ichess.sinaapp.com/inspect.php?" + $.param(data);
            $http.get(urlDelete)
                .success(function (data) {
                    $scope.loadInspect();
                    console.log(data);
                });
        };

        $scope.loadInspect = function(){
            $scope.url = "https://ichess.sinaapp.com/inspect.php";
            $scope.getCounter($scope.url,$scope);
        };

        $scope.loadInspect();
    }).controller('DailyCtrl', function ($rootScope,$scope, $http, $ionicModal, NgTableParams) {
        $scope.url = "https://ichess.sinaapp.com/daily/analysis.php";
        $scope.getCounter($scope.url,$scope);
    }).controller('WaveCtrl', function ($rootScope,$scope, $http, $ionicModal, NgTableParams) {

        $scope.url = "https://ichess.sinaapp.com/rate.php";
        $scope.getCounter($scope.url,$scope);

    }).controller('AscendCtrl', function ($rootScope,$scope, $http, $ionicModal, NgTableParams) {

        $scope.url = "https://ichess.sinaapp.com/daily/ascend.php";
        $scope.getCounter($scope.url,$scope);

    }).controller('SignalCtrl', function ($rootScope,$scope, $http, $ionicModal, NgTableParams) {

        $scope.url = "https://ichess.sinaapp.com/pref.php";
        $scope.getCounter($scope.url,$scope);

    }).controller('TabCtrl', function ($rootScope,$scope, $http, $ionicModal, NgTableParams) {
        $scope.q = {};
        var urlTime = "https://ichess.sinaapp.com/gethistory.php";
        $http.get(urlTime)
            .success(function(data){
                if(data.length>0){
                    $scope.times=data;
                    $scope.q.t = $scope.times[0];
                }else{
                    $scope.times = [];
                }
        });

        $scope.changeTab = function(trans){
            $scope.url = "https://ichess.sinaapp.com/" + trans + ".php";
            $scope.getCounter($scope.url,$scope);
        };

    }).controller('RateCtrl', function ($rootScope,$scope, $http, $ionicModal, NgTableParams) {
        
        $scope.changeTime = function(t){
            $scope.url = "https://ichess.sinaapp.com/rate.php?t=" + t;
            $scope.getCounter($scope.url,$scope);
        };
        //$scope.changeTime('');
    }).controller('TransCtrl', function ($rootScope,$scope, $http, $ionicModal, NgTableParams) {
        
        $scope.changeTime = function(t){
            $scope.url = "https://ichess.sinaapp.com/trans.php?t=" + t;
            $scope.getCounter($scope.url,$scope);
        };
        //$scope.changeTime('');
    }).controller('BktransCtrl', function ($rootScope,$scope, $http, $ionicModal, NgTableParams) {
        $scope.changeTime = function(t){
            $scope.url = "https://ichess.sinaapp.com/bktrans.php?t=" + t;
            $scope.getCounter($scope.url,$scope);
        };
        //$scope.changeTime('');
    }).controller('CtransCtrl', function ($rootScope,$scope, $http, $ionicModal, NgTableParams) {
        $scope.changeTime = function(t){
            $scope.url = "https://ichess.sinaapp.com/ctrans.php?t=" + t;
            $scope.getCounter($scope.url,$scope);
        };
    }).controller('MyCtrl', function ($rootScope,$scope, $http, $ionicModal, NgTableParams, $interval, $state) {
        var inArray = function( elem, array ) {
            if ( array.indexOf ) {
                return array.indexOf( elem );
            }

            for ( var i = 0, length = array.length; i < length; i++ ) {
                if ( array[ i ] === elem ) {
                    return i;
                }
            }

            return -1;
        };

        $scope.changeTab = function(trans){
            switch(trans)
            {
            case 'holder':
                break;
            case 'attend':

                break;
            case 'weak':
                
                break;
            case 'waveHolder':
                
                break;
            case 'waveAttend':
                
                break;
            default:
                console.log('default');
            }
        };

    }).controller('HolderCtrl', function ($rootScope,$scope, $http, $ionicModal, NgTableParams) {
        $scope.search = {};
        $scope.url = "https://ichess.sinaapp.com/holder.php";
        $scope.getCounter($scope.url,$scope);
        
        $scope.searchStock = function(q){
            if(q.trim()==''){
                $scope.searchStocks=[];
                return;
            }
            var urlSearch = "https://ichess.sinaapp.com/searchStock.php?q=" + q;
            $http.get(urlSearch)
                .success(function (data) {
                    $scope.searchStocks = data;
                });
        };

        $scope.selectCode = function(code){
            $scope.search.sc = code;
            $scope.searchStocks = [];
        };

        $scope.addHolder = function(code){

            var urlAdd = "https://ichess.sinaapp.com/holder.php?a=a&c=" + code;
            $http.get(urlAdd)
                .success(function (data) {
                    $scope.getCounter($scope.url,$scope);
                });
        };
        $scope.deleteHolder = function(code){
            var urlDetete = "https://ichess.sinaapp.com/holder.php?a=d&c=" + code;
            $http.get(urlDetete)
                .success(function (data) {
                    $scope.getCounter($scope.url,$scope);
                    alert('delete successfully.');
            });
        };
    }).controller('AttendCtrl', function ($rootScope,$scope, $http, $ionicModal, NgTableParams) {
        
        $scope.search = {};

        $scope.url = "https://ichess.sinaapp.com/attend.php";
        $scope.getCounter($scope.url,$scope);
        
        $scope.searchStock = function(q){
            if(q.trim()==''){
                $scope.searchStocks=[];
                return;
            }
            var urlSearch = "https://ichess.sinaapp.com/searchStock.php?q=" + q;
            $http.get(urlSearch)
                .success(function (data) {
                    $scope.searchStocks = data;
                });
        };

        $scope.selectCode = function(code){
            $scope.search.sc = code;
            $scope.searchStocks = [];
        };

        $scope.addAttend = function(code){

            var urlAdd = "https://ichess.sinaapp.com/attend.php?a=a&c=" + code;
            $http.get(urlAdd)
                .success(function (data) {
                    $scope.getCounter($scope.url,$scope);
                });
        };

        $scope.deleteAll = function(){

            var urlAdd = "https://ichess.sinaapp.com/attend.php?a=d";
            $http.get(urlAdd)
                .success(function (data) {
                    $scope.getCounter($scope.url,$scope);
                });
        };
        $scope.deleteAttend = function(code){
            var urlDetete = "https://ichess.sinaapp.com/attend.php?a=d&c=" + code;
            $http.get(urlDetete)
                .success(function (data) {
                    $scope.getCounter($scope.url,$scope);
                    alert('delete successfully.');
                });
        };

        $scope.updateAttend = function(data){
            $rootScope.attendList = [];
            angular.forEach(data, function (item, index) {
                var i = 5;
                if(item.checked){
                    $rootScope.attendList.push(item);
                }
            });
        };
    }).controller('WeakCtrl', function ($rootScope,$scope, $http, $ionicModal, NgTableParams) {
        $scope.search = {};

        $scope.url = "https://ichess.sinaapp.com/weak.php";
        $scope.getCounter($scope.url,$scope);
        
        $scope.searchStock = function(q){
            if(q.trim()==''){
                $scope.searchStocks=[];
                return;
            }
            var urlSearch = "https://ichess.sinaapp.com/searchStock.php?q=" + q;
            $http.get(urlSearch)
                .success(function (data) {
                    $scope.searchStocks = data;
                });
        };

        $scope.selectCode = function(code){
            $scope.search.sc = code;
            $scope.searchStocks = [];
        };

        $scope.addWeak = function(code){

            var urlAdd = "https://ichess.sinaapp.com/weak.php?a=a&c=" + code;
            $http.get(urlAdd)
                .success(function (data) {
                    $scope.getCounter($scope.url,$scope);
                });
        };

        $scope.deleteAll = function(){

            var urlAdd = "https://ichess.sinaapp.com/weak.php?a=d";
            $http.get(urlAdd)
                .success(function (data) {
                    $scope.getCounter($scope.url,$scope);
                });
        };
        $scope.deleteAttend = function(code){
            var urlDetete = "https://ichess.sinaapp.com/weak.php?a=d&c=" + code;
            $http.get(urlDetete)
                .success(function (data) {
                    $scope.getCounter($scope.url,$scope);
                    alert('delete successfully.');
                });
        };
    })
    .controller('ChartCtrl', function ($rootScope,$scope,$interval) {
        
        var chart = new Highcharts.stockChart({
            chart: {
                renderTo: 'popular',
                type: 'area'
            },
            title: {
                text: 'Monthly Average Temperature'
            },
            subtitle: {
                text: 'Source: WorldClimate.com'
            },

            yAxis: {
                title: {
                    text: 'Temperature (°C)'
                }
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    },
                    enableMouseTracking: false
                }
            },
            series: [{
                name: 'Tokyo',
                data: [[100,7.0], [120,6.9]]
            }, {
                name: 'London',
                data: [[100,5.0], [120,16.9]]
            }]
        });

        function addPoint(){
             chart.series[0].addPoint([150,10],false);
             chart.series[1].addPoint([150,20],false);
            //chart.series[0].setData([[100,7.0], [120,6.9],[150,10]],false);
            chart.redraw();
        }
        
        //$interval(addPoint,10000);
        // cordova.plugins.notification.local.schedule({
        //     title: "New Message",
        //     message: "Hi, are you ready? We are waiting.",
        //     sound: "file://wave/buy.mp3",
        //     icon: "file://img/ionic.png"
        // });
        

    }).controller('WaveHolderCtrl', function ($rootScope,$scope, $http, $ionicModal,$interval, $state, NgTableParams) {
        var codes = 'sz002594,sh601390';
                var lt = (new Date()).getTime() - 24 * 60 * 60 * 1000;
                
                var yAxis = [{
                    labels: {
                        format: '{value}'
                    },
                    opposite: false
                }, {
                    labels: {
                        format: '{value}'
                    },
                    opposite: true
                }];

                var charts = [];

                $scope.createChart = function (container, seriesOptions, name) {
                    var times = [];

                    for (var v in seriesOptions) {
                        if (seriesOptions[v].name == container) {
                            for(var i in seriesOptions[v].data){
                                times.push(seriesOptions[v].data[i][0]);
                            }
                        }
                    }

                    for (var v in seriesOptions) {
                        if (seriesOptions[v].name == 'sh000001') {
                            seriesOptions[v].yAxis = 0;
                            var newData = [];
                            for(var i in seriesOptions[v].data){
                                if(true){ //inArray(seriesOptions[v].data[i][0],times)>-1
                                    newData = seriesOptions[v].data[i];
                                }
                            }
                            seriesOptions[v].data = newData;

                        } else {
                            seriesOptions[v].yAxis = 1;
                        }
                    }

                    if(charts[container]){
                        for(var i = 0; i < charts[container].series.length; i++){
                            charts[container].series[i].setData(seriesOptions[i].data);
                        }
                    }else{
                        charts[container] = new Highcharts.stockChart({
                            chart: {
                                renderTo: container
                            },
                            rangeSelector: {
                                selected: 1
                            },
                            legend:{
                                enabled: true,
                                align: 'left',
                                verticalAlign: 'middle',
                                layout: 'vertical'
                            },
                            plotOptions: {
                                series: {
                                    events: {
                                        legendItemClick: function(event) {
                                            var urlDetete = "https://ichess.sinaapp.com/holder.php?a=d&c=" + event.target.name;
                                            $http.get(urlDetete)
                                                .success(function (data) {
                                                    $('div#' + event.target.name).remove();
                                                });
                                        }
                                    }
                                }
                            },
                            navigator: {
                                enabled: false
                            },
                            credits: {
                                enabled: false
                            },
                            scrollbar: {
                                enabled: true
                            },
                            yAxis: yAxis,
                            series: seriesOptions
                        });
                    }
                    
                };

                $scope.getindex = function (code,name) {
                    $http.get('https://ichess.sinaapp.com/getindex.php?codes=' + code )
                        .success(function (data) {
                            console.log(data);

                            var lst = data[0]['data'];
                            if (lst && lst.length > 0) {
                                lt = lst[lst.length - 1][0];
                            }
                            $scope.createChart(code, data, name);
                    });
                };
                var getHolder = function () {
                    var url = 'https://ichess.sinaapp.com/holder.php';
                    $http.get(url)
                        .success(function (data) {
                            for (var i in data) {
                                var item = data[i];
                                var code = item.code.toLowerCase();
                                $('#holder').append('<div id="' + code + '"></div>');
                                $scope.getindex(code,item.name);
                            }
                        })
                        .finally(function() {
                            $scope.$broadcast('scroll.refreshComplete');
                        });
                };

                getHolder();

                $rootScope.loop = $interval(function (){ 
                    if($state.current.name=='app.my.waveHolder')
                        getHolder();
                }, 60000);
        
    }).controller('WaveAttendCtrl', function ($rootScope,$scope, $http, $ionicModal,$interval, $state, NgTableParams) {
        var codes = 'sz002594,sh601390';
                var lt = (new Date()).getTime() - 24 * 60 * 60 * 1000;

                var charts = [];

                $scope.createChart = function (container, seriesOptions, name) {
                    var yAxis = [{
                        labels: {
                            format: '{value}'
                        },
                        opposite: false
                    }, {
                        labels: {
                            format: '{value}'
                        },
                        opposite: true
                    }];

                    var times = [];

                    for (var v in seriesOptions) {
                        if (seriesOptions[v].name == container) {
                            for(var i in seriesOptions[v].data){
                                times.push(seriesOptions[v].data[i][0]);
                            }
                        }
                    }

                    for (var v in seriesOptions) {
                        if (seriesOptions[v].name == 'sh000001') {
                            seriesOptions[v].yAxis = 0;
                            var newData = [];
                            for(var i in seriesOptions[v].data){
                                if(true){ //inArray(seriesOptions[v].data[i][0],times)>-1
                                    newData = seriesOptions[v].data[i];
                                }
                            }
                            seriesOptions[v].data = newData;

                        } else {
                            seriesOptions[v].yAxis = 1;
                        }
                    }

                    if(charts[container]){
                        for(var i = 0; i < charts[container].series.length; i++){
                            charts[container].series[i].setData(seriesOptions[i].data);
                        }
                    }else{
                        charts[container] = new Highcharts.stockChart({
                            chart: {
                                renderTo: container
                            },
                            rangeSelector: {
                                selected: 1
                            },
                            legend:{
                                enabled: true,
                                align: 'left',
                                verticalAlign: 'middle',
                                layout: 'vertical'
                            },
                            plotOptions: {
                                series: {
                                    events: {
                                        legendItemClick: function(event) {
                                            var urlDetete = "https://ichess.sinaapp.com/attend.php?a=d&c=" + event.target.name;
                                            $http.get(urlDetete)
                                                .success(function (data) {
                                                    $('div#' + event.target.name).remove();
                                                });
                                        }
                                    }
                                }
                            },
                            navigator: {
                                enabled: false
                            },
                            credits: {
                                enabled: false
                            },
                            scrollbar: {
                                enabled: true
                            },
                            yAxis: yAxis,
                            series: seriesOptions
                        });
                    }
                    
                };

                $scope.getindex = function (code,name) {
                    $http.get('https://ichess.sinaapp.com/getindex.php?codes=' + code )
                        .success(function (data) {
                            console.log(data);
                            if(data[0]){
                                var lst = data[0]['data'];
                                if (lst && lst.length > 0) {
                                    lt = lst[lst.length - 1][0];
                                }
                                $scope.createChart(code, data, name);
                            }
                            
                    });
                };
                var getAttend = function () {
                    // var url = 'https://ichess.sinaapp.com/attend.php';
                    // $http.get(url)
                    //     .success(function (data) {
                    //         for (var i in data) {
                    //             var item = data[i];
                    //             var code = item.code.toLowerCase();
                    //             $('#attend').append('<div id="' + code + '"></div>');
                    //             $scope.getindex(code,item.name);
                    //         }
                    //     })
                    //     .finally(function() {
                    //         $scope.$broadcast('scroll.refreshComplete');
                    //     });

                    for (var i in $rootScope.attendList) {
                        var item = $rootScope.attendList[i];
                        var code = item.code.toLowerCase();
                        $('#attend').append('<div id="' + code + '"></div>');
                        $scope.getindex(code,item.name);
                    }
                };

                // for (var i in $rootScope.attendList) {
                //     var item = $rootScope.attendList[i];
                //     var code = item.code.toLowerCase();
                //     $('#attend').append('<div id="' + code + '"></div>');
                // }

                getAttend();

                $rootScope.loop = $interval(function (){
                    if($state.current.name=='app.my.waveAttend') 
                        getAttend();
                }, 60000);
        
    }).controller('PopularCtrl', function ($rootScope,$scope, $interval, $http, $ionicModal, $state, NgTableParams) {

        $scope.days = [1,5,20,100];

        $scope.codes = [{code:'sz399006',name:'cy'},
        {code:'sz399001',name:'sc'},
        {code:'sz399678',name:'cx'},
        {code:'sz399959',name:'jg'},
        {code:'sz399991',name:'ydyl'},
        {code:'sz399232',name:'ck'},
        {code:'sz399240',name:'jr'},
        {code:'sz399806',name:'hj'},
        {code:'sz399239',name:'it'}];
        $scope.code = $scope.codes[0].code;
        var oldData = [];
        var code = 'sz399006';

        var n = 1;
        var t = 0;

        var background = {
            type: 'linearGradient',
            x0: 0,
            y0: 0,
            x1: 0,
            y1: 1,
            colorStops: [{
                offset: 0,
                color: '#d2e6c9'
            }, {
                offset: 1,
                color: 'white'
            }]
        };
        

        var isPlay = false;
        var sellNotification = false;

        var r = 0;
        var maxColumn = 0;
        var chart = null;

        var initChart = function(){
            $interval.cancel($rootScope.loop);

            if(chart!=null)
                chart.destroy();
            chart = null;
            oldData=[];
            t = 0;
            isPlay = false;
            sellNotification = false;
            maxColumn = 0;
        };

        $scope.changeLevel = function(day){
            initChart();
            n = parseInt(day);
            calPopular(n, 0, code);
            $rootScope.loop = $interval(function (){
                if($state.current.name=='app.popular') 
                    calPopular(n, t, code); 
            }, 30000);
        }

        $scope.changeCode = function(c){
            code = c;
            initChart();
            calPopular(n, 0, code);
            $rootScope.loop = $interval(function (){ 
                if($state.current.name=='app.popular')
                    calPopular(n, t, code);
            }, 30000);
        }

        $scope.stopSound = function(){
            initChart();
            calPopular(n, 0, code);
            $rootScope.loop = $interval(function (){
                if($state.current.name=='app.popular') 
                    calPopular(n, t, code); 
            }, 30000);
            if($scope.player)
                $scope.player.pause();
            $scope.$broadcast('scroll.refreshComplete');
        };

        var sortTime = function(a, b){
            return b[0] - a[0];
        };

        function calPopular(n, time, code) {
            var p = {
                    n: n,
                    t: time,
                    code: code
                };

            $http.get('https://ichess.sinaapp.com/other/cy.php?' + $.param(p),{timeout: 20000})
                .success(function (data) {
                    console.log(data);
                    
                    if(data.length < n)
                        return;

                    var maxColumn = 0;
                    var minValue = 100000;
                    var maxValue = 0;
                    data = oldData.concat(data);
                    
                    oldData = data.slice();

                    var arr = [];
                     arr[0] = [];
                     arr[1] = [];
                     arr[2] = [];
                     arr[3] = [];
                     arr[4] = [];
                     arr[5] = [];
                     arr[6] = [];

                    var gt = [];
                    var lt = [];

                    var delta = 0;

                    var minP = 100000;
                    var maxP = 0;
                    
                    t = data[data.length-1].t;
                    var mid = Math.floor(data.length / 2);
                    delta = data[mid].dex - data[mid].strong;

                    var min = 100000;

                    for (var i = 0; i < data.length; i++) {
                        arr[2].push([1000 * parseInt(data[i].t), parseFloat(data[i].strong) + delta]);
                        arr[1].push([1000 * parseInt(data[i].t), parseFloat(data[i].dex)]);

                        if(parseFloat(data[i].dex) > maxValue){
                            maxValue = parseFloat(data[i].dex);
                        }
                        if(parseFloat(data[i].strong) + delta > maxValue){
                            maxValue = parseFloat(data[i].strong) + delta;
                        }
                        if(parseFloat(data[i].dex) < minValue){
                            minValue = parseFloat(data[i].dex);
                        }
                        if(parseFloat(data[i].strong) + delta < minValue){
                            minValue = parseFloat(data[i].strong) + delta;
                        }

                        if (parseFloat(data[i].dex) < min)
                            min = parseFloat(data[i].dex);
                    }
                    for (var i = 0; i < data.length; i++) {
                        var cl = Math.round(parseFloat(data[i].clmn)/1000);

                        if(cl > 4000){
                            cl = maxColumn * 1.1;
                        }
                        arr[0].push([1000 * parseInt(data[i].t), cl]);

                        if (cl > maxColumn)
                            maxColumn = cl;
                    }

                    for (var i = 1; i < data.length; i++) {
                        if (i > 1 && arr[1][i][1] < arr[1][i - 1][1]) {
                            if (arr[2][i][1] > arr[2][i - 1][1]) {
                                var last = gt[gt.length - 1];
                                var append = 0;
                                if (typeof (last) == "object" && last[0] == i - 1) {
                                    append = last[1];
                                }
                                gt.push([i, arr[2][i][1] - arr[2][i - 1][1] + append]);
                                if (gt[gt.length - 1][1] > 4) {
                                    arr[3].push([1000 * parseInt(data[i].t), arr[1][i][1]]);
                                } else if (gt[gt.length - 1][1] > 3) {
                                    arr[5].push([1000 * parseInt(data[i].t), arr[1][i][1]]);
                                }
                            }
                        }

                        if (i > 1 && arr[1][i][1] > arr[1][i - 1][1]) {
                            if (arr[2][i][1] < arr[2][i - 1][1]) {
                                var last = lt[lt.length - 1];
                                var append = 0;
                                if (typeof (last) == "object" && last[0] == i - 1) {
                                    append = last[1];
                                }
                                lt.push([i, arr[2][i][1] - arr[2][i - 1][1] + append]);
                                if (lt[lt.length - 1][1] < -4) {
                                    arr[4].push([1000 * parseInt(data[i].t), arr[1][i][1]]);
                                } else if (lt[lt.length - 1][1] < -3) {
                                    arr[6].push([1000 * parseInt(data[i].t), arr[1][i][1]]);
                                }
                            }
                        }
                        if(arr[2][i][1] > maxP){
                            maxP = arr[2][i][1];
                        }
                        if(arr[2][i][1] < minP){
                            minP = arr[2][i][1];
                        }
                    }

                    // if (typeof (arr[3][arr[3].length - 1]) == "object" && (new Date()).getTime() - arr[3][arr[3].length - 1][0] < 5 * 60 * 1000  && !isPlay) { //buy
                    //     console.log("buy");
                    //     if($scope.player)
                    //         $scope.player.pause();
                    //     isPlay = true;
                    //     $scope.player = document.getElementById('buymp3');
                    //     $scope.player.play();
                    // } else if (typeof (arr[4][arr[4].length - 1]) == "object" && (new Date()).getTime() - arr[4][arr[4].length - 1][0] < 5 * 60 * 1000 && !isPlay) { //sell
                    //     console.log("sell");
                    //     if($scope.player)
                    //         $scope.player.pause();
                    //     isPlay = true;
                    //     $scope.player = document.getElementById('sellmp3');
                    //     $scope.player.play();
                    // } else if (typeof (arr[5][arr[5].length - 1]) == "object" && (new Date()).getTime() - arr[5][arr[5].length - 1][0] < 5 * 60 * 1000 && !isPlay) { //pre buy
                    //     console.log("pre buy");
                    //     if($scope.player)
                    //         $scope.player.pause();
                    //     isPlay = true;
                    //     $scope.player = document.getElementById('pbuymp3');
                    //     $scope.player.play();
                    // } else if (typeof (arr[6][arr[6].length - 1]) == "object" && (new Date()).getTime() - arr[6][arr[6].length - 1][0] < 5 * 60 * 1000 && !isPlay) { //pre sell
                    //     console.log("pre sell");
                    //     if($scope.player)
                    //         $scope.player.pause();
                    //     isPlay = true;
                    //     $scope.player = document.getElementById('psellmp3');
                    //     $scope.player.play();
                    // } else {
                    //     isPlay = false;
                    // }

                    maxValue += 1;
                    minValue -= 1;

                    var yAxis = [{
                        labels: {
                            format: '{value}'
                        },
                        tickAmount: 1,
                        max: 2*maxColumn,
                        opposite: false
                    }, {
                        labels: {
                            format: '{value}'
                        },
                        startOnTick: false,
                        endOnTick: true,
                        tickAmount: 8,
                        max: maxValue,
                        min: minValue,
                        opposite: true,
                        plotLines: [{
                            value: minP,
                            color: 'green',
                            dashStyle: 'shortdash',
                            width: 2,
                            label: {
                                text: 'min'
                            }
                        }, {
                            value: maxP,
                            color: 'red',
                            dashStyle: 'shortdash',
                            width: 2,
                            label: {
                                text: 'max'
                            }
                        }]
                    }];

                    for(var i in arr){
                        arr[i].sort(sortTime);
                    }

                    var series = [{
                                name: 'Column',
                                type: 'area',
                                yAxis: 0,
                                color: Highcharts.defaultOptions.colors[0],
                                data: arr[0]
                            }, {
                                name: 'Index',
                                type: 'line',
                                yAxis: 1,
                                color: Highcharts.defaultOptions.colors[1],
                                data: arr[1]
                            }, {
                                name: 'Popular',
                                type: 'line',
                                yAxis: 1,
                                color: Highcharts.defaultOptions.colors[2],
                                data: arr[2]
                            }, {
                                name: 'Buy point',
                                type: 'scatter',
                                yAxis: 1,
                                color: Highcharts.defaultOptions.colors[5],
                                data: arr[3]
                            }, {
                                name: 'Sell point',
                                type: 'scatter',
                                yAxis: 1,
                                color: Highcharts.defaultOptions.colors[3],
                                data: arr[4]
                            }, {
                                name: 'Pre Buy point',
                                type: 'scatter',
                                yAxis: 1,
                                color: Highcharts.defaultOptions.colors[4],
                                data: arr[5]
                            }, {
                                name: 'Pre Sell point',
                                type: 'scatter',
                                yAxis: 1,
                                color: Highcharts.defaultOptions.colors[6],
                                data: arr[6]
                            }];

                    var options = {
                            chart: {
                                renderTo: 'popular'
                            },
                            rangeSelector: {
                                selected: 1,
                                enabled: false
                            },
                            title: {
                                text: null
                            },
                            navigator: {
                                enabled: true,
                                series: {
                                    data: arr[1]
                                }
                            },
                            credits: {
                                enabled: false
                            },
                            scrollbar: {
                                enabled: true
                            },
                            tooltip: {
                                xDateFormat: '%Y-%m-%d %H:%M',
                            },
                            yAxis: yAxis,
                            series: series
                        };

                    if(chart==null){
                        chart = new Highcharts.stockChart(options);
                    }else{
                        chart.yAxis[0].min = 0;
                        chart.yAxis[0].max = 2*maxColumn;
                        chart.yAxis[0].isDirty = true;
                        chart.yAxis[1].min = minValue;
                        chart.yAxis[1].max = maxValue;
                        chart.yAxis[1].isDirty = true;

                        for(var i = 0; i < chart.series.length; i++){
                            chart.series[i].setData(arr[i],false);
                        }
                        chart.navigator.series[0].setData(arr[1],false);
                        chart.redraw();
                    }
                })
                .error(function(error){
                    console.log(error);
                });
        };

        initChart();
        calPopular(n, t, code);
        $rootScope.loop = $interval(function (){
            if($state.current.name=='app.popular') 
                calPopular(n, t, code); 
        }, 30000);
    });