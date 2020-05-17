const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    btnList: ['立即参团', '发起拼团', '邀请好友参团', '查看我的拼团'],
    dataInfo: {},
    LatiLongitude: {},
    type: 0,//0,1,2,3,4['立即参团','发起拼团','邀请好友参团','查看我的拼团']
    shareId: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = this.data, that = this
    wx.getStorage({
      key: 'LatiLongitude',
      success(res) {
        that.setData({
          LatiLongitude: res.data,
          type: options.type
        })
        if (!app.globalData.GetMembersInfo || !app.globalData.GetMembersInfo.openId) {
          app.getOpenId(function (a) {
            app.fg({
              action: 'GetMembersInfo',
              openId: a
            }).then(r => {
              if (r.data.Status == "OK") {
                let dataR = r.data.Data
                dataR.openId = a
                app.setMembersInfo(dataR)
                // that.getStroeFN(options.sid)
                that.getData(options.id)
              } else {
                wx.redirectTo({
                  url: "/pages/login/login"
                });
              }
            })
          })
        } else {
          that.getData(options.id)
          // that.getStroeFN(options.sid)
        }

      }
    })
  },

  // 
  getData(id) {
    let data = this.data, that = this
    app.fl()
    app.fg({
      action: 'GetFightGroupActivitiyDetail',
      // openId:"oGsqu4qBG6Icub2iLYzI3MJGH4iQ",
      FightGroupId: data.type == 0 ? '' : id,
      FightGroupActivityId: data.type == 0 ? id : '',
      openId: app.globalData.GetMembersInfo.openId,
    }).then(r => {
      app.fh()
      if (r.data.Status == 'OK') {
        r.data.StartDate = r.data.StartDate.slice(5, 7) + '月' + r.data.StartDate.slice(8, 10) + '日'
        r.data.EndDate = r.data.EndDate.slice(5, 7) + '月' + r.data.EndDate.slice(8, 10) + '日'
        r.data.ProductPicture = r.data.ProductPicture.split(',')[0]
        that.setData({
          dataInfo: r.data,
          shareId: id,
        })
      } else app.fa(r.data.Message)
    })
  },
  // 
  getStroeFN(id) {
    let data = this.data, that = this
    app.fl()
    app.fg({
      // action: 'GetStoreDetail',
      // storeid: 600,
      // Latitude: 23.12901,
      // Longitude: 113.2668,
      action: 'GetStoreDetail',
      storeid: id ? id : wx.getStorageSync('getStore').StoreId,
      Latitude: data.LatiLongitude.Latitude,
      Longitude: data.LatiLongitude.Longitude,
      openId: app.globalData.GetMembersInfo.openId,
    }).then(r => {
      app.fh()
      if (r.data.Status == "OK") {
        that.setData({
          getStore: r.data,
        })
      } else app.fa(r.data.Message)
    })
  },

  toFN(e) {
    let data = this.data
    let storeData = {
      StoreId: data.getStore.StoreId,
      EnvironmentImages: data.getStore.EnvironmentImages.split(',')[0],
      StoreName: data.getStore.StoreName,
      Distance: data.getStore.Distance,
      Address: data.getStore.Address,
    }
    let cartList = [{
      Deposit: 0,
      Pic: data.dataInfo.ProductPicture,
      ProductName: data.dataInfo.ProductName,
      SalePrice: data.dataInfo.FightPrice,
      ShortDescription: data.dataInfo.ProductDescription,
      ProductId: data.dataInfo.ProductId,
      FightGroupActivityId: data.dataInfo.FightGroupActivityId,
      FightGroupId: data.dataInfo.FightGroupId,
    }]
    switch (e.currentTarget.dataset.index) {
      case 0:
        wx.navigateTo({
          url: "/pages/fujihang/fuPlace/fuPlace?storeData=" + encodeURIComponent(JSON.stringify(storeData)) + "&cartList=" + encodeURIComponent(JSON.stringify(cartList)) + '&pasreAll=' + true
        })
        break;
      case 1:
        cartList[0].FightGroupId = ''
        wx.navigateTo({
          url: "/pages/fujihang/fuPlace/fuPlace?storeData=" + encodeURIComponent(JSON.stringify(storeData)) + "&cartList=" + encodeURIComponent(JSON.stringify(cartList)) + '&pasreAll=' + true
        })
        break;
      case 2:

        break;
      case 3:
        wx.navigateTo({
          url: '/fuPackageA/fuMyPuzzle/fuMyPuzzle'
        })
        break;
    }


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
    let data = this.data,id=''
    data.dataInfo.Members.forEach(c=>{
      if(c.IsFightGroupHead=='True') id=c.UserId
    })
    return {
      title: '拼团分享',
      path: `/fuPackageA/fuProductT/fuProductT?prDid=${data.dataInfo.ProductId}&storeid=${app.globalData.storeId}&isTeam=${id}`,
      success: (res) => {
        wx.showToast({
          title: '分享成功',
          icon: 'none',
          image: '',
          duration: 1500,
          mask: true,
          success: (result) => {

          },
          fail: () => { },
          complete: () => { }
        });

      },
      fail: (res) => {
      }
    }
  }
})