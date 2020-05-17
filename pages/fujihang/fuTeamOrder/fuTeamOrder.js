// pages/fujihang/fuTeamOrder/fuTeamOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    functionList:[
      {
        name:'已预约'
      },
      {
        name:'已完成'
      },
    ],//导航条
    active:0,
    chooseList:[
      {
        name:'汇金新城',
      },
      {
        name:'技师是',
      },
      {
        name:'其他',
      },
      {
        name:'汇金新城',
      },
      {
        name:'技师是',
      },
      {
        name:'其他',
      },
      {
        name:'汇金新城',
      },
      {
        name:'技师是',
      },
      {
        name:'其他',
      },
      {
        name:'汇金新城',
      },
      {
        name:'技师是',
      },
      {
        name:'其他',
      },
      {
        name:'汇金新城',
      },
      {
        name:'技师是',
      },
      {
        name:'其他',
      },
      {
        name:'汇金新城',
      },
      {
        name:'技师是',
      },
      {
        name:'其他',
      },
      {
        name:'汇金新城',
      },
      {
        name:'技师是',
      },
      {
        name:'其他',
      },
      {
        name:'汇金新城',
      },
      {
        name:'技师是',
      },
      {
        name:'其他',
      },
      {
        name:'汇金新城',
      },
      {
        name:'技师是',
      },
      {
        name:'其他',
      },
    ],//左边选择项
    isChoose:0,//选择的选项
  },

  // 选择功能
  onChange(event) {
    wx.showToast({
      title: `切换到标签 ${event.detail.index + 1}`,
      icon: 'none'
    });
  },

  // 选择分类
  chooseFN:function(e){
    this.setData({
      isChoose:e.target.dataset.index
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