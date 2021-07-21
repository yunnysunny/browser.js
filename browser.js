(function() {
    var packageName = 'whyun';
    if (!window[packageName])
    {
        window[packageName] = {};
    }
    var MAX_360_CHROME_VERSION = 86;//以360极速浏览器的最大内核版本为准
    function getIOSVersion(ua) {
        if (/cpu (?:iphone )?os (\d+_\d+)/.test(ua)){
            return parseFloat(RegExp.$1.replace("_", "."));
        } else {
            return 2;
        }
    }
    function _mime(where, value, name, nameReg) {
        var mimeTypes = window.navigator.mimeTypes,
            i;

        for (i in mimeTypes) {
            if (mimeTypes[i][where] == value) {
                if (name !== undefined && nameReg.test(mimeTypes[i][name])) return !0;
                else if (name === undefined) return !0;
            }
        }
        return !1;
    }

    var chrome_weight = {
        "result": "Chrome",
        "details": {
            "Chrome": 5,
            "Chromium": 0,
            "_360SE": 0,
            "_360EE": 0
        },
        "sorted": ["Chrome", "360SE", "360EE", "Chromium"],
        "exec": function exec(results) {
            var details = {
                "Chrome": 5,
                "Chromium": 0,
                "_360SE": 0,
                "_360EE": 0
            };
            var _ua = window.navigator.userAgent;
            if (/Chrome\/([\d.])+\sSafari\/([\d.])+$/.test(_ua)) {
                if (window.navigator.platform == "Win32") {
                    if (!window.clientInformation.languages) {
                        details._360SE += 8;
                    }
                    if (/zh/i.test(navigator.language)) {
                        details._360SE += 3;
                        details._360EE += 3;
                    }
                    if (window.clientInformation.languages) {
                        var lang_len = window.clientInformation.languages.length;
                        if (lang_len >= 3) {
                            details.Chrome += 10;
                            details.Chromium += 6;
                        } else if (lang_len == 2) {
                            details.Chrome += 3;
                            details.Chromium += 6;
                            details._360EE += 6;
                        } else if (lang_len == 1) {
                            details.Chrome += 4;
                            details.Chromium += 4;
                        }
                    }
                    for (var i in window.navigator.plugins) {
                        if (window.navigator.plugins[i].filename == "np-mswmp.dll") {
                            details._360SE += 20;
                            details._360EE += 20;
                        }
                    }
                    if (!window.chrome.webstore) {
                        details._360SE += 20;
                        details._360EE += 20;
                    } else {
                        if (Object.keys(window.chrome.webstore).length <= 1) {
                            details._360SE += 7;
                        } else if (Object.keys(window.chrome.webstore).length == 2) {
                            details._360SE += 4;
                            details.Chromium += 3;
                        }
                    }
                    

                    if (window.navigator.plugins.length >= 30) {
                        details._360EE += 7;
                        details._360SE += 7;
                        details.Chrome += 7;
                    } else if (window.navigator.plugins.length < 30 && window.navigator.plugins.length > 10) {
                        details._360EE += 3;
                        details._360SE += 3;
                        details.Chrome += 3;
                    } else if (window.navigator.plugins.length <= 10) {
                        details.Chromium += 6;
                    }
                } else {
                    details._360SE -= 50;
                    details._360EE -= 50;
                    if (/Linux/i.test(window.navigator.userAgent)) {
                        details.Chromium += 5;
                    }
                }
                var found = 0;
                var respdf = undefined;
                for (var i in window.navigator.plugins) {
                    if (!!(respdf = /^(.+) PDF Viewer$/.exec(window.navigator.plugins[i].name))) {
                        //console.log(respdf[1]);
                        if (respdf[1] == "Chrome") {
                            details.Chrome += 6;
                            details._360SE += 6;
                            found = 1;
                            break;
                        }
                        if (respdf[1] == "Chromium") {
                            details.Chromium += 10;
                            details._360EE += 6;
                            found = 1;
                            break;
                        }
                    }
                }
                if (!found) {
                    details.Chromium += 9;
                }
            }
            var chrome_result = new Object();
            chrome_result['Chrome'] = details.Chrome;
            chrome_result['Chromium'] = details.Chromium;
            chrome_result['360SE'] = details._360SE;
            chrome_result['360EE'] = details._360EE;
            var sortable = [];
            for (var value in chrome_result) {
                sortable.push([value, chrome_result[value]]);
            }
            sortable.sort(function(a, b) {
                return b[1] - a[1];
            });
            this.sorted = sortable;
            this.details = details;
            this.result = sortable[0][0];
            /*console.log("Chrome Weight "+details.Chrome);
console.log("Chromium Weight "+details.Chromium);
console.log("360SE Weight "+details._360SE);  
console.log("360EE Weight "+details._360EE);*/
            if (results == "result") {
                return sortable[0][0];
            } else if (results == "details") {
                return chrome_result;
            } else if (results == "sorted") {
                return sortable;
            }
        }

    };
    var checkChromeWeight = function checkChromeWeight() {
        // console.log(chrome_weight.sorted);
        var _ua = window.navigator.userAgent;
        try {
            chrome_weight.exec();
            if (/Chrome\/([\d.])+\sSafari\/([\d.])+$/.test(_ua)) {
                // console.log("经测试，您正在使用Chromium内核的浏览器，权重最高的浏览器为"+chrome_weight.result);
                // console.log("<br/><br/>四个浏览器所占权重从高到低分别为:<br/>");
                // for(let i = 0;i < chrome_weight.sorted.length ;i++){
                //   console.log(chrome_weight.sorted[i][0]+" : "+chrome_weight.sorted[i][1]+'<br/>');
                // }
                return chrome_weight.result;
            } else {}
            // console.log("经测试，您未使用Chromium内核的浏览器。此程序不能运作。");

            // console.log(chrome_weight.sorted);
        } catch (e) {
            console.warn(e)
            return;
        }
    };
    /**
     * 获取 Chromium 内核浏览器类型
     * @link http://www.adtchrome.com/js/help.js
     * @link https://ext.chrome.360.cn/webstore
     * @link https://ext.se.360.cn
     * @return {String}
     *         360ee 360极速浏览器
     *         360se 360安全浏览器
     *         sougou 搜狗浏览器
     *         liebao 猎豹浏览器
     *         chrome 谷歌浏览器
     *         ''    无法判断
     */

    function _getChromiumType(version) {
        if (window.scrollMaxX !== undefined) return '';

        var doc = document;
        var _track = 'track' in doc.createElement('track'),
            appVersion = window.navigator.appVersion,
            external = window.external;

        // 搜狗浏览器
        if ( external && 'SEVersion' in external) return 'sougou';

        // 猎豹浏览器
        if ( external && 'LiebaoGetVersion' in external) return 'liebao';

        if (/QQBrowser/.test(appVersion)) {//qq浏览器
            return 'qq';
        }
        if (/Maxthon/.test(appVersion)) {//遨游浏览器
            return 'maxthon';
        }
        if (/TaoBrowser/.test(appVersion)) {//淘宝浏览器
            return 'taobao';
        }
        if (/BIDUBrowser/.test(appVersion)) {//百度浏览器
            return 'baidu';
        }
        if (/UBrowser/.test(appVersion)) {//UC浏览器
            return 'uc';
        }

        if (
            (/\sOPR\//.test(appVersion))
            || (/Opera/.test(appVersion))
            || (window.navigator.vendor && window.navigator.vendor.indexOf('Opera') === 0)
        ) {//opera
            return 'opera';
        }
        // chrome
        // if (window.clientInformation && window.clientInformation.languages && window.clientInformation.languages.length > 2) {
        //     return 'chrome';
        // }
        var p = navigator.platform.toLowerCase();
        if (p.indexOf('mac') == 0 || p.indexOf('linux') == 0) {
            return 'chrome';
        }
        if (parseInt(version) > MAX_360_CHROME_VERSION) {
            return 'chrome';
        }
        // var webstoreKeysLength = window.chrome && window.chrome.webstore ? Object.keys(window.chrome.webstore).length : 0;
        // if (_track) {
        //     // 360极速浏览器
        //     // 360安全浏览器
        //     return webstoreKeysLength > 1 ? '360ee' : '360se';
        // }


        return checkChromeWeight() || 'chrome';
    }
    var client = function(){
        var browser = {};

        var ua = navigator.userAgent.toLowerCase();
        var s;
        if (s = ua.match(/rv:([\d.]+)\) like gecko/)) {
            browser.name = 'ie';
            browser['ie'] = s[1];
        } else if (s = ua.match(/msie ([\d.]+)/)) {
            browser.name = 'ie';
            browser['ie'] = s[1];
        }
        else if (s = ua.match(/edge\/([\d.]+)/)) {
            browser.name = 'edge';
            browser['edge'] = s[1];
        }
        else if (s = ua.match(/firefox\/([\d.]+)/)) {
            browser.name = 'firefox';
            browser['firefox'] = s[1];
        }
        else if (s = ua.match(/chrome\/([\d.]+)/)) {
            browser.name = 'chrome';
            browser['chrome'] = s[1];
            var type = _getChromiumType(browser['chrome']);
            if (type) {
                browser['chrome'] += '(' + type + ')';
            }
        }
        else if (s = ua.match(/opera.([\d.]+)/)) {
            browser.name = 'opera';
            browser['opera'] = s[1];
        }
        else if (s = ua.match(/version\/([\d.]+).*safari/)) {
            browser.name = 'safari';
            browser['safari'] = s[1];
        } else {
            browser.name = 'unknown';
            browser['unknow'] = 0;
        }

        var system = {};

        //detect platform
//        var p = navigator.platform.toLowerCase();
        if (ua.indexOf('iphone') > -1) {
            system.name = 'iphone';
            system.iphone = getIOSVersion(ua);
        } else if (ua.indexOf('ipod') >-1 ) {
            system.name = 'ipod';
            system.ipod = getIOSVersion(ua);
        } else if(ua.indexOf('ipad') >-1 ) {
            system.name = 'ipad';
            system.ipad = getIOSVersion(ua);
        } else if (ua.indexOf('nokia') >-1 ) {
            system.name = 'nokia';
            system.nokia = true;
        } else if (/android (\d+\.\d+)/.test(ua)) {
            system.name = 'android';
            system.android = parseFloat(RegExp.$1);
        }  else if (ua.indexOf("win") > -1) {
            system.name = 'win';

            if (/win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)){
                if (RegExp["$1"] == "nt"){
                    switch(RegExp["$2"]){
                        case "5.0":
                            system.win = "2000";
                            break;
                        case "5.1":
                            system.win = "XP";
                            break;
                        case "6.0":
                            system.win = "Vista";
                            break;
                        case "6.1":
                            system.win = "7";
                            break;
                        case "6.2":
                            system.win = "8";
                            break;
                        case "6.3":
                            system.win = "8.1";
                            break;
						case '10.0':
                            system.win = '10';
                            break;
                        default:
                            system.win = "NT";
                            break;
                    }
                } else if (RegExp["$1"] == "9x"){
                    system.win = "ME";
                } else {
                    system.win = RegExp["$1"];
                }
            }

        } else if (ua.indexOf("mac") > -1) {
            system.name = 'mac';
        } else if (ua.indexOf('linux') > -1) {
            system.name = 'linux';
        }
        var str = system.name + (system[system.name] || '') + '|' + browser.name + browser[browser.name];
        var isMobile = system.android || system.iphone || system.ios || system.ipad || system.ipod || system.nokia;

        return {
            browser:    browser,
            system:     system,
            isMobile :	isMobile,
            string : str
        };
    }();
    window[packageName]['browser'] = client;
})();