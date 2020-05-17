const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked:0,
    show:false,
    bz:0,
    postList:[
      {
        name:'姓名：',
        plr:'请输入您的姓名',
        txt:'',
        val:'这是地方',
        tip:"请输入正确的姓名"

      },
      {
        name:'身份证：',
        plr:'请输入您的身份证号码',
        txt:'',
        val:'440882199612090352',
        tip:"请输入正确的身份证号码"
      },
      {
        name:'邮箱：',
        plr:'请输入您的邮箱',
        txt:'',
        val:'13555@qq.com',
        tip:"请输入正确的邮箱"
      },
      {
        name:'本人手机号码：',
        plr:'请输入您的手机号码：',
        txt:'',
        val:'13553570072',
        tip:"请输入正确的手机号码"
      },
    ],
    checkList:[
      {
        name:'大陆',
        data:'',
      },
      {
        name:'香港',
        data:'',
      },
      {
        name:'澳门',
        data:'',
      },
      {
        name:'台湾',
        data:'',
      },
      {
        name:'外籍',
        data:'',
      },
    ],
    yzm:[
      {
        val:'',
        plr:'请输入您的手机号码'
      },
      {
        val:'',
        plr:'请输入验证码'
      },
    ],
    SMS:'获取验证码',
    canClick:true,
    totalTime:45,
    imgtext:'',
    QianMinTu:'',//签名图
  },
  onChange(event) {
    console.log(event)
    this.setData({
      checked: event.currentTarget.dataset.index
    });
  },

  // 关闭
  onCloseP(){
    this.setData({
      show:false,
    })
  },
  submit(e){
    let index=e.currentTarget.dataset.index
    if(index==1){
      app.fg({
        action:''
      }).then(r=>{

      })
    }else this.onCloseP()
    console.log(e)
  },
  onOpen(){
    let data=this.data
    app.fl('正在提交数据中...')

    wx.request({
      url: app.gethsyurl+'?action=TechnicianSignContract&openId=oGsqu4qBG6Icub2iLYzI3MJGH4iQ',
      data: {
        mobile:data.postList[3].val,
        name:data.postList[0].val,
        id:data.postList[1].val,
        email:data.postList[2].val,
        area:data.checked,
        sealData:data.QianMinTu,
      },
      header:{
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success(res) {
        app.fa("签约成功！")
        setTimeout(()=>{
          wx.downloadFile({
            // 示例 url，并非真实存在
            url: res.data.Message,
            success: function (ss) {
              const filePath = ss.tempFilePath
              wx.openDocument({
                filePath: filePath,
                success: function (ss) {
                  console.log('打开文档成功')
                }
              })
            }
          })
        },1450)
        
      },
      fail(res) {
      }
    })
   

    // this.setData({
    //   show:true,
    // })
  },

  // 更新输入值
  changeI(e){
    let fuI=e.currentTarget.dataset.index,fuV=e.detail.value
    this.setData({
      ['yzm['+fuI+'].val']:fuV
    })
  },
  changeInput(e){
    console.log(e)
    let fuI=e.currentTarget.dataset.index,fuV=e.detail.value
    this.setData({
      ['postList['+fuI+'].val']:fuV
    })
  },

  returnFN(){
    wx.navigateBack({
      delta: 1
    })
  },

  // 
  toFN(){
    wx.navigateTo({
      url: "/pages/fujihang/fuWrapper/fuWrapper"
    });
  },

  everyPost(bz){
    return new Promise((resolve, reject) => {
      let data=this.data
      wx.request({
        url: app.gethsyurl+'?action=TechnicianSignContract&openId=oGsqu4qBG6Icub2iLYzI3MJGH4iQ',
        data: {
          mobile:data.postList[3].val,
          name:data.postList[0].val,
          id:data.postList[1].val,
          email:data.postList[2].val,
          area:data.checked,
          sealData:data.QianMinTu,
          Phase:bz
        },
        header:{
          "content-type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        success(res) {
          if(res.data.Status=="OK") resolve(true)
          else {
            app.fa(res.data.Message) 
            resolve(false)
          }
        }
      })
    })
   
  },

  // 获取验证码
  getSMS(){
    let data=this.data,that=this
    if(!(/^1[3|4|5|6|7|8|9][0-9]\d{4,8}$/.test(data.yzm[0].val))) return app.fa('请输入正确的手机号')
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
      //  app.fl()
      //  app.fg({
      //   action:"SendVerifyCode",
      //   Phone:data.postList[0].val,
      //   IsValidPhone:true,
      //   // openId:"oGsqu4qBG6Icub2iLYzI3MJGH4iQ",
      //   openId:app.globalData.GetMembersInfo.openId,
      //   imgCode:0
      //  }).then(r=>{
      //    app.fh()
      //    app.fa(r.data.Message)
      //  })
      }
  },
  
  getData(){
    let that=this
    app.fl()
    app.fg({  
      action:'GetContractModel',
      // openid:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',
      RoleType:1,
      openId:app.globalData.GetMembersInfo.openId,
    }).then(r=>{
      app.fh()
      if(r.data.Status=="OK"){
        that.setData({
          imgtext:r.data.Message
        })
      }
      else app.fa(r.data.Message)
    })
  },

  nextFN(){
    let data=this.data,that=this
    let s=true
    data.postList.forEach((c,i)=>{
      switch(i){
        case 0:
            if(!(/^([a-zA-Z0-9_\u4e00-\u9fa5]){2,16}$/.test(c.val))) {
              app.fa(c.tip)
              s=false
              return 
            }
        break;
        case 1:
            if(!(/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(c.val))){
              app.fa(c.tip)
              s=false
              return 
            }
        break;
        case 2:
            if(!(/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(c.val))){
              app.fa(c.tip)
              s=false
              return 
            }
        break;
        case 3:
            if(!(/^1[3|4|5|6|7|8|9][0-9]\d{4,8}$/.test(c.val))){
              app.fa(c.tip)
              s=false
              return 
            }
        break;
      }
    })
    if(!s) return
    this.everyPost()
    this.getData()
    this.setData({
      bz:1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.gethsyurl)
    wx.setStorage({
      key: 'QianMinTu',
      data: ''
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
    
    let that = this
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
    wx.getStorage({
      key:'QianMinTu',
      success:res=>{
        
        that.setData({
          QianMinTu:res.data 
        })
        if(res.data){
          that.setData({
           bz:2
          })

        }
        // this.getData(options)
      }
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