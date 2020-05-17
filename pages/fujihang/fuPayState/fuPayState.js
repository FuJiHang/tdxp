const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money:0,
    showC:true,
    imgUrl:app.imgUrl,
    orderData:{},
    index:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      money:options.money,
      orderData:options.orderData?options.orderData:'',
      index:options.des=="补色"?1:0
    })
  },

  onCloseP(){
    this.setData({
      showC:false
    })
  },

    // 以后再说提示
    tipFN(){
      app.fa('评价可得积分，订单详情可评价')
      this.setData({
        showC:false
      })
    },

  // 点击跳转页面
  toFN(e){
    if(e.target.dataset.index) {
      wx.switchTab({
        // url: '/pages/bchome/bchome'
        url:"/pages/fujihang/fuIndexG/fuIndexG"

      });  
    }else{
      wx.switchTab({
        url:'/pages/technician/technician'
      })
    }


  },


  // 
  toFFN(e){
    if(e.currentTarget.dataset.type==1){
      wx.navigateTo({
        url:e.currentTarget.dataset.url+"?index="+this.data.index+"&orderData="+this.data.orderData
      })
      return
    }
    wx.navigateTo({
      url:e.currentTarget.dataset.url
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