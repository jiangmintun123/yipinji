var e = require("../../api.js"), a = getApp();

Page({
    data: {
        form: {
            name: "",
            mobile: ""
        },
        img: "/images/img-share-un.png",
        agree: 0,
        show_modal: !1
    },
    onLoad: function(e) {
        a.pageOnLoad(this);
    },
    onReady: function() {},
    onShow: function() {
        var t = this, o = wx.getStorageSync("user_info"), i = wx.getStorageSync("store"), n = wx.getStorageSync("share_setting");
        wx.showLoading({
            title: "加载中"
        }), a.pageOnShow(t), t.setData({
            user_info: o,
            store: i,
            share_setting: n
        }), a.request({
            url: e.share.check,
            method: "POST",
            success: function(e) {
                0 == e.code && (o.is_distributor = e.data, wx.setStorageSync("user_info", o), 1 == e.data && wx.redirectTo({
                    url: "/pages/share/index"
                })), t.setData({
                    user_info: o
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    onHide: function() {},
    onUnload: function() {},
    formSubmit: function(t) {
        var o = this, i = wx.getStorageSync("user_info");
        if (o.data.form = t.detail.value, void 0 != o.data.form.name && "" != o.data.form.name) if (void 0 != o.data.form.mobile && "" != o.data.form.mobile) if (/^\+?\d[\d -]{8,12}\d/.test(o.data.form.mobile)) {
            var n = t.detail.value;
            n.form_id = t.detail.formId, 0 != o.data.agree ? (wx.showLoading({
                title: "正在提交",
                mask: !0
            }), a.request({
                url: e.share.join,
                method: "POST",
                data: n,
                success: function(e) {
                    0 == e.code ? (i.is_distributor = 2, wx.setStorageSync("user_info", i), wx.redirectTo({
                        url: "/pages/add-share/index"
                    })) : wx.showToast({
                        title: e.msg,
                        image: "/images/icon-warning.png"
                    });
                }
            })) : wx.showToast({
                title: "请先阅读并确认分销申请协议！！",
                image: "/images/icon-warning.png"
            });
        } else wx.showModal({
            title: "提示",
            content: "手机号格式不正确",
            showCancel: !1
        }); else wx.showToast({
            title: "请填写联系方式！",
            image: "/images/icon-warning.png"
        }); else wx.showToast({
            title: "请填写姓名！",
            image: "/images/icon-warning.png"
        });
    },
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    agreement: function() {
        wx.getStorageSync("share_setting");
        this.setData({
            show_modal: !0
        });
    },
    agree: function() {
        var e = this, a = e.data.agree;
        0 == a ? (a = 1, e.setData({
            img: "/images/img-share-agree.png",
            agree: a
        })) : 1 == a && (a = 0, e.setData({
            img: "/images/img-share-un.png",
            agree: a
        }));
    },
    close: function() {
        this.setData({
            show_modal: !1,
            img: "/images/img-share-agree.png",
            agree: 1
        });
    }
});