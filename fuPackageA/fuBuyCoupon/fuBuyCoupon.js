
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    getStore: {},
    couponId: {

    },
    getProject: {},
    allPrice: 0,
    fujihang: {},
  },

  //  
  payOrder() {
    let data = this.data, that = this
    app.fl()
    app.fg({
      action: 'UserGetStoreActivityCard',
      // openId: 'os5--4mv2odIzdzHB9Gu-XjGUx2k',
      openid: app.globalData.GetMembersInfo.openId,
      appid: app.globalData.appId,
      ProductId: data.getProject.Id,
      StoreId: data.getStore.StoreId,
      ClaimCode: data.couponId.id ? data.couponId.id : '',
      ReferralUserId: wx.getStorageSync('referralUserIdTwo')
    }).then(b => {
      if (b.data.Status != 'Buy') {
        app.fh()
        app.fa(b.data.Message)
        return
      }
      let pay = b.data.Data
      wx.requestPayment({
        timeStamp: pay.timeStamp,
        nonceStr: pay.nonceStr,
        package: "prepay_id=" + pay.prepayId,
        signType: 'MD5',
        paySign: pay.sign,
        success(res) {
          app.fh()
          if (res.errMsg == "requestPayment:ok") {
            // app.fg({
            //   action: 'BuyerPaid',
            //   shopType: 2,
            //   payId: pay.PayId,
            //   couponId: 461,
            //   openId: app.globalData.GetMembersInfo.openId,
            // })
            app.fa('购买成功！')
            setTimeout(() => {
              wx.navigateTo({
                url: '/fuPackageA/fuOrderTip/fuOrderTip?orderid=0&isCou=true&total=' + data.allPrice
              })
            }, 1450)

          } else {
            app.fh()
            app.fa('购买失败！')
          }
        }, fail(res) {
          app.fh()
          app.fa('购买失败！')
        }
      })

    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this

    wx.setStorage({
      key: "couponId",
      data: {
        id: 0,
        pic: 0,
      },
    })


   
    wx.getStorage({
      key: 'getStore',
      success(e) {
        that.setData({
          getStore: e.data
        })
        wx.setNavigationBarTitle({
          title: e.data.StoreName
        })
      }
    })



    this.setData({
      getProject: JSON.parse(decodeURIComponent(options.data)),
      allPrice: JSON.parse(decodeURIComponent(options.data)).Price
    })
  },




  // 
  toFN() {
    wx.navigateTo({
      url: '/pages/fujihang/fuCoupon/fuCoupon?price=' + this.data.getProject.Price
    })
  },

  // 
  openMap() {
    wx.openLocation({
      latitude: parseFloat(this.data.getStore.Latitude),
      longitude: parseFloat(this.data.getStore.Longitude),

    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    // 优惠券回调
    wx.getStorage({
      key: 'couponId',
      success: r => {
        that.setData({
          couponId: r.data,
          allPrice: that.data.getProject.Price - r.data.pic > 0 ? (that.data.getProject.Price * 100 - r.data.pic * 100) / 100 : 0
        })

      }
    })
    if(!app.globalData.GetMembersInfo||!app.globalData.GetMembersInfo.openId){
      app.getOpenId(function(a) {
        app.fg({
          action: 'GetMembersInfo',
          openId: a
        }).then(r => {
          if (r.data.Status == "OK") {
            let dataR = r.data.Data
            dataR.openId = a
            app.setMembersInfo(dataR)
          } else {
            wx.redirectTo({
              url: "/pages/login/login"
            });
          }
        })
      })
    }
     
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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