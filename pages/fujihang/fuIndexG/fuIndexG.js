const app = getApp()
import QQMapWX from '../../../libs/qqmap-wx-jssdk.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newImg: app.newImg,
    isLoading: false,
    clientY: '80%',
    clientX: '85%',
    windowWidth: 0,
    windowHeight: 0,
    imgUrl: app.imgUrl,
    fujihang: {},
    getStore: {},
    background: [], //轮播图
    imgheights: [],
    proList: {
      data: [],
      page: 1,
      finsh: false,
    }, //商品列表
    hotPro: [],
    funList: [

      {
        name: '直播专区',
        img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/zbzq003.png?1',
        to: '/fuPackageA/fuLive/fuLive'
      },
      {
        name: '超值活动',
        img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/czhd003.png?2',
        // to: '/fuPackageA/fuTeamList/fuTeamList'
        to: "/fuPackageA/fuXJMS/fuXJMS"
      },
      {
        name: '头道专区',
        img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/rdzq003.png?1',
        // to: '/fuPackageA/fuXJMS/fuXJMS'
        to: "/fuPackageA/fuShopClass/fuShopClass"
      },
      {
        name: '惠选商城',
        img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/hxsc003.png?1',
        to: '/pages/fujihang/fuNewMarket/fuNewMarket'
      },
      {
        name: '关于小铺',
        img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/gyxp003.png?1',
        // to: '/fuPackageA/fuShopClass/fuShopClass'
        to: '/fuPackageA/fuStoreDet/fuStoreDet'
      },
      // {
      //   name: '头部养生',
      //   img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/nav@3x4.png',
      //   to: ''
      // },
      // {
      //   name: '体质调理',
      //   img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/nav@3x5.png',
      //   to: ''
      // },
      // {
      //   name: '女性健康',
      //   img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/nav@3x6.png',
      //   to: ''
      // },
      // {
      //   name: '招商加盟',
      //   img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/nav@3x7.png',
      //   to: ''
      // },
      // {
      //   name: '关于本店',
      //   img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/nav@3x8.png',
      //   to: '/fuPackageA/fuStoreDet/fuStoreDet'
      // },
    ],
    active: 0,
    teamList: [],
    current: 0,
    liveRoom: [],
    showHui: false,
    liveId: 0,
    videoList: [],
    huiPage: 1,
    huiFinsh: false,
    navBar: [{
      name: '首页',
      img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/sele@3x1.png',
      to: '/pages/fujihang/fuIndexG/fuIndexG',
    },
    {
      name: '惠选商城',
      img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/menu@3x4.png',
      to: '/pages/fujihang/fuNewMarket/fuNewMarket',
    },
    {
      name: '红卡专区',
      img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/menu@3x1.png',
      to: '/pages/fujihang/fuHongKaPro/fuHongKaPro'

    },
    {
      name: '购物车',
      img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/menu@3x2.png',
      to: '/pages/cart/cart'

    },
    {
      name: '我的',
      img: "http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/menu@3x3.png",
      to: '/pages/mine/mine',
    },
      //门店导航条
    ], //导航条
    xz: 0,
    StoreId: 0, //门店id
    IsShowVideo: false,
    serviceAlert: false,
    getStoreIndex: '', //活动图
    isShowPopup: false, //是否显示客服弹窗
    existCustomer: false, //false为没有客服信息
    customerList: [], //客服列表,
    getActivtyInfo: {}, //活动图片信息
    openId: '',
    technicianInfo: {
      list: [],
      page: 1,
      finish: false
    },//技师列表信息
    newAlert: false,
    postList: [{
      name: '手机号：',
      plr: '请输入要绑定的手机号',
      img: 'phone',
      val: '',
    },
    {
      name: '验证码：',
      plr: '请输入验证码',
      img: 'coupon',
      val: '',
    },
    {
      name: '输入新密码：',
      plr: '请输入新密码',
      img: 'lock',
      val: '',
    },
    {
      name: '再次输入新密码：',
      plr: '请输入新密码',
      img: 'lock',
      val: '',
    },
    ],
    SMS: '获取验证码',
    canClick: true,
    totalTime: 45,
    shareOpen: false,
    zhuBoList: [],
    getXiaoDian: [],
    nearList: {
      finsh: false,
      data1: [],
      data2: [],
      page: 1,
    },
    neerPdD: [],
    scrollTop: 0,
  },

  // 
  toTopFn() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0,

    });
  },


  onPageScroll(e) {
    let that = this
    this.setData({
      scrollTop: e.scrollTop
    })

  },

  Fabulous(e) {
    let datac = e.currentTarget.dataset
    app.fl()
    app.fg({
      action: 'GoodAndCollection',
      // openId:"oGsqu4qBG6Icub2iLYzI3MJGH4iQ",
      openId: app.globalData.GetMembersInfo.openId,
      RelationType: 3,
      ForID: datac.id
    }).then(r => {
      app.fh()
      if (r.data.Status == 'OK') {
        this.setData({
          [datac.name]: datac.tf ? false : true,
          [datac.namenum]: datac.tf ? --datac.num : ++datac.num
        })
      }
      app.fa(r.data.Message)

    })

  },
  // 获取高度
  getHeight() {
    return new Promise((resolve, reject) => {
      let leftK = wx.createSelectorQuery()
      let rightK = wx.createSelectorQuery()
      leftK.select('#leftK').boundingClientRect()
      rightK.select('#rightK').boundingClientRect()
      leftK.exec(function (res) {
        rightK.exec(r => {
          console.log(res, '========', r);
          if (res[0].height > r[0].height) resolve(true)
          else resolve(false)
        })
      })
    })
  },

  // 大家都在看
  getListT() {
    let data = this.data, that = this
    if (data.nearList.finsh) return
    if (data.isLoading) return
    data.isLoading = true
    app.fl()
    app.fg({
      action: 'LoadAttention',
      // openId:"oGsqu4qBG6Icub2iLYzI3MJGH4iQ",
      openId: app.globalData.GetMembersInfo.openId,
      pageIndex: data.nearList.page,
      pageSize: 4,
      // lat:data.LatiLongitude.Latitude,
      // lng:data.LatiLongitude.Longitude,
      IsRecommended: true,
    }).then(r => {
      app.fh()

      if (r.data.Status == 'OK') {
        let datar = r.data.Data, cc = []
        cc.push(...data.neerPdD, ...datar)
        that.setData({
          neerPdD: cc
        })
        for (let i = 0; i < datar.length; i++) {
          setTimeout(() => {
            that.getHeight().then(r => {
              if (r) {
                if (datar[i].ImageUrls.indexOf('.mp4') != -1) datar[i].isVideo = true
                data.nearList.data2.push(datar[i])
                that.setData({
                  ['nearList.data2']: data.nearList.data2
                })
              } else {
                if (datar[i].ImageUrls.indexOf('.mp4') != -1) datar[i].isVideo = true
                data.nearList.data1.push(datar[i])
                that.setData({
                  ['nearList.data1']: data.nearList.data1
                })
              }
            })

          }, i * 600)

        }
        data.isLoading = false
        this.setData({
          ['nearList.finsh']: datar.length < 4 ? true : false,
          ['nearList.page']: ++data.nearList.page
        })
      } else app.fa(r.data.Message)
    })
  },

  toPYQLB() {
    wx.navigateTo({
      url: '/fuPackageA/fuCircleFri/fuCircleFri'
    })
  },


  toPYQFN(e) {
    let datac = e.currentTarget.dataset,
      data = this.data,
      WeiZhi = 0
    setTimeout(() => {
      WeiZhi = datac.no - 1
      // if(datac.name=='le') WeiZhi=datac.index*2
      // else WeiZhi=datac.index*2+1
      let chuang = ''
      if (WeiZhi % 10 == 0) chuang = encodeURIComponent(JSON.stringify(data.neerPdD.slice(WeiZhi, ((Math.ceil(WeiZhi / 10) + 1) * 10))));
      else chuang = encodeURIComponent(JSON.stringify(data.neerPdD.slice(WeiZhi, (Math.ceil(WeiZhi / 10) * 10))));
      wx.navigateTo({
        url: '/fuPackageA/fuProjectVideo/fuProjectVideo?chuang=' + chuang + '&page=' + data.nearList.page + '&choose=0'
      })
    }, 300)
  },


  toFNLive(e) {
    console.log(e.currentTarget.dataset);
    // if(e.currentTarget.dataset.stu==2) return app.fa('未开播，不能观看哦！')
    if (e.currentTarget.dataset.rid) app.globalData.roomId = e.currentTarget.dataset.rid
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  onCloseP() {
    this.setData({
      newAlert: false,
      showHui: false,

    })
  },

  //注册更新
  changeInput(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      ["postList[" + index + "].val"]: e.detail.value
    })
  },

  // 提交注册验证码
  subimt() {
    let data = this.data,
      that = this
    // if (data.postList[2].val.toString().trim().length < 6) return app.fa("密码不能小于6位！")


    app.fg({
      action: 'CheckContentSecurity',
      Type: 0,
      FormData: data.postList[0].val + data.postList[1].val +
        data.postList[2].val
    }).then(t => {
      if (t.data.Status != "OK") {
        app.fa(t.data.Message)
      } else {
        app.fl()
        app.fg({
          action: "CellPhoneVerification",
          Phone: data.postList[0].val,
          IsSetPwd: false,
          imgCode: data.postList[1].val,
          // password: data.postList[2].val,
          // repassword: data.postList[2].val,
          //  openId:"oGsqu4qBG6Icub2iLYzI3MJGH4iQ",
          openId: app.globalData.GetMembersInfo.openId,
        }).then(r => {
          // console.log(r)
          app.fh()
          app.fa(r.data.Message)
          if (r.data.Status != "OK") return
          setTimeout(() => {
            app.fg({
              action: 'GetMembersInfo',
              openId: app.globalData.GetMembersInfo.openId
            }).then(r => {
              if (r.data.Status == "OK") {
                let dataR = r.data.Data
                dataR.openId = app.globalData.GetMembersInfo.openId
                app.setMembersInfo(dataR)
                that.setData({
                  newAlert: false
                })
                // wx.navigateTo({
                //   url: '/fuPackageA/fuLuckDraw/fuLuckDraw'
                // })
              } else {
                wx.redirectTo({
                  url: "/pages/login/login"
                });
              }
            })
          }, 1450)
        })
      }
    })
  },


  // 获取验证码
  getSMS() {
    let data = this.data,
      that = this
    if (!(/^1[3|4|5|6|7|8|9][0-9]\d{4,8}$/.test(data.postList[0].val))) return app.fa('请输入正确的手机号')
    if (!data.canClick) {
      return
    } else {
      data.canClick = false
      data.SMS = data.totalTime + 's'
      let clock = setInterval(() => {
        data.totalTime--
        data.SMS = data.totalTime + 's'
        if (data.totalTime < 0) {
          clearInterval(clock)
          data.SMS = '获取验证码'
          data.totalTime = 45
          data.canClick = true //这里重新开启
        }
        that.setData({
          canClick: data.canClick,
          SMS: data.SMS,
          totalTime: data.totalTime,
        })
      }, 1000)


      app.fl()
      app.fg({
        action: "SendVerifyCode",
        Phone: data.postList[0].val,
        IsValidPhone: true,
        // openId:"oGsqu4qBG6Icub2iLYzI3MJGH4iQ",
        openId: app.globalData.GetMembersInfo.openId,
        imgCode: 0
      }).then(r => {
        app.fh()
        app.fa(r.data.Message)
      })


    }
  },


  // 
  getLiveData() {
    let data = this.data, that = this
    if (data.finsh) return
    app.fl()
    app.fg({
      url: "/api/LiveInfo.ashx?action=GetTopLiveRoomList",
      data: {
        size: 10,
        index: 1,
        IsReferral: 2,
      }
    }, true).then(r => {
      app.fh()
      console.log(r.data.Data.liveRoom, 22211111111111)
      if (r.data.Status == 'true') {
        r.data.Data.liveRoom.forEach(s => {
          s.BeginTime = s.BeginTime.replace('T', ' ')
          s.endTime = s.endTime.replace('T', ' ')
          data.liveRoom.push(s)
        })
        that.setData({
          liveRoom: data.liveRoom,

        })
      } else app.fa(r.data.Message)

    })
  },



  // 前往技师详情
  toDetailForTechnician(e) {
    let idx = e.currentTarget.dataset.idx, _this = this
    wx.navigateTo({
      url: `/pages/fujihang/fuTeacherDet/fuTeacherDet?id=${_this.data.technicianInfo.list[idx].Id}`,
    })
  },

  // 技师列表翻页
  toNextPage() {
    this.getTechnicianList()
  },

  // 获取技师列表
  getTechnicianList(id) {
    let data = this.data,
      that = this
    app.fl()
    app.fg({
      url: "/api/StoreManage.ashx?action=GetTechniciansList",
      data: {
        StoreId: data.StoreId,
        pageIndex: data.technicianInfo.page,
        pageSize: 10,
      }
    }, true).then(r => {
      app.fh()
      let datar = r.data.Data
      if (data.technicianInfo.page == 1) {
        data.technicianInfo.list = datar
      } else {
        data.technicianInfo.list = data.technicianInfo.list.concat(datar)
      }
      if (datar.length < 10) {
        data.technicianInfo.finish = true
      }
      data.technicianInfo.page++
      that.setData({
        technicianInfo: data.technicianInfo
      })
    })
  },

  // 门店广告图跳转
  dealActivty(e) {
    let _this = this,
      url,
      item = _this.data.getActivtyInfo.data[e.currentTarget.dataset.index]
    // 0次数卡，1优惠券，2抵用券
    console.log(e, '22222222');
    switch (e.currentTarget.dataset.type) {
      case 0:
        url = `/fuPackageA/fuProductCou/fuProductCou?pId=${item.AdValue}`
        break;
      case 1:
        url = 'request'
        break;
      case 2:
        url = `/fuPackageA/fuNearStore/fuNearStore`
        break;
      case 3:
        url = 'miniProgram'
        break;
      case 5:
        url = `/fuPackageA/fuRewordList/fuRewordList`
        break;
    }
    if (url == 'request') {
      app.fl()
      app.fg({
        action: 'UserGetCoupon',
        openID: _this.data.openId,
        shopType: 2,
        couponId: item.AdValue,
      }).then(r => {
        app.fh()
        app.fa(r.data.Message)
      })
    } else if (url == 'miniProgram') {
      wx.navigateTo({
        url: `/fuPackageA/fuProductT/fuProductT?prDid=${item.AdValue}&pagetype=undefined&storeid=null&dname=undefined&IsShowVideo=true`,
      })
      // wx.navigateToMiniProgram({
      //   appId: 'wx2e40ad78f7098898',
      //   path: `/fuPackageA/fuProductT/fuProductT?prDid=${item.AdValue}&pagetype=undefined&storeid=null&dname=undefined&IsShowVideo=true`,
      //   success: function (e) {
      //     console.log(e)
      //   },
      //   fail: function (e) {
      //     console.log(e)
      //   }
      // })
    } else {
      wx.navigateTo({
        url: url,
      })
    }
  },

  // 前往门店详情
  toStoreDetail() {
    wx.navigateTo({
      url: '/fuPackageA/fuStoreDet/fuStoreDet',
    })
  },

  // 复制微信号
  copyWxNum(e) {
    let idx = e.currentTarget.dataset.idx,
      _this = this
    wx.setClipboardData({
      data: _this.data.customerList[idx].wxNum
    })
  },

  // 关闭
  closeCustomer() {
    this.setData({
      isShowPopup: false
    })
  },

  // 打开客服弹窗
  openCustomer() {
    if (!this.data.existCustomer) {
      wx.showToast({
        title: '当前没有客服信息',
        icon: 'none'
      })
      return
    }
    this.setData({
      isShowPopup: true
    })
  },

  btn_move: function (e) {
    var yaxes = parseInt((e.changedTouches[0].clientY - 20)),
      xaxes = parseInt((e.changedTouches[0].clientX - 20))
    this.setData({
      clientY: yaxes + 'px',
      clientX: xaxes + 'px'
    })
  },
  btn_end: function (e) {
    var width = parseInt((this.data.windowWidth) / 2),
      yaxes = parseInt((e.changedTouches[0].clientY - 20)),
      xaxes = parseInt((e.changedTouches[0].clientX - 20))
    if (xaxes + 20 > width) {
      var xaxes = '85%'
    } else {
      var xaxes = '5%'
    }
    if (yaxes < 100) {
      var yaxes = '20%'
    } else {
      if (this.data.windowHeight - yaxes <= 100) {
        var yaxes = '80%'
      } else {
        var yaxes = yaxes + 'px'
      }
    }
    this.setData({
      clientY: yaxes,
      clientX: xaxes
    })
  },




  // 跳转页面
  toFNavc(e) {

    // if (e.currentTarget.dataset.index == 1 && e.currentTarget.dataset.to == '/pages/fujihang/fuBeaStore/fuBeaStore') {

    //   wx.navigateToMiniProgram({
    //     appId: 'wx2e40ad78f7098898',
    //     path: 'pages/fujihang/fuBeaStore/fuBeaStore',
    //     //envVersion:'develop',
    //     success: function(e) {
    //       console.log(e)
    //     },
    //     fail: function(e) {
    //       console.log(e)
    //     }
    //   })


    //   return
    //   wx.removeStorage({
    //     key: 'getStore'
    //   })
    // }
    wx.navigateTo({
      url: e.currentTarget.dataset.to
    })
    wx.switchTab({
      url: e.currentTarget.dataset.to
    })


  },

  // 点击banner
  clickImg(e) {
    let idx = e.currentTarget.dataset.id,
      _this = this,
      url,
      item = _this.data.background[idx]
    // 0次数卡，1优惠券，2抵用券，3商品
    switch (item.AdType) {
      case 0:
        url = 'miniProgram'
        break;
      case 1:
        url = 'request'
        break;
      case 2:
        url = `/fuPackageA/fuNearStore/fuNearStore`
        break;
      case 3:
        url = `/fuPackageA/fuProductT/fuProductT?prDid=${item.AdValue}&pagetype=undefined&storeid=null&dname=undefined&IsShowVideo=true`
        break;
      case 4://积分兑换
        url = `/pages/pointDetail/pointDetail?id=${item.AdValue}`
        break;
      case 5://奖金池
        url = `/fuPackageA/fuRewardPool/fuRewardPool?aid=${item.AdValue}`
        break;
      case 6://天天抽奖
        // url = `/fuPackageA/fuPrizeList/fuPrizeList?dzOrZxz=true`
        url = '/fuPackageA/fuRewordList/fuRewordList'
        break;
      case 7:
        url = "/fuPackageA/fuXJMS/fuXJMS"
        /*    url='/fuPackageA/fuProductT/fuProductT?pagetype=undefined&storeid=null&dname=undefined&prDid='+item.AdValue */
        break;
    }
    if (url == 'request') {
      app.fl()
      app.fg({
        action: 'UserGetCoupon',
        openID: _this.data.openId,
        shopType: 2,
        couponId: item.AdValue,
      }).then(r => {
        app.fh()
        app.fa(r.data.Message)
      })
    } else if (url == 'miniProgram') {
      wx.navigateTo({
        url: `/fuPackageA/fuProductCou/fuProductCou?pId=${item.AdValue}`
      })
      // wx.navigateToMiniProgram({
      //   appId: 'wxa4d03cf8e1ea5904',
      //   path: `fuPackageA/fuProductCou/fuProductCou?pId=${item.AdValue}&type=1&nowCityId=${_this.data.nowCityId}&
      //   userlatitude=${_this.data.userlatitude}&userlongitude=${_this.data.userlongitude}`,
      //   success: function (e) {
      //     console.log(e)
      //   }, fail: function (e) {
      //     console.log(e)
      //   }
      // })
    } else {
      wx.navigateTo({
        url: url,
      })
    }
  },


  // 
  getZhiBo() {
    let data = this.data, that = this
    app.fl()
    app.fg({
      url: '/api/LiveInfo.ashx?action=GetLiveRoomByTop',

    }, true).then(r => {
      app.fh()
      if (r.data.Status == 'true') {
        that.setData({
          zhuBoList: r.data.Data
        })

      } else app.fa(r.data.Message)
      console.log(r)
    })
  },








  toFN(e) {
    let data = this.data
    if (e.currentTarget.dataset.rid) app.globalData.roomId = e.currentTarget.dataset.rid
    if (e.currentTarget.dataset.to == '/pages/fujihang/fuTeacher/fuTeacher') {
      wx.navigateTo({
        url: '/pages/fujihang/fuTeacher/fuTeacher?StoreId=' + data.getStore.StoreId
      })
      return
    }
    if (e.currentTarget.dataset.to == '/fuPackageA/fuLuckDraw/fuLuckDraw') {



      wx.navigateTo({
        url: '/fuPackageA/fuRewordList/fuRewordList'
      })
      // if (app.globalData.GetMembersInfo.CellPhone) {
      //   wx.navigateTo({
      //     url: '/fuPackageA/fuLuckDraw/fuLuckDraw'
      //   })
      // } else {
      //   wx.navigateTo({
      //     url: '/fuPackageA/fuEveryDay/fuEveryDay'
      //   }) 
      // }
      // wx.navigateToMiniProgram({
      //   appId: 'wx2e40ad78f7098898',
      //   path: 'pages/fujihang/fuBeaStore/fuBeaStore?post='+e.currentTarget.dataset.post,
      //   //envVersion:'develop',
      //   success: function(e) {
      //     console.log(e)
      //   },
      //   fail: function(e) {
      //     console.log(e)
      //   }
      // })




      return
    }


    if (e.currentTarget.dataset.to == '/pages/fujihang/fuBeaStore/fuBeaStore') {
      wx.switchTab({
        url: '/pages/fujihang/fuBeaStore/fuBeaStore'
      })
      // wx.navigateToMiniProgram({
      //   appId: 'wx2e40ad78f7098898',
      //   path: 'pages/fujihang/fuBeaStore/fuBeaStore',
      //   //envVersion:'develop',
      //   success: function (e) {
      //     console.log(e)
      //   },
      //   fail: function (e) {
      //     console.log(e)
      //   }
      // })
      return
    }
    // if (!e.currentTarget.dataset.to) {
    //   wx.switchTab({
    //     url: '/pages/fujihang/fuNewMarket/fuNewMarket?post=' + e.currentTarget.dataset.post,
    //   })

    //   // wx.navigateToMiniProgram({
    //   //   appId: 'wx2e40ad78f7098898',
    //   //   path: 'pages/fujihang/fuNewMarket/fuNewMarket?post=' + e.currentTarget.dataset.post,
    //   //   //envVersion:'develop',
    //   //   success: function (e) {
    //   //     console.log(e)
    //   //   },
    //   //   fail: function (e) {
    //   //     console.log(e)
    //   //   }
    //   // })
    //   return

    // }
    if (!e.currentTarget.dataset.to) return wx.switchTab({
      url: '/pages/fujihang/fuNewMarket/fuNewMarket'
    })
    wx.switchTab({
      url: e.currentTarget.dataset.to
    })
    wx.navigateTo({
      url: e.currentTarget.dataset.to
    })

  },


  // 跳转详情
  handleDetail(e) {
    const {
      productid,
      storeid,
      pagetype,
      dname
    } = e.currentTarget.dataset; //商品id和门店id
    wx.navigateTo({
      url: `/fuPackageA/fuProductT/fuProductT?prDid=${productid}&pagetype=${pagetype}&storeid=${storeid}&dname=${dname}&IsShowVideo=` + this.data.IsShowVideo,
    })
    wx.setStorageSync("buyType", "fightgroup")
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    wx.hideShareMenu()
    wx.removeStorage('callBackLogin')
    console.log(options, '4555555555555');
    app.globalData.storeId = options.id ? options.id : app.globalData.storeId
    console.log(app.globalData.storeId, '222222222222222')
    if (options.referralUserId) wx.setStorage({
      key: 'referralUserIdTwo',
      data: options.referralUserId
    })
    let that = this
    wx.getSystemInfo({
      success(res) {
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight
        })
      }
    })
    this.getZhiBo()
    this.getLiveData()
    // this.getTeamBuy()
    this.data.StoreId = app.globalData.storeId

    if (app.globalData.storeId) {
      this.getUserPoints()
      this.getService()
      this.getSwiperData(app.globalData.storeId)
      // this.getTeamBuy(app.globalData.storeId)
      this.getStoreIndexFN(app.globalData.storeId)
      this.getActivityImg(app.globalData.storeId)
      this.getCateCou()
      this.getTechnicianList()
      this.getXiaoDianPro()
      return
    }
    wx.getStorage({
      key: 'getStore',
      success: function (r) {
        that.setData({
          StoreId: r.data.StoreId
        })
        app.globalData.storeId = r.data.StoreId
        that.getService()
        that.getUserPoints()
        that.getSwiperData(r.data.StoreId)
        // that.getTeamBuy(r.data.StoreId)
        that.getStoreIndexFN(r.data.StoreId)
        that.getActivityImg(r.data.StoreId)
        that.getCateCou()
        that.getTechnicianList()
        that.getXiaoDianPro(r.data.StoreId)


      },
      fail: function () {
        wx.reLaunch({
          url: '/fuPackageA/fuIndexG/fuIndexG'
        })
      }
    })


  },


  getStoreIndexFN(id) {
    let data = this.data,
      that = this
    app.fl()
    app.fg({
      action: 'SetStoreIndexPic',
      Type: 2,
      StoreId: id
    }).then(r => {
      app.fh()
      that.setData({
        getStoreIndex: r.data.Message
      })
      console.log(r, '=======');
    })
  },

  // 获取活动图片
  getActivityImg(id) {
    let data = this.data,
      that = this
    app.fl()
    app.fg({
      action: 'SetStoreIndexPic',
      Type: 5,
      StoreId: id
    }).then(r => {
      app.fh()
      let a = {
        isLength: false
      }
      r.data.Message.forEach(c => {
        if (c.IsStore) a.isLength = true
      })
      a.data = r.data.Message
      that.setData({
        getActivtyInfo: a
      })
    })
  },



  // 
  getSwiperData(id) {
    var _this = this
    wx.request({
      url: app.gethsyurl,
      data: {
        action: 'GetBannerPictures',
        SetType: 2,
        StoreId: id
      },
      success: function (res) {
        console.log(res, 2222222);
        let bg = []
        res.data.rows.forEach(c => {
          c.IsStore == 0 ? '' : bg.push(c)
        })
        _this.setData({
          background: bg.length ? bg : res.data.rows.slice(0, 3)
        })
        console.log(_this.data.background, 2222221111111);

      }
    })
  },


  // 
  openAlert(e) {
    this.setData({
      showHui: true,
      liveId: e.currentTarget.dataset.id,
      videoList: [],
      huiPage: 1,
      huiFinsh: false,
    })
    this.huifan()
  },

  huifan() {
    let data = this.data, that = this
    if (data.huiFinsh) return
    app.fl()
    app.fg({
      url: "/api/LiveInfo.ashx?action=GetLiveReplay",
      data: {
        liveId: data.liveId,
        size: 10,
        index: data.huiPage,
      },
    }, true).then(r => {
      app.fh()
      if (r.data.Status == 'true' && r.data.Data) {
        data.videoList = [...data.videoList, ...r.data.Data.Data]
        that.setData({
          videoList: data.videoList,
          huiPage: ++data.huiPage,
          huiFinsh: r.data.Data.Data.length < 10,
        })
      } else app.fa(r.data.Message)
      console.log(r)
    })
  },

  // getZbFN() {
  //   var _this = this
  //   wx.request({
  //     url: app.gethsyurl,
  //     data: {
  //       action: 'GetBannerPictures'
  //     },
  //     success: function (res) {
  //       _this.setData({
  //         background: res.data.rows
  //       })
  //     }
  //   })
  // },



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
        console.log('0000000000');
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
        console.log('gggggggg');
        that.getStoreFN()
      }
    })
  },


  //点击二维码
  handleCode() {
    wx.navigateTo({
      url: '/fuPackageA/fuStroeCode/fuStroeCode',
      success: (result) => { },
      fail: () => { },
      complete: () => { }
    });
  },

  // 
  getXiaoDianPro(id) {
    let data = this.data,
      that = this
    app.fl()
    app.fg({
      url: "/api/ProductHandler.ashx?action=GetProducts",
      data: {
        pageSize: 6,
        pageIndex: 1,
        RsSaleStatus: 1,
        RStoreId: app.globalData.StoreId || id,
      }
    }, true).then(r => {
      app.fh()
      if (r.data.Result.Status == "Success") {

        that.setData({
          getXiaoDian: r.data.Result.Data
        })
      } else app.fa(r.data.message)
      console.log(r, 123333333333333)
    })
  },


  // 
  toFFN(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.to
    });
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
  // 
  getProductData(id) {
    let data = this.data,
      that = this
    app.fl()
    app.fg({
      url: '/api/ProductHandler.ashx?action=GetProducts',
      data: {
        pageSize: 10,
        pageIndex: 1,
        // tagId:18,
        StoreId: id,
        ProductType: 0
      },
    }, true).then(r => {
      console.log("输出数据首页", r);
      app.fh()
      if (r.data.Result.Status == 'Success') {
        let datar = r.data.Result.Data
        datar.forEach(c => {
          data.proList.data.push(c)
        })
        if (datar.length < 10) data.proList.finsh = true
        data.proList.page++
        that.setData({
          proList: data.proList,
          IsShowVideo: r.data.Result.IsShowVideo
        })
      } else app.fa('获取失败')
    })
  },

  getCateCou() {
    let data = this.data,
      that = this
    app.fl()
    app.fg({
      action: 'GetAllCategories',
      Type: 1
    }).then(r => {
      app.fh()
      if (r.data.Status == 'OK') {
        data.hotPro = []
        r.data.Data.forEach(c => {
          let a = {
            name: c.name,
            post: c.cid,
            data: [],
            finsh: false,
          }
          data.hotPro.push(a)
        })
        data.hotPro.push({
          name: '更多 >'
        })
        that.setData({
          hotPro: data.hotPro
        })
        that.getCou()
      }
      console.log(r, 3)
    })
  },

  // 
  onChange(e) {
    if (e.detail.index == this.data.hotPro.length - 1) {
      this.setData({
        active: 1
      })
      wx.navigateTo({
        url: '/fuPackageA/fuCouponList/fuCouponList'
      })

      return
    }
    this.setData({
      active: e.detail.index
    })
    this.getCou()
  },

  // 
  getCou() {
    let data = this.data,
      that = this
    if (data.hotPro[data.active].finsh) return
    app.fl()
    app.fg({
      action: 'GetStoreActivityCardList',
      CategoryId: 0, //data.hotPro[data.active].post
      PageSize: 10,
      page: 1,
      StoreId: data.StoreId,
      StoreSaleStatus: 1,
    }).then(r => {
      app.fh()
      if (r.data.Status == 'OK') {
        data.hotPro[data.active].data = r.data.Data
        data.hotPro[data.active].finsh = true
        that.setData({
          hotPro: data.hotPro
        })
      }
    })
  },

  //  
  // getTeamBuy(id) {
  //   let data = this.data,
  //     that = this
  //   app.fl()
  //   app.fg({
  //     url: '/API/ProductHandler.ashx?action=GetFightGroupActivityInfos',
  //     data: {
  //       pageSize: 4,
  //       pageIndex: 1,
  //       sortBy: 'SalePrice',
  //       StoreId: id
  //     },

  //   }, true).then(r => {
  //     // console.log("拼团数据", r);
  //     app.fh()
  //     if (r.data.Result.Data) {
  //       that.setData({
  //         teamList: r.data.Result.Data
  //       })
  //     }
  //   })
  // },


  // 设置全局变量
  getStoreFN() {

    let data = this.data,
      that = this
    console.log(221111111111111, data.StoreId, data.fujihang.Latitude, data.fujihang.Longitude)
    app.fl()
    app.fg({
      url: "/api/PublicHandler.ashx?action=GetBaseStoreInfo",
      data: {
        StoreId: data.StoreId,
        Lat: data.fujihang.Latitude,
        Lng: data.fujihang.Longitude,
      }
    }, true).then(r => {
      console.log(r, 1888888221111111111111)
      app.fh()
      if (r.data.Status == "Success") {
        r.data.Result.StoreId = data.StoreId
        if (r.data.Result.IsStop) {
          app.fa('该门店已关闭，即将跳往其他门店')
          wx.removeStorageSync('getStore')
          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/qidong/qidong'
            })
          }, 3450)
          return
        }

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
  },



  bindchangeImg: function (e) {
    this.setData({
      current: e.detail.current
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  toLogin() {
    if (!this.data.shareOpen) {
      setTimeout(() => {
        wx.switchTab({
          url: "/pages/mine/mine"
        })
      }, 1450)
      app.fa('您还未登录，即将去个人中心登录')
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let _this = this, that = this
    wx.hideTabBar({})
    if (app.globalData.GetMembersInfo && app.globalData.GetMembersInfo.openId) {
      this.setData({
        shareOpen: true
      })
    }
    if (!app.globalData.GetMembersInfo || !app.globalData.GetMembersInfo.openId) {
      app.getOpenId(function (a) {
        app.setMembersInfo({
          openId: a
        })
        that.getListT()

      })


    } else {
      that.getListT()

    }

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },


  // 获取客服
  getService() {
    let data = this.data,
      that = this
    app.fl()
    app.fg({
      action: 'SetStoreServices',
      StoreId: data.StoreId,
      Type: 1, //0-设置客服，1-获取客服

    }).then(r => {
      app.fh()
      if (r.data.Status == 'Success') {
        if (r.data.Message == null) {
          that.data.existCustomer = false
        } else {
          that.data.existCustomer = true
          let res = JSON.parse(r.data.Message),
            customerList = [],
            imgArr, nameArr, i
          imgArr = res.WxCodeImg.split(',')
          nameArr = res.WxName.split(',')
          for (i = 0; i < imgArr.length; i++) {
            customerList[i] = {
              wxNum: nameArr[i],
              img: imgArr[i]
            }
          }
          that.setData({
            customerList: customerList
          })
          console.log('客服信息', customerList)
        }
      }
    })
  },

  // 
  openImg(e) {
    let url = []
    url.push(e.currentTarget.dataset.url)
    wx.previewImage({
      current: url[0], // 当前显示图片的http链接
      urls: url // 需要预览的图片http链接列表
    })
  },

  // 

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getZhiBo()
    this.getLiveData()
    let that = this
    app.fl()
    setTimeout(() => {
      wx.stopPullDownRefresh()
      app.fh()
    }, 3000)
    this.data.technicianInfo = {
      list: [],
      page: 1,
      finish: false
    }
    if (app.globalData.storeId) {

      this.getService()
      this.getSwiperData(app.globalData.storeId)
      // this.getTeamBuy(app.globalData.storeId)
      this.getStoreIndexFN(app.globalData.storeId)
      this.getActivityImg(app.globalData.storeId)
      this.getCateCou()
      this.getTechnicianList()
      this.getXiaoDianPro()
      //  this.getProductData(app.globalData.storeId)
      return
    }
    wx.getStorage({
      key: 'getStore',
      success: function (r) {
        that.setData({
          StoreId: r.data.StoreId
        })
        that.getService()

        that.getSwiperData(r.data.StoreId)
        // that.getTeamBuy(r.data.StoreId)
        that.getStoreIndexFN(r.data.StoreId)
        that.getActivityImg(r.data.StoreId)
        // that.getProductData(r.data.StoreId)
        that.getCateCou()
        that.getTechnicianList()
        that.getXiaoDianPro(r.data.StoreId)

      },
      fail: function () {
        wx.reLaunch({
          url: '/fuPackageA/fuIndexG/fuIndexG'
        })
      }
    })
    that.getUserPoints()

  },


  //跳转精选商品更多列表
  handleList(e) {
    wx.navigateTo({
      url: '/fuPackageA/fuShop/fuShop',
    });
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this
    // if((this.data.nearList.data2.length+this.data.nearList.data1.length)%10==0){
    that.getListT()
    // }




  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let data = this.data
    if (!app.globalData.GetMembersInfo || !app.globalData.GetMembersInfo.openId) return {
      title: data.getStore.StoreName,
      path: '/pages/fujihang/fuIndexG/fuIndexG?id=' + data.StoreId + "&referralUserId=" + wx.getStorageSync('sjUserId'),
      imageUrl: data.getStore.StoreImages,
      success: (res) => {
        app.fa('转发成功')
      },
      fail: (res) => {
        app.fa('转发失败')
      }
    }

    else return {
      title: data.getStore.StoreName,
      path: '/pages/fujihang/fuIndexG/fuIndexG?id=' + data.StoreId + "&referralUserId=" + app.globalData.GetMembersInfo.UserId,
      imageUrl: data.getStore.StoreImages,
      success: (res) => {
        app.fa('转发成功')
      },
      fail: (res) => {
        app.fa('转发失败')
      }

    }
  }
})