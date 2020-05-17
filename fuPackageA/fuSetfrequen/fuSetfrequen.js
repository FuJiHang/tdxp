const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navInfo: {
      list: [{
        name: '次数卡'
      }, {
        name: '活动图'
      }],
      nowIdx: 0
    }, //顶部选项卡
    dataList: [],
    page: 1,
    finsh: false,
    ProductId: 0,
  },

  // 获取活动图信息
  getActPic() {
    console.log(1)
    let data = this.data,
      that = this
    if (data.finsh) return
    app.fl()
    app.fg({
      url: '/api/WeChatApplet.ashx?action=SetStoreIndexPic',
      data: {
        Type: 3, //3-获取所有活动广告图、4-设置门店显示广告、5-获取门店显示广告
        StoreId: app.globalData.GetMembersInfo.StoreId,
        PageIndex: data.page,
        PageSize: 10,
      }
    }, true).then(r => {
      app.fh()
      if (r.data.Status == 'Success') {
        r.data.Message.forEach(c => {
          if (c.IsStore == 1) {
            c.isChoose = true
          } else {
            c.isChoose = false
          }
          data.dataList.push(c)
        })
        that.setData({
          dataList: data.dataList,
          page: ++data.page,
          finsh: r.data.Message.length < 10
        })
      } else app.fa(r.data.Messgae)
      console.log(r)
    })
  },

  // 切换选择卡
  changeNav(e) {
    let idx = e.currentTarget.dataset.idx,
      _this = this
    if (idx == _this.data.navInfo.nowIdx) return
    this.data.dataList = []
    this.data.page = 1
    this.data.finsh = false
    this.setData({
      [`navInfo.nowIdx`]: idx
    }, () => {
      idx == 0 ? _this.getData() : _this.getActPic()
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('getStore').StoreName
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

  // 选择
  chooseFN(e) {
    let data = this.data,
      that = this,
      datac = e.currentTarget.dataset
      if(datac.id==541&&datac.ischoose) return app.fa('该活动必须勾选')
    this.setData({
      [datac.name]: !datac.ischoose
    })
  },

  // 
  getData() {
    let data = this.data,
      that = this
    if (data.finsh) return
    app.fl()
    app.fg({
      url: '/api/WeChatApplet.ashx?action=SetStoreIndexPic',
      data: {
        Type: 0,
        StoreId: app.globalData.GetMembersInfo.StoreId,
        PageIndex: data.page,
        PageSize: 10,
      }

    }, true).then(r => {
      app.fh()
      if (r.data.Status == 'Success') {
        r.data.Message.rows.forEach(c => {
          if (c.IsStore == 1) {
            c.isChoose = true
          } else {
            c.isChoose = false
          }
          data.dataList.push(c)
        })
        that.setData({
          dataList: data.dataList,
          page: ++data.page,
          finsh: r.data.Message.rows.length < 10
        })
      } else app.fa(r.data.Messgae)
    })
  },

  // 设置
  setProduct(e) {
    let data = this.data, pId = '', SetList = '',
      that = this,
      type = e.currentTarget.dataset.type // 1次数卡，4活动卡
    data.dataList.forEach((c, i) => {
      if (c.isChoose) {
        if (type == 1) pId ? pId += ',' + c.ProductId : pId = c.ProductId
        else pId ? pId += ',' + c.AdValue : pId = c.AdValue
      }
    })
    if (type == 1) SetList = e.currentTarget.dataset.iscancl ? -1 : pId
    else SetList = e.currentTarget.dataset.iscancl ? 541 : pId
    app.fl()
    app.fg({
      url: '/api/WeChatApplet.ashx?action=SetStoreIndexPic',
      data: {
        Type: type,
        StoreId: app.globalData.GetMembersInfo.StoreId,
        SetList: SetList
      }

    }, true).then(r => {
      app.fh()
      app.fa(r.data.Message)
      if (e.currentTarget.dataset.iscancl) {
        data.dataList.forEach((c, i) => {
          if(c.AdValue!=541)   c.isChoose = false
        
        })
        that.setData({
          dataList: data.dataList
        })
      }
    })

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