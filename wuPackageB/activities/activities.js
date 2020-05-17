let app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    navData:[{name:'进行中'},{name:'已下架'}],
    nums:1,
    list:[
      // {
      //   logo:'抢',
      //   title:'限时抢购',
      //   test:'通过滚动转盘进行抽奖',
      //   time:'2019/11/17 22:12:09',
      //   status:true
      // },
    ],
    lists: [
      // {
      //   logo: '满',
      //   title: '满减活动',
      //   test: '引导好友一起购买',
      //   time: '2019/11/17 22:12:09',
      //   status: true
      // },
    ],
    storeid:'', //门店id
    cookie:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let storeid = wx.getStorageSync('userinfo').StoreId;
    this.referUser();
    this.setData({
      storeid: storeid || app.globalData.GetMembersInfo.StoreId
      // storeid:42,
    })
    this.getData()

  },
  // 获取个人信息
  referUser(){
    let that = this
    app.getOpenId(function(a) {
      app.fg({
        action: 'GetMembersInfo',
        openId: a
      }).then(r => {
        console.log("输出个人信息",r);
        if (r.data.Status == "OK") {
          let dataR = r.data.Data
          that.setData({
            storeid: that.data.storeid || dataR.StoreId,
            cookie:r.data.Cookie
          })
        } 
      })
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  //获取初始化数据
  getData(id,num){
    let data=this.data,that=this
    app.fl()
    app.fg({
      action:'GetActivityList',
      StoreId:data.storeid,
      Type:data.nums?1:0,
    }).then(r=>{
      app.fh() 
      this.setData({
        lists:[]
      })
      if(r.data.Status=='Success'){
        that.setData({
          lists:r.data.Message
        })
       }else app.fa(r.data.Message)
    })
   

   
  },

  upOrDown(e){
    let data=this.data,that=this,datar=e.currentTarget.dataset
    app.fl()
    app.fg({
      action:'GetActivityList',
      StoreId:data.storeid,
      Type:datar.name?3:2,
      ActivityId:datar.aid
    }).then(r=>{
      app.fh() 
      if(r.data.Status=='Success') that.getData()
      app.fa(r.data.Message)
    })
  },
 
 
  //点击nav导航栏
  handleNav(e){
    // console.log(e);
    const {index} = e.currentTarget.dataset;
    let storeid = this.data.storeid;
  
    if(index==0){
      this.setData({
        nums: index
      })
      this.getData(storeid,1)
    }else if(index==1){
      this.setData({
        nums: index
      })
      this.getData(storeid,0)
    }
    
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