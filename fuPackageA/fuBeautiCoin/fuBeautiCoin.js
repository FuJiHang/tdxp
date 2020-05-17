const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.imgUrl,
    dataList:{
      NowCoins:0,
      ActiveCoins:0,
    },
    page:1,
    finsh:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data=this.data,that=this

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
            that.getData()
          } else {
            wx.redirectTo({
              url: "/pages/login/login"
            });
          }
        })
      })
    }else{
      that.getData()
    } 
  },

  closeFN(){
    this.setData({
      ['dataList.NeedShowNum']:0
    })
  },
  // 
  getData(){
    let data=this.data,that=this
    if(data.finsh) return
    app.fl()
    app.fg({
      action: 'GetCoinsDetail',
      openId: app.globalData.GetMembersInfo.openId,
      PageIndex: data.page,
      PageSize: 10,
    }).then(r=>{
      app.fh() 
      if(r.data.Status=='OK'){
        if(data.page==1) data.dataList=r.data
        else{
          r.data.Result.Models.forEach(c=>{
            data.dataList.Result.Models.push(c)
          })
        }
        that.setData({
          page:++data.page,
          dataList:data.dataList,
          finsh:r.data.Result.Models.length<10
        })
      }else app.fa(r.data.Message)
      console.log(r) 
    })
  },

  toFN(){
    wx.navigateTo({
      url:'/pages/fujihang/fuBeaStore/fuBeaStore'
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