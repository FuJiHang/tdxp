// pages/fuMyOrder/fuMyOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTop:['项目订单','商品订单'],//导航条
    isChoose:0,//被选择的导航条
    active: 0,//功能导航条的默认
    functionList:[
      {
        name:"已预约",
      },
      {
        name:"已核销",
      },
      {
        name:"已完成",
      },
      {
        name:"已取消",
      },
    ],//功能导航条
  },

  // 选择导航条
  changeTop:function(event){
    let index=event.currentTarget.dataset.index
    this.setData({isChoose:index})
  },

  // 选择功能
  onChange(event) {
    wx.showToast({
      title: `切换到标签 ${event.detail.index + 1}`,
      icon: 'none'
    });
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