(function() {
    var packageName = 'whyun';
    if (!window[packageName])
    {
        window[packageName] = {};
    }
    var MAX_360_CHROME_VERSION = 69;//以360极速浏览器的最大内核版本为准
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
    var browser360 = {
        result: "Chrome",
        details: {
            Chrome: 5,
            Chromium: 0,
            _360SE: 0,
            _360EE: 0
        },
        sorted: ["Chrome", "360SE", "360EE", "Chromium"],
        check: function() {
            var init = {
                Chrome: 5,
                Chromium: 0,
                _360SE: 0,
                _360EE: 0
            };
    
    
            var plugins = window.navigator.plugins;
    
    
            var webstore = window.chrome.webstore;
            var webstoreLen = Object.keys(webstore).length;
            var pluginsLen = plugins.length;
    
            if (window.clientInformation.languages ||
                (init._360SE += 8), /zh/i.test(navigator.language) &&
                (init._360SE += 3, init._360EE += 3), window.clientInformation.languages) {
                var lanLen = window.clientInformation.languages.length;
                if (lanLen >= 3) {
                    (init.Chrome += 10, init.Chromium += 6);
                } else if (2 == lanLen) {
                    init.Chrome += 3, init.Chromium += 6, init._360EE += 6;
                } else if (1 == lanLen) {
                    init.Chrome += 4, init.Chromium += 4;
                }
    
            }
            var pluginFrom,
                maybe360 = 0;
            for (var r in plugins) {
                if (pluginFrom = /^(.+) PDF Viewer$/.exec(plugins[r].name)) {
                    if ("Chrome" == pluginFrom[1]) {
                        init.Chrome += 6,
                            init._360SE += 6,
                            maybe360 = 1;
    
                    } else if ("Chromium" == pluginFrom[1]) {
                        init.Chromium += 10,
                            init._360EE += 6,
                            maybe360 = 1;
    
                    }
                } else if ("np-mswmp.dll" == plugins[r].filename) {
                    init._360SE += 20, init._360EE += 20;
                }
            }
    
            maybe360 || (init.Chromium += 9);
            if (webstoreLen <= 1) {
                init._360SE += 7;
            } else {
                init._360SE += 4;
                init.Chromium += 3;
                if (pluginsLen >= 30) {
                    init._360EE += 7, init._360SE += 7, init.Chrome += 7;
                } else if (pluginsLen < 30 && pluginsLen > 10) {
                    init._360EE += 3, init._360SE += 3, init.Chrome += 3;
                } else {
                    init.Chromium += 6;
                }
            }
    
    
            var m = new Object();
            m.Chrome = init.Chrome,
                m.Chromium = init.Chromium,
                m["360SE"] = init._360SE,
                m["360EE"] = init._360EE;
            var s = [];
            for (var u in m) {
                s.push([u, m[u]]);
            }
            s.sort(function(e, i) {
                return i[1] - e[1]
            });
            this.sorted = s;
            this.details = init;
            this.result = s[0][0] || '';
    
            return this.result.toLowerCase();
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


        return browser360.check();
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