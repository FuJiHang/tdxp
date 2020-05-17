const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.imgUrl,
    functionList:[
      {
        name:'发起拼团',
        page:1,
        data:[],
        finsh:false,
        post:0,
      },
      {
        name:'拼团进行中',
        page:1,
        data:[],
        finsh:false,
        post:1,
      },
      {
        name:'成功拼团',
        page:1,
        data:[],
        finsh:false,
        post:2,
      },
    ],//
    active:0,//
    regionid:'',
    StoreId:'',
  },

  // 
  onChange(event){
    this.setData({
      active:event.detail.index
    })
    this.getData()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      StoreId:options.id?options.id:''
    })
  },
 
  // 
  getData(){
    let data=this.data,that=this
    if(data.functionList[data.active].finsh) return
    app.fl()
    app.fg({
      action:'FightGroupActivitiyList',
      PageSize:10,
      PageIndex:data.functionList[data.active].page,
      openId:app.globalData.GetMembersInfo.openId,
      // openId:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',
      type:data.functionList[data.active].post,
      RegionId:data.regionid.split(',')[2],
      // RegionId:1947,
      StoreId:data.StoreId,
    }).then(r=>{
      console.log("输出拼团列表数据",r);
      app.fh() 
      if(r.data.Status!="NO"){
        let datar=r.data.Models
        datar.forEach(c=>{
          // c.ProductPicture=c.ProductPicture.split(',')[0]
          data.functionList[data.active].data.push(c)
        })
        data.functionList[data.active].page++
        if(datar.length<10) data.functionList[data.active].finsh=true
        that.setData({
          functionList:data.functionList
        })
      }else app.fa(r.data.Message)
    })
  },

  // 
  toFN(e){
    // console.log(e.currentTarget.dataset.sid?e.currentTarget.dataset.sid:e.currentTarget.dataset.id)
    // wx.navigateTo({
    //   url:'/fuPackageA/fuCollageDet/fuCollageDet?id='+(e.currentTarget.dataset.gid?e.currentTarget.dataset.gid:e.currentTarget.dataset.id)
    //   +'&type='+this.data.active+"&sid="+(e.currentTarget.dataset.sid)
    // })
    const { productid } = e.currentTarget.dataset; //商品id和门店id
    console.log("输出商品id", productid);
    wx.navigateTo({
      url: `/fuPackageA/fuProductT/fuProductT?prDid=${productid}`,
    })
    wx.setStorageSync("buyType", "fightgroup")
  
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
    let that=this
    wx.getStorage({
      key:'firstAddressId',
      success:res=>{
        that.setData({
          regionid:res.data,
        })
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
        }else {
          that.getData()
        } 
      }
    })
    
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