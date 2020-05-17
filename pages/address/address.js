var t = require("../../utils/config.js"),
  a = getApp();

Page({
  data: {
    addressData: []
  },
  onLoad: function(t) {
    this.initData();
  },

  initData: function() {
    var e = this;
    a.getOpenId(function(i)   {
      var s = {
        openId: i
      };
      wx.showNavigationBarLoading()
      // GET请求,获取所有收货地址
      t.httpGet(a.getUrl(a.globalData.getUserShippingAddress), s, e.getUserShippingAddressData);
    });
  },

  // 获取所有收货地址
  getUserShippingAddressData: function(t) {
    console.log('获取收货地址', t)
    var a = this;
    //未登录前往登录
    "NOUser" == t.Message ? wx.navigateTo({
      url: "/pages/login/login"
    }) : "OK" == t.Status ? (a.setData({
      addressData: t.Data
    }), wx.hideNavigationBarLoading()) : "NO" == t.Status ? (a.setData({
      addressData: []
    }), wx.hideNavigationBarLoading()) : wx.hideNavigationBarLoading();
  },

  getAddressResultData: function(e) {
    var i = this;
    "NOUser" == e.Message ? wx.navigateTo({
      url: "/pages/login/login"
    }) : "OK" == e.Status ? a.getOpenId(function(e) {
      var s = {
        openId: e
      };
      wx.hideNavigationBarLoading()
      // GET请求,获取所有收货地址
      t.httpGet(a.getUrl(a.globalData.getUserShippingAddress), s, i.getUserShippingAddressData);
    }) : wx.hideNavigationBarLoading();
  },

  // 设置默认
  bindRadioAddressChange: function(e) {
    var i = this,
      s = e.currentTarget.dataset.shippingid;
    a.getOpenId(function(e) {
      var d = {
        openId: e,
        shippingId: s
      };
      wx.showNavigationBarLoading(), t.httpGet(a.getUrl(a.globalData.setDefaultShippingAddress), d, i.getAddressResultData);
    });
  },

  // 删除地址
  bindDeleteAddressTap: function(e) {
    var _this = this,
      s = e.currentTarget.dataset.shippingid;
    wx.showModal({
      title: "确定删除该地址吗？",
      success: function(e) {
        e.confirm && a.getOpenId(function(e) {
          var d = {
            openId: e,
            shippingId: s
          };
          wx.showNavigationBarLoading()
          t.httpGet(a.getUrl(a.globalData.delShippingAddress), d, _this.getAddressResultData);
        });
      }
    });
  },

  // 编辑现有收货地址
  bindEditAddressTap: function(t) {
    var a = t.currentTarget.dataset.shippingid,
      e = t.currentTarget.dataset.regionid;
    wx.navigateTo({
      url: "../editaddress/editaddress?extra=&RegionId=" + e + "&shippingid=" + a + "&title=编辑收货地址"
    });
  },

  // 手动添加收货地址
  gotoAddAddress: function() {
    wx.navigateTo({
      url: "../editaddress/editaddress?title=新增收货地址"
    });
  },

  // 添加收货地址
  bindAddAddressTap: function(e) {
    var i = this;
    wx.showModal({
      title: "提示",
      content: "是否使用微信收货地址",
      cancelText: "否",
      confirmText: "是",
      success: function(res) {
        res.confirm ? wx.chooseAddress({
          success: function(e) {
            console.log('confirmsuccess', e)
            e && a.getOpenId(function(s) {
              var d = {
                openId: s,
                shipTo: e.userName,
                address: e.detailInfo,
                cellphone: e.telNumber,
                city: e.cityName,
                county: e.countyName
              };
              // t = require("../../utils/config.js"),
              t.httpPost(a.getUrl(a.globalData.AddWXChooseAddress), d, function() {
                i.initData();
              });
            });
          },
          fail: function(e) {
            e.errMsg === 'chooseAddress:fail auth deny' ? wx.getSetting({
              success(res) {
                !res.authSetting['scope.address'] ? wx.authorize({
                  scope: 'scope.address',
                  success() {
                    console.log('用户已经同意小程序获取地址')
                  },
                  fail() {
                    // 用户拒绝后回调
                    wx.showModal({
                      content: '使用通讯地址需要开启授权',
                      success(res) {
                        res.confirm ? wx.openSetting({
                          success(res) {}
                        }) : res.cancel ? console.log('用户点击取消') : ''
                      }
                    })
                  }
                }) : ''
              }
            }) : ''
          }
        }) : res.cancel && i.gotoAddAddress();
      }
    });
  }
});