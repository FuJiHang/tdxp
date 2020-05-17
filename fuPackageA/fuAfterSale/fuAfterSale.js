const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.imgUrl,
    RefundReason:'',
    RefundMoney:'',
    show:false,
    dataInfo:[
      {
        name:'退款单号',
        val:'',
        data:'OrderId'
      },
      {
        name:'申请时间',
        val:'',
        data:'ApplyForTime'
      },
      {
        name:'退款金额',
        val:'',
        data:'RefundAmount'
      },
      {
        name:'订单金额',
        val:'',
        data:'PayMoney'
      },
      {
        name:'买家备注',
        val:'',
        data:'UserRemark'
      },
      {
        name:'管理员备注',
        val:'',
        data:'AdminRemark'
      },
      {
        name:'退款状态',
        val:'',
        data:'HandleStatusText'
      },
      {
        name:'退款原因',
        val:'',
        data:'RefundReason'
      },
      {
        name:'退款途径',
        val:'',
        data:'退款途径'
      },
    ],
    OrderId:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      OrderId:options.OrderId?options.OrderId:''
    })
    this.getData()
  },


  getData(){
    let data=this.data,that=this
    app.fl()
    app.fg({
      action:"GetRefundApplyDetail",
      openId:app.globalData.GetMembersInfo.openId,
      OrderId:data.OrderId,
    }).then(r=>{
      app.fh() 
      if(r.data.Status=='OK'){
        data.dataInfo.forEach(c=>{
          c.val=r.data.Data[c.data]
        })
        this.setData({
          dataInfo:data.dataInfo,
        })
      }else app.fa(r.data.Message)
      console.log(r) 
    })
  },

  // 
  appFN(){
    let data=this.data,that=this
    app.fl()
    app.fg({
      action:"SetRefundOrder",
      openId:app.globalData.GetMembersInfo.openId,
      OrderId:data.OrderId,
      IsAccept:1,
      RefundReason:data.RefundReason,
      RefundMoney:data.RefundMoney,
    }).then(r=>{
      app.fh() 
      if(r.data.Status=='OK'){
        setTimeout(()=>{
          wx.navigateBack({
            delta: 1
          })
        },1450)
       }
       app.fa(r.data.Message)
      console.log(r) 
    })
  },

  // 
  onCloseP(){
    this.setData({
      show:false
    })
  },


  // 
  inputChange(e){
    this.setData({
      [e.currentTarget.dataset.name]:e.detail.value
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