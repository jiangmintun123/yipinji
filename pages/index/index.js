var t = require("../../api.js"),
  QQMapWX = require("../../qqmap-wx-jssdk.min.js"),
  a = getApp(),
  e = 0,
  i = 0,
  o = !0,
  r = 1,
  s = "",
  n = !1;

Page({
  data: {
    x: wx.getSystemInfoSync().windowWidth,
    y: wx.getSystemInfoSync().windowHeight,
    left: 0,
    show_notice: !1,
    animationData: {},
    play: -1,
    time: 0,
    buy_user: "",
    buy_address: "",
    buy_time: 0,
    buy_type: "",
    opendate: !1
  },
  onLoad: function(t) {
    a.pageOnLoad(this), this.loadData(t);
    var e = 0,
      i = t.user_id,
      o = decodeURIComponent(t.scene);
    void 0 != i ? e = i : void 0 != o && (e = o), a.loginBindParent({
      parent_id: e
    });
  },
  suspension: function() {
    var e = this;
    i = setInterval(function() {
      a.request({
        url: t.default.buy_data,
        data: {
          time: e.data.time
        },
        method: "POST",
        success: function(t) {
          if (0 == t.code) {
            var a = !1;
            s == t.md5 && (a = !0);
            var i = "",
              o = t.cha_time,
              r = Math.floor(o / 60 - 60 * Math.floor(o / 3600));
            i = 0 == r ? o % 60 + "秒" : r + "分" + o % 60 + "秒";
            var n = "购买了",
              d = "/pages/goods/goods?id=" + t.data.goods;
            2 === t.data.type ? (n = "预约了", d = "/pages/book/details/details?id=" + t.data.goods) : 3 === t.data.type ? (n = "秒杀了",
              d = "/pages/miaosha/details/details?id=" + t.data.goods) : 4 === t.data.type && (n = "拼团了",
              d = "/pages/pt/details/details?gid=" + t.data.goods), !a && t.cha_time <= 300 ? (e.setData({
              buy_time: i,
              buy_type: n,
              buy_url: d,
              buy_user: t.data.user.length >= 5 ? t.data.user.slice(0, 4) + "..." : t.data.user,
              buy_avatar_url: t.data.avatar_url,
              buy_address: t.data.address.length >= 8 ? t.data.address.slice(0, 7) + "..." : t.data.address
            }), s = t.md5) : e.setData({
              buy_user: "",
              buy_type: "",
              buy_url: d,
              buy_address: "",
              buy_avatar_url: "",
              buy_time: ""
            });
          }
        }
      });
    }, 1e4);
  },
  loadData: function(e) {
    var i = this,
      r = wx.getStorageSync("pages_index_index");
    r && (r.act_modal_list = [], i.setData(r)), a.request({
      url: t.default.index,
      success: function(t) {
        if (0 == t.code) {
          o ? o = !1 : t.data.act_modal_list = [];
          var a = t.data.topic_list,
            e = new Array();
          if (a && 1 != t.data.update_list.topic.count) {
            if (1 == a.length) e[0] = new Array(), e[0] = a;
            else
              for (var r = 0, s = 0; r < a.length; r += 2,
                s++) void 0 != a[r + 1] && (e[s] = new Array(), e[s][0] = a[r], e[s][1] = a[r + 1]);
            t.data.topic_list = e;
          }
          i.setData(t.data), wx.setStorageSync("store", t.data.store), wx.setStorageSync("pages_index_index", t.data);
          var n = wx.getStorageSync("user_info");
          n && i.setData({
            _user_info: n
          }), i.miaoshaTimer();
        }
      },
      complete: function() {
        wx.stopPullDownRefresh();
      }
    });
  },
  onShow: function() {
    let value = wx.getStorageSync('city');
    this.setData({
      city: value
    })
    let vm = this;
    vm.getUserLocation();
    a.pageOnShow(this), e = 0;
    var t = wx.getStorageSync("store");
    t && t.name && wx.setNavigationBarTitle({
      title: t.name
    }), 1 === t.purchase_frame ? this.suspension(this.data.time) : this.setData({
      buy_user: ""
    }), clearInterval(1), this.notice();
  },
  onPullDownRefresh: function() {
    clearInterval(r), this.loadData();
  },
  onShareAppMessage: function(t) {
    var i = this;
    return {
      path: "/pages/index/index?user_id=" + wx.getStorageSync("user_info").id,
      success: function(t) {
        1 == ++e && a.shareSendCoupon(i);
      },
      title: i.data.store.name
    };
  },
  getUserLocation: function() {
    let vm = this;
    wx.getSetting({
      success: (res) => {
        console.log(JSON.stringify(res))
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function(res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function(dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      vm.getLocation();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //调用wx.getLocation的API
          vm.getLocation();
        } else {
          //调用wx.getLocation的API
          vm.getLocation();
        }
      }
    })
  },
  // 微信获得经纬度
  getLocation: function() {
    let vm = this;
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        console.log(JSON.stringify(res))
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy;
        vm.getLocal(latitude, longitude)
      },
      fail: function(res) {
        console.log('fail' + JSON.stringify(res))
      }
    })
  },
  // 获取当前地理位置
  getLocal: function(latitude, longitude) {
    
    if (!this.data.city){
      let vm = this;
      var qqmapsdk = new QQMapWX({
        key: 'JJIBZ-2ZOWQ-F2U5D-GGWUT-PN2DH-GXFRH' // 必填
      });
      qqmapsdk.reverseGeocoder({
        location: {
          latitude: latitude,
          longitude: longitude
        },
        success: function(res) {
          let province = res.result.ad_info.province
          let city = res.result.ad_info.city
          vm.setData({
            province: province,
            city: city,
            latitude: latitude,
            longitude: longitude
          })
        },
        fail: function(res) {
          console.log(res);
        },
        complete: function(res) {
          // console.log(res);
        }
      });
    }
  },
  // 城市选择
  switchcity: function(e) {
    wx.navigateTo({
      url: '/pages/switchcity/switchcity?city=' + this.data.city,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  showshop: function(e) {
    var i = this,
      o = e.currentTarget.dataset.id,
      r = e.currentTarget.dataset;
    a.request({
      url: t.default.goods,
      data: {
        id: o
      },
      success: function(t) {
        0 == t.code && i.setData({
          data: r,
          attr_group_list: t.data.attr_group_list,
          goods: t.data,
          showModal: !0
        });
      }
    });
  },
  close_box: function(t) {
    this.setData({
      showModal: !1
    });
  },
  attrClick: function(t) {
    var a = this,
      e = t.target.dataset.groupId,
      i = t.target.dataset.id,
      o = a.data.attr_group_list;
    for (var r in o)
      if (o[r].attr_group_id == e)
        for (var s in o[r].attr_list) o[r].attr_list[s].attr_id == i ? o[r].attr_list[s].checked = !0 : o[r].attr_list[s].checked = !1;
    for (var n = o.length, d = 0; d < n; d++) u = (l = o[d].attr_list).length;
    for (var c = [], d = 0; d < n; d++)
      for (var l = o[d].attr_list, u = l.length, r = 0; r < u; r++)
        if (1 == l[r].checked) {
          var _ = {
            attr_id: l[r].attr_id,
            attr_name: l[r].attr_name
          };
          c.push(_);
        }
    for (var h = JSON.parse(a.data.goods.attr), g = h.length, p = 0; p < g; p++)
      if (JSON.stringify(h[p].attr_list) == JSON.stringify(c)) var f = h[p].price;
    a.setData({
      attr_group_list: o,
      check_goods_price: f,
      check_attr_list: c
    }), a.setData({
      attr_group_list: o
    });
  },
  onConfirm: function(t) {
    var a = this,
      e = a.data.attr_group_list,
      i = JSON.parse(a.data.goods.attr),
      o = [];
    for (var r in e) {
      i = !1;
      for (var s in e[r].attr_list)
        if (e[r].attr_list[s].checked) {
          i = {
            attr_id: e[r].attr_list[s].attr_id,
            attr_name: e[r].attr_list[s].attr_name
          };
          break;
        }
      if (!i) return wx.showToast({
        title: "请选择" + e[r].attr_group_name,
        image: "/images/icon-warning.png"
      }), !0;
      o.push({
        attr_group_id: e[r].attr_group_id,
        attr_group_name: e[r].attr_group_name,
        attr_id: i.attr_id,
        attr_name: i.attr_name
      });
    }
    a.setData({
      attr_group_list: e
    });
    for (var n = a.data.check_attr_list, d = i.length, c = 0; c < d; c++)
      if (JSON.stringify(i[c].attr_list) == JSON.stringify(n)) var l = i[c].num;
    for (var u = wx.getStorageSync("item").quick_list, _ = a.data.goods, h = u.length, g = [], r = 0; r < h; r++)
      for (var p = u[r].goods, f = p.length, m = 0; m < f; m++) g.push(p[m]);
    for (var v = g.length, y = [], c = 0; c < v; c++) g[c].id == _.id && y.push(g[c]);
    a.setData({
      checked_attr_list: o
    });
    for (var d = o.length, w = [], m = 0; m < d; m++) w.push(o[m].attr_id);
    var x = a.data.carGoods,
      S = a.data.check_goods_price;
    if (0 == S) D = parseFloat(y[0].price);
    else var D = parseFloat(S);
    y[0].id, y[0].name;
    var b = 0;
    if (b > l) {
      wx.showToast({
        title: "商品库存不足",
        image: "/images/icon-warning.png"
      }), b = l;
      for (var f = y.length, k = 0; k < f; k++) y[k].num += 1;
      var I = a.data.total;
      I.total_num += 1, I.total_price = parseFloat(I.total_price), I.total_price += D,
        I.total_price = I.total_price.toFixed(2);
      var T = a.data.quick_hot_goods_lists;
      T.find(function(t) {
        return t.id == _.id;
      });
      a.setData({
        quick_hot_goods_lists: T,
        quick_list: u,
        carGoods: x,
        total: I,
        check_num: b
      });
    }
  },
  receive: function(e) {
    var i = this,
      o = e.currentTarget.dataset.index;
    wx.showLoading({
      title: "领取中",
      mask: !0
    }), i.hideGetCoupon || (i.hideGetCoupon = function(t) {
      var a = t.currentTarget.dataset.url || !1;
      i.setData({
        get_coupon_list: null
      }), a && wx.navigateTo({
        url: a
      });
    }), a.request({
      url: t.coupon.receive,
      data: {
        id: o
      },
      success: function(t) {
        wx.hideLoading(), 0 == t.code ? i.setData({
          get_coupon_list: t.data.list,
          coupon_list: t.data.coupon_list
        }) : (wx.showToast({
          title: t.msg,
          duration: 2e3
        }), i.setData({
          coupon_list: t.data.coupon_list
        }));
      }
    });
  },
  navigatorClick: function(t) {
    var a = t.currentTarget.dataset.open_type,
      e = t.currentTarget.dataset.url;
    return "wxapp" != a || (e = function(t) {
      var a = /([^&=]+)=([\w\W]*?)(&|$|#)/g,
        e = /^[^\?]+\?([\w\W]+)$/.exec(t),
        i = {};
      if (e && e[1])
        for (var o, r = e[1]; null != (o = a.exec(r));) i[o[1]] = o[2];
      return i;
    }(e), e.path = e.path ? decodeURIComponent(e.path) : "", wx.navigateToMiniProgram({
      appId: e.appId,
      path: e.path,
      complete: function(t) {}
    }), !1);
  },
  closeCouponBox: function(t) {
    this.setData({
      get_coupon_list: ""
    });
  },
  notice: function() {
    var t = this.data.notice;
    if (void 0 != t) t.length;
  },
  miaoshaTimer: function() {
    var t = this;
    if (t.data.miaosha.ms_next) {
      if (!t.data.miaosha) return;
      t.setData({
        opendate: t.data.miaosha.date,
        miaosha: t.data.miaosha,
        ms_next: t.data.miaosha.ms_next
      });
    } else {
      if (!t.data.miaosha || !t.data.miaosha.rest_time) return;
      r = setInterval(function() {
        t.data.miaosha.rest_time > 0 ? (t.data.miaosha.rest_time = t.data.miaosha.rest_time - 1,
          t.data.miaosha.times = t.getTimesBySecond(t.data.miaosha.rest_time), t.setData({
            opendate: t.data.miaosha.date,
            miaosha: t.data.miaosha,
            ms_next: t.data.miaosha.ms_next
          })) : clearInterval(r);
      }, 1e3);
    }
  },
  onHide: function() {
    a.pageOnHide(this), this.setData({
      play: -1
    }), clearInterval(1), clearInterval(i);
  },
  onUnload: function() {
    a.pageOnUnload(this), this.setData({
      play: -1
    }), clearInterval(r), clearInterval(1), clearInterval(i);
  },
  showNotice: function() {
    this.setData({
      show_notice: !0
    });
  },
  closeNotice: function() {
    this.setData({
      show_notice: !1
    });
  },
  getTimesBySecond: function(t) {
    if (t = parseInt(t), isNaN(t)) return {
      h: "00",
      m: "00",
      s: "00"
    };
    var a = parseInt(t / 3600),
      e = parseInt(t % 3600 / 60),
      i = t % 60;
    return a >= 1 && (a -= 1), {
      h: a < 10 ? "0" + a : "" + a,
      m: e < 10 ? "0" + e : "" + e,
      s: i < 10 ? "0" + i : "" + i
    };
  },
  to_dial: function() {
    var t = this.data.store.contact_tel;
    wx.makePhoneCall({
      phoneNumber: t
    });
  },
  closeActModal: function() {
    var t, a = this,
      e = a.data.act_modal_list,
      i = !0;
    for (var o in e) {
      var r = parseInt(o);
      e[r].show && (e[r].show = !1, void 0 !== e[t = r + 1] && i && (i = !1, setTimeout(function() {
        a.data.act_modal_list[t].show = !0, a.setData({
          act_modal_list: a.data.act_modal_list
        });
      }, 500)));
    }
    a.setData({
      act_modal_list: e
    });
  },
  naveClick: function(t) {
    var e = this;
    a.navigatorClick(t, e);
  },
  play: function(t) {
    this.setData({
      play: t.currentTarget.dataset.index
    });
  },
  onPageScroll: function(t) {
    var a = this;
    n || -1 != a.data.play && wx.createSelectorQuery().select(".video").fields({
      rect: !0
    }, function(t) {
      var e = wx.getSystemInfoSync().windowHeight;
      (t.top <= -200 || t.top >= e - 57) && a.setData({
        play: -1
      });
    }).exec();
  },
  fullscreenchange: function(t) {
    n = !!t.detail.fullScreen;
  }
});