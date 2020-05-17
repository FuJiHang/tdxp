var t, e = require("../../utils/config.js"),
  a = require("../../utils/qqmap-wx-jssdk.min.js"),
  i = null,
  s = new Array(),
  d = new Array(),
  n = new Array(),
  r = new Array(),
  o = 0,
  l = 0,
  u = 0,
  h = 0,
  g = getApp(),
  c = [],
  p = [],
  v = [];

Page({
  data: {
    fujihangK:false,
    fujihang:false,//店长申请用到 by fujihang
    regionfuJihang:'',
    currentPage: "page1",
    navigateTitle: "",
    addressData: {},
    shipTo: "",
    cellPhone: "",
    fullAddress: "",
    address: "",
    regionId: "",
    provinceName: [],
    provinceCode: [],
    provinceSelIndex: "",
    cityName: [],
    cityCode: [],
    citySelIndex: "",
    districtName: [],
    districtCode: [],
    districtSelIndex: "",
    streetName: [],
    streetCode: [],
    streetSelIndex: "",
    showMessage: !1,
    messageContent: "",
    showDistpicker: !1,
    Source: "",
    ShipAddressId: "",
    FullRegionName: "请填写所在地区",
    isCss: !0,
    isHidePage1: !1
  },
 
  onLoad: function(i) {
    if(i.fujihang){
      this.setData({
        fujihang:true,
        fujihangK:true,
        regionfuJihang:i.region
      })
      this.bindDetailAddressTap()
      setTimeout(()=>{
        this.setData({
          fujihangK:false,
        })
      },500)
    }
    
    console.log(i)
    this.setAreaData(), t = new a({
      key: g.globalData.QQMapKey
    });
    var s = i.title;
    this.data.navigateTitle = s, wx.setNavigationBarTitle({
      title: this.data.navigateTitle
    });
    var d = 0;
    if ("编辑收货地址" == s) {
      var n = this;
      if (void 0 == (d = i.shippingid)) {
        var r = JSON.parse(i.extra);
        d = r.ShippingId;
      }
      g.getOpenId(function(t) {
        var a = {
          openId: t,
          shippingId: d
        };
        n.setData({
          Source: i.Source
        }), wx.showNavigationBarLoading(), e.httpGet(g.getUrl(g.globalData.GetShippingAddressById), a, n.GetShippingAddressByIdData);
      });
    } else this.setData({
      Source: i.Source,
      cellphone: i.CellPhone,
      shipTo: i.ShipTo,
      isDefault: !1,
      BuildingNumber: i.BuildingNumber
    });

    
  },
  GetShippingAddressByIdData: function(t) {
    var e = this;
    if (t.error_response) wx.showToast({
      title: t.error_response.sub_msg
    });
    else {
      var a = t.Data.ShippingAddressInfo,
        i = "",
        s = "";
      a.LatLng && (i = a.LatLng.split(",")[0], s = a.LatLng.split(",")[1]), t.Status ? (e.setData({
        ShipTo: a.ShipTo,
        CellPhone: a.CellPhone,
        FullAddress: a.FullAddress,
        FullRegionPath: a.FullRegionPath,
        Address: a.Address,
        BuildingNumber: a.BuildingNumber,
        lat: i,
        lng: s,
        regionId: a.RegionId,
        ShippingId: a.ShippingId,
        isDefault: a.IsDefault
      }), wx.hideNavigationBarLoading()) : wx.hideNavigationBarLoading();
    }
  },
  bindShipToTap: function(t) {
    var e = t.detail.value;
    this.data.ShipTo = e;
  },
  bindCellPhoneTap: function(t) {
    var e = t.detail.value;
    this.data.CellPhone = e;
  },
  // 获取省市区方法
  bindFullAddressTap: function(t) {
    o = 0, l = 0, u = 0, this.setAreaData(), this.setData({
      showDistpicker: !0
    });
  },
  bindAddressTap: function(t) {
    var e = t.detail.value;
    this.data.Address = e;
  },
  bindNumberTap: function(t) {
    var e = t.detail.value;
    this.data.BuildingNumber = e;
  },
  bindSaveTapTap: function(t) {
    var a = this;
    a.data.ShipTo ? a.data.CellPhone ? a.data.FullRegionPath ? a.data.Address ? g.getOpenId(function(t) {
      if (wx.showNavigationBarLoading(), "新增收货地址" == a.data.navigateTitle) {
        i = {
          openId: t,
          isDefault: a.data.isDefault,
          shipTo: a.data.ShipTo,
          address: a.data.Address,
          cellphone: a.data.CellPhone,
          regionId: a.data.regionId,
          BuildingNumber: a.data.BuildingNumber ? a.data.BuildingNumber : "",
          latlng: a.data.lat + "," + a.data.lng
        };
        e.httpPost(g.getUrl(g.globalData.addShippingAddress), i, a.getEditAddressData);
      } else {
        var i = {
          openId: t,
          shippingId: a.data.ShippingId,
          isDefault: a.data.isDefault,
          shipTo: a.data.ShipTo,
          address: a.data.Address,
          cellphone: a.data.CellPhone,
          regionId: a.data.regionId,
          BuildingNumber: a.data.BuildingNumber ? a.data.BuildingNumber : "",
          latlng: a.data.lat + "," + a.data.lng
        };
        e.httpPost(g.getUrl(g.globalData.updateShippingAddress), i, a.getEditAddressData);
      }
    }) : wx.showToast({
      title: "请输入详细地址",
      icon: "fail",
      duration: 2e3
    }) : wx.showToast({
      title: "请输入所在地区",
      icon: "fail",
      duration: 2e3
    }) : wx.showToast({
      title: "请输入联系电话",
      icon: "fail",
      duration: 2e3
    }) : wx.showToast({
      title: "请输入收货人",
      icon: "fail",
      duration: 2e3
    });
  },
  getEditAddressData: function(t) {
    if (wx.hideNavigationBarLoading(), "NOUser" == t.Message) wx.navigateTo({
      url: "/pages/login/login"
    });
    else if ("OK" == t.Status) {
      var e = getCurrentPages(),
        a = e[e.length - 2],
        i = this.data.Source,
        s = "";
      void 0 == i || "" == i ? (s = "../address/address", a.initData(), wx.navigateBack()) : "chooseaddr" == i ? (a.refreshData(),
          wx.navigateBack()) : (i = "choiceaddress") ? s = "../choiceaddress/choiceaddress?productsku=" + this.data.ProductSku + "&buyamount=" + this.data.BuyAmount + "&frompage=" + this.data.FromPage + "&countdownid=" + this.data.CountdownId : (i = "submmitorder") && (s = "../submitorder/submitorder?productsku=" + this.data.ProductSku + "&buyamount=" + this.data.BuyAmount + "&frompage=" + this.data.FromPage + "&countdownid=" + this.data.CountdownId + "&shipaddressid=" + t.Message),
        void 0 != s && "" != s && wx.redirectTo({
          url: s
        });
    } else wx.showToast({
      title: t.Message,
      icon: "loading",
      duration: 1e4
    }), setTimeout(function() {
      wx.hideToast();
    }, 2e3);
  },
  changeArea: function(t) {
    var e = this;
    o = t.detail.value[0], l = t.detail.value[1], u = t.detail.value.length > 2 ? t.detail.value[2] : 0,
      h = t.detail.value.length > 3 ? t.detail.value[3] : 0, console.log("省:" + o + "市:" + l + "区:" + u),
      e.setAreaData(o, l, u, h);
  },
  showDistpicker: function() {
    this.setData({
      showDistpicker: !0
    });
  },
  distpickerCancel: function() {
    this.setData({
      showDistpicker: !1
    });
  },
  distpickerSure: function() {
    var t, e, a = this.data.provinceName[o] + " " + this.data.cityName[l] + " " + this.data.districtName[u];
    this.data.streetCode.length > 0 && 0 != this.data.streetCode[h] ? (t = this.data.streetCode[h],
      e = this.data.districtName[u]) : this.data.districtCode.length > 0 ? (t = this.data.districtCode[u],
      e = this.data.districtName[u]) : this.data.cityCode.length > 0 ? (t = this.data.cityCode[l],
      e = this.data.cityName[l]) : e = this.data.provinceName[o];
    var i = this.data.isCss;
    "请填写所在地区" == this.data.FullRegionName && (i = !1), this.setData({
      fullAddress: a,
      FullRegionName: a,
      FullRegionPath: a,
      regionId: t,
      selCityName: e,
      isCss: i,
      detailAddress: "",
      building: ""
    }), this.distpickerCancel();
  },
  ArrayContains: function(t, e) {
    for (var a = t.length; a--;)
      if (t[a] === e) return !0;
    return !1;
  },
  getRegions: function(t, e, a, i) {
    var d = this,
      r = !0;
    3 == e ? d.ArrayContains(s, t) || (r = !1) : 4 == r && (d.ArrayContains(n, t) || (r = !1)),
      wx.request({
        url: g.getUrl("GetRegions"),
        async: !1,
        data: {
          parentId: t
        },
        success: function(e) {
          console.log(e), "OK" == e.data.Status && (3 == e.data.Depth ? d.setAreaDataShow(e.data.Regions, t, a, i) : 4 == e.Depth && d.setStreetData(e.data.Regions, t, a, i));
        }
      });
  },
  setProvinceCityData: function(t, e, a, s, d) {
    var n = this;
    null != t && (i = t);
    var r = i,
      o = [],
      l = [];
    for (var h in r) {
      var g = r[h].name,
        c = r[h].id;
      o.push(g), l.push(c), v.length > 0 && c == v[0] && (e = h);
    }
    n.setData({
      provinceName: o,
      provinceCode: l
    });
    var p = i[e].city,
      f = [],
      D = [];
    for (var h in p) {
      var g = p[h].name,
        c = p[h].id;
      f.push(g), D.push(c), v.length > 1 && c == v[1] && (a = h);
    }
    n.setData({
      cityName: f,
      cityCode: D
    });
    var m = p.length > a ? p[a].area : p[0].area,
      w = [],
      A = [];
    if (null != m && m.length > 0) {
      for (var h in m) {
        var g = m[h].name,
          c = m[h].id;
        w.push(g), A.push(c), v.length > 2 && c == v[2] && (u = h);
      }
      n.setData({
        districtName: w,
        districtCode: A
      });
      var C = m.length > u ? m[u].country : m[0].country,
        N = [],
        S = [];
      if (null != C && C.length > 0) {
        N.push("其它"), S.push(0);
        for (var h in C) {
          var g = C[h].name,
            c = C[h].id;
          N.push(g), S.push(c), v.length > 3 && c == v[3] && (d = h);
        }
        n.setData({
          streetName: N,
          streetCode: S
        });
      } else n.setData({
        streetName: [],
        streetCode: []
      });
    } else n.setData({
      districtName: [],
      districtCode: [],
      streetName: [],
      streetCode: []
    });
    var I = [];
    I.push(e), I.push(a), I.push(u), I.push(d), n.setData({
      value: I
    }), v = [];
  },
  getItemIndex: function(t, e) {
    for (var a = t.length; a--;)
      if (t[a] === e) return a;
    return -1;
  },
  setAreaDataShow: function(t, e, a, i) {
    var r = this;
    if (null != t) c = t, s.push(e), d.push(t);
    else {
      var o = r.getItemIndex(s, e);
      c = o >= 0 ? d[o] : [];
    }
    var u = [],
      h = [];
    if (c && c.length > 0) {
      for (var g in c) {
        var p = g.id,
          v = g.name;
        u.push(p), h.push(v);
      }
      r.setData({
        districtName: u,
        districtCode: h
      });
    } else r.setData({
      districtName: [],
      districtCode: []
    });
    this.ArrayContains(n, a) ? r.setStreetData(null, l, a, i) : r.getRegions(l, 4, a, i);
  },
  setStreetData: function(t, e, a, i) {
    var s = this;
    if (null != t) n.push(regionId), r.push(t), p = t;
    else {
      var d = s.getItemIndex(n, e);
      p = d >= 0 ? r[d] : [];
    }
  },
  setAreaData: function(t, e, a, s) {
    var d = this,
      t = t || 0,
      e = e || 0,
      s = (a = a || 0) || 0;
    void 0 == i || null == i ? wx.request({
      url: g.getUrl("GetRegionsOfProvinceCity"),
      async: !1,
      success: function(i) {
        "OK" == i.data.Status && d.setProvinceCityData(i.data.province, t, e, a, s);
      },
      error: function(t) {}
    }) : d.setProvinceCityData(null, t, e, a, s);
  },
  getaddress() {
    wx.request({
      url: getApp().gethsyurl,
      data: {
        action: 'GetRegionsOfProvinceCity'
      },
      success(res) {
        console.log(res.data)
      }
    })
  },
  bindDetailAddressTap: function() {
    var t = this;
    t.setData({
      currentPage: "page2"
    }), setTimeout(function() {
      t.setData({
        showPage2: !0,
        isHidePage1: !0
      });
    }, 500);
  },
  bindHidePage2: function() {
    var t = this;
    setTimeout(function() {
      t.data.isDelete || t.setData({
        currentPage: "page1",
        isDelete: !1,
        isHidePage1: !1
      });
    }, 100);
  },
  searchKeyword: function(e) {

    var a = this,
      i = e.detail.value;
    a.setData({
      detailAddress: i,
      isDelete: !1
    }), "" != i && setTimeout(function() {
      t.getSuggestion({
        keyword: (a.data.fujihang?a.data.regionfuJihang:a.data.selCityName)+i,

        region:'',//传区
        // region_fix: 1,
        success: function(t) {
          a.setData({
            searchList: t.data
          });
        }
      }, 500);
    });
  },
  setAddr: function(t) {
    console.log(t)
    if(this.data.fujihang){
      let addressF={
        lat:t.currentTarget.dataset.lat,
        lng:t.currentTarget.dataset.lng,     
        name:t.currentTarget.dataset.name,      
      }
      wx.setStorage({
        key:'storeFujihang',
        data:JSON.stringify(addressF)
      })
      wx.navigateBack({
        delta: 1,
      })

      return;
    }
    var a = t.currentTarget.dataset.fromlatlng,
      i = t.currentTarget.dataset.name,
      s = this;
    s.setData({
      lat: t.currentTarget.dataset.lat,
      lng: t.currentTarget.dataset.lng
    }), g.getOpenId(function(t) {
      var d = {
        openId: t,
        fromLatLng: a
      };
      e.httpGet(g.getUrl(g.globalData.GetRegionByLatLng), d, function(t) {
        t = t, s.setData({
          isDelete: !1,
          Address: i
        }), t.FullRegionName.length > 0 && s.setData({
          FullRegionPath: t.FullRegionName,
          regionId: t.RegionId
        }), s.bindHidePage2();
      });
    });
  },
  delDetailAddr: function() {
    this.setData({
      Address: "",
      isDelete: !0
    });
  }
});