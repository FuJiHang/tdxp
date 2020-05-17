// pages/fuMyOrder/fuMyOrder.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTop: ['电子券', '优惠券'],//导航条
    cIdData: {},//选择购买的优惠券
    isChoose: 0,//被选择的导航条
    active: 0,//功能导航条的默认
    imgUrl: app.imgUrl,
    functionList: [
      {
        name: "全部",//导航条名
        data: [],//列表数据
        page: 1,//加载页数
        finish: false,//是否加载完成
        post: 0,//请求参数
      },
      {
        name: "未使用",//导航条名
        data: [],//列表数据
        page: 1,//加载页数
        finish: false,//是否加载完成
        post: 1,//请求参数
      },
      {
        name: "过期",
        data: [],
        page: 1,
        finish: false,
        post: 3,//请求参数
      },
      {
        name: "可购买",
        data: [],
        page: 1,
        finish: false,
      },
    ],//功能导航条
    price: 0,//传递价格
    type: 0, //type==0?客户：技师
    show: false,
    personData: [
      {
        name: '姓名：',
        val: '',
        post: 'RealName',
      },
      {
        name: '手机号：',
        val: '',
        post: 'CellPhone',
      },
    ],
    getStore: {},//门店信息
  },

  // 
  changeInput(e) {

    this.setData({
      [e.currentTarget.dataset.name]: e.detail.value,
    })
  },

  // 
  onCloseP() {
    this.setData({
      show: false,
    })
  },

  // 选择导航条
  changeTop: function (event) {
    let index = event.currentTarget.dataset.index
    this.setData({ isChoose: index })
  },


  // 选择功能
  onChange(event) {
    this.setData({
      active: event.detail.index
    })
    if (this.data.functionList[event.detail.index].finish) {
      return;
    }
    this.data.active == 3 ? this.buyList() : this.getDataR()
  },
  getDataRDD() {
    this.data.active == 3 ? this.buyList() : this.getDataR()
  },

  //获取数据 
  getDataR() {
    let type = this.data.type
    let dataF = this.data
    let functionList = this.data.functionList
    let active = this.data.active
    if (active == 3) return
    if (functionList[active].finish) {
      return
    }
    app.fl()

    app.fg({
      action: 'LoadCoupon',
      openId: app.globalData.GetMembersInfo.openId,
      // openId:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',
      couponType: functionList[active].post,
      pageIndex: functionList[active].page,
      // type:dataF.type,
      pageSize: 10,
      StoreId: wx.getStorageSync('getStore').StoreId ? wx.getStorageSync('getStore').StoreId : ''
    }).then(r => {
      console.log("输出优惠券数据", r);
      app.fh()
      if (r.data.Status == "OK") {
        let le = 0
        if (!r.data.Data.length) functionList[active].finish = true
        else {
          r.data.Data.forEach(c => {
            if (dataF.price && dataF.price < c.OrderUseLimit) c.disableF = true

            functionList[active].data.push(c)
            le++
            if (le < 11) {
              functionList[active].finish = true
            }
          })
          functionList[active].page++
        }

        this.setData({
          functionList: functionList
        })

      } else {
        app.fa('获取失败！')
      }
    })


  },

  // 
  payOrder() {
    let data = this.data, that = this
    if (!(/^1[3|4|5|6|7|8][0-9|9]\d{4,8}$/.test(data.personData[1].val))) return app.fa('手机号码不正确！')
    app.fl("正在购买...")
    app.fg({
      action: 'UserGetCoupon',
      openid: app.globalData.GetMembersInfo.openId,
      shopType: 2,
      couponId: data.cIdData.CouponId,
      appid: app.globalData.appId,
    }).then(b => {
      if (b.data.Status != 'OK') {
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
            data.functionList[0] = {
              name: "可使用",//导航条名
              data: [],//列表数据
              page: 1,//加载页数
              finish: false,//是否加载完成
              post: 1,//请求参数
            }
            that.setData({
              functionList: data.functionList
            })
            app.fg({
              action: 'BuyerPaid',
              shopType: 2,
              payId: pay.PayId,
              couponId: data.cIdData.CouponId,
              openId: app.globalData.GetMembersInfo.openId,
            })
            app.fg({
              action: 'UpdateInformationMember',
              CellPhone: data.personData[1].val,
              RealName: data.personData[0].val,
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
        }, fail(res) {
          app.fh()
          app.fa('购买失败！')
        }
      })
    })
  },


  chooseFN(e) {
    let cId = e.currentTarget.dataset.data
    let data = this.data, that = this
    // 购买
    if (data.active == 3) {
      wx.showModal({
        title: '确定要购买',
        content: cId.CouponName,
        success(res) {
          if (res.confirm) {

            if (!data.personData[0].val
              || !data.personData[1].val
            ) {
              that.setData({
                show: true,
                cIdData: cId
              })
              return
            }
            that.setData({
              cIdData: cId
            })
            that.payOrder()
          }
        }
      })

      return
    }

    // 选择优惠券
    if (!data.price || data.active != 0) return
    if (cId.disableF) return app.fa('该订单不能使用电子券')
    wx.setStorage({
      key: "couponId",
      data: {
        id: cId.ClaimCode,
        pic: cId.Price
      },
    })
    data.functionList[data.active].data.forEach(k => {
      if (cId.ClaimCode != k.ClaimCode) k.disableF = true
    })
    this.setData({
      functionList: data.functionList
    })
    app.fa('已选择优惠券,即将返回')
    setTimeout(() => {
      wx.navigateBack({
        delta: 1
      })
    }, 1450)

  },

  buyList() {
    let functionList = this.data.functionList, datas = this.data
    let active = this.data.active
    if (functionList[active].finish) {
      return
    }
    app.fl()
    app.fg({
      action: 'LoadSiteCoupon',
      openId: app.globalData.GetMembersInfo.openId,
      // openId:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',
      Role: 1,
      PageSize: 10,
      pageIndex: functionList[active].page,
      obtainWay: 3,
      Type: wx.getStorageSync('getStore').StoreId ? 2 : 1,
      StoreId: wx.getStorageSync('getStore').StoreId ? wx.getStorageSync('getStore').StoreId : ''
    }).then(r => {
      app.fh()
      if (r.data.Status == "OK") {
        if (!r.data.Data.length) functionList[active].finish = true
        else {
          if (functionList[active].page == 1) functionList[active].data = r.data.Data
          else {
            r.data.Data.forEach(c => {
              functionList[active].data.push(c)
            })
          }
          if (r.data.Data.length < 10) {

            functionList[active].finish = true
          }

          functionList[active].page++
        }
        this.setData({
          functionList: functionList
        })

      } else {
        app.fa('获取失败！')
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let functionList = this.data.functionList, that = this
    if (options.type == 1) functionList.pop()
    this.setData({
      functionList: functionList,
      type: options.type ? options.type : 0,
      price: options.price ? options.price : 0,
      active: options.active ? options.active : 0
    })

    if (options.storeId) {

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
          app.fl()
          app.fg({
            url: "/api/PublicHandler.ashx?action=GetBaseStoreInfo",
            data: {
              StoreId: options.storeId,
              Lat: res.Latitude,
              Lng: res.Longitude,
            }
          }, true).then(r => {
            app.fh()
            if (r.data.Status == "Success") {
              r.data.Result.StoreId = options.storeId
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
            } else app.fa(r.data.Message)
          })


        }
      })

      return
    }


    wx.getStorage({
      key: 'getStore',
      success(e) {

        that.setData({
          getStore: e.data
        })
        wx.setNavigationBarTitle({
          title: e.data.StoreName
        })
      }
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
    let that = this, data = this.data
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

            that.data.active == 3 ? that.buyList() : that.getDataR()

            wx.getStorage({
              key: 'personData',
              success(res) {
                for (let i = 0; i < data.personData.length; i++) {
                  data.personData[i].val = res.data[data.personData[i].post] ? res.data[data.personData[i].post] : app.globalData.GetMembersInfo[data.personData[i].post]
                }
                that.setData({
                  personData: data.personData
                })
              }, fail(res) {
                for (let i = 0; i < data.personData.length; i++) {
                  data.personData[i].val = app.globalData.GetMembersInfo[data.personData[i].post]
                }
                that.setData({
                  personData: data.personData
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
    } else {
      that.data.active == 3 ? that.buyList() : that.getDataR()
      wx.getStorage({
        key: 'personData',
        success(res) {
          for (let i = 0; i < data.personData.length; i++) {
            data.personData[i].val = res.data[data.personData[i].post] ? res.data[data.personData[i].post] : app.globalData.GetMembersInfo[data.personData[i].post]
          }
          that.setData({
            personData: data.personData
          })
        }, fail(res) {
          for (let i = 0; i < data.personData.length; i++) {
            data.personData[i].val = app.globalData.GetMembersInfo[data.personData[i].post]
          }
          that.setData({
            personData: data.personData
          })
        }
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

  tipFN(e) {
    if (!e.currentTarget.dataset.data.PayId) return app.fa('不是购买的券不能分享哦！')

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    console.log("输出点击分享的数据", e);
    const { name, imgc } = e.target.dataset;
    let imgUrl = this.data.imgUrl

    return {
      title: name,
      path: '/fuPackageA/fuCouponDet/fuCouponDet',
      // imageUrl: imgUrl + "shareCoupun.png",
      imageUrl: imgc,
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  }
})