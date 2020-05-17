// pages/pointStore/pointStore.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isEmpty: false, // 是否为空
    dataList: [],
    banner: 'http://img.hmeshop.cn/hmeshopV3/Storage/master/201904221513454777000.png',
    page: 1,
    dataLength: 0,
    pageSize: 10,
  },

  // 获取页面数据
  getPointData: function() {
    var _this = this
    wx.request({
      url: getApp().gethsyurl + '?action=GetGifts',
      data: {
        SaleStatus:app.globalData.appId=="wx2e40ad78f7098898"?1:'',
        pageIndex: _this.data.page,
        pageSize: _this.data.pageSize,
        StoreId:wx.getStorageSync('getStore').StoreId?wx.getStorageSync('getStore').StoreId:0,
      },
      success: function(res) {
        _this.data.dataLength = res.data.rows.length
        _this.data.dataList = _this.data.dataList.concat(res.data.rows)
        _this.setData({
          dataList: _this.data.dataList
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.data.dataList = []
    this.getPointData()
    wx.removeStorage({
      key:'upgrade'
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.dataLength == this.data.pageSize) {
      this.data.page++
        this.getPointData()
    }
  },
})