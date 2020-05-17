const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.imgUrl,
    dataList:[
      {}
    ],
    page:1,
    finsh:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data=this.data,that=this
    if(!app.globalData.GetMembersInfo||!app.globalData.GetMembersInfo.openId){
      app.getOpenId(function(a) {
        app.fg({
          action: 'GetMembersInfo',
          openId: a
        }).then(r => {
          if (r.data.Status == "OK") {
            let dataR = r.data.Data
            dataR.openId = a
            app.setMembersInfo(dataR)
            that.getData()
          } else {
            wx.redirectTo({
              url: "/pages/login/login"
            });
          }
        })
      })
    }else{
      that.getData()
    
    } 
  }, 

  // 
  getData(){
    // return
    let data=this.data,that=this
    if(data.finsh) return
    app.fl()
    app.fg({
      action:'GetAppraiseList',
      openId:app.globalData.GetMembersInfo.openId,
      PageSize:10,
      PageIndex:data.page,
      UserId:app.globalData.GetMembersInfo.UserId
    }).then(r=>{
      app.fh() 
      if(r.data.Status=='OK'){
        that.setData({
          dataList:r.data.Appraises,
          page:++data.page,
          finsh:r.data.Appraises.length<10
        })
      }else app.fa(r.data.Message)
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
  onShareAppMessage: function (res) {
    let that=this,data=this.data,datar=res.target.dataset.data
    console.log(res)
    // return
    return {
      title: datar.Appraise,
      imageUrl:datar.ThumbnailsUrl,
      path: '/pages/fujihang/fuStoreDet/fuStoreDet?id='+datar.StoreId+'isShare=true&aid='+datar.AppraiseId
    }
  }
})