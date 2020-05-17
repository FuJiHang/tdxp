function t(t) {
    var e = parseInt(t / 86400), a = parseInt(t % 86400 / 3600), n = parseInt(t % 3600 / 60), o = parseInt(t % 3600 % 60), i = "";
    return e > 0 && (i += e + "天"), a < 10 && (a = "0" + a), n < 10 && (n = "0" + n), 
    o < 10 && (o = "0" + o), i += a + ":" + n + ":" + o;
}

function e(a, n) {
    a.setData({
        StartClock: t(n)
    }), n <= 0 ? a.setData({
        StartClock: "",
        CountDownStatus: "Normal"
    }) : setTimeout(function() {
        e(a, n -= 1);
    }, 1e3);
}

function a(e, n) {
    e.setData({
        EndClock: t(n)
    }), n <= 0 ? e.setData({
        EndClock: "",
        CountDownStatus: "ActivityEnd"
    }) : setTimeout(function() {
        a(e, n -= 1);
    }, 1e3);
}

var n = getApp(), o = require("../../wxParse/wxParse");

Page({
    data: {
        CountDownId: 0,
        MaxCount: 0,
        CountDownStatus: "",
        StartDate: "",
        EndDate: "",
        NowTime: "",
        ProductId: 0,
        ProductName: "",
        TempMetaDescription: "",
        MetaDescription: "",
        ShortDescription: "",
        ShowSaleCounts: "",
        MarketPrice: "",
        IsfreeShipping: "",
        MaxSalePrice: "",
        MinSalePrice: "",
        ReviewCount: 0,
        ProductImgs: "",
        SkuItemList: "",
        Skus: "",
        Freight: "",
        Coupons: "",
        ShowPrice: "",
        backShow: "none",
        SkuShow: "none",
        couponShow: "none",
        skuImg: "",
        skuPrice: 0,
        skuStock: 0,
        selectedSku: "",
        selectedSkuContent: "",
        buyAmount: 1,
        selectedskuList: [],
        activeDateMsg: "",
        StartClock: "",
        EndClock: ""
    },
    onReachBottom: function() {
        var t = this;
        if (null == this.data.metaDescription || "" == this.metaDescription) {
            var e = t.data.TempMetaDescription;
            null != e && void 0 != e && o.wxParse("metaDescription", "html", e, t);
        }
    },
    onLoad: function(t) {
        t.ReferralUserId && n.setRefferUserId(t.ReferralUserId);
        var o = this, i = t.id;
        n.getOpenId(function(t) {
            wx.request({
                url: n.getUrl("GetCountDownProductDetail"),
                data: {
                    openId: t,
                    countDownId: i
                },
                success: function(t) {
                    if ("OK" == t.data.Status) {
                        var n = t.data.Data;
                        if (n.NowTime < n.StartDate) {
                            var i = new Date(n.NowTime), s = (u = new Date(n.StartDate)).getTime() - i.getTime();
                            e(o, r = s / 1e3);
                        }
                        if (n.NowTime > n.StartDate && n.NowTime < n.EndDate) {
                            var i = new Date(n.NowTime), u = new Date(n.EndDate), r = (s = u.getTime() - i.getTime()) / 1e3;
                            a(o, r);
                        }
                        var c = "";
                        0 == n.SkuItemList.length && (c = n.Skus[0].SkuId), o.setData({
                            CountDownId: n.CountDownId,
                            MaxCount: n.MaxCount,
                            CountDownStatus: n.CountDownStatus,
                            StartDate: n.StartDate,
                            EndDate: n.EndDate,
                            NowTime: n.NowTime,
                            ProductId: n.ProductId,
                            ProductName: n.ProductName,
                            ShortDescription: n.ShortDescription,
                            ShowSaleCounts: n.ShowSaleCounts,
                            MarketPrice: n.MarketPrice,
                            IsfreeShipping: n.IsfreeShipping,
                            MaxSalePrice: n.MaxSalePrice,
                            MinSalePrice: n.MinSalePrice,
                            ReviewCount: n.ReviewCount,
                            ProductImgs: n.ProductImgs,
                            SkuItemList: n.SkuItemList,
                            Skus: n.Skus,
                            Freight: n.Freight,
                            Coupons: n.Coupons,
                            ShowPrice: n.MaxSalePrice == n.MinSalePrice ? n.MinSalePrice : n.MinSalePrice + "～" + n.MaxSalePrice,
                            skuImg: n.ThumbnailUrl60,
                            skuPrice: n.MinSalePrice,
                            skuStock: n.Stock,
                            selectedSku: c,
                            selectedSkuContent: "",
                            TempMetaDescription: n.MetaDescription,
                            buyAmount: 1
                        });
                    } else "NOUser" == t.data.Message ? wx.navigateTo({
                        url: "/pages/login/login"
                    }) : wx.showModal({
                        title: "提示",
                        content: t.data.Message,
                        showCancel: !1,
                        success: function(t) {
                            t.confirm && wx.navigateBack({
                                delta: 1
                            });
                        }
                    });
                }
            });
        });
    },
    onShareAppMessage: function() {
        var t = this, e = "../countdowndetail/countdowndetail?id=" + t.data.CountDownId;
        return n.globalData.userInfo && n.globalData.userInfo.IsReferral && (e += "&ReferralUserId=" + n.globalData.userInfo.UserId), 
        {
            title: "限时抢购" + t.data.ProductName,
            path: e,
            success: function(t) {
                hishop.showTip("分享成功", "success");
            },
            fail: function(t) {
                hishop.showTip("分享失败", "error");
            }
        };
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    getCoupon: function(t) {
        var e = t.currentTarget.id;
        n.getOpenId(function(t) {
            wx.request({
                url: n.getUrl("UserGetCoupon"),
                data: {
                    openId: t,
                    couponId: e,
                    appid:n.globalData.appId,
                },
                success: function(t) {
                    "OK" == t.data.Status ? wx.showToast({
                        title: t.data.Message,
                        image: "../../images/succes.png"
                    }) : "NOUser" == t.data.Message ? wx.navigateTo({
                        url: "/pages/login/login"
                    }) : wx.showToast({
                        title: t.data.Message,
                        image: "../../images/warning.png"
                    });
                }
            });
        });
    },
    clickCouponList: function(t) {
        var e = this;
        void 0 != e.data.Coupons && null != e.data.Coupons && "" != e.data.Coupons && e.data.Coupons.length > 0 ? this.setData({
            backShow: "",
            couponShow: ""
        }) : wx.showToast({
            title: "暂时没有可以领取的优惠券",
            icon: "loading"
        });
    },
    onCouponHide: function(t) {
        this.setData({
            backShow: "none",
            couponShow: "none"
        });
    },
    clickSku: function(t) {
        this.setData({
            backShow: "",
            SkuShow: ""
        });
    },
    clickback: function(t) {
        this.setData({
            backShow: "none",
            SkuShow: "none",
            couponShow: "none"
        });
    },
    onSkuHide: function(t) {
        this.setData({
            backShow: "none",
            SkuShow: "none"
        });
    },
    changeAmount: function(t) {
        var e = this, a = parseInt(t.detail.value), n = e.data.MaxCount;
        if (n > e.data.skuStock && (n = e.data.skuStock), isNaN(a) || a > n || a <= 0) return e.setData({
            buyAmount: n
        }), void wx.showModal({
            title: "提示",
            content: "请输入正确的数量,不能大于最大抢购数量和商品库存或者小于等于0",
            showCancel: !1
        });
        this.setData({
            buyAmount: a
        });
    },
    reduceAmount: function(t) {
        var e = this.data.buyAmount;
        (e -= 1) <= 0 || this.setData({
            buyAmount: e
        });
    },
    addAmount: function(t) {
        var e = this.data.buyAmount;
        (e += 1) > this.data.MaxCount || this.setData({
            buyAmount: e
        });
    },
    commitBuy: function(t) {
        for (var e = !0, a = 0; a < this.data.selectedskuList.length; a++) if (void 0 == this.data.selectedskuList[a] || "" == this.data.selectedskuList[a] || null == this.data.selectedskuList[a]) {
            e = !1;
            break;
        }
        if (this.data.selectedskuList.length == this.data.SkuItemList.length && e) if (this.data.buyAmount <= 0) wx.showModal({
            title: "提示",
            content: "请输入要购买的数量",
            showCancel: !1
        }); else {
            var n = this.data.buyAmount, o = this.data.selectedSku, i = this.data.CountDownId;
            wx.navigateTo({
                url: "../submitorder/submitorder?productsku=" + o + "&buyamount=" + n + "&frompage=countdown&countdownid=" + i
            });
        } else wx.showModal({
            title: "提示",
            content: "请选择规格",
            showCancel: !1
        });
    },
    onSkuClick: function(t) {
        var e = this, a = t.target.dataset.indexcount, n = t.target.id, o = t.target.dataset.skuvalue, i = new Object();
        i.valueid = n, i.value = o;
        var s = this.data.selectedskuList;
        s[a] = i;
        var u = "", r = this.data.SkuItemList;
        r.length, s.length;
        for (var c = this.data.ProductId, d = 0; d < s.length; d++) {
            var l = s[d];
            void 0 != l && (u += "" == u ? l.value : "," + l.value);
        }
        var h = null;
        e.data.Skus.forEach(function(t, a, n) {
            for (var o = !0, i = 0; i < s.length; i++) void 0 != s[i] && -1 != t.SkuId.indexOf("_" + s[i].valueid) || (o = !1);
            if (o && r.length == s.length) return h = t, c = t.SkuId, void (e.data.buyAmount = t.CartQuantity > 0 ? t.CartQuantity : 1);
        });
        r[a];
        for (var S = 0; S < r[a].AttributeValue.length; S++) r[a].AttributeValue[S].ValueId == n ? r[a].AttributeValue[S].UseAttributeImage = "selected" : r[a].AttributeValue[S].UseAttributeImage = "False";
        this.setData({
            selectedskuList: s,
            selectedSku: c,
            selectedSkuContent: u,
            SkuItemList: r
        }), null != h && (this.setData({
            skuPrice: h.ActivityPrice,
            skuStock: h.ActivityStock
        }), "" != h.ThumbnailUrl40 && null != h.ThumbnailUrl40 && this.setData({
            skuImg: h.ThumbnailUrl40
        }));
    }
});