const app = getApp();
import { getGoodsDetail, getShopUser, getCartList, login } from '../../utils/requestApi.js';
import { countdown } from '../../utils/util';
var baseImg = "https://img.hmeshop.cn/hmeshopV3/20190708/bg_pinzhi.png";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jzjs: [
      {
        name: "精选好货",
        img: ' http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/dd@3x5.png'
      },
      {
        name: "正品保障",
        img: ' http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/dd@3x6.png'
      },
      {
        name: "假一赔十",
        img: ' http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/dd@3x1.png'
      },
      {
        name: "售后无忧",
        img: ' http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/dd@3x2.png'
      },
    ],
    num: '',//购物车数量
    imgss: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/sade.jpg',
    imgUrl: app.imgUrl2,
    newImg: app.newImg,
    currentTab: 1, // 当前选择的tab,
    statusBarHeight: null, //导航栏栏高度
    bannerArr: [], //bannerArr
    skuItem: [], // 规格选择列表
    skus: [], // 规格选中项
    //页面类型   新人限时抢购：1，  限时折扣：2，  9.9包邮：3， 品牌秒杀： 4， 即将销售：5， 拼团：6
    pageType: null,
    prDid: null, //商品id
    description: null, // 图文详情
    shopUser: [], //购买下单用户
    coupons: [], //  优惠卷
    promotionStr: [], // 优惠卷 ---> 促销 
    freight: null, //运费
    //商品信息
    goodsInfo: null,
    //福利列表
    welfareList: ['', '', '', '', '', '', '', '', '', '', ''],
    isShow: false,
    shareInfo: {},
    paramData: {},
    scene: '',//二维码
    userid: null, // 本地用户信息
    storeid: null, //店铺id
    len: '',//门店数组长度
    newList: [], //新门店
    dname: '', //初始门店名称
    groupData: [ //new拼团选项
      {
        title: '拼团价',
        price: '38.00',
        status: true,//控制是拼团还是单独购买
      },
      {
        title: '单独购买',
        price: '299.00',
        status: false,//控制是拼团还是单独购买
        old: '0.00'
      },
    ],
    newNum: 0,
    list: [
      {
        img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/sade.jpg',
        name: '五万',
        nums: '1'
      },
      {
        img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/sade.jpg',
        name: '隔热垫付',
        nums: '3'
      }
    ],
    groupStatus: false,
    groupShow: false,
    normal: {},//正常商品信息
    ginfo: {},//当前团购信息
    gsku: {},//团购sku列表
    qpShow: false,//打开拼团弹窗
    glist: [],//以开团列表
    nums: 0,//点击的是那个团
    newObj: {},//点击当前团的数据
    limitDay: '00',
    limitHours: '00',
    limitMin: '00',
    limitSecond: '00',
    groupList: [],  // 参团数据
    newSku: '',//商品sku
    ptype: '',// 0普通商品,2次数卡
    dprice: '',//单独购买的价格
    ddgm: '',//单独购买的标志

    typeforList: false, //是否为列表显示
    isUnfold: false, //是否展开下拉列表
    page: 1, //门店列表页码
    pageFinsh: false,
    storeList: [],
    nowStroeInfo: {},
    isNotStore: false,//是否是总部跳转过来的
    imgheights: [],
    current: 0,
    isTeam: 0,
    ratio: 1,
    qcdjs: '',
    RelatedProductNum: 0,
    deZDY:[],//自定义富文本
  },

  bindchangeImg: function (e) {
    this.setData({
      current: e.detail.current
    })
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
      key: "getStore",
      data: data.storeList[0]
    })
  },

    // 
    pointDetail(e){
      let data = e.currentTarget.dataset.data
      // pointDetail
      wx.navigateTo({
        url: '/pages/pointDetail/pointDetail?isSee=true&costprice=' + data.CostPrice + '&id=' + data.GiftId
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
      regionPath: wx.getStorageSync('nowAddressId'),
      Latitude: wx.getStorageSync('LatiLongitude').Latitude,
      Longitude: wx.getStorageSync('LatiLongitude').Longitude,
      FightGroupActivityId: data.goodsInfo.FightGroupActivityId,
      tag: 'store',
      pageindex: data.page,
      pagesize: 10
    }).then(r => {
      app.fh()
      let datar = r.data.Models
      if (datar.length == 0) return
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
        key: "getStore",
        data: data.storeList[0]
      })
      that.setData({
        typeforList: true,
        storeList: data.storeList,
        nowStroeInfo: data.storeList[0]
      }, () => {
        data.storeid = data.nowStroeInfo.StoreId
      })
    })
  },


  // 分享
  onShare() {
    var _this = this

    wx.request({
      url: getApp().data.url + '/API/QrcodeHandler.ashx?action=GetProductQrcode',
      data: {
        Type: 1,
        Path: 'fuPackageA/fuProductT/fuProductT?p=' + _this.data.prDid + '&r=' + app.globalData.GetMembersInfo.UserId + '&s=' + _this.data.storeid,
        // Path: 'pages/mine/mine?prDid=' + this.data.prDid + '&pagetype=' + this.data.pageType,
        SalePrice: this.data.goodsInfo.SalePrice,
        ProductId: this.data.prDid,
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
        _this.attachedShare(res.data.Result)
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

  closeShare() {
    this.setData({
      isShow: false
    })
  },
  // 分享好友
  onShareAppMessage(res) {
    console.log(this.data.storeid, '2222222233333333333', app.globalData.GetMembersInfo.UserId);
    console.log('prDid=' + this.data.prDid + '&storeid=' + this.data.storeid);
    return {
      title: '商品分享',
      path: `/fuPackageA/fuProductT/fuProductT?prDid=${this.data.prDid}&storeid=${this.data.storeid}&referralUserId=${app.globalData.GetMembersInfo.UserId}`,
      imageUrl: this.data.shareInfo.ImageUrl1
    }
  },

  // 轮播图变化
  imageLoad: function (e) { //获取图片真实宽度 
    console.log('123333333333333333334444444444');
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
    console.log(this.data.imgheights, '=======-------------------');
  },

  /*  */
  attachedShare() {
    var _this = this
    wx.getSystemInfo({
      success(res) {
        var width = res.windowWidth,
          height = res.windowHeight,
          ratio = 1;
        if (width <= 320) {
          ratio = 0.7
        } else if (320 < width <= 380) {
          ratio = 0.8
        }
        _this.setData({
          ratio: ratio
        })
        wx.showLoading({
          title: '正在生成海报',
        })
        _this.creatCanvas(ratio)
      }
    })

  },
  // 关闭蒙层
  closeMask(e) {
    console.log('2222222222222');
    this.setData({
      onShare: false,
      isShow: false
    })
  },
  // 检查权限
  checkAuthority() {
    var _this = this
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              _this.saveImg();
            },
            fail() {
              _this.getAuthorityAgain();
            }
          })
        } else {
          _this.saveImg();
        }
      }
    })
  },
  // 获取图片临时路径
  getImgPath(img) {
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: img,
        success(res) {
          resolve(res)
        },
        fail(e) {
          reject(e)
        }
      })
    })
  },
  // 创建画布
  creatCanvas(ratio) {
    const ctx = wx.createCanvasContext('qrCanvas', this),
      info = this.data.shareInfo;
    ctx.setFillStyle('#fff')
    ctx.fillRect(0, 0, 320 * ratio, 480 * ratio)
    // 顶部
    this.getImgPath(baseImg).then((res) => {
      ctx.drawImage(res.path, 0, 0, 320 * ratio, 27 * ratio);
      ctx.draw(true);
    })
    // 用户信息
    ctx.save()
    ctx.beginPath()
    ctx.arc(32 * ratio, 55 * ratio, 20 * ratio, 0, 2 * Math.PI, false)
    ctx.clip()
    this.getImgPath(info.Picture).then((res) => {
      ctx.drawImage(res.path, 12 * ratio, 35 * ratio, 40 * ratio, 40 * ratio);
      ctx.draw(true);
    })
    ctx.restore()
    ctx.font = "normal bold 13px arial,sans-serif"
    ctx.setFillStyle('#333')
    ctx.fillText(info.NickName, 62 * ratio, 50 * ratio)
    ctx.font = "normal lighter 11px arial,sans-serif"
    ctx.setFillStyle('#999')
    ctx.fillText('我有一份好东西要分享给你', 62 * ratio, 70 * ratio)
    // 商品图片
    this.getImgPath(info.ImageUrl1).then((res) => {
      ctx.drawImage(res.path, 16 * ratio, 90 * ratio, 288 * ratio, 248 * ratio);
      ctx.draw(true);
    })
    // 二维码
    this.getImgPath(info.MiniProgramCard).then((res) => {
      ctx.drawImage(res.path, 208 * ratio, 340 * ratio, 100 * ratio, 106 * ratio);
      ctx.draw(true);
    })
    // 扫码文字
    ctx.setFillStyle('#999')
    ctx.setFontSize(10)
    ctx.fillText('长按扫码进入', 230 * ratio, 470 * ratio)
    // 金额
    ctx.font = "normal bold 24px arial,sans-serif"
    ctx.setFillStyle('#ff4444')
    ctx.fillText('￥' + info.SalePrice, 16 * ratio, 420 * ratio)
    ctx.font = "normal lighter 12px arial,sans-serif"
    ctx.setFillStyle('#999')
    ctx.fillText('商城价：￥' + info.MarketPrice, 16 * ratio, 440 * ratio)
    // 商品名称
    ctx.setFillStyle('#333')
    let productName = "";
    for (let i = 0; i < info.ProductName.length; i++) {
      let letter = info.ProductName[i],
        productNameWidth = ctx.measureText(productName).width;
      if (productNameWidth > 120) {
        productName += "..."
        break
      } else {
        productName += letter
      }
    }
    ctx.fillText(productName, 16 * ratio, 460 * ratio)
    ctx.draw()
    wx.hideLoading()
  },
  // 保存图片
  saveImg() {
    wx.showLoading({
      title: '正在保存',
      icon: 'none'
    })
    let _this = this

    wx.canvasToTempFilePath({
      canvasId: 'qrCanvas',
      success(res) {
        console.log(res, '11111111111');
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(data) {
            console.log(data, '111112222111111');
            wx.showToast({
              title: '已保存到相册',
              icon: 'success',
              duration: 2000
            })
          },
          fail(err) {
            console.log(err);
            if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              console.log("用户拒绝时再次发起授权")
              this.getAuthorityAgain();
            } else if (err.errMsg != "saveImageToPhotosAlbum:fail cancel") {
              wx.showToast({
                title: '请截屏保存分享',
                icon: 'success',
                duration: 2000
              })
            }
          },
          complete(res) {
            var timer = setTimeout(() => {
              wx.hideLoading();
              clearTimeout(timer)
            }, 1500)
            console.log(res);
          }
        })




      },
      fail(e) {
        console.log(e, 11111111111)
        setTimeout(() => {
          _this.saveImg()
        }, 1500)

      }
    }, _this)









  },
  // 再次获取权限
  getAuthorityAgain() {
    let _this = this;
    wx.showModal({
      title: '保存海报',
      content: '需要你提供保存相册权限',
      success: function (res) {
        if (res.confirm) {
          wx.openSetting({
            success(setData) {
              if (setData.authSetting['scope.writePhotosAlbum']) {
                _this.saveImg()
              } else {
                wx.hideLoading();
                wx.showToast({
                  title: '获取相册权限失败',
                  icon: 'none'
                })
              }
            }
          })
        } else {
          wx.hideLoading();
          wx.showToast({
            title: '保存海报需要提供相册授权',
            icon: 'none'
          })
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {
    console.log(opt, 1111111111);
    console.log(typeof opt.scene, 1111111111);

    if (!isNaN(parseInt(opt.scene))) delete opt.scene
    console.log(opt.scene, 44444444);
    if (opt.scene) {
      let c = decodeURIComponent(opt.scene)
      opt.prDid = c.split('p=')[1].split('&r=')[0]
      opt.referralUserId = c.split('p=')[1].split('&r=')[1].split('&s=')[0]
      opt.storeid = c.split('p=')[1].split('&r=')[1].split('&s=')[1]
    }

    if (scene) this.setData({ scene })
    if (opt.scene) {
      var scene = decodeURIComponent(opt.scene).split('=')[1]
      this.setData({
        pageType: parseInt(opt.pagetype),
      })

    }




    if (opt.referralUserId) wx.setStorage({
      key: 'referralUserIdTwo',
      data: opt.referralUserId
    })
    this.setData({
      isNotStore: opt.isNotStore ? opt.isNotStore : '',
      isTeam: opt.isTeam ? opt.isTeam : 0,
    })
    console.log(wx.getStorageSync('LatiLongitude'), 1111111111222);

    wx.setStorage({
      key: "callBackLogin",
      data: true,

    })
    if (!app.globalData.GetMembersInfo || !app.globalData.GetMembersInfo.openId || !app.globalData.GetMembersInfo.UserId) {
      console.log('8wwwwwwwwwww');
      app.getOpenId(function (a) {
        app.fg({
          action: 'GetMembersInfo',
          openId: a
        }).then(r => {
          console.log('wqqqqqqqqqqqwwwwww');

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
    let sid = wx.getStorageSync('getStore').StoreId;
    this.setData({
      nowStroeInfo: wx.getStorageSync('getStore')
    })
    if (opt.storeid && opt.storeid != 'undefined' && opt.storeid != 'null') {
      app.globalData.storeId = opt.storeid
      this.getStore(opt.storeid)
    }


    const { UserId } = wx.getStorageSync("userInfo");


    // console.log(sid,1222222222222222,opt.storeid);
    // console.log(opt.storeid=='undefined' ?opt.storeid: sid,2222222222);
    // console.log(sid&&sid!='undefined' ?sid: opt.storeid,'77777777777777hhhhhhhhhhhh');
    this.setData({
      pageType: parseInt(opt.pagetype) ? parseInt(opt.pagetype) : '',
      prDid: opt.prDid ? opt.prDid : scene,
      // storeid: opt.storeid,
      storeid: opt.storeid && opt.storeid != 'undefined' && opt.storeid != 'null' ? opt.storeid : sid,
      userid: UserId ? UserId : '',
      dname: opt.dname ? opt.dname : '',//门店名称
    })
    app.globalData.storeId = this.data.storeid


    console.log(this.data.storeid, 1222222222222222);
    this.initData(opt.IsShowVideo == 'true')
    this.initUserList()
    let that = this
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
            getCartList({ openId: app.globalData.GetMembersInfo.openId }).then(res => {
              that.setData({
                num: res.data.Data.RecordCount
              })
            })
          } else {
            // wx.navigateTo({
            //   url: "/pages/login/login"
            // });
          }
        })
      })
    } else {
      getCartList({ openId: app.globalData.GetMembersInfo.openId }).then(res => {
        that.setData({
          num: res.data.Data.RecordCount
        })
      })

    }





  },

  // 
  getStore(id) {
    let data = this.data,
      that = this



    app.fl()
    app.fg({
      url: "/api/PublicHandler.ashx?action=GetBaseStoreInfo",
      data: {
        StoreId: id,
        Lat: wx.getStorageSync('LatiLongitude').Latitude,
        Lng: wx.getStorageSync('LatiLongitude').Longitude,
      }
    }, true).then(r => {
      app.fh()
      console.log(r, 1111111111111111185889);
      if (r.data.Status == "Success") {
        r.data.Result.StoreId = id
        wx.setStorage({
          key: 'getStore',
          data: r.data.Result
        })
        that.setData({
          nowStroeInfo: r.data.Result
        })
        wx.setNavigationBarTitle({
          title: r.data.Result.StoreName
        })
      } else app.fa(r.data.Message)
    })
  },

  // 参团数据
  countData(obj) {

    let { FightGroupActivityInfo, FightGroupInfos } = obj;

    let startState = countdown(FightGroupActivityInfo.StartDate);
    let endState = countdown(FightGroupActivityInfo.EndDate);
    if (startState.overTime) {

      this.setData({
        limitTxt: '距离结束',
        limitDay: parseInt(endState.limitHours / 24),
        limitHours: endState.limitHours % 24 > 10 ? endState.limitHours % 24 : '0' + endState.limitHours % 24,
        limitMin: endState.limitMin,
        limitSecond: endState.limitSecond
      })
    } else {
      this.setData({
        limitTxt: '距离开始',
        limitDay: parseInt(startState.limitHours / 24),
        limitHours: startState.limitHours % 24 > 10 ? startState.limitHours % 24 : '0' + startState.limitHours % 24,
        limitMin: startState.limitMin,
        limitSecond: startState.limitSecond
      })
    }
  },
  Clusterdata() {
    let { goodsInfo } = this.data;
    goodsInfo.FightGroupInfos.forEach((item, index) => {
      let endDate = countdown(item.EndTime);
      item.limitHours = endDate.limitHours;
      item.limitMin = endDate.limitMin;
      item.limitSecond = endDate.limitSecond;
      item.index = index;
    })
    let newData = goodsInfo.FightGroupInfos;
    // console.log("倒计时的数据输出了吗",newData);
    this.setData({
      groupList: goodsInfo.FightGroupInfos,
    })
  },

  //打开新的更多拼团
  openGroup() {
    this.setData({
      groupShow: true
    })
  },
  //关闭更多拼团
  handleGB() {
    this.setData({
      groupShow: false
    })
  },
  //点击参团列表打开拼团弹窗
  handleQP(e) {
    let that = this;
    console.log("能输出吗,触发了几次", e);
    const { index } = e.currentTarget.dataset;
    let glist = that.data.groupList;
    glist.forEach((v, i) => {
      if (index == i) {
        that.setData({
          newObj: v
        })
      }
    })
    that.setData({
      qpShow: true,
      nums: index,
    })

  },
  //关闭拼团弹窗
  handleQgb() {
    this.setData({
      qpShow: false,
      groupShow: false
    })
  },
  //参与拼团
  handleCY() {
    this.selectComponent('#goodsSpecsCom').showModal();
  },
  //提示拼团,打开拼团弹窗
  handleTS(e) {
    let that = this;
    const { index } = e.currentTarget.dataset;
    let glist = that.data.glist;
    glist.forEach((v, i) => {
      if (index == i) {
        that.setData({
          newObj: v
        })
      }
    })
    that.setData({
      qpShow: true
    })
  },
  //正在拼团,直接掉规格
  handleZP(e) {
    const { index } = e.currentTarget.dataset;
  },

  //立即拼团
  joinGroup: function (e) {
    console.log("点击参团", e)
    let { id, isown, fightgroupid } = e.currentTarget.dataset;
    let { goodsInfo } = this.data;
    console.log("输出商品信息", goodsInfo);
    let skuss = goodsInfo.FightGroupSkuInfos[0].SkuId;
    console.log("输出sku", skuss);
    if (isown) {
      wx.showToast({
        icon: 'none',
        title: '不能参加自己的团'
      })
      return
    }
    console.log();
    wx.navigateTo({
      url: `/fuPackageA/fuOkOrder/fuOkOrder?fromPage=fightgroup&sku=${skuss}&buyAmount=1&groupId=${id}&FightGroupId=${fightgroupid}&prDid=${this.data.prDid}`,
    })
  },



  //拼团结束
  joinOver() {
    wx.showToast({
      title: '已经结束啦!',
      icon: 'none',
      duration: 1500,
      mask: true,
      success: (result) => {

      },
      fail: () => { },
      complete: () => { }
    });

  },

  succ(e) {
    this.setData({
      num: e.detail
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

    var _this = this
    this.getSystemInfo().then((res) => {
      _this.setData({
        statusBarHeight: res.statusBarHeight,
      })
    })
  },

  // 获取手机信息
  getSystemInfo() {
    return new Promise((resolve, reject) => {
      wx.getSystemInfo({
        success: function (res) {
          resolve(res)
        }
      })
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let that = this
    clearInterval(that.data.qcdjs)
    wx.removeStorageSync('buyType')
  },

  //切换头部Nav
  selectNav: function (e) {
    this.setData({
      currentTab: e.target.dataset.id || e.detail.id
    })
  },

  //自定义返回上一级
  navigateBack: function () {
    wx.navigateBack();
  },

  //初始化页面数据
  initData: function (IsShowVideo) {
    wx.showLoading({
      title: '加载中...',
    })
    let that = this
    let {
      prDid,
      bannerArr,
      storeid,
      isNotStore,
    } = this.data
    app.getOpenId(function (a) {
      console.log(a, 222222211111111111);
      getGoodsDetail({
        action: 'getProductDetail',
        ProductID: prDid,
        RStoreId: storeid || '',
        openId: a,
      }).then(res => {
        console.log("商品详情数据", res)
        if (res.statusCode == 200) {
          wx.hideLoading();
          let { Result } = res.data;
          Result.prDid = that.data.prDid
          // console.log("Result++++", Result);
          Result.storeid = that.data.storeid
          let sta = Result.IsFightGroup; //开团状态
          let zc = Result.DefaultSku;//正常商品信息
          let pt = Result.FightGroupActivityInfo;//当前团购信息
          let gsku = Result.FightGroupSkuInfos[0];//团购sku;//yikaituan列表
          let glist = Result.FightGroupInfos;//以开团列表
          console.log("输出开团列表", glist);
          let ptype = Result.ProductType;// 0-普通商品, 2-次数卡商品
          if (sta) {
            that.data.qcdjs = setInterval(() => {
              that.countData(Result);
            }, 1000)

          }
          console.log(Result.RelatedProductList, 588888);
          Result.RelatedProductList && Result.RelatedProductList.length ? Result.RelatedProductList.forEach((w, i) => {
            w.VipPrice = parseInt(w.VipPrice).toFixed(1)
            w.SalePrice = parseInt(w.SalePrice).toFixed(1)
          }) : ''
          let il = []
          Result.ImgList && Result.ImgList.length ? Result.ImgList.forEach(s => {
            let a = {
              url: s,
              video: s.indexOf('mp4') != -1
            }
            il.push(a)
          }) : ""
          // il.push({
          //   url:'https://img.hmeshop.cn/TDH/ProductVideo/20200317/f7a3522cf12d46b4a6d61db431192963.mp4',
          //   video:true
          // })
          let imgList = [], aReg = /<a.*?(?:a>|\/a>)/gi, bind = /<a[^>]*href=['"]([^"]*)['"].*?[^>]*>(.*?)<\/a>/g;
          Result.Description && Result.Description.match(aReg)&&Result.Description.match(aReg).length ? Result.Description.match(aReg).forEach(s => {
            let child = {}
            while (bind.exec(s) != null) {
              child.to = RegExp.$1.split('http:/')[1]
              console.log(RegExp.$1.split('http:/')[1], 1111123);
            }
            s.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
              child.img = capture
            })
            imgList.push(child)
          }) : ''

          Result.GiftList?wx.setStorage({
            key:'isGiftList',
            data:Result.GiftList.Data
          }):wx.setStorage({
            key:'isGiftList',
            data:''
          })
          that.setData({
            bannerArr: il,
            animationImg: Result.ImgList[0],
            description: Result.Description,
            deZDY:imgList,
            skuItem: Result.SkuItem,
            skus: Result.Skus,
            coupons: Result.Coupons,
            //promotionStr: Result.PromotionStr, //用于是否其他促销优惠，12为满减，13为多买优惠(现在用不上字段被删除了)
            freight: Result.Freight,
            goodsInfo: Result,
            RelatedProductNum: Result.RelatedProductList && Result.RelatedProductList.length ? Math.ceil(Result.RelatedProductList.length / 3) : 0,
            groupStatus: sta,//开团状态
            normal: zc,
            ginfo: pt,
            gsku,
            glist,
            ptype,
          }, () => {
            if (Result.BundledCardList != 0) {

              isNotStore ? that.getNearbyStoreData() : ''
            }
          })
          if (IsShowVideo) that.changeType()
          // 参团倒计时
          if (sta) {
            console.log("输出当前开团状态", sta);
            setInterval(() => {
              that.Clusterdata()
            }, 1000)
          }
        }
      })
    })

  },

  //跳转详情
  handleDetail(e) {
    const { productid } = e.currentTarget.dataset; //商品id和门店id
    wx.redirectTo({
      url: `/fuPackageA/fuProductT/fuProductT?prDid=${productid}`,
    })
  },

  //初始化下单的用户列表
  initUserList: function () {
    return
    getShopUser({
      action: 'GetCustomOrderData'
    })
      .then(res => {
        if (res.statusCode == 200) {
          this.setData({
            shopUser: res.data == '' ? [] : res.data
          })
        }
      })
  },

  //打开规格选择modal
  openSpecs: function (param) {
    console.log("输出点击规格的值++++", param);
    this.setData({
      paramData: param.detail,
      dprice: param.dprice,
      ddgm: param.ddgm,
    })
    console.log("输出价格", param.detail);
    this.selectComponent('#goodsSpecsCom').showModal();
    console.log("规格数字999", this.data.ddgm);

  },
  //切换拼团
  // handleGroup(e){
  //   console.log(e);
  //   const { index } = e.currentTarget.dataset;
  //   this.setData({
  //     newNum:index
  //   })
  // },

  //跳转首页
  handleIndexG() {
    wx.reLaunch({
      url: '/pages/fujihang/fuIndexG/fuIndexG',
      success: (result) => {

      },
      fail: () => { },
      complete: () => { }
    });

  },

  getFN(e){

    let data=this.data,that=this,id=e.currentTarget.dataset.id
    app.fl()
    app.fg({
      action:'GetOnTimeGift',
      openId:app.globalData.GetMembersInfo.openId,
      GiftId:id
    }).then(r=>{
      app.fh() 
       app.fa(r.data.Message)
      console.log(r) 
    })
    
   
  },

  // 获取个人信息
  referUser() {
    let that = this
    app.getOpenId(function (a) {
      app.fg({
        action: 'GetMembersInfo',
        openId: a
      }).then(r => {
        console.log("输出个人信息", r);
        if (r.data.Status == "OK") {
          let dataR = r.data.Data
          wx.setStorageSync('cookie', r.data.Cookie);
          wx.setStorageSync('userinfo', dataR);
        } else {
          wx.navigateTo({
            url: "/pages/login/login"
          });
        }
      })
    })
  },

  redFN(e){
    wx.redirectTo({
      url:e.currentTarget.dataset.url
    })
  },

  // 跳转视频导购
  changeType() {
    // let data=this.data
    // wx.setStorage({
    //   key:'productDataFu',
    //   data:data.goodsInfo
    // })
    // wx.navigateTo({
    //   url:'/fuPackageA/fuProVideo/fuProVideo?pid='+this.data.prDid
    // })
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

  }
})