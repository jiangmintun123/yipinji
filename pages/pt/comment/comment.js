var t = require("../../../api.js"), a = getApp(), n = !1, e = !1, o = 2;

Page({
    data: {},
    onLoad: function(c) {
        a.pageOnLoad(this), n = !1, e = !1, o = 2;
        var i = this;
        i.setData({
            gid: c.id
        }), wx.showLoading({
            title: "正在加载",
            mask: !0
        }), a.request({
            url: t.group.comment,
            data: {
                gid: c.id
            },
            success: function(t) {
                wx.hideLoading(), 1 == t.code && wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.navigateBack();
                    }
                }), 0 == t.code && (0 == t.data.comment.length && wx.showModal({
                    title: "提示",
                    content: "暂无评价",
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.navigateBack();
                    }
                }), i.setData({
                    comment: t.data.comment
                })), i.setData({
                    show_no_data_tip: 0 == i.data.comment.length
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        var c = this;
        e || n || (e = !0, a.request({
            url: t.group.comment,
            data: {
                gid: c.data.gid,
                page: o
            },
            success: function(t) {
                if (0 == t.code) {
                    var a = c.data.comment.concat(t.data.comment);
                    c.setData({
                        comment: a
                    }), 0 == t.data.comment.length && (n = !0);
                }
                o++;
            },
            complete: function() {
                e = !1;
            }
        }));
    },
    onShareAppMessage: function() {},
    bigToImage: function(t) {
        var a = this.data.comment[t.target.dataset.index].pic_list;
        wx.previewImage({
            current: t.target.dataset.url,
            urls: a
        });
    }
});