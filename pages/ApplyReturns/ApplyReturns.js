var e = getApp();

Page({
    data: {
        OrderId: "",
        SkuId: "",
        Name: "",
        AfterSaleType: 0,
        AfterSaleTypeText: "请选择售后类型",
        RefundType: 0,
        RefundTypeText: "请选择退款方式",
        RefundReasonText: "请选择退货原因",
        Remark: "",
        BankName: "",
        BankAccountName: "",
        BankAccountNo: "",
        UserCredentials: [ "../../images/return-img_03.jpg", "../../images/return-img_03.jpg", "../../images/return-img_03.jpg" ],
        ReturnNum: 1,
        MostMoney: 0,
        ShowReason: !0,
        ShowType: !0,
        ShowAfterType: !0,
        ApplyReturnNum: 1,
        TotalMoney: 0,
        UploadGredentials: [],
        FormId: "",
        ReturnMoney: 0,
        ImageIndex: 0,
        ShowReasonList: [ "拍错/多拍/不想要", "缺货", "未按约定时间发货" ],
        ShowReasonIndex: -1,
        RefundTextList: [ "原路返回", "到店退款" ],

        // RefundTextList: [ "退到预付款", "退到银行卡", "原路返回", "到店退款" ],
        ShowRefundIndex: -1,
        AfterSaleTypeList: [ "退货退款", "仅退款" ],
        AfterSaleTypeId: -1,
        OneReundAmount: 0
    },
    onLoad: function(t) {
        var a = this, n = t.orderid, o = t.skuId, s = t.pro, r = t.num, u = t.m;
        a.setData({
            OrderId: n,
            SkuId: o,
            Name: s,
            ReturnNum: r,
            MostMoney: u,
            TotalMoney: u
        }), e.getOpenId(function(t) {
            wx.request({
                url: e.getUrl(e.globalData.getAfterSalePreCheck),
                data: {
                    openId: t,
                    IsReturn: !0,
                    OrderId: n,
                    SkuId: o
                },
                success: function(e) {
                    a.GetCheckData(e);
                }
            });
        });
    },
    GetCheckData: function(e) {
        var t = e.data;
        if ("NOUser" == t.Message) wx.navigateTo({
            url: "/pages/login/login"
        }); else if ("OK" == t.Status) {
            var a = [];
            t.CanBackReturn && a.push("原路返回"), t.CanToBalance && a.push("退到预付款"), t.CanReturnOnStore && a.push("到店退款"), 
            a.push("退到银行卡");
            var n = [ "退货退款", "仅退款" ];
            t.MaxRefundAmount <= 0 && (n = [ "退货退款" ]), this.setData({
                MostMoney: t.MaxRefundAmount,
                RefundTextList: a,
                TotalMoney: t.MaxRefundAmount,
                ReturnNum: t.MaxRefundQuantity,
                ApplyReturnNum: t.MaxRefundQuantity,
                OneReundAmount: t.oneReundAmount,
                AfterSaleTypeList: n
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
    uploadImg: function(e) {
        var t = this, a = t.data.UserCredentials, n = e.currentTarget.dataset.index;
        wx.chooseImage({
            success: function(e) {
                a[n] = e.tempFilePaths[0];
                var o = parseInt(t.data.ImageIndex);
                o = o >= 2 ? 2 : o++, t.setData({
                    UserCredentials: a,
                    ImageIndex: o
                });
            }
        });
    },
    ShowAfterType: function(e) {
        var t = this;
        wx.showActionSheet({
            itemList: t.data.AfterSaleTypeList,
            success: function(e) {
                e.cancel || t.setData({
                    AfterSaleTypeId: e.tapIndex
                });
            },
            fail: function(e) {
                console.log(e.errMsg);
            }
        });
    },
    ShowResaon: function(e) {
        var t = this;
        wx.showActionSheet({
            itemList: t.data.ShowReasonList,
            success: function(e) {
                t.setData({
                    ShowReasonIndex: e.tapIndex
                });
            },
            fail: function(e) {
                console.log(e.errMsg);
            }
        });
    },
    ShowRefundType: function(e) {
        var t = this;
        wx.showActionSheet({
            itemList: t.data.RefundTextList,
            success: function(e) {
                if (!e.cancel) {
                    var a = t.data.RefundTextList[e.tapIndex], n = t.GetRefundTypeId(a);
                    t.setData({
                        ShowRefundIndex: e.tapIndex,
                        RefundTypeText: a,
                        RefundType: n
                    });
                }
            },
            fail: function(e) {
                console.log(e.errMsg);
            }
        });
    },
    ChooseReason: function(e) {
        var t = this, a = e.currentTarget.dataset.name;
        t.setData({
            RefundReasonText: a,
            ShowType: !0,
            ShowReason: !0,
            ShowAfterType: !0
        });
    },
    GetRefundTypeId: function(e) {
        return "退到预付款" == e ? 1 : "退到银行卡" == e ? 2 : "原路返回" == e ? 3 : 4;
    },
    GetAfterSaleTypeId: function(e) {
        return "退货退款" == e ? 1 : "仅退款" == e ? 3 : 1;
    },
    ChooseAfterType: function(e) {
        var t = e.currentTarget.dataset.id, a = this, n = a.ShowAfterTypeName[t];
        a.setData({
            AfterSaleType: t,
            AfterSaleTypeText: n,
            ShowType: !0,
            ShowReason: !0,
            ShowAfterType: !0
        });
    },
    MuseNum: function(e) {
        var t = this, a = t.data.ApplyReturnNum;
        if (a <= 1) wx.showModal({
            title: "提示",
            content: "最少退1件商品",
            showCancel: !1,
            confirmColor: "#ff5722"
        }); else {
            a -= 1;
            var n = parseFloat(a * t.data.OneReundAmount).toFixed(2);
            t.setData({
                ApplyReturnNum: a,
                TotalMoney: n
            });
        }
    },
    AddNum: function(e) {
        var t = this, a = parseInt(t.data.ApplyReturnNum), n = parseInt(t.data.ReturnNum);
        if (a >= n) wx.showModal({
            title: "提示",
            content: "最多退" + n + "件商品",
            showCancel: !1,
            confirmColor: "#ff5722"
        }); else {
            a += 1;
            var o = parseFloat(a * t.data.OneReundAmount).toFixed(2);
            t.setData({
                ApplyReturnNum: a,
                TotalMoney: o
            });
        }
    },
    formSubmit: function(e) {
        var t = this, a = parseInt(t.data.ShowReasonIndex), n = t.data.AfterSaleTypeList[t.data.AfterSaleTypeId], o = t.GetAfterSaleTypeId(n), s = e.detail.formId, r = t.ToTrim(e.detail.value.txtBankName), u = t.ToTrim(e.detail.value.txtBankAccountName), d = t.ToTrim(e.detail.value.txtBankAccountNo), l = parseFloat(e.detail.value.txtmoney.replace("￥", "")), i = parseInt(t.data.ApplyReturnNum);
        if (i <= 0 || i > t.data.ReturnNum) wx.showModal({
            title: "提示",
            content: "请输入正确的退货数量",
            showCancel: !1,
            confirmColor: "#ff5722"
        }); else if (l > t.data.OneReundAmount * i) wx.showModal({
            title: "提示",
            content: "请输入正确的退款金额,金额必须小于等于" + t.data.OneReundAmount * i + "元",
            showCancel: !1,
            confirmColor: "#ff5722"
        }); else {
            var f = e.detail.value.txtarea, c = t.data.RefundType;
            if (2 == c && (r.length <= 0 || u.length <= 0 || d.length <= 0)) wx.showModal({
                title: "提示",
                content: "银行卡信息不允许为空！",
                showCancel: !1,
                confirmColor: "#ff5722"
            }); else if (c <= 0) wx.showModal({
                title: "提示",
                content: "请选择要退款的方式",
                showCancel: !1,
                confirmColor: "#ff5722"
            }); else if (a < 0) wx.showModal({
                title: "提示",
                content: "请选择要退款的原因",
                showCancel: !1,
                confirmColor: "#ff5722"
            }); else if (o < 0) wx.showModal({
                title: "提示",
                content: "请选择售后类型",
                showCancel: !1,
                confirmColor: "#ff5722"
            }); else if (t.data.OrderId.length <= 0) wx.showModal({
                title: "提示",
                content: "请选择要退款的订单",
                showCancel: !1,
                confirmColor: "#ff5722"
            }); else {
                t.setData({
                    formId: s,
                    AfterSaleTypeId: o,
                    Remark: f,
                    BankName: r,
                    BankAccountName: u,
                    BankAccountNo: d,
                    ApplyReturnNum: i,
                    ReturnMoney: l,
                    UploadGredentials: []
                });
                var p = [];
                t.data.UserCredentials.find(function(e, t) {
                    "../../images/return-img_03.jpg" != e && p.push(e);
                }), t.UploadBatchImages(t, p);
            }
        }
    },
    UploadBatchImages: function(t, a) {
        var n = a.shift();
        void 0 != n ? e.getOpenId(function(o) {
            wx.uploadFile({
                url: e.getUrl("UploadAppletImage"),
                filePath: n,
                name: "file",
                formData: {
                    openId: o,
                    appid:e.globalData.appId,
                },
                success: function(e) {
                    var a = JSON.parse(e.data);
                    if ("OK" == a.Status) {
                        var n = t.data.UploadGredentials;
                        n.push(a.Data[0].ImageUrl), t.setData({
                            UploadGredentials: n
                        });
                    } else "NOUser" == a.Message ? wx.navigateTo({
                        url: "/pages/login/login"
                    }) : wx.showModal({
                        title: "提示",
                        content: a.ErrorResponse.ErrorMsg,
                        showCancel: !1,
                        confirmColor: "#ff5722",
                        success: function(e) {
                            e.confirm && wx.navigateBack({
                                delta: 1
                            });
                        }
                    });
                },
                complete: function() {
                    a.length > 0 ? t.UploadBatchImages(t, a) : t.AddReturnInfo();
                }
            });
        }) : t.AddReturnInfo();
    },
    AddReturnInfo: function() {
        var t = this;
        e.getOpenId(function(a) {
            wx.request({
                url: e.getUrl("ApplyReturn"),
                data: {
                    openId: a,
                    skuId: t.data.SkuId,
                    orderId: t.data.OrderId,
                    Quantity: t.data.ApplyReturnNum,
                    RefundAmount: t.data.ReturnMoney,
                    afterSaleType: t.data.AfterSaleTypeId,
                    RefundType: t.data.RefundType,
                    RefundReason: t.data.ShowReasonList[t.data.ShowReasonIndex],
                    Remark: t.data.Remark,
                    BankName: t.data.BankName,
                    BankAccountName: t.data.BankAccountName,
                    BankAccountNo: t.data.BankAccountNo,
                    UserCredentials: t.data.UploadGredentials.join(","),
                    formId: t.data.formId
                },
                success: function(e) {
                    "OK" == e.data.Status ? wx.showModal({
                        title: "提示",
                        confirmColor: "#ff5722",
                        content: e.data.Message,
                        showCancel: !1,
                        success: function(e) {
                            wx.redirectTo({
                                url: "../applylist/applylist"
                            });
                        }
                    }) : "NOUser" == e.data.Message ? wx.navigateTo({
                        url: "/pages/login/login"
                    }) : wx.showModal({
                        title: "提示",
                        confirmColor: "#ff5722",
                        content: e.data.Message,
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