const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.imgUrl,
    functionList:[
      {
        name:'被领取',
        finsh:false,
        page:1,
        data:[],
        post:0,
      },
      {
        name:'已设置',
        finsh:false,
        page:1,
        data:[],
        post:1,
      },
    ],
    Role:1,//身份 0用户1店主
    seach:'',
    active:0,
  },

  // 
  // 搜索字
  seaChFN(e){
    this.setData({
      seach:e.detail.value
    })
  },
  // 
  onChange(event) {
    this.setData({
      active:event.detail.index
    })
    this.getData()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
  },

  // 
  chooseFN(e){
    let data=e.currentTarget.dataset.data,that=this
    if(this.data.active){
      wx.navigateTo({
        url:'/fuPackageA/fuActionCard/fuActionCard?data='+encodeURIComponent(JSON.stringify(data))
      })
      return
    }
    wx.showModal({
      title: '提示',
      content: '确定减少顾客使用次数吗？',
      success (res) {
        if (res.confirm) {
          app.fl('正在操作，请等待')
          app.fg({
            action:'EditStoreActivityCard',
            openId:app.globalData.GetMembersInfo.openId,

            // openId:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',
            CardId:data.CardId,
            UpdateType:2,
            EndDate:data.EndDate,
            UserId:data.UserId,
          }).then(r=>{
            app.fh() 
            app.fa(r.data.Message)
            if(r.data.Status=='OK'){
                setTimeout(()=>{
                  that.getDataS()
                },1450)
             }
          })
        } 
      }
    })
  },
  // 
  getDataS(){
    let data={
      name:'被领取',
      finsh:false,
      page:1,
      data:[],
      post:0,
    }
    this.setData({
      ['functionList[0]']:data
    })
    this.getData()
  },

  // 
  getData(){

    let data=this.data,that=this
    if(data.functionList[data.active].finsh) return
    app.fl()
    app.fg({
      action:'GetStoreActivityCardList',
      // openId:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',
      openId:app.globalData.GetMembersInfo.openId,
      Role:data.Role,
      SearchType:data.functionList[data.active].post,
      PageSize:10,
      PageIndex:data.functionList[data.active].page,
      keyWord:data.active==0?data.seach:''
    }).then(r=>{
      app.fh() 
      // if(r.data.Status=='OK'){
        let datar=r.data.rows
        datar.forEach(c=>{
          if(data.Role==0) c.EndDate=c.EndDate.split(' ')[0]
          else c.EndDate=c.CloseTime.split(' ')[0]
          
          data.functionList[data.active].data.push(c)
        })
        data.functionList[data.active].page++
        if(datar.length<10) data.functionList[data.active].finsh=true
        that.setData({
          functionList:data.functionList
        })

      // }else app.fa(r.data.Massage)
      console.log(r) 
    })
  },

  // 
  toFN(){
    wx.navigateTo({
      url:'/fuPackageA/fuActionCard/fuActionCard'
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
    // this.getData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})