const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.imgUrl,
    functionList:[
      { 
        name:'全部',
        type:0,
        TCData:[],
        STData:[],
        fAData:[],
        page:1,
        finsh:false,

      },
      { 
        name:'店家',
        type:5,
        TCData:[],
        STData:[],
        fAData:[],
        page:1,
        finsh:false,
      },
      { 
        name:'头疗师',
        type:6,
        TCData:[],
        STData:[],
        fAData:[],
        page:1,
        finsh:false,
      },
      { 
        name:'动态',
        type:4,
        TCData:[],
        STData:[],
        fAData:[],
        page:1,
        finsh:false,
      },
    ],
    active:0,
  },

  // 选择功能
  onChange(event) {
    this.setData({
      active:event.detail.index
    })
    console.log("2133333333333")
    console.log(this.data.active)
    this.getData()
  },
  // 
  getData(){
    let data=this.data,that=this
    console.log(data.functionList[data.active].finsh)
    if(data.functionList[data.active].finsh) return
    app.fl()
    app.fg({
      action:'GetFriendsFavorite',
      openId:app.globalData.GetMembersInfo.openId,
      // openId:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',
      pageIndex:data.functionList[data.active].page,
      pageSize:10,
      SearchText:'',
      Type:data.functionList[data.active].type,
    }).then(r=>{
      app.fh() 
      if(r.data.Status=='OK'){
        if(r.data.fAData){
          r.data.fAData.forEach(c=>{
            c.CreateDate=c.CreateDate.slice(0,10)
            c.ImageUrls=c.ImageUrls.split(',')
            data.functionList[data.active].fAData.push(c)
          })
        }
        if(r.data.TCData){
          r.data.TCData.forEach(c=>{
            data.functionList[data.active].TCData.push(c)
          })
        }
        if(r.data.STData){
          r.data.STData.forEach(c=>{
            data.functionList[data.active].STData.push(c)
          })
        }
        
        let num=(r.data.fAData?r.data.fAData.length:0)+(r.data.STData?r.data.STData.length:0)+(r.data.TCData?r.data.TCData.length:0)
        console.log(num)
        if(num<10)  data.functionList[data.active].finsh=true
        data.functionList[data.active].page++
        that.setData({
          functionList:data.functionList
        })
        console.log(this.data.functionList)
      }

    })
  },

  toFN(e){
    let data=e.currentTarget.dataset
    wx.navigateTo({
      url:data.url+'?id='+data.id
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
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
    this.getData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})