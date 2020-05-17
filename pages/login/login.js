const app = getApp()
import QQMapWX from '../../libs/qqmap-wx-jssdk.js';
var e = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    postList: [
      {
        name: '账号 ：',
        val: '',
        plr: '请输入手机号码',
      },
      {
        name: '密码 ：',
        val: '',
        plr: '请输入密码',
      },
    ],
    ReferralUserId: "",
    isStroe: false,
    scene: '',
    referralUserId: '',
    LatiLongitude: {},
    isLoading: false,
  },


  changeInput(e) {
    let datar = e.currentTarget.dataset
    this.setData({
      [datar.name]: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    let that = this
    wx.getStorage({
      key: 'LatiLongitude',
      success(res) {
        that.setData({
          LatiLongitude: res.data
        })

      }
    })
    this.setData({
      isStroe: e.isStroe ? e.isStroe : false,
      scene: e.scene ? e.scene : '',
      referralUserId: e.referralUserId ? e.referralUserId : '',
    })
    if (e.isStroe) this.getUserPoints()
  },

  getUserPoints() { //经纬度获取
    let that = this
    var qqmapsdk = new QQMapWX({
      key: '7V4BZ-4WFW4-L3LU6-XLRLM-ZZ7BJ-MBFAM' // 必填
    });
    var _this = this
    wx.getLocation({
      type: 'wgs84',
      fail: function () {
        wx.showModal({
          title: '提示',
          content: '请打开位置信息授权',
          success(res) {
            if (res.confirm) {
              wx.openSetting({})
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      },
      success: function (res) { //经纬度成功回调
        console.log('地址', res)
        let latitude = res.latitude;
        let longitude = res.longitude
        let fujihang = {
          Latitude: res.latitude,
          Longitude: res.longitude
        }
        wx.setStorage({
          key: 'LatiLongitude',
          data: fujihang
        })
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function (res) { //通过第三方介入获取客户的省市区成功回调//重置省市区
            console.log('地址2', res)
            let firstProvince = res.result.address_component.province
            let firstCity = res.result.address_component.city
            let firstDistrict = res.result.address_component.district
            _this.firstaddress(firstProvince, firstCity, firstDistrict); //回调成功前往排查地址id发送给后端
          },
          complete: function (res) {
          }
        })

      }
    })
  },

  firstaddress(sheng, shi, qu) { //向后端发起地区的省市级请求
    var _this = this
    wx.request({
      url: app.gethsyurl,
      data: {
        action: 'GetRegionsOfProvinceCity'
      },
      success: function (res) {
        console.log('地址3', res)
        var addressData = res.data.province
        var shengID = '',
          shiId = '',
          quID = ''
        addressData.filter(function (item, index) {
          if (item.name == sheng) {
            shengID = item.id
            item.city.filter(function (item2, index2) {
              if (item2.name == shi) {
                shiId = item2.id
                if (item2.area.length !== 0) { //非市辖区
                  item2.area.filter(function (item3, index3) {
                    if (item3.name == qu) {
                      quID = item3.id
                    }
                  })
                } else {
                  quID = 0
                }
              }
            })
            var firstAddressId = shengID + ',' + shiId + ',' + quID
            console.log('地址4', res)
            wx.setStorage({
              key: 'firstAddressId',
              data: firstAddressId
            })
            wx.setStorage({
              key: 'nowAddressId',
              data: firstAddressId
            })
          }
        })
      }
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  loginFN() {
    let that = this
    console.log(e)
    var s = this.data.postList[0].val,
      t = this.data.postList[1].val;
    t.length < 6 ? wx.showModal({
      title: "提示",
      content: "密码长度不能少于6位",
      showCancel: !1
    }) : (wx.showLoading({
      title: "正在登录"
    }), e.getWxUserInfo(function (f) {
      var n = e.getRefferUserId();
      wx.request({
        url: e.getUrl("LoginByUserName"),
        data: {
          // openId: a.openId,
          userName: s,
          password: t,
          nickName: f.nikeName,
          unionId: f.unionId,
          encryptedData: f.encryptedData,
          session_key: f.session_key,
          iv: f.iv,
          ReferralUserId: n,
          headImage: f.headImage,
        },
        success: function (a) {

          if (a.data.Status != "OK") return app.fa(a.data.Message)
          e.fg({
            action: 'GetMembersInfo',
            openId: a.data.Message
          }).then(r => {
            if (r.data.Status == "OK") {
              app.fh()
              let dataR = r.data.Data
              dataR.openId = a.data.Message
              e.setMembersInfo(dataR)
              if (that.data.isStroe) {
                wx.redirectTo({
                  url: "/pages/fujihang/fuStoreDet/fuStoreDet?isNew=true&scene=" + that.data.scene
                })
              } else {
                wx.switchTab({
                  // url: "/pages/bchome/bchome"
                  url: wx.getStorageSync('getStore') ? '/pages/fujihang/fuIndexG/fuIndexG' : '/pages/fujihang/fuIndexZB/fuIndexZB'
                })
              }
            } else {
              app.fh()
              e.fa("获取个人信息失败！")
              wx.showModal({
                title: '提示',
                content: '请打开用户信息授权再微信信任授权登录',
                success(res) {
                  if (res.confirm) {
                    wx.openSetting({})
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            }
          })








        }
      });
    }));
  },


  quickLogin: function (a) {//这个a是骗人的
    let that = this
    // console.log(a)

    e.getWxUserInfo(function (f) {
      if (that.data.isLoading) return
      that.data.isLoading = true
      var s = that.data.referralUserId ? that.data.referralUserId : e.getRefferUserId();
      app.fl("正在登录...")

      console.log(e.globalData.unionid, 1111111111111111111);
      wx.request({
        url: e.getUrl("QuickLogin"),//
        data: {
          openId: f.openId,//微信返回的用户id
          nickName: f.nikeName,
          headImage: f.headImage,
          encryptedData: f.encryptedData,
          session_key: f.session_key,
          iv: f.iv,
          Latitude: that.data.LatiLongitude.Latitude,
          Longitude: that.data.LatiLongitude.Longitude,
          unionid: e.globalData.unionid,
          referralUserId: wx.getStorageSync('referralUserIdTwo'),
          appid: e.globalData.appId,
          rOpenId:e.globalData.share_openid
        },
        success: function (a) {
          if (a.data && a.data.Cookie) {
            wx.setStorageSync({
              key: "cookie",
              data: a.data.Cookie
            })
          }
          // console.log(a)//a 这里有客户想要的openid 以及其他信息
          void 0 == a.data.error_response ? (e.setUserInfo(a.data.Data),
            e.fg({
              action: 'GetMembersInfo',
              openId: f.openId
            }).then(r => {
              console.log(r, '===========');
              if (r.data.Status == "OK") {
                app.fh()
                let dataR = r.data.Data
                dataR.openId = f.openId
                e.setMembersInfo(dataR)
                wx.setStorage({
                  key:"userinfo",
                  data:dataR
                })
                console.log(dataR, '12333333333333')
                console.log(that.data.isStroe, 'sssss')
                console.log(that.data, '55555')

                if (that.data.isStroe) {
                  wx.redirectTo({
                    url: "/pages/fujihang/fuStoreDet/fuStoreDet?isNew=true&scene=" + that.data.scene
                  })
                } else {
                  console.log('11111111');
                  if (wx.getStorageSync('callBackLogin')) {
                    console.log('22999999992222');
                    wx.navigateBack({
                      delta: 1,
                    })
                  } else {
                    console.log('222222');
                    if (app.globalData.appId == 'wxa4d03cf8e1ea5904'||app.globalData.appId == 'wx5b277c6cbe1f88f4'||app.globalData.appId == 'wx442315f95b2a6113') {
                      console.log('333333');
                      wx.getStorageSync('getStore') ? wx.switchTab({
                        url: '/pages/fujihang/fuIndexG/fuIndexG'
                      }) : that.getStoreFN()

                    } else {
                      console.log('44444');
                      wx.switchTab({
                        url: '/pages/fujihang/fuIndexZB/fuIndexZB'
                      })
                    }
                  }
                }

              } else {
                app.fh()
                e.fa("获取个人信息失败！")
                wx.showModal({
                  title: '提示',
                  content: '请打开用户信息授权再微信信任授权登录',
                  success(res) {
                    if (res.confirm) {
                      wx.openSetting({})
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                })
              }
            })
          ) : hishop.showTip(a.data.error_response.sub_msg);
        }
      });

    });
  },

  // 
  returnFN() {
    wx.switchTab({
      // url: "/pages/bchome/bchome"
      url: wx.getStorageSync('getStore') ? '/pages/fujihang/fuIndexG/fuIndexG' : '/pages/fujihang/fuIndexZB/fuIndexZB'
    })
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
    let that = this
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
        if (that.data.chuanSid && r.data.Result.BindStoreId == 0) {
          app.globalData.storeId = that.data.chuanSid
          wx.reLaunch({
            url: '/pages/fujihang/fuIndexG/fuIndexG'
          })
          return
        }
        if (r.data.Result.BindStoreId) {
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
        } else {
          if (wx.getStorageSync('getStore')) {
            wx.reLaunch({
              url: '/pages/fujihang/fuIndexG/fuIndexG'
            })
          } else {
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