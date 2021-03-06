function t(t) {
    if (t < 60) return "00:00:" + ((e = t) < 10 ? "0" + e : e);
    if (t < 3600) {
        e = t % 60;
        return "00:" + ((i = parseInt(t / 60)) < 10 ? "0" + i : i) + ":" + (e < 10 ? "0" + e : e);
    }
    if (t >= 3600) {
        var a = parseInt(t / 3600), i = parseInt(t % 3600 / 60), e = t % 60;
        return (a < 10 ? "0" + a : a) + ":" + (i < 10 ? "0" + i : i) + ":" + (e < 10 ? "0" + e : e);
    }
}

var a = require("../../api.js"), i = getApp();

Page({
    data: {
        time_list: null,
        goods_list: null,
        page: 1,
        loading_more: !1,
        status: !0,
        quick_icon: !0
    },
    onLoad: function(t) {
        i.pageOnLoad(this), this.loadData(t);
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
    loadData: function(t) {
        var e = this;
        i.request({
            url: a.miaosha.list,
            success: function(t) {
                if (0 == t.code) if (0 == t.data.list.length) {
                    if (0 == t.data.next_list.length) return void wx.showModal({
                        content: "暂无秒杀活动",
                        showCancel: !1,
                        confirmText: "返回首页",
                        success: function(t) {
                            t.confirm && wx.navigateBack({
                                url: "/pages/index/index"
                            });
                        }
                    });
                    e.setData({
                        goods_list: t.data.next_list.list,
                        ms_active: !0,
                        time_list: t.data.list,
                        next_list: t.data.next_list.list,
                        next_time: t.data.next_list.time
                    });
                } else e.setData({
                    time_list: t.data.list,
                    next_list: "" == t.data.next_list ? [] : t.data.next_list.list,
                    next_time: "" == t.data.next_list ? [] : t.data.next_list.time,
                    ms_active: !1
                }), e.topBarScrollCenter(), e.setTimeOver(), e.loadGoodsList(!1);
                1 == t.code && wx.showModal({
                    title: "提示",
                    content: t.msg,
                    success: function() {
                        wx.navigateBack({
                            url: "/pages/index/index"
                        });
                    },
                    showCancel: !1
                });
            }
        });
    },
    setTimeOver: function() {
        function a() {
            for (var a in i.data.time_list) {
                var e = i.data.time_list[a].begin_time - i.data.time_list[a].now_time, s = i.data.time_list[a].end_time - i.data.time_list[a].now_time;
                e = e > 0 ? e : 0, s = s > 0 ? s : 0, i.data.time_list[a].begin_time_over = t(e), 
                i.data.time_list[a].end_time_over = t(s), i.data.time_list[a].now_time = i.data.time_list[a].now_time + 1;
            }
            i.setData({
                time_list: i.data.time_list
            });
        }
        var i = this;
        a(), setInterval(function() {
            a();
        }, 1e3);
    },
    miaosha_next: function() {
        var t = this, a = t.data.time_list;
        a.forEach(function(t, i, e) {
            a[i].active = !1;
        }), t.setData({
            goods_list: null,
            ms_active: !0,
            time_list: a
        }), setTimeout(function() {
            t.setData({
                goods_list: t.data.next_list
            });
        }, 500);
    },
    topBarScrollCenter: function() {
        var t = this, a = 0;
        for (var i in t.data.time_list) if (t.data.time_list[i].active) {
            a = i;
            break;
        }
        t.setData({
            top_bar_scroll: 64 * (a - 2)
        });
    },
    topBarItemClick: function(t) {
        var a = this, i = t.currentTarget.dataset.index;
        for (var e in a.data.time_list) a.data.time_list[e].active = i == e;
        a.setData({
            time_list: a.data.time_list,
            loading_more: !1,
            page: 1,
            ms_active: !1
        }), a.topBarScrollCenter(), a.loadGoodsList(!1);
    },
    loadGoodsList: function(t) {
        var e = this, s = !1;
        for (var n in e.data.time_list) {
            if (e.data.time_list[n].active) {
                s = e.data.time_list[n].start_time;
                break;
            }
            e.data.time_list.length == parseInt(n) + 1 && 0 == s && (s = e.data.time_list[0].start_time, 
            e.data.time_list[0].active = !0);
        }
        t ? e.setData({
            loading_more: !0
        }) : e.setData({
            goods_list: null
        }), i.request({
            url: a.miaosha.goods_list,
            data: {
                time: s,
                page: e.data.page
            },
            success: function(a) {
                0 == a.code && (e.data.goods_list = t ? e.data.goods_list.concat(a.data.list) : a.data.list, 
                e.setData({
                    loading_more: !1,
                    goods_list: e.data.goods_list,
                    page: a.data.list && 0 != a.data.list.length ? e.data.page + 1 : -1
                }));
            }
        });
    },
    onReady: function() {},
    onShow: function() {
        i.pageOnShow(this);
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        var t = this;
        -1 != t.data.page && t.loadGoodsList(!0);
    },
    onShareAppMessage: function() {}
});