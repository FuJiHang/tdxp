const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputList:[
      {
        val:''
      },
      {
        val:''
      },
      {
        val:''
      },
    ],
    dataList:{},
    orderS:[],
    imgUrl:app.imgUrl,
    show:false,
    regionid:'',
  },

  chang(){
    this.setData({
      show:this.data.show?false:true
    })
  },
  // 
  changeInput(e){
    
    let fuI=e.currentTarget.dataset.index,fuV=e.detail.value
    this.setData({
      ['inputList['+fuI+'].val']:fuV
    })
  },

  // 提交
  submitFN(){
    let data=this.data,that=this,name=''
    data.inputList.forEach((c,i)=>{
      if(!c.val) app.fa("请输入三个名字")
      if(!i) name=c.val
      else name+=','+c.val
    })
    app.fl()
    app.fg({
      action:"RoleRegister",
      // openId:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',
      openId:app.globalData.GetMembersInfo.openId,
      Type:'TH',
      Names:name,
      ActivityIds:data.dataList.ActivityIds,
      regionName:data.regionid
    }).then(r=>{
      app.fh()
      if(r.data.Status=="OK"){
        setTimeout(()=>{
          wx.navigateBack({
            delta: 1
          })
        },1450)
      }else app.fa(r.data.Message)
    })
  },

  getData(){
  
    let that=this,data=this.data
    if(data.finsh) return
    app.fl()
    app.fg({
      action:'SalesGoalsList',
      // openid:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',
      openId:app.globalData.GetMembersInfo.openId,
      SearchBy:1,
    }).then(r=>{
      if(r.data.Status=="OK"){
        app.fh()
        let datar=r.data.splittin_get_response
        datar.List.forEach(c=>{
          c.OrdersDate=c.OrdersDate.substring(5,10)
          data.orderS.push(c)
        })
        that.setData({
          dataList:datar,
          orderS:data.orderS
        })
      }else {
        app.fa(r.data.Message)
        setTimeout(()=>{
          wx.navigateBack({
            delta: 1
          })
        },1450)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
    let that=this
    wx.getStorage({
      key:'firstAddressId',
      success:res=>{
        that.setData({
          
          regionid:res.data,
         
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