/*
 * @Author: fujihang
 * @Date: 2020-02-28 09:19:27
 * @LastEditors: fujihang
 * @LastEditTime: 2020-02-28 13:42:20
 * @FilePath: \头道惠门店\fuPackageA\fuHongKa\fuHongKa.js
 */
// fuPackageA/fuHongKa/fuHongKa.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
            that.banDing(options)
          } else {
            wx.redirectTo({
              url: "/pages/login/login"
            });
          }
        })
      })
    } else {
      that.banDing(options)
    }
  },


  banDing(op) {
    let data = this.data, that = this
    app.fl('正在升级成为会员')
    app.fg({
      action: "UpTemGrade",
      openId: app.globalData.GetMembersInfo.openId,
      g: decodeURIComponent(op.scene).split('g=')[1]

    }).then(r => {
      app.fh()
      wx.removeStorage('honKa')
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/qidong/qidong'
        })
      }, 1450)


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