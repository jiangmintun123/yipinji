var t = require("../../api.js"), e = (require("../../utils.js"), getApp()), o = require("../../wxParse/wxParse.js");

Page({
    data: {
        score: [ 1, 2, 3, 4, 5 ]
    },
    onLoad: function(a) {
        e.pageOnLoad(this);
        var n = this, s = a.user_id;
        e.loginBindParent({
            parent_id: s
        }), n.setData({
            shop_id: a.shop_id
        }), wx.showLoading({
            title: "加载中"
        }), e.request({
            url: t.default.shop_detail,
            method: "GET",
            data: {
                shop_id: a.shop_id
            },
            success: function(t) {
                if (0 == t.code) {
                    n.setData(t.data);
                    var e = t.data.shop.content ? t.data.shop.content : "<span>暂无信息</span>";
                    o.wxParse("detail", "html", e, n);
                } else wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.redirectTo({
                            url: "/pages/shop/shop"
                        });
                    }
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    onReady: function() {},
    onShow: function() {
        e.pageOnShow(this);
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    mobile: function() {
        var t = this;
        wx.makePhoneCall({
            phoneNumber: t.data.shop.mobile
        });
    },
    goto: function() {
        var t = this;
        wx.getSetting({
            success: function(o) {
                o.authSetting["scope.userLocation"] ? t.location() : e.getauth({
                    content: "需要获取您的地理位置授权，请到小程序设置中打开授权！",
                    cancel: !1,
                    success: function(e) {
                        e.authSetting["scope.userLocation"] && t.location();
                    }
                });
            }
        });
    },
    location: function() {
        var t = this.data.shop;
        wx.openLocation({
            latitude: parseFloat(t.latitude),
            longitude: parseFloat(t.longitude),
            name: t.name,
            address: t.address
        });
    },
    onShareAppMessage: function(t) {
        var e = this, o = wx.getStorageSync("user_info");
        return {
            path: "/pages/shop-detail/shop-detail?shop_id=" + e.data.shop_id + "&user_id=" + o.id
        };
    }
});