const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    seach:'',
    active:0,
    imgUrl:app.imgUrl,
    page:1,
    dataList:[],
    finsh:false,
  },

  // 搜索字
  seaChFN(e){
    this.setData({
      seach:e.detail.value
    })
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
    app.fl()
    app.fg({
      action:"Search",
      tag:"store",
      // Longitude:113.2668,
      // Latitude:23.129010,
      content:data.seach,
      Longitude:app.globalData.Longitude,
      Latitude:app.globalData.Latitude,
      pageindex:data.page,
      pagesize:10,
      bsid:app.globalData.GetMembersInfo.UserId,
      // bsid:316
      // thid:297
    }).then(r=>{
      console.log(r)
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
          finsh:data.finsh,
          dataList:data.dataList
        })
      }else app.fa(r.data.Message)
    })
  },  

  onChange(event) {
    this.setData({
      active:event.detail.index
    })
    this.getDataR()
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDataR()
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