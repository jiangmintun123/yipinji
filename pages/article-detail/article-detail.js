var t = require("../../api.js"), n = getApp(), e = require("../../wxParse/wxParse.js");

Page({
    data: {},
    onLoad: function(o) {
        n.pageOnLoad(this);
        var a = this;
        n.request({
            url: t.default.article_detail,
            data: {
                id: o.id
            },
            success: function(t) {
                0 == t.code && (wx.setNavigationBarTitle({
                    title: t.data.title
                }), e.wxParse("content", "html", t.data.content, a)), 1 == t.code && wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    confirm: function(t) {
                        t.confirm && wx.navigateBack();
                    }
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});