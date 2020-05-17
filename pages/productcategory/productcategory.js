function t(t, a, e) {
  return a in t ? Object.defineProperty(t, a, {
    value: e,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : t[a] = e, t;
}

var a, e = getApp();

Page((a = {
    data: {
      Css: {
        LHeight: 0,
        FirstIndex: 0,
        SecondIndex: 0,
        SortIndex: 1
      },
      CategoryList: [],
      CurrentCategory: null,
      ProductList: null,
      CurrentProduct: null,
      CurrentSku: null,
      Cid: 0,
      SortBy: "",
      SortOrder: "asc",
      KeyWord: "",
      PageIndex: 1,
      PageSize: 10,
      Num: 0,
      SortClass: "",
      isShow: !0,
      isShowSkuSelectBox: !1,
      selectedskuList: [],
      buyAmount: 1,
      selectedSku: "",
      SkuItemList: null,
      MarginTop: 0,
      TempMarginTop: 0,
      StartScrollTop: 0,
      IsDown: !0,
      IsPagePost: !1
    },
    onLoad: function(t) {
      t.ReferralUserId && e.setRefferUserId(t.ReferralUserId);
      var a = t.cid;
      parseInt(a) > 0 && this.setData({
        Cid: a,
        IsPagePost: !0
      }), this.loadCategory(this);
    },
    SwitchSubCategory: function() {
      this.setData({
        IsDown: !0
      });
    },
    //获取购物车
    GetShopCart: function() {
      var t = 0,
        a = this,
        n = a.data.ProductList;
      e.getOpenId(function(u) {
        wx.request({
          url: e.gethsyurl,
          data: {
            action: "getShoppingCartList",
            openId: u
          },
          success: function(a) {
            if ("OK" == a.data.Status) {
              var e = {};
              a.data.Data.CartItemInfo.forEach(function(a, n, u) {
                a.IsValid && (void 0 != e[a.ProductId] ? e[a.ProductId] = parseInt(e[a.ProductId]) + parseInt(a.Quantity) : e[a.ProductId] = a.Quantity,
                  t += parseInt(a.Quantity));
              }), null != n && n.forEach(function(t, a, n) {
                void 0 != e[t.ProductId] ? t.CartQuantity = parseInt(e[t.ProductId]) : t.CartQuantity = 0;
              });
            } else "NOUser" == a.data.Message || wx.showModal({
              title: "提示",
              content: a.data.Message,
              showCancel: !1,
              success: function(t) {
                t.confirm && wx.navigateBack({
                  delta: 1
                });
              }
            });
          },
          complete: function() {
            null != n && a.setData({
              ProductList: n,
              TotalNum: t
            }), wx.hideLoading();
          }
        });
      });
    },
    //获取商品分类
    loadCategory: function(t) {
      e.getOpenId(function(a) {
        wx.request({
          url: e.gethsyurl,
          data: {
            action: 'GetAllCategories'
          },
          success: function(a) {
            if ("OK" == a.data.Status) {
              var e = a.data.Data;
              t.setData({
                CategoryList: e,
                CurrentCategory: e[0],
                Cid: e[0].cid
              }), t.loadData(t, !1);
            } else "NOUser" == a.data.Message || wx.showModal({
              title: "提示",
              content: a.data.Message,
              showCancel: !1,
              success: function(t) {
                t.confirm && wx.navigateBack({
                  delta: 1
                });
              }
            });
          },
          complete: function() {
            t.SetSubCategoryHeight();
          }
        });
      });
    },
    EndTouch: function(t) {
      var a = this,
        e = parseInt(t.changedTouches[0].clientY),
        n = parseInt(a.data.StartScrollTop);
      if (e != n) {
        var u = a.data.TempMarginTop;
        e - n > 0 ? a.setData({
          IsDown: !0,
          MarginTop: u
        }) : a.setData({
          IsDown: !1,
          MarginTop: 0
        });
      }
    },
    StartTouch: function(t) {
      var a = this,
        e = t.changedTouches[0].clientY;
      a.setData({
        StartScrollTop: e
      });
    },
    //加入购物车
    addToCart: function(t, a, n) {
      var u = this;
      !a || a.lenght < 1 ? wx.showModal({
        title: "提示",
        content: "请选择规格",
        showCancel: !1
      }) : e.getOpenId(function(r) {
        wx.request({
          url: e.gethsyurl,
          data: {
            action: "addToCart",
            openId: r,
            SkuID: a,
            Quantity: n,
            roomId:e.globalData.roomId
          },
          success: function(e) {
            "OK" == e.data.Status ? (u.setProductCartQuantity(t, n, "+"), u.setSkuCartQuantity(a, n, "+")) : "NOUser" == e.data.Message ? wx.navigateTo({
              url: "/pages/login/login"
            }) : wx.showModal({
              title: "提示",
              content: e.data.ErrorResponse.ErrorMsg,
              showCancel: !1,
              success: function(t) {}
            });
          },
          complete: function() {
            var t = parseInt(u.data.TotalNum);
            u.setData({
              TotalNum: t + parseInt(n)
            });
          }
        });
      });
    },
    setSkuCartQuantity: function(t, a, e) {
      var n = this,
        u = !1,
        r = n.data.CurrentProduct;
      if (r && r.Skus) {
        var s = r.Skus.find(function(a) {
            return a.SkuId == t;
          }),
          o = n.data.CurrentSku;
        if (s) {
          switch (a = parseInt(a), e) {
            case "=":
              s.CartQuantity = a;
              break;

            case "+":
              s.CartQuantity += a;
          }
          s.CartQuantity < 0 && (s.CartQuantity = 0), o && o.SkuId == s.SkuId && (o.CartQuantity = s.CartQuantity),
            u = !0;
        }
      }
      if (u) {
        var i = {
          CurrentProduct: r,
          CurrentSku: o
        };
        n.setData(i);
      }
    },
    setProductCartQuantity: function(t, a, e) {
      var n = this,
        u = !1,
        r = n.data.ProductList,
        s = r.find(function(a) {
          return a.ProductId == t;
        });
      if (s) {
        switch (a = parseInt(a), e) {
          case "=":
            s.CartQuantity = a;
            break;

          case "+":
            s.CartQuantity += a;
        }
        s.CartQuantity < 0 && (s.CartQuantity = 0), u = !0;
      }
      if (u) {
        var o = {
          ProductList: r
        };
        n.setData(o);
      }
    },
    hideSkuDOM: function() {
      this.setData({
        isShowSkuSelectBox: !1
      });
    },
    catchAddCart: function(t) {
      var a = this,
        n = t.currentTarget,
        u = n.dataset.productid,
        r = n.dataset.operator,
        s = parseInt(r + "1"),
        o = n.dataset.opensku,
        i = a.findProductById(u);
      if (!i.HasSKU || i.HasSKU && "false" == o) {
        var d = n.dataset.sku;
        a.addToCart(u, d, s);
      } else wx.showLoading({
        title: "商品信息加载中..."
      }), e.getOpenId(function(t) {
        wx.request({
          url: e.gethsyurl,
          data: {
            action: 'GetProductSkus',
            ProductId: u,
            openId: t
          },
          success: function(t) {
            if (wx.hideLoading(), "OK" == t.data.Status) {
              var e = t.data.Data,
                n = e.DefaultSku,
                u = [];
              null != e && e.SkuItems.forEach(function(t, a, e) {
                t.AttributeValue.reverse(), t.AttributeValue[0].UseAttributeImage = "selected";
                var n = new Object();
                n.ValueId = t.AttributeValue[0].ValueId, n.Value = t.AttributeValue[0].Value, n.attributeid = t.AttributeId,
                  u.push(n);
              }), a.setData({
                CurrentProduct: e,
                CurrentSku: n,
                selectedskuList: u,
                selectedSku: n.SkuId
              }), a.showSkuDOM();
            }
          },
          complete: function() {}
        });
      });
    },
    findProductById: function(t) {
      return this.data.ProductList.find(function(a) {
        return a.ProductId == t;
      });
    }
  }, t(a, "hideSkuDOM", function() {
    this.setData({
      isShowSkuSelectBox: !1
    });
  }), t(a, "showSkuDOM", function() {
    this.setData({
      isShowSkuSelectBox: !0
    });
  }), t(a, "BuyProduct", function(t) {
    var a = this,
      n = t.currentTarget.dataset.index,
      u = t.currentTarget.dataset.sku,
      r = t.currentTarget.dataset.productid,
      s = a.data.ProductList,
      o = null;
    0 == u ? (s[n].CartQuantity = 1, a.ChangeQuantiy(a, s, r + "_0", 1)) : wx.request({
      url: e.gethsyurl,
      data: {
        action: 'GetProductSkus',
        ProductId: r
      },
      success: function(t) {
        if ("OK" == t.data.Status) {
          var e = t.data.Data;
          o = e.DefaultSku, a.setData({
            isShow: !1,
            CurrentProduct: e,
            CurrentSku: o,
            selectedskuList: []
          });
        }
      },
      complete: function() {}
    });
  }), t(a, "minusCount", function(t) {
    var a = this,
      e = t.currentTarget.dataset.index,
      n = this.data.ProductList,
      u = n[e].CartQuantity;
    u <= 1 || (u -= 1, n[e].CartQuantity = u, a.ChangeQuantiy(a, n, n[e].SkuId, -1));
  }), t(a, "addCount", function(t) {
    var a = this,
      e = t.currentTarget.dataset.index,
      n = this.data.ProductList,
      u = n[e].CartQuantity;
    u += 1, n[e].CartQuantity = u, a.ChangeQuantiy(a, n, n[e].SkuId, 1);
  }), t(a, "ChangeQuantiy1", function(t, a, n) {
    e.getOpenId(function(u) {
      wx.request({
        url: e.gethsyurl,
        data: {
          action: 'addToCart',
          openId: u,
          SkuID: a,
          Quantity: n,
          roomId:e.globalData.roomId
        },
        success: function(t) {
          "OK" == t.data.Status || ("NOUser" == t.data.Message ? wx.navigateTo({
            url: "/pages/login/login"
          }) : wx.showModal({
            title: "提示",
            content: t.data.ErrorResponse.ErrorMsg,
            showCancel: !1,
            success: function(t) {}
          }));
        },
        complete: function() {
          t.loadData(t);
        }
      });
    });
  }), t(a, "ChangeQuantiy", function(t, a, n, u) {
    e.getOpenId(function(r) {
      wx.request({
        url: e.gethsyurl,
        data: {
          action: 'addToCart',
          openId: r,
          SkuID: n,
          Quantity: u,
          roomId:e.globalData.roomId
        },
        success: function(e) {
          "OK" == e.data.Status ? t.setData({
            ProductList: a
          }) : "NOUser" == e.data.Message ? wx.navigateTo({
            url: "/pages/login/login"
          }) : wx.showModal({
            title: "提示",
            content: e.data.ErrorResponse.ErrorMsg,
            showCancel: !1,
            success: function(t) {}
          });
        },
        complete: function() {}
      });
    });
  }), t(a, "onSkuHide", function(t) {
    that.setData({
      isShow: !0
    });
  }), t(a, "onSkuClick", function(t) {
    var a = this,
      e = t.target.dataset.indexcount,
      n = t.target.id,
      u = t.target.dataset.skuvalue,
      r = t.target.dataset.attributeid;
    if (0 != t.target.dataset.enablevalue) {
      var s = new Object();
      s.ValueId = n, s.Value = u, s.attributeid = r;
      var o = this.data.selectedskuList;
      o[e] = s;
      var i = "",
        d = this.data.CurrentProduct,
        c = this.data.CurrentProduct.SkuItems;
      d.SkuItems.length == o.length && !0;
      for (var l = d.ProductId, h = 0; h < o.length; h++) {
        var g = o[h];
        void 0 != g && (i += "" == i ? g.Value : "," + g.Value, l += "_" + g.ValueId);
      }
      for (var f = 0; f < d.SkuItems[e].AttributeValue.length; f++) d.SkuItems[e].AttributeValue[f].ValueId == n ? d.SkuItems[e].AttributeValue[f].UseAttributeImage = "selected" : d.SkuItems[e].AttributeValue[f].UseAttributeImage = "False";
      var S = null;
      this.data.CurrentProduct.Skus.forEach(function(t, e, n) {
        for (var u = !0, r = 0; r < o.length; r++) - 1 == t.SkuId.indexOf("_" + o[r].ValueId) && (u = !1);
        if (u && c.length == o.length) return S = t, l = t.SkuId, void(a.data.buyAmount = t.CartQuantity > 0 ? t.CartQuantity : 1);
      });
      var C = a.data.CurrentProduct.Skus;
      this.data.CurrentProduct.SkuItems.forEach(function(t, a) {
        if (t.AttributeId != r) {
          for (var e = [], n = 0; n < o.length; n++) void 0 != o[n] && t.AttributeId != o[n].attributeid && e.push(o[n]);
          t.AttributeValue.forEach(function(t, a) {
            for (var n = 0, u = 0; u < C.length; u++) {
              for (var r = e.length, s = 0, o = C[u].SkuId, i = 0; i < e.length; i++) o.indexOf("_" + e[i].ValueId) >= 0 && s++;
              o.indexOf("_" + t.ValueId) >= 0 && r == s && (n = 1);
            }
            t.Enable = n;
          });
        }
      }), this.setData({
        selectedskuList: o,
        selectedSku: l,
        selectedSkuContent: i,
        SkuItemList: c,
        CurrentProduct: d,
        CurrentSku: S
      });
    }
  }), t(a, "OpenCurrentSku", function() {
    var t = this,
      a = (t.data.ProductList, t.data.CurrentSku);
    null != a && void 0 != a || wx.showModal({
      title: "提示",
      content: "请选择规格内容",
      showCancel: !1
    }), a.CartQuantity = 1, t.setData({
      CurrentSku: a
    }), t.ChangeQuantiy1(t, a.SkuId, 1);
  }), t(a, "bindSearchInput", function(t) {
    var a = t.detail.value;
    a.length > 0 && this.setData({
      keyword: a
    });
  }), t(a, "bindConfirmSearchInput", function(t) {
    var a = t.detail.value;
    a.length > 0 && (wx.setStorage({
      key: "keyword",
      data: a
    }), wx.switchTab({
      url: "../searchresult/searchresult",
      success: function(t) {
        wx.hideKeyboard();
      }
    }));
  }), t(a, "gotoKeyWordPage", function(t) {
    wx.navigateTo({
      url: "../search/search"
    });
  }), t(a, "bindBlurInput", function(t) {
    wx.hideKeyboard();
  }), t(a, "changeAmount", function(t) {
    var a = parseInt(t.detail.value),
      e = this.data.CurrentSkuStock;
    isNaN(a) || a > e || a <= 0 ? wx.showModal({
      title: "提示",
      content: "请输入正确的数量,不能大于库存或者小于等于0",
      showCancel: !1
    }) : this.setData({
      buyAmount: a
    });
  }), t(a, "reduceAmount", function(t) {
    var a = this.data.buyAmount;
    (a -= 1) <= 0 || this.setData({
      buyAmount: a
    });
  }), t(a, "addAmount", function(t) {
    var a = this.data.buyAmount;
    (a += 1) > this.data.CurrentSku.Stock ? wx.showModal({
      title: "提示",
      content: "请输入正确的数量,不能大于库存或者小于等于0",
      showCancel: !1
    }) : this.setData({
      buyAmount: a
    });
  }), t(a, "loadData", function(t, a) {
    wx.showNavigationBarLoading(), e.getOpenId(function(n) {
      wx.request({
        url: e.gethsyurl,
        data: {
          action: 'GetProducts',
          keyword: t.data.KeyWord,
          pageIndex: t.data.PageIndex,
          pageSize: t.data.PageSize,
          sortBy: t.data.SortBy,
          sortOrder: t.data.SortOrder,
          cId: t.data.Cid,
          openId: n
        },
        success: function(e) {
          if ("OK" == e.data.Status) {
            var n = e.data.Data;
            if (a) {
              var u = t.data.ProductList;
              u.push.apply(u, n), t.setData({
                ProductList: u
              });
            } else t.setData({
              ProductList: n
            });
          } else wx.showModal({
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
          wx.getSystemInfo({
            success: function(a) {
              var e = a.windowHeight - 53,
                n = t.data.Css;
              n.LHeight = e, n.TempHeight = e, t.setData({
                CSS: n
              });
            }
          }), wx.hideNavigationBarLoading();
        }
      });
    });
  }), t(a, "SetSubCategoryHeight", function() {
    var t = this.data.CurrentCategory.subs,
      a = parseInt(t.length) + 1,
      e = a / 3;
    a % 3 > 0 && (e = parseInt(e) + 1);
    var n = 0;
    e > 1 && (n = 90 * (e - 1)), this.setData({
      MarginTop: n,
      TempMarginTop: n,
      IsDown: !0
    });
  }), t(a, "commitBuy", function(t) {
    for (var a = this, e = !0, n = 0; n < a.data.selectedskuList.length; n++)
      if (void 0 == this.data.selectedskuList[n] || "" == a.data.selectedskuList[n] || null == this.data.selectedskuList[n]) {
        e = !1;
        break;
      }
    if (null != this.data.SkuItemList && a.data.selectedskuList.length == this.data.SkuItemList.length && e)
      if (a.data.buyAmount <= 0) wx.showModal({
        title: "提示",
        content: "请输入要购买的数量",
        showCancel: !1
      });
      else {
        var u = this.data.buyAmount,
          r = this.data.selectedSku;
        if (u > this.data.CurrentSku.Stock) wx.showModal({
          title: "提示",
          content: "请输入正确的数量,不能大于库存或者小于等于0",
          showCancel: !1
        });
        else {
          var s = u - this.data.CurrentSku.CartQuantity,
            o = this.data.ProductList;
          o.find(function(t, e) {
            t.ProductId != a.data.CurrentProduct.ProductId || (t.CartQuantity += s);
          }), a.ChangeQuantiy(a, o, r, s), a.onSkuHide(t);
        }
      }
    else wx.showModal({
      title: "提示",
      content: "请选择规格",
      showCancel: !1
    });
  }), t(a, "onSkuHide", function(t) {
    this.setData({
      isShow: !0,
      CurrentSku: null,
      CurrentProduct: null,
      selectedSku: "",
      buyAmount: 1
    });
  }), t(a, "ChooseCategory", function(t) {
    var a = this,
      e = t.currentTarget.dataset.cid,
      n = t.currentTarget.dataset.grade,
      u = t.currentTarget.dataset.index,
      r = a.data.Css;
    "1" == n ? a.data.CategoryList.find(function(t, n) {
      if (r.FirstIndex = u, r.SecondIndex = 0, t.cid == e) return a.setData({
        CurrentCategory: t,
        Css: r,
        Cid: e,
        PageIndex: 1
      }), void a.SetSubCategoryHeight();
    }) : (r.SecondIndex = u, a.setData({
      Css: r,
      Cid: e,
      PageIndex: 1
    })), a.loadData(a, !1);
  }), t(a, "SortClick", function(t) {
    var a = this,
      e = t.currentTarget.dataset.sortby,
      n = t.currentTarget.dataset.index,
      u = a.data.Css;
    u.SortIndex = n;
    var r = "asc",
      s = "shengxu";
    a.data.SortOrder == r && (r = "desc", s = "jiangxu"), a.setData({
      PageIndex: 1,
      SortBy: e,
      SortOrder: r,
      SortClass: s,
      Css: u
    }), a.loadData(a, !1);
  }), t(a, "ChooseProduct", function(t) {
    var a = t.currentTarget.dataset.productid;
    wx.navigateTo({
      url: "../productdetail/productdetail?id=" + a
    });
  }), t(a, "onReady", function() {}), t(a, "onShow", function() {
    this.IsPagePost, this.GetShopCart();
  }), t(a, "onHide", function() {}), t(a, "onUnload", function() {}), t(a, "onPullDownRefresh", function() {}),
  t(a, "onReachBottom", function() {
    var t = this.data.PageIndex;
    t = parseInt(t) + 1, this.setData({
      PageIndex: t
    }), this.loadData(this, !0);
  }), t(a, "onShareAppMessage", function() {
    var t = this,
      a = "/pages/productdetail/productdetail?id=" + t.data.ProductId;
    return e.globalData.userInfo && e.globalData.userInfo.IsReferral && (a += "&ReferralUserId=" + e.globalData.userInfo.UserId), {
      title: t.data.ProductName,
      path: a,
      success: function(t) {
        hishop.showTip("分享成功", "success");
      },
      fail: function(t) {
        hishop.showTip("分享失败", "error");
      }
    };
  }), a));