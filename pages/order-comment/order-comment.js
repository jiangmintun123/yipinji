var t = require("../../api.js"), e = getApp();

Page({
    data: {
        goods_list: []
    },
    onLoad: function(a) {
        e.pageOnLoad(this);
        var i = this;
        if (a.inId) o = {
            order_id: a.inId,
            type: "IN"
        }; else var o = {
            order_id: a.id,
            type: "mall"
        };
        i.setData({
            order_id: o.order_id,
            type: o.type
        }), wx.showLoading({
            title: "正在加载",
            mask: !0
        }), e.request({
            url: t.order.comment_preview,
            data: o,
            success: function(t) {
                if (wx.hideLoading(), 1 == t.code && wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.navigateBack();
                    }
                }), 0 == t.code) {
                    for (var e in t.data.goods_list) t.data.goods_list[e].score = 3, t.data.goods_list[e].content = "", 
                    t.data.goods_list[e].pic_list = [], t.data.goods_list[e].uploaded_pic_list = [];
                    i.setData({
                        goods_list: t.data.goods_list
                    });
                }
            }
        });
    },
    setScore: function(t) {
        var e = this, a = t.currentTarget.dataset.index, i = t.currentTarget.dataset.score, o = e.data.goods_list;
        o[a].score = i, e.setData({
            goods_list: o
        });
    },
    contentInput: function(t) {
        var e = this, a = t.currentTarget.dataset.index;
        e.data.goods_list[a].content = t.detail.value, e.setData({
            goods_list: e.data.goods_list
        });
    },
    chooseImage: function(t) {
        var e = this, a = t.currentTarget.dataset.index, i = e.data.goods_list, o = i[a].pic_list.length;
        wx.chooseImage({
            count: 6 - o,
            success: function(t) {
                i[a].pic_list = i[a].pic_list.concat(t.tempFilePaths), e.setData({
                    goods_list: i
                });
            }
        });
    },
    deleteImage: function(t) {
        var e = this, a = t.currentTarget.dataset.index, i = t.currentTarget.dataset.picIndex, o = e.data.goods_list;
        o[a].pic_list.splice(i, 1), e.setData({
            goods_list: o
        });
    },
    commentSubmit: function(a) {
        function i(e) {
            if (e == n.length) return o();
            var a = 0;
            if (!n[e].pic_list.length || 0 == n[e].pic_list.length) return i(e + 1);
            for (var s in n[e].pic_list) !function(o) {
                wx.uploadFile({
                    url: t.default.upload_image,
                    name: "image",
                    formData: r,
                    filePath: n[e].pic_list[o],
                    complete: function(t) {
                        if (t.data) {
                            var s = JSON.parse(t.data);
                            0 == s.code && (n[e].uploaded_pic_list[o] = s.data.url);
                        }
                        if (++a == n[e].pic_list.length) return i(e + 1);
                    }
                });
            }(s);
        }
        function o() {
            e.request({
                url: t.order.comment,
                method: "post",
                data: {
                    order_id: s.data.order_id,
                    goods_list: JSON.stringify(n),
                    type: s.data.type
                },
                success: function(t) {
                    wx.hideLoading(), 0 == t.code && wx.showModal({
                        title: "提示",
                        content: t.msg,
                        showCancel: !1,
                        success: function(e) {
                            e.confirm && ("IN" == t.type ? wx.redirectTo({
                                url: "/pages/integral-mall/order/order?status=3"
                            }) : wx.redirectTo({
                                url: "/pages/order/order?status=3"
                            }));
                        }
                    }), 1 == t.code && wx.showToast({
                        title: t.msg,
                        image: "/images/icon-warning.png"
                    });
                }
            });
        }
        var s = this;
        wx.showLoading({
            title: "正在提交",
            mask: !0
        });
        var n = s.data.goods_list, d = e.siteInfo, r = {};
        -1 != d.uniacid && "-1" != d.acid && (r._uniacid = d.uniacid, r._acid = d.acid), 
        i(0);
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});