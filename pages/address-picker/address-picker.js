var e = require("../../api.js"), a = getApp();

Page({
    data: {
        address_list: null
    },
    onLoad: function(e) {
        a.pageOnLoad(this);
    },
    onReady: function() {},
    onShow: function() {
        a.pageOnShow(this);
        var s = this;
        wx.showNavigationBarLoading(), a.request({
            url: e.user.address_list,
            success: function(e) {
                wx.hideNavigationBarLoading(), 0 == e.code && s.setData({
                    address_list: e.data.list
                });
            }
        });
    },
    pickAddress: function(e) {
        var a = this, s = e.currentTarget.dataset.index, t = a.data.address_list[s];
        wx.setStorageSync("picker_address", t), wx.navigateBack();
    },
    getWechatAddress: function(s) {
        wx.chooseAddress({
            success: function(s) {
                "chooseAddress:ok" == s.errMsg && (wx.showLoading(), a.request({
                    url: e.user.add_wechat_address,
                    method: "post",
                    data: {
                        national_code: s.nationalCode,
                        name: s.userName,
                        mobile: s.telNumber,
                        detail: s.detailInfo,
                        province_name: s.provinceName,
                        city_name: s.cityName,
                        county_name: s.countyName
                    },
                    success: function(e) {
                        1 != e.code ? 0 == e.code && (wx.setStorageSync("picker_address", e.data), wx.navigateBack()) : wx.showModal({
                            title: "提示",
                            content: e.msg,
                            showCancel: !1
                        });
                    },
                    complete: function() {
                        wx.hideLoading();
                    }
                }));
            }
        });
    }
});