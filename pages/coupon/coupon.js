var t = require("../../api.js"), a = getApp();

Page({
    data: {
        list: []
    },
    onLoad: function(t) {
        a.pageOnLoad(this), this.setData({
            status: t.status || 0
        }), this.loadData(t);
    },
    loadData: function(s) {
        var i = this;
        wx.showLoading({
            title: "加载中"
        }), a.request({
            url: t.coupon.index,
            data: {
                status: i.data.status
            },
            success: function(t) {
                0 == t.code && i.setData({
                    list: t.data.list
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    goodsList: function(t) {
        var a = this, s = t.currentTarget.dataset.goods_id, i = t.currentTarget.dataset.id, e = a.data.list;
        for (var o in e) if (parseInt(e[o].user_coupon_id) === parseInt(i)) return void (2 == e[o].appoint_type && e[o].goods.length > 0 && wx.navigateTo({
            url: "/pages/list/list?goods_id=" + s
        }));
    },
    onShow: function() {},
    xia: function(t) {
        var a = t.target.dataset.index;
        this.setData({
            check: a
        });
    },
    shou: function() {
        this.setData({
            check: -1
        });
    }
});