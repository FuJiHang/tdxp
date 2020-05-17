const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/sade.jpg',
    imgUrl:app.imgUrl,//
    newImg: app.newImg,
    hexiao:'',//核销码
    orderData:{},//订单信息
    refar:false,//
    addOrsub:'+',
    couponId:{
      id:0,
      pic:0,
    },//优惠券
    tea:0,//tea==0?门店：技师
    showCou:false,
    openPic:false,
    addPrice:[
      {
        name:'金额',
        val:'',
        plr:'点击左边的按钮切换加价减价',
      },
      {
        name:'申请理由',
        val:'',
        plr:'请输入申请理由',
      },
    ],
    navData:[{name:'店家预约单'},{name:'店家自提单'}],
    nums:0, //nav导航栏默认值
    date: '2019.11.01',
  },
  changeType(){

    this.setData({
      addOrsub:this.data.addOrsub=="+"?'-':'+'
    })
  },
  openPicFn(){
    this.setData({
      openPic:true
    })
  },
  onClosePic(){
    this.setData({
      openPic:false
    })
  },
  bindpic(e){
    let index=e.currentTarget.dataset.index
    this.setData({
      ["addPrice["+index+"].val"]:e.detail.value
    })
  },
  okPriFN(){
    let data=this.data,that=this
    let addpricePD=parseFloat(data.addOrsub+data.addPrice[0].val)
    console.log(addpricePD)
    if( data.orderData.OrderTotal+addpricePD<200) return app.fa('不能低于200元')
    app.fl()
    app.fg({
      action:'TechnicianPromotePrice',
      orderid:data.orderData.OrderId,
      PromotePrice:addpricePD,
      PromoteReason:data.addPrice[1].val,
      // openId:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ'
      openId:app.globalData.GetMembersInfo.openId,
    }).then(r=>{
      that.setData({
        openPic:false,
      })
      app.fh()
      setTimeout(()=>{
        that.hexiaoFN()
      },1450)
      app.fa(r.data.Message)
    })
  },

  // 选择优惠券
  coupon(){
    let that=this
    wx.showModal({
      title: '警告',
      content: '一旦选择优惠券,用户将不能使用电子券', 
      success(res) {
        if (res.confirm) {
          wx.navigateTo({
            url:'/pages/fujihang/fuCoupon/fuCoupon?price='+that.data.orderData.OrderTotal+"&type=1"
          })
        }
      }
    })
  },

  // input更新
  inputeidt(e){
    let val=e.detail.value
    this.setData({
      hexiao:val
    })
  },
  // 请求核销
  hexiaoFN(){
    let that=this
    app.fl() 
    app.fg({
      action:'ConfirmVerificationCode2',
      verificationcode:this.data.hexiao,
      openId:app.globalData.GetMembersInfo.openId,
      // verificationcode:511261001,
      // openId:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ'
    }).then(r=>{
      app.fh()
      if(r.data.Status=="OK"){
        that.setData({
          orderData:r.data.Data,
          refar:true,
        })
        if(r.data.Data.Deposit==0.00) this.refateFN()
      }else app.fa(r.data.Message)
     
      
      // if(r.data.Status=="success") app.fa("核销成功！")
      // else app.fa('核销失败！')
    })
  },

  // 刷新
  refateFN(){
    app.fl()
    app.fg({
      action:'ConfirmVerificationCode',
      verificationcode:this.data.hexiao,
      // openId:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ'
      openId:app.globalData.GetMembersInfo.openId,
    }).then(r=>{
      app.fh()
      app.fa(r.data.Message)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setStorage({
      key:"couponId",
      data:{
        id:0,
        pic:0,
      },
    })
    this.setData({
      tea:options.tea?options.tea:0
    })
  },

  // 选择优惠
  fuCouRefter(){
    let data=this.data,that=this
    app.fl()
    app.fg({
      action:'TechnicianUseCoupon',
      openid:app.globalData.GetMembersInfo.openId,
      OrderId:data.orderData.OrderId,
      ClaimCode:data.couponId.id
    }).then(r=>{
      app.fh()
      if(r.data.Status=="OK") that.hexiaoFN()
      else app.fa(r.data.Message)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  // 优惠券
  couponOP(){
    this.setData({
      showCou:true,
    })
  },
  onCloseCou(){
    this.setData({
      showCou:false,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that=this
    wx.getStorage({
      key:'couponId',
      success:r=>{
        console.log(r.data)
        that.setData({
          couponId:r.data
        })
        if(r.data.pic==0) return
        that.fuCouRefter()
        // that.
      }
    })
  },

  //wjx点击nav导航栏
  handleNav(e){
    console.log(e);
    const { index } = e.currentTarget.dataset;
    this.setData({
      nums:index
    })
  },
  //wjx时间选择器
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let newTime = e.detail.value;
    let nemtime = newTime.replace(/-/g,'.')
    
    this.setData({
      date: nemtime
    })
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