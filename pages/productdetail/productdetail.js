var t = require("../../utils/config.js"),
  e = getApp(),
  a = require("../../wxParse/wxParse");

Page({
  data: {
    ProductId: 0,
    ProductName: "",
    MetaDescription: "",
    TempMetaDescription: "",
    ShortDescription: "",
    ShowSaleCounts: "",
    Weight: "",
    MarketPrice: "",
    IsfreeShipping: "",
    MaxSalePrice: "",
    MinSalePrice: "",
    ProductImgs: "",
    SkuItemList: "",
    Skus: "",
    Freight: "",
    Coupons: "",
    Promotes: null,
    ShowPromotesText: "",
    IsUnSale: "",
    IsOnSale: !1,
    ActiveType: "",
    ActiveText: "",
    ShowPrice: "",
    backShow: "none",
    SkuShow: "none",
    couponShow: "none",
    promoteShow: "none",
    skuImg: "",
    skuPrice: 0,
    skuStock: 0,
    selectedSku: "",
    selectedSkuContent: "",
    buyAmount: 1,
    selectedskuList: [],
    isbuy: !0,
    ReviewCount: 0,
    imgurl: e.getRequestUrl + "/templates/master/default/UploadImage/advertimg/20160623171012_4817.jpg",
    sharebtn: e.getRequestUrl + "/Templates/xcxshop/images/share.png",
    SelectSpecifications: "",
    SupplierId: 0,
    SupplierName: "平台",
    DetailStatus: "active",
    AttributeStatus: "",
    ExtendAttribute: [],
    ExtensionId: 0,
    ReferralMoney: 0,
    referralId: ""
  },
  onPullDownRefresh: function() {
    var t = this;
    t.loadData(t);
  },
  onLoad: function(t) {
    t.ReferralUserId && e.setRefferUserId(t.ReferralUserId);
    var a = t.id,
      o = this;
    e.globalData.userInfo && e.globalData.userInfo.IsReferral ? o.data.referralId = !0 : o.data.referralId = !1,
      o.setData({
        ProductId: a,
        referralId: o.data.referralId
      }), o.loadData(o);
  },
  onShareAppMessage: function(a) {
    var o = this,
      i = "/pages/productdetail/productdetail?id=" + o.data.ProductId;
    return e.globalData.userInfo && e.globalData.userInfo.IsReferral && (i += "&ReferralUserId=" + e.globalData.userInfo.UserId), {
      title: o.data.ProductName,
      path: i,
      success: function(e) {
        t.showTip("分享成功", "success");
      },
      fail: function(e) {
        t.showTip("分享失败", "error");
      }
    };
  },
  onReachBottom: function() {
    var t = this;
    if (null == this.data.metaDescription || "" == this.data.metaDescription) {
      var e = this.data.TempMetaDescription;
      null != e && void 0 != e && a.wxParse("metaDescription", "html", e, t);
    }
  },
  onTabClick: function(t) {
    0 == t.currentTarget.dataset.status ? this.setData({
      DetailStatus: "active",
      AttributeStatus: ""
    }) : this.setData({
      DetailStatus: "",
      AttributeStatus: "active"
    });
  },
  loadData: function(t) {
    wx.showNavigationBarLoading(), e.getOpenId(function(a) {
      wx.request({
        url: e.getUrl("GetProductDetail"),
        data: {
          openId: a,
          productId: t.data.ProductId
        },
        success: function(e) {
          if ("OK" == e.data.Status) {
            var a = e.data.Data;
            if (1 == a.ActiveType) return void wx.redirectTo({
              url: "../countdowndetail/countdowndetail?id=" + a.ActiveId
            });
            var o = "";
            0 == a.SkuItemList.length && (o = a.Skus[0].SkuId);
            var i = "";
            if (a.Promotes && a.Promotes.ActivityCount && a.Promotes.ActivityCount > 0)
              for (var s in a.Promotes) {
                var n = a.Promotes[s];
                if (n instanceof Array)
                  for (var u in n) {
                    var r = n[u];
                    r && r.ActivityName && r.ActivityName.length > 0 && (i.length > 0 && (i += ","),
                      i += r.ActivityName);
                  }
              }
            a.SkuItemList.forEach(function(t, e) {
              t.AttributeValue.forEach(function(t, e) {
                t.Enable = 1;
              });
            }), t.setData({
              ProductId: a.ProductId,
              ProductName: a.ProductName,
              ShortDescription: a.ShortDescription,
              ShowSaleCounts: a.ShowSaleCounts,
              Weight: a.Weight ? a.Weight:'',
              MarketPrice: a.MarketPrice,
              IsfreeShipping: a.IsfreeShipping,
              MaxSalePrice: a.MaxSalePrice,
              MinSalePrice: a.MinSalePrice,
              ProductImgs: a.ProductImgs,
              SkuItemList: a.SkuItemList,
              Skus: a.Skus,
              Freight: a.Freight,
              Coupons: a.Coupons,
              Promotes: a.Promotes,
              ShowPromotesText: i,
              IsUnSale: a.IsUnSale,
              IsOnSale: a.IsOnSale,
              ActiveType: a.ActiveType,
              ActiveText: a.ActiveType > 0 ? "暂时无法购买" : "立即购买",
              ShowPrice: a.MaxSalePrice == a.MinSalePrice ? a.MinSalePrice : a.MinSalePrice + "～" + a.MaxSalePrice,
              skuImg: a.ThumbnailUrl60,
              skuPrice: a.MinSalePrice,
              skuStock: a.Stock,
              selectedSku: o,
              selectedSkuContent: "",
              ReviewCount: a.ReviewCount,
              buyAmount: 1,
              TempMetaDescription: a.MetaDescription,
              SelectSpecifications: "选择规格",
              SupplierId: a.SupplierId,
              SupplierName: a.SupplierName,
              ExtendAttribute: a.ExtendAttribute,
              ReferralMoney: a.ReferralMoney
            });
          } else "NOUser" == e.data.Message ? wx.navigateTo({
            url: "/pages/login/login"
          }) : wx.showModal({
            title: "提示",
            content: e.data.Message,
            showCancel: !1,
            success: function(t) {
              t.confirm && wx.navigateBack({
                delta: 1
              });
            }
          });
        },
        complete: function() {
          wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
        }
      });
    });
  },
  onReady: function() {},
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {},
  getCoupon: function(t) {
    var a = t.currentTarget.id;
    e.getOpenId(function(t) {
      wx.request({
        url: e.getUrl("UserGetCoupon"),
        data: {
          openId: t,
          couponId: a,
          appid:e.globalData.appId,
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
  clickPromoteList: function(t) {
    var e = this.data.Promotes;
    e && e.ActivityCount && e.ActivityCount > 0 ? this.setData({
      backShow: "",
      promoteShow: ""
    }) : wx.showToast({
      title: "暂时没有进行中的满额优惠活动",
      icon: "loading"
    });
  },
  clickSku: function(t) {
    this.setData({
      backShow: "",
      SkuShow: "",
      isbuy: !0
    });
  },
  addShopCart: function(t) {
    this.setData({
      backShow: "",
      SkuShow: "",
      isbuy: !1
    });
  },
  clickback: function(t) {
    this.setData({
      backShow: "none",
      SkuShow: "none",
      couponShow: "none",
      promoteShow: "none"
    });
  },
  onCouponHide: function(t) {
    this.setData({
      backShow: "none",
      couponShow: "none"
    });
  },
  onPromoteHide: function(t) {
    this.setData({
      backShow: "none",
      promoteShow: "none"
    });
  },
  onSkuHide: function(t) {
    this.setData({
      backShow: "none",
      SkuShow: "none"
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
    (e += 1) > this.data.skuStock || this.setData({
      buyAmount: e
    });
  },
  changeAmount: function(t) {
    var e = parseInt(t.detail.value),
      a = this.data.skuStock;
    isNaN(e) || e > a || e <= 0 ? wx.showModal({
      title: "提示",
      content: "请输入正确的数量,不能大于库存或者小于等于0",
      showCancel: !1
    }) : this.setData({
      buyAmount: e
    });
  },
  commitBuy: function(t) {
    if (!(this.data.ActiveType > 0)) {
      for (var e = !0, a = 0; a < this.data.selectedskuList.length; a++)
        if (void 0 == this.data.selectedskuList[a] || "" == this.data.selectedskuList[a] || null == this.data.selectedskuList[a]) {
          e = !1;
          break;
        }
      if (this.data.selectedskuList.length == this.data.SkuItemList.length && e)
        if (this.data.buyAmount <= 0) wx.showModal({
          title: "提示",
          content: "请输入要购买的数量",
          showCancel: !1
        });
        else {
          var o = this.data.buyAmount,
            i = this.data.selectedSku;
          wx.navigateTo({
            url: "../submitorder/submitorder?productsku=" + i + "&buyamount=" + o + "&frompage=signbuy"
          });
        }
      else wx.showModal({
        title: "提示",
        content: "请选择规格",
        showCancel: !1
      });
    }
  },
  addSku: function(t) {
    if (!(this.data.ActiveType > 0)) {
      for (var a = this, o = !0, i = 0; i < this.data.selectedskuList.length; i++)
        if (void 0 == this.data.selectedskuList[i] || "" == this.data.selectedskuList[i] || null == this.data.selectedskuList[i]) {
          o = !1;
          break;
        }
      if (this.data.selectedskuList.length == this.data.SkuItemList.length && o)
        if (this.data.buyAmount <= 0) wx.showModal({
          title: "提示",
          content: "请输入要购买的数量",
          showCancel: !1
        });
        else {
          var s = this.data.buyAmount,
            n = this.data.selectedSku;
          e.getOpenId(function(t) {
            wx.request({
              url: e.getUrl("addToCart"),
              data: {
                openId: t,
                SkuID: n,
                Quantity: s,
                roomId:e.globalData.roomId
              },
              success: function(t) {
                "OK" == t.data.Status ? wx.showModal({
                  title: "提示",
                  content: "加入购物车成功",
                  showCancel: !1,
                  success: function(t) {
                    t.confirm && a.setData({
                      backShow: "none",
                      SkuShow: "none"
                    });
                  }
                }) : "NOUser" == t.data.Message ? wx.navigateTo({
                  url: "/pages/login/login"
                }) : wx.showModal({
                  title: "提示",
                  content: t.data.ErrorResponse.ErrorMsg,
                  showCancel: !1,
                  success: function(t) {}
                });
              },
              complete: function() {}
            });
          });
        }
      else wx.showModal({
        title: "提示",
        content: "请选择规格",
        showCancel: !1
      });
    }
  },
  onSkuClick: function(t) {
    var e = this,
      a = t.target.dataset.indexcount,
      o = t.target.id,
      i = t.target.dataset.skuvalue,
      s = t.target.dataset.attributeid;
    if (0 != t.target.dataset.enablevalue) {
      var n = new Object();
      n.valueid = o, n.value = i, n.attributeid = s;
      var u = this.data.selectedskuList;
      u[a] = n;
      var r = "",
        c = this.data.SkuItemList;
      c.length == u.length && !0;
      for (var l = this.data.ProductId, d = 0; d < u.length; d++) {
        var h = u[d];
        void 0 != h && (r += "" == r ? h.value : "," + h.value);
      }
      var S = null;
      console.log(c.length + "-" + u.length), e.data.Skus.forEach(function(t, e, a) {
        for (var o = !0, i = 0; i < u.length; i++) void 0 != u[i] && -1 != t.SkuId.indexOf("_" + u[i].valueid) || (o = !1);
        if (o && c.length == u.length) return S = t, void(l = t.SkuId);
      });
      c[a];
      for (var f = 0; f < c[a].AttributeValue.length; f++) c[a].AttributeValue[f].ValueId == o ? c[a].AttributeValue[f].UseAttributeImage = "selected" : c[a].AttributeValue[f].UseAttributeImage = "False";
      var g = "选择规格";
      "" != r && (g = "已选：" + r);
      var p = e.data.Skus;
      this.data.SkuItemList.forEach(function(t, e) {
        if (t.AttributeId != s) {
          for (var a = [], o = 0; o < u.length; o++) void 0 != u[o] && t.AttributeId != u[o].attributeid && a.push(u[o]);
          t.AttributeValue.forEach(function(t, e) {
            for (var o = 0, i = 0; i < p.length; i++) {
              for (var s = a.length, n = 0, u = p[i].SkuId, r = 0; r < a.length; r++) u.indexOf("_" + a[r].valueid) >= 0 && n++;
              u.indexOf("_" + t.ValueId) >= 0 && s == n && (o = 1);
            }
            t.Enable = o;
          });
        }
      }), this.setData({
        selectedskuList: u,
        selectedSku: l,
        selectedSkuContent: r,
        SkuItemList: c,
        SelectSpecifications: g
      }), null != S && (this.setData({
        skuPrice: S.SalePrice,
        skuStock: S.Stock
      }), "" != S.ThumbnailUrl40 && null != S.ThumbnailUrl40 && this.setData({
        skuImg: S.ThumbnailUrl40
      }));
    }
  }
});