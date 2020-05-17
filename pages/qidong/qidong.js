// pages/qidong/qidong.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgurl: '',
    heigh: '',
    width: "",
    timeout: '',
    chuanSid:0,
    daoshu:''
  },
  getimg() {
    var _this = this
    wx.request({
      url: getApp().gethsyurl,
      data: {
        action: "GetStartPicture"
      },
      success: function (res) {
        var imgurl = res.data.rows[0].PhotoPath

        wx.downloadFile({
          url: imgurl,
          success: function (res) {
            if (res.statusCode === 200) {
              const fs = wx.getFileSystemManager()
              fs.saveFile({
                tempFilePath: res.tempFilePath,
                success(res) {
                  wx.setStorageSync('image_cache', res.savedFilePath)
                }
              })
            }
          }
        })
        wx.setStorage({
          key: 'qdOverTime',
          data: (new Date().getTime())
        })
        _this.setData({
          imgurl: imgurl
        })
      }
    })
  },
  gobchome() {
    let that = this
    wx.getStorage({
      key: 'getStore',
      success: function (r) {

      }
    })

    if (app.globalData.appId == 'wxa4d03cf8e1ea5904'||app.globalData.appId == 'wx5b277c6cbe1f88f4'||app.globalData.appId == 'wx442315f95b2a6113') {
      that.getStoreFN()
    } else {
      wx.reLaunch({
        url: '/pages/fujihang/fuIndexZB/fuIndexZB'
      });
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  tiaoguoFN(){
    let that=this
    clearInterval(that.data.daoshu)
    if (app.globalData.appId == 'wxa4d03cf8e1ea5904'||app.globalData.appId == 'wx5b277c6cbe1f88f4'||app.globalData.appId == 'wx442315f95b2a6113') {
      that.getStoreFN()
    } else {
      wx.reLaunch({
        url: '/pages/fujihang/fuIndexZB/fuIndexZB'
      });
    }
  },

  daojishi() {
    var timeout = 3;
    var that = this
    that.data.daoshu = setInterval(function () {
      timeout--
      that.setData({
        timeout: timeout
      })
      if (timeout == 1) {
        clearInterval(that.data.daoshu)
        if (app.globalData.appId == 'wxa4d03cf8e1ea5904'||app.globalData.appId == 'wx5b277c6cbe1f88f4'||app.globalData.appId == 'wx442315f95b2a6113') {
          that.getStoreFN()
        } else {
          wx.reLaunch({
            url: '/pages/fujihang/fuIndexZB/fuIndexZB'
          });
        }


      }
    }, 1000)
  },
  onLoad: function (options) {
    console.log(options, '2222222222222');
    wx.setStorage({
      key: 'friends',
      data: true,
    })
    let that = this
    this.daojishi()
    const path = wx.getStorageSync('image_cache')
    if (path) {
      wx.getStorage({
        key: 'qdOverTime',
        success: res => {
          let nowTime = new Date().getTime() - 1 * 24 * 60 * 60 * 1000
          if (nowTime > res.data) {
            that.getimg()
            return
          }
          that.setData({
            imgurl: path
          })
        },
        fail: () => {
          that.getimg()
        }
      })

    } else {
      this.getimg();
    }

    console.log(options)
    let bbbb = decodeURIComponent(options.scene).split("ReferralUserId=")[1]
    let cccc=bbbb.split("&sid=")
    console.log(bbbb, '==========')
    if (bbbb) {
      this.data.chuanSid=cccc[1]
      wx.setStorage({
        key: 'referralUserIdTwo',
        data: cccc[0]
      })
      app.getWxUserInfo(function (f) {
        wx.request({
          url: app.getUrl("QuickLogin"),//
          data: {
            openId: f.openId,//微信返回的用户id
            nickName: f.nikeName,
            headImage: f.headImage,
            encryptedData: f.encryptedData,
            session_key: f.session_key,
            iv: f.iv,
            referralUserId: cccc[0],//上级id
            unionid: app.globalData.unionid,
            appid: app.globalData.appId,
          }
        })
      })
    }

    if (options.fOpenId) {
      app.getWxUserInfo(function (f) {
        wx.request({
          url: app.getUrl("QuickLogin"),//
          data: {
            openId: f.openId,//微信返回的用户id
            nickName: f.nikeName,
            headImage: f.headImage,
            encryptedData: f.encryptedData,
            session_key: f.session_key,
            iv: f.iv,
            referralUserId: options.fOpenId,//上级id
            IsShareFromLotteryActivity: 1,
            unionid: app.globalData.unionid,
            appid: app.globalData.appId,
          }
        })
      })
    }
    // 

  },

  // 获取附近门店
  getStoreFN() {
    let that = this
    wx.getLocation({
      type: 'wgs84',
      fail: function (e) {
        wx.showModal({
          title: '提示',
          content: '请打开位置信息授权',
          success(res) {
            if (res.confirm) {
              wx.openSetting({})
            } else if (res.cancel) {
              // app.globalData.storeId = 122
              // wx.reLaunch({
              //   url: '/pages/fujihang/fuIndexG/fuIndexG'
              // })
              that.toFN()
            }
          }
        })
        if (e.errCode == 2) {
          wx.showModal({
            title: '提示',
            content: '请打开手机GPS',
            success(res) {
              if (res.confirm) {

              } else if (res.cancel) {


              }
            }
          })


          that.toFN()
        }

      },
      success: function (res) { //经纬度成功回调
        that.toFN(res)


      }
    })




  },

  toFN(res) {
    console.log('ababababab');
    let that=this
    app.getOpenId(function (a) {
      app.fl()
      app.fg({
        url: '/AppShop/AppShopHandler.ashx?action=GetStoreList',
        data: {
          pageIndex: 1,
          pageSize: 1,
          Type: 1,
          Lan: res ? res.latitude : '',
          Lng: res ? res.longitude : '',
          openid: a,
        }
      }, true).then(r => {
        app.fh()
        if(that.data.chuanSid&&r.data.Result.BindStoreId==0){
          app.globalData.storeId = that.data.chuanSid
          wx.reLaunch({
            url: '/pages/fujihang/fuIndexG/fuIndexG'
          })
          return
        }
        if(r.data.Result.BindStoreId){
          app.globalData.storeId = r.data.Result.BindStoreId
          wx.reLaunch({
            url: '/pages/fujihang/fuIndexG/fuIndexG'
          })
          return
        }
        if (r.data.Result.NowLogin == '店长' || r.data.Result.NowLogin == '店员') {
          app.globalData.storeId = r.data.Result.StoreList[0].StoreId
          wx.reLaunch({
            url: '/pages/fujihang/fuIndexG/fuIndexG'
          })
        }else{
          if(wx.getStorageSync('getStore')){
            wx.reLaunch({
              url: '/pages/fujihang/fuIndexG/fuIndexG'
            })
          }else{
            app.globalData.storeId = r.data.Result.StoreList[0].StoreId
            wx.reLaunch({
              url: '/pages/fujihang/fuIndexG/fuIndexG'
            })
          }
      
        }
        console.log(r, 98999999);
       

      })
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