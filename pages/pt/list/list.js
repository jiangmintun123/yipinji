require("../../../api.js");

var n = getApp();

Page({
    data: {
        cid: 0
    },
    onLoad: function(o) {
        n.pageOnLoad(this);
    },
    onReady: function() {},
    onShow: function(o) {
        n.pageOnShow(this);
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    lower: function(n) {}
});