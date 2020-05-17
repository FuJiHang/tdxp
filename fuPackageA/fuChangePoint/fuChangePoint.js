const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    functionList: [
      {
        name: '已上架',
        data: [],
        finsh: false,
        page: 1,
        post: 1,
      },
      {
        name: '已下架',
        data: [],
        finsh: false,
        page: 1,
        post: 2,
      },
    ],
    CostPrice: 0,
    ComboPrice: 0,
    ComboPoint: 0,
    showAlert: false,
    showAlertT: false,
    showAlertTH: false,
    id: 0,
    numBuy: 1,//数量
    buyList: [],//采购列表
    buyInfo: {},
    point: 0,
    allPrice: 0,
  },

  onCloseP() {
    this.setData({
      showAlert: false,
      showAlertT: false,
      showAlertTH: false,
    })
  },

  openFN(e) {

    this.data.id = e.currentTarget.dataset.data.GiftId
    this.data.CostPrice = e.currentTarget.dataset.data.CostPrice
    this.data.ComboPoint = e.currentTarget.dataset.data.ComboPoint
    this.data.ComboPrice = e.currentTarget.dataset.data.ComboPrice
    this.setData({
      showAlert: true,
      id: e.currentTarget.dataset.data.GiftId,
      CostPrice: e.currentTarget.dataset.data.CostPrice,
      ComboPoint: e.currentTarget.dataset.data.ComboPoint,
      ComboPrice: e.currentTarget.dataset.data.ComboPrice,
    })
    console.log(e.currentTarget.dataset.data);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
  },

  seaChFN(e) {
    let data = this.data, point = 0, allPrice = 0
    this.setData({
      [e.currentTarget.dataset.name]: e.detail.value
    })
    data.buyList.forEach(r => {
      point += r.BuyPoints * r.num
      allPrice += r.BuyPrice * r.num
    })
    this.setData({
      point: point,
      allPrice: allPrice,
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },


  // 获取分类
  getData() {
    let data = this.data, that = this
    if (data.functionList[data.active].finsh) return
    app.fl()
    app.fg({
      action: 'GetGifts',
      IsPromotion: 0,
      //openId: app.globalData.GetMembersInfo.openId,
      openId: 'o8Uka4-Z3WeZFjcneBEgiQXIJoCc',
      TagId: 0,
      pageindex: data.functionList[data.active].page,
      pagesize: 10,
      // StoreId:app.globalData.GetMembersInfo.StoreId,
      StoreId: 19,
      SaleStatus: data.functionList[data.active].post
    }).then(r => {
      app.fh()
      r.data.rows.forEach(c => {
        data.functionList[data.active].data.push(c)
      })
      data.functionList[data.active].page++
      data.functionList[data.active].finsh = r.data.rows.length < 10
      that.setData({
        functionList: data.functionList
      })

      console.log(r)
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  changeFN(e) {
    let data = this.data, that = this, datar = e.currentTarget.dataset
    app.fl()
    app.fg({
      url: '/api/OrdersHandler.ashx?action=StoreSaleOnOffGift',
      data: {
        GiftId: datar.id,
        // StoreId:app.globalData.GetMembersInfo.StoreId,
        StoreId: 19,
        SaleStatus: data.active ? 1 : 2,
        openId: app.globalData.GetMembersInfo.openId,
      }
    }, true).then(r => {
      app.fh()
      if (r.data.Status == 'Success') {
        data.functionList[data.active].page = 1
        data.functionList[data.active].data = []
        data.functionList[data.active].finsh = false
        that.getData()

      } else app.fa(r.data.Message)

    })
  },

  onChangeTop(event) {
    let data = this.data
    this.setData({
      active: event.detail.index
    })
    data.functionList[data.active].page = 1
    data.functionList[data.active].data = []
    data.functionList[data.active].finsh = false
    this.getData()
  },

  submitComT() {
    let data = this.data, that = this
    app.fl()
    app.fg({
      url: '/api/OrdersHandler.ashx?action=StoreSetStoreGift',
      data: {
        GiftId: data.id,
        // StoreId:app.globalData.GetMembersInfo.StoreId,
        StoreId: 19,
        NeedPoint: data.CostPrice,
        ComboPoint: data.ComboPoint,
        ComboPrice: data.ComboPrice
      }
    }, true).then(r => {
      app.fh()
      if (r.data.Status == 'Success') {
        data.functionList[data.active].page = 1
        data.functionList[data.active].data = []
        data.functionList[data.active].finsh = false
        setTimeout(() => { that.getData() }, 1000)

        that.onCloseP()

      }

      app.fa(r.data.Message)
    })
  },

  // 
  buyFN(e) {
    this.setData({
      buyInfo: e.currentTarget.dataset.data,
      showAlertT: true
    })
  },
  toCard() {
    let data = this.data, isHas = false
    data.buyList.forEach((r, i) => {
      if (r.id == data.buyInfo.GiftId) {
        r.num = parseInt(r.num) + parseInt(data.numBuy)
        isHas = true
      }
    })
    if (!isHas) data.buyList.push({
      id: data.buyInfo.GiftId,
      num: data.numBuy,
      BuyPoints: data.buyInfo.BuyPoints,
      BuyPrice: data.buyInfo.BuyPrice,
      img: data.buyInfo.ImageUrl
    })

    this.setData({
      showAlertT: false,
      buyList: data.buyList
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  openCart() {
    let point = 0, allPrice = 0, data = this.data
    data.buyList.forEach(r => {
      point += r.BuyPoints * r.num
      allPrice += r.BuyPrice * r.num

    })
    this.setData({
      showAlertTH: true,
      point: point,
      allPrice: allPrice,
    })
  },
  // 删除
  delectFN(e) {
    let data = this.data
    data.buyList.splice(e.currentTarget.dataset.index, 1)
    let point = 0, allPrice = 0
    data.buyList.forEach(r => {
      point += r.BuyPoints * r.num
      allPrice += r.BuyPrice * r.num
    })
    this.setData({
      buyList: data.buyList,
      point: point,
      allPrice: allPrice,
    })
  },

  // 
  pointFN() {
    let data = this.data, that = this, gId = '', gNum = ''
    data.buyList.forEach(c => {
      gId ? gId += ',' + c.id : gId = c.id
      gNum ? gNum += ',' + c.num : gNum = c.num
    })
    app.fl()
    app.fg({
      url: "/API/WeChatApplet.ashx?action=ProcessSubmmitorderNew",
      data: {
        openId: 'o8Uka4-Z3WeZFjcneBEgiQXIJoCc',
        shippingId: 117,
        giftId: 0,
        PayType: 1,
        GiftList: gId,
        NumList: gNum,
        RStoreId: 19,
      }
    }, true).then(r => {
      app.fh()
      if (r.data.Status == 'OK') {
        app.fa('采购成功！')
        setTimeout(() => {
          that.setData({
            functionList: [
              {
                name: '已上架',
                data: [],
                finsh: false,
                page: 1,
                post: 1,
              },
              {
                name: '已下架',
                data: [],
                finsh: false,
                page: 1,
                post: 2,
              },
            ],
            showAlertTH: false
          })

          that.getData()
        }, 1450)


      } else app.fa(r.data.Message)

    })
  },
  moneyFN() {
    let data = this.data, that = this, gId = '', gNum = ''
    data.buyList.forEach(c => {
      gId ? gId += ',' + c.id : gId = c.id
      gNum ? gNum += ',' + c.num : gNum = c.num
    })
    app.fl()
    app.fg({
      url: "/API/WeChatApplet.ashx?action=ProcessSubmmitorderNew",
      data: {
        openId: 'o8Uka4-Z3WeZFjcneBEgiQXIJoCc',
        shippingId: 117,
        giftId: 0,
        PayType: 0,
        GiftList: gId,
        NumList: gNum,
        RStoreId: 19,
      }
    }, true).then(r => {
      app.fh()
      if (r.data.Status == 'OK') {
        app.fl()
        app.fg({
          url: '/API/WeChatApplet.ashx?action=GetPayParam',
          data: {
            action: 'GetPayParam',
            orderId: r.data.OrderId,
            appid: app.globalData.appId,
            openId: 'o8Uka4-Z3WeZFjcneBEgiQXIJoCc',
          },
        }, true).then(s => {
          app.fh()
          if (s.data.Status == 'OK') {
            console.log(s, '2222222');
            wx.requestPayment({
              timeStamp: s.data.Data.timeStamp,
              nonceStr: s.data.Data.nonceStr,
              package: "prepay_id=" + s.data.Data.prepayId,
              signType: 'MD5',
              paySign: s.data.Data.sign,
              success(res) {
                if (res.errMsg == "requestPayment:ok") {
                  app.fh()
                  app.fa("支付完成!")
                  setTimeout(() => {
                    that.setData({
                      functionList: [
                        {
                          name: '已上架',
                          data: [],
                          finsh: false,
                          page: 1,
                          post: 1,
                        },
                        {
                          name: '已下架',
                          data: [],
                          finsh: false,
                          page: 1,
                          post: 2,
                        },
                      ],
                      showAlertTH: false
                    })
                    that.getData()


                  }, 1050)
                }
              },
              fail(res) {
                app.fh()
                app.fa("支付失败,请重试！")
              }
            })
          } else app.fa(r.data.Message)
        })


      } else app.fa(r.data.Message)

    })
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
    this.getData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})