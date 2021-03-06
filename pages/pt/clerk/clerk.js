var t = require("../../../api.js"), o = getApp();

Page({
    data: {},
    onLoad: function(t) {
        o.pageOnLoad(this);
    },
    onReady: function() {},
    onShow: function() {
        o.pageOnShow(this), this.loadOrderDetails();
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {
        var t = this, o = "/pages/pt/group/details?oid=" + t.data.order_info.order_id;
        return {
            title: t.data.order_info.goods_list[0].name,
            path: o,
            imageUrl: t.data.order_info.goods_list[0].goods_pic,
            success: function(t) {}
        };
    },
    loadOrderDetails: function() {
        var e = this, n = e.options.scene;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), o.request({
            url: t.group.order.clerk_order_details,
            data: {
                id: n
            },
            success: function(t) {
                0 == t.code ? (3 != t.data.status && e.countDownRun(t.data.limit_time_ms), e.setData({
                    order_info: t.data,
                    limit_time: t.data.limit_time
                })) : wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.redirectTo({
                            url: "/pages/pt/order/order"
                        });
                    }
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    copyText: function(t) {
        var o = t.currentTarget.dataset.text;
        wx.setClipboardData({
            data: o,
            success: function() {
                wx.showToast({
                    title: "已复制"
                });
            }
        });
    },
    clerkOrder: function(e) {
        var n = this;
        wx.showModal({
            title: "提示",
            content: "是否确认核销？",
            success: function(e) {
                e.confirm ? (wx.showLoading({
                    title: "正在加载"
                }), o.request({
                    url: t.group.order.clerk,
                    data: {
                        order_id: n.data.order_info.order_id
                    },
                    success: function(t) {
                        0 == t.code ? wx.redirectTo({
                            url: "/pages/user/user"
                        }) : wx.showModal({
                            title: "警告！",
                            showCancel: !1,
                            content: t.msg,
                            confirmText: "确认",
                            success: function(t) {
                                t.confirm && wx.redirectTo({
                                    url: "/pages/index/index"
                                });
                            }
                        });
                    },
                    complete: function() {
                        wx.hideLoading();
                    }
                })) : e.cancel;
            }
        });
    },
    location: function() {
        var t = this.data.order_info.shop;
        wx.openLocation({
            latitude: parseFloat(t.latitude),
            longitude: parseFloat(t.longitude),
            address: t.address,
            name: t.name
        });
    }
});