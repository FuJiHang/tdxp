const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // imgUrl:app.imgUrl,
    Identity: [
      {
        name: '线下门店',
        text: '描述的小文字',
        img: app.newImg + 'xxmd003.png',
        post: 'ST',
      },
      // {
      //   name:'技师',
      //   text:'描述的小文字',
      //   img:app.imgUrl+'role_icon_02.png',
      //   post:'TC',
      // },
      // {
      //   name:'执行团队长',
      //   text:'描述的小文字',
      //   img:app.imgUrl+'role_icon_03.png',
      //   post:'TH',
      // },
      {
        name: '个体用户',
        text: '描述的小文字',
        img: app.newImg + 'zhmd003.png',
        post: 'BS',
      },
      // {
      //   name: '代理',
      //   text: '描述的小文字',
      //   img: app.newImg + 'dianyuan@2x.png',
      //   post: 'DL',
      // },

    ],//身份选择
    storeid: '',//会员中心的门店id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
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
          } else {
            wx.redirectTo({
              url: "/pages/login/login"
            });
          }
        })
      })
    }

    let { StoreId } = wx.getStorageSync('userinfo');//会员中心的门店id
    this.setData({
      storeid: StoreId
    })



  },
  toFN(e) {
    let newIndex = e.currentTarget.dataset.index;
    let data = app.globalData.GetMembersInfo
    let index = e.currentTarget.dataset.index

    if (index) {
      if(data.StoreId) return app.fa('你已是个体店主！')
      wx.navigateTo({
        url: "/fuPackageA/fuZhiHuiApply/fuZhiHuiApply",
      });
    } else {
      if(data.StoreId) return app.fa('你已是店主！')
      wx.navigateTo({
        url: '/wuPackageB/application/application',
      });
    }







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
    app.fh()
    console.log()
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
    app.fh()
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