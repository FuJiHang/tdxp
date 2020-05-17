var a = getApp();

Page({
    data: {
        pageSize: 10,
        pageIndex: 1,
        CountDownList: null
    },
    onLoad: function(t) {
        t.ReferralUserId && a.setRefferUserId(t.ReferralUserId), this.loadData(this, !1);
    },
    loadData: function(t, e) {
        wx.showNavigationBarLoading(), wx.request({
            url: a.getUrl("GetCountDownList"),
            data: {
                pageIndex: t.data.pageIndex,
                pageSize: t.data.pageSize
            },
            success: function(a) {
                if ("OK" == a.data.Status) {
                    console.log(e);
                    var n = a.data.Data;
                    if (e) {
                        var o = t.data.CountDownList;
                        o.push.apply(o, n), t.setData({
                            CountDownList: o
                        });
                    } else t.setData({
                        CountDownList: n
                    });
                } else wx.showModal({
                    title: "提示",
                    content: a.data.Message,
                    showCancel: !1,
                    success: function(a) {
                        a.confirm && wx.navigateBack({
                            delta: 1
                        });
                    }
                });
            },
            complete: function() {
                wx.hideNavigationBarLoading();
            }
        });
    },
    BuyCountDown: function(a) {
        var t = a.currentTarget.dataset.id;
        wx.navigateTo({
            url: "../countdowndetail/countdowndetail?id=" + t
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onReachBottom: function() {
        var a = this, t = a.data.pageIndex;
        console.log(t), a.setData({
            pageIndex: t + 1
        }), a.loadData(this, !0);
    },
    onShareAppMessage: function(t) {
        var e = "/pages/countdown/countdown";
        return a.globalData.userInfo && a.globalData.userInfo.IsReferral && (e += "&ReferralUserId=" + a.globalData.userInfo.UserId), 
        {
            title: "限时抢购",
            path: e,
            success: function(a) {
                hishop.showTip("分享成功", "success");
            },
            fail: function(a) {
                hishop.showTip("分享失败", "error");
            }
        };
    }
});