var t = require("../../../api.js"), a = (require("../../../utils.js"), getApp()), e = !1;

Page({
    data: {
        page: 1,
        page_count: 1,
        longitude: "",
        latitude: "",
        score: [ 1, 2, 3, 4, 5 ],
        keyword: ""
    },
    onLoad: function(t) {
        a.pageOnLoad(this);
        var e = this;
        e.setData({
            ids: t.ids
        }), wx.getLocation({
            success: function(t) {
                e.setData({
                    longitude: t.longitude,
                    latitude: t.latitude
                });
            },
            complete: function() {
                e.loadData();
            }
        });
    },
    onReady: function() {},
    onShow: function() {
        a.pageOnShow(this);
    },
    loadData: function() {
        var e = this;
        wx.showLoading({
            title: "加载中"
        }), a.request({
            url: t.book.shop_list,
            method: "GET",
            data: {
                longitude: e.data.longitude,
                latitude: e.data.latitude,
                ids: e.data.ids
            },
            success: function(t) {
                0 == t.code && e.setData(t.data);
            },
            fail: function(t) {},
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        var t = this;
        t.setData({
            keyword: "",
            page: 1
        }), wx.getLocation({
            success: function(a) {
                t.setData({
                    longitude: a.longitude,
                    latitude: a.latitude
                });
            },
            complete: function() {
                t.loadData(), wx.stopPullDownRefresh();
            }
        });
    },
    onReachBottom: function() {
        var t = this;
        t.data.page >= t.data.page_count || t.loadMoreData();
    },
    loadMoreData: function() {
        var o = this, n = o.data.page;
        e || (e = !0, wx.showLoading({
            title: "加载中"
        }), a.request({
            url: t.book.shop_list,
            method: "GET",
            data: {
                page: n,
                longitude: o.data.longitude,
                latitude: o.data.latitude,
                ids: o.data.ids
            },
            success: function(t) {
                if (0 == t.code) {
                    var a = o.data.list.concat(t.data.list);
                    o.setData({
                        list: a,
                        page_count: t.data.page_count,
                        row_count: t.data.row_count,
                        page: n + 1
                    });
                }
            },
            complete: function() {
                wx.hideLoading(), e = !1;
            }
        }));
    },
    goto: function(t) {
        var e = this;
        wx.getSetting({
            success: function(o) {
                o.authSetting["scope.userLocation"] ? e.location(t) : a.getauth({
                    content: "需要获取您的地理位置授权，请到小程序设置中打开授权！",
                    cancel: !1,
                    success: function(a) {
                        a.authSetting["scope.userLocation"] && e.location(t);
                    }
                });
            }
        });
    },
    location: function(t) {
        var a = this, e = t.currentTarget.dataset.index, o = a.data.list;
        wx.openLocation({
            latitude: parseFloat(o[e].latitude),
            longitude: parseFloat(o[e].longitude),
            name: o[e].name,
            address: o[e].address
        });
    },
    inputFocus: function(t) {
        this.setData({
            show: !0
        });
    },
    inputBlur: function(t) {
        this.setData({
            show: !1
        });
    },
    inputConfirm: function(t) {
        this.search();
    },
    input: function(t) {
        this.setData({
            keyword: t.detail.value
        });
    },
    search: function(e) {
        var o = this;
        wx.showLoading({
            title: "搜索中"
        }), a.request({
            url: t.book.shop_list,
            method: "GET",
            data: {
                keyword: o.data.keyword,
                longitude: o.data.longitude,
                latitude: o.data.latitude,
                ids: o.data.ids
            },
            success: function(t) {
                0 == t.code && o.setData(t.data);
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    go: function(t) {
        var a = this, e = t.currentTarget.dataset.index, o = a.data.list;
        wx.navigateTo({
            url: "/pages/shop-detail/shop-detail?shop_id=" + o[e].id
        });
    },
    navigatorClick: function(t) {
        var a = t.currentTarget.dataset.open_type, e = t.currentTarget.dataset.url;
        return "wxapp" != a || (e = function(t) {
            var a = /([^&=]+)=([\w\W]*?)(&|$|#)/g, e = /^[^\?]+\?([\w\W]+)$/.exec(t), o = {};
            if (e && e[1]) for (var n, i = e[1]; null != (n = a.exec(i)); ) o[n[1]] = n[2];
            return o;
        }(e), e.path = e.path ? decodeURIComponent(e.path) : "", wx.navigateToMiniProgram({
            appId: e.appId,
            path: e.path,
            complete: function(t) {}
        }), !1);
    },
    onShareAppMessage: function(t) {}
});