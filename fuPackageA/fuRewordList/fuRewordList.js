const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:[],
    endList:[],
    startList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
    this.getDataEnd()
    this.getDataStart()
  },
  toFN(e){
    wx.navigateTo({
      url:e.currentTarget.dataset.to
    })
  },

    getData(){
      let data=this.data,that=this
      app.fl()
      app.fg({
        action: 'GetActivitylistByType',
        ActivityType: 7,
        Status:1
      }).then(r=>{
        app.fh() 
        if(r.data.Status=='OK'){
          r.data.Data.forEach(c=>{
            c.CreateDate=c.CreateDate.split('T')[0]+' '+c.CreateDate.split('T')[1]
          })
          that.setData({
            dataList:r.data.Data
          })
         }else app.fa(r.data.Message)
       
      })
    },
    getDataEnd(){
      let data=this.data,that=this
      app.fl()
      app.fg({
        action: 'GetActivitylistByType',
        ActivityType: 7,
        Status:3
      }).then(r=>{
        app.fh() 
        if(r.data.Status=='OK'){
          r.data.Data.forEach(c=>{
            c.CreateDate=c.CreateDate.split('T')[0]+' '+c.CreateDate.split('T')[1]
          })
          that.setData({
            endList:r.data.Data
          })
         }else app.fa(r.data.Message)
       
      })
    },
    // 
    getDataStart(){
      let data=this.data,that=this
      app.fl()
      app.fg({
        action: 'GetActivitylistByType',
        ActivityType: 7,
        Status:2
      }).then(r=>{
        app.fh() 
        if(r.data.Status=='OK'){
          r.data.Data.forEach(c=>{
            c.CreateDate=c.CreateDate.split('T')[0]+' '+c.CreateDate.split('T')[1]
          })
          that.setData({
            startList:r.data.Data
          })
         }else app.fa(r.data.Message)
       
      })
    },

    tipFN(){
      app.fa('该活动暂未开始！')
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
    this.data.dataList=[]
    this.getData()
    app.fl()
    setTimeout(()=>{
      app.fh()
      wx.stopPullDownRefresh()
    },3000)
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