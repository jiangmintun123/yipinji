var a = require("../../../api.js"), t = getApp();

Page({
    data: {
        cid: 0,
        scrollLeft: 600,
        scrollTop: 0,
        emptyGoods: 0,
        page_count: 0,
        pt_url: !1,
        page: 1,
        is_show: 0,
        quick_icon: !0
    },
    onLoad: function(o) {
        this.systemInfo = wx.getSystemInfoSync(), t.pageOnLoad(this);
        var e = wx.getStorageSync("store");
        this.setData({
            store: e
        });
        var n = this;
        if (o.cid) {
            var i = o.cid;
            return console.log("cid=>" + i), this.setData({
                pt_url: !1
            }), wx.showLoading({
                title: "正在加载",
                mask: !0
            }), void t.request({
                url: a.group.index,
                method: "get",
                success: function(a) {
                    n.switchNav({
                        currentTarget: {
                            dataset: {
                                id: o.cid
                            }
                        }
                    }), 0 == a.code && n.setData({
                        banner: a.data.banner,
                        ad: a.data.ad,
                        page: a.data.goods.page,
                        page_count: a.data.goods.page_count
                    });
                }
            });
        }
        this.setData({
            pt_url: !0
        }), this.loadIndexInfo(this);
    },
    onReady: function() {},
    quickNavigation: function() {
        this.setData({
            quick_icon: !this.data.quick_icon
        });
        var a = this.data.store, t = wx.createAnimation({
            duration: 300,
            timingFunction: "ease-out"
        }), o = wx.createAnimation({
            duration: 300,
            timingFunction: "ease-out"
        }), e = wx.createAnimation({
            duration: 300,
            timingFunction: "ease-out"
        }), n = wx.createAnimation({
            duration: 300,
            timingFunction: "ease-out"
        }), i = wx.createAnimation({
            duration: 300,
            timingFunction: "ease-out"
        }), s = -55;
        this.data.quick_icon ? (t.opacity(0).step(), e.opacity(0).step(), o.opacity(0).step(), 
        n.opacity(0).step(), i.opacity(0).step()) : (a.option && a.option.wxapp && a.option.wxapp.pic_url && (i.translateY(s).opacity(1).step(), 
        s -= 55), a.show_customer_service && 1 == a.show_customer_service && a.service && (n.translateY(s).opacity(1).step(), 
        s -= 55), a.option && a.option.web_service && (e.translateY(s).opacity(1).step(), 
        s -= 55), 1 == a.dial && a.dial_pic && (o.translateY(s).opacity(1).step(), s -= 55), 
        t.translateY(s).opacity(1).step()), this.setData({
            animationPlus: t.export(),
            animationPic: o.export(),
            animationcollect: e.export(),
            animationTranspond: n.export(),
            animationInput: i.export()
        });
    },
    onShow: function() {
        t.pageOnShow(this);
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        var a = this;
        a.setData({
            show_loading_bar: 1
        }), a.data.page < a.data.page_count ? (a.setData({
            page: a.data.page + 1
        }), a.getGoods(a)) : a.setData({
            is_show: 1,
            emptyGoods: 1,
            show_loading_bar: 0
        });
    },
    onShareAppMessage: function() {},
    loadIndexInfo: function(o) {
        var e = o;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), t.request({
            url: a.group.index,
            method: "get",
            data: {
                page: e.data.page
            },
            success: function(a) {
                0 == a.code && (wx.hideLoading(), e.setData({
                    cat: a.data.cat,
                    banner: a.data.banner,
                    ad: a.data.ad,
                    goods: a.data.goods.list,
                    page: a.data.goods.page,
                    page_count: a.data.goods.page_count
                }), a.data.goods.row_count <= 0 && e.setData({
                    emptyGoods: 1
                }));
            }
        });
    },
    getGoods: function(o) {
        var e = o;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), t.request({
            url: a.group.list,
            method: "get",
            data: {
                page: e.data.page
            },
            success: function(a) {
                0 == a.code && (wx.hideLoading(), e.data.goods = e.data.goods.concat(a.data.list), 
                e.setData({
                    goods: e.data.goods,
                    page: a.data.page,
                    page_count: a.data.page_count,
                    show_loading_bar: 0
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
        var n = 0;
        if (n != o.currentTarget.dataset.id || 0 == o.currentTarget.dataset.id) {
            n = o.currentTarget.dataset.id;
            var i = this.systemInfo.windowWidth, s = o.currentTarget.offsetLeft, d = this.data.scrollLeft;
            d = s > i / 2 ? s : 0, e.setData({
                cid: n,
                page: 1,
                scrollLeft: d,
                scrollTop: 0,
                emptyGoods: 0,
                goods: [],
                show_loading_bar: 1,
                is_show: 0
            }), t.request({
                url: a.group.list,
                method: "get",
                data: {
                    cid: n
                },
                success: function(a) {
                    if (0 == a.code) {
                        setTimeout(function() {
                            wx.hideLoading();
                        }, 1e3);
                        var t = a.data.list;
                        a.data.page_count >= a.data.page ? e.setData({
                            goods: t,
                            page: a.data.page,
                            page_count: a.data.page_count,
                            row_count: a.data.row_count,
                            show_loading_bar: 0
                        }) : e.setData({
                            emptyGoods: 1
                        });
                    }
                }
            });
        }
    },
    pullDownLoading: function(o) {
        var e = this;
        if (1 != e.data.emptyGoods && 1 != e.data.show_loading_bar) {
            e.setData({
                show_loading_bar: 1
            });
            var n = parseInt(e.data.page + 1), i = e.data.cid;
            t.request({
                url: a.group.list,
                method: "get",
                data: {
                    page: n,
                    cid: i
                },
                success: function(a) {
                    if (0 == a.code) {
                        var t = e.data.goods;
                        a.data.page > e.data.page && Array.prototype.push.apply(t, a.data.list), a.data.page_count >= a.data.page ? e.setData({
                            goods: t,
                            page: a.data.page,
                            page_count: a.data.page_count,
                            row_count: a.data.row_count,
                            show_loading_bar: 0
                        }) : e.setData({
                            emptyGoods: 1
                        });
                    }
                }
            });
        }
    },
    navigatorClick: function(a) {
        var t = a.currentTarget.dataset.open_type, o = a.currentTarget.dataset.url;
        return "wxapp" != t || (o = function(a) {
            var t = /([^&=]+)=([\w\W]*?)(&|$|#)/g, o = /^[^\?]+\?([\w\W]+)$/.exec(a), e = {};
            if (o && o[1]) for (var n, i = o[1]; null != (n = t.exec(i)); ) e[n[1]] = n[2];
            return e;
        }(o), o.path = o.path ? decodeURIComponent(o.path) : "", wx.navigateToMiniProgram({
            appId: o.appId,
            path: o.path,
            complete: function(a) {}
        }), !1);
    },
    to_dial: function() {
        var a = this.data.store.contact_tel;
        wx.makePhoneCall({
            phoneNumber: a
        });
    }
});