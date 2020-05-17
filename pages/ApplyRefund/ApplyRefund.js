var e = getApp();
const app=getApp()
Page({
    data: {
        userInfo:app.globalData.GetMembersInfo,
        OrderId: "",
        SkuId: "",
        RefundType: 0,
        RefundTypeText: "请选择退款方式",
        RefundMoney: 0,
        RefundReason: 0,
        RefundReasonText: "请选择退款原因",
        Remark: "",
        BankName: "",
        BankAccountName: "",
        BankAccountNo: "",
        ShowReason: !0,
        ShowType: !0,
        ShowReasonList: [ "拍错/多拍/不想要", "缺货", "未按约定时间发货" ],
        ShowReasonIndex: -1,
/*         RefundTextList: ["原路返回", "到店退款" ], */
        RefundTextList: ["原路返回" ],

        // RefundTextList: [ "退到预付款", "退到银行卡", "原路返回", "到店退款" ],
        ShowRefundIndex: -1 ,
    },
    onLoad: function(t) {
        this.setData({
            userInfo:app.globalData.GetMembersInfo
        })
        console.log(app.globalData.GetMembersInfo)
        console.log(this.data.userInfo)
        // console.log(t.data.ShowRefundIndex,'1111')
        // console.log(t.data.RefundTypeText,'222')
        // console.log(t.data.RefundType,'333333')
        var n = this, a = t.orderid;
        t.m;
        n.setData({
            // ShowRefundIndex:1,
            // RefundTypeText:'退到银行卡',
            // RefundType:2,
            OrderId: a
        }), e.getOpenId(function(t) {
            wx.request({
                url: e.getUrl(e.globalData.getAfterSalePreCheck),
                data: {
                    openId: t,
                    IsReturn: !1,
                    OrderId: a,
                    SkuId: ""
                },
                success: function(e) {
                    n.GetCheckData(e);
                }
            });
        });
    },
    GetCheckData: function(e) {
        var t = e.data;
        if ("NOUser" == t.Message) wx.navigateTo({
            url: "/pages/login/login"
        }); else if ("OK" == t.Status) {
            // var n = [];
            // t.CanBackReturn && n.push("原路返回"), t.CanToBalance && n.push("退到预付款"), t.CanReturnOnStore && n.push("到店退款"), 
            // n.push("退到银行卡"),
             this.setData({
                RefundMoney: t.MaxRefundAmount,
                // RefundTextList: n
            });
        } else wx.showModal({
            title: "提示",
            content: t.Message,
            showCancel: !1,
            success: function(e) {
                e.confirm && wx.navigateBack({
                    delta: 1
                });
            }
        });
    },
    InputText: function(e) {
        var t = this, n = e.currentTarget.dataset.names, a = e.detail.value;
        switch (n) {
          case "BankName":
            t.setData({
                BankName: a
            });
            break;

          case "BankAccountName":
            t.setData({
                BankAccountName: a
            });
            break;

          case "BankAccountNo":
            t.setData({
                BankAccountNo: a
            });
            break;

          default:
            t.setData({
                Remark: a
            });
        }
    },
    ShowReason: function(e) {
        var t = this;
        wx.showActionSheet({
            itemList: t.data.ShowReasonList,
            success: function(e) {
                console.log(e), t.setData({
                    ShowReasonIndex: e.tapIndex
                });
            },
            fail: function(e) {
                console.log(e.errMsg);
            }
        });
    },
    ShowType: function(e) {
        // return //fujihang
        var t = this;
        wx.showActionSheet({
            itemList: t.data.RefundTextList,
            success: function(e) {
                if (!e.cancel) {
                    var n = t.data.RefundTextList[e.tapIndex], a = t.GetRefundTypeId(n);
                    console.log(n), console.log(a), t.setData({
                        ShowRefundIndex: e.tapIndex,
                        RefundTypeText: n,
                        RefundType: a
                    });
                    console.log(t.data.ShowRefundIndex,'1111')
                    console.log(t.data.RefundTypeText,'222')
                    console.log(t.data.RefundType,'333333')
                }
            },
            fail: function(e) {
                console.log(e.errMsg);
            }
        });
    },
    ChooseReason: function(e) {
        var t = this, n = e.currentTarget.dataset.name;
        t.setData({
            RefundReasonText: n,
            ShowType: !0,
            ShowReason: !0
        });
    },
    ChooseType: function(e) {
        var t = this, n = t.RefundTextList[e.currentTarget.dataset.id], a = GetRefundTypeId(n);
        console.log(e.currentTarget.dataset.id), console.log(a), t.setData({
            RefundType: a,
            RefundTypeText: n,
            ShowType: !0,
            ShowReason: !0
        });
    },
    GetRefundTypeId: function(e) {
        return "退到预付款" == e ? 1 : "退到银行卡" == e ? 2 : "原路返回" == e ? 3 : 4;
    },
    formSubmit: function(t) {
        var n = this, a = parseInt(n.data.ShowReasonIndex), o = t.detail.formId, s = n.ToTrim(t.detail.value.txtBankName), c = n.ToTrim(t.detail.value.txtBankAccountName), u = n.ToTrim(t.detail.value.txtBankAccountNo), d = n.data.RefundType;
        2 == d && (s.length <= 0 || c.length <= 0 || u.length <= 0) ? wx.showModal({
            title: "提示",
            content: "银行卡信息不允许为空！",
            showCancel: !1,
            confirmColor: "#ff5722"
        }) : d ? a < 0 ? wx.showModal({
            title: "提示",
            content: "请选择要退款的原因",
            showCancel: !1,
            confirmColor: "#ff5722"
        }) : n.data.OrderId.length <= 0 ? wx.showModal({
            title: "提示",
            content: "请选择要退款的订单",
            showCancel: !1,
            confirmColor: "#ff5722"
        }) : e.getOpenId(function(t) {
            wx.request({
                url: e.getUrl("ApplyRefund"),
                data: {
                    openId: t,
                    skuId: n.data.SkuId,
                    orderId: n.data.OrderId,
                    RefundType: d,
                    RefundReason: n.data.ShowReasonList[a],
                    Remark: n.data.Remark,
                    BankName: s,
                    BankAccountName: c,
                    BankAccountNo: u,
                    FormId: o
                },
                success: function(e) {
                    "OK" == e.data.Status ? wx.showModal({
                        title: "提示",
                        content: e.data.Message,
                        showCancel: !1,
                        confirmColor: "#ff5722",
                        success: function(e) {
                            wx.redirectTo({
                                url: "../applylist/applylist"
                            });
                        }
                    }) : "NOUser" == e.data.Message ? wx.navigateTo({
                        url: "/pages/login/login"
                    }) : wx.showModal({
                        title: "提示",
                        content: e.data.Message,
                        showCancel: !1,
                        confirmColor: "#ff5722",
                        success: function(e) {
                            e.confirm && wx.navigateBack({
                                delta: 1
                            });
                        }
                    });
                },
                complete: function() {}
            });
        }) : wx.showModal({
            title: "提示",
            content: "请选择要退款的方式",
            showCancel: !1,
            confirmColor: "#ff5722"
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