const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
  },
  getData() {
    let data = this.data, that = this
    app.fl()
    app.fg({
      url: '/API/WeChatApplet.ashx',
      data: {
        action: 'GetBannerPictures',
        SetType: 0,
        StoreId: app.globalData.GetMembersInfo.StoreId,
      }
    }, true).then(r => {
      app.fh()
      this.setData({
        dataList: r.data.rows
      })
      console.log(r)
    })
  },

  // 选择
  chooseFN(e) {
    this.setData({
      [e.currentTarget.dataset.name]: !e.currentTarget.dataset.isstore
    })
  },

  // 设置
  setFN() {
    let data = this.data, that = this, bid = ''

    data.dataList.forEach(c => {

      c.IsStore ? (bid ? bid += ',' + c.AdValue : bid = c.AdValue) : ''

    })
    app.fl()
    app.fg({
      action: 'GetBannerPictures',
      StoreId: app.globalData.GetMembersInfo.StoreId,
      SetType: 1,
      SetList: bid,
    }).then(r => {
      app.fh()
      app.fa(r.data.Message)

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