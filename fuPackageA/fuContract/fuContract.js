const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    sss:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data=this.data,that=this
    this.setData({
      id:options.activityId
    })
    this.openFN()

    
  },


  openFN(){
    let data=this.data,that=this
    if(data.sss) return;
    app.getOpenId(function(a) {


      app.fl()
      app.fg({
        action:'GetActivityContract',
        activityId:data.id,
        openId:a
      }).then(r=>{
        app.fh() 
        if(r.data.Status=='OK'){
          
          wx.downloadFile({
            url: r.data.Message, //仅为示例，并非真实的资源
            success (res) {
              // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
              if (res.statusCode === 200) {
                wx.openDocument({
                  filePath: res.tempFilePath,
                  success: function (sss) {
                  }
                })
               
              }
            }
          })

        }else{
          that.setData({
            sss:true
          })
          app.fa(r.data.Message)
        } 
        
      })
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