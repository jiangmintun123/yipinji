function t(t, a, o) {
    return a in t ? Object.defineProperty(t, a, {
        value: o,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[a] = o, t;
}

var a, o = require("../../../api.js"), e = require("../../../utils.js"), i = getApp();

Page((a = {
    data: {
        groupFail: 0,
        show_attr_picker: !1,
        form: {
            number: 1
        }
    },
    onLoad: function(t) {
        i.pageOnLoad(this);
        var a = 0, o = t.user_id, r = decodeURIComponent(t.scene);
        if (void 0 != o) a = o; else if (void 0 != r) {
            var s = e.scene_decode(r);
            s.uid && s.oid ? (a = s.uid, t.oid = s.oid) : a = r;
        }
        i.loginBindParent({
            parent_id: a
        }), this.setData({
            oid: t.oid
        }), this.getInfo(t);
    },
    onReady: function() {},
    onShow: function() {
        i.pageOnShow(this);
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function(t) {
        var a = this, o = wx.getStorageSync("user_info"), e = "/pages/pt/group/details?oid=" + a.data.oid + "&user_id=" + o.id;
        return {
            title: "快来" + a.data.goods.price + "元拼  " + a.data.goods.name,
            path: e,
            success: function(t) {}
        };
    },
    getInfo: function(t) {
        var a = t.oid, e = this;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), i.request({
            url: o.group.group_info,
            method: "get",
            data: {
                oid: a
            },
            success: function(t) {
                if (0 == t.code) {
                    0 == t.data.groupFail && e.countDownRun(t.data.limit_time_ms);
                    var a = (t.data.goods.original_price - t.data.goods.price).toFixed(2);
                    e.setData({
                        goods: t.data.goods,
                        groupList: t.data.groupList,
                        surplus: t.data.surplus,
                        limit_time_ms: t.data.limit_time_ms,
                        goods_list: t.data.goodsList,
                        group_fail: t.data.groupFail,
                        oid: t.data.oid,
                        in_group: t.data.inGroup,
                        attr_group_list: t.data.attr_group_list,
                        group_rule_id: t.data.groupRuleId,
                        reduce_price: a < 0 ? 0 : a,
                        group_id: t.data.goods.class_group
                    }), 0 != t.data.groupFail && t.data.inGroup && e.setData({
                        oid: !1,
                        group_id: !1
                    }), e.selectDefaultAttr();
                } else wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.redirectTo({
                            url: "/pages/pt/index/index"
                        });
                    }
                });
            },
            complete: function(t) {
                setTimeout(function() {
                    wx.hideLoading();
                }, 1e3);
            }
        });
    },
    selectDefaultAttr: function() {
        var t = this;
        if (!t.data.goods || 0 === t.data.goods.use_attr) for (var a in t.data.attr_group_list) for (var o in t.data.attr_group_list[a].attr_list) 0 == a && 0 == o && (t.data.attr_group_list[a].attr_list[o].checked = !0);
        t.setData({
            attr_group_list: t.data.attr_group_list
        });
    },
    countDownRun: function(t) {
        var a = this;
        setInterval(function() {
            var o = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]) - new Date(), e = parseInt(o / 1e3 / 60 / 60 / 24, 10), i = parseInt(o / 1e3 / 60 / 60 % 24, 10), r = parseInt(o / 1e3 / 60 % 60, 10), s = parseInt(o / 1e3 % 60, 10);
            e = a.checkTime(e), i = a.checkTime(i), r = a.checkTime(r), s = a.checkTime(s), 
            a.setData({
                limit_time: {
                    days: e,
                    hours: i,
                    mins: r,
                    secs: s
                }
            });
        }, 1e3);
    },
    checkTime: function(t) {
        return (t = t > 0 ? t : 0) < 10 && (t = "0" + t), t;
    },
    goToHome: function() {
        wx.redirectTo({
            url: "/pages/pt/index/index"
        });
    },
    goToGoodsDetails: function(t) {
        var a = this;
        wx.redirectTo({
            url: "/pages/pt/details/details?gid=" + a.data.goods.id
        });
    },
    hideAttrPicker: function() {
        this.setData({
            show_attr_picker: !1
        });
    },
    showAttrPicker: function() {
        this.setData({
            show_attr_picker: !0
        });
    },
    attrClick: function(t) {
        var a = this, e = t.target.dataset.groupId, r = t.target.dataset.id, s = a.data.attr_group_list;
        for (var d in s) if (s[d].attr_group_id == e) for (var n in s[d].attr_list) s[d].attr_list[n].attr_id == r ? s[d].attr_list[n].checked = !0 : s[d].attr_list[n].checked = !1;
        a.setData({
            attr_group_list: s
        });
        var u = [], c = !0;
        for (var d in s) {
            var l = !1;
            for (var n in s[d].attr_list) if (s[d].attr_list[n].checked) {
                u.push(s[d].attr_list[n].attr_id), l = !0;
                break;
            }
            if (!l) {
                c = !1;
                break;
            }
        }
        c && (wx.showLoading({
            title: "正在加载",
            mask: !0
        }), i.request({
            url: o.group.goods_attr_info,
            data: {
                goods_id: a.data.goods.id,
                group_id: a.data.goods.class_group,
                attr_list: JSON.stringify(u)
            },
            success: function(t) {
                if (wx.hideLoading(), 0 == t.code) {
                    var o = a.data.goods;
                    o.price = t.data.price, o.num = t.data.num, o.attr_pic = t.data.pic, a.setData({
                        goods: o
                    });
                }
            }
        }));
    },
    buyNow: function() {
        this.submit("GROUP_BUY_C");
    },
    submit: function(t) {
        var a = this;
        if (!a.data.show_attr_picker) return a.setData({
            show_attr_picker: !0
        }), !0;
        if (a.data.form.number > a.data.goods.num) return wx.showToast({
            title: "商品库存不足，请选择其它规格或数量",
            image: "/images/icon-warning.png"
        }), !0;
        var o = a.data.attr_group_list, e = [];
        for (var i in o) {
            var r = !1;
            for (var s in o[i].attr_list) if (o[i].attr_list[s].checked) {
                r = {
                    attr_id: o[i].attr_list[s].attr_id,
                    attr_name: o[i].attr_list[s].attr_name
                };
                break;
            }
            if (!r) return wx.showToast({
                title: "请选择" + o[i].attr_group_name,
                image: "/images/icon-warning.png"
            }), !0;
            e.push({
                attr_group_id: o[i].attr_group_id,
                attr_group_name: o[i].attr_group_name,
                attr_id: r.attr_id,
                attr_name: r.attr_name
            });
        }
        a.setData({
            show_attr_picker: !1
        }), wx.redirectTo({
            url: "/pages/pt/order-submit/order-submit?goods_info=" + JSON.stringify({
                goods_id: a.data.goods.id,
                attr: e,
                num: a.data.form.number,
                type: t,
                parent_id: a.data.oid,
                deliver_type: a.data.goods.type,
                group_id: a.data.goods.class_group
            })
        });
    },
    numberSub: function() {
        var t = this, a = t.data.form.number;
        if (a <= 1) return !0;
        a--, t.setData({
            form: {
                number: a
            }
        });
    },
    numberAdd: function() {
        var t = this, a = t.data.form.number;
        ++a > t.data.goods.one_buy_limit && 0 != t.data.goods.one_buy_limit ? wx.showModal({
            title: "提示",
            content: "最多只允许购买" + t.data.goods.one_buy_limit + "件",
            showCancel: !1
        }) : t.setData({
            form: {
                number: a
            }
        });
    },
    numberBlur: function(t) {
        var a = this, o = t.detail.value;
        if (o = parseInt(o), isNaN(o) && (o = 1), o <= 0 && (o = 1), o > a.data.goods.one_buy_limit && 0 != a.data.goods.one_buy_limit) return wx.showModal({
            title: "提示",
            content: "最多只允许购买" + a.data.goods.one_buy_limit + "件",
            showCancel: !1
        }), void a.setData({
            form: {
                number: o
            }
        });
        a.setData({
            form: {
                number: o
            }
        });
    },
    goArticle: function(t) {
        this.data.group_rule_id && wx.navigateTo({
            url: "/pages/article-detail/article-detail?id=" + this.data.group_rule_id
        });
    },
    showShareModal: function(t) {
        this.setData({
            share_modal_active: "active",
            no_scroll: !0
        });
    },
    shareModalClose: function() {
        this.setData({
            share_modal_active: "",
            no_scroll: !1
        });
    },
    getGoodsQrcode: function() {
        var t = this;
        if (t.setData({
            goods_qrcode_active: "active",
            share_modal_active: ""
        }), t.data.goods_qrcode) return !0;
        i.request({
            url: o.group.order.goods_qrcode,
            data: {
                order_id: t.data.oid
            },
            success: function(a) {
                0 == a.code && t.setData({
                    goods_qrcode: a.data.pic_url
                }), 1 == a.code && (t.goodsQrcodeClose(), wx.showModal({
                    title: "提示",
                    content: a.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm;
                    }
                }));
            }
        });
    },
    goodsQrcodeClose: function() {
        this.setData({
            goods_qrcode_active: "",
            no_scroll: !1
        });
    }
}, t(a, "goodsQrcodeClose", function() {
    this.setData({
        goods_qrcode_active: "",
        no_scroll: !1
    });
}), t(a, "saveGoodsQrcode", function() {
    var t = this;
    wx.saveImageToPhotosAlbum ? (wx.showLoading({
        title: "正在保存图片",
        mask: !1
    }), wx.downloadFile({
        url: t.data.goods_qrcode,
        success: function(t) {
            wx.showLoading({
                title: "正在保存图片",
                mask: !1
            }), wx.saveImageToPhotosAlbum({
                filePath: t.tempFilePath,
                success: function() {
                    wx.showModal({
                        title: "提示",
                        content: "商品海报保存成功",
                        showCancel: !1
                    });
                },
                fail: function(t) {
                    wx.showModal({
                        title: "图片保存失败",
                        content: t.errMsg,
                        showCancel: !1
                    });
                },
                complete: function(t) {
                    wx.hideLoading();
                }
            });
        },
        fail: function(a) {
            wx.showModal({
                title: "图片下载失败",
                content: a.errMsg + ";" + t.data.goods_qrcode,
                showCancel: !1
            });
        },
        complete: function(t) {
            wx.hideLoading();
        }
    })) : wx.showModal({
        title: "提示",
        content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。",
        showCancel: !1
    });
}), t(a, "goodsQrcodeClick", function(t) {
    var a = t.currentTarget.dataset.src;
    wx.previewImage({
        urls: [ a ]
    });
}), a));