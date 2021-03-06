var t = require("../../api.js"), a = getApp();

Page({
    data: {
        load_more_count: 0,
        last_load_more_time: 0,
        is_loading: !1,
        loading_class: "",
        cat_id: !1,
        keyword: !1,
        page: 1,
        limit: 20,
        goods_list: [],
        show_history: !0,
        show_result: !1,
        history_list: [],
        is_search: !0,
        is_show: !1,
        cats: [],
        default_cat: []
    },
    onLoad: function(t) {
        a.pageOnLoad(this), this.cats();
    },
    onReady: function() {},
    onShow: function() {
        a.pageOnShow(this);
        var t = this;
        t.setData({
            history_list: t.getHistoryList(!0)
        });
    },
    cats: function() {
        var s = this;
        a.request({
            url: t.default.cats,
            success: function(t) {
                0 == t.code && s.setData({
                    cats: t.data.list,
                    default_cat: t.data.default_cat
                });
            }
        });
    },
    change_cat: function(t) {
        var a = this, s = a.data.cats, e = t.currentTarget.dataset.id;
        for (var i in s) if (e === s[i].id) var o = {
            id: s[i].id,
            name: s[i].name,
            key: s[i].key,
            url: s[i].url
        };
        a.setData({
            default_cat: o
        });
    },
    pullDown: function() {
        var t = this, a = t.data.cats, s = t.data.default_cat;
        for (var e in a) a[e].id === s.id ? a[e].is_active = !0 : a[e].is_active = !1;
        t.setData({
            is_show: !t.data.is_show,
            cats: a
        });
    },
    inputFocus: function() {
        this.setData({
            show_history: !0,
            show_result: !1
        });
    },
    inputBlur: function() {
        var t = this;
        t.data.goods_list.length > 0 && setTimeout(function() {
            t.setData({
                show_history: !1,
                show_result: !0
            });
        }, 300);
    },
    inputConfirm: function(t) {
        var a = this, s = t.detail.value;
        0 != s.length && (a.setData({
            page: 1,
            keyword: s
        }), a.setHistory(s), a.getGoodsList());
    },
    searchCancel: function() {
        wx.navigateBack({
            delta: 1
        });
    },
    historyClick: function(t) {
        var a = this, s = t.currentTarget.dataset.value;
        0 != s.length && (a.setData({
            page: 1,
            keyword: s
        }), a.getGoodsList());
    },
    getGoodsList: function() {
        var s = this;
        s.setData({
            show_history: !1,
            show_result: !0,
            is_search: !0
        }), s.setData({
            page: 1,
            scroll_top: 0
        }), s.setData({
            goods_list: []
        });
        var e = {};
        s.data.cat_id && (e.cat_id = s.data.cat_id, s.setActiveCat(e.cat_id)), s.data.keyword && (e.keyword = s.data.keyword), 
        e.defaultCat = s.data.default_cat, s.showLoadingBar(), s.is_loading = !0, a.request({
            url: t.default.search,
            data: e,
            success: function(t) {
                0 == t.code && (s.setData({
                    goods_list: t.data.list
                }), 0 == t.data.list.length ? s.setData({
                    is_search: !1
                }) : s.setData({
                    is_search: !0
                })), t.code;
            },
            complete: function() {
                s.hideLoadingBar(), s.is_loading = !1;
            }
        });
    },
    onListScrollBottom: function(t) {
        this.getMoreGoodsList();
    },
    getHistoryList: function(t) {
        t = t || !1;
        var a = wx.getStorageSync("search_history_list");
        if (!a) return [];
        if (!t) return a;
        for (var s = [], e = a.length - 1; e >= 0; e--) s.push(a[e]);
        return s;
    },
    setHistory: function(t) {
        var a = this.getHistoryList();
        a.push({
            keyword: t
        });
        for (var s in a) {
            if (a.length <= 20) break;
            a.splice(s, 1);
        }
        wx.setStorageSync("search_history_list", a);
    },
    getMoreGoodsList: function() {
        var s = this, e = {};
        s.data.cat_id && (e.cat_id = s.data.cat_id, s.setActiveCat(e.cat_id)), s.data.keyword && (e.keyword = s.data.keyword), 
        e.page = s.data.page || 1, s.showLoadingMoreBar(), s.setData({
            is_loading: !0
        }), s.setData({
            load_more_count: s.data.load_more_count + 1
        }), e.page = s.data.page + 1, e.defaultCat = s.data.default_cat, s.setData({
            page: e.page
        }), console.log(e), a.request({
            url: t.default.search,
            data: e,
            success: function(t) {
                if (0 == t.code) {
                    var a = s.data.goods_list;
                    if (t.data.list.length > 0) {
                        for (var i in t.data.list) a.push(t.data.list[i]);
                        s.setData({
                            goods_list: a
                        });
                    } else s.setData({
                        page: e.page - 1
                    });
                }
                t.code;
            },
            complete: function() {
                s.setData({
                    is_loading: !1
                }), s.hideLoadingMoreBar();
            }
        });
    },
    showLoadingBar: function() {
        this.setData({
            loading_class: "active"
        });
    },
    hideLoadingBar: function() {
        this.setData({
            loading_class: ""
        });
    },
    showLoadingMoreBar: function() {
        this.setData({
            loading_more_active: "active"
        });
    },
    hideLoadingMoreBar: function() {
        this.setData({
            loading_more_active: ""
        });
    },
    deleteSearchHistory: function() {
        this.setData({
            history_list: null
        }), wx.removeStorageSync("search_history_list");
    }
});