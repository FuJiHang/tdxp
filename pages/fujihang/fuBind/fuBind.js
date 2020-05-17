const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.imgUrl,
    teachTDZ:[
      {
        name:'执行团队长',
        val:'',
        plr:'请选择执行团队长',
        id:'',
      },
      {
        name:'电话',
        val:'',
        plr:'无',
      },
    ],//技师名字，团队长
    show:false,
    getZxtdz:[],//执行团队长列表
    textarea:'',
    seach:'',
  },
  // 搜索字
  seaChFN(e){
    this.setData({
      seach:e.detail.value
    })
  },
  seachZXT(){
    this.setData({
      getZxtdz:[]
    })
    this.getZxtdzFN()
  },

  Submit(){
    let data=this.data
    app.fg({
      action:'RoleRegister',
      Type:'TC',
      openId:app.globalData.GetMembersInfo.openId,
      // openId:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',
      RequetReason:data.textarea,
      HeadId:data.teachTDZ[0].id,
      requesttype:1,
    }).then(r=>{
      app.fa(r.data.Message)
      if(r.data.Status=="OK"){
        setTimeout(()=>{
          wx.navigateBack({
            delta: 1
          })
        },1450)
      }
    })
  },

  // 获取执行团队长列表
  getZxtdzFN(){
    let that=this
    // if(this.data.teachTDZ[1].val.length!=3) return app.fa("您还没选择区域")
    app.fl()
    app.fg({
      content:this.data.seach,
      action:'GetTechnicianHeadsList',
      // regionName:that.data.getAddressId
      regionName:'',
    }).then(r=>{
      app.fh()
      that.setData({ show: true });
      if(r.errMsg=="request:ok"){
        that.setData({
          getZxtdz:r.data.rows
        })
      }
    })
  },

  //关闭执行团队长列表
  onClose(){
    this.setData({ show: false });
  },


  // 选择团队长
  chooseTDZ(e){
    let index=e.currentTarget.dataset.index
    let data=this.data
    data.teachTDZ[0].val=data.getZxtdz[index].RealName
    data.teachTDZ[0].id=data.getZxtdz[index].UserId
    data.teachTDZ[1].val=data.getZxtdz[index].CellPhone
    this.setData({
      teachTDZ:data.teachTDZ,
      show:false
    })
  },

  textAreaFN(e){
    this.setData({
      textarea:e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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