var t = require("../../utils/util.js"), e = getApp();

Page({
    data: {
        RefundInfo: null,
        Credentials: [],
        ProgressStatue: [],
        isExpend: !0
    },
    ExpendProgress: function() {
        var t = !this.data.isExpend;
        this.setData({
            isExpend: t
        });
    },
    onLoad: function(t) {
        var n = this, a = t.id;
        e.getOpenId(function(t) {
            wx.request({
                url: e.getUrl("GetRefundDetail"),
                data: {
                    openId: t,
                    RefundId: a
                },
                success: function(t) {
                    if ("OK" == t.data.Status) {
                        var e = t.data.Data, a = [];
                        "".length > 0 && (a = "".split(",")), n.setData({
                            RefundInfo: e,
                            Credentials: a
                        }), n.ShowProgress(e);
                    } else "NOUser" == t.data.Message ? wx.navigateTo({
                        url: "/pages/login/login"
                    }) : wx.showModal({
                        title: "提示",
                        content: t.data.ErrorResponse.ErrorMsg,
                        showCancel: !1,
                        success: function(t) {
                            t.confirm && wx.navigateBack({
                                delta: 1
                            });
                        }
                    });
                },
                complete: function() {}
            });
        });
    },
    ShowProgress: function(e) {
        var n = this, a = {
            status: parseInt(e.Status),
            time: t.formatTime(e.ApplyForTime),
            finishedTime: t.formatTime(e.DealTime)
        };
        n.setData({
            ProgressStatue: a
        });
    },
    goToProductDetail: function(t) {
        var e = t.currentTarget.dataset.productid;
        wx.navigateTo({
            url: "../productdetail/productdetail?id=" + e
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});