var t = getApp(),
  e = require("../../utils/config.js");

Page({
  data: {
    pageIndex: 1,
    pageSize: 10,
    AfterList: null,
    isNextEmpty: !1,
    // nullOrder: t.getRequestUrl + "/Templates/xcxshop/images/nullOrder.png"
    nullOrder: 'https://hmeshop-1256233971.cos.ap-guangzhou.myqcloud.com/wxapp/images/pic-kong.png' //缺省图
  },
  onLoad: function(t) {},
  loadData: function(a, n) {
    n && a.data.isNextEmpty ? e.showTip("没有更多数据了") : (n && a.setData({
      pageIndex: a.data.pageIndex + 1
    }), t.getOpenId(function(e) {
      wx.request({
        url: t.getUrl("GetAllAfterSaleList"),
        data: {
          openId: e,
          pageIndex: a.data.pageIndex,
          pageSize: a.data.pageSize
        },
        success: function(t) {
          if ("OK" == t.data.Status) {
            var e = t.data.Data;
            if (n || 0 !== e.length || a.setData({
                isEmpty: !0
              }), n) {
              var i = a.data.AfterList;
              i.push.apply(i, e), a.setData({
                AfterList: i,
                isNextEmpty: t.data.RecordCount <= i.length
              });
            } else a.setData({
              AfterList: e,
              isNextEmpty: e.length < 0
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
    }));
  },
  applydetail: function(t) {
    var e = t.currentTarget.dataset.type,
      a = t.currentTarget.dataset.id;
    0 == e ? wx.navigateTo({
      url: "../refunddetail/refunddetail?id=" + a
    }) : wx.navigateTo({
      url: "../returndetail/returndetail?id=" + a
    });
  },
  SendGood: function(t) {
    var e = t.currentTarget.dataset.id,
      a = t.currentTarget.dataset.skuid;
    wx.navigateTo({
      url: "../applysendgood/applysendgood?id=" + e + "&&skuId=" + a
    });
  },
  onReady: function() {},
  onShow: function() {
    var t = this;
    t.loadData(t, !1);
  },
  onHide: function() {},
  onUnload: function() {},
  onPullDownRefresh: function() {},
  onReachBottom: function() {
    var t = this;
    t.loadData(t, !0);
  },
  onShareAppMessage: function() {}
});