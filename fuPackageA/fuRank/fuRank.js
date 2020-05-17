const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.imgUrl,
    functionList:[
      {
        name:'门店业绩',
        page:1,
        data:[],
        finsh:false,
        post:4,
      },
      {
        name:'头疗师业绩',
        page:1,
        data:[],
        finsh:false,
        post:2,
      },
    ],
    dataList:{},//
    active:0,
  },

  // 
  onChange(event) {
    this.setData({
      active:event.detail.index
    })
    this.getData()
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
           
          }
        })
      })
    }else that.getData()
      
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  // 
  getData(){
    let data=this.data,that=this
    if(this.data.functionList[this.data.active].finsh) return
    app.fl()
    app.fg({
      action: 'SalesGoalsList',
      // openId: 'oGsqu4sjArtrbwBH4G3cH_stQlXg',
      openId:app.globalData.GetMembersInfo.openId,
      SearchBy: 2,
      Role: data.functionList[data.active].post,//技师2 门店4
    }).then(r=>{
      app.fh() 
      if(r.data.Status=='OK'){

        that.setData({
          ['functionList['+data.active+'].data']:r.data.splittin_get_response,
          ['functionList['+data.active+'].finsh']:true,
        })
       }else app.fa(r.data.Message)
      console.log(r) 
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