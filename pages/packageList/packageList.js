const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    packageListObj: {},
    PackPrice: '',
    product_id: '', // 项目id
    Latitude: '', // 经度
    Longitude: '', // 纬度
    regionid: 0, // 区域id
    nowAddress: '',
    stores: [],
    activeName: ['1'],
    checked: false,
    StoreId:-1,
    regionPath:'',
    GetstoreId:'',
  },

  onChange(event) {
    this.setData({
      activeNames: event.detail
    })
  },

  // 选择门店
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      StoreId: e.detail.value
    })
  },

  


  // 立即预约
  gotoyuyue() {
    if(this.data.stores.length==0) return getApp().fa("您当前位置没有门店可做该项目！")
    if (this.data.StoreId == -1) return getApp().fa("请先选择门店！")

    let data=this.data

    if(!app.globalData.GetMembersInfo||!app.globalData.GetMembersInfo.openId){
      
      app.fl()
      app.getOpenId(function(a) {
        app.fg({
          action: 'GetMembersInfo',
          openId: a
        }).then(r => {
          app.fh()
          if (r.data.Status == "OK") {
            let dataR = r.data.Data
            dataR.openId = a
            app.setMembersInfo(dataR)
            wx.navigateTo({
              url: '/pages/setMealOrder/setMealOrder?cartList=' +encodeURIComponent(JSON.stringify(data.packageListObj)) + '&storeData=' +  encodeURIComponent(JSON.stringify(data.stores[data.StoreId])) + '&price=' + data.PackPrice + '&projectid=' + data.product_id
            })
        
          } else {
            wx.redirectTo({
              url: "/pages/login/login"
            });
          }
        })
      })
    }else {
      wx.navigateTo({
        url: '/pages/setMealOrder/setMealOrder?cartList=' + encodeURIComponent(JSON.stringify(data.packageListObj)) + '&storeData=' +  encodeURIComponent(JSON.stringify(data.stores[data.StoreId])) + '&price=' + data.PackPrice + '&projectid=' + data.product_id
      })
  
    }
    

    
    
    
  },

  // 前往项目详情
  goparticulars(e) {
    console.log(e)
    let index = e.currentTarget.dataset.index
    console.log(this.data.packageListObj[index])
    var options = JSON.stringify(this.data.packageListObj[index])
    var projectid = this.data.packageListObj[index].Id
    this.data.stores[0].isChoose=true
    wx.navigateTo({
      url: '/pages/projectDetails/projectDetails?projectid=' + projectid + '&addressid=' + this.data.nowAddress + "&userlatitude=" + this.data.Latitude + '&userlongitude=' + this.data.Longitude+'&storeData='+encodeURIComponent(JSON.stringify(this.data.stores)),
    })
  },

  // 获取页面数据
  getListDetail: function(e) {
    var _this = this
    wx.request({
      url: getApp().gethsyurl,
      data: {
        action: 'GetPackBuyDetail',
        Latitude: this.data.Latitude,
        Longitude: this.data.Longitude,
        packid: this.data.product_id,
        // regionid: this.data.regionid,
        regionPath:this.data.nowAddress,
        storeid:this.data.GetstoreId
      },
      success: (res) => {
        wx.hideLoading()
        console.log(res)
        _this.setData({
          packageListObj: res.data.products,
          PackPrice: res.data.PackPrice,
          stores: res.data.stores
        })
      }
    })
  },


  onLoad: function(options) {
    console.log(options)
    var _this = this,
      regionid = options.addressid.split(",");
    wx.showLoading({
      title: '数据加载中...',
    })
    _this.setData({
      // regionPath:options.regionPath,
      product_id: options.projectid,
      Latitude: options.userlatitude,
      Longitude: options.userlongitude,
      nowAddress: options.addressid,
      regionid: regionid[regionid.length - 1],
      GetstoreId:options.storeId?options.storeId:''
    });
    _this.getListDetail()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})