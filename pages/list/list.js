var t = require("../../api.js"), a = getApp(), i = !1, e = !1;

Page({
    data: {
        cat_id: "",
        page: 1,
        cat_list: [],
        goods_list: [],
        sort: 0,
        sort_type: -1,
        quick_icon: !0
    },
    onLoad: function(t) {
        a.pageOnLoad(this), this.loadData(t);
    },
    loadData: function(t) {
        var a = this, i = wx.getStorageSync("cat_list"), e = "";
        if (t.cat_id) for (var s in i) {
            var o = !1;
            i[s].id == t.cat_id && (i[s].checked = !0, i[s].list.length > 0 && (e = "height-bar"));
            for (var d in i[s].list) i[s].list[d].id == t.cat_id && (i[s].list[d].checked = !0, 
            o = !0, e = "height-bar");
            o && (i[s].checked = !0);
        }
        if (t.goods_id) var r = t.goods_id;
        a.setData({
            cat_list: i,
            cat_id: t.cat_id || "",
            height_bar: e,
            goods_id: r || ""
        }), a.reloadGoodsList();
    },
    catClick: function(t) {
        var a = this, i = "", e = t.currentTarget.dataset.index, s = a.data.cat_list;
        for (var o in s) {
            for (var d in s[o].list) s[o].list[d].checked = !1;
            o == e ? (s[o].checked = !0, i = s[o].id) : s[o].checked = !1;
        }
        var r = "";
        s[e].list.length > 0 && (r = "height-bar"), a.setData({
            cat_list: s,
            cat_id: i,
            height_bar: r
        }), a.reloadGoodsList();
    },
    quickNavigation: function() {
        this.setData({
            quick_icon: !this.data.quick_icon
        });
        this.data.store;
        var t = wx.createAnimation({
            duration: 300,
            timingFunction: "ease-out"
        });
        this.data.quick_icon ? t.opacity(0).step() : t.translateY(-55).opacity(1).step(), 
        this.setData({
            animationPlus: t.export()
        });
    },
    subCatClick: function(t) {
        var a = this, i = "", e = t.currentTarget.dataset.index, s = t.currentTarget.dataset.parentIndex, o = a.data.cat_list;
        for (var d in o) for (var r in o[d].list) d == s && r == e ? (o[d].list[r].checked = !0, 
        i = o[d].list[r].id) : o[d].list[r].checked = !1;
        a.setData({
            cat_list: o,
            cat_id: i
        }), a.reloadGoodsList();
    },
    allClick: function() {
        var t = this, a = t.data.cat_list;
        for (var i in a) {
            for (var e in a[i].list) a[i].list[e].checked = !1;
            a[i].checked = !1;
        }
        t.setData({
            cat_list: a,
            cat_id: "",
            height_bar: ""
        }), t.reloadGoodsList();
    },
    reloadGoodsList: function() {
        var i = this;
        e = !1, i.setData({
            page: 1,
            goods_list: [],
            show_no_data_tip: !1
        });
        var s = i.data.cat_id || "", o = i.data.page || 1;
        a.request({
            url: t.default.goods_list,
            data: {
                cat_id: s,
                page: o,
                sort: i.data.sort,
                sort_type: i.data.sort_type,
                goods_id: i.data.goods_id
            },
            success: function(t) {
                0 == t.code && (0 == t.data.list.length && (e = !0), i.setData({
                    page: o + 1
                }), i.setData({
                    goods_list: t.data.list
                })), i.setData({
                    show_no_data_tip: 0 == i.data.goods_list.length
                });
            },
            complete: function() {}
        });
    },
    loadMoreGoodsList: function() {
        var s = this;
        if (!i) {
            s.setData({
                show_loading_bar: !0
            }), i = !0;
            var o = s.data.cat_id || "", d = s.data.page || 2, r = s.data.goods_id;
            a.request({
                url: t.default.goods_list,
                data: {
                    page: d,
                    cat_id: o,
                    sort: s.data.sort,
                    sort_type: s.data.sort_type,
                    goods_id: r
                },
                success: function(t) {
                    0 == t.data.list.length && (e = !0);
                    var a = s.data.goods_list.concat(t.data.list);
                    s.setData({
                        goods_list: a,
                        page: d + 1
                    });
                },
                complete: function() {
                    i = !1, s.setData({
                        show_loading_bar: !1
                    });
                }
            });
        }
    },
    onReachBottom: function() {
        var t = this;
        e || t.loadMoreGoodsList();
    },
    onShow: function(t) {
        a.pageOnShow(this);
        var i = this;
        if (wx.getStorageSync("list_page_reload")) {
            var e = wx.getStorageSync("list_page_options");
            wx.removeStorageSync("list_page_options"), wx.removeStorageSync("list_page_reload");
            var s = e.cat_id || "";
            i.setData({
                cat_id: s
            });
            var o = i.data.cat_list;
            for (var d in o) {
                var r = !1;
                for (var c in o[d].list) o[d].list[c].id == s ? (o[d].list[c].checked = !0, r = !0) : o[d].list[c].checked = !1;
                r || s == o[d].id ? (o[d].checked = !0, o[d].list && o[d].list.length > 0 && i.setData({
                    height_bar: "height-bar"
                })) : o[d].checked = !1;
            }
            i.setData({
                cat_list: o
            }), i.reloadGoodsList();
        }
    },
    sortClick: function(t) {
        var a = this, i = t.currentTarget.dataset.sort, e = void 0 == t.currentTarget.dataset.default_sort_type ? -1 : t.currentTarget.dataset.default_sort_type, s = a.data.sort_type;
        if (a.data.sort == i) {
            if (-1 == e) return;
            s = -1 == a.data.sort_type ? e : 0 == s ? 1 : 0;
        } else s = e;
        a.setData({
            sort: i,
            sort_type: s
        }), a.reloadGoodsList();
    },
    onReady: function() {},
    onHide: function() {},
    onUnload: function() {},
    onShareAppMessage: function(t) {
        return {
            path: "/pages/list/list?user_id=" + wx.getStorageSync("user_info").id,
            success: function(t) {}
        };
    },
    onPullDownRefresh: function() {}
});