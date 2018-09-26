module.exports = function(a) {
    a.data || (a.data = {});
    var e = wx.getStorageSync("access_token");
    e && (a.data.access_token = e), a.data._uniacid = this.siteInfo.uniacid, a.data._acid = this.siteInfo.acid, 
    a.data._version = this._version, "undefined" != typeof wx && (a.data._platform = "wx"), 
    "undefined" != typeof my && (a.data._platform = "my"), wx.request({
        url: a.url,
        header: a.header || {
            "content-type": "application/x-www-form-urlencoded"
        },
        data: a.data || {},
        method: a.method || "GET",
        dataType: a.dataType || "json",
        success: function(e) {
            -1 == e.data.code ? getApp().login() : -2 == e.data.code ? wx.redirectTo({
                url: "/pages/store-disabled/store-disabled"
            }) : a.success && a.success(e.data);
        },
        fail: function(e) {
            console.warn("--- request fail >>>"), console.warn("--- " + a.url + " ---"), console.warn(e), 
            console.warn("<<< request fail ---");
            var t = getApp();
            t.is_on_launch ? (t.is_on_launch = !1, wx.showModal({
                title: "网络请求出错",
                content: e.errMsg,
                showCancel: !1,
                success: function(e) {
                    e.confirm && a.fail && a.fail(e);
                }
            })) : (wx.showToast({
                title: e.errMsg,
                image: "/images/icon-warning.png"
            }), a.fail && a.fail(e));
        },
        complete: function(e) {
            if (200 != e.statusCode && e.data.code && 500 == e.data.code) {
                var t = e.data.data.message;
                wx.showModal({
                    title: "系统错误",
                    content: t + ";\r\n请将错误内容复制发送给我们，以便进行问题追踪。",
                    cancelText: "关闭",
                    confirmText: "复制",
                    success: function(t) {
                        t.confirm && wx.setClipboardData({
                            data: JSON.stringify({
                                data: e.data.data,
                                object: a
                            })
                        });
                    }
                });
            }
            a.complete && a.complete(e);
        }
    });
};