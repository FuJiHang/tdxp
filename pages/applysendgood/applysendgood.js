var e = getApp();

Page({
    data: {
        ApplySendGood: null,
        ProductName: "",
        formId: "",
        express: "请选择物流公司",
        shipOrderNumber: "",
        IsShowExpress: !0,
        ExpressList: [],
        index: 0
    },
    onLoad: function(t) {
        var a = this, n = t.id;
        t.skuId;
        e.getOpenId(function(t) {
            wx.request({
                url: e.getUrl("GetReturnDetail"),
                data: {
                    openId: t,
                    returnId: n
                },
                success: function(e) {
                    if ("OK" == e.data.Status) {
                        var t = e.data.Data;
                        a.setData({
                            ApplySendGood: t
                        });
                    } else "NOUser" == e.data.Message ? wx.navigateTo({
                        url: "/pages/login/login"
                    }) : wx.showModal({
                        title: "提示",
                        content: e.data.Message,
                        showCancel: !1,
                        success: function(e) {
                            e.confirm && wx.navigateBack({
                                delta: 1
                            });
                        }
                    });
                },
                complete: function() {
                    a.LoadExpress();
                }
            });
        });
    },
    bindPickerChange: function(e) {
        var t = this, a = e.detail.value, n = t.data.ExpressList;
        t.setData({
            express: n[a]
        });
    },
    ShowExpress: function(e) {
        var t = this;
        t.data.ExpressList.length > 0 ? t.setData({
            IsShowExpress: !1
        }) : wx.showModal({
            title: "提示",
            content: "物流公司加载失败",
            showCancel: !1
        });
    },
    LoadExpress: function() {
        var t = this;
        wx.request({
            url: e.getUrl("GetExpressList"),
            success: function(e) {
                if ("OK" == e.data.Status) {
                    var a = new Array();
                    e.data.Data.find(function(e, t) {
                        void 0 != e.ExpressName && a.push(e.ExpressName);
                    }), t.setData({
                        ExpressList: a
                    });
                }
            }
        });
    },
    formSubmit: function(t) {
        var a = this, n = t.detail.formId;
        if ("请选择物流公司" != a.data.express) {
            var s = a.ToTrim(t.detail.value.txtshipOrderNumber);
            null == s || "undefined" == s || s.length <= 0 ? wx.showModal({
                title: "提示",
                content: "快递单号不允许为空",
                showCancel: !1
            }) : e.getOpenId(function(t) {
                wx.request({
                    url: e.getUrl("ReturnSendGoods"),
                    data: {
                        openId: t,
                        skuId: a.data.ApplySendGood.SkuId,
                        orderId: a.data.ApplySendGood.OrderId,
                        ReturnsId: a.data.ApplySendGood.ReturnId,
                        express: a.data.express,
                        shipOrderNumber: s,
                        formId: n
                    },
                    success: function(e) {
                        "OK" == e.data.Status ? wx.showModal({
                            title: "提示",
                            content: e.data.Message,
                            showCancel: !1,
                            success: function(e) {
                                e.confirm && wx.navigateBack({
                                    delta: 1
                                });
                            }
                        }) : "NOUser" == e.data.Message ? wx.navigateTo({
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
                    },
                    complete: function() {}
                });
            });
        } else wx.showModal({
            title: "提示",
            content: "请选择物流公司",
            showCancel: !1
        });
    },
    ToTrim: function(e) {
        return e.replace(/(^\s*)|(\s*$)/g, "");
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});