const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataInfo:{},
    imgUrl:app.imgUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData(options.tid)
  },

  // 
  getData(tcid){
    let data=this.data,that=this
    app.fl()
    app.fg({
      action:'GetTechnicianInfo',
      // TechnicianId:45,
      TechnicianId:tcid,
      gettype:2,
    }).then(r=>{
      app.fh() 
      if(r.data.Status=='OK'){

        that.setData({
          dataInfo:r.data.Data,
        })
      }else app.fa(r.data.Message)
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