const app = getApp()
import { countdown } from '../../../utils/util';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    proList: {
      data: [],
      page: 1,
      finsh: false,
    },//商品列表
    imgheights: [],//所有图片高度
    imgUrls: [],//轮播图
    showClassfiy: false,//
    imgUrl: app.imgUrl,
    isChoose: 0,
    titleArr: [],
    seach: '',
    clear: false,
    listData: [],//商品列表
    title: '',//商品列表标题
    newImg: app.newImg,
    navBar: [{
      name: '首页',
      img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/meunsy@3x.png',
      to: '/pages/fujihang/fuIndexG/fuIndexG',
    },
    {
      name: '惠选商城',
      img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/sele@3x2.png',
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
      img: "http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/menu@3x3.png",
      to: '/pages/mine/mine',
    },
    ], //导航条
    xz: 1,
    current: 0,
    productList: [],
    active: 0,
    post: '',//门店返回的参数 
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
    // funList: [
    //   {
    //     name: '会员专区',
    //     img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/nav@3x0.png',
    //     to: '/pages/fujihang/fuHongKaPro/fuHongKaPro'
    //   },
    //   {
    //     name: '超值拼团',
    //     img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/nav@3x9.png',
    //     to: '/fuPackageA/fuTeamList/fuTeamList'
    //   },
    //   {
    //     name: '限量抢购',
    //     img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/nav@3x1.png',
    //     to: '/fuPackageA/fuXJMS/fuXJMS'
    //   },
    //   {
    //     name: '品牌折扣',
    //     img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/nav@3x2.png',
    //     to: ''
    //   },
    //   {
    //     name: '全部分类',
    //     img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/nav@3x3.png',
    //     to: '/fuPackageA/fuShopClass/fuShopClass'
    //   },

    // ],
    classfiyT: [],
    isFun: 0,
    xiDing: 0,
    scrollTop: 0,
    isShowTop: false,
    teamList: [],
    liveRoom: [],
    DataXLQG:[],
    disList:[],
  },

  // 
  toTopFn() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0,

    });
  },
  // 

  toFNLive(e) {
    console.log(e.currentTarget.dataset);
    // if(e.currentTarget.dataset.stu==2) return app.fa('未开播，不能观看哦！')
    if (e.currentTarget.dataset.rid) app.globalData.roomId = e.currentTarget.dataset.rid
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
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



  getDataXLQG() {
    let data = this.data, that = this
    app.fl()
    app.fg({
      action: 'GetCountDownInfos',
    }).then(r => {
      if (r.data.Status == 'Success') {
        r.data.CountDownList.Data.forEach((c, i) => {
          data.disList['child' + i] = setInterval(() => {
            let startState = countdown(c.StartDate);
            let endState = countdown(c.EndDate);
            if (startState.overTime) {
              c.limitTxt = '距结束',
                c.limitHours = endState.limitHours,
                c.limitMin = endState.limitMin,
                c.limitSecond = endState.limitSecond
              if (endState.limitHours == '00' && endState.limitMin == '00' && endState.limitSecond == '00') {
                clearInterval(data.disList['child' + i])
                c.limitTxt = '已结束'
              }
            } else {
              c.limitTxt = '距降价',
                c.limitHours = startState.limitHours,
                c.limitMin = startState.limitMin,
                c.limitSecond = startState.limitSecond
            }
            c.bfb = parseInt(c.BoughtCount / c.TotalCount * 100)
            that.setData({
              ['DataXLQG[' + i + ']']: c,
            })
          }, 1000)
        })
      } else {
        app.fh()
        app.fa(r.data.message)
      }
    })


  },

  // 
  isFunFN(e) {
    var query = wx.createSelectorQuery();
    query.selectViewport().scrollOffset();
    query.select("#toNav" + e.currentTarget.dataset.index).boundingClientRect();
    query.exec(function (res) {
      var miss = res[0].scrollTop + res[1].top - 100;
      wx.pageScrollTo({
        scrollTop: miss,
        duration: 0,
        // duration: miss<2500?0.5*miss:miss<5000?0.3*miss:0.1*miss
      });
    });
    this.setData({
      isFun: e.currentTarget.dataset.index,
    })

  },

  // 
  getTeamBuy(id) {
    let data = this.data,
      that = this
    app.fl()
    app.fg({
      url: '/API/ProductHandler.ashx?action=GetFightGroupActivityInfos',
      data: {
        pageSize: 2,
        pageIndex: 1,
        sortBy: 'SalePrice',
        StoreId: id
      },

    }, true).then(r => {
      // console.log("拼团数据", r);
      app.fh()
      if (r.data.Result.Data) {
        that.setData({
          teamList: r.data.Result.Data
        })
      }
    })
  },


  // 跳转页面
  toFNavc(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.to
    })
    wx.switchTab({
      url: e.currentTarget.dataset.to
    })

  },

  // 选择分类
  chooseFN(e) {
    const { cid, index, name } = e.currentTarget.dataset;
    this.setData({
      isChoose: e.currentTarget.dataset.index
    })
  },

  seaChFN(e) {
    let t = this.data.seach.length
    this.setData({
      seach: e.detail.value,
      clear: t > 0 ? true : false
    })
  },

  clearFN() {
    this.setData({
      seach: '',
      clear: false
    })
  },

  onClose() {
    this.setData({
      showClassfiy: false,
    })
  },
  openClassfiy() {
    this.setData({
      showClassfiy: true,
    })
  },

  // 轮播图变化
  imageLoad: function (e) {//获取图片真实宽度  
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
  bindchange: function (e) {
    this.setData({ current: e.detail.current })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideTabBar({})
    let sid = wx.getStorageSync('getStore').StoreId ? wx.getStorageSync('getStore').StoreId : 0;
    // this.getProductData(sid)
    this.getTeamBuy(sid)
    let data = this.data, that = this

    data.post = options.post
    // 轮播图
    // banner

    app.fg({
      action: "GetBannerPictures",
    }).then(r => {
      let imgs = []
      r.data.Message.forEach(c => {
        imgs.push(c.AdImg)
      })
      that.setData({
        imgUrls: imgs
      })
    })
    this.getClassify();
    this.getClassfiyFN()
    this.getProductList()
    var query = wx.createSelectorQuery().select('.funtionTop').boundingClientRect(res => {
      that.setData({
        xiDing: res.top
      })
    }).exec();
    this.getLiveData()
    this.getDataXLQG()
  },

  // 跳转到分类列表
  toFN(e) {
    wx.switchTab({
      url: e.currentTarget.dataset.to
    })
    wx.navigateTo({
      url: e.currentTarget.dataset.to
    })
  },


  //跳转详情
  handleDetail(e) {
    const { productid, storeid, pagetype } = e.currentTarget.dataset; //商品id和门店id
    wx.navigateTo({
      url: `/fuPackageA/fuProductT/fuProductT?prDid=${productid}&pagetype=${pagetype}&storeid=${storeid}`,
    })
  },

  //wjx初始化分类标题数据
  getClassify() {
    let data = this.data, that = this
    app.fg({
      action: 'GetAllCategories',	//是	string	GetAllCategories
      Type: 0,	//是	int	0商品1项目
    }).then(res => {
      res.data.Data.forEach(c => {
        c.data = []
        c.page = 1
        c.finsh = false
      })
      let arr = res.data.Data;
      if (res.data.Status == "OK") {
        this.setData({
          titleArr: arr
        })
      }
    })
  },



  //wjx跳转详情
  handleDetail(e) {
    const { productid, storeid, pagetype, dname } = e.currentTarget.dataset; //商品id和门店id
    wx.navigateTo({
      url: `/fuPackageA/fuProductT/fuProductT?prDid=${productid}&pagetype=${pagetype}&storeid=${storeid}&dname=${dname}`,
    })
  },


  // 
  getProductData(id) {
    let data = this.data, that = this
    if (data.proList.finsh) return
    app.fl()
    app.fg({
      url: '/api/ProductHandler.ashx?action=GetProducts',
      data: {
        pageSize: 10,
        pageIndex: data.proList.page,
        // tagId:18,
        StoreId: id,
        ProductType: 0
      },
    }, true).then(r => {
      app.fh()
      if (r.data.Result.Status == 'Success') {
        let datar = r.data.Result.Data
        datar.forEach(c => {
          data.proList.data.push(c)
        })
        if (datar.length < 10) data.proList.finsh = true
        data.proList.page++
        that.setData({
          proList: data.proList
        })
      } else app.fa('获取失败')
    })
  },

  // 切换类型
  onChangeTop(e) {
    let data = this.data, that = this
    this.setData({
      active: e.detail.index
    })

  },



  getProductList() {
    let data = this.data, that = this
    app.getOpenId(function (a) {
      app.fl()
      app.fg({
        // url: '/api/ProductHandler.ashx?action=GetProductByTag&tagName=' + data.post,
        url: '/api/ProductHandler.ashx?action=GetProductByTag&openId=' + a
      }, true).then(r => {
        app.fh()
        if (r.data.Status == 'Success') {
          r.data.Message.forEach(w => {
            w.ProductList ? w.ProductList.forEach(q => {
              q.NewUserPrice ? q.NewUserPrice = parseFloat(q.NewUserPrice).toFixed(1) : ""
            }) : ''
          })
          that.setData({
            productList: r.data.Message
          })
        } else app.fa(r.data.Message)
      })
    })

  },

  onPageScroll(e) {
    let that = this
    this.setData({
      scrollTop: e.scrollTop
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
    // if(!app.globalData.GetMembersInfo||!app.globalData.GetMembersInfo.UserId) app.fuLo()
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
            img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/sele@3x2.png',
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
            img: "http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/menu@3x3.png",
            to: '/pages/mine/mine',
          },
          ], //门店导航条
          isDoor: true,
          xz: 1,
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
          xz: 1,
        })


      }
    })

    if (!app.globalData.GetMembersInfo || !app.globalData.GetMembersInfo.openId || !app.globalData.GetMembersInfo.UserId) {

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
            wx.redirectTo({
              url: "/pages/login/login"
            });
          }
        })
      })
    }

  },

  // 
  toProType(e){
    
    let w=e.currentTarget.dataset.item
    wx.navigateTo({
      url:'/fuPackageA/fuProByType/fuProByType?data='+encodeURIComponent(JSON.stringify(w))
    })
  },


  // 
  getClassfiyFN() {
    let data = this.data, that = this
    app.fl()
    app.fg({
      url: '/API/WeChatApplet.ashx?action=GetAllCategories',
      data: {
        type: 0,
      }
    }, true).then(r => {
      app.fh()
      if (r.data.Status == 'OK') {
        that.setData({
          classfiyT: r.data.Data
        })
      } else app.fa(r.data.Message)
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
    this.data.disList.forEach(c => {
      clearInterval(c)
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this
    let sid = wx.getStorageSync('getStore').StoreId ? wx.getStorageSync('getStore').StoreId : 0;
    // this.getProductData(sid)
    app.fg({
      action: "GetBannerPictures",
    }).then(r => {
      let imgs = []
      r.data.Message.forEach(c => {
        imgs.push(c.AdImg)
      })
      that.setData({
        imgUrls: imgs
      })
    })
    this.getClassify();
    this.getProductList()
    app.fl()
    setTimeout(() => {
      app.fh()
      wx.stopPullDownRefresh()
    }, 3000)
    this.getTeamBuy(sid)
    this.getLiveData()
    this.getDataXLQG()
  },

  // 


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