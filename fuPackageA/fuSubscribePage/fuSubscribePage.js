const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authorizationList: [], //授权列表
    checkList: [], //已选中
  },

  // 选中复选框
  checkboxChange: function (e) {
    let list = e.detail.value
    if (list.length > 3) {
      list.splice(0, 1)
    }
    let arr = this.data.authorizationList.map(v => {
      v.checked = false
      return v
    })
    for (let i = 0; i < list.length; i++) {
      let num = list[i]
      arr[num].checked = true
    }
    this.setData({
      authorizationList: arr
    })
  },

  // 返回会员中心
  goBack() {

    wx.navigateBack({
      delta: 1
    })

  },

  // 确定
  confirm() {
    let _this = this, arr = this.data.authorizationList, list = []
    arr.forEach(v => {
      if (v.checked) {
        list.push(v.Value)
      }
    })
    if (list.length == 0) {
      wx.showToast({
        title: '请选择至少一个需要订阅模板',
        icon: 'none'
      })
      return
    }
    wx.requestSubscribeMessage({
      tmplIds: list,
      complete(res) {
        wx.showModal({
          title: '提示',
          content: '订阅操作已完成，点击确认返回上一页',
          success(res) {
            if (res.confirm) {
              wx.navigateBack({
                delta: 1
              })

            }
          }
        })
      }
    })
  },

  // 获取授权模板
  getSubscribeList() {
    let data = this.data, that = this
    app.fl()
    app.fg({
      url: '/API/PublicHandler.ashx?action=GetSubAppletTemplateId'
    }, true).then(r => {
      app.fh()
      if (r.data.Status == 'Success') {
        r.data.List.forEach(v => {
          v.checked = false
        })
        that.setData({
          authorizationList: r.data.List
        })
      } else app.fa(r.data.message || '数据错误')
      console.log(r)
    })

    // wx.request({
    //   url: getApp().data.url + '/api/VshopMiniProgrameProcess.ashx?action=GetTemplateList',
    //   success: function(res) {
    //     wx.hideLoading()
    //     if (res.data.Status === 'success') {
    //       res.data.Data.forEach(v => {
    //         v.checked = false
    //       })
    //       _this.setData({
    //         authorizationList: res.data.Data
    //       })
    //     } else {
    //       wx.showModal({
    //         title: '提示',
    //         content: res.data.errorMsg || '数据错误',
    //         showCancel: false
    //       })
    //     }
    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.getSubscribeList()
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