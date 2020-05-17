let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.newImg,
    img:'',
    storeList: [ //门店列表
      {
        img:'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/sade.jpg',
        name:'Beauty国际形象管理中心',
        pinf:4.6,
        yuyue:9999,
        address:'广州市越秀区中山二路创举大厦',
        juli:1.5
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
    region: ['广东省', '广州市', '越秀区'],
    customItem: '全部'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
 
  // 省市区
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
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