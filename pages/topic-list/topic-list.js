var a = require("../../api.js"), t = getApp();

Page({
    data: {
        backgrop: [ "navbar-item-active" ],
        navbarArray: [],
        navbarShowIndexArray: 0,
        navigation: !1,
        windowWidth: 375,
        scrollNavbarLeft: 0,
        currentChannelIndex: 0,
        articlesHide: !1
    },
    onLoad: function(a) {
        var e = a.type;
        void 0 !== e && e && this.setData({
            typeid: e
        }), this.systemInfo = wx.getSystemInfoSync(), t.pageOnLoad(this), this.loadTopicList({
            page: 1,
            reload: !0
        });
        var i = this;
        wx.getSystemInfo({
            success: function(a) {
                i.setData({
                    windowWidth: a.windowWidth
                });
            }
        });
        this.data.navbarArray, this.data.navbarShowIndexArray;
    },
    loadTopicList: function(e) {
        var i = this;
        i.data.is_loading || e.loadmore && !i.data.is_more || (i.setData({
            is_loading: !0
        }), t.request({
            url: a.default.topic_type,
            data: {},
            success: function(r) {
                0 == r.code && i.setData({
                    navbarArray: r.data.list,
                    navbarShowIndexArray: Array.from(Array(r.data.list.length).keys()),
                    navigation: "" != r.data.list
                }), t.request({
                    url: a.default.topic_list,
                    data: {
                        page: e.page
                    },
                    success: function(a) {
                        if (0 == a.code) if (void 0 !== i.data.typeid) {
                            for (var t = 0, r = 0; r < i.data.navbarArray.length && (t += 66, i.data.navbarArray[r].id != i.data.typeid); r++) ;
                            i.setData({
                                scrollNavbarLeft: t
                            }), i.switchChannel(parseInt(i.data.typeid)), i.sortTopic({
                                page: 1,
                                type: i.data.typeid,
                                reload: !0
                            });
                        } else e.reload && i.setData({
                            list: a.data.list,
                            page: e.page,
                            is_more: a.data.list.length > 0
                        }), e.loadmore && i.setData({
                            list: i.data.list.concat(a.data.list),
                            page: e.page,
                            is_more: a.data.list.length > 0
                        });
                    },
                    complete: function() {
                        i.setData({
                            is_loading: !1
                        });
                    }
                });
            }
        }));
    },
    onShow: function() {
        t.pageOnShow(this);
    },
    onPullDownRefresh: function() {
        var a = this.data.currentChannelIndex;
        this.switchChannel(parseInt(a)), this.sortTopic({
            page: 1,
            type: parseInt(a),
            reload: !0
        }), wx.stopPullDownRefresh();
    },
    onReachBottom: function() {
        var a = this.data.currentChannelIndex;
        this.switchChannel(parseInt(a)), this.sortTopic({
            page: this.data.page + 1,
            type: parseInt(a),
            loadmore: !0
        });
    },
    onTapNavbar: function(a) {
        var t = a.currentTarget.offsetLeft;
        this.setData({
            scrollNavbarLeft: t - 85
        }), wx.showLoading({
            title: "正在加载",
            mask: !0
        }), this.switchChannel(parseInt(a.currentTarget.id)), this.sortTopic({
            page: 1,
            type: a.currentTarget.id,
            reload: !0
        });
    },
    sortTopic: function(e) {
        var i = this;
        t.request({
            url: a.default.topic_list,
            data: e,
            success: function(a) {
                0 == a.code && (e.reload && i.setData({
                    list: a.data.list,
                    page: e.page,
                    is_more: a.data.list.length > 0
                }), e.loadmore && i.setData({
                    list: i.data.list.concat(a.data.list),
                    page: e.page,
                    is_more: a.data.list.length > 0
                }), wx.hideLoading());
            }
        });
    },
    switchChannel: function(a) {
        var t = this.data.navbarArray, e = new Array();
        -1 == a ? e[1] = "navbar-item-active" : 0 == a && (e[0] = "navbar-item-active"), 
        t.forEach(function(t, e, i) {
            t.type = "", t.id == a && (t.type = "navbar-item-active");
        }), this.setData({
            navbarArray: t,
            currentChannelIndex: a,
            backgrop: e
        });
    }
});