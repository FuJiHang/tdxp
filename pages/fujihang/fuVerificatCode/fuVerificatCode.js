const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    postList:[
      {
        name:'手机号：',
        plr:'请输入要绑定的手机号',
        img:'phone',
        val:'',
      },
      {
        name:'验证码：',
        plr:'请输入验证码',
        img:'coupon',
        val:'',
      },
      // {
      //   name:'输入新密码：',
      //   plr:'请输入新密码',
      //   img:'lock',
      //   val:'',
      // },
      // {
      //   name:'再次输入新密码：',
      //   plr:'请输入新密码',
      //   img:'lock',
      //   val:'',
      // },
    ],
    SMS:'获取验证码',
    canClick:true,
    totalTime:45,
    ws:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      ws:options.ws?options.ws:'',
      ['postList[0].val']:app.globalData.GetMembersInfo.CellPhone,
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  // 获取验证码
  getSMS(){
    let data=this.data,that=this
    if(!(/^1[3|4|5|6|7|8|9][0-9]\d{4,8}$/.test(data.postList[0].val))) return app.fa('请输入正确的手机号')
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
        Phone:data.postList[0].val,
        IsValidPhone:true,
        // openId:"oGsqu4qBG6Icub2iLYzI3MJGH4iQ",
        openId:app.globalData.GetMembersInfo.openId,
        imgCode:0
       }).then(r=>{
         app.fh()
         app.fa(r.data.Message)
       })


      }
  },

  // 提交
  subimt(){
    let data=this.data,that=this
    // if(data.postList[2].val.toString().trim().length<6) return app.fa("密码不能小于6位！")
    
    // Phone:data.postList[0].val,
    // IsSetPwd:true,
    // imgCode:data.postList[1].val,
    // password:data.postList[2].val,
    // repassword:data.postList[3].val,

    // app.fg({
    //   action:'CheckContentSecurity', 
    //   Type:0,
    //   FormData:data.postList[0].val+data.postList[1].val
    // }).then(t=>{
    //   if(t.data.Status!="OK"){
    //     app.fa(t.data.Message)
    //   }else{
        app.fl()
        app.fg({
        action:"CellPhoneVerification",
        Phone:data.postList[0].val,
        IsSetPwd:false,
        imgCode:data.postList[1].val,
        // password:data.postList[2].val,
        // repassword:data.postList[3].val,
        //  openId:"oGsqu4qBG6Icub2iLYzI3MJGH4iQ",
        openId:app.globalData.GetMembersInfo.openId,
        }).then(r=>{
          // console.log(r)
          app.fh()
          app.fa(r.data.Message)
          if(r.data.Status!="OK") return
          setTimeout(()=>{
            if(data.ws){
              wx.navigateTo({
                url: "/pages/PersonalInformationMember/PersonalInformationMember?ws=all"
              });
            }else{
              app.fg({
                action: 'GetMembersInfo',
                openId: app.globalData.GetMembersInfo.openId
              }).then(r => {
                if (r.data.Status == "OK") {
                  let dataR=r.data.Data
                  dataR.openId=app.globalData.GetMembersInfo.openId
                  app.setMembersInfo(dataR)
                  wx.navigateBack({
                    delta: 1
                  })
                } else {
                  wx.redirectTo({
                    url: "/pages/login/login"
                  });
                }
              })
            }      
          },1450)
        })
    //   }
    // })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  changeInput(e){
    let index=e.currentTarget.dataset.index
    this.setData({
      ["postList["+index+"].val"]:e.detail.value
    })
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