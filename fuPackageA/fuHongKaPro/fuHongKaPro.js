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
    xz:2,
    navTop:[
      {
        name:"价值504元",
        val:'头道汤草本护洗发液3瓶',
        img:app.newImg+'504003.png',
      },
      {
        name:"5％返利",
        val:'产品推广5％返利 ',
        img:app.newImg+'fl003.png',
      },
      {
        name:"直播权限",
        val:'微信直播权限',
        img:app.newImg+'zbqx003.png',
      },
      {
        name:"直播产品",
        val:'三个直播产品资格',
        img:app.newImg+'zbcp003.png',
      },
      {
        name:"80元",
        val:'会员转介绍奖励',
        img:app.newImg+'80003.png',
      },
      {
        name:"0元领",
        val:'每月一次参与活动',
        img:app.newImg+'504003.png',
      },

    ],
  },

  // 跳转页面
  toFNavc(e) {


    wx.switchTab({
      url: e.currentTarget.dataset.to
    })


  },


  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getProductList()
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