var t = require("../../../api.js"),
    a = require("../../../area-picker/area-picker.js"),
    i = getApp();
Page({
    data: {},
    onLoad: function(e) {
        i.pageOnLoad(this);
        var o = this;
        o.getDistrictData(function(t) {
            a.init({
                page: o,
                data: t
            })
        }), wx.showLoading({
            title: "正在加载"
        }), i.request({
            url: t.mch.user.setting,
            success: function(t) {
                wx.hideLoading(), o.setData(t.data)
            }
        })
    },
    getDistrictData: function(a) {
        var e = wx.getStorageSync("district");
        if (!e) return wx.showLoading({
            title: "正在加载",
            mask: !0
        }), void i.request({
            url: t.
            default.district,
            success: function(t) {
                wx.hideLoading(), 0 == t.code && (e = t.data, wx.setStorageSync("district", e), a(e))
            }
        });
        a(e)
    },
    onAreaPickerConfirm: function(t) {
        this.setData({
            edit_district: {
                province: {
                    id: t[0].id,
                    name: t[0].name
                },
                city: {
                    id: t[1].id,
                    name: t[1].name
                },
                district: {
                    id: t[2].id,
                    name: t[2].name
                }
            }
        })
    },
    mchCommonCatChange: function(t) {
        this.setData({
            mch_common_cat_index: t.detail.value
        })
    },
    formSubmit: function(a) {
        var e = this;
        wx.showLoading({
            title: "正在提交",
            mask: !0
        }), a.detail.value.form_id = a.detail.formId, a.detail.value.mch_common_cat_id = e.data.mch_common_cat_index ? e.data.mch_common_cat_list[e.data.mch_common_cat_index].id : e.data.mch && e.data.mch.mch_common_cat_id ? e.data.mch.mch_common_cat_id : "", i.request({
            url: t.mch.user.setting_submit,
            method: "post",
            data: a.detail.value,
            success: function(t) {
                wx.hideLoading(), 0 == t.code ? wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.navigateBack({
                            delta: 1
                        })
                    }
                }) : e.showToast({
                    title: t.msg
                })
            }
        })
    },
    onReady: function() {
        i.pageOnReady(this)
    },
    onShow: function() {
        i.pageOnShow(this)
    },
    onHide: function() {
        i.pageOnHide(this)
    },
    onUnload: function() {
        i.pageOnUnload(this)
    },
    uploadLogo: function() {
        var t = this;
        i.uploader.upload({
            start: function(t) {
                wx.showLoading({
                    title: "正在上传",
                    mask: !0
                })
            },
            success: function(a) {
                0 == a.code ? (t.data.mch.logo = a.data.url, t.setData({
                    mch: t.data.mch
                })) : t.showToast({
                    title: a.msg
                })
            },
            error: function(a) {
                t.showToast({
                    title: a
                })
            },
            complete: function() {
                wx.hideLoading()
            }
        })
    },
    uploadHeaderBg: function() {
        var t = this;
        i.uploader.upload({
            start: function(t) {
                wx.showLoading({
                    title: "正在上传",
                    mask: !0
                })
            },
            success: function(a) {
                0 == a.code ? (t.data.mch.header_bg = a.data.url, t.setData({
                    mch: t.data.mch
                })) : t.showToast({
                    title: a.msg
                })
            },
            error: function(a) {
                t.showToast({
                    title: a
                })
            },
            complete: function() {
                wx.hideLoading()
            }
        })
    }
});