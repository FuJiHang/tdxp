// fuPackageA/fuLive/fuLive.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    page: 1,
    finsh: false,
    show:false,
    videoList:[],
    huiPage:1,
    huiFinsh:false,
    liveId:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
  },
  getData() {
    let data = this.data, that = this
    if (data.finsh) return
    app.fl()
    app.fg({
      url: "/api/LiveInfo.ashx?action=GetTopLiveRoomList",
      data: {
        size: 10,
        index: data.page,
      }
    }, true).then(r => {
      app.fh()
      if (r.data.Status == 'true') {
        r.data.Data.liveRoom.forEach(s => {
          s.BeginTime = s.BeginTime.replace('T', '-')
          s.BeginTime = s.BeginTime.split('-')[1]+'月'+s.BeginTime.split('-')[2]+'日 '+s.BeginTime.split('-')[3]
          s.endTime = s.endTime.replace('T', '-')
          s.endTime = s.endTime.split('-')[3]
          data.dataList.push(s)
        })
        console.log(r.data.Data.liveRoom,222222);
        that.setData({
          dataList:data.dataList,
          finsh:r.data.Data.liveRoom.length<10,
          page:++data.page
        })
      } else app.fa(r.data.Message)

    })
  },

  toFN(e){
    console.log(e.currentTarget.dataset);
    // if(e.currentTarget.dataset.stu==2) return app.fa('未开播，不能观看哦！')
    if(e.currentTarget.dataset.rid)    app.globalData.roomId=e.currentTarget.dataset.rid
    wx.navigateTo({
      url:e.currentTarget.dataset.url
    })
  },

  onCloseP(){
    this.setData({
      show:false,
    })
  },

  // 
  openAlert(e){
    this.setData({
      show:true,
      liveId:e.currentTarget.dataset.id,
      videoList:[],
      huiPage:1,
      huiFinsh:false,
    })
    this.huifan()
  },

  huifan(){
    let data=this.data,that=this
    if(data.huiFinsh) return
    app.fl()
    app.fg({
      url:"/api/LiveInfo.ashx?action=GetLiveReplay",
      data:{
        liveId:data.liveId,
        size:10,
        index:data.huiPage,
      },
    },true).then(r=>{
      app.fh() 
      if(r.data.Status=='true'&&r.data.Data){
          data.videoList=[...data.videoList,...r.data.Data.Data]
        that.setData({
          videoList:data.videoList,
          huiPage:++data.huiPage,
          huiFinsh:r.data.Data.Data.length<10,
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
    this.getData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})