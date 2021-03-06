var t = require("../../../api.js"), a = getApp(), n = !1, i = !1;

Page({
    data: {
        gain: !0,
        p: 1,
        status: 1
    },
    onLoad: function(t) {
        getApp().pageOnLoad(this), n = !1, i = !1;
        var a = this;
        t.status && a.setData({
            status: t.status
        });
    },
    onReady: function() {},
    onShow: function() {
        getApp().pageOnShow(this), this.loadData();
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        var t = this;
        n || t.loadData();
    },
    income: function() {
        wx.redirectTo({
            url: "/pages/integral-mall/detail/index?status=1"
        });
    },
    expenditure: function() {
        wx.redirectTo({
            url: "/pages/integral-mall/detail/index?status=2"
        });
    },
    loadData: function() {
        var e = this;
        if (!i) {
            i = !0, wx.showLoading({
                title: "加载中"
            });
            var o = e.data.p;
            a.request({
                url: t.integral.integral_detail,
                data: {
                    page: o,
                    status: e.data.status
                },
                success: function(t) {
                    if (0 == t.code) {
                        var a = e.data.list;
                        a = a ? a.concat(t.data.list) : t.data.list, t.data.list.length <= 0 && (n = !0), 
                        e.setData({
                            list: a,
                            is_no_more: n,
                            p: o + 1
                        });
                    }
                },
                complete: function(t) {
                    i = !1, wx.hideLoading();
                }
            });
        }
    }
});