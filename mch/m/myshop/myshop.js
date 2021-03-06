var t = require("../../../api.js"),
    a = getApp();
Page({
    data: {
        is_show: !1
    },
    onLoad: function(o) {
        a.pageOnLoad(this);
        var i = this;
        wx.showLoading({
            title: "加载中"
        }), a.request({
            url: t.mch.user.myshop,
            success: function(t) {
                wx.hideLoading(), 0 == t.code && (0 === t.data.mch.is_open && wx.showModal({
                    title: "提示",
                    content: "\b店铺已被关闭！请联系管理员",
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.navigateBack()
                    }
                }), i.setData(t.data), i.setData({
                    is_show: !0
                })), 1 == t.code && wx.redirectTo({
                    url: "/mch/apply/apply"
                })
            }
        })
    },
    onReady: function() {
        a.pageOnReady(this)
    },
    onShow: function() {
        a.pageOnShow(this)
    },
    onHide: function() {
        a.pageOnHide(this)
    },
    onUnload: function() {
        a.pageOnUnload(this)
    },
    navigatorSubmit: function(o) {
        a.request({
            url: t.user.save_form_id + "&form_id=" + o.detail.formId
        }), wx.navigateTo({
            url: o.detail.value.url
        })
    },
    showPcUrl: function() {
        this.setData({
            show_pc_url: !0
        })
    },
    hidePcUrl: function() {
        this.setData({
            show_pc_url: !1
        })
    },
    copyPcUrl: function() {
        var t = this;
        wx.setClipboardData({
            data: t.data.pc_url,
            success: function(a) {
                t.showToast({
                    title: "内容已复制"
                })
            }
        })
    }
});