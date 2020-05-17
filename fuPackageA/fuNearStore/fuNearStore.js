const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:[],
    getCoupon:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.getCoupon=options.data
    this.getData()
  },

  toStroe(e){
    let data=this.data.getCoupon
    wx.navigateToMiniProgram({
      appId: 'wxa4d03cf8e1ea5904',
      path: 'pages/fujihang/fuCoupon/fuCoupon?active=3',
      // envVersion:'develop',
      extraData:{
        storeId:e.currentTarget.dataset.id
      },
      success:function(e){
        console.log(e)
      },fail:function(e){
        console.log(e)
      }
    })
  },


  // 
  getData(e) {
    let data = this.data, that = this
    app.fl()
    app.fg({
      url: '/AppShop/AppShopHandler.ashx?action=GetStoreList',
      data: {
        pageIndex: 1,
        pageSize: 1000,
        Type: 1,
        Lan: wx.getStorageSync('LatiLongitude').Latitude,
        Lng:wx.getStorageSync('LatiLongitude').Longitude,
        SearchKey: '',
      }
    }, true).then(r => {

      app.fh()
      that.setData({
        dataList:r.data.Result.StoreList
      })
      console.log(data.dataList);
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