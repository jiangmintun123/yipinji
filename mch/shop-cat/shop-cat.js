var a = require("../../api.js"),
    t = getApp();
Page({
    data: {
        list: [{
            id: 1,
            name: "上衣"
        }, {
            id: 2,
            name: "下装",
            list: [{
                id: 3,
                name: "长裤"
            }, {
                id: 4,
                name: "长裤"
            }, {
                id: 5,
                name: "九分裤"
            }, {
                id: 6,
                name: "短裤"
            }]
        }, {
            id: 7,
            name: "帽子"
        }]
    },
    onLoad: function(i) {
        t.pageOnLoad(this);
        var n = this;
        n.setData({
            mch_id: i.mch_id,
            cat_id: i.cat_id || ""
        });
        var e = "shop_cat_list_mch_id_" + n.data.mch_id,
            o = wx.getStorageSync(e);
        o && n.setData({
            list: o
        }), wx.showNavigationBarLoading(), t.request({
            url: a.mch.shop_cat,
            data: {
                mch_id: n.data.mch_id
            },
            success: function(a) {
                0 == a.code && (n.setData({
                    list: a.data.list
                }), wx.setStorageSync(e, a.data.list))
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
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});