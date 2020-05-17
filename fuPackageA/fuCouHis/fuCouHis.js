const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    finsh: false,
    dataList: [],
    id:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.id=options.id?options.id:0

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getData() {
    let data = this.data, that = this
    if (data.finsh) return
    app.fl()
    app.fg({
      action: 'GetCardUseList',
      openId:app.globalData.GetMembersInfo.openId,
      // openId: 'os5--4mv2odIzdzHB9Gu-XjGUx2k',
      PageIndex: data.page,
      PageSize: 10,
      ItemId: data.id
    }).then(r => {
      app.fh()
      if (r.data.Status == 'OK') {
        r.data.Data.forEach(c => {
          c.CreateDate = c.CreateDate.split('T')[0]
          data.dataList.push(c)
        })
        that.setData({
          dataList: data.dataList,
          page: ++data.page,
          finsh: r.data.Data.length < 10
        })
      }
  
    })
  },

  // 
  toFN(e) {
    if(e.currentTarget.dataset.id.IsScore) return
    wx.navigateTo({
      url: '/fuPackageA/fuEvaluatCou/fuEvaluatCou?id=' + e.currentTarget.dataset.id.ID
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.data = {
      page: 1,
      finsh: false,
      dataList: []
    }

    this.getData()

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