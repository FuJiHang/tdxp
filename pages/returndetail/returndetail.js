var e = require("../../utils/util.js"), t = getApp();

Page({
    data: {
        RefundInfo: null,
        ProgressStatue: [],
        Credentials: [],
        isExpend: !0
    },
    onLoad: function(e) {
        var a = this, i = e.id;
        t.getOpenId(function(e) {
            wx.request({
                url: t.getUrl("GetReturnDetail"),
                data: {
                    openId: e,
                    returnId: i
                },
                success: function(e) {
                    if ("OK" == e.data.Status) {
                        var t = e.data.Data;
                        a.setData({
                            RefundInfo: t,
                            Credentials: t.UserCredentials
                        }), wx.setNavigationBarTitle({
                            title: t.IsOnlyRefund ? "退款详情" : "退货详情"
                        }), a.ShowProgress(t);
                    } else "NOUser" == e.data.Message ? wx.navigateTo({
                        url: "/pages/login/login"
                    }) : wx.showModal({
                        title: "提示",
                        content: e.data.ErrorResponse.ErrorMsg,
                        showCancel: !1,
                        success: function(e) {
                            e.confirm && wx.navigateBack({
                                delta: 1
                            });
                        }
                    });
                }
            });
        });
    },
    prevImage: function(e) {
        var t = this, a = (e.target.dataset.index, e.target.dataset.src);
        wx.previewImage({
            current: a,
            urls: t.data.Credentials
        });
    },
    ExpendProgress: function() {
        var e = !this.data.isExpend;
        this.setData({
            isExpend: e
        });
    },
    ShowProgress: function(t) {
        var a = this, i = parseInt(t.Status), n = [ {
            statue: 0,
            statuename: t.IsOnlyRefund ? "申请退款中" : "申请退货中",
            time: e.formatTime(t.ApplyForTime),
            ishidden: !1,
            isactive: !0
        }, {
            statue: t.IsOnlyRefund ? 1 : 3,
            statuename: "商家同意申请",
            time: e.formatTime(t.DealTime),
            ishidden: !1,
            isactive: !1
        }, {
            statue: 2,
            statuename: t.IsOnlyRefund ? "商家拒绝申请" : "商家拒绝退货",
            time: e.formatTime(t.DealTime),
            ishidden: !0,
            isactive: !1
        }, {
            statue: 4,
            statuename: "买家退货",
            time: e.formatTime(t.UserSendGoodsTime),
            ishidden: !1,
            isactive: !1
        }, {
            statue: 5,
            statuename: "商家确认收货",
            time: e.formatTime(t.ConfirmGoodsTime),
            ishidden: !1,
            isactive: !1
        }, {
            statue: 2,
            statuename: t.IsOnlyRefund ? "退款失败" : "退货失败",
            time: e.formatTime(t.DealTime),
            ishidden: !0,
            isactive: !1
        }, {
            statue: 1,
            statuename: t.IsOnlyRefund ? "退款完成" : "退货完成",
            time: e.formatTime(t.FinishTime),
            ishidden: !1,
            isactive: !1
        } ];
        n.forEach(function(e, a, n) {
            t.IsOnlyRefund ? (e.statue > 1 && (e.ishidden = !0), 1 == i && (e.isactive = !0)) : ((1 == i || parseInt(i) >= parseInt(e.statue)) && 1 != e.statue && 2 != e.statue && (e.isactive = !0), 
            1 == i && 1 == e.statue && (e.isactive = !0)), 2 == i && 0 != a && (2 == e.statue ? (e.ishidden = !1, 
            e.isactive = !0) : e.ishidden = !0);
        }), a.setData({
            ProgressStatue: n
        });
    },
    SendGood: function(e) {
        var t = e.currentTarget.dataset.id, a = e.currentTarget.dataset.skuid;
        wx.navigateTo({
            url: "../applysendgood/applysendgood?id=" + t + "&&skuId=" + a
        });
    },
    goToProductDetail: function(e) {
        var t = e.currentTarget.dataset.productid;
        wx.navigateTo({
            url: "../productdetail/productdetail?id=" + t
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