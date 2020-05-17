const livePlayer = requirePlugin('live-player-plugin');
var QQMapWX = require('/libs/qqmap-wx-jssdk.js');
var fuPost = "s://tdh.hmeshop.cn"//
  fuPost = "s://t-tdh.hmeshop.cn"//
  // fuPost = "://192.168.3.32:8091"


App({
  ff: function () {
    wx.showToast({
      icon: 'none',
      title: '该功能正在开发...',
      mask: true,
      duration: 1000
    })
  },
  fuLo: function (tip) {
    let a = "请去个人中心登录获得更好体验哦！"
    if (tip) a = tip
    wx.showModal({
      title: '提示',
      content: a,
      success(res) {
        if (res.confirm) {
          wx.switchTab({
            url: "/pages/mine/mine"
          })
          // wx.redirectTo({
          //   url: "/pages/login/login"
          // });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 弹窗提示
  fa: function (data, time) {
    let title = '没有更多的了'
    let timeA = 1500
    if (data) title = data
    if (time) timeA = time
    wx.showToast({
      icon: 'none',
      title: title,
      mask: true,
      duration: timeA
    })
  },
  // 时间戳转字符串
  ftts: function (timestamp) {
    var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '/';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
    var D = date.getDate() + ' ';
    if (D < 10) {
      D = '0' + D
    }
    var h = date.getHours();
    if (h < 10) {
      h = '0' + h
    }
    var m = date.getMinutes();
    if (m < 10) {
      m = '0' + m
    }
    var s = date.getSeconds()
    if (s < 10) {
      s = '0' + s
    }
    return Y + M + D + ' ' + h + ':' + m + ':' + s
  },

  fttst: function (timestamp) {
    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() + ' ';
    if (D < 10) {
      D = '0' + D
    }
    var h = date.getHours()
    if (h < 10) {
      h = '0' + h
    }
    var m = date.getMinutes()
    if (m < 10) {
      m = '0' + m
    }
    var s = date.getSeconds()
    if (s < 10) {
      s = '0' + s
    }
    return Y + M + D + ' ' + h + ':' + m + ':' + s
  },

  fct: function () {
    wx.navigateTo({
      url: "/pages/fujihang/fuCoupon/fuCoupon?active=3"
    });

  },
  // Furl:"http://bcdj.9oasd.com/API/WeChatApplet.ashx",//fujihang请求路径
  // url:'http://192.168.3.100/API/WeChatApplet.ashx',
  // 加载中
  fl: function (data) {
    let title = '加载中...'
    if (data) title = data
    wx.showLoading({
      icon: 'loading',
      title: title,
      mask: true,
    })
  },
  // 关闭加载
  fh: function () {
    wx.hideLoading()
  },

  // wjx请求接口//
  wPost: function (data, url) {
    return new Promise((resolve, reject) => {
      wx.request({//http://192.168.3.82:8086
        // url: 'http://192.168.3.82:8086/api/WeChatApplet.ashx' + url, ///api/WeChatApplet.ashx?action=StoreApproval
        url: this.wuAllUrl + url,
        data: data,
        header: { 'Content-Type': 'application/x-www-form-urlencoded' },
        method: 'POST',
        success(res) {
          resolve(res)
        },
        fail(res) {
          resolve(res)
        }
      })
    })
  },
  wGet: function (data) {
    let that = this
    return new Promise((resolve, reject) => {
      wx.request({
        url: this.wuAllUrl,
        data: data,
        success(res) {
          resolve(res)
        },
        fail(res) {
          wx.onNetworkStatusChange(function (res) {
            if (!res.isConnected) that.fa('当前无网络，请求超时！', 5000)
          })
          resolve(res)
        }
      })
    })
  },
  // get请求
  Fg: function (Data) {
    let {
      url,
      data
    } = Data
    let _this = this

    if (_this.globalData.GetMembersInfo && _this.globalData.GetMembersInfo.openId) {

      data ? data : data = {}
      delete data.openid
      delete data.Openid
      delete data.OpenID
      delete data.openID
      data.openId = _this.globalData.GetMembersInfo.openId

    }
    return new Promise((reslove, reject) => {
      wx.request({
        url: this.data.url + url,
        data: data ? data : '',
        headers: {
          Cookie: wx.getStorageSync('cookieFu') || _this.data.cookie
        },
        success(res) {
          reslove(res)
        }
      })
    })
  },
  // 请求接口
  fp: function (data, isSJ) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: isSJ ? 'http' + this.getAllUrl + data.url : this.gethsyurl,
        data: isSJ ? data.data : data,
        method: 'POST',
        header: { 'Content-Type': 'application/x-www-form-urlencoded' },
        success(res) {
          resolve(res)
        },
        fail(res) {
          resolve(res)
        }
      })
    })
  },
  fg: function (data, isSJ) {
    let that = this
    return new Promise((resolve, reject) => {
      if (!isSJ && data.action == 'GetMembersInfo') {
        data.unionid = that.globalData.unionid,
          data.referralUserId = wx.getStorageSync('referralUserIdTwo')
        data.appid = that.globalData.appId
      }

      // that.globalData.GetMembersInfo={
      //    openId:"ouKL25U5CoGvpGu_gcU5SQYL33uk"
      //  }  
      if (that.globalData.GetMembersInfo && that.globalData.GetMembersInfo.openId) {
        if (isSJ) {
          data.data ? data.data : data.data = {}
          data.data.openid ? (delete data.data.openid) : ''
          data.data.openId = that.globalData.GetMembersInfo.openId
        } else {
          data ? data : data = {}
          data.openid ? (delete data.openid) : ''
          data.openId = that.globalData.GetMembersInfo.openId
        }
      }
      console.log(isSJ ? 'http' + this.getAllUrl + data.url : this.gethsyurl, 22222222);
      wx.request({
        url: isSJ ? 'http' + this.getAllUrl + data.url : this.gethsyurl,
        data: isSJ ? data.data : data,
        header: {
          'content-type': 'application/json', // 默认值
          cookie: wx.getStorageSync('cookieFu')
        },
        // headers: {
        //   // 'content-type': 'application/json', // 默认值
        //   cookie: wx.getStorageSync('cookieFu')
        // },
        success(res) {
          console.log(res, 8888888888)
          if (res.data.Cookie || res.Cookie) {
            wx.setStorage({
              key: "cookieFu",
              data: res.data.Cookie ? res.data.Cookie : res.Cookie
            })
          }
          resolve(res)
        },
        fail(res) {
          wx.onNetworkStatusChange(function (res) {
            if (!res.isConnected) that.fa('当前无网络，请求超时！', 5000)
          })
          resolve(res)
        }
      })
    })
  },

  onLaunch(options) {
    wx.removeStorageSync('callBackLogin')
    const { query, scene } = options;

    console.log('onLaunch', options)
    console.log(livePlayer);


    // livePlayer.getLiveParams({ 
    //   room_id: query.room_id, 
    //   scene: scene, 
    // }).then(res => {
    //   console.log('get share openid', res.share_openid) // 分享者openid，分享卡片进入场景才有
    //   console.log('get openid', res.openid) // 用户openid
    //   console.log('get room id', res.room_id) // 房间号
    //   console.log('get custom params', res.customParams) // 开发者在跳转进入直播间页面时，页面路径上携带的自定义参数，这里传回给开发者
    // }).catch(err => {
    //   console.log('get live params err', err)
    // })

    // 强制更新

    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      wx.showModal({
        title: '更新提示',
        content: '新版本下载失败',
        showCancel: false
      })
    })


    // 

    var qqmapsdk = new QQMapWX({
      key: '5JTBZ-XHBWQ-4NW5I-GET5P-EDI43-X5BFS' // 必填
    });
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude

        var longitude = res.longitude
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function (res) {
            // console.log(res)
          },
          complete: function (res) {
            // console.log('获取客户地址成功')
            // console.log(res);
          }
        })
      },
    })

  },

  onShow(options) {
    const { query, scene } = options;
    let that=this
    console.log('onShow', options)
    query.room_id?that.globalData.roomId=query.room_id:''
    livePlayer.getShareParams({
      room_id: query.room_id,
      scene: scene,
    }).then(res => {
      res.room_id?that.globalData.roomId=res.room_id:''
      console.log('get share', res)
      console.log('get share openid', res.share_openid) // 分享者openid，分享卡片进入场景才有
      console.log('get openid', res.openid) // 用户openid
      console.log('get room id', res.room_id) // 房间号
      console.log('get custom params', res.customParams) // 开发者在跳转进入直播间页面时，页面路径上携带的自定义参数，这里传回给开发者
      that.globalData.share_openid=res.share_openid
      if(!res.share_openid) return
      that.getWxUserInfo(function (f) {
        wx.request({
          url: that.getUrl("QuickLogin"),//
          data: {
            openId: f.openId,//微信返回的用户id
            nickName: f.nikeName,
            headImage: f.headImage,
            encryptedData: f.encryptedData,
            session_key: f.session_key,
            iv: f.iv,
            Latitude: wx.getStorageSync('LatiLongitude').Latitude,
            Longitude:wx.getStorageSync('LatiLongitude').Longitude,
            unionid: that.globalData.unionid,
            referralUserId: '',
            appid: that.globalData.appId,
            rOpenId:res.share_openid,
          },
          success: function (a) {
            console.log(a,'ppppppppp');
            if (a.data && a.data.Cookie) {
              wx.setStorageSync({
                key: "cookie",
                data: a.data.Cookie
              })
            }
            // console.log(a)//a 这里有客户想要的openid 以及其他信息
            void 0 == a.data.error_response ? (that.setUserInfo(a.data.Data),
            that.fg({
                action: 'GetMembersInfo',
                openId: f.openId
              }).then(r => {
                console.log(r, '===========');
                if (r.data.Status == "OK") {
                  app.fh()
                  let dataR = r.data.Data
                  dataR.openId = f.openId
                  that.setMembersInfo(dataR)
                  wx.setStorage({
                    key: "userinfo",
                    data: dataR
                  })
                } else {
                  wx.setStorage({
                    key:'callBackLogin',
                    data:true
                  })
                  wx.navigateTo({
                    url:'/pages/login/login'
                  })
                  // wx.showModal({
                  //   title: '提示',
                  //   content: '请打开用户信息授权再微信信任授权登录',
                  //   success(res) {
                  //     if (res.confirm) {
                  //       wx.openSetting({})
                  //     } else if (res.cancel) {
                  //       console.log('用户点击取消')
                  //     }
                  //   }
                  // })
                }
              })
            ) : hishop.showTip(a.data.error_response.sub_msg);
          }
        });

      });




    }).catch(err => {


      console.log('get live params err', err)
    })
    // livePlayer.getLiveParams({ 
    //   room_id: query.room_id?query.room_id:6, 
    //   scene: scene, 
    // }).then(res => {
    //   console.log('get share openid', res.share_openid) // 分享者openid，分享卡片进入场景才有
    //   console.log('get openid', res.openid) // 用户openid
    //   console.log('get room id', res.room_id) // 房间号
    //   console.log('get custom params', res.customParams) // 开发者在跳转进入直播间页面时，页面路径上携带的自定义参数，这里传回给开发者
    // }).catch(err => {
    //   console.log('get live params err', err)
    // })
  },

  // 获取用户信息
  getUserInfo: function (t) {
    var e = this;
    e.globalData.userInfo && "0" == e.globalData.isReloadUser ? ("function" == typeof t && t(e.globalData.userInfo),
      wx.hideNavigationBarLoading()) : (e.globalData.isReloadUser = "0", wx.showNavigationBarLoading(),
        e.getOpenId(function (o) {
          wx.request({
            url: e.getUrl("LoginByOpenId"),
            data: {
              openId: o
            },
            success: function (o) {
              console.log('userInfo', o)
              "OK" == o.data.Status ? (e.globalData.userInfo = o.data.Data, "function" == typeof t && t(e.globalData.userInfo)) : wx.redirectTo({
                url: "/pages/login/login"
              });
            },
            complete: function () {
              wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
            }
          });
        }));
  },
  setRefferUserId: function (t) {
    wx.setStorageSync("ReferralUserId", t);
  },
  getRefferUserId: function (t) {
    return wx.getStorageSync("ReferralUserId");
  },
  getOpenId: function (t) {
    var e = this;
    if (e.globalData.openId) return t(e.globalData.openId)
    "" != e.globalData.openId && void 0 != e.globalData.openId ? "function" == typeof t && t(e.globalData.openId) : wx.login({
      success: function (o) {
        o.code ? wx.request({
          url: e.gethsyurl,
          data: {
            action: 'GetOpenId',
            appid: e.globalData.appId,
            secret: e.globalData.secret,
            js_code: o.code
          },
          success: function (o) {
            void 0 != o.data && void 0 != o.data.openid && (e.globalData.openId = o.data.openid, e.globalData.unionid = o.data.unionid,
              "function" == typeof t && t(e.globalData.openId));
          }
        }) : console.log("获取用户登录态失败！" + o.errMsg);
      }
    });
  },

  getWxUserInfo: function (t) {
    var e = this;
    e.globalData.wxUserInfo ? "function" == typeof t && t(e.globalData.wxUserInfo) : wx.login({
      success: function (o) {
        if (o.code) {
          var r = o.code;
          wx.getUserInfo({
            success: function (o) {
              wx.request({
                url: e.gethsyurl,
                data: {
                  action: 'GetOpenId',
                  appid: e.globalData.appId,
                  secret: e.globalData.secret,
                  js_code: r
                },
                success: function (r) {
                  e.fg({
                    action: "GetUnionId",
                    encryptedData: o.encryptedData,
                    iv: o.iv,
                    session_key: r.data.session_key
                  }).then(w => {
                    console.log(w, 2222222222223333333333);
                    if (w.data.Status == 'OK') {
                      e.globalData.unionid = w.data.Message
                      console.log(e.globalData.unionid, 2222222222223333333333);
                      if (void 0 != r.data && void 0 != r.data.openid) {
                        var n = {
                          openId: r.data.openid,
                          nikeName: o.userInfo.nickName,
                          referralUserId: wx.getStorageSync('referralUserIdTwo'),
                          appid: e.globalData.appId,
                          headImage: o.userInfo.avatarUrl,

                          iv: o.iv
                        };
                        e.globalData.wxUserInfo = n, "function" == typeof t && t(e.globalData.wxUserInfo);
                      } else {
                        wx.showToast({
                          icon: 'none',
                          title: '用户信息失败',
                          mask: true,
                          duration: 1500
                        })
                      }
                    }

                  })
                }
              });
            },
            fail: function (o) {
              wx.showToast({
                icon: 'none',
                title: o,
                mask: true,
                duration: 1500
              })
            }
          });
        } else console.log("获取用户登录态失败！" + o.errMsg);
      }
    });
  },
  // 设置地区id
  setRegionsOfProvinceCity(r) {
    this.globalData.getRegionsOfProvinceCity = r
  },
  // 设置经纬度
  setLatitude(r) {
    this.globalData.Latitude = r.Latitude
    this.globalData.Longitude = r.Longitude
  },
  // 设置地址id
  setAddress(r) {
    this.globalData.address = r
  },
  // 设置用户信息
  setMembersInfo: function (r) {
    // console.log("输出用户信息",r);
    this.globalData.GetMembersInfo = r
    wx.setStorageSync('openId', r.openId);
  },
  setUserInfo: function (t) {
    this.globalData.userInfo = t;
  },
  orderPay: function (t, e, o) {
    var r = this;
    r.getOpenId(function (n) {
      wx.request({
        url: r.getUrl("GetPayParam"),
        data: {
          openId: n,
          orderId: t,
          appid: r.globalData.appId,
        },
        success: function (t) {
          if ("OK" == t.data.Status) {
            var r = t.data.Data;
            wx.requestPayment({
              timeStamp: r.timeStamp,
              nonceStr: r.nonceStr,
              package: "prepay_id=" + r.prepayId,
              signType: "MD5",
              paySign: r.sign,
              success: function (t) {
                wx.showModal({
                  title: "提示",
                  content: "支付成功！",
                  showCancel: !1,
                  success: function (t) {
                    t.confirm && wx.redirectTo({
                      url: "../orderlist/orderlist?status=" + e
                    });
                  }
                });
              },
              fail: function (t) {
                wx.showModal({
                  title: "提示",
                  content: "支付失败！",
                  showCancel: !1,
                  success: function (t) {
                    o || t.confirm && wx.redirectTo({
                      url: "../orderlist/orderlist?status=" + e
                    });
                  }
                });
              }
            });
          } else wx.showModal({
            title: "提示",
            content: t.data.Message,
            showCancel: !1,
            success: function (t) {
              o || t.confirm && wx.redirectTo({
                url: "../orderlist/orderlist?status=" + e
              });
            }
          });
        }
      });
    });
  },

  data: {
    // url: 'https://tdh.hmeshop.cn',
    url: 'http' + fuPost,
  },
  getAllUrl: fuPost,
  gethsyurl: 'http' + fuPost + '/API/WeChatApplet.ashx',
  wuAllUrl: 'http' + fuPost + '/api/WeChatApplet.ashx',
  wuAllUrl2: fuPost,

  getRequestUrl: "https://m5.hmeshop.cn",
  imgUrl2: 'http://img.hmeshop.cn/hmeshop_jxy/images/',//图片路径
  imgUrl: 'https://bcdj.9oasd.cn/images/',//图片路径
  newImg: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/',
  //getAllUrl: "s://tdh.hmeshop.cn",//线上接口
  // getAllUrl: "://192.168.3.32:8091",//甘锡威接口
  // getAllUrl:'://t_tdh.hmeshop.cn',
  // gethsyurl:"http://t_tdh.hmeshop.cn/API/WeChatApplet.ashx",
  //gethsyurl: 'https://tdh.hmeshop.cn/API/WeChatApplet.ashx',  //线上接口
  //wuAllUrl: "https://tdh.hmeshop.cn/api/WeChatApplet.ashx",//线上接口
  // wuAllUrl:'http://t_tdh.hmeshop.cn/api/WeChatApplet.ashx',
  // wuAllUrl2:'://t_tdh.hmeshop.cn',
  // wuAllUrl2: "s://tdh.hmeshop.cn",//线上接口
  // getAllUrl: "://192.168.3.82:8086",//线上接口
  // gethsyurl: 'http://192.168.3.82:8086/API/WeChatApplet.ashx',  //线上接口
  // wuAllUrl: "http://192.168.3.82:8086/api/WeChatApplet.ashx",//线上接口
  // wuAllUrl2: "://192.168.3.82:8086",//线上接口
  getUrl: function (t) { //http://192.168.3.32:8091/
    return "http" + this.getAllUrl + "/API/WeChatApplet.ashx?action=" + t;
    // return "http" + 's://tdh.hmeshop.cn' + "/API/WeChatApplet.ashx?action=" + t;
  },
  getGroupChatUrl: function (t) {
    return "http" + this.getAllUrl + "/CommunicationCircle/GroupChat.ashx?action=" + t;
  },

  globalData: {
    // appId: "wx442315f95b2a6113",
    // secret: "8cc19e88e35cfdd9197235af20673b6d",
    // appId: "wx5b277c6cbe1f88f4",
    // secret: "b79944492be1095b20ac38f2aecd8d4a",
    appId: "wxa4d03cf8e1ea5904",
    secret: "62751c7a931f10261f05242124929211",
    // appId: "wx2e40ad78f7098898", //小程序appid
    // secret: "8688e615b798a7f48b37815493d9de47", //小程序密钥
    userInfo: null,//一开始的userinfo是空的
    siteInfo: null,
    ReferralInfo: null,
    ReferralSettingInfo: null,
    openId: "",
    unionid: "",
    wxUserInfo: null,
    GetMembersInfo: null,//用户信息 by fujihang  
    isReloadUser: "0",
    // QQMapKey: "7UPBZ-XO7WU-5HBVI-BCTF7-5N2CS-5YFIB",
    QQMapKey: "MIGBZ-NK6WO-JUPWH-SJYCP-NPJ7V-K7BK3",
    loginByOpenId: "LoginByOpenId",
    loginByUserName: "LoginByUserName",
    quickLogin: "QuickLogin",
    getIndexData: "GetHelpsData",
    GetIndexProductData: "GetIndexProductData",
    getProducts: "GetProducts",
    getProductDetail: "GetProductDetail",
    getCountDownProductDetail: "GetCountDownProductDetail",
    userGetCoupon: "UserGetCoupon",
    loadCoupon: "LoadCoupon",
    LoadSiteCoupon: "LoadSiteCoupon",
    getUserShippingAddress: "GetUserShippingAddress", //获取收货地址
    addShippingAddress: "AddShippingAddress",
    updateShippingAddress: "UpdateShippingAddress",
    setDefaultShippingAddress: "SetDefaultShippingAddress",
    GetShippingAddressById: "GetShippingAddressById",
    delShippingAddress: "DelShippingAddress",
    AddWXChooseAddress: "AddWXChooseAddress", //添加地址
    orderList: "OrderList",
    closeOrder: "CloseOrder",
    finishOrder: "FinishOrder",
    getLogistic: "GetLogistic",
    getPayParam: "GetPayParam",
    getShoppingCart: "GetShoppingCart",
    sumbitOrder: "SumbitOrder",
    getRegionsOfProvinceCity: "GetRegionsOfProvinceCity",//地区id
    getRegions: "GetRegions",
    GetRegionByLatLng: "GetRegionByLatLng",
    getAllCategories: "GetAllCategories",
    loadOrderProduct: "GetOrderProduct",
    loadReview: "LoadReview",
    loadCouponDetails: "GetCouponDetail",
    getAfterSalePreCheck: "AfterSalePreCheck",
    Latitude: '',//维度
    Longitude: '',//经度
    address: '',//地址id
    storeId: 0,
    roomId:'',
    share_openid:"",
  }
})