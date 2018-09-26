var t = require("../../../api.js"), e = getApp(), a = !1, o = !1, s = 2;

Page({
    data: {
        hide: 1,
        qrcode: "",
        scrollLeft: 0,
        scrollTop: 0
    },
    onLoad: function(t) {
        this.systemInfo = wx.getSystemInfoSync();
        var i = wx.getStorageSync("store");
        this.setData({
            store: i
        }), e.pageOnLoad(this);
        var n = this;
        a = !1, o = !1, s = 2, n.loadOrderList(t.status || -1);
        var r = 0;
        r = t.status >= 2 ? 600 : 0, n.setData({
            scrollLeft: r
        });
    },
    onReady: function() {},
    onShow: function() {
        e.pageOnShow(this);
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onShareAppMessage: function(t) {
        var e = this, a = t.target.dataset.index, o = "/pages/pt/group/details?oid=" + t.target.dataset.id;
        return {
            title: e.data.order_list[a].goods_list[0].goods_name,
            path: o,
            imageUrl: e.data.order_list[a].goods_list[0].goods_pic,
            success: function(t) {}
        };
    },
    loadOrderList: function(a) {
        void 0 == a && (a = -1);
        var o = this;
        o.setData({
            status: a
        }), wx.showLoading({
            title: "正在加载",
            mask: !0
        }), e.request({
            url: t.group.order.list,
            data: {
                status: o.data.status
            },
            success: function(t) {
                0 == t.code && o.setData({
                    order_list: t.data.list
                }), o.setData({
                    show_no_data_tip: 0 == t.data.list.length
                }), 4 != a && o.countDown();
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    countDown: function() {
        var t = this;
        setInterval(function() {
            var e = t.data.order_list;
            for (var a in e) {
                var o = new Date(e[a].limit_time_ms[0], e[a].limit_time_ms[1] - 1, e[a].limit_time_ms[2], e[a].limit_time_ms[3], e[a].limit_time_ms[4], e[a].limit_time_ms[5]) - new Date(), s = parseInt(o / 1e3 / 60 / 60 / 24, 10), i = parseInt(o / 1e3 / 60 / 60 % 24, 10), n = parseInt(o / 1e3 / 60 % 60, 10), r = parseInt(o / 1e3 % 60, 10);
                s = t.checkTime(s), i = t.checkTime(i), n = t.checkTime(n), r = t.checkTime(r), 
                e[a].limit_time = {
                    days: s,
                    hours: i > 0 ? i : "00",
                    mins: n > 0 ? n : "00",
                    secs: r > 0 ? r : "00"
                }, t.setData({
                    order_list: e
                });
            }
        }, 1e3);
    },
    checkTime: function(t) {
        return (t = t > 0 ? t : 0) < 10 && (t = "0" + t), t;
    },
    onReachBottom: function() {
        var i = this;
        o || a || (o = !0, e.request({
            url: t.group.order.list,
            data: {
                status: i.data.status,
                page: s
            },
            success: function(t) {
                if (0 == t.code) {
                    var e = i.data.order_list.concat(t.data.list);
                    i.setData({
                        order_list: e
                    }), 0 == t.data.list.length && (a = !0);
                }
                s++;
            },
            complete: function() {
                o = !1;
            }
        }));
    },
    goHome: function(t) {
        wx.redirectTo({
            url: "/pages/pt/index/index"
        });
    },
    orderPay_1: function(a) {
        wx.showLoading({
            title: "正在提交",
            mask: !0
        }), e.request({
            url: t.group.pay_data,
            data: {
                order_id: a.currentTarget.dataset.id,
                pay_type: "WECHAT_PAY"
            },
            complete: function() {
                wx.hideLoading();
            },
            success: function(t) {
                0 == t.code && wx.requestPayment({
                    timeStamp: t.data.timeStamp,
                    nonceStr: t.data.nonceStr,
                    package: t.data.package,
                    signType: t.data.signType,
                    paySign: t.data.paySign,
                    success: function(t) {},
                    fail: function(t) {},
                    complete: function(t) {
                        "requestPayment:fail" != t.errMsg && "requestPayment:fail cancel" != t.errMsg ? wx.redirectTo({
                            url: "/pages/pt/order/order?status=1"
                        }) : wx.showModal({
                            title: "提示",
                            content: "订单尚未支付",
                            showCancel: !1,
                            confirmText: "确认",
                            success: function(t) {
                                t.confirm && wx.redirectTo({
                                    url: "/pages/pt/order/order?status=0"
                                });
                            }
                        });
                    }
                }), 1 == t.code && wx.showToast({
                    title: t.msg,
                    image: "/images/icon-warning.png"
                });
            }
        });
    },
    goToGroup: function(t) {
        wx.navigateTo({
            url: "/pages/pt/group/details?oid=" + t.target.dataset.id
        });
    },
    getOfflineQrcode: function(a) {
        var o = this;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), e.request({
            url: t.group.order.get_qrcode,
            data: {
                order_no: a.currentTarget.dataset.id
            },
            success: function(t) {
                0 == t.code ? o.setData({
                    hide: 0,
                    qrcode: t.data.url
                }) : wx.showModal({
                    title: "提示",
                    content: t.msg
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    hide: function(t) {
        this.setData({
            hide: 1
        });
    },
    goToCancel: function(a) {
        var o = this;
        wx.showModal({
            title: "提示",
            content: "是否取消该订单？",
            cancelText: "否",
            confirmText: "是",
            success: function(s) {
                if (s.cancel) return !0;
                s.confirm && (wx.showLoading({
                    title: "操作中"
                }), e.request({
                    url: t.group.order.revoke,
                    data: {
                        order_id: a.currentTarget.dataset.id
                    },
                    success: function(t) {
                        wx.hideLoading(), wx.showModal({
                            title: "提示",
                            content: t.msg,
                            showCancel: !1,
                            success: function(t) {
                                t.confirm && o.loadOrderList(o.data.status);
                            }
                        });
                    }
                }));
            }
        });
    },
    switchNav: function(t) {
        var e = t.currentTarget.dataset.status;
        wx.redirectTo({
            url: "/pages/pt/order/order?status=" + e
        });
    },
    goToRefundDetail: function(t) {
        var e = t.currentTarget.dataset.refund_id;
        wx.navigateTo({
            url: "/pages/pt/order-refund-detail/order-refund-detail?id=" + e
        });
    }
});