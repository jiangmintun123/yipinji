var t = require("../../api.js"),
    a = getApp();
Page({
    data: {
        cat_id: "",
        keyword: "",
        list: [],
        page: 1,
        no_more: !1,
        loading: !1
    },
    onLoad: function(t) {
        a.pageOnLoad(this), t.cat_id && (this.data.cat_id = t.cat_id), this.loadShopList()
    },
    loadShopList: function(i) {
        var o = this;
        o.data.no_more ? "function" == typeof i && i() : o.data.loading || (o.setData({
            loading: !0
        }), a.request({
            url: t.mch.shop_list,
            data: {
                keyword: o.data.keyword,
                cat_id: o.data.cat_id,
                page: o.data.page
            },
            success: function(t) {
                if (0 == t.code) {
                    if (!t.data.list || !t.data.list.length) return void o.setData({
                        no_more: !0,
                        cat_list: t.data.cat_list
                    });
                    o.data.list || (o.data.list = []), o.data.list = o.data.list.concat(t.data.list), o.setData({
                        list: o.data.list,
                        page: o.data.page + 1,
                        cat_list: t.data.cat_list
                    })
                }
            },
            complete: function() {
                o.setData({
                    loading: !1
                }), "function" == typeof i && i()
            }
        }))
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
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        this.loadShopList()
    },
    searchSubmit: function(t) {
        var a = this,
            i = t.detail.value;
        a.setData({
            list: [],
            keyword: i,
            page: 1,
            no_more: !1
        }), a.loadShopList(function() {})
    },
    showCatList: function() {
        this.setData({
            show_cat_list: !0
        })
    },
    hideCatList: function() {
        this.setData({
            show_cat_list: !1
        })
    }
});