const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgheights: [],//所有图片高度
    current: 0,
    productList: [],
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
      name: '红卡专区',
      img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/sele@3x3.png',
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

    navTop: [
      {
        name:'省 钱',
        data:[
          {
            img:app.newImg+"mlj004.png",
            name:'买立减',
            val:'全场买立减',
          },
          {
            img:app.newImg+"ppzk.png",
            name:'品牌折扣',
            val:'品牌商品特惠购',
          },
          {
            img:app.newImg+"djzq004.png",
            name:'底价专区',
            val:'精选商品底价购',
          },
          {
            img:app.newImg+"ttmy004.png",
            name:'天天免邮',
            val:'包邮送到家',
          },
        ]
      },
      {
        name:'奖 励',
        data:[
          {
            img:app.newImg+"fxyj004.png",
            name:'分享有奖',
            val:'分享商品有奖励',
          },
          {
            img:app.newImg+"hycz004.png",
            name:'会员抽奖',
            val:'会员签到抽奖',
          },
          {
            img:app.newImg+"khmfs004.png",
            name:'口红免费送',
            val:'满299每日前5限量送',
          },
        ]
      },
      {
        name:'专 享',
        data:[
          {
            img:app.newImg+"0ys004.png",
            name:'0元送',
            val:'每月福利',
          },
          {
            img:app.newImg+"sybt004.png",
            name:'十亿补贴0元购',
            val:'每日每个ID限一次',
          },
          {
            img:app.newImg+"xcsc004.png",
            name:'宣传素材',
            val:'共享海量素材',
          },
          {
            img:app.newImg+"zxzbj004.png",
            name:'专享直播间',
            val:'打造个人网红IP',
          },
        ]
      },
      {
        name:'服 务',
        data:[
          {
            img:app.newImg+"zgfw004.png",
            name:'掌柜服务',
            val:'掌柜亲自接待',
          },
          {
            img:app.newImg+"zssh004.png",
            name:'专属售后',
            val:'售后更无忧',
          },
          {
            img:app.newImg+"gjfw004.png",
            name:'管家服务',
            val:'每天金牌服务',
          },
        ]
      },
      // {
      //   name: "价值504元",
      //   val: '头道汤草本护洗发液3瓶',
      //   img: app.newImg + '504003.png',
      // },
      // {
      //   name: "5％返利",
      //   val: '产品推广5％返利 ',
      //   img: app.newImg + 'fl003.png',
      // },
      // {
      //   name: "直播权限",
      //   val: '微信直播权限',
      //   img: app.newImg + 'zbqx003.png',
      // },
      // {
      //   name: "直播产品",
      //   val: '三个直播产品资格',
      //   img: app.newImg + 'zbcp003.png',
      // },
      // {
      //   name: "80元",
      //   val: '会员转介绍奖励',
      //   img: app.newImg + '80003.png',
      // },
      // {
      //   name: "0元领",
      //   val: '每月一次参与活动',
      //   img: app.newImg + '504003.png',
      // },

    ],
    xz: 2,
    newImg:app.newImg,
    moreOpen:false,
    getZearList:[],
  },

  moreFN(){
    this.setData({
      moreOpen:!this.data.moreOpen
    })
  },

  // 跳转页面
  toFNavc(e) {


    wx.switchTab({
      url: e.currentTarget.dataset.to
    })


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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getProductList()
    this.getZearFN()
    wx.hideShareMenu()
  },

  //跳转详情
  handleDetail(e) {
    const { productid, storeid, pagetype } = e.currentTarget.dataset; //商品id和门店id
    wx.navigateTo({
      url: `/fuPackageA/fuProductT/fuProductT?prDid=${productid}&pagetype=${pagetype}&storeid=${storeid}`,
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

  //跳转详情
  handleDetail(e) {
    const { productid, storeid, pagetype } = e.currentTarget.dataset; //商品id和门店id
    wx.navigateTo({
      url: `/fuPackageA/fuProductT/fuProductT?prDid=${productid}&pagetype=${pagetype}&storeid=${storeid}`,
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  toFNXin(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
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

  getZearFN(){
    let data=this.data,that=this
    console.log('22222')
    app.fl()
    app.fg({
      action:'GetSendGiftList'
    }).then(r=>{
      app.fh() 
      if(r.data.Status=='Success'){
        that.setData({
          getZearList:r.data.onlineGifts.Data
        })
       }else app.fa(r.data.Message)
      console.log(r) 
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideTabBar({})
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