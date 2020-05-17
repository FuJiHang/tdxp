// pages/PersonalInformationEditingMember/PersonalInformationEditingMember.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl + 'personal_bg.png',
    GetMembersInfo: {},
    informationData: [{
        title: '姓名',
        val: ''
      },
      {
        title: '性别',
        val: ''
      },
      {
        title: '生日',
        val: ''
      },
      {
        title: 'QQ',
        val: ''
      }
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this,
      informationData = _this.data.informationData,
      dataInfo = app.globalData.GetMembersInfo;
    informationData[0].val = dataInfo.RealName == null ? '无' : dataInfo.RealName
    informationData[1].val = dataInfo.Gender == 0 ? '' : dataInfo.Gender == 1 ? '男' : '女'
    informationData[2].val = dataInfo.BirthDate == null ? '无' : dataInfo.BirthDate
    informationData[3].val = dataInfo.QQ == null ? '无' : dataInfo.QQ
    this.setData({
      GetMembersInfo: app.globalData.GetMembersInfo,
      informationData: informationData
    })

    console.log(this.data.GetMembersInfo)
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})