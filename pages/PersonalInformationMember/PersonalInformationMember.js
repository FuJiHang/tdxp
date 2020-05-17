// pages/PersonalInformationMember/PersonalInformationMember.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ws:false,//身份申请的跳转
    fujihangT:false,
    region: ['请选择省市区'],
    imageURl: '',
    imageRight: app.imgUrl + 'arrow_right.png',
    imgurl:'',//图片的选择地址,上传参数
    gender:'请选择性别',
    checkBirthday:'请选择生日',//2014-04-15格式
    userQQval:'',//提交参数
    usergender:0,//提交参数
    birthdayTime:'',//提交参数//时间戳格式
    checkAddress:'',//选择地区
    detailedAddress:'',
    canWrite:true,
    phoneNumber:'',//客户手机号码
    idCard:'',//身份证
    show: false,
    showGender:false,
    minHour: 10,
    maxHour: 20,
    minDate: new Date(1900,10,1).getTime(),
    maxDate: new Date(2019, 10, 1).getTime(),
    currentDate: new Date().getTime(),
    show: false,
    ReceivingAccount:'',//支付包
    BankName:'',//开户行
    BankAccountName:'',//	开户名
    BankAccountNo:'',//银行卡号
    CellPhoneVerification:false,//是否绑定手机号
    fromdata: [{
        title: '昵称',
        val: '',
        placeholder: '请输入昵称',
        inputval:''//提交参数
      },
      {
        title: '姓名',
        val: '',
        placeholder: '请输入真实姓名',
        inputval: ''//提交参数
      }
    ]
  },
  onInput(event) {//时间选择器改变的时候
    console.log(event)
    this.setData({
      currentDate: event.detail
    });
  },
  showTime(){//显示时间选择器
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
  xingbie(){//点击性别
  var that = this
    wx.showActionSheet({
      itemList: ['男', '女'],
      success(res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0){//选择男性
          that.data.usergender = 1
          that.setData({
            gender:'男'
          })
        } else if (res.tapIndex == 1){
          that.data.usergender = 2
          that.setData({
            gender: '女'
          })
        }
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  onCloseGender(){
    this.setData({ showGender: false });
  },
  datesure(e){
    console.log(e,'确定')
    this.setData({ show: false });
    var data = e.detail,nowData
    this.data.birthdayTime = data
    function timetrans(date) {
      var date = new Date(date);//如果date为13位不需要乘1000
      var Y = date.getFullYear() + '-';
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
      var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
      var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
      var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
      return Y + M + D ;
    }
    nowData = timetrans(data)
    this.setData({//重新渲染选择的时间
      checkBirthday: nowData
    })
    console.log(nowData)
  },
  datacencel(){

    this.setData({ show: false });
  },
  xiangxidizhi(e){//详细地址的监听
    console.log(e.detail.value)
    this.data.detailedAddress = e.detail.value

  },
  bindRegionChange(e) {//省市区选择结束
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let fuAdd=''
    for(let i=0;i<e.detail.value.length;i++){
      if(i==0){
        fuAdd=e.detail.value[i]
        continue 
      }
      fuAdd+=','+e.detail.value[i]
    }
    this.data.checkAddress = fuAdd
    this.setData({
      region: e.detail.value
    })
  },
  weachinput(e){//监听输入框的输入内容
    // index   0 表示昵称  1 表示输入名字
    var index = e.currentTarget.dataset.index, value = e.detail.value, that = this, inputval
    that.data.fromdata[index].inputval = value
    console.log(that.data.fromdata)
    // 无需渲染
  },
  watchQQ(e){//监听qq的输入框的值
    this.data.userQQval = e.detail.value
  console.log(e)
  },
  watchPhone(e) {//监听qq的输入框的值
    this.data.phoneNumber = e.detail.value
    console.log(e)
  },
  watchIdcard(e){
    this.data.idCard = e.detail.value
    console.log(e)
  },
  commitUserMsg(){
    var that = this.data,_this = this//性别,生日,地区
    console.log('点击保存,即提交表单')
    console.log(that.usergender)
    console.log(that.checkBirthday)
    console.log(that.checkAddress)
    if (that.usergender == '' || that.checkBirthday == '' || that.checkAddress ==''){
      console.log('表单信息不全')
      wx.showModal({
        title: '提示',
        content: '请您输入性别,生日,地区',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }else{
      _this.tijiao();
    }
    
  },





  tijiao(){
    var that = this.data,_this=this
    if(!that.fromdata[0].inputval) return app.fa("昵称不能为空！")
    if(!that.checkBirthday) return app.fa("生日不能为空！")
    if(!that.phoneNumber) return app.fa("手机号不能为空！")
    if(that.ws&&!that.fromdata[1].inputval) return app.fa("姓名不能为空！")
    if(that.ws&&!that.idCard) return app.fa("身份证不能为空！")
    if(!that.checkAddress) return app.fa('地区不能为空！')
    // app.fg({
    //   action:'CheckContentSecurity', 
    //   Type:0,
    //   FormData:that.fromdata[0].inputval+that.fromdata[1].inputval+
    //   that.usergender+that.checkBirthday+that.detailedAddress+that.idCard
    //   +that.phoneNumber+that.ReceivingAccount+that.BankName+that.BankAccountName
    //   +that.BankAccountNo
    // }).then(t=>{
    //   if(t.data.Status!="OK"){
    //     app.fa(t.data.Message)
    //   }else{
        app.fl()
        wx.request({
          url: app.gethsyurl,
          data: {
            action: "UpdateInformationMember",
            // openId: 'oGsqu4kr4cw0lP0vIV5sTDoxa66k',
            openId:app.globalData.GetMembersInfo.openId,
            gender: that.usergender,
            birthday: that.checkBirthday,
            QQ: that.userQQval,
            MSN: that.fromdata[0].inputval,  //用户昵称
            picture: that.imageURl,//头像路径
            RegionId: that.checkAddress,//选择的地区的区
            Address: that.detailedAddress,//详细地址
            perDescribe: '',//个人描述
            IdentityCard: that.idCard,//身份证id
            CellPhone: that.phoneNumber,//客户手机号码
            RealName: that.fromdata[1].inputval,
            ReceivingAccount:that.ReceivingAccount,
            BankName:that.BankName,
            BankAccountName:that.BankAccountName,
            BankAccountNo:that.BankAccountNo,
          },
          success:function(res){
            app.fh()
            app.fa(res.data.Message)
            if (res.data.Status == 'OK'){
              if(that.ws){
                  app.fg({
                    action: 'GetMembersInfo',
                    openId: app.globalData.GetMembersInfo.openId
                  }).then(r => {
                    if (r.data.Status == "OK") {
                      let dataR=r.data.Data
                      dataR.openId=app.globalData.GetMembersInfo.openId
                      app.setMembersInfo(dataR)
                      wx.navigateTo({
                        url:'/pages/fujihang/fuIdentity/fuIdentity'
                      });
                    } else {
                      wx.redirectTo({
                        url: "/pages/login/login"
                      });
                    }
                  })
                return
              }
              
              // _this.getdata()
              if(_this.data.fujihangT){
                wx.navigateBack({
                  delta: 1
                });
                return
              }
              setTimeout(function(){
                wx.switchTab({
                  url: '/pages/mine/mine'
                })
              },1000)
              
            }
          }
        }
        )
    //   }
    // })

    
  },
  getimg(){
    var that = this
    wx.chooseImage({
      count: 1,  //最多可以选择的图片总数  
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        var imgurl = res.tempFilePaths[0]
        wx.uploadFile({
          url: app.getUrl('UploadAppletImage'),
          filePath: imgurl,
          name: 'file',
          formData:{
            appid:app.globalData.appId,
            // openId: 'oGsqu4kr4cw0lP0vIV5sTDoxa66k'
            openId:app.globalData.GetMembersInfo.openId,
          },
          success:function(r){
            // console.log(r)
            let resData = JSON.parse(r.data)
            console.log(resData)
            if (resData.Status == "OK"){
              var okimgurl = resData.Data[0].ImageUrl
              that.setData({
                imageURl: okimgurl
              })
            }else{
              wx.showModal({
                title: '提示',
                content: "头像上传失败",
              })
            }
          }
        })
        console.log(res.tempFilePaths[0])
      },
    })
  },
  getdata(){
    var that = this 
    console.log('获取数据')
    wx.request({
      url: app.gethsyurl, 
      data:{
        action:'GetMembersInfo',
        // openId:'oGsqu4kr4cw0lP0vIV5sTDoxa66k'
        openId:app.globalData.GetMembersInfo.openId,
      },
      success:function(res){
        console.log(res.data.Status == "OK")
        if (res.data.Status == "OK"){
          // let data = that.data
          var userMsg = res.data.Data
          if (userMsg.Address) {
            var nowarr = userMsg.Address.split(" "), l = nowarr.length - 2
            that.data.checkAddress = nowarr[1]+','+nowarr[2]+','+nowarr[3]
            that.data.detailedAddress = nowarr[nowarr.length - 1]
            console.log(that.data.checkAddress)
            if (nowarr[1]){
              that.data.region[0] = nowarr[1]
            // } else if (nowarr[2]){
              that.data.region[1] = nowarr[2]
            // } else if (nowarr[3]){
              that.data.region[2] = nowarr[3]
            } 
          }else {
            that.data.checkAddress = userMsg.Address
          }
          that.setData({
            ReceivingAccount:userMsg.ReceivingAccount,
            BankName:userMsg.BankName,
            BankAccountName:userMsg.BankAccountName,
            BankAccountNo:userMsg.BankAccountNo,
            region: that.data.region
          })
          console.log(userMsg)
          console.log(userMsg.NickName)
          console.log(userMsg.RealName)
          if (userMsg.RealName){
            that.data.canWrite = true
          }else{
            that.data.canWrite = false
          }
          console.log(userMsg.Gender)
          console.log(userMsg.BirthDate)
          console.log(userMsg.Picture)
          console.log(userMsg.QQ)
          
          that.data.fromdata[0].inputval = userMsg.NickName, that.data.fromdata[1].inputval = userMsg.RealName, that.data.usergender = userMsg.Gender, that.data.checkBirthday = userMsg.BirthDate, that.data.imageURl = userMsg.Picture
          that.data.userQQval = userMsg.QQ, that.data.phoneNumber = userMsg.CellPhone
          that.data.idCard = userMsg.IdentityCard
          if(userMsg.Gender == 0){//判断客户的性别展示
            that.data.gender = "请选择性别"
          } else if (userMsg.Gender == 1){
            that.data.gender ="男"
          } else if (userMsg.Gender == 2){
            that.data.gender = "女"
          }
          console.log(that.data)
          console.log(that.data.fromdata[1].inputval,'用户姓名')
         
          console.log(that.data.fromdata[0].inputval)
          that.setData({
            CellPhoneVerification:userMsg.CellPhoneVerification,
            canWrite: that.data.canWrite,
            fromdata: that.data.fromdata,
            phoneNumber: that.data.phoneNumber,
            idCard: that.data.idCard,
            usergender: that.data.usergender,
            gender: that.data.gender,
            checkBirthday: that.data.checkBirthday,
            userQQval: that.data.userQQval,
            region: that.data.region,
            imageURl: that.data.imageURl,
            detailedAddress: that.data.detailedAddress,
          })
        }
      }
    })
  },
  // 身份证银行卡等等
  changeInput(e){
    let name=e.currentTarget.dataset.name
    this.setData({
      [name]:e.detail.value
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      fujihangT:options.fujihangT?true:'',
      ws:options.ws?options.ws:''
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getdata();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})