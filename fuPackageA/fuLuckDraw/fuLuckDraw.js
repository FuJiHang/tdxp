const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    dataList: [],
    time: 0,
    animationData: {},
    AwardGrade: {
      alert: false,
      index: 0,
    },
    imgAlert: [
      "yideng.png",
      "erdeng.png",
      "sandeng.png",
      "sideng.png",
      "wudeng.png",
      "liudeng.png",
    ],
    dataInfo: 0,
    windowHeight: 0,
    share: {},//分享数据
    getList: [],
    logoUser: '',
    LatiLongitude: {},
    Points:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.getStorage({
      key: 'LatiLongitude',
      success(res) {
        that.setData({
          LatiLongitude: res.data
        })
      }
    })

    if (options.fOpenId) {
      app.getWxUserInfo(function (f) {
        wx.request({
          url: app.getUrl("QuickLogin"),//
          data: {
            openId: f.openId,//微信返回的用户id
            nickName: f.nikeName,
            unionId: f.unionId,
            headImage: f.headImage,
            encryptedData: f.encryptedData,
            session_key: f.session_key,
            iv: f.iv,
            referralUserId: options.fOpenId,//上级id
            IsShareFromLotteryActivity: 1,
            Latitude: that.data.LatiLongitude.Latitude,
            Longitude: that.data.LatiLongitude.Longitude,
            unionid: app.globalData.unionid

          }
        })
      })
    }



    this.getData()
    this.setData({
      Points:app.globalData.GetMembersInfo.Points
    })
  },
  colseFN() {
    this.setData({
      ['AwardGrade.alert']: false
    })
  },



  getData() {
    app.fl()
    app.fg({
      action: 'GetActivitylistByType',
      PageIndex: 1,
      PageSize: 10,
      ActivityType:1,
      StoreId:wx.getStorageSync("getStore").StoreId,
    }).then(c => {
      app.fh()
      if (c.data.Status == "OK") {
        this.getDelect(c.data.Data[0].ActivityId)
        this.setData({
          share: c.data.Data[0]
        })
      } else app.fa(c.data.Message)
    })
  },

  getDelect(s) {
    let data = this.data, that = this
    app.fl()
    app.fg({
      action: 'GetActivityInfo',
      ActivityId: s,
    }).then(r => {
      app.fh()
      if (r.data.Status == 'OK') {
        let a = 6 - r.data.Data.AwardList.length
        for (let i = 0; i < a; i++) {
          r.data.Data.AwardList.push({ AwardName: '谢谢惠顾' })
        }
        r.data.Data.AwardList.forEach(c => {
          if (c.AwardGrade == "六") c.AwardPic = app.imgUrl + 'meihuibi061.png'
        })
        that.setData({
          dataList: r.data.Data.AwardList
        })
      }
    })
  },




  donHua(c, d) {
    var animation = wx.createAnimation({
      duration: c * 1000,
      timingFunction: 'ease',
    })
    this.animation = animation

    animation.rotate(360 * c + d).step()

    this.setData({
      animationData: animation.export()
    })
  }, 

  submit() {
    let data = this.data, that = this
    if (data.Points <= 0) return app.fa('没有积分抽奖哦')
    if (data.time) return
    app.fl()
    app.fg({
      action: 'ActivityDraw',
      ActivityId: 19,
      openId: app.globalData.GetMembersInfo.openId,
      StoreId:wx.getStorageSync("getStore").StoreId,
 
    }).then(r => {
      app.fh()
      that.setData({
        time: that.randomNum(1, 5)
      })
      if (r.data.Status == 'OK') {
        that.donHua(data.time, (r.data.AwardGrade - 1) * -60)
        setTimeout(() => {

          this.setData({
            animationData: {},
            time: 0,
            dataInfo: --data.dataInfo,
            Points:data.Points-=data.share.ConsumptionIntegral,
          })

          if (r.data.AwardGrade > 0) {
            let aaa = {
              alert: true,
              index: r.data.AwardGrade - 1
            }
            that.setData({
              AwardGrade: aaa
            })
          } else app.fa(r.data.Message)
          // app.fa(r.data.Message)
        }, data.time * 1000)
      } else {
        this.setData({
          animationData: {},
          time: 0,
        })
        app.fa(r.data.Message)
      }
    })
  },

  // 生成随机数
  randomNum(minNum, maxNum) {
    switch (arguments.length) {
      case 1:
        return parseInt(Math.random() * minNum + 1, 10);
        break;
      case 2:
        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
        break;
      default:
        return 0;
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
    let that = this, data = this.data

    app.getOpenId(function (a) {
      app.fg({
        action: 'GetMembersInfo',
        openId: a
      }).then(r => {
        if (r.data.Status == "OK") {
          let dataR = r.data.Data
          dataR.openId = a
          app.setMembersInfo(dataR)
          that.setData({
            logoUser: dataR.Picture,
            dataInfo: (dataR.FreeLuckDraw + dataR.BuyLuckDraw)
          })

          app.fl()
          app.fg({
            action: 'GetAwardList',
            IsALL: true,
            openId: app.globalData.GetMembersInfo.openId,
            StoreId:wx.getStorageSync("getStore").StoreId,
          }).then(r => {
            app.fh()
            that.setData({
              getList: r.data.Models
            })
          })
          wx.getSystemInfo({
            success: function (res) {
              that.setData({
                windowHeight: res.windowHeight * 0.9
              })

            },
          })
        } else {
          wx.redirectTo({
            url: "/pages/login/login"
          });
        }
      })
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
  toFN() {
    wx.switchTab({
      url: "/pages/fujihang/fuIndexG/fuIndexG"
    });
  },

  toFNList() {
    wx.navigateTo({
      url: '/fuPackageA/fuPrizeList/fuPrizeList'
    })
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
    let data = this.data
    console.log(data.share)
    return {

      title: data.share.ShareDetail,        // 默认是小程序的名称(可以写slogan等)
      path: '/fuPackageA/fuLuckDraw/fuLuckDraw?fOpenId=' + app.globalData.userInfo.UserId,
      imageUrl: data.share.SharePic,
      success: function (res) {
        // 转发成功之后的回调
        if (res.errMsg == 'shareAppMessage:ok') {
          app.fa("分享成功！")
        }
      },
      fail: function () {
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          app.fa("已取消")
        } else if (res.errMsg == 'shareAppMessage:fail') {
          app.fa("分享失败！")
        }
      },
    }
  }


})