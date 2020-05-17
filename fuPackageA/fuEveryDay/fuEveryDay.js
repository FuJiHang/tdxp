const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.imgUrl,
    SMS:'获取验证码',
    canClick:true,
    totalTime:45,
    phone:'',
    yzm:'',
    username:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  changeFN(e){
    this.setData({
      [e.currentTarget.dataset.name]:e.detail.value
    })
 
 
  },

  // 获取验证码
  getSMS(){
    let data=this.data,that=this
    if(!(/^1[3|4|5|6|7|8|9][0-9]\d{4,8}$/.test(data.phone))) return app.fa('请输入正确的手机号')
      if (!data.canClick){return}
      else{
        data.canClick = false
        data.SMS = data.totalTime + 's'
        let clock =setInterval(() => {
          data.totalTime--
          data.SMS = data.totalTime + 's'
          if (data.totalTime < 0) {
            clearInterval(clock)
            data.SMS = '获取验证码'
            data.totalTime = 45
            data.canClick = true //这里重新开启
          }
          that.setData({
            canClick:data.canClick,
            SMS:data.SMS,
            totalTime:data.totalTime,
          })
        },1000)
       app.fl()
       app.fg({
        action:"SendVerifyCode",
        Phone:data.phone,
        IsValidPhone:false,
        // openId:"oGsqu4qBG6Icub2iLYzI3MJGH4iQ",
        openId:app.globalData.GetMembersInfo.openId,
        imgCode:0
       }).then(r=>{
         app.fh()
         app.fa(r.data.Message)
       })
      }
  },

  // 
  getCJ(){
    let data=this.data,that=this
    app.fl()
    app.fg({
     action:"CellPhoneVerification",
     Phone:data.phone,
     IsSetPwd:false,
     imgCode:data.yzm,
     username:data.username,
    //  openId:"oGsqu4qBG6Icub2iLYzI3MJGH4iQ",
     openId:app.globalData.GetMembersInfo.openId,
    }).then(r=>{
      if (r.data.Status == "OK") {
        wx.navigateTo({
          url:'/fuPackageA/fuLuckDraw/fuLuckDraw'
        })
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