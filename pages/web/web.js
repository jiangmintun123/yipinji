var n = getApp();

Page({
    data: {
        url: ""
    },
    onLoad: function(e) {
        n.pageOnLoad(this), wx.canIUse("web-view") ? this.setData({
            url: decodeURIComponent(e.url)
        }) : wx.showModal({
            title: "提示",
            content: "您的微信版本过低，无法打开本页面，请升级微信至最新版。",
            showCancel: !1,
            success: function(n) {
                n.confirm && wx.navigateBack({
                    delta: 1
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onShareAppMessage: function(n) {
        return {
            path: "pages/web/web?url=" + encodeURIComponent(n.webViewUrl)
        };
    }
});