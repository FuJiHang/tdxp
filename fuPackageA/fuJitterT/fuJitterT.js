// fuPackageA/fuJitterT/fuJitterT.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    start:0,
    wH:0,
    top:0,
    sTop:0,
    show:0,
    showTH:6
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      wH:wx.getSystemInfoSync().windowHeight
    })
  },

  // 
  // changeFN(e){
  //   this.setData({
  //     showTH:e.detail.current
  //   })
  //   console.log(e,'222222222');
  // },

  // 
  finshFN(e){
    this.setData({
      showTH:e.detail.current
    })
    console.log(e);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  touchStart(e){

    this.setData({
      start:e.changedTouches[0].clientY
    })
  },
  touchEnd(e){
    let data=this.data,that=this


    let mi=parseInt(data.top/data.wH)
    if((e.changedTouches[0].clientY-this.data.start)<-150){
      
      mi++
    this.toNext(mi*data.wH)
    }else if(150>(e.changedTouches[0].clientY-this.data.start)&&(e.changedTouches[0].clientY-this.data.start)>-150){
      this.toNext(mi*data.wH)
    }else{
     mi--
      this.toNext(mi*data.wH)
    }
    setTimeout(()=>{
      that.setData({
        show:mi
      })
    },300)
  },

  onPageScroll:function(e){
    this.setData({
      top:e.scrollTop
    })
  },

  toNext(mi){

      wx.pageScrollTo({
        scrollTop:mi,
        duration:200
      })


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