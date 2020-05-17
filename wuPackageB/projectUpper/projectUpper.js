const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.newImg,
    chooseList: [
      {
        name: "上架次数卡",
        val: 0,
      },
      {
        name: "下架次数卡",
        val: 0,
      },
    ],
    choose: 0,
    page: 1,
    dataList: [],
    CList: [],
    finsh: false,
    subShow: false,
    stockShow: false,
    SList: [],
    ProductId: 0,
    Keywords: '',
    storeid: 0,//门店id
    tabShow: false,
    tagIdList: [
      {
        name: '精选',
        id: 18,
        status: false,
      },
      {
        name: '热销',
        id: 9,
        status: false,
      },
      {
        name: '新品',
        id: 10,
        status: false,
      },
    ],
    tagPro: 0,
    //wjx
    setShow: false,
    setTitle: ['百分比', '固定金额'],
    val: '',
    newShow: false,
    pid: '',//商品id
    split: '',//输入框的值
    typeNum: '',
    memShow: false,//显示分佣
    postMember: [],//获取分佣信息
    ProductIdPost: 0,//提交商品分佣id
  },

  // 
  openTagFN(e) {
    let a = e.currentTarget.dataset.data, that = this, data = this.data
    data.tagIdList.forEach(c => {
      if (a.tagIds.indexOf(c.id) != -1) c.status = true
      else c.status = false
    })
    this.setData({
      tagPro: a.ProductId,
      tagIdList: data.tagIdList,
      tabShow: true,
    })

  },

  // 设置分类
  setFN(e) {
    let a = e.currentTarget.dataset.data
    let data = this.data, that = this
    console.log(a);
    console.log(data);
    app.fl()
    wx.request({
      url: app.data.url + '/API/ProductHandler.ashx?action=SetProductCatetory',
      data: {
        openId: app.globalData.GetMembersInfo.openId,
        storeId: data.storeid,
        productId: data.tagPro,
        tagId: a.id,
        type: a.status ? 1 : 0
      },
      success: (res) => {
        app.fh()
        if (r.data.Status == 'Success') {
          that.setData({
            page: 1,
            finsh: false,
            dataList: [],
            ['tagIdList[' + e.currentTarget.dataset.index + '].status']: !a.status
          })
          that.getData()
          app.fa('设置成功')
        } else app.fa('设置失败')
      },
      fail: () => { },
      complete: () => { }
    });
  },

  // 切换导航栏
  chooseFN(e) {
    const { index } = e.currentTarget.dataset;
    if (this.data.choose == index) return
    this.setData({
      choose: index,
      page: 1,
      finsh: false,
      dataList: [],
    })

    this.getData(index + 1)
    console.log();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    // let sid=app.globalData.GetMembersInfo.StoreId

    // let sid = wx.getStorageSync('getStore').StoreId;
    // let storeid = wx.getStorageSync('userinfo').StoreId;
    this.setData({
      storeid: app.globalData.GetMembersInfo.StoreId
    })
    this.getData(1);
  },

  //用于选这百分比
  handleSearch() {
    this.setData({
      setShow: true
    })
  },
  //关闭弹窗
  handleGB() {
    this.setData({
      setShow: false
    })
  },
  //点击百分比弹窗
  handleItem(e) {
    // console.log(e);
    const { index, item } = e.currentTarget.dataset;
    // console.log(item);
    this.setData({
      setVal: item,
      setShow: false
    })
  },
  handleAll() {
    this.setData({
      newShow: false
    })
  },
  // 获取弹窗的值
  getWinData(id, pid) {
    wx.request({
      url: app.data.url + '/api/OrdersHandler.ashx?action=StoreInitConfig',
      data: {
        openId: app.globalData.GetMembersInfo.openId,
        StoreId: id,//	是	int	门店id
        ProductId: pid,//	是	int	商品id
      },
      // header: { Cookie: wx.getStorageSync('cookieFu') },
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      success: (res) => {
        app.fh();
        console.log(res);
        if (res.errMsg == "request:ok") {
          if (res.data.ConfigType == 0) {
            this.setData({
              setVal: '百分比',
              val: '',
              split: res.data.ConfigNum
            })
            if (res.data.ConfigNum != 0) {
              this.setData({
                setVal: '百分比',
                val: res.data.ConfigNum,
                split: res.data.ConfigNum
              })
            }
          } else if (res.data.ConfigType == 1) {
            this.setData({
              setVal: '固定金额',
              val: res.data.ConfigNum,
              split: res.data.ConfigNum
            })
          }
        }
      },
      fail: () => { },
      complete: () => { }
    });

  },
  //输入框的值
  handleInput(e) {
    console.log(e);
    const { value } = e.detail;
    this.setData({
      split: value
    })
  },
  //提交分佣设置
  subData(e) {
    console.log(e);
    const { val } = e.currentTarget.dataset;
    let num = ''
    if (val == '百分比') {
      num = 0
    } else if (val == "固定金额") {
      num = 1
    }
    let data = this.data;
    let that = this;
    wx.request({
      url: app.data.url + '/api/OrdersHandler.ashx?action=StoreSetConfig',
      data: {
        openId: app.globalData.GetMembersInfo.openId,
        StoreId: data.storeid,//	是	int	门店id
        ProductId: data.pid,//	是	int	商品id
        SplitType: num,//	是	string	上级返利类型（0-百分比，1-固定金额）
        SplitNum: data.split, //	是	string	返利比率数值或者金额数值
      },
      // header: { Cookie: wx.getStorageSync('cookieFu') },
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      success: (res) => {
        app.fh();
        console.log("输出提交状态", res);
        if (res.data.Status == "Success") {
          wx.showToast({
            title: res.data.Message,
            icon: 'none',
            duration: 1500,
            mask: true,
            success: (result) => {
              that.setData({
                newShow: false
              })
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


  OkSeach() {
    this.setData({
      page: 1,
      finsh: false,
      dataList: [],
    })
    this.getData(this.data.typeNum)
  },

  seaChFN(e) {
    this.setData({
      Keywords: e.detail.value
    })
  },

  // 
  onCloseT() {
    this.setData({
      tabShow: false,
      memShow: false
    })
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  // 上下架
  changeStatus(e) {
    console.log(e, '=======');
    let data = this.data, that = this, datar = e.currentTarget.dataset
    const { type } = e.currentTarget.dataset;
    app.fl()
    wx.request({
      url: app.data.url + '/API/OrdersHandler.ashx?action=StoreSaleOnOffProduct',
      data: {
        openId: app.globalData.GetMembersInfo.openId,
        ProductId: datar.data.ProductId,
        StoreId: data.storeid ? data.storeid : '',
        // SaleStatus: datar.type == 'up' ? 1 : 2
        SaleStatus: type
      },
      header: { Cookie: wx.getStorageSync('cookieFu') },
      success: (r) => {
        console.log("输出请求上下架状态", r);
        app.fh()
        if (r.data.Status == 'Success') {
          that.setData({
            page: 1,
            finsh: false,
            dataList: [],
          })
          that.getData(type)
        }
        app.fa(r.data.Message)
        console.log(r)
      },
      fail: () => { },
      complete: () => { }
    });
  },
  //wjx------------------------------------------------------
  // changeStatus(e) {
  //   console.log("输出",e);
  //   let data = this.data, that = this, datar = e.currentTarget.dataset
  //   // if (data.hotPro[data.active].finsh) return
  //   const { type } = e.currentTarget.dataset;
  //   app.fl()
  //   app.fg({
  //     action: 'GetStoreActivityCardList',
  //     PageSize: 10,
  //     page: 1,
  //     StoreId: data.storeid,
  //     StoreSaleStatus: type
  //   }).then(res => {
  //     console.log("输出请求上下架状态", res);
  //     app.fh()
  //     if (res.data.Status == 'OK') {
  //       let data = res.data.Data;
  //       that.setData({
  //         page: 1,
  //         finsh: false,
  //         dataList: [],
  //         choose:type-1,
  //       })
  //       that.getData(type)
  //     }
  //   })
  // },

  getDataFN() {
    let data = this.data, that = this

    wx.request({
      // url: app.data.url + '/api/ProductHandler.ashx?action=GetProducts',
      url: app.data.url + '/API/WeChatApplet.ashx',
      data: {
        openId: app.globalData.GetMembersInfo.openId,
        action: 'GetStoreActivityCardList',//	是	string	GetStoreActivityCardList
        StoreId: data.storeid ? data.storeid : '',
        pageSize: 10,
        pageIndex: data.page,
        KeyWord: data.Keywords,
        // StoreSaleStatus: data.choose ? 2 : ''
        StoreSaleStatus: 2
      },
      header: { Cookie: wx.getStorageSync('cookieFu') },
      success: (r) => {

        if (r.data.Status == 'OK') {
          let datar = r.data.Data

          that.setData({
            ['chooseList[1].val']: r.data.TotalRecords,
          })

        } else app.fa('获取失败')
      },
      fail: () => { },
      complete: () => { }
    });
  },

  //初始化数据
  getData(num) {
    let data = this.data, that = this
    if (data.finsh) return
    app.fl()
    wx.request({
      // url: app.data.url + '/api/ProductHandler.ashx?action=GetProducts',
      url: app.data.url + '/API/WeChatApplet.ashx',
      data: {
        openId: app.globalData.GetMembersInfo.openId,
        action: 'GetStoreActivityCardList',//	是	string	GetStoreActivityCardList
        StoreId: data.storeid ? data.storeid : '',
        pageSize: 10,
        pageIndex: data.page,
        KeyWord: data.Keywords,
        // StoreSaleStatus: data.choose ? 2 : ''
        StoreSaleStatus: num
      },
      header: { Cookie: wx.getStorageSync('cookieFu') },
      success: (r) => {
        console.log("输出次数卡的初始化数据", r);
        app.fh()
        if (r.data.Status == 'OK') {
          let datar = r.data.Data
          datar.forEach(c => {
            data.dataList.push(c)
          })
          that.setData({
            dataList: data.dataList,
            finsh: datar.length < 10 ? true : false,
            page: ++data.page,
            choose: num - 1,


            typeNum: num,//用于判断是上架还是下架按钮,1为上架产品,所以变成下架按钮
            // ['chooseList[1].val']: r.data.TotalRecords,
          })
          console.log(num, '==========2222222');
          if (num == 1) {
            that.setData({
              ['chooseList[0].val']: r.data.TotalRecords,
            })
            that.getDataFN()
          } else if (num == 2) {
            that.setData({
              ['chooseList[1].val']: r.data.TotalRecords,
            })
          }
        } else app.fa('获取失败')
      },
      fail: () => { },
      complete: () => { }
    });
  },

  onCloseS() {
    this.setData({
      subShow: false,
    })
  },
  onCloseST() {
    this.setData({
      stockShow: false,
    })
  },

  // CType  0金额1百分比
  subCom(e) {
    let data = this.data, that = this, datac = e.currentTarget.dataset.data
    app.fl()
    this.getWinData(data.storeid, datac.ProductId);
    this.setData({
      pid: datac.ProductId,
      newShow: true
    })
    // wx.request({
    //   url: app.data.url + '/api/OrdersHandler.ashx?action=StoreInitConfig',
    //   data: {
    //     StoreId: data.storeid ? data.storeid : '',
    //     ProductId: datac.ProductId,
    //   },
    //   header: { Cookie: wx.getStorageSync('cookieFu') },
    //   success: (r) => {
    //     app.fh()
    //     if (r.data.Status == 'Success') {
    //       console.log("输出百分比CList", r.data.CList);
    //       that.setData({
    //         CList: r.data.CList,
    //         subShow: true,
    //         ProductId: datac.ProductId,
    //       })
    //     } else app.fa(r.data.Message)
    //   },
    //   fail: () => { },
    //   complete: () => { }
    // });
  },

  // 
  StockFN(e) {
    let data = this.data, that = this, datac = e.currentTarget.dataset.data
    app.fl()
    wx.request({
      url: app.data.url + '/api/OrdersHandler.ashx?action=StoreInitSkuStock',
      data: {
        openId: app.globalData.GetMembersInfo.openId,
        StoreId: data.storeid ? data.storeid : '',
        ProductId: datac.ProductId,
      },
      header: { Cookie: wx.getStorageSync('cookieFu') },
      success: (r) => {
        app.fh()
        if (r.data.Status == 'Success') {
          that.setData({
            SList: r.data.SList,
            stockShow: true,
            ProductId: datac.ProductId,
          })
        } else app.fa(r.data.Message)
      },
      fail: () => { },
      complete: () => { }
    });
  },

  // 
  subminFNST() {
    let data = this.data, that = this, pData = []
    data.SList.forEach(c => {
      pData.push({
        SkuId: c.SkuId,
        Stock: c.StoreStock
      })
    })
    app.fl()
    wx.request({
      url: app.data.url + '/api/OrdersHandler.ashx?action=StoreSetSkuStock',
      data: {
        openId: app.globalData.GetMembersInfo.openId,
        StoreId: data.storeid ? data.storeid : '',
        ProductId: data.ProductId,
        stockObj: JSON.stringify(pData)
      },
      header: { Cookie: wx.getStorageSync('cookieFu') },
      success: (r) => {
        app.fh()
        if (r.data.Status == 'OK') {
          that.setData({
            page: 1,
            finsh: false,
            dataList: [],

          })
          that.getData()
        } else app.fa(r.data.Message)
      },
      fail: () => { },
      complete: () => { }
    });
  },




  // 
  changeType(e) {
    let datac = e.currentTarget.dataset
    this.setData({
      ['CList[' + datac.index + '].CType']: datac.val == 0 ? 1 : 0
    })
  },
  //wjx
  changeAType(e) {
    let datac = e.currentTarget.dataset
    this.setData({
      ['CList[' + datac.index + '].AType']: datac.val == 0 ? 1 : 0
    })
  },
  // 
  inputFN(e) {

    this.setData({
      [e.currentTarget.dataset.name]: e.detail.value
    })
  },

  //  wjx修改 添加 复购
  subminFN() {

    let data = this.data, that = this
    for (let i = 0; i < data.CList.length; i++) {
      if (data.CList[i].CType == 1) {
        if (data.CList[i].Commission > 100) return app.fa(data.CList[i].GradeName + '设置超过百分比')
        else data.CList[i].Commission /= 100
      }
    }
    app.fl()
    wx.request({
      url: app.data.url + '/api/OrdersHandler.ashx?action=StoreSetConfig',
      data: {
        openId: app.globalData.GetMembersInfo.openId,
        StoreId: data.storeid ? data.storeid : '',
        ProductId: data.ProductId,
        configObj: JSON.stringify(data.CList)
      },
      header: { Cookie: wx.getStorageSync('cookieFu') },
      success: (r) => {
        app.fh()
        if (r.data.Status == 'OK') {
          that.setData({
            page: 1,
            finsh: false,
            dataList: [],
          })
          that.getData()
        } else app.fa(r.data.Message)
      },
      fail: () => { },
      complete: () => { }
    });
  },
  // 
  upFN(e) {
    console.log(e);
  },


  // 获取会员等级
  getMember(chuan) {
    let data = this.data, that = this
    app.fl()
    app.fg({
      url: "/api/OrdersHandler.ashx?action=GetMemberGradeList",
    }, true).then(r => {
      app.fh()
      if (r.data.Status == 'Success') {
        r.data.Message.unshift({
          GradeId: 0,
          Name: "店员"
        })
        let chu = JSON.parse(chuan)
        if (chu.length) {
     
          r.data.Message.forEach(c => {

            chu.forEach(u => {
              if (u.GradeId == c.GradeId) {
                c.Commission = u.Commission
                c.FirstType = u.FirstType
              }

            })

          })
        } else {
          r.data.Message.forEach(c => {
            c.Commission = 0
            c.FirstType = 0
          })
        }


        that.setData({
          postMember: r.data.Message,
          memShow: true
        })

      } else app.fa(r.data.Message)
    })
  },

  getMemData(e) {
    let data = this.data, that = this, datar = e.currentTarget.dataset.data
    app.fl()
    app.fg({
      url: "/api/OrdersHandler.ashx?action=StoreInitConfig",
      data: {
        StoreId: data.storeid,
        ProductId: datar.ProductId
      }
    }, true).then(r => {
      app.fh()
      if (r.data.Message == 'Success') {
        that.getMember(r.data.ConfigJson)
        data.ProductIdPost = datar.ProductId
      } else app.fa(r.data.Message)
      console.log(r)
    })
  },


  // 
  changeBFBJE(e) {
    let datar = e.currentTarget.dataset
    this.setData({
      ['postMember[' + datar.index + '].FirstType']: datar.val ? 0 : 1
    })
  },
  // 
  changeInput(e) {
    let datar = e.currentTarget.dataset
    this.setData({
      ['postMember[' + datar.index + '].Commission']: e.detail.value
    })
  },

  // 店主设置商品分佣
  postMemberFN(e) {
    let data = this.data, that = this
    for(let a=0;a<data.postMember.length;a++){
      if(!data.postMember[a].Commission) return app.fa('分佣设置不能为0')
    }
    app.fl()
    app.fg({
      url: '/api/OrdersHandler.ashx?action=StoreSetConfig',
      data: {
        StoreId: data.storeid,
        ProductId: data.ProductIdPost,
        ConfigJson: JSON.stringify(data.postMember)
      }
    }, true).then(r => {
      app.fh()
      if (r.data.Status == 'Success') {
        that.setData({
          memShow: false
        })
        that.setData({
          page: 1,
          finsh: false,
          dataList: [],
        })
        that.getData(data.typeNum)
      }
      app.fa(r.data.Message)
    })
  },




  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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