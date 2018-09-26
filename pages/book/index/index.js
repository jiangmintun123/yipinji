var t = require("../../../api.js"), a = getApp();

Page({
    data: {
        cid: 0,
        scrollLeft: 600,
        scrollTop: 0,
        emptyGoods: 0,
        page: 1,
        pageCount: 0,
        cat_show: 1,
        cid_url: !1,
        quick_icon: !0
    },
    onLoad: function(t) {
        var o = this;
        if (o.systemInfo = wx.getSystemInfoSync(), a.pageOnLoad(o), t.cid) {
            t.cid;
            return this.setData({
                cid_url: !1
            }), void this.switchNav({
                currentTarget: {
                    dataset: {
                        id: t.cid
                    }
                }
            });
        }
        this.setData({
            cid_url: !0
        }), this.loadIndexInfo(this);
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
    onReady: function() {},
    onShow: function() {
        a.pageOnShow(this);
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onShareAppMessage: function() {},
    loadIndexInfo: function() {
        var o = this;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), a.request({
            url: t.book.index,
            method: "get",
            success: function(t) {
                0 == t.code && (wx.hideLoading(), o.setData({
                    cat: t.data.cat,
                    goods: t.data.goods.list,
                    cat_show: t.data.cat_show,
                    page: t.data.goods.page,
                    pageCount: t.data.goods.page_count
                }), !t.data.goods.list.length > 0 && o.setData({
                    emptyGoods: 1
                }));
            }
        });
    },
    switchNav: function(o) {
        var e = this;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        });
        var s = 0;
        if (s != o.currentTarget.dataset.id || 0 == o.currentTarget.dataset.id) {
            s = o.currentTarget.dataset.id;
            var i = e.systemInfo.windowWidth, d = o.currentTarget.offsetLeft, n = e.data.scrollLeft;
            n = d > i / 2 ? d : 0, e.setData({
                cid: s,
                page: 1,
                scrollLeft: n,
                scrollTop: 0,
                emptyGoods: 0,
                goods: [],
                show_loading_bar: 1
            }), a.request({
                url: t.book.list,
                method: "get",
                data: {
                    cid: s
                },
                success: function(t) {
                    if (0 == t.code) {
                        wx.hideLoading();
                        var a = t.data.list;
                        t.data.page_count >= t.data.page ? e.setData({
                            goods: a,
                            page: t.data.page,
                            pageCount: t.data.page_count,
                            show_loading_bar: 0
                        }) : e.setData({
                            emptyGoods: 1
                        });
                    }
                }
            });
        }
    },
    onReachBottom: function(o) {
        var e = this, s = e.data.page, i = e.data.pageCount, d = e.data.cid;
        e.setData({
            show_loading_bar: 1
        }), ++s > i ? e.setData({
            emptyGoods: 1,
            show_loading_bar: 0
        }) : a.request({
            url: t.book.list,
            method: "get",
            data: {
                page: s,
                cid: d
            },
            success: function(t) {
                if (0 == t.code) {
                    var a = e.data.goods;
                    Array.prototype.push.apply(a, t.data.list), e.setData({
                        show_loading_bar: 0,
                        goods: a,
                        page: t.data.page,
                        pageCount: t.data.page_count,
                        emptyGoods: 0
                    });
                }
            }
        });
    }
});