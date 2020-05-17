const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    finsh: false,
    dataList: [],
    imgUrl: app.imgUrl,
    Search: '',
  },

  getDataS() {
    this.setData({
      page: 1,
      finsh: false,
      dataList: [],
    })
    this.getData()
  },

  // 搜索字
  seaChFN(e) {
    this.setData({
      seach: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
  },

  getData() {
    let data = this.data, that = this
    if (data.finsh) return
    app.fl()
    app.fg({
      url: '/api/ordersHandler.ashx?action=StoreSearchMember',
      data: {
        Search: data.Search,
        pageIndex: data.page,
        pageSize: 10,
      }
    }, true).then(r => {
      app.fh()
      if (r.data.Status == 'Success') {
        r.data.Data.forEach(c => {
          data.dataList.push(c)
        })
        that.setData({
          dataList: data.dataList,
          page: ++data.page,
          finsh: r.data.Data.length < 10,
        })
      }else app.fa(r.data.Message)
    })
  },

  // 
  toFN(e){
    wx.navigateTo({
      url:'/fuPackageA/fuCouponList/fuCouponList?sf=1&UserId='+e.currentTarget.dataset.uid
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
    this.getData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})