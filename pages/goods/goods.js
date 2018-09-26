var t = require("../../api.js"), a = require("../../utils.js"), o = getApp(), i = require("../../wxParse/wxParse.js"), r = 1, e = !1, s = !0, d = 0;

Page({
    data: {
        id: null,
        goods: {},
        show_attr_picker: !1,
        form: {
            number: 1
        },
        tab_detail: "active",
        tab_comment: "",
        comment_list: [],
        comment_count: {
            score_all: 0,
            score_3: 0,
            score_2: 0,
            score_1: 0
        },
        autoplay: !1,
        hide: "hide",
        show: !1,
        x: wx.getSystemInfoSync().windowWidth,
        y: wx.getSystemInfoSync().windowHeight - 20,
        miaosha_end_time_over: {
            h: "--",
            m: "--",
            s: "--"
        },
        page: 1,
        drop: !1,
        goodsModel: !1,
        goods_num: 0,
        temporaryGood: {
            price: 0,
            num: 0,
            use_attr: 1
        },
        goodNumCount: 0
    },
    onLoad: function(t) {
        var i = this;
        o.pageOnLoad(this), d = 0, r = 1, e = !1, s = !0;
        var n = t.quick;
        if (n) {
            var c = wx.getStorageSync("item");
            if (c) var u = c.total, _ = c.carGoods; else var u = {
                total_price: 0,
                total_num: 0
            }, _ = [];
            i.setData({
                quick: n,
                quick_list: c.quick_list,
                total: u,
                carGoods: _,
                quick_hot_goods_lists: c.quick_hot_goods_lists
            });
        }
        this.setData({
            store: wx.getStorageSync("store")
        });
        var g = 0, l = t.user_id, m = decodeURIComponent(t.scene);
        if (void 0 != l) g = l; else if (void 0 != m) {
            var h = a.scene_decode(m);
            h.uid && h.gid ? (g = h.uid, t.id = h.gid) : g = m;
        }
        o.loginBindParent({
            parent_id: g
        }), i.setData({
            id: t.id
        }), i.getGoods(), i.getCommentList();
    },
    getCacheData: function() {
        var t = wx.getStorageSync("item"), a = {
            total_num: 0,
            total_price: 0
        };
        page.setData({
            total: t.total ? t.total : a,
            carGoods: t.carGoods ? t.carGoods : [],
            quick_hot_goods_lists: t.quick_hot_goods_lists ? t.quick_hot_goods_lists : [],
            quick_list: t.quick_list ? t.quick_list : [],
            checked_attr: t.checked_attr
        });
    },
    getGoods: function() {
        var a = this;
        if (a.data.quick) {
            var r = a.data.carGoods;
            if (r) {
                for (var e = r.length, s = 0, d = 0; d < e; d++) r[d].goods_id == a.data.id && (s += parseInt(r[d].num));
                a.setData({
                    goods_num: s
                });
            }
        }
        o.request({
            url: t.default.goods,
            data: {
                id: a.data.id
            },
            success: function(t) {
                if (0 == t.code) {
                    var o = t.data.detail;
                    i.wxParse("detail", "html", o, a), a.setData({
                        goods: t.data,
                        attr_group_list: t.data.attr_group_list
                    }), a.goods_recommend({
                        goods_id: t.data.id,
                        reload: !0
                    }), a.data.goods.miaosha && a.setMiaoshaTimeOver(), a.selectDefaultAttr();
                }
                1 == t.code && wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.switchTab({
                            url: "/pages/index/index"
                        });
                    }
                });
            }
        });
    },
    goodsModel: function(t) {
        var a = this, o = (a.data.carGoods, a.data.goodsModel);
        o ? a.setData({
            goodsModel: !1
        }) : a.setData({
            goodsModel: !0
        });
    },
    hideGoodsModel: function() {
        this.setData({
            goodsModel: !1
        });
    },
    close_box: function(t) {
        this.setData({
            showModal: !1
        });
    },
    hideModal: function() {
        this.setData({
            showModal: !1
        });
    },
    jia: function(t) {
        var a = this, o = a.data.goods, i = a.data.quick_list;
        for (var r in i) for (var e in i[r].goods) if (parseInt(i[r].goods[e].id) === parseInt(o.id)) {
            var s = i[r].goods[e].num ? i[r].goods[e].num + 1 : 1;
            if (s > JSON.parse(i[r].goods[e].attr)[0].num) return wx.showToast({
                title: "商品库存不足",
                image: "/images/icon-warning.png"
            }), void --s;
            i[r].goods[e].num = s;
            var d = a.data.carGoods, n = 1, c = o.price ? o.price : i[r].goods[e].price;
            for (var u in d) {
                if (parseInt(d[u].goods_id) === parseInt(o.id) && 1 === d[u].attr.length) {
                    n = 0, d[u].num = s, d[u].goods_price = (d[u].num * d[u].price).toFixed(2);
                    break;
                }
                if (d[u].price == parseFloat(t.currentTarget.dataset.price)) {
                    n = 0, d[u].num = d[u].num + 1, d[u].goods_price = (d[u].num * d[u].price).toFixed(2);
                    break;
                }
            }
            if (1 === n || 0 === d.length) {
                var _ = JSON.parse(i[r].goods[e].attr);
                d.push({
                    goods_id: parseInt(i[r].goods[e].id),
                    attr: _[0].attr_list,
                    goods_name: i[r].goods[e].name,
                    goods_price: c,
                    num: 1,
                    price: c
                });
            }
        }
        a.setData({
            carGoods: d,
            quick_list: i
        }), a.updateGoodNum(), a.carStatistics(), a.quickHotStatistics();
    },
    jian: function(t) {
        var a = this, o = a.data.goods, i = a.data.quick_list;
        for (var r in i) for (var e in i[r].goods) if (parseInt(i[r].goods[e].id) === parseInt(o.id)) {
            var s = i[r].goods[e].num > 0 ? i[r].goods[e].num - 1 : i[r].goods[e].num;
            i[r].goods[e].num = s;
            var d = a.data.carGoods;
            for (var n in d) {
                o.price ? o.price : i[r].goods[e].price;
                if (parseInt(d[n].goods_id) === parseInt(o.id) && 1 === d[n].attr.length) {
                    0, d[n].num = s, d[n].goods_price = (d[n].num * d[n].price).toFixed(2);
                    break;
                }
                if (d[n].price == parseFloat(t.currentTarget.dataset.price)) {
                    0, d[n].num > 0 && (d[n].num = d[n].num - 1, d[n].goods_price = (d[n].num * d[n].price).toFixed(2));
                    break;
                }
            }
        }
        a.setData({
            carGoods: d,
            quick_list: i
        }), a.updateGoodNum(), a.carStatistics(), a.quickHotStatistics();
    },
    carStatistics: function() {
        var t = this, a = t.data.carGoods, o = 0, i = 0;
        for (var r in a) o += a[r].num, i = parseFloat(i) + parseFloat(a[r].goods_price);
        var e = {
            total_num: o,
            total_price: i
        };
        0 === o && t.hideGoodsModel(), t.setData({
            total: e
        });
    },
    quickHotStatistics: function() {
        var t = this, a = t.data.quick_hot_goods_lists, o = t.data.quick_list;
        for (var i in a) for (var r in o) for (var e in o[r].goods) parseInt(o[r].goods[e].id) === parseInt(a[i].id) && (a[i].num = o[r].goods[e].num);
        t.setData({
            quick_hot_goods_lists: a
        });
    },
    tianjia: function(t) {
        this.jia(t);
    },
    jianshao: function(t) {
        this.jian(t);
    },
    showDialogBtn: function() {
        var a = this, i = a.data.goods;
        o.request({
            url: t.default.goods,
            data: {
                id: i.id
            },
            success: function(t) {
                0 == t.code && (a.setData({
                    currentGood: t.data,
                    goods_name: t.data.name,
                    attr_group_list: t.data.attr_group_list,
                    showModal: !0
                }), a.resetData(), a.updateData());
            }
        });
    },
    resetData: function() {
        this.setData({
            checked_attr: [],
            check_num: 0,
            check_goods_price: 0,
            temporaryGood: {
                price: "0.00"
            }
        });
    },
    updateData: function() {
        var t = this, a = t.data.currentGood, o = t.data.carGoods, i = JSON.parse(a.attr), r = a.attr_group_list;
        for (var e in i) {
            var s = [];
            for (var d in i[e].attr_list) s.push([ i[e].attr_list[d].attr_id, a.id ]);
            for (var n in o) {
                var c = [];
                for (var u in o[n].attr) c.push([ o[n].attr[u].attr_id, o[n].goods_id ]);
                if (s.sort().join() === c.sort().join()) {
                    for (var _ in r) for (var g in r[_].attr_list) for (var l in s) {
                        if (parseInt(r[_].attr_list[g].attr_id) === parseInt(s[l])) {
                            r[_].attr_list[g].checked = !0;
                            break;
                        }
                        r[_].attr_list[g].checked = !1;
                    }
                    var m = {
                        price: o[n].price
                    };
                    return void t.setData({
                        attr_group_list: r,
                        check_num: o[n].num,
                        check_goods_price: o[n].goods_price,
                        checked_attr: s,
                        temporaryGood: m
                    });
                }
            }
        }
    },
    checkUpdateData: function(t) {
        var a = this, o = a.data.carGoods;
        for (var i in o) {
            var r = [];
            for (var e in o[i].attr) r.push([ o[i].attr[e].attr_id, o[i].goods_id ]);
            r.sort().join() === t.sort().join() && a.setData({
                check_num: o[i].num,
                check_goods_price: o[i].goods_price
            });
        }
    },
    attrClick: function(t) {
        var a = this, o = t.target.dataset.groupId, i = t.target.dataset.id, r = a.data.attr_group_list, e = a.data.currentGood;
        for (var s in r) if (r[s].attr_group_id == o) for (var d in r[s].attr_list) r[s].attr_list[d].attr_id == i ? r[s].attr_list[d].checked = !0 : r[s].attr_list[d].checked = !1;
        var n = [];
        for (var s in r) for (var d in r[s].attr_list) !0 === r[s].attr_list[d].checked && n.push([ r[s].attr_list[d].attr_id, e.id ]);
        var c = JSON.parse(a.data.currentGood.attr), u = a.data.temporaryGood;
        for (var _ in c) {
            var g = [];
            for (var l in c[_].attr_list) g.push([ c[_].attr_list[l].attr_id, e.id ]);
            if (g.sort().join() === n.sort().join()) {
                if (0 === parseInt(c[_].num)) return void wx.showToast({
                    title: "商品库存不足，请选择其它规格或数量",
                    image: "/images/icon-warning.png"
                });
                u = parseFloat(c[_].price) ? {
                    price: c[_].price.toFixed(2)
                } : {
                    price: e.price.toFixed(2)
                };
            }
        }
        a.resetData(), a.checkUpdateData(n), a.setData({
            attr_group_list: r,
            temporaryGood: u,
            checked_attr: n
        });
    },
    onConfirm: function(t) {
        var a = this, o = a.data.attr_group_list, i = a.data.checked_attr, r = a.data.currentGood;
        if (i.length === o.length) {
            var e = a.data.check_num ? a.data.check_num + 1 : 1, s = JSON.parse(r.attr);
            for (var d in s) {
                var n = [];
                for (var c in s[d].attr_list) if (n.push([ s[d].attr_list[c].attr_id, r.id ]), n.sort().join() === i.sort().join()) {
                    var u = s[d].price ? s[d].price : r.price, _ = s[d].attr_list;
                    if (e > s[d].num) return void wx.showToast({
                        title: "商品库存不足",
                        image: "/images/icon-warning.png"
                    });
                }
            }
            var g = a.data.carGoods, l = 1, m = (parseFloat(u) * e).toFixed(2);
            for (var h in g) {
                var f = [];
                for (var p in g[h].attr) f.push([ g[h].attr[p].attr_id, g[h].goods_id ]);
                if (f.sort().join() === i.sort().join()) {
                    l = 0, g[h].num = g[h].num + 1, g[h].goods_price = (parseFloat(u) * g[h].num).toFixed(2);
                    break;
                }
            }
            1 !== l && 0 !== g.length || g.push({
                goods_id: r.id,
                attr: _,
                goods_name: r.name,
                goods_price: u,
                num: 1,
                price: u
            }), a.setData({
                carGoods: g,
                check_goods_price: m,
                check_num: e
            }), a.carStatistics(), a.attrGoodStatistics(), a.updateGoodNum();
        } else wx.showToast({
            title: "请选择规格",
            image: "/images/icon-warning.png"
        });
    },
    guigejian: function(t) {
        var a = this, o = a.data.checked_attr, i = a.data.carGoods, r = a.data.check_num ? --a.data.check_num : 1;
        a.data.currentGood;
        for (var e in i) {
            var s = [];
            for (var d in i[e].attr) s.push([ i[e].attr[d].attr_id, i[e].goods_id ]);
            if (s.sort().join() === o.sort().join()) return i[e].num > 0 && (i[e].num -= 1, 
            i[e].goods_price = (i[e].num * parseFloat(i[e].price)).toFixed(2)), a.setData({
                carGoods: i,
                check_goods_price: i[e].goods_price,
                check_num: r
            }), a.carStatistics(), a.attrGoodStatistics(), void a.updateGoodNum();
        }
    },
    attrGoodStatistics: function() {
        var t = this, a = t.data.currentGood, o = t.data.carGoods, i = t.data.quick_list, r = t.data.quick_hot_goods_lists, e = 0;
        for (var s in o) o[s].goods_id === a.id && (e += o[s].num);
        for (var s in i) for (var d in i[s].goods) parseInt(i[s].goods[d].id) === a.id && (i[s].goods[d].num = e);
        for (var s in r) parseInt(r[s].id) === a.id && (r[s].num = e);
        t.setData({
            quick_list: i,
            quick_hot_goods_lists: r
        });
    },
    updateGoodNum: function() {
        var t = this, a = t.data.quick_list, o = t.data.goods;
        for (var i in a) for (var r in a[i].goods) if (parseInt(a[i].goods[r].id) === parseInt(o.id)) {
            var e = a[i].goods[r].num, s = a[i].goods[r].num;
            t.setData({
                goods_num: s,
                goodNumCount: e
            });
            break;
        }
    },
    clearCar: function(t) {
        var a = this, o = a.data.quick_hot_goods_lists, i = a.data.quick_list;
        for (var r in o) for (var e in o[r]) o[r].num = 0;
        for (var s in i) for (var d in i[s].goods) i[s].goods[d].num = 0;
        a.setData({
            goodsModel: !1,
            carGoods: [],
            total: {
                total_num: 0,
                total_price: 0
            },
            check_num: 0,
            quick_hot_goods_lists: o,
            quick_list: i,
            currentGood: [],
            checked_attr: [],
            check_goods_price: 0,
            temporaryGood: {},
            goods_num: 0,
            goodNumCount: 0
        }), wx.removeStorageSync("item");
    },
    buynow: function(t) {
        var a = this, o = a.data.carGoods;
        a.data.goodsModel;
        a.setData({
            goodsModel: !1
        });
        for (var i = o.length, r = [], e = [], s = 0; s < i; s++) 0 != o[s].num && (e = {
            goods_id: o[s].goods_id,
            num: o[s].num,
            attr: o[s].attr
        }, r.push(e));
        var d = [];
        d.push({
            mch_id: 0,
            goods_list: r
        }), wx.navigateTo({
            url: "/pages/new-order-submit/new-order-submit?mch_list=" + JSON.stringify(d)
        });
    },
    selectDefaultAttr: function() {
        var t = this;
        if (t.data.goods && 0 === t.data.goods.use_attr) {
            for (var a in t.data.attr_group_list) for (var o in t.data.attr_group_list[a].attr_list) 0 == a && 0 == o && (t.data.attr_group_list[a].attr_list[o].checked = !0);
            t.setData({
                attr_group_list: t.data.attr_group_list
            });
        }
    },
    getCommentList: function(a) {
        var i = this;
        a && "active" != i.data.tab_comment || e || s && (e = !0, o.request({
            url: t.default.comment_list,
            data: {
                goods_id: i.data.id,
                page: r
            },
            success: function(t) {
                0 == t.code && (e = !1, r++, i.setData({
                    comment_count: t.data.comment_count,
                    comment_list: a ? i.data.comment_list.concat(t.data.list) : t.data.list
                }), 0 == t.data.list.length && (s = !1));
            }
        }));
    },
    onGoodsImageClick: function(t) {
        var a = this, o = [], i = t.currentTarget.dataset.index;
        for (var r in a.data.goods.pic_list) o.push(a.data.goods.pic_list[r].pic_url);
        wx.previewImage({
            urls: o,
            current: o[i]
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
        a++, t.setData({
            form: {
                number: a
            }
        });
    },
    numberBlur: function(t) {
        var a = this, o = t.detail.value;
        o = parseInt(o), isNaN(o) && (o = 1), o <= 0 && (o = 1), a.setData({
            form: {
                number: o
            }
        });
    },
    addCart: function() {
        this.submit("ADD_CART");
    },
    buyNow: function() {
        this.submit("BUY_NOW");
    },
    submit: function(a) {
        var i = this;
        if (!i.data.show_attr_picker) return i.setData({
            show_attr_picker: !0
        }), !0;
        if (i.data.miaosha_data && i.data.miaosha_data.rest_num > 0 && i.data.form.number > i.data.miaosha_data.rest_num) return wx.showToast({
            title: "商品库存不足，请选择其它规格或数量",
            image: "/images/icon-warning.png"
        }), !0;
        if (i.data.form.number > i.data.goods.num) return wx.showToast({
            title: "商品库存不足，请选择其它规格或数量",
            image: "/images/icon-warning.png"
        }), !0;
        var r = i.data.attr_group_list, e = [];
        for (var s in r) {
            var d = !1;
            for (var n in r[s].attr_list) if (r[s].attr_list[n].checked) {
                d = {
                    attr_id: r[s].attr_list[n].attr_id,
                    attr_name: r[s].attr_list[n].attr_name
                };
                break;
            }
            if (!d) return wx.showToast({
                title: "请选择" + r[s].attr_group_name,
                image: "/images/icon-warning.png"
            }), !0;
            e.push({
                attr_group_id: r[s].attr_group_id,
                attr_group_name: r[s].attr_group_name,
                attr_id: d.attr_id,
                attr_name: d.attr_name
            });
        }
        if ("ADD_CART" == a && (wx.showLoading({
            title: "正在提交",
            mask: !0
        }), o.request({
            url: t.cart.add_cart,
            method: "POST",
            data: {
                goods_id: i.data.id,
                attr: JSON.stringify(e),
                num: i.data.form.number
            },
            success: function(t) {
                wx.hideLoading(), wx.showToast({
                    title: t.msg,
                    duration: 1500
                }), i.setData({
                    show_attr_picker: !1
                });
            }
        })), "BUY_NOW" == a) {
            i.setData({
                show_attr_picker: !1
            });
            var c = [];
            c.push({
                goods_id: i.data.id,
                num: i.data.form.number,
                attr: e
            });
            var u = i.data.goods, _ = 0;
            null != u.mch && (_ = u.mch.id);
            var g = [];
            g.push({
                mch_id: _,
                goods_list: c
            }), wx.redirectTo({
                url: "/pages/new-order-submit/new-order-submit?mch_list=" + JSON.stringify(g)
            });
        }
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
    favoriteAdd: function() {
        var a = this;
        o.request({
            url: t.user.favorite_add,
            method: "post",
            data: {
                goods_id: a.data.goods.id
            },
            success: function(t) {
                if (0 == t.code) {
                    var o = a.data.goods;
                    o.is_favorite = 1, a.setData({
                        goods: o
                    });
                }
            }
        });
    },
    favoriteRemove: function() {
        var a = this;
        o.request({
            url: t.user.favorite_remove,
            method: "post",
            data: {
                goods_id: a.data.goods.id
            },
            success: function(t) {
                if (0 == t.code) {
                    var o = a.data.goods;
                    o.is_favorite = 0, a.setData({
                        goods: o
                    });
                }
            }
        });
    },
    tabSwitch: function(t) {
        var a = this;
        "detail" == t.currentTarget.dataset.tab ? a.setData({
            tab_detail: "active",
            tab_comment: ""
        }) : a.setData({
            tab_detail: "",
            tab_comment: "active"
        });
    },
    commentPicView: function(t) {
        var a = this, o = t.currentTarget.dataset.index, i = t.currentTarget.dataset.picIndex;
        wx.previewImage({
            current: a.data.comment_list[o].pic_list[i],
            urls: a.data.comment_list[o].pic_list
        });
    },
    onReady: function() {},
    onShow: function() {
        var t = this, a = wx.getStorageSync("item");
        if (a) var o = a.total, i = a.carGoods, r = t.data.goods_num; else var o = {
            total_price: 0,
            total_num: 0
        }, i = [], r = 0;
        t.setData({
            total: o,
            carGoods: i,
            goods_num: r
        });
    },
    onHide: function() {
        o.pageOnHide(this);
        var t = this, a = {
            quick_list: t.data.quick_list,
            carGoods: t.data.carGoods,
            total: t.data.total,
            quick_hot_goods_lists: [],
            checked_attr: t.data.checked_attr
        };
        wx.setStorageSync("item", a);
    },
    onUnload: function() {
        o.pageOnUnload(this);
        var t = this, a = {
            quick_list: t.data.quick_list,
            carGoods: t.data.carGoods,
            total: t.data.total,
            quick_hot_goods_lists: [],
            checked_attr: t.data.checked_attr
        };
        wx.setStorageSync("item", a);
    },
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        var t = this;
        "active" == t.data.tab_detail && t.data.drop ? (t.data.drop = !1, t.goods_recommend({
            goods_id: t.data.goods.id,
            loadmore: !0
        })) : "active" == t.data.tab_comment && t.getCommentList(!0);
    },
    onShareAppMessage: function() {
        var t = this, a = wx.getStorageSync("user_info");
        return {
            path: "/pages/goods/goods?id=" + this.data.id + "&user_id=" + a.id,
            success: function(a) {
                1 == ++d && o.shareSendCoupon(t);
            },
            title: t.data.goods.name,
            imageUrl: t.data.goods.pic_list[0].pic_url
        };
    },
    play: function(t) {
        var a = t.target.dataset.url;
        this.setData({
            url: a,
            hide: "",
            show: !0
        }), wx.createVideoContext("video").play();
    },
    close: function(t) {
        if ("video" == t.target.id) return !0;
        this.setData({
            hide: "hide",
            show: !1
        }), wx.createVideoContext("video").pause();
    },
    hide: function(t) {
        0 == t.detail.current ? this.setData({
            img_hide: ""
        }) : this.setData({
            img_hide: "hide"
        });
    },
    showShareModal: function() {
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
        var a = this;
        if (a.setData({
            goods_qrcode_active: "active",
            share_modal_active: ""
        }), a.data.goods_qrcode) return !0;
        o.request({
            url: t.default.goods_qrcode,
            data: {
                goods_id: a.data.id
            },
            success: function(t) {
                0 == t.code && a.setData({
                    goods_qrcode: t.data.pic_url
                }), 1 == t.code && (a.goodsQrcodeClose(), wx.showModal({
                    title: "提示",
                    content: t.msg,
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
    },
    saveGoodsQrcode: function() {
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
    },
    goodsQrcodeClick: function(t) {
        var a = t.currentTarget.dataset.src;
        wx.previewImage({
            urls: [ a ]
        });
    },
    closeCouponBox: function(t) {
        this.setData({
            get_coupon_list: ""
        });
    },
    setMiaoshaTimeOver: function() {
        function t() {
            var t = o.data.goods.miaosha.end_time - o.data.goods.miaosha.now_time;
            t = t < 0 ? 0 : t, o.data.goods.miaosha.now_time++, o.setData({
                goods: o.data.goods,
                miaosha_end_time_over: a(t)
            });
        }
        function a(t) {
            var a = parseInt(t / 3600), o = parseInt(t % 3600 / 60), i = t % 60;
            return {
                h: a < 10 ? "0" + a : "" + a,
                m: o < 10 ? "0" + o : "" + o,
                s: i < 10 ? "0" + i : "" + i
            };
        }
        var o = this;
        t(), setInterval(function() {
            t();
        }, 1e3);
    },
    to_dial: function(t) {
        var a = this.data.store.contact_tel;
        wx.makePhoneCall({
            phoneNumber: a
        });
    },
    goods_recommend: function(a) {
        var i = this;
        i.setData({
            is_loading: !0
        });
        var r = i.data.page || 2;
        o.request({
            url: t.default.goods_recommend,
            data: {
                goods_id: a.goods_id,
                page: r
            },
            success: function(t) {
                if (0 == t.code) {
                    if (a.reload) o = t.data.list;
                    if (a.loadmore) var o = i.data.goods_list.concat(t.data.list);
                    i.data.drop = !0, i.setData({
                        goods_list: o
                    }), i.setData({
                        page: r + 1
                    });
                }
            },
            complete: function() {
                i.setData({
                    is_loading: !1
                });
            }
        });
    },
    attrGoodsClick: function(a) {
        var i = this, r = a.target.dataset.groupId, e = a.target.dataset.id, s = i.data.attr_group_list;
        for (var d in s) if (s[d].attr_group_id == r) for (var n in s[d].attr_list) s[d].attr_list[n].attr_id == e ? s[d].attr_list[n].checked = !0 : s[d].attr_list[n].checked = !1;
        i.setData({
            attr_group_list: s
        });
        var c = [], u = !0;
        for (var d in s) {
            var _ = !1;
            for (var n in s[d].attr_list) if (s[d].attr_list[n].checked) {
                c.push(s[d].attr_list[n].attr_id), _ = !0;
                break;
            }
            if (!_) {
                u = !1;
                break;
            }
        }
        u && (wx.showLoading({
            title: "正在加载",
            mask: !0
        }), o.request({
            url: t.default.goods_attr_info,
            data: {
                goods_id: i.data.goods.id,
                attr_list: JSON.stringify(c)
            },
            success: function(t) {
                if (wx.hideLoading(), 0 == t.code) {
                    var a = i.data.goods;
                    a.price = t.data.price, a.num = t.data.num, a.attr_pic = t.data.pic, i.setData({
                        goods: a
                    });
                }
            }
        }));
    }
});