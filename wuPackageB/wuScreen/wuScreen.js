let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.newImg,
    nav: ['离我最近', '销量最多', '评价最高','筛选'],
    storeList: [ //门店列表
      {
        img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/sade.jpg',
        name: 'Beauty国际形象管理中心',
        pinf: 4.6,
        yuyue: 9999,
        address: '广州市越秀区中山二路创举大厦',
        juli: 1.5
      },
      {
        img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/sade.jpg',
        name: 'Beauty国际形象管理中心',
        pinf: 4.6,
        yuyue: 9999,
        address: '广州市越秀区中山二路创举大厦',
        juli: 1.5
      },
      {
        img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/sade.jpg',
        name: 'Beauty国际形象管理中心',
        pinf: 4.6,
        yuyue: 9999,
        address: '广州市越秀区中山二路创举大厦',
        juli: 1.5
      },
      {
        img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/sade.jpg',
        name: 'Beauty国际形象管理中心',
        pinf: 4.6,
        yuyue: 9999,
        address: '广州市越秀区中山二路创举大厦',
        juli: 1.5
      },
    ], 
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