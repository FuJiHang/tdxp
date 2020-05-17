const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    post:['','','',''],
    dataInfo:{},
    imgUrl:app.imgUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
  },
  // 
  getData(){
    let data=this.data,that=this
    app.fl()
    app.fg({
      action:'GetTechnicianInfo',
      // TechnicianId:45,
      TechnicianId:app.globalData.GetMembersInfo.tcid,
    }).then(r=>{
      app.fh() 
      if(r.data.Status=='OK'){
        data.post.forEach((c,i)=>{
          data.post[i]=r.data.Data['Title'+(i+1)]
        })
        that.setData({
          dataInfo:r.data.Data,
          post:data.post,
        })
       }
      console.log(r) 
    })
  },

  submit(){
    let data=this.data,that=this

    app.fg({
      action:'CheckContentSecurity', 
      Type:0,
      FormData:data.post[0]+data.post[1]+
      data.post[2]+data.post[3]
    }).then(t=>{
      if(t.data.Status!="OK"){
        app.fa(t.data.Message)
      }else{

        app.fl()
        app.fg({
          action:'UpdateInfoTechnician',
          // openId:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',
          openId:app.globalData.GetMembersInfo.openId,
          Title1:data.post[0],
          Title2:data.post[1],
          Title3:data.post[2],
          Title4:data.post[3],
        }).then(r=>{
          app.fh() 
          if(r.data.Status=='OK'){
          setTimeout(()=>{
            wx.navigateBack({
              delta: 1
            })
          },1450)
          }
          app.fa(r.data.Message)
        })

      }
    })

    
  },

  // 
  changeFN(e){
    let index=e.currentTarget.dataset.index
    this.setData({
      ['post['+index+']']:e.detail.value,
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