const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getStore: {},
    midClick: false,
    LatiLongitude: {},
    active: 0,
    functionList: [{
        name: "活动说明",
      },
      {
        name: "中奖记录",
        post: 1,
        page: 1,
        data: [],
        finsh: false,
      },
    ],
    detailAction: {},
    ExAlert: false,
    getHis: [], //打卡记录
  },

  // 
  onChange(e) {
    this.setData({
      active: e.detail.index
    })
    if (this.data.active == 0) return
    this.getData()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    that.setData({
      getHis: that.getWeekDay(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(), [])

    })


    if (!app.globalData.GetMembersInfo || !app.globalData.GetMembersInfo.openId || !app.globalData.GetMembersInfo.UserId) {
      app.getOpenId(function(a) {
        app.fg({
          action: 'GetMembersInfo',
          openId: a
        }).then(r => {
          if (r.data.Status == "OK") {
            let dataR = r.data.Data
            dataR.openId = a
            app.setMembersInfo(dataR)
            wx.getStorage({
              key: 'getStore',
              success: function(r) {
                that.setData({
                  getStore: r.data
                })
                that.getHisFN()
                wx.setNavigationBarTitle({
                  title: r.data.StoreName
                })
              }
            })

          } else {
            wx.redirectTo({
              url: "/pages/login/login"
            });
          }
        })
      })
    } else wx.getStorage({
      key: 'getStore',
      success: function(r) {
        that.setData({
          getStore: r.data
        })
        that.getHisFN()
        wx.setNavigationBarTitle({
          title: r.data.StoreName
        })
      }
    })

    wx.getStorage({
      key: 'LatiLongitude',
      success(res) {
        that.setData({
          LatiLongitude: res.data
        })
      }
    })
    app.fl()
    app.fg({
      action: "GetActivityAward",
    }).then(r => {
      app.fh()
      if (r.data.Status == 'Success') {
        let getData = []
        r.data.Message.forEach(c => {
          c.StartDate ? c.StartDate = c.StartDate.slice(0, 10) : ''
          c.EndDate ? c.EndDate = c.EndDate.slice(0, 10) : ''

          getData.push(c)
        })
        that.setData({

          detailAction: getData,
        })
      }
      console.log(r)
    })

  },

  // 打卡记录
  getHisFN() {
    let data = this.data,
      that = this
    app.fl()
    app.fg({
      action: 'GetSignLog',
      UserId: app.globalData.GetMembersInfo.UserId,
      StoreId: data.getStore.StoreId
    }).then(r => {
      app.fh()
      if (r.data.Status == 'Success') {
        // new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDay()
        that.setData({
          getHis: that.getWeekDay(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(), r.data.Message.SignTimeList.split(','))

        })

      }

    })
  },


  // 当前周的月日
  getWeekDay(dateString, checkData) {
    let dateStringReg = /^\d{4}[/-]\d{1,2}[/-]\d{1,2}$/;

    if (dateString.match(dateStringReg)) {
      let presentDate = new Date(dateString),
        today = presentDate.getDay() !== 0 ? presentDate.getDay() : 7;

      return Array.from(new Array(7), function(val, index) {
        return formatDate(new Date(presentDate.getTime() - (today - index - 1) * 24 * 60 * 60 * 1000));
      });

    } else {
      throw new Error('dateString should be like "yyyy-mm-dd" or "yyyy/mm/dd"');
    }

    function formatDate(date) {
      let checkTime = date.getFullYear() + '-' + (date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-' + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())
      let a = {
        name: (date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '.' + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())
      }
      checkData.forEach(c => {
        if (c && c == checkTime) a.isTrue = true
      })

      return a;
    }
  },


  // 
  getData() {
    let data = this.data,
      that = this
    if (data.functionList[data.active].finsh) return
    app.fl()
    app.fg({
      action: 'GetAwardList',
      // openId:"os5--4mv2odIzdzHB9Gu-XjGUx2k",
      // openId:"os5--4mISw6JsRO75TSLhRgnK2PA",
      openId: app.globalData.GetMembersInfo.openId,
      PageIndex: data.functionList[data.active].page,
      PageSize: 10,
    }).then(r => {
      app.fh()
      if (r.data.Models) {
        r.data.Models.forEach(c => {
          c.AwardDate ? c.AwardDate = c.AwardDate.slice(0, 10) : ''
          data.functionList[data.active].data.push(c)
        })
        data.functionList[data.active].page++
          if (r.data.Models.length < 10) data.functionList[data.active].finsh = true
        that.setData({
          functionList: data.functionList
        })
      } else app.fa(r.data.Message)
    })
  },

  // 关闭
  closeEx() {
    this.setData({
      ExAlert: false,
    })
  },
  openEx() {
    this.setData({
      ExAlert: true,
    })
  },

  // 
  midClickFN() {
    let that = this,
      data = this.data
    this.setData({
      midClick: true,
    })
    setTimeout(() => {
      that.setData({
        midClick: false,
      })
    }, 300)
    app.fl()
    app.fg({
      action: 'ContinueSign',
      StoreId: data.getStore.StoreId,
      Location: data.LatiLongitude.Latitude + ',' + data.LatiLongitude.Longitude,
      UserId: app.globalData.GetMembersInfo.UserId,
    }).then(r => {
      app.fh()
      app.fa(r.data.Message)
      setTimeout(() => {
        if (r.data.Status != "Fail") that.getHisFN()

      }, 1450)
    })
  },

  //跳转分享二维码页面
  handleCode() {
    wx.navigateTo({
      url: '/fuPackageA/fuStroeCode/fuStroeCode',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
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
    return {
      title: data.getStore.StoreName,
      path: '/pages/fujihang/fuIndexG/fuIndexG?id=' + data.StoreId,
      imageUrl: "",
      success: (res) => {
        app.fa('转发成功')
      },
      fail: (res) => {
        app.fa('转发失败')
      }

    }
  }
})