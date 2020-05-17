const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    finsh:false,
    page:1,
    dataList:[],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
  },

  getData(){

    let data=this.data,that=this
    if(data.finsh) return
    app.fl()
    app.fg({
      action:'GetStoreActivityCardList',
      openId:app.globalData.GetMembersInfo.openId,

      // openId:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',
      Role:0,
      PageSize:10,
      PageIndex:data.page,
    }).then(r=>{
      console.log("输出活动卡数据",r);
      app.fh() 
      // if(r.data.Status=='OK'){
        let datar=r.data.rows
        datar.forEach(c=>{
         c.EndDate=c.EndDate.split(' ')[0]
         
          data.dataList.push(c)
        })
        data.page++
        if(datar.length<10) data.finsh=true
        that.setData({
          dataList:data.dataList,
          finsh:data.finsh,
          page:data.page,
        })

      // }else app.fa(r.data.Massage)
      console.log(r) 
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