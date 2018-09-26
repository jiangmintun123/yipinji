var e = require("../../../api.js"), t = getApp();

Page({
    data: {},
    onLoad: function(o) {
        getApp().pageOnLoad(this);
        var n = this;
        if (o.scene) {
            a = o.scene;
            n.setData({
                type: ""
            });
        } else if (o.type) {
            n.setData({
                type: o.type,
                status: 1
            });
            a = o.id;
        } else {
            var a = o.id;
            n.setData({
                status: 1,
                type: ""
            });
        }
        a && (n.setData({
            order_id: a
        }), wx.showLoading({
            title: "正在加载",
            mask: !0
        }), t.request({
            url: e.integral.clerk_order_details,
            data: {
                id: a,
                type: n.data.type
            },
            success: function(e) {
                0 == e.code ? n.setData({
                    order_info: e.data
                }) : wx.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1,
                    success: function(e) {
                        e.confirm && wx.redirectTo({
                            url: "/pages/integral-mall/order/order?status=2"
                        });
                    }
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        }));
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {
        var e = this, t = "/pages/pt/group/details?oid=" + e.data.order_info.order_id;
        return {
            title: e.data.order_info.goods_list[0].name,
            path: t,
            imageUrl: e.data.order_info.goods_list[0].goods_pic,
            success: function(e) {}
        };
    },
    clerkOrder: function(o) {
        var n = this;
        wx.showModal({
            title: "提示",
            content: "是否确认核销？",
            success: function(o) {
                o.confirm ? (wx.showLoading({
                    title: "正在加载"
                }), t.request({
                    url: e.integral.clerk,
                    data: {
                        order_id: n.data.order_id
                    },
                    success: function(e) {
                        0 == e.code ? wx.showModal({
                            showCancel: !1,
                            content: e.msg,
                            confirmText: "确认",
                            success: function(e) {
                                e.confirm && wx.redirectTo({
                                    url: "/pages/index/index"
                                });
                            }
                        }) : wx.showModal({
                            title: "警告！",
                            showCancel: !1,
                            content: e.msg,
                            confirmText: "确认",
                            success: function(e) {
                                e.confirm && wx.redirectTo({
                                    url: "/pages/index/index"
                                });
                            }
                        });
                    },
                    complete: function() {
                        wx.hideLoading();
                    }
                })) : o.cancel;
            }
        });
    },
    location: function() {
        var e = this.data.order_info.shop;
        wx.openLocation({
            latitude: parseFloat(e.latitude),
            longitude: parseFloat(e.longitude),
            address: e.address,
            name: e.name
        });
    },
    copyText: function(e) {
        var t = e.currentTarget.dataset.text;
        wx.setClipboardData({
            data: t,
            success: function() {
                wx.showToast({
                    title: "已复制"
                });
            }
        });
    }
});