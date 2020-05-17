const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    dataList:[],
    finsh:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
  },

  // 
  chooseFN(e){
    this.setData({
     ['dataList['+e.currentTarget.dataset.index+'].choose']:e.currentTarget.dataset.choose?false:true
    })
  },

  getData(){
    let data=this.data,that=this
    if(data.finsh) return
    app.fg({
      action:'LoadSiteCoupon',
      openId:app.globalData.GetMembersInfo.openId,
      // openId:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',
      Role:2,
      pageIndex:data.page,
      type:-1,
      PageSize:1000,
    }).then(r=>{
      if(r.data.Status=="OK"){
        r.data.Data.forEach(c=>{
          c.isDiYon=c.CouponName.indexOf('抵用')!=-1
          c.StoreHasCoupon=="True"?c.choose=true:c.choose=false
          data.dataList.push(c)
        })
        data.page++
        that.setData({
          dataList:data.dataList,
          finsh:r.data.Data.length<1000?true:false,
          page:data.page
        })
      }else app.fa(r.data.Message)
      console.log(r)
    })
  },


  // 

  submit(){
    let data=this.data
    let ids=''
    data.dataList.forEach((s,i) => {
      if(s.choose){
          if(!i) ids=s.CouponId
          else ids+=','+s.CouponId
      }
    });
    app.fg({
      action:'UserGetCoupon',
      openId:app.globalData.GetMembersInfo.openId,
      // openId:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',
      shopType:1,
      CouponIds:ids,
      appid:app.globalData.appId,
    }).then(r=>{
      if(r.data.Status=="OK"){
        
      }
      app.fa(r.data.Message)
      // console.log(r)
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
    this.getData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})