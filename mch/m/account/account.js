var a = require("../../../api.js"),
    t = getApp();
Page({
    data: {
        cash_val: ""
    },
    onLoad: function(o) {
        t.pageOnLoad(this);
        var s = this,
            n = wx.getStorageSync("mch_account_data");
        n && s.setData(n), wx.showNavigationBarLoading(), t.request({
            url: a.mch.user.account,
            success: function(a) {
                0 == a.code ? (s.setData(a.data), wx.setStorageSync("mch_account_data", a.data)) : wx.showModal({
                    title: "提示",
                    content: a.msg,
                    success: function() {}
                })
            },
            complete: function() {
                wx.hideNavigationBarLoading()
            }
        })
    },
    onReady: function() {
        t.pageOnReady(this)
    },
    onShow: function() {
        t.pageOnShow(this)
    },
    onHide: function() {
        t.pageOnHide(this)
    },
    onUnload: function() {
        t.pageOnUnload(this)
    },
    showDesc: function() {
        var a = this;
        wx.showModal({
            title: "交易手续费说明",
            content: a.data.desc,
            showCancel: !1
        })
    },
    showCash: function() {
        return void wx.navigateTo({
            url: "/mch/m/cash/cash"
        })
    },
    hideCash: function() {
        this.setData({
            show_cash: !1
        })
    },
    cashInput: function(a) {
        var t = this,
            o = a.detail.value;
        o = parseFloat(o), isNaN(o) && (o = 0), o = o.toFixed(2), t.setData({
            cash_val: o || ""
        })
    },
    cashSubmit: function(o) {
        var s = this;
        s.data.cash_val ? s.data.cash_val <= 0 ? s.showToast({
            title: "请输入提现金额。"
        }) : (wx.showLoading({
            title: "正在提交",
            mask: !0
        }), t.request({
            url: a.mch.user.cash,
            method: "POST",
            data: {
                cash_val: s.data.cash_val
            },
            success: function(a) {
                wx.showModal({
                    title: "提示",
                    content: a.msg,
                    showCancel: !1,
                    success: function() {
                        0 == a.code && wx.redirectTo({
                            url: "/mch/m/account/account"
                        })
                    }
                })
            },
            complete: function(a) {
                wx.hideLoading()
            }
        })) : s.showToast({
            title: "请输入提现金额。"
        })
    }
});