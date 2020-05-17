const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.imgUrl,
    dataInfo:{},
    // bg:2,
    submitList:[
      {
        name:'卡名',
        val:'',
        plr:'请输入卡名'
      },
      {
        name:'价格',
        val:'',
        plr:'请输入价格'
      },
      {
        name:'次数',
        val:'',
        plr:'请输入次数'
      },
      {
        name:'有效期',
        val:'',
        plr:'请选择有效期'
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     let data=JSON.parse(decodeURIComponent(options.data))
    this.setData({
      dataInfo:data
    })
    console.log(this.data.dataInfo)
    // let data=JSON.parse(decodeURIComponent(options.data))
  
    // this.setData({
    //   dataInfo:data
    // }}
  },

  // 
  submit(){
    let data=this.data,that=this
    app.fh()
    app.fg({
      action:'UserGetStoreActivityCard',
      openId:app.globalData.GetMembersInfo.openId,
      // openId:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',
      CardId:data.dataInfo.CardId,
      appid:app.globalData.appId,
    }).then(r=>{
      app.fh()
      if(r.data.Status=="OK"){
        setTimeout(()=>{
          wx.navigateBack({
            delta: 1
          })
        },1450)
      }
      app.fa(r.data.Message)
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
    if(app.globalData.GetMembersInfo==null){
      app.getOpenId(function(a) {
        app.fg({
          action: 'GetMembersInfo',
          openId: a
        }).then(r => {
          if (r.data.Status == "OK") {
            let dataR = r.data.Data
            dataR.openId = a
            app.setMembersInfo(dataR)

         

          } else {
            wx.redirectTo({
              url: "/pages/login/login"
            });
          }
        })
      })
    }
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