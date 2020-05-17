const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.imgUrl,
    finsh:false,
    page:1,
    dataList:[],
    seach:'',
    zxz:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      zxz:options.zxz?options.zxz:false
    })
    this.getDataR()
  },

  getData(){
    this.setData({
      finsh:false,
      page:1,
      dataList:[],
    })
    this.getDataR()
  },
  // 获取内容
  getDataR(){
    
    let data=this.data
    let that=this
    if(data.finsh) return
    let post={
      action:"Search",
      tag:"store",
      Longitude:100,
      Latitude:100,
      content:data.seach,
      Longitude:app.globalData.Longitude,
      Latitude:app.globalData.Latitude,
      pageindex:data.page,
      pagesize:10,
      bindtype:1,
    }
    if(data.zxz){
      post.exid=app.globalData.GetMembersInfo.UserId
    }else{
      post.thid=app.globalData.GetMembersInfo.UserId
    }
    
    app.fl()
    app.fg(post).then(r=>{
      app.fh()
      if(r.data.Status!="NO"){
        let datar=r.data.Models
        for(let i=0;i<datar.length;i++){
            data.dataList.push(datar[i])
        }
        if(datar.length<10){
          data.finsh=true
        }
        data.page++
        that.setData({
          dataList:data.dataList,
          finsh:data.finsh,
        })
      }else app.fa(r.data.Message)
    })
  },  
  toFN(e){
    wx.navigateTo({
      url: "/pages/fujihang/fuUpDown/fuUpDown?id="+e.currentTarget.dataset.id+"&edit=0"
    });
  },

  // 搜索字
  seaChFN(e){
    this.setData({
      seach:e.detail.value
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