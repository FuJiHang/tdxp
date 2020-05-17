const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.imgUrl,
    couponid:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("输出", options);
    const { couponid, order } = options;
    this.setData({
      couponid
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getOpenid(this.data.couponid);
  },
  //获取openid
  getOpenid(id){
    let that = this;
    if (!app.globalData.GetMembersInfo || !app.globalData.GetMembersInfo.openId) {
      app.getOpenId(function (a) {
        app.fg({
          action: 'GetMembersInfo',
          openId: a
        }).then(r => {
          console.log("获取openId", r);
          if (r.data.Status == "OK") {
            let dataR = r.data.Data
            dataR.openId = a
            app.setMembersInfo(dataR);
            that.getCoupon(id, dataR.openId);
          } else {
            wx.redirectTo({
              url: "/pages/login/login"
            });
          }
        })
      })
    }
  },

  //获取取赠送优惠券
  getCoupon(id,open) {
    console.log("优惠劵ID", id);
    console.log("输出openid",open);
    wx.request({
      url: app.data.url + '/API/WeChatApplet.ashx',
      data: {
        action: 'LoadSiteCoupon',//	是	string	LoadCoupon
        openID: open || app.globalData.GetMembersInfo.openId,//	是	string	微信openid
        Role:1,
        Type:1,
        pageIndex: 1,//	是	int	页码
        PageSize: 1,//	是	int	页大小
        CouponIds:id, //	否	string	订单号（关联赠送优惠劵）
      },
      header: { Cookie: wx.getStorageSync('cookieFu') },
      success: (res) => {
        console.log("获取优惠券数据", res);
        if (res.data.Status == "OK") {
          let arr = res.data.Data;
          arr.forEach(v=>{
            v.start = v.StartTime.substring(0,10)
            v.closing = v.ClosingTime.substring(0, 10)
          })
          console.log("输出新数组",arr);
          this.setData({
            list: arr
          })
        }
      },
      fail: () => { },
      complete: () => { }
    });
  },
  //领取优惠劵数据
  pullDown(e) {
    console.log("输出领取参数",e);
    const { couponid } = e.currentTarget.dataset;
    wx.request({
      url: app.data.url + '/API/WeChatApplet.ashx',
      data: {
        action: 'UserGetCoupon',//	是	string	LoadCoupon
        openID: app.globalData.GetMembersInfo.openId || wx.getStorageSync('openId'),//	是	string	微信openid
        shopType:2,//	是	int	1店主设置门店优惠劵2客户领取优惠劵
        couponId: couponid ,//	否	int	优惠劵(客户)
        appid:app.globalData.appId,
      },
      header: { Cookie: wx.getStorageSync('cookieFu') },
      success: (res) => {
        console.log("领取优惠券状态", res);
        if(res.data.Status=="OK"){
          wx.showToast({
            title: res.data.Message,
            icon: 'success',
            image: '',
            duration: 1500,
            mask: false,
            success: (result) => {
              setTimeout(() => {
                wx.navigateTo({
                  url: '/pages/fujihang/fuCoupon/fuCoupon?status=true&active=1',//跳转优惠券列表
                  success: (result) => {
                  },
                });
              }, 1500);
            },
          });
        } else{
          wx.showToast({
            title: res.data.Message,
            icon: 'none',
            duration: 1500,
            mask: true,
            success: (result) => {
              setTimeout(() => {
                wx.switchTab({
                  url: wx.getStorageSync('getStore')?'/pages/fujihang/fuIndexG/fuIndexG':'/pages/fujihang/fuIndexZB/fuIndexZB',
                });
              }, 1500);
            },
          });
            
        }
      },
    });
  },



  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})