const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image:[],
    video:'',
    text:'',
    show:false,
  },

  getData(role){
    let data=this.data,that=this
    app.fl()
    app.fg({
      action:'GetHelpInfo',
      // openid:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',
      openId:app.globalData.GetMembersInfo.openId,
      role:role
    }).then(r=>{
      setTimeout(()=>{
        app.fh()
      },1450)
      
      if(r.data.Status=="OK"){
        let datar=r.data
        datar.Images.split(',').forEach(c=>{
          if(c!='') data.image.push(c)
        })
        that.setData({
          video:datar.Video,
          text:datar.Text,
          image:data.image,
        })
      }else app.fa(r.data.Message)
      console.log(r)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData(options.role)
  },
  openClose(){
    let data=this.data
    this.setData({
      show:data.show?false:true,
    })
  },
  aaaa(){
    this.setData({
      show:true,
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