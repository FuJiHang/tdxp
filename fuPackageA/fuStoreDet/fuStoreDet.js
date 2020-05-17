// fuPackageA/fuStoreDet/fuStoreDet.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StoreId: 0,
    LatiLongitude: wx.getStorageSync('LatiLongitude'), //经纬度
    getStore: {}, //门店信息
  },

  // 点击图标
  onClickIcon(e) {
    // type,1二维码，2转发，3地图,4电话
    let type = e.target.dataset.type,_this= this
    if(type == 1){
      wx.navigateTo({
        url: '/fuPackageA/fuStroeCode/fuStroeCode',
      })
    }else if(type == 3){
      wx.openLocation({
        latitude: _this.data.getStore.Latitude,
        longitude: _this.data.getStore.Longitude
      })
    }else if(type == 4){
      wx.makePhoneCall({
        phoneNumber: _this.data.getStore.CellPhone
      })
    }
  },

  // 获取门店详情
  getStroeFN(id) {
    let data = this.data,
      that = this
    app.fl()
    app.fg({
      url: '/AppShop/AppShopHandler.ashx?action=GetStoreInfoByStoreId',
      data: {
        storeid: id,
        Latitude: data.LatiLongitude.Latitude,
        Longitude: data.LatiLongitude.Longitude
      }
    }, true).then(r => {
      app.fh()
      if (r.data.Status == "Success") {
        wx.setNavigationBarTitle({
          title: r.data.Result.StoreName,
        })
        that.setData({
          getStore: r.data.Result,
        })
      } else app.fa(r.data.Message || '数据错误')
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this
    wx.hideShareMenu()
    wx.getStorage({
      key: 'getStore',
      success: function(r) {
        _this.setData({
          StoreId: r.data.StoreId
        })
        _this.getStroeFN(r.data.StoreId)
      },
      fail: function() {
        wx.reLaunch({
          url: '/fuPackageA/fuIndexG/fuIndexG'
        })
      }
    })
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
    let _this = this
    return {
      title: _this.data.getStore.StoreName,
      path: `pages/fujihang/fuIndexG/fuIndexG?id=${_this.data.StoreId}`,
      imageUrl: _this.data.getStore.StoreImages,
      success: function(res) {
        console.log('转发成功', res)
      }
    }
  }
})