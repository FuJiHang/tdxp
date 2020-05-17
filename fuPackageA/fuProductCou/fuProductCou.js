const app = getApp()
import QQMapWX from '../../libs/qqmap-wx-jssdk.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    background: [], //轮播图
    imgheights: [],
    current: 0,
    video: false,
    project: {},
    pId: '',
    getStore: {},
    typeforList: false, //是否为列表显示
    isUnfold: false, //是否展开下拉列表
    page: 1, //门店列表页码
    pageFinsh: false,
    storeList: [],
    nowStroeInfo: {},
    nowCityId: 0,
    userlatitude: 0,
    userlongitude: 0,
    shareInfo: {},
    isShow: false,
    fujihang:{},
  },

  // 列表-打开地图
  listOpenMap(e) {
    let location = e.currentTarget.dataset.location
    wx.openLocation({
      latitude: parseFloat(location.Latitude),
      longitude: parseFloat(location.Longitude),
    })
  },

  // 列表-电话
  listPhoneFN(e) {
    let num = e.currentTarget.dataset.phone
    if (num == null) {
      wx.showToast({
        title: '当前门店暂无联系电话',
        icon: 'none'
      })
      return
    }
    wx.makePhoneCall({
      phoneNumber: num
    })
  },

  // 选择列表
  radioChange(e) {
    let idx = e.detail.value,
      _this = this
    _this.setData({
      nowStroeInfo: _this.data.storeList[idx]
    })
    wx.setStorage({
      key: 'getStore',
      data: _this.data.storeList[idx]
    })
  },

  // 滚动到底部
  scrollBottom(e) {
    if (this.data.pageFinsh) return
    this.getNearbyStoreData()
  },

  // 展开下拉列表
  bindUnfold() {
    let status = !this.data.isUnfold
    this.setData({
      isUnfold: status
    })
  },

  // 获取附近门店
  getNearbyStoreData() {
    let data = this.data,
      that = this
    app.fl()
    app.fg({
      action: 'Search',
      regionPath: wx.getStorageSync('nowAddressId') ? wx.getStorageSync('nowAddressId') : data.nowCityId,
      Latitude: wx.getStorageSync('LatiLongitude').Latitude ? wx.getStorageSync('LatiLongitude').Latitude : data.userlatitude,
      Longitude: wx.getStorageSync('LatiLongitude').Longitude ? wx.getStorageSync('LatiLongitude').Longitude : data.userlongitude,
      CardId: data.pId,
      tag: 'store',
      pageindex: data.page,
      pagesize: 10,

    }).then(r => {
      app.fh()
      let datar = r.data.Models
      if (data.page == 1) {
        data.storeList = datar
      } else {
        data.storeList = data.storeList.concat(datar)
      }
      if (datar.length < 10) {
        data.pageFinsh = true
      }
      data.page++
      wx.setStorage({
        key: 'getStore',
        data: data.storeList[0]
      })
      that.setData({
        storeList: data.storeList,
        nowStroeInfo: data.storeList[0],
      }, () => {
        if (Object.keys(data.getStore).length == 0) {
          data.getStore = data.nowStroeInfo
          that.getData()
        }
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(decodeURIComponent(options.scene),'22222222222');
    let that = this, data = this.data
    let scene = options.scene ? decodeURIComponent(options.scene).split('&') : ''
    console.log(scene, '2222222222');
    if (scene) {
      data.StoreId=scene[1].split('=')[1]
      this.setData({
        pId: scene[0].split('=')[1]
      })
      that.getUserPoints()

      return
    }

    if (options.referralUserIdTwo) wx.setStorage({
      key: "referralUserIdTwo",
      data: options.referralUserIdTwo
    })
    this.setData({
      pId: options.pId ? options.pId : ''
    })
    // 1为总部进入
    if (options.type == 1) {
      that.data.nowCityId = options.nowCityId
      that.data.userlatitude = options.userlatitude
      that.data.userlongitude = options.userlongitude

      that.setData({
        typeforList: true
      })
      that.getNearbyStoreData()
    } else {
      wx.getStorage({
        key: 'getStore',
        success(e) {
          that.setData({
            getStore: e.data
          })
          wx.setNavigationBarTitle({
            title: e.data.StoreName
          })
          that.getData()
        }
      })
    }
    if (options.getStore) {
      that.setData({
        getStore: JSON.parse(decodeURIComponent(options.getStore))
      })
      this.getData()
    }
  },

  // 
  toIndex(){
    wx.getStorageSync('getStore')?wx.switchTab({
      url:'/pages/fujihang/fuIndexG/fuIndexG'
    }):wx.switchTab({
      url:'/pages/fujihang/fuIndexZB/fuIndexZB'
    })
  },

  getUserPoints() { //经纬度获取
    let that = this
    var qqmapsdk = new QQMapWX({
      key: '7V4BZ-4WFW4-L3LU6-XLRLM-ZZ7BJ-MBFAM' // 必填
    });
    var _this = this
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
              console.log('用户点击取消')
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
        }
        that.getStoreFN()
      },
      success: function (res) { //经纬度成功回调
        console.log("输出经纬度回调", res);
        let fujihang = {
          Latitude: res.latitude,
          Longitude: res.longitude
        }

        that.setData({
          fujihang: fujihang
        })
        wx.setStorage({
          key: 'LatiLongitude',
          data: fujihang
        })
        that.getStoreFN()
      }
    })
  },


  // 设置全局变量
  getStoreFN() {
    let data = this.data,
      that = this
    app.fl()
    app.fg({
      url: "/api/PublicHandler.ashx?action=GetBaseStoreInfo",
      data: {
        StoreId: data.StoreId,
        Lat: data.fujihang.Latitude,
        Lng: data.fujihang.Longitude,
      }
    }, true).then(r => {
      app.fh()
      if (r.data.Status == "Success") {
        r.data.Result.StoreId = data.StoreId
        that.setData({
          getStore: r.data.Result,
        })
        wx.setStorage({
          key: 'getStore',
          data: r.data.Result
        })
        wx.setNavigationBarTitle({
          title: r.data.Result.StoreName
        })
        that.getData()
      } else app.fa(r.data.Message)
    })
  },


  // 
  toFN(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.to
    })
  },


  // 
  toFNEVA() {
    wx.navigateTo({
      url: '/fuPackageA/fuEvaluatAll/fuEvaluatAll?StoreId=' + this.data.getStore.StoreId
    })
  },

  // 
  getData() {
    let data = this.data,
      that = this
    app.fl()
    app.fg({
      action: 'GetProgramDetail_new',
      productId: data.pId,
      StoreId: data.getStore.StoreId,
    }).then(r => {
      app.fh()
      if (r.data.Status == "OK") {
        let datar = r.data

        r.data.Info = r.data.Info.replace(/\<img/gi, '<img style="width:100%;height:auto" ')


        datar.Appraises.forEach(c => {
          c.Pictures = c.Pictures.split(',')
          c.AddDate = c.AddDate.slice(5, 7) + '月' + c.AddDate.slice(8, 10) + '日'
          c.all = false
        })
        let bg = datar.Images.split(',')
        if (datar.Video) {
          data.background.push(datar.Video)
          data.video = true
        }

        bg.forEach((c, i) => {
          if (i != bg.length - 1) data.background.push(c)
        })
        datar.background = data.background
        console.log(data.background);
        that.setData({
          background: data.background,
          video: data.video,
          project: datar
        })

      } else app.fa(r.data.Message)
    })


  },

  // 
  openMap() {
    wx.openLocation({
      latitude: parseFloat(this.data.getStore.Latitude),
      longitude: parseFloat(this.data.getStore.Longitude),

    })
  },

  // 
  phoneFN() {
    wx.makePhoneCall({
      phoneNumber: this.data.getStore.CellPhone
    })
  },




  // 购买
  toBuy() {
    wx.navigateTo({
      url: '/fuPackageA/fuBuyCoupon/fuBuyCoupon?data=' + encodeURIComponent(JSON.stringify(this.data.project))
    })

    return
    let data = this.data,
      that = this
    app.fl()
    app.fg({
      action: 'UserGetStoreActivityCard',
      openid: app.globalData.GetMembersInfo.openId,
      ProductId: data.project.Id,
      StoreId: data.getStore.StoreId,
      appid: app.globalData.appId,
    }).then(b => {
      app.fh()
      if (b.data.Status != 'Buy') {
        app.fh()
        app.fa(b.data.Message)
        return
      }
      let pay = b.data.Data
      wx.requestPayment({
        timeStamp: pay.timeStamp,
        nonceStr: pay.nonceStr,
        package: "prepay_id=" + pay.prepayId,
        signType: 'MD5',
        paySign: pay.sign,
        success(res) {
          app.fh()
          if (res.errMsg == "requestPayment:ok") {
            app.fg({
              action: 'BuyerPaid',
              shopType: 2,
              payId: pay.PayId,
              couponId: 461,
              openId: app.globalData.GetMembersInfo.openId,
            })
            app.fa('购买成功！')
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              })
            }, 1450)

          } else {
            app.fh()
            app.fa('购买失败！')
          }
        },
        fail(res) {
          app.fh()
          app.fa('购买失败！')
        }
      })

    })
  },

  bindchangeImg: function (e) {
    this.setData({
      current: e.detail.current
    })
  },

  // 轮播图变化
  imageLoad: function (e) { //获取图片真实宽度  
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比  
      ratio = imgwidth / imgheight;
    //计算的高度值  
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight;
    var imgheights = this.data.imgheights;
    //把每一张图片的对应的高度记录到数组里  
    imgheights[e.target.dataset.id] = imgheight;
    this.setData({
      imgheights: imgheights
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
          } else {
            wx.navigateTo({
              url: "/pages/login/login"
            });
          }
        })
      })
    }
  },


  // 分享
  onShare() {
    var _this = this

    wx.request({
      url: getApp().data.url + '/API/QrcodeHandler.ashx?action=GetProductQrcode',
      data: {
        Type: 2,
        Path: 'fuPackageA/fuProductCou/fuProductCou?Id=' + this.data.project.Id + '&StoreId=' + this.data.getStore.StoreId,
        // Path: 'pages/mine/mine?prDid=' + this.data.prDid + '&pagetype=' + this.data.pageType,
        SalePrice: this.data.project.Price,
        ProductId: this.data.project.Id,
        AppId: app.globalData.appId,
        AppSecret: app.globalData.secret,
        openId: app.globalData.GetMembersInfo.openId,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded', // 默认值
        Cookie: wx.getStorageSync('cookieFu') || app.data.cookie
      },
      success: function (res) {
        if (res.data.Status == "Faile") {
          wx.showModal({
            content: res.data.Message,
            showCancel: false
          })
          return
        }
        _this.setData({
          shareInfo: res.data.Result,
          isShow: true
        })
      }
    })
  },
  // 关闭分享
  closeEvent(e) {
    var mode = e.detail.mode;
    if (mode == 'mask') {
      this.setData({
        isShow: false
      })
    }
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
    let data = this.data

    return {
      title: data.getStore.StoreName,
      path: '/fuPackageA/fuProductCou/fuProductCou?pId=' + data.pId + "&getStore=" + encodeURIComponent(JSON.stringify(data.getStore)) + "&referralUserIdTwo=" + app.globalData.GetMembersInfo.userId,
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