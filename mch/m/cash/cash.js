var e = require("../../../api.js"),
    a = getApp();
Page({
    data: {
        price: 0,
        cash_max_day: -1,
        selected: 0
    },
    onLoad: function(e) {
        a.pageOnLoad(this)
    },
    onReady: function() {},
    onShow: function() {
        a.pageOnShow(this);
        var i = this;
        wx.showLoading({
            title: "正在提交",
            mask: !0
        }), a.request({
            url: e.mch.user.cash_preview,
            success: function(e) {
                if (0 == e.code) {
                    var a = {};
                    a.price = e.data.money, a.type_list = e.data.type_list, i.setData(a)
                }
            },
            complete: function(e) {
                wx.hideLoading()
            }
        })
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    showCashMaxDetail: function() {
        wx.showModal({
            title: "提示",
            content: "今日剩余提现金额=平台每日可提现金额-今日所有用户提现金额"
        })
    },
    select: function(e) {
        var a = e.currentTarget.dataset.index;
        a != this.data.check && this.setData({
            name: "",
            mobile: "",
            bank_name: ""
        }), this.setData({
            selected: a
        })
    },
    formSubmit: function(i) {
        var t = this,
            n = parseFloat(parseFloat(i.detail.value.cash).toFixed(2)),
            o = t.data.price;
        if (n) if (n > o) wx.showToast({
            title: "提现金额不能超过" + o + "元",
            image: "/images/icon-warning.png"
        });
        else if (n < 1) wx.showToast({
            title: "提现金额不能低于1元",
            image: "/images/icon-warning.png"
        });
        else {
            var s = t.data.selected;
            if (0 == s || 1 == s || 2 == s || 3 == s || 4 == s) {
                if (1 == s || 2 == s || 3 == s) {
                    if (!(r = i.detail.value.name) || void 0 == r) return void wx.showToast({
                        title: "姓名不能为空",
                        image: "/images/icon-warning.png"
                    });
                    if (!(l = i.detail.value.mobile) || void 0 == l) return void wx.showToast({
                        title: "账号不能为空",
                        image: "/images/icon-warning.png"
                    })
                }
                if (3 == s) {
                    if (!(c = i.detail.value.bank_name) || void 0 == c) return void wx.showToast({
                        title: "开户行不能为空",
                        image: "/images/icon-warning.png"
                    })
                } else c = "";
                if (4 == s || 0 == s) var c = "",
                    l = "",
                    r = "";
                wx.showLoading({
                    title: "正在提交",
                    mask: !0
                }), a.request({
                    url: e.mch.user.cash,
                    method: "POST",
                    data: {
                        cash_val: n,
                        nickname: r,
                        account: l,
                        bank_name: c,
                        type: s,
                        scene: "CASH",
                        form_id: i.detail.formId
                    },
                    success: function(e) {
                        wx.hideLoading(), wx.showModal({
                            title: "提示",
                            content: e.msg,
                            showCancel: !1,
                            success: function(a) {
                                a.confirm && 0 == e.code && wx.redirectTo({
                                    url: "/mch/m/cash-log/cash-log"
                                })
                            }
                        })
                    }
                })
            } else wx.showToast({
                title: "请选择提现方式",
                image: "/images/icon-warning.png"
            })
        } else wx.showToast({
            title: "请输入提现金额",
            image: "/images/icon-warning.png"
        })
    }
});