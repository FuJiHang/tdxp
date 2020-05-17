const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that=this
    if(!app.globalData.GetMembersInfo||!app.globalData.GetMembersInfo.openId){
      app.getOpenId(function(a) {
        app.fg({
          action: 'GetMembersInfo',
          openId: a
        }).then(r => {
          if (r.data.Status == "OK") {
            let dataR = r.data.Data
            dataR.openId = a
            app.setMembersInfo(dataR)
            that.getDataR(options)
          } else {
            wx.redirectTo({
              url: "/pages/login/login"
            });
          }
        })
      })
    }else{
      that.getDataR(options)
    
    } 
  },
  getDataR(a){
    console.log(a)
    let data=this.data,that=this
    app.fl()
    app.fg({
      action:'GetOnlineReports',
      ActivityId:a.id,
      openId:app.globalData.GetMembersInfo.openId,
      Role:a.zxz,
      Type:1,
    }).then(r=>{
      app.fh() 
      if(r.data.Status=='OK'){
        // dataInfo
        r.data.splittin_get_response.Orders.forEach(c=>{
          c.OrderDate=c.OrderDate.slice(0,10)
        })
        that.setData({
          dataInfo:r.data.splittin_get_response
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