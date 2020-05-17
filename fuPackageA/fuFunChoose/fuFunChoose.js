const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    funList:[
      {
        name:'编辑身份信息',
        url:'/pages/PersonalInformationMember/PersonalInformationMember',
      },
      {
        name:'身份申请',
        url:'/pages/fujihang/fuIdentity/fuIdentity',
      },
      {
        name:'身份入口',
        url:'/fuPackageA/fuMyTowQH/fuMyTowQH',
      },
      // {
      //   name:'我的分享',
      //   url:'/fuPackageA/fuShareReward/fuShareReward',
      // },
    ],
    imgUrl:app.imgUrl,
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