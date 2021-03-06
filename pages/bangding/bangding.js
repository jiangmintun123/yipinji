var n = getApp(), e = require("../../api.js");

Page({
    data: {
        second: 60
    },
    onLoad: function(t) {
        n.pageOnLoad(this);
        var a = this;
        n.request({
            url: e.user.sms_setting,
            method: "get",
            data: {
                page: 1
            },
            success: function(n) {
                0 == n.code ? a.setData({
                    status: !0
                }) : a.setData({
                    status: !1
                });
            }
        });
    },
    getPhoneNumber: function(t) {
        var a = this;
        "getPhoneNumber:fail user deny" == t.detail.errMsg ? wx.showModal({
            title: "提示",
            showCancel: !1,
            content: "未授权",
            success: function(n) {}
        }) : (wx.showLoading({
            title: "授权中"
        }), wx.login({
            success: function(i) {
                if (i.code) {
                    var o = i.code;
                    n.request({
                        url: e.user.user_binding,
                        method: "POST",
                        data: {
                            iv: t.detail.iv,
                            encryptedData: t.detail.encryptedData,
                            code: o
                        },
                        success: function(n) {
                            if (0 == n.code) {
                                var e = a.data.__user_info;
                                e.binding = n.data.dataObj, wx.setStorageSync("__user_info", e), a.setData({
                                    PhoneNumber: n.data.dataObj,
                                    __user_info: e,
                                    binding: !0,
                                    binding_num: n.data.dataObj
                                });
                            } else wx.showToast({
                                title: "授权失败,请重试"
                            });
                        },
                        complete: function(n) {
                            wx.hideLoading();
                        }
                    });
                } else wx.showToast({
                    title: "获取用户登录态失败！" + i.errMsg,
                    image: "/images/icon-warning.png"
                });
            }
        }));
    },
    gainPhone: function() {
        this.setData({
            gainPhone: !0,
            handPhone: !1
        });
    },
    handPhone: function() {
        this.setData({
            gainPhone: !1,
            handPhone: !0
        });
    },
    nextStep: function() {
        var t = this, a = this.data.handphone;
        a && 11 == a.length ? n.request({
            url: e.user.user_hand_binding,
            method: "POST",
            data: {
                content: a
            },
            success: function(n) {
                0 == n.code ? (t.timer(), t.setData({
                    content: n.msg,
                    timer: !0
                })) : (n.code, wx.showToast({
                    title: n.msg,
                    image: "/images/icon-warning.png"
                }));
            }
        }) : wx.showToast({
            title: "手机号码错误",
            image: "/images/icon-warning.png"
        });
    },
    timer: function() {
        var n = this;
        new Promise(function(e, t) {
            var a = setInterval(function() {
                n.setData({
                    second: n.data.second - 1
                }), n.data.second <= 0 && (n.setData({
                    timer: !1
                }), e(a));
            }, 1e3);
        }).then(function(n) {
            clearInterval(n);
        });
    },
    HandPhoneInput: function(n) {
        this.setData({
            handphone: n.detail.value
        });
    },
    CodeInput: function(n) {
        this.setData({
            code: n.detail.value
        });
    },
    PhoneInput: function(n) {
        this.setData({
            phoneNum: n.detail.value
        });
    },
    onSubmit: function() {
        var t = this.data.gainPhone, a = this.data.handPhone, i = t ? 1 : a ? 2 : 0;
        if (t) {
            var o = this.data.phoneNum;
            if (o) {
                if (11 != o.length) return void wx.showToast({
                    title: "手机号码错误",
                    image: "/images/icon-warning.png"
                });
                s = o;
            } else if (!(s = this.data.PhoneNumber)) return void wx.showToast({
                title: "手机号码错误",
                image: "/images/icon-warning.png"
            });
        } else {
            var s = this.data.handphone;
            if (!/^\+?\d[\d -]{8,12}\d/.test(s)) return void wx.showToast({
                title: "手机号码错误",
                image: "/images/icon-warning.png"
            });
            var d = this.data.code;
            if (!d) return void wx.showToast({
                title: "请输入验证码",
                image: "/images/icon-warning.png"
            });
        }
        var h = this;
        n.request({
            url: e.user.user_empower,
            method: "POST",
            data: {
                phone: s,
                phone_code: d,
                bind_type: i
            },
            success: function(n) {
                0 == n.code ? h.setData({
                    binding: !0,
                    binding_num: s
                }) : 1 == n.code && wx.showToast({
                    title: n.msg,
                    image: "/images/icon-warning.png"
                });
            }
        });
    },
    renewal: function() {
        this.setData({
            binding: !1,
            gainPhone: !0,
            handPhone: !1
        });
    },
    onReady: function() {},
    onShow: function() {
        n.pageOnShow(this);
        var e = this, t = e.data.__user_info;
        t && t.binding ? e.setData({
            binding_num: t.binding,
            binding: !0
        }) : e.setData({
            gainPhone: !0,
            handPhone: !1
        });
    },
    onHide: function() {},
    onUnload: function() {}
});