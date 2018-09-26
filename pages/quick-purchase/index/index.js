var t = require("../../../api.js"), a = getApp();

Page({
    data: {
        quick_list: [],
        goods_list: [],
        carGoods: [],
        currentGood: {},
        checked_attr: [],
        checkedGood: [],
        attr_group_list: [],
        temporaryGood: {
            price: 0,
            num: 0,
            use_attr: 1
        },
        check_goods_price: 0,
        showModal: !1,
        checked: !1,
        cat_checked: !1,
        color: "",
        total: {
            total_price: 0,
            total_num: 0
        }
    },
    onLoad: function(t) {
        a.pageOnLoad(this), this.setData({
            store: wx.getStorageSync("store")
        });
    },
    onShow: function() {
        a.pageOnShow(this), this.loadData();
    },
    onHide: function() {
        a.pageOnHide(this);
        var t = this, o = {
            quick_list: t.data.quick_list,
            carGoods: t.data.carGoods,
            total: t.data.total,
            quick_hot_goods_lists: t.data.quick_hot_goods_lists,
            checked_attr: t.data.checked_attr
        };
        wx.setStorageSync("item", o);
    },
    onUnload: function() {
        a.pageOnUnload(this);
        var t = this, o = {
            quick_list: t.data.quick_list,
            carGoods: t.data.carGoods,
            total: t.data.total,
            quick_hot_goods_lists: t.data.quick_hot_goods_lists,
            checked_attr: t.data.checked_attr
        };
        wx.setStorageSync("item", o);
    },
    loadData: function(o) {
        var r = this, i = wx.getStorageSync("item"), s = {
            total_num: 0,
            total_price: 0
        };
        r.setData({
            total: i.total ? i.total : s,
            carGoods: i.carGoods ? i.carGoods : []
        }), wx.showLoading({
            title: "加载中"
        }), a.request({
            url: t.quick.quick,
            success: function(t) {
                if (wx.hideLoading(), 0 == t.code) {
                    var a = t.data.list, o = [], s = [];
                    for (var e in a) if (a[e].goods.length > 0) {
                        s.push(a[e]);
                        for (var d in a[e].goods) {
                            for (var c in i.carGoods) i.carGoods[c].goods_id === parseInt(a[e].goods[d].id) && (a[e].goods[d].num = a[e].goods[d].num ? a[e].goods[d].num : 0, 
                            a[e].goods[d].num += i.carGoods[c].num);
                            parseInt(a[e].goods[d].hot_cakes) && o.push(a[e].goods[d]);
                        }
                    }
                    r.setData({
                        quick_hot_goods_lists: o,
                        quick_list: s
                    });
                }
            }
        });
    },
    get_goods_info: function(t) {
        var a = this, o = a.data.carGoods, r = a.data.total, i = a.data.quick_hot_goods_lists, s = a.data.quick_list, e = {
            carGoods: o,
            total: r,
            quick_hot_goods_lists: i,
            check_num: a.data.check_num,
            quick_list: s
        };
        wx.setStorageSync("item", e);
        var d = t.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/pages/goods/goods?id=" + d + "&quick=1"
        });
    },
    selectMenu: function(t) {
        var a = t.currentTarget.dataset, o = this.data.quick_list;
        if ("hot_cakes" == a.tag) for (var r = !0, i = o.length, s = 0; s < i; s++) o[s].cat_checked = !1; else {
            for (var e = a.index, i = o.length, s = 0; s < i; s++) o[s].cat_checked = !1, o[s].id == o[e].id && (o[s].cat_checked = !0);
            r = !1;
        }
        this.setData({
            toView: a.tag,
            selectedMenuId: a.id,
            quick_list: o,
            cat_checked: r
        });
    },
    onShareAppMessage: function(t) {
        var o = this;
        return {
            path: "/pages/quick-purchase/index/index?user_id=" + wx.getStorageSync("user_info").id,
            success: function(t) {
                1 == ++share_count && a.shareSendCoupon(o);
            }
        };
    },
    jia: function(t) {
        var a = this, o = t.currentTarget.dataset, r = a.data.quick_list;
        for (var i in r) for (var s in r[i].goods) if (parseInt(r[i].goods[s].id) === parseInt(o.id)) {
            var e = r[i].goods[s].num ? r[i].goods[s].num + 1 : 1;
            if (e > JSON.parse(r[i].goods[s].attr)[0].num) return void wx.showToast({
                title: "商品库存不足",
                image: "/images/icon-warning.png"
            });
            r[i].goods[s].num = e;
            var d = a.data.carGoods, c = 1, n = o.price ? o.price : r[i].goods[s].price;
            for (var u in d) {
                if (parseInt(d[u].goods_id) === parseInt(o.id) && 1 === d[u].attr.length) {
                    c = 0, d[u].num = e, d[u].goods_price = (d[u].num * d[u].price).toFixed(2);
                    break;
                }
                if (d[u].price == parseFloat(t.currentTarget.dataset.price)) {
                    c = 0, d[u].num = d[u].num + 1, d[u].goods_price = (d[u].num * d[u].price).toFixed(2);
                    break;
                }
            }
            if (1 === c || 0 === d.length) {
                var _ = JSON.parse(r[i].goods[s].attr);
                d.push({
                    goods_id: parseInt(r[i].goods[s].id),
                    attr: _[0].attr_list,
                    goods_name: r[i].goods[s].name,
                    goods_price: n,
                    num: 1,
                    price: n
                });
            }
        }
        a.setData({
            carGoods: d,
            quick_list: r
        }), a.carStatistics(), a.quickHotStatistics();
    },
    jian: function(t) {
        var a = this, o = t.currentTarget.dataset, r = a.data.quick_list;
        for (var i in r) for (var s in r[i].goods) if (parseInt(r[i].goods[s].id) === parseInt(o.id)) {
            var e = r[i].goods[s].num > 0 ? r[i].goods[s].num - 1 : r[i].goods[s].num;
            r[i].goods[s].num = e;
            var d = a.data.carGoods;
            for (var c in d) {
                o.price ? o.price : r[i].goods[s].price;
                if (parseInt(d[c].goods_id) === parseInt(o.id) && 1 === d[c].attr.length) {
                    0, d[c].num = e, d[c].goods_price = (d[c].num * d[c].price).toFixed(2);
                    break;
                }
                if (d[c].price == parseFloat(t.currentTarget.dataset.price)) {
                    0, d[c].num > 0 && (d[c].num = d[c].num - 1, d[c].goods_price = (d[c].num * d[c].price).toFixed(2));
                    break;
                }
            }
        }
        a.setData({
            carGoods: d,
            quick_list: r
        }), a.carStatistics(), a.quickHotStatistics();
    },
    carStatistics: function() {
        var t = this, a = t.data.carGoods;
        console.log(a);
        var o = 0, r = 0;
        for (var i in a) o += a[i].num, r = parseFloat(r) + parseFloat(a[i].goods_price);
        var s = {
            total_num: o,
            total_price: r.toFixed(2)
        };
        0 === o && t.hideGoodsModel(), t.setData({
            total: s
        });
    },
    quickHotStatistics: function() {
        var t = this, a = t.data.quick_hot_goods_lists, o = t.data.quick_list;
        for (var r in a) for (var i in o) for (var s in o[i].goods) parseInt(o[i].goods[s].id) === parseInt(a[r].id) && (a[r].num = o[i].goods[s].num);
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
    showDialogBtn: function(o) {
        var r = this, i = o.currentTarget.dataset;
        a.request({
            url: t.default.goods,
            data: {
                id: i.id
            },
            success: function(t) {
                0 == t.code && (r.setData({
                    currentGood: t.data,
                    goods_name: t.data.name,
                    attr_group_list: t.data.attr_group_list,
                    showModal: !0
                }), r.resetData(), r.updateData());
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
        var t = this, a = t.data.currentGood, o = t.data.carGoods, r = JSON.parse(a.attr), i = a.attr_group_list;
        for (var s in r) {
            var e = [];
            for (var d in r[s].attr_list) e.push([ r[s].attr_list[d].attr_id, a.id ]);
            for (var c in o) {
                var n = [];
                for (var u in o[c].attr) n.push([ o[c].attr[u].attr_id, o[c].goods_id ]);
                if (e.sort().join() === n.sort().join()) {
                    for (var _ in i) for (var g in i[_].attr_list) for (var l in e) {
                        if (parseInt(i[_].attr_list[g].attr_id) === parseInt(e[l])) {
                            i[_].attr_list[g].checked = !0;
                            break;
                        }
                        i[_].attr_list[g].checked = !1;
                    }
                    var h = {
                        price: o[c].price
                    };
                    return void t.setData({
                        attr_group_list: i,
                        check_num: o[c].num,
                        check_goods_price: o[c].goods_price,
                        checked_attr: e,
                        temporaryGood: h
                    });
                }
            }
        }
    },
    checkUpdateData: function(t) {
        var a = this, o = a.data.carGoods;
        for (var r in o) {
            var i = [];
            for (var s in o[r].attr) i.push([ o[r].attr[s].attr_id, o[r].goods_id ]);
            i.sort().join() === t.sort().join() && a.setData({
                check_num: o[r].num,
                check_goods_price: o[r].goods_price
            });
        }
    },
    attrClick: function(t) {
        var a = this, o = t.target.dataset.groupId, r = t.target.dataset.id, i = a.data.attr_group_list, s = a.data.currentGood;
        for (var e in i) if (i[e].attr_group_id == o) for (var d in i[e].attr_list) i[e].attr_list[d].attr_id == r ? i[e].attr_list[d].checked = !0 : i[e].attr_list[d].checked = !1;
        var c = [];
        for (var e in i) for (var d in i[e].attr_list) !0 === i[e].attr_list[d].checked && c.push([ i[e].attr_list[d].attr_id, s.id ]);
        var n = JSON.parse(a.data.currentGood.attr), u = a.data.temporaryGood;
        for (var _ in n) {
            var g = [];
            for (var l in n[_].attr_list) g.push([ n[_].attr_list[l].attr_id, s.id ]);
            if (g.sort().join() === c.sort().join()) {
                if (0 === parseInt(n[_].num)) return void wx.showToast({
                    title: "商品库存不足，请选择其它规格或数量",
                    image: "/images/icon-warning.png"
                });
                u = parseFloat(n[_].price) ? {
                    price: n[_].price.toFixed(2)
                } : {
                    price: s.price.toFixed(2)
                };
            }
        }
        a.resetData(), a.checkUpdateData(c), a.setData({
            attr_group_list: i,
            temporaryGood: u,
            checked_attr: c
        });
    },
    onConfirm: function(t) {
        var a = this, o = a.data.attr_group_list, r = a.data.checked_attr, i = a.data.currentGood;
        if (r.length === o.length) {
            var s = a.data.check_num ? a.data.check_num + 1 : 1, e = JSON.parse(i.attr);
            for (var d in e) {
                var c = [];
                for (var n in e[d].attr_list) if (c.push([ e[d].attr_list[n].attr_id, i.id ]), c.sort().join() === r.sort().join()) {
                    var u = e[d].price ? e[d].price : i.price, _ = e[d].attr_list;
                    if (s > e[d].num) return void wx.showToast({
                        title: "商品库存不足",
                        image: "/images/icon-warning.png"
                    });
                }
            }
            var g = a.data.carGoods, l = 1, h = (parseFloat(u) * s).toFixed(2);
            for (var p in g) {
                var f = [];
                for (var v in g[p].attr) f.push([ g[p].attr[v].attr_id, g[p].goods_id ]);
                if (f.sort().join() === r.sort().join()) {
                    l = 0, g[p].num = g[p].num + 1, g[p].goods_price = (parseFloat(u) * g[p].num).toFixed(2);
                    break;
                }
            }
            1 !== l && 0 !== g.length || g.push({
                goods_id: i.id,
                attr: _,
                goods_name: i.name,
                goods_price: u,
                num: 1,
                price: u
            }), a.setData({
                carGoods: g,
                check_goods_price: h,
                check_num: s
            }), a.carStatistics(), a.attrGoodStatistics(), a.updateGoodNum();
        } else wx.showToast({
            title: "请选择规格",
            image: "/images/icon-warning.png"
        });
    },
    guigejian: function(t) {
        var a = this, o = a.data.checked_attr, r = a.data.carGoods, i = a.data.check_num ? --a.data.check_num : 1;
        a.data.currentGood;
        for (var s in r) {
            var e = [];
            for (var d in r[s].attr) e.push([ r[s].attr[d].attr_id, r[s].goods_id ]);
            if (e.sort().join() === o.sort().join()) return r[s].num > 0 && (r[s].num -= 1, 
            r[s].goods_price = (r[s].num * parseFloat(r[s].price)).toFixed(2)), a.setData({
                carGoods: r,
                check_goods_price: r[s].goods_price,
                check_num: i
            }), a.carStatistics(), void a.attrGoodStatistics();
        }
    },
    attrGoodStatistics: function() {
        var t = this, a = t.data.currentGood, o = t.data.carGoods, r = t.data.quick_list, i = t.data.quick_hot_goods_lists, s = 0;
        for (var e in o) o[e].goods_id === a.id && (s += o[e].num);
        for (var e in r) for (var d in r[e].goods) parseInt(r[e].goods[d].id) === a.id && (r[e].goods[d].num = s);
        for (var e in i) parseInt(i[e].id) === a.id && (i[e].num = s);
        t.setData({
            quick_list: r,
            quick_hot_goods_lists: i
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
    preventTouchMove: function() {},
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
    clearCar: function(t) {
        var a = this, o = a.data.quick_hot_goods_lists, r = a.data.quick_list;
        for (var i in o) for (var s in o[i]) o[i].num = 0;
        for (var e in r) for (var d in r[e].goods) r[e].goods[d].num = 0;
        a.setData({
            goodsModel: !1,
            carGoods: [],
            total: {
                total_num: 0,
                total_price: 0
            },
            check_num: 0,
            quick_hot_goods_lists: o,
            quick_list: r,
            currentGood: [],
            checked_attr: [],
            check_goods_price: 0,
            temporaryGood: {}
        }), wx.removeStorageSync("item");
    },
    buynow: function(t) {
        var a = this, o = a.data.carGoods;
        a.data.goodsModel;
        a.setData({
            goodsModel: !1
        });
        for (var r = o.length, i = [], s = [], e = 0; e < r; e++) 0 != o[e].num && (s = {
            goods_id: o[e].goods_id,
            num: o[e].num,
            attr: o[e].attr
        }, i.push(s));
        var d = [];
        d.push({
            mch_id: 0,
            goods_list: i
        }), wx.navigateTo({
            url: "/pages/new-order-submit/new-order-submit?mch_list=" + JSON.stringify(d)
        }), a.clearCar();
    }
});