var t = require("../../api.js"), i = require("../../area-picker/area-picker.js"), e = getApp();

Page({
    data: {
        name: "",
        mobile: "",
        detail: "",
        district: null
    },
    onLoad: function(a) {
        e.pageOnLoad(this);
        var d = this;
        d.getDistrictData(function(t) {
            i.init({
                page: d,
                data: t
            });
        }), d.setData({
            address_id: a.id
        }), a.id && (wx.showLoading({
            title: "正在加载",
            mask: !0
        }), e.request({
            url: t.user.address_detail,
            data: {
                id: a.id
            },
            success: function(t) {
                wx.hideLoading(), 0 == t.code && d.setData(t.data);
            }
        }));
    },
    getDistrictData: function(i) {
        var a = wx.getStorageSync("district");
        if (!a) return wx.showLoading({
            title: "正在加载",
            mask: !0
        }), void e.request({
            url: t.default.district,
            success: function(t) {
                wx.hideLoading(), 0 == t.code && (a = t.data, wx.setStorageSync("district", a), 
                i(a));
            }
        });
        i(a);
    },
    onAreaPickerConfirm: function(t) {
        this.setData({
            district: {
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
        });
    },
    saveAddress: function() {
        var i = this, a = /^(\d{3,4}-\d{6,9})$/, d = /^\+?\d[\d -]{8,12}\d/;
        if (!/^([0-9]{6,12})$/.test(i.data.mobile) && !a.test(i.data.mobile) && !d.test(i.data.mobile)) return wx.showToast({
            title: "联系电话格式不正确",
            image: "/images/icon-warning.png"
        }), !1;
        wx.showLoading({
            title: "正在保存",
            mask: !0
        });
        var s = i.data.district;
        s || (s = {
            province: {
                id: ""
            },
            city: {
                id: ""
            },
            district: {
                id: ""
            }
        }), e.request({
            url: t.user.address_save,
            method: "post",
            data: {
                address_id: i.data.address_id || "",
                name: i.data.name,
                mobile: i.data.mobile,
                province_id: s.province.id,
                city_id: s.city.id,
                district_id: s.district.id,
                detail: i.data.detail
            },
            success: function(t) {
                wx.hideLoading(), 0 == t.code && wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.navigateBack();
                    }
                }), 1 == t.code && wx.showToast({
                    title: t.msg,
                    image: "/images/icon-warning.png"
                });
            }
        });
    },
    inputBlur: function(t) {
        var i = '{"' + t.currentTarget.dataset.name + '":"' + t.detail.value + '"}';
        this.setData(JSON.parse(i));
    },
    getWechatAddress: function(i) {
        var a = this;
        wx.chooseAddress({
            success: function(i) {
                "chooseAddress:ok" == i.errMsg && (wx.showLoading(), e.request({
                    url: t.user.wechat_district,
                    data: {
                        national_code: i.nationalCode,
                        province_name: i.provinceName,
                        city_name: i.cityName,
                        county_name: i.countyName
                    },
                    success: function(t) {
                        1 == t.code && wx.showModal({
                            title: "提示",
                            content: t.msg,
                            showCancel: !1
                        }), a.setData({
                            name: i.userName || "",
                            mobile: i.telNumber || "",
                            detail: i.detailInfo || "",
                            district: t.data.district
                        });
                    },
                    complete: function() {
                        wx.hideLoading();
                    }
                }));
            }
        });
    },
    onReady: function() {},
    onShow: function() {
        e.pageOnShow(this);
    }
});