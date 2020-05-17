const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.imgUrl,
    functionList:[
      {
        name:'技师信息',
        to:'/fuPackageA/fuTeachInfo/fuTeachInfo',
      },
      {
        name:'个人作品',
        to:'/fuPackageA/fuTeachWork/fuTeachWork',
      },
      {
        name:'头道惠签约头疗师',
        to:'/fuPackageA/fuTeachTitle/fuTeachTitle',
      },
      {
        name:'匠心证书',
        to:'/fuPackageA/fuTeachSZS/fuTeachSZS',
      },
      // {
      //   name:'特色服务',
      //   to:'/fuPackageA/fuSpecial/fuSpecial',
      // },
      {
        name:'匠心商学院',
        to:'/fuPackageA/fuTeachSchool/fuTeachSchool',
      },
    ]
     
  },
  toFN(e){
    let data=e.currentTarget.dataset.to
    wx.navigateTo({
      url:data
    })
  },

  toFND(){
    wx.navigateTo({
      url:'/pages/fujihang/fuTeacherDet/fuTeacherDet?id='+app.globalData.GetMembersInfo.tcid
    })
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