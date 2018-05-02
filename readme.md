# browser.js

一个检测国内外浏览器版本的前端 js 库。其中 360 系浏览器检测困难系数最大，代码中采用了两中策略来检测当前使用的是否是 360：首先判断当前 chrome 版本，如果大于 360 已经发布的浏览器的 chrome 最大版本，则代表是 chrome 浏览器；然后对于低版本的 chrome，则读取浏览器内部特性，并对其加权，最终确定该浏览器到底是 chrome 360安全 360极速 还是 chromium。

## 使用

返回对象说明

- whyun.browser

```javascript
{
    browser:{name:String,version:String},
    system:{name:String,version:String},
    isMobile:Boolean,
    string:String//操作系统信息和浏览器信息组成的字符串
}
```
