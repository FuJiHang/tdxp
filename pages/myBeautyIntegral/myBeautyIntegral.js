// pages/myBeautyIntegral/myBeautyIntegral.js

const app=getApp()
Page({
  data: {
    imgUrl:app.imgUrl,//
    page:1,
    finsh:false,//是否完成
    dataInfor:{},//内容
    dataList:[],//列表内容
  },

  getDataR(){
    let data=this.data
    if(data.finsh) return;
    app.fl()
    app.fg({
      action:'GetUserPoints',
      openId:app.globalData.GetMembersInfo.openId,
      pageIndex:data.page,
      pageSize:10,
      
    }).then(r=>{
      app.fh()
      if(r.errMsg=="request:ok"){
        
        data.dataInfor=r.data.userpoint_get_response
        for(let i=0;i<data.dataInfor.List.length;i++){
          data.dataList.push(data.dataInfor.List[i])
        }
        if(data.dataInfor.List.length<10){
          data.finsh=true
        }
        data.page++
        this.setData({
          dataList:data.dataList,
          dataInfor:data.dataInfor,
          page:data.page,
          finsh:data.finsh,
        })
      }
      else app.fa('获取信息失败！')
    })
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