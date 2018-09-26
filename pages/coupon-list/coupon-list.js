var t = require("../../api.js"), o = getApp();

Page({
    data: {},
    onLoad: function(n) {
        o.pageOnLoad(this);
        var e = this;
        wx.showLoading({
            mask: !0
        }), o.request({
            url: t.default.coupon_list,
            success: function(t) {
                0 == t.code && e.setData({
                    coupon_list: t.data.list
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    receive: function(n) {
        var e = this, i = n.target.dataset.index;
        wx.showLoading({
            mask: !0
        }), e.hideGetCoupon || (e.hideGetCoupon = function(t) {
            var o = t.currentTarget.dataset.url || !1;
            e.setData({
                get_coupon_list: null
            }), o && wx.navigateTo({
                url: o
            });
        }), o.request({
            url: t.coupon.receive,
            data: {
                id: i
            },
            success: function(t) {
                0 == t.code && e.setData({
                    get_coupon_list: t.data.list,
                    coupon_list: t.data.coupon_list
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    closeCouponBox: function(t) {
        this.setData({
            get_coupon_list: ""
        });
    },
    goodsList: function(t) {
        var o = t.currentTarget.dataset.goods, n = [];
        for (var e in o) n.push(o[e].id);
        wx.navigateTo({
            url: "/pages/list/list?goods_id=" + n,
            success: function(t) {},
            fail: function(t) {}
        });
    }
});