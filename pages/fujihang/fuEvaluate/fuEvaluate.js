// pages/fujihang/fuEvaluate/fuEvaluate.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jsData:{},//技师信息
    orderData:{},//订单详情
    djimg:0,//评价
    textVal:'',//评价内容
    pjList:[
      {
        name:'技术:',
        val:5,
      },
      {
        name:'服务:',
        val:5,
      },
    ],//评价
    pjtu:[
      {
        name:app.imgUrl+'haoping.png',
        val:'好评',
      },
      {
        name:app.imgUrl+'zhongping.png',
        val:'中评',
      },
      {
        name:app.imgUrl+'chaping.png',
        val:'差评',
      },
      
    ],
    index:0,
  },


  // 文本书写
  changeTx(e){
    this.setData({
      textVal:e.detail.value
    })
  },

  // 提交评价
  submit(){
    let data=this.data
    app.fl()
    app.fg({
      action:"AddScore",
      appraisetype:data.djimg+1,
      orderid:data.orderData.OrderId,
      openId:app.globalData.GetMembersInfo.openId,
      SkuId:data.orderData.LineItems[data.index].SkuId,
      technicalscore:data.pjList[0].val*20,
      servicescore:data.pjList[1].val*20,
      AppraiseText:data.textVal,
      remark:data.orderData.LineItems[data.index].ProductName=='补色'?'补色':''
    }).then(r=>{
      app.fh()
      if(r.data.Status=="OK"){
        app.fa("评价成功")
        setTimeout(()=>{
          wx.navigateBack({delta: 1})
        },1200)
      }else app.fa(r.data.Message)
    })
  },

  
  // 修改评分
  changeRate(e){
    let data=this.data
    data.pjList[e.target.dataset.index].val=e.detail
    this.setData({
      pjList:data.pjList
    })
    // console.log(e)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let postD= JSON.parse(decodeURIComponent(options.orderData))
    let data=this.data
    this.setData({
      orderData:postD,
      index:options.index
    })
    console.log(data.orderData)
    app.fl()
    app.fg({
      action:'GetTechnicianInfo',
      TechnicianId:postD.LineItems[options.index].TechnicianId
      
    }).then(r=>{
      app.fh()
      if(r.data.Status=="OK"){
        data.jsData=r.data.Data
        this.setData({
          jsData:data.jsData
        })
      }else app.fa(r.data.Message)
    })
  },

  //点击图片切换
  djimgFN(e){
    
    let data=this.data
    data.djimg=e.target.dataset.index
    this.setData({
      djimg:data.djimg
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