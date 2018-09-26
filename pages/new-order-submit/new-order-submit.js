var t = require("../../api.js"), e = getApp(), a = "", i = "", s = require("../../utils/utils.js"), n = !1;

Page({
    data: {
        total_price: 0,
        address: null,
        express_price: 0,
        express_price_1: 0,
        integral_radio: 1,
        new_total_price: 0,
        show_card: !1,
        payment: -1,
        show_payment: !1,
        show_more: !1,
        index: -1,
        mch_offline: !0
    },
    onLoad: function(t) {
        e.pageOnLoad(this);
        var a = this, i = s.formatData(new Date());
        wx.removeStorageSync("input_data"), a.setData({
            options: t,
            store: wx.getStorageSync("store"),
            time: i
        }), n = !1;
    },
    bindkeyinput: function(t) {
        this.data.mch_list[t.currentTarget.dataset.index].content = t.detail.value, this.setData({
            mch_list: this.data.mch_list
        });
    },
    KeyName: function(t) {
        var e = this.data.mch_list;
        e[t.currentTarget.dataset.index].offline_name = t.detail.value, this.setData({
            mch_list: e
        });
    },
    KeyMobile: function(t) {
        var e = this.data.mch_list;
        e[t.currentTarget.dataset.index].offline_mobile = t.detail.value, this.setData({
            mch_list: e
        });
    },
    getOffline: function(t) {
        var e = this, a = t.currentTarget.dataset.offline, i = t.currentTarget.dataset.index, s = e.data.mch_list;
        s[i].offline = a, e.setData({
            mch_list: s
        }), 1 == s.length && 0 == s[0].mch_id && 1 == s[0].offline ? e.setData({
            mch_offline: !1
        }) : e.setData({
            mch_offline: !0
        }), e.getPrice();
    },
    dingwei: function() {
        var t = this;
        wx.chooseLocation({
            success: function(e) {
                a = e.longitude, i = e.latitude, t.setData({
                    location: e.address
                }), t.getOrderData(t.data.options);
            },
            fail: function(a) {
                e.getauth({
                    content: "需要获取您的地理位置授权，请到小程序设置中打开授权",
                    success: function(e) {
                        e && (e.authSetting["scope.userLocation"] ? t.dingwei() : wx.showToast({
                            title: "您取消了授权",
                            image: "/images/icon-warning.png"
                        }));
                    }
                });
            }
        });
    },
    orderSubmit: function(t) {
        var e = this, a = {}, i = e.data.mch_list;
        for (var s in i) {
            var n = i[s].form;
            if (n && 1 == n.is_form && 0 == i[s].mch_id) {
                var o = n.list;
                for (var r in o) if (1 == o[r].required) if ("radio" == o[r].type || "checkbox" == o[r].type) {
                    var d = !1;
                    for (var s in o[r].default_list) 1 == o[r].default_list[s].is_selected && (d = !0);
                    if (!d) return wx.showModal({
                        title: "提示",
                        content: "请填写" + n.name + "，加‘*’为必填项",
                        showCancel: !1
                    }), !1;
                } else if (!o[r].default || void 0 == o[r].default) return wx.showModal({
                    title: "提示",
                    content: "请填写" + n.name + "，加‘*’为必填项",
                    showCancel: !1
                }), !1;
            }
            if (1 == i.length && 0 == i[s].mch_id && 1 == i[s].offline) ; else {
                if (!e.data.address) return wx.showModal({
                    title: "提示",
                    content: "请选择收货地址",
                    showCancel: !1
                }), !1;
                a.address_id = e.data.address.id;
            }
        }
        if (a.mch_list = JSON.stringify(i), e.data.pond_id > 0) {
            if (e.data.express_price > 0 && -1 == e.data.payment) return e.setData({
                show_payment: !0
            }), !1;
        } else if (-1 == e.data.payment) return e.setData({
            show_payment: !0
        }), !1;
        1 == e.data.integral_radio ? a.use_integral = 1 : a.use_integral = 2, a.payment = e.data.payment, 
        a.formId = t.detail.formId, e.order_submit(a, "s");
    },
    onReady: function() {},
    onShow: function(t) {
        if (!n) {
            n = !0, e.pageOnShow(this);
            var a = this, i = wx.getStorageSync("picker_address");
            i && a.setData({
                address: i
            }), a.getOrderData(a.data.options);
        }
    },
    getOrderData: function(s) {
        var n = this, o = {}, r = "";
        n.data.address && n.data.address.id && (r = n.data.address.id), o.address_id = r, 
        o.longitude = a, o.latitude = i, wx.showLoading({
            title: "正在加载",
            mask: !0
        }), o.mch_list = s.mch_list, e.request({
            url: t.order.new_submit_preview,
            method: "POST",
            data: o,
            success: function(t) {
                if (wx.hideLoading(), 0 == t.code) {
                    var e = wx.getStorageSync("input_data"), a = t.data, i = -1, s = 1, o = a.mch_list, r = [];
                    e && (r = e.mch_list, i = e.payment, s = e.integral_radio), a.integral_radio = s;
                    for (var d in a.pay_type_list) {
                        if (i == a.pay_type_list[d].payment) {
                            a.payment = i;
                            break;
                        }
                        if (1 == a.pay_type_list.length) {
                            a.payment = a.pay_type_list[d].payment;
                            break;
                        }
                    }
                    for (var d in o) {
                        var c = {}, l = {};
                        if (o[d].show = !1, o[d].show_length = o[d].goods_list.length - 1, 0 != r.length) for (var _ in r) o[d].mch_id == r[_].mch_id && (o[d].content = r[_].content, 
                        o[d].form = r[_].form, c = r[_].shop, l = r[_].picker_coupon, o[d].offline_name = r[_].offline_name, 
                        o[d].offline_mobile = r[_].offline_mobile);
                        for (var _ in o[d].shop_list) {
                            if (c && c.id == o[d].shop_list[_].id) {
                                o[d].shop = c;
                                break;
                            }
                            if (1 == o[d].shop_list.length) {
                                o[d].shop = o[d].shop_list[_];
                                break;
                            }
                            if (1 == o[d].shop_list[_].is_default) {
                                o[d].shop = o[d].shop_list[_];
                                break;
                            }
                        }
                        if (l) for (var _ in o[d].coupon_list) if (l.id == o[d].coupon_list[_].id) {
                            o[d].picker_coupon = l;
                            break;
                        }
                        o[d].send_type && 2 == o[d].send_type ? (o[d].offline = 1, n.setData({
                            mch_offline: !1
                        })) : o[d].offline = 0;
                    }
                    a.mch_list = o;
                    var h = n.data.index;
                    -1 != h && o[h].shop_list && o[h].shop_list.length > 0 && n.setData({
                        show_shop: !0,
                        shop_list: o[h].shop_list
                    }), n.setData(a), n.getPrice();
                }
                1 == t.code && wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    confirmText: "返回",
                    success: function(t) {
                        t.confirm && wx.navigateBack({
                            delta: 1
                        });
                    }
                });
            }
        });
    },
    showCouponPicker: function(t) {
        var e = this, a = t.currentTarget.dataset.index, i = e.data.mch_list;
        e.getInputData(), i[a].coupon_list && i[a].coupon_list.length > 0 && e.setData({
            show_coupon_picker: !0,
            coupon_list: i[a].coupon_list,
            index: a
        });
    },
    pickCoupon: function(t) {
        var e = this, a = t.currentTarget.dataset.index, i = e.data.index, s = wx.getStorageSync("input_data");
        wx.removeStorageSync("input_data");
        var n = s.mch_list;
        "-1" == a || -1 == a ? (n[i].picker_coupon = !1, s.show_coupon_picker = !1) : (n[i].picker_coupon = e.data.coupon_list[a], 
        s.show_coupon_picker = !1), s.mch_list = n, s.index = -1, e.setData(s), e.getPrice();
    },
    showShop: function(t) {
        var e = this, a = t.currentTarget.dataset.index;
        e.getInputData(), e.setData({
            index: a
        }), e.dingwei();
    },
    pickShop: function(t) {
        var e = this, a = t.currentTarget.dataset.index, i = e.data.index, s = wx.getStorageSync("input_data"), n = s.mch_list;
        "-1" == a || -1 == a ? (n[i].shop = !1, s.show_shop = !1) : (n[i].shop = e.data.shop_list[a], 
        s.show_shop = !1), s.mch_list = n, s.index = -1, e.setData(s), e.getPrice();
    },
    integralSwitchChange: function(t) {
        var e = this;
        0 != t.detail.value ? e.setData({
            integral_radio: 1
        }) : e.setData({
            integral_radio: 2
        }), e.getPrice();
    },
    integration: function(t) {
        var e = this.data.integral.integration;
        wx.showModal({
            title: "积分使用规则",
            content: e,
            showCancel: !1,
            confirmText: "我知道了",
            confirmColor: "#ff4544",
            success: function(t) {
                t.confirm;
            }
        });
    },
    getPrice: function() {
        var t = this, e = t.data.mch_list, a = t.data.integral_radio, i = (t.data.integral, 
        0), s = 0, n = {};
        for (var o in e) {
            var r = e[o], d = (parseFloat(r.total_price), parseFloat(r.level_price));
            r.picker_coupon && r.picker_coupon.sub_price > 0 && (d -= r.picker_coupon.sub_price), 
            r.integral && r.integral.forehead > 0 && 1 == a && (d -= parseFloat(r.integral.forehead)), 
            0 == r.offline && (r.express_price && (d += r.express_price), r.offer_rule && 1 == r.offer_rule.is_allowed && (n = r.offer_rule), 
            1 == r.is_area && (s = 1)), i += parseFloat(d);
        }
        i = i >= 0 ? i : 0, t.setData({
            new_total_price: parseFloat(i.toFixed(2)),
            offer_rule: n,
            is_area: s
        });
    },
    cardDel: function() {
        this.setData({
            show_card: !1
        }), wx.redirectTo({
            url: "/pages/order/order?status=1"
        });
    },
    cardTo: function() {
        this.setData({
            show_card: !1
        }), wx.redirectTo({
            url: "/pages/card/card"
        });
    },
    formInput: function(t) {
        var e = this, a = t.currentTarget.dataset.index, i = t.currentTarget.dataset.formId, s = e.data.mch_list, n = s[a].form, o = n.list;
        o[i].default = t.detail.value, n.list = o, e.setData({
            mch_list: s
        });
    },
    selectForm: function(t) {
        var e = this, a = e.data.mch_list, i = t.currentTarget.dataset.index, s = t.currentTarget.dataset.formId, n = t.currentTarget.dataset.k, o = a[i].form, r = o.list, d = r[s].default_list;
        if ("radio" == r[s].type) {
            for (var c in d) c == n ? d[n].is_selected = 1 : d[c].is_selected = 0;
            r[s].default_list = d;
        }
        "checkbox" == r[s].type && (1 == d[n].is_selected ? d[n].is_selected = 0 : d[n].is_selected = 1, 
        r[s].default_list = d), o.list = r, a[i].form = o, e.setData({
            mch_list: a
        });
    },
    showPayment: function() {
        this.setData({
            show_payment: !0
        });
    },
    payPicker: function(t) {
        var e = t.currentTarget.dataset.index;
        this.setData({
            payment: e,
            show_payment: !1
        });
    },
    payClose: function() {
        this.setData({
            show_payment: !1
        });
    },
    getInputData: function() {
        var t = this, e = t.data.mch_list, a = {
            integral_radio: t.data.integral_radio,
            payment: t.data.payment,
            mch_list: e
        };
        wx.setStorageSync("input_data", a);
    },
    onHide: function() {
        e.pageOnHide(this), this.getInputData();
    },
    onUnload: function() {
        e.pageOnUnload(this), wx.removeStorageSync("input_data");
    },
    uploadImg: function(t) {
        var a = this, i = t.currentTarget.dataset.index, s = t.currentTarget.dataset.formId, o = a.data.mch_list, r = o[i].form;
        n = !0, e.uploader.upload({
            start: function() {
                wx.showLoading({
                    title: "正在上传",
                    mask: !0
                });
            },
            success: function(t) {
                0 == t.code ? (r.list[s].default = t.data.url, a.setData({
                    mch_list: o
                })) : a.showToast({
                    title: t.msg
                });
            },
            error: function(t) {
                a.showToast({
                    title: t
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    goToAddress: function() {
        n = !1, wx.navigateTo({
            url: "/pages/address-picker/address-picker"
        });
    },
    showMore: function(t) {
        var e = this, a = e.data.mch_list, i = t.currentTarget.dataset.index;
        a[i].show = !a[i].show, e.setData({
            mch_list: a
        });
    }
});