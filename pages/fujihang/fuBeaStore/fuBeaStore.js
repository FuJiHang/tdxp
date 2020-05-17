const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,

    imgUrls: [

    ],//轮播图
    imgheights: [],//所有图片高度
    show: false,
    fisrtData: [],
    chooseList: [
      {
        name: '积分区间（美丽金）',
        index: -1,
        child: [
          {
            name: '0-300',
            val: '',
            post: '0,300',
            data: 'A1',
            index: -1,
            min: 0,
            max: 300,
          },
          {
            name: '300-1000',
            val: '',
            post: '300,1000',
            data: 'A2',
            index: -1,
            min: 300,
            max: 1000,
          },
          {
            name: '1000-3000',
            val: '',
            post: '1000,3000',
            data: 'A3',
            index: -1,
            min: 1000,
            max: 3000,
          },
        ]
      },
      {
        name: '现金+美丽金兑换',
        index: -1,
        child: [
          {
            name: '100~300元',
            post: '',
            index: -1,
            min: 100,
            max: 300,
          },
          {
            name: '300~800元',
            post: '',
            index: -1,
            min: 300,
            max: 800,
          },
          {
            name: '1000元以上',
            post: '',
            index: -1,
            min: 1000,
            max: '',
          },
        ]
      },
      {
        name: '品种类型',
        index: -1,
        child: [

        ]
      }
    ],
    isChooseT:0,
    navBar: [{
      name: '首页',
      img: 'sySy.png?2',
      to: '/pages/fujihang/fuIndexG/fuIndexG',
    },
    {
      name: '积分商城',
      img: 'sySc.png',
      to: '/pages/fujihang/fuBeaStore/fuBeaStore',
    },
    {
      img: 'syAdd.png?2',
      to: '/fuPackageA/fuRelease/fuRelease'
    },

    {
      name: '我的',
      img: "syMy.png?2",
      to: '/pages/mine/mine',
    },
    ], //导航条
    xz: 1,
    getTypeList: [],
    senoud: [],
    current: 0,
    typeList: [],//系列,
    classfiyList: [],//商品分类
    isChoose: 0,//选择分类
    showClassfiy: false,//显示分类列表
    isStore: false,
    GetAllClassList:[],//分类数据
    touchStart:0,
    ischangeMore:false,
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
  // 更多
  toMore(e) {
    if (!app.globalData.GetMembersInfo || !app.globalData.GetMembersInfo.openId) return app.fuLo()
    let post = {
      action: 'GetGifts',
      SaleStatus:app.globalData.appId=="wx2e40ad78f7098898"?1:'',
      IsPromotion: 1,
      AttributeId: e.currentTarget.dataset.index,
      // openId:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',
      openId: app.globalData.GetMembersInfo.openId,
      StoreId:wx.getStorageSync('getStore').StoreId?wx.getStorageSync('getStore').StoreId:0,
    }
    wx.navigateTo({
      url: "/pages/fujihang/fuBeaStoreList/fuBeaStoreList?post=" + JSON.stringify(post)
    });
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

  // 获取分类
  getType() {
    let data = this.data, that = this
    app.fl()
    app.fg({
      action: 'GetGifts', 
      SaleStatus:app.globalData.appId=="wx2e40ad78f7098898"?1:'',
      AttributeId: 109,
      IsPromotion: 0,
      openId: app.globalData.GetMembersInfo.openId,
      pageindex: 1,
      pagesize: 2,
      StoreId:wx.getStorageSync('getStore').StoreId?wx.getStorageSync('getStore').StoreId:0,
    }).then(r => {
      app.fh()

      that.setData({
        senoud: r.data.rows
      })

      console.log(r)
    })
  },


  onClose() {
    this.setData({ show: false, showClassfiy: false });
  },

  // 收藏
  collFN(e) {
    let data = this.data, that = this
    let index = e.currentTarget.dataset
    app.fl('正在收藏中...')
    app.fg({
      action: 'AddCollection',
      giftid: e.currentTarget.dataset.giftid,
      CollectType: 'Gift',
      // openId:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',
      openId: app.globalData.GetMembersInfo.openId,
    }).then(r => {
      app.fh()
      app.fa(r.data.Message)
      if (r.data.Status == "OK") {
        data.classfiyList[index.indexs].data[index.index].IsCollected = r.data.Message == '收藏成功' ? 'True' : 'False'
        that.setData({
          classfiyList: data.classfiyList
        })
      }

    })
  },
  // 详情
  buyFN(e) {
    let data = e.currentTarget.dataset
    // pointDetail
    wx.navigateTo({
      url: '/pages/pointDetail/pointDetail?costprice=' + data.costprice + '&id=' + data.giftid
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    wx.hideTabBar({})

    let data = this.data, that = this
    this.setData({
      isStore: wx.getStorageSync('getStore') ? true : false,
    })

    // 轮播图
    // banner
    app.fg({
      action: "GetBannerPicturesByCateName",
      pTypeName: '积分商城Banner'
    }).then(r => {
      that.setData({
        imgUrls: r.data.rows
      })
    })


  },

  
  showFN() {
    this.setData({
      show: true
    })
  },
  // 选择
  chooseFN(e) {
    let data = this.data.chooseList
    let choose = e.currentTarget.dataset
    if (data[choose.findex].index == choose.index) data[choose.findex].index = -1
    else data[choose.findex].index = choose.index
    this.setData({
      chooseList: data
    })
  },

  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */


  chooseClassfiyFN(e) {
    this.setData({
      isChooseT: e.currentTarget.dataset.index
    })
    // this.GetProductsFN()
  },


  touchStart(e){
    this.data.touchStart=e.touches[0].clientX
    console.log(e,1111111);
  },
  touchMove(e){
    if(e.touches[0].clientX-this.data.touchStart>50){
      // 上
      this.data.classfiyList[0].page--
      this.data.ischangeMore=true
   
    }
    if(e.touches[0].clientX-this.data.touchStart<-50){
      this.data.ischangeMore=true
    }
  },


  ischangeMoreFN(){
    if(this.data.ischangeMore) this.changeMore()
    this.data.ischangeMore=false
  },


  //  获取商城商品分类
  GetAllCategoriesFN() {
    let data = this.data, that = this
    // app.fl()
    app.fg({
      action: 'GetGiftTags',
      type: 2
    }).then(r => {
      // app.fh() 
      if (r.data.Status == 'OK') {
        r.data.Data.forEach(c => {
          c.page = 1
          c.finsh = false
          c.data = []
        })
        that.setData({
          classfiyList: r.data.Data
        })
        that.getDataList()

      } else app.fa(r.data.Message)

    })
  },

  // 获取商品分类
  GetAllClass(){
    let data=this.data,that=this
    app.fl()
    app.fg({
      action:"GetAllCategories",
      type:2,

    }).then(r=>{
      app.fh() 
      if(r.data.Status=='OK'){
        that.setData({
          GetAllClassList:r.data.Data
        })
       }else app.fa(r.data.Message)
      console.log(r) 
    })
  },



  GetProductsFN() {
    let data = this.data, that = this
    if (data.classfiyList[data.isChoose].finsh) return
    // app.fl()
    app.fg({
      action: "GetGifts",
      SaleStatus:app.globalData.appId=="wx2e40ad78f7098898"?1:'',
      pagesize: data.isChoose?10:3,
      pageindex: data.classfiyList[data.isChoose].page,
      IsPromotion: 0,
      TagId: data.classfiyList[data.isChoose].cid,
      StoreId:wx.getStorageSync('getStore').StoreId?wx.getStorageSync('getStore').StoreId:0,
    }).then(r => {
      r.data.rows.forEach(c => {
        data.classfiyList[data.isChoose].data.push(c)
      })
      data.classfiyList[data.isChoose].page++
      data.classfiyList[data.isChoose].finsh = r.data.rows.length < (data.isChoose?10:3)
      that.setData({
        classfiyList: data.classfiyList
      })
    })
  },

  openClassfiy() {
    this.setData({
      showClassfiy: true,
    })
  },

  // 去列表
  toListFN(e) {
    let post = {
      action: 'GetGifts',
      SaleStatus:app.globalData.appId=="wx2e40ad78f7098898"?1:'',
      IsPromotion: 0,
      AttributeId: e.currentTarget.dataset.giftid,
      StoreId:wx.getStorageSync('getStore').StoreId?wx.getStorageSync('getStore').StoreId:0,
      // openId:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',
      // openId: app.globalData.GetMembersInfo.openId,

    }
    wx.navigateTo({
      url: '/pages/fujihang/fuBeaStoreList/fuBeaStoreList?post=' + JSON.stringify(post)
    })
  },



  // 第二次获取
  getDataList() {
    let that = this
    for (let i = 0; i < 3; i++) {
      setTimeout(function () {
        that.data.isChoose = i
        that.GetProductsFN()
      }, 1000 * i)

    }
    this.data.isChoose = 0
  },

  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // if (!app.globalData.GetMembersInfo || !app.globalData.GetMembersInfo.openId) app.fuLo()
    let that=this
    this.GetAllCategoriesFN()
    this.GetAllClass()


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
    this.GetAllCategoriesFN()

    let data = this.data, that = this


    // 轮播图
    // banner
    app.fg({
      action: "GetBannerPicturesByCateName",
      pTypeName: '积分商城Banner'
    }).then(r => {
      that.setData({
        imgUrls: r.data.rows
      })
    })


  
    app.fl()
    setTimeout(()=>{
      app.fh()
      wx.stopPullDownRefresh()
    },3000)
  },


  // 
  changeMore(){
    let data = this.data, that = this
    app.fg({
      action: "GetGifts",
      SaleStatus:app.globalData.appId=="wx2e40ad78f7098898"?1:'',
      pagesize: 3,
      pageindex: data.classfiyList[0].page,
      IsPromotion: 0,
      TagId: data.classfiyList[0].cid,
      StoreId:wx.getStorageSync('getStore').StoreId?wx.getStorageSync('getStore').StoreId:0,
    }).then(r => {
      data.classfiyList[0].data=r.data.rows
      data.classfiyList[0].page++
      r.data.rows.length < 3?(data.classfiyList[0].page=1, that.changeMore()):''
      that.setData({
        classfiyList: data.classfiyList
      })
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!app.globalData.GetMembersInfo || !app.globalData.GetMembersInfo.openId) app.fuLo()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})