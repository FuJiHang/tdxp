const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.imgUrl,
    chooseList:[
      {
        img:'wxzf.png',
        Code:'',
        RealName:'',
        mon:'',
      },
      {
        img:'zfbzf.png',
        Code:'',
        RealName:'',
        mon:'',
      },
    ],
    choose:0,//选择
    menoy:0,//金额
    dataInfo:{},
    Remark:'',
  },
  // 输入
  changFN(e){
    let ee=e.currentTarget.dataset,data=this.data
    let val=e.detail.value
    // if(ee.name=='mon'){

    // }else{
      
    // }
    this.setData({
      ["chooseList["+ee.index+"]."+ee.name]:val
    })
  },

  // 
  RemarkFN(e){
    this.setData({
      Remark: e.detail.value,
    })
   
  },

  // 
  bindblur(e){
    let ee=e.currentTarget.dataset,data=this.data
    let val=e.detail.value
    this.setData({
      ["chooseList["+ee.index+"]."+ee.name]:ee.name=='mon'?(val<=data.dataInfo.Balance?(val<data.dataInfo.MinimumSingleShot?data.dataInfo.MinimumSingleShot:val):data.dataInfo.Balance):val
    })
  },


  // 选择
  chooseFN(e){
  
    this.setData({
      choose:e.currentTarget.dataset.index
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
    // this.getWhen()
  },

  // getData(){
  //   let data=this.data,that=this
  //   app.fl()
  //   app.fg({
  //     action: 'SplittinList',
  //     // openid:app.globalData.GetMembersInfo.openId,
  //     openId:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',
  //     pageIndex: 1,
  //     pageSize: 10,
  //     TradeType: 0,
  //   }).then(r=>{
  //     app.fh() 
  //     that.setData({
  //       menoy:r.data.splittin_get_response.Balance
  //     })
  //   })
  // },

  // 提交
  submitFN(){
    let data=this.data,that=this
    if(data.dataInfo.MinimumSingleShot>data.dataInfo.Balance) return app.fa('最低提现金额（'+data.dataInfo.MinimumSingleShot+'元）不达标')

    app.fl()
    app.fg({
      action: 'SplittinDraw',
      // openid:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',
      openid:app.globalData.GetMembersInfo.openId,
      drawtype: data.choose+2,
      Amount: data.chooseList[data.choose].mon,
      Code: data.chooseList[data.choose].Code ,
      RealName:  data.chooseList[data.choose].RealName,
      Remark:data.Remark,
    }).then(r=>{
      app.fh()
      app.fa(r.data.Message?r.data.Message:r.data.error_response.sub_msg)
     
      setTimeout(()=>{
        that.getData()
      },1450)
    })
    
  },


  getData(){
    let data=this.data,that=this
    app.fl()
    app.fg({
      action:'GetBalanceDrawsConfig',
      // openid:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',
      openid:app.globalData.GetMembersInfo.openId,
    }).then(r=>{
      app.fh() 
      if(r.data.Status=='OK'){
        that.setData({
          dataInfo:r.data
        })
       }
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