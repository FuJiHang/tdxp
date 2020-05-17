// fuPackageA/fuTeamReward/fuTeamReward.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:[],
    btn:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
    this.setData({
      btn:!app.globalData.GetMembersInfo.tcid
    })
  },


  getData(){
    let data=this.data,that=this
    app.fl()
    app.fg({
      action:'TeamOpenList',
      StoreId:app.globalData.GetMembersInfo.StoreId?app.globalData.GetMembersInfo.StoreId:'',
      Type:app.globalData.GetMembersInfo.tcid?1:0,
      TcId:app.globalData.GetMembersInfo.tcid?app.globalData.GetMembersInfo.tcid:'',
      PageIndex:1,
      PageSize:1000000
    }).then(r=>{
      app.fh() 
      if(r.data.Status=='Success'){
        r.data.Message.rows.forEach(c=>{
          c.AwardSchedule=c.AwardSchedule.split(";")
          let b={}
          c.changeAward=[]
          c.AwardSchedule.forEach(j=>{
            b={
              name:j.split(':')[0],
              val:j.split(':')[1].replace('.00','')+'%',
              // val:(j.split(':')[1].split('.')[1]&&j.split(':')[1].split('.')[1]=='00'?j.split(':')[1].split('.')[0]:j.split(':')[1])+'%',
            }
           
            c.changeAward.push(b)
          })
        })
        that.setData({
          dataList:r.data.Message.rows
        })
        console.log(r.data.Message.rows);
      }else app.fa(r.data.Message)
    })
  },

  // 
  submit(){
    let data=this.data,that=this
    app.fl()
    app.fg({
      url:'/api/WeChatApplet.ashx?action=TeamOpenSplit',
      data:{
        StoreId:app.globalData.GetMembersInfo.StoreId
      }
    },true).then(r=>{
      app.fh() 
      if(r.data.Status=='Success'){
        that.getData()
       }
       app.fa(r.data.Message)
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})