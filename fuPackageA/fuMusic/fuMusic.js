const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    poster: 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000',
    name: '此时此刻',
    author: '许巍',
    src: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46',
    dataList:[],
    show:0,
    
  },

  chooseFN(e){
    let datar=e.currentTarget.dataset,data=this.data
    data.dataList.forEach((c,i)=>{
      if(datar.index==i) c.isChoose=!datar.choose
      else c.isChoose=false
    })
    this.setData({
      dataList:data.dataList
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
            that.getData(options)
          } else {
            wx.redirectTo({
              url: "/pages/login/login"
            });
          }
        })
      })
    }else  that.getData()

    
    

  },
  playFN(e){
    let datar=e.currentTarget.dataset.id,data=this.data
    data.dataList.forEach((c,i)=>{
      console.log(i)
      console.log(i==datar)
      if(i==datar) wx.createAudioContext(('myAudio'+datar)).play()
      else wx.createAudioContext(('myAudio'+datar)).pause()
    })

  },

  // 获取所有audios

// 暂停函数
 pauseAll() {

},

getData(){
  let data=this.data,that=this
  app.fl()
  app.fg({
    action:'GetFriendsMusic',
    openId:app.globalData.GetMembersInfo.openId
  }).then(r=>{
    app.fh() 
    if(r.data.Status=='OK'){
      that.setData({
        dataList:r.data.Data
      })
    }
  })
},



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.audioCtx = wx.createAudioContext('myAudio')
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