// pages/mine/mine.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Qcode: false, //二维码弹窗
    imgUrl: app.imgUrl,
    imgUrl2: app.newImg,
    GetMembersInfo: '', //用户信息
    myQcode: '',//我的二维码
    logShow: false,
    imgs: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/sade.jpg',
    idCard: [{
      name: '技师',
      img: 'https://bcdj.9oasd.com/images/teach01.png',
    },
    {
      name: '店主',
      img: 'https://bcdj.9oasd.com/images/shop01.png',
    },
    {
      name: '执行',
      img: 'https://bcdj.9oasd.com/images/team01.png',
    },
    {
      name: '黑卡代理',
      img: 'https://bcdj.9oasd.com/images/daili.png',
    },
    ],
    zxtdzShow: false,//执行者团队长
    zxtdzList: ['执行者', '执行团队长'],
    navBar: [{
      name: '首页',
      img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/meunsy@3x.png',
      to: '/pages/fujihang/fuIndexG/fuIndexG',
    },
    {
      name: '惠选商城',
      img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/menu@3x4.png',
      to: '/pages/fujihang/fuNewMarket/fuNewMarket',
    },
    {
      img: 'syAdd.png?2',
      to: '/fuPackageA/fuRelease/fuRelease'

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
      img: "http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/sele@3x5.png",
      to: '/pages/mine/mine',
    },
    ], //总部导航条
    xz: 3,
    yq_pt_cj_qd: [
      {
        // img: app.imgUrl + 'friend051.png',
        img: app.newImg + 'user_tianjia@2x.png',
        name: '邀请好友',
        url: '',
      },
      {
        // img: app.imgUrl + 'tuan051.png',
        img: app.newImg + 'user_pintuan@2x.png',
        name: '拼团',
        url: '/fuPackageA/fuMyPuzzle/fuMyPuzzle'
      },
      {
        // img: app.imgUrl + 'draw051.png',
        img: app.newImg + 'user_jifen@2x.png',
        name: '抽奖',
        url: '/fuPackageA/fuPrizeList/fuPrizeList',
      },
      {
        // img: app.imgUrl + 'draw051.png',
        img: ' http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/integralShop.png?1',
        name: '积分兑换',
        url: '/pages/fujihang/fuBeaStore/fuBeaStore',
      },

      // {
      //   // img: app.imgUrl + 'signIn051.png',
      //   img: app.newImg +'user_qiandao@2x.png',
      //   name:'签到有礼',
      //   url:'',
      // },
    ],
    getStore: {},//获取门店数据
    isDoor: false,
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
    orderG: [
      {
        name: '待付款',
        img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/dfk003.png?1',
        to: '/pages/pointAllOrder/pointAllOrder?active=0',
      },
      {
        name: '待发货',
        img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/dfh003.png?1',
        to: '/pages/pointAllOrder/pointAllOrder?active=1',
      },
      {
        name: '待收货',
        img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/dsh003.png?1',
        to: '/pages/pointAllOrder/pointAllOrder?active=2',
      },
      {
        name: '待评价',
        img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/dpj003.png?1',
        to: '/pages/pointAllOrder/pointAllOrder?active=3',
      },
      {
        name: '全部订单',
        img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/qbdd003.png?1',
        to: '/pages/pointAllOrder/pointAllOrder?active=6',
      },
    ],
    sygnG: [
      {
        name: "个人信息",
        to: '/pages/PersonalInformationMember/PersonalInformationMember',
      },
      {
        name: "收货地址",
        to: '/wuPackageB/recAddress/recAddress',
      },
      {
        name: "我的收藏",
        to: '/pages/fujihang/fuCollect/fuCollect',
      },
      {
        name: "帮助服务",
        to: '/pages/fujihang/fuHelp/fuHelp?role=Client',
      },

      {
        name: "共享经济",
        to: '/pages/myCommission/myCommission?type=0',
      },
      {
        name: "更换手机",
        to: '',
      },
      {
        name: "联系客服",
        to: '/pages/customerService/customerService',
      },
      {
        name: "关于我们",
        to: '',
      },
      {
        name: "我的视频",
        to: '/fuPackageA/fuJitterPeo/fuJitterPeo',
      },
      {
        name: "我的上级",
        to: '/pages/fujihang/fuSuperior/fuSuperior',
      },
      {
        name: "交易记录",
        to: '/fuPackageA/fuRecordJiLu/fuRecordJiLu',
      },
      {
        name: "建议反馈",
        to: '/fuPackageA/fuApplyCom/fuApplyCom',
      },
      {
        name: "消息订阅",
        to: '/fuPackageA/fuSubscribePage/fuSubscribePage',
      },
     

    ],

    customParams: encodeURIComponent(JSON.stringify({ sharedId: 12345678910 })),    // 测试直播间自定义参数
  },

  toMH() {
    wx.navigateTo({
      // url: '/fuPackageA/fuFunChoose/fuFunChoose'
      url: '/fuPackageA/fuMyTowQH/fuMyTowQH'
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

  // 
  yqptFN(e) {
    let c = e.currentTarget.dataset
    console.log(e, 1111111);
    switch (c.index) {
      case 0:
        this.QcodeFN()
        break;
      // case 3:
      //   this.qiandao()
      //   break;
      default:
        wx.navigateTo({
          url: c.url
        })
        wx.switchTab({
          url: c.url
        })
        break;
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideTabBar({})


    // 测试
    console.log("输出测试options", options);
    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      console.log("解码后的值", scene);
      //&是我们定义的参数链接方式
      let id = scene.split("=")[1];
      console.log("输出裁剪后的值", id);
      this.setData({
        authid: id
      })
      this.bindData(id);
      this.bindInfo(id);
    }


    // app.fg({
    //   action:'GetShopExtension',
    //   openId:"oKpzE5KafB-Ctptnm6T6pVQeZXZs",
    //   Path:'/pages/fujihang/bchome/bchome',
    // }).then(r=>{
    //   console.log(r)
    //   if(r.data.Status=="OK"){
    //     let datar=r.data.data[0]
    //     console.log( datar)
    //   }else app.fa("获取二维码失败")
    // })

  },

  //绑定技师关系
  bindData(id) {
    wx.showLoading({
      title: "绑定中~",
      mask: true,
      success: (res) => {
        if (res.data.Status) {
          wx.showToast({
            title: res.data.Message,
            icon: 'none',
            image: '',
            duration: 1500,
            mask: false,
            success: (res) => {

            },
            fail: () => { },
            complete: () => { }
          });

        }
      },
      fail: () => { },
      complete: () => { }
    });

    wx.request({
      url: app.data.url + '/API/WeChatApplet.ashx',
      data: {
        action: 'BindRole',//	是	string	BindRole
        openId: wx.getStorageSync('openId'),//	是	string	微信openId
        id: id,//	是	int	角色ID
        type: 'TC',//	是	string	角色类型 TC技师TH团队长BS渠道ST店主
      },
      header: { Cookie: wx.getStorageSync('cookieFu') },
      success: (res) => {
        console.log("技师绑定状态", res);
        wx.hideLoading();

      },
      fail: () => { },
      complete: () => { }
    });
  },
  bindInfo(id) {
    let data = {
      AuthId: id
    }
    wx.request({
      url: app.data.url + '/api/StoreManage.ashx?action=UserScanBindCode',
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        Cookie: wx.getStorageSync('cookieFu') || app.data.cookie
      },
      success: (res) => {
        console.log("绑定结果", res);
        if (res.data.Status == "OK") {
          wx.hideLoading();
          wx.showToast({
            title: '绑定成功!!!',
            icon: 'success',
            duration: 1500,
            mask: true,
            success: (result) => {
              setTimeout(() => {
                wx.reLaunch({
                  url: '/pages/fujihang/fuIndexG/fuIndexG',
                });

              }, 1500);
            },
            fail: () => { },
            complete: () => { }
          });

        }
      },
      fail: () => { },
      complete: () => { }
    });
  },
  // 个人信息编辑
  toEditInfo: function (e) {
    wx.navigateTo({
      url: '/pages/PersonalInformationMember/PersonalInformationMember'
    })
  },

  getuserstart() { //判断用户是否在线


  },
  //二维码弹窗
  QcodeFN() {
    let that = this
    app.fl()
    let sid = app.globalData.appId == 'wxa4d03cf8e1ea5904' || app.globalData.appId == 'wx5b277c6cbe1f88f4'||app.globalData.appId == 'wx442315f95b2a6113' ? wx.getStorageSync("getStore").StoreId : ''
    console.log(sid, 2222222222);
    app.fg({
      action: "GetShopExtension",
      openId: app.globalData.GetMembersInfo.openId,
      Path: 'pages/qidong/qidong?ReferralUserId=' + app.globalData.GetMembersInfo.UserId + '&sid=' + sid
    }).then(r => {
      console.log("二维码", r);
      app.fh()
      if (r.data.Status == "OK") {
        that.setData({
          Qcode: true,
          myQcode: r.data.data[0].MiniProgramCard
        })
      } else app.fa(r.data.Message)
    })
  },
  exitImgFN() {
    this.setData({
      Qcode: false
    })
  },
  // 保存二维码
  saveImgFN() {
    let url = this.data.myQcode.replace('http:', 'https:')
    wx.downloadFile({
      url: url,     //仅为示例，并非真实的资源
      success: function (res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode == 200) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(res) {
              app.fa('保存图片成功！')
            },
            fail(res) {
              wx.showModal({
                title: '提示',
                content: '请打开相册授权',
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
      }
    })
  },
  toFNNG(e) {
    if (!e.currentTarget.dataset.url && e.currentTarget.dataset.index == 5) return this.toFNPhone()
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },

  // 跳转页面
  toFN(e) {
    var type = e.currentTarget.dataset.type
    if (type == 'info') return
    wx.navigateTo({
      url: e.currentTarget.dataset.to
    })
  },
  // 身份入口
  toFNF(e) {
    let id = e.target.dataset.index
    let indexData = app.globalData.GetMembersInfo
    let that = this
    app.getOpenId(function (a) {
      app.fl()
      app.fg({
        action: 'GetMembersInfo',
        openId: a
      }).then(r => {
        console.log("身份入口请求", r);
        app.fh()
        if (r.data.Status == "OK") {
          let dataR = r.data.Data
          dataR.openId = a
          app.setMembersInfo(dataR)
          that.setData({
            GetMembersInfo: dataR
          })
          switch (id) {
            case 0:
              if (!dataR.tcid) return app.fa("您还不是技师！")
              break;
            case 1:
              if (!dataR.stid) return app.fa("您还不是店主！")
              break;
            // case 2:
            //   if (!dataR.thid) return app.fa("您还不是执行团队长！")
            //   break;
            case 3:
              if (!dataR.bsid) return app.fa("您还不是黑卡代理！")
              break;
          }
          console.log(id)
          if (id == 2) {
            that.setData({
              zxtdzShow: true
            })
            return
          }
          wx.navigateTo({
            url: '/pages/fujihang/fuMy/fuMy?id=' + id
          })
        } else {
          wx.redirectTo({
            url: "/pages/login/login"
          });
        }
      })
    })

  },

  // 签到
  qiandao() {
    let that = this
    app.fl()
    app.fg({
      action: 'SignIn',
      openId: app.globalData.GetMembersInfo.openId,
    }).then(r => {
      console.log("签到请求", r);
      app.fh()
      if (r.data.Status == "OK") that.referUser()
      app.fa(r.data.Message)

    })
  },

  // 执行者或者团队长
  zxtdzFN(e) {
    let index = e.currentTarget.dataset.index
    let data = this.data.GetMembersInfo

    if (index == 0) {
      if (data.ExcutorId) {
        wx.navigateTo({
          url: '/pages/fujihang/fuMy/fuMy?id=' + 4
        })
      }
      else app.fa('您还不是执行者')
    }

    if (index == 1) {
      if (data.thid) {
        wx.navigateTo({
          url: '/pages/fujihang/fuMy/fuMy?id=' + 2
        })
      } else app.fa('您还不是执行团队长')
    }
    this.setData({
      zxtdzShow: false
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
    this.referUser()

    wx.removeStorage({
      key: 'upgrade'
    })

    let that = this
    wx.getStorage({
      key: 'getStore',
      success: function (r) {
        that.setData({
          getStore: r.data,
          navBar: [{
            name: '首页',
            img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/meunsy@3x.png',
            to: '/pages/fujihang/fuIndexG/fuIndexG',
          },
          {
            name: '惠选商城',
            img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/menu@3x4.png',
            to: '/pages/fujihang/fuNewMarket/fuNewMarket',
          },
          {
            img: 'syAdd.png?2',
            to: '/fuPackageA/fuRelease/fuRelease'

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
            img: "http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/sele@3x5.png",
            to: '/pages/mine/mine',
          },
          ], //门店导航条
          isDoor: true,
          xz: 5,
        })
        wx.setNavigationBarTitle({
          title: r.data.StoreName
        })
      },
      fail: function () {
        wx.setNavigationBarTitle({
          title: '头道惠'
        })
        that.setData({
          navBar: [{
            name: '首页',
            img: 'sySy.png?2',
            to: '/pages/fujihang/fuIndexZB/fuIndexZB',
          },
          {
            name: '大健康商城',
            img: 'sySc.png',
            to: '/pages/fujihang/fuNewMarket/fuNewMarket',
          },
          {
            img: 'syAdd.png?2',
            to: '/fuPackageA/fuRelease/fuRelease'

          },
          {
            name: '购物车',
            img: 'syYy.png?2',
            to: '/pages/cart/cart',
          },
          {
            name: '我的',
            img: "syMy.png?2",
            to: '/pages/mine/mine',
          },
          ], //门店导航条
          isDoor: false,
          xz: 4,
        })


      }
    })



  },

  // 获取个人信息
  referUser() {
    let that = this
    console.log(app.globalData, '=========');
    app.getOpenId(function (a) {

      app.fg({
        action: 'GetMembersInfo',
        openId: a,
        StoreId: app.globalData.appId == 'wxa4d03cf8e1ea5904' || app.globalData.appId == 'wx5b277c6cbe1f88f4'||app.globalData.appId == 'wx442315f95b2a6113' ? wx.getStorageSync("getStore").StoreId : ''
      }).then(r => {
        console.log("输出个人信息", r);

        // console.log("输出openid1", a);
        if (r.data.LinkProductId != 0 && r.data.TipStr && wx.setStorageSync('honKa') != 2) {
          wx.setStorage({
            key: 'honKa',
            data: 1
          })
          wx.showModal({
            title: '提示',
            content: r.data.TipStr,
            cancelText: "不再提示",
            confirmText: "前往升级",
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: `/fuPackageA/fuProductT/fuProductT?prDid=${r.data.LinkProductId}`
                })
              } else if (res.cancel) {
                wx.setStorage({
                  key: 'honKa',
                  data: 2
                })
              }
            }
          })

        }
        if (r.data.Status == "OK") {
          let dataR = r.data.Data
          if((dataR.IdentityName.indexOf('店长')!=-1||dataR.GradeName=='红卡会员'||dataR.GradeName=='智慧掌柜')&&that.data.sygnG[0].name!='直播体验') {
            that.data.sygnG.unshift( {
              img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/zvty.png',
              name: '直播体验',
              to: '/subPackageC/entranceMenu/index',
            })
            that.setData({
              sygnG:that.data.sygnG
            })
          }
          dataR.openId = a
          app.setMembersInfo(dataR)
          // console.log("进一步输出个人信息",dataR);
          that.setData({
            GetMembersInfo: dataR
          })
          // console.log("输出openid1", a);
          wx.setStorageSync('userinfo', dataR);
          console.log(app.globalData.GetMembersInfo, '3333333333333333');
          wx.setStorage({
            key: "sjUserId",
            data: app.globalData.GetMembersInfo.UserId
          })
          if (app.globalData.GetMembersInfo && !app.globalData.GetMembersInfo.CellPhoneVerification) {
            that.setData({
              newAlert: true
            })
          }
        } else {
          app.fa('获取个人信息失败，即将前往登录！')
          setTimeout(() => {
            wx.navigateTo({
              url: '/pages/login/login'
            })
          }, 1450)

        }

      })
    })
  },

  // 绑定手机
  toFNPhone() {
    if (app.globalData.GetMembersInfo.CellPhoneVerification) return app.fa('您已经绑定手机号！')
    wx.navigateTo({
      url: '/pages/fujihang/fuVerificatCode/fuVerificatCode'
    })
  },
  toFNColl() {
    wx.navigateTo({
      url: '/pages/fujihang/fuCollect/fuCollect'
    })
  },

  toFNXin(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },

  onCloseP() {
    this.setData({
      zxtdzShow: false,
      newAlert: false,
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
  registerFormSubmit: function (e) {
    app.fg({
      action: 'SaveFormId',
      openId: app.globalData.GetMembersInfo.openId,
      // openId:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',
      formId: e.detail.formId
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

  }
})