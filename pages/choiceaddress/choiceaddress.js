var t = require("../../utils/config.js"),
  d = getApp();

Page({
  data: {
    ProductSku: "",
    BuyAmount: 0,
    FromPage: "",
    CountdownId: "",
    ShipAddressId: "",
    AddressList: null,
    AddressCount: 0,
    DelshipId: 0,
    IsCheck: 0,
    jumpUrl: "",
    pointType: false, //是否为积分订单
  },

  onLoad: function(t) {
    if (t.type != 'point') {
      var d = this,
        e = t.productsku,
        s = t.buyamount,
        a = t.frompage,
        o = t.countdownid,
        n = t.shipaddressid,
        i = "../editaddress/editaddress?Source=choiceaddress&productsku=" + e + "&buyamount=" + s + "&frompage=" + a + "&countdownid=" + o;
      d.setData({
          jumpUrl: i,
          ProductSku: e,
          BuyAmount: s,
          FromPage: a,
          CountdownId: o,
          ShipAddressId: n
        }),
        d.initData();
    } else {
      this.setData({
        pointType: true
      })
      this.initData()
    }
  },

  // 获取
  initData: function() {
    var t = this;
    d.getOpenId(function(e) {
      wx.request({
        url: d.getUrl("GetUserShippingAddress"),
        data: {
          openId: e
        },
        success: function(d) {
          var e = d.data.Data;
          "NO" == e.Status && wx.redirectTo({
            url: jumpUrl
          }), t.setData({
            AddressCount: "[]" == e ? 0 : e.length,
            AddressList: e
          });
        }
      });
    });
  },

  // 删除
  bindDeleteAddressTap: function(e) {
    var s = this,
      a = e.currentTarget.dataset.shippingid;
    wx.showModal({
      title: "确定删除该地址吗？",
      success: function(e) {
        e.confirm && d.getOpenId(function(e) {
          var o = {
            openId: e,
            shippingId: a
          };
          s.setData({
            DelshipId: a
          }), wx.showNavigationBarLoading(), t.httpGet(d.getUrl(d.globalData.delShippingAddress), o, s.getAddressResultData);
        });
      }
    });
  },

  getAddressResultData: function(t) {
    var e = this;
    "NOUser" == t.Message ? wx.redirectTo({
      url: "/pages/login/login"
    }) : "OK" == t.Status ? d.getOpenId(function(t) {
      wx.hideNavigationBarLoading();
      var d = e.data.AddressList.filter(function(t, d, s) {
        return t.ShippingId != e.data.DelshipId;
      });
      e.setData({
        AddressList: d
      });
    }) : wx.hideNavigationBarLoading();
  },

  bindEditAddressTap: function(t) {
    console.log(t);
    var d = t.currentTarget.dataset.addressdata,
      e = this;
    0 == this.data.IsCheck && wx.redirectTo({
      url: "../editaddress/editaddress?extra=" + JSON.stringify(d) + "&title=编辑收货地址&Source=choiceaddress&productsku=" + e.data.ProductSku + "&buyamount=" + e.data.BuyAmount + "&frompage=" + e.data.FromPage + "&countdownid=" + e.data.CountdownId
    });
  },
  onReady: function() {},
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {},
  onAddShippingAddress: function(e) {
    var s = this;
    wx.showModal({
      title: "提示",
      content: "是否使用微信收货地址",
      cancelText: "否",
      confirmText: "是",
      success: function(e) {
        e.confirm ? wx.chooseAddress({
          success: function(e) {
            e && d.getOpenId(function(a) {
              var o = {
                openId: a,
                shipTo: e.userName,
                address: e.detailInfo,
                cellphone: e.telNumber,
                city: e.cityName,
                county: e.countyName
              };
              t.httpPost(d.getUrl(d.globalData.AddWXChooseAddress), o, function() {
                s.initData();
              });
            });
          }
        }) : e.cancel && s.gotoAddAddress();
      }
    });
  },
  gotoAddAddress: function() {
    wx.redirectTo({
      url: "../editaddress/editaddress?Source=choiceaddress&productsku=" + this.data.ProductSku + "&buyamount=" + this.data.BuyAmount + "&frompage=" + this.data.FromPage + "&countdownid=" + this.data.CountdownId + "&title=新增收货地址"
    });
  },

  onAddressCheck: function(t) {
    console.log(t);
    var d = t.detail.value;
    if(this.data.pointType){
      wx.navigateTo({
        url: '/pages/pointOrder/pointOrder?id=' + d,
      })
    }else{
      this.data.IsCheck = 1, wx.redirectTo({
        url: "../submitorder/submitorder?productsku=" + this.data.ProductSku + "&buyamount=" + this.data.BuyAmount + "&frompage=" + this.data.FromPage + "&countdownid=" + this.data.CountdownId + "&shipaddressid=" + d
      });
    }
  }
});