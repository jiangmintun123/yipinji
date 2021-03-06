var a = require("../../api.js"),
    t = getApp();
Page({
    data: {
        args: !1,
        page: 1
    },
    onLoad: function() {
        t.pageOnLoad(this)
    },
    onShow: function() {
        var e = this;
        wx.showLoading({
            title: "加载中"
        }), t.request({
            url: a.pond.prize,
            data: {
                page: 1
            },
            success: function(a) {
                0 != a.code || e.setData({
                    list: e.setName(a.data)
                })
            },
            complete: function(a) {
                wx.hideLoading()
            }
        })
    },
    onReachBottom: function() {
        var e = this;
        if (!e.data.args) {
            var s = e.data.page + 1;
            t.request({
                url: a.pond.prize,
                data: {
                    page: s
                },
                success: function(a) {
                    if (0 == a.code) {
                        var t = e.setName(a.data);
                        e.setData({
                            list: e.data.list.concat(t),
                            page: s
                        })
                    } else e.data.args = !0
                }
            })
        }
    },
    setName: function(a) {
        return a.forEach(function(t, e, s) {
            switch (t.type) {
                case 1:
                    a[e].name = t.price + "元红包";
                    break;
                case 2:
                    a[e].name = t.coupon;
                    break;
                case 3:
                    a[e].name = t.num + "积分";
                    break;
                case 4:
                    a[e].name = t.gift;
                    break;
                case 5:
                    a[e].name = "谢谢参与"
            }
        }), a
    },
    send: function(e) {
        var s = e.currentTarget.dataset.id,
            n = (e.currentTarget.dataset.type, this);
        t.request({
            url: a.pond.send,
            data: {
                id: s
            },
            success: function(a) {
                var t = "";
                if (0 == a.code) {
                    var e = n.data.list;
                    e.forEach(function(t, s, n) {
                        t.id == a.data.id && (e[s].status = 1)
                    }), n.setData({
                        list: e
                    }), t = "恭喜你"
                } else t = "很抱歉";
                wx.showModal({
                    title: t,
                    content: a.msg,
                    showCancel: !1,
                    success: function(a) {
                        a.confirm
                    }
                })
            }
        })
    },
    submit: function(a) {
        var t = a.currentTarget.dataset.gift,
            e = JSON.parse(a.currentTarget.dataset.attr),
            s = a.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/pages/order-submit/order-submit?pond_id=" + s + "&goods_info=" + JSON.stringify({
                goods_id: t,
                attr: e,
                num: 1
            })
        })
    }
});