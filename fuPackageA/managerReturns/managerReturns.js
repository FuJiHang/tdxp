// fuPackageA/managerReturns/managerReturns.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getStore: {}, //门店信息
    page: 1, //门店列表页码
    finish: false,
    list: [], //列表
    info: {},
    isList: true, //是否list
    detailInfo: {}, //详情
  },

  // 返回列表
  returnList() {
    this.data.page = 1
    this.data.finish = false
    this.data.list = []
    this.setData({
      isList: true
    }, () => {
      this.getData()
    })
  },

  // 收益详情
  toDetail(e) {
    let idx = e.currentTarget.dataset.idx,
      _this = this,
      item = _this.data.list[idx]
    _this.setData({
      isList: false
    })
    _this.getDetail(item.GetType, item.OrderId)
  },

  // 获取收益明细
  getDetail(type, id) {
    let data = this.data,
      that = this
    app.fl()
    app.fg({
      action: 'GetStoreIncome',
      StoreId: app.globalData.GetMembersInfo.StoreId,
      Type: 1,
      GetType: type,
      OrderId: id
    }).then(r => {
      app.fh()
      if (r.data.Message.length == 0) {
        wx.showToast({
          title: '暂无详情',
          icon: 'none'
        })
        setTimeout(() => {
          that.setData({
            isList: true
          })
        }, 1500)
      }
      that.setData({
        detailInfo: r.data.Message
      })
    })
  },

  // 获取店主收益列表
  getData() {
    let data = this.data,
      that = this
    app.fl()
    app.fg({
      action: 'GetStoreIncome',
      StoreId: app.globalData.GetMembersInfo.StoreId,
      Type: 0,
      pageindex: data.page,
      pagesize: 10
    }).then(r => {
      app.fh()
      r.data.Message.Data.forEach(c=>{
        c.OrderDate=c.OrderDate.replace('T', ' ').split('.')[0]
      })
      let datar = r.data.Message.Data
      if (data.page == 1) {
        data.list = datar
      } else {
        data.list = data.list.concat(datar)
      }
      if (datar.length < 10) {
        data.finish = true
      }
      data.page++
        that.setData({
          list: data.list,
          info: r.data.Message,
        })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this
    wx.getStorage({
      key: 'getStore',
      success(e) {
        _this.setData({
          getStore: e.data
        })
        wx.setNavigationBarTitle({
          title: e.data.StoreName
        })
       
      }
    })
    // app.globalData.GetMembersInfo.StoreId=141
    _this.getData()
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
    this.getData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})