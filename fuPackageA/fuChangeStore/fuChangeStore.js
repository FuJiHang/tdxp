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
    let data = this.data, that = this
    if (!app.globalData.GetMembersInfo || !app.globalData.GetMembersInfo.openId) {
      app.getOpenId(function (a) {
        app.fg({
          action: 'GetMembersInfo',
          openId: a
        }).then(r => {
          if (r.data.Status == "OK") {
            let dataR = r.data.Data
            dataR.openId = a
            app.setMembersInfo(dataR)
            that.getData()
          } else {
            wx.redirectTo({
              url: "/pages/login/login"
            });
          }
        })
      })
    } else that.getData()
  },

  getData() {
    let data = this.data, that = this
    app.fl()
    app.fg({
      url: "/API/WeChatApplet.ashx",
      data: {
        action: "GetStoresBySWXMchId",
        openId: app.globalData.GetMembersInfo.openId,
      }

    }, true).then(r => {
      app.fh()
      that.setData({
        dataList: r.data.Models
      })
      console.log(r)
    })
  },


  // 
  chooseFN(e) {
    let id = e.currentTarget.dataset.id
    let data = this.data, that = this
    app.fl()
    app.fg({
      url: '/API/WeChatApplet.ashx',
      data: {
        action: "BindStoreMUserId",
        openId: app.globalData.GetMembersInfo.openId,
        StoreId: id,
      }
    }, true).then(r => {
      app.fh()
      if (r.data.Status == 'OK') {
        setTimeout(() => {

        

            app.globalData.storeId = id
            app.globalData.appId == 'wxa4d03cf8e1ea5904' ? wx.reLaunch({
              url: '/pages/fujihang/fuIndexG/fuIndexG?id=' + id
            }) : wx.navigateToMiniProgram({
              appId: 'wxa4d03cf8e1ea5904',
              path: 'pages/fujihang/fuIndexG/fuIndexG?id=' + id,
              // envVersion:'develop',
              success: function (e) {
                console.log(e)
              }, fail: function (e) {
                console.log(e)
              }
            })
          
          


        }, 1450)
      }
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