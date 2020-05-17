// fuPackageA/fuWuLiu/fuWuLiu.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    postImg:app.newImg,
    dataInfo:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData(options.oid)
  },

  getData(id){
    let data=this.data,that=this
    app.fl()
    app.fg({
      url:'/api/VshopProcess.ashx?action=Logistic',
      data:{
        orderId:id
      }
    },true).then(r=>{
      app.fh() 
      if(r.data.Success){
        that.setData({
          dataInfo:r.data
        })
       }else app.fa(r.data.Message)
      console.log(r) 
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