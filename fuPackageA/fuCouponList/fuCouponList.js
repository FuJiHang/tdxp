const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotPro: [],
    active: 0,
    imgUrl: app.imgUrl,
    seach: '',
    sf: 0,//0:是购买页面，1门店页面，2客户页面
    teahList: [],
    show: false,
    tid: '',
    cid: '',
    UserId: '',
    getStore: {},
    LatiLongitude: {},
  },

  // 搜索字
  seaChFN(e) {
    this.setData({
      seach: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    let that = this
    wx.getStorage({
      key: 'getStore',
      success(e) {
        that.setData({
          getStore: e.data
        })
      }
    })

    this.setData({
      sf: options.sf ? options.sf : 0,
      UserId: options.UserId ? options.UserId : '',

    })
    wx.getStorage({
      key: 'LatiLongitude',
      success(res) {
        that.setData({
          LatiLongitude: res.data
        })
        that.getCateCou()
      }
    })
    if (this.data.sf == 1) this.getTeachList()
  },

  toFN(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.to
    })
  },

  // 店主卡券列表
  getStoreCou() {
    let data = this.data, that = this
    if (data.hotPro[data.active].finsh) return
    app.fl()
    app.fg({
      action: 'GetMyCardList',
      StoreId: data.sf == 1 ? app.globalData.GetMembersInfo.StoreId : data.getStore.StoreId,
      openId: app.globalData.GetMembersInfo.openId,
      PageSize: 10,
      CategoryId: data.hotPro[data.active].post,
      PageIndex: data.hotPro[data.active].page,
      UserId: data.UserId ? data.UserId : '',
      Latitude: data.LatiLongitude.Latitude,
      Longitude: data.LatiLongitude.Longitude,
    }).then(r => {
      app.fh()
      if (r.data.Status == 'OK') {
        r.data.Data.forEach(c => {
          c.GetDate = c.GetDate.split('T')[0];
          data.hotPro[data.active].data.push(c)
        })
        data.hotPro[data.active].page++
        data.hotPro[data.active].finsh = r.data.Data.length < 10
        that.setData({
          hotPro: data.hotPro
        })
      }
    })
  },

  // 选择技师
  ChangeTC(e) {
    let datar = e.currentTarget.dataset, data = this.data
    data.teahList.forEach((c, i) => {
      if (i == datar.index) c.choose = !datar.choose
      else c.choose = false
    })

    this.setData({
      teahList: data.teahList
      // ['teahList[' + datar.index + '].choose']: !datar.choose
    })
  },

  // 选择技师
  okTeach() {
    let data = this.data, that = this, id = ''
    data.teahList.forEach(c => {
      if (c.choose) {
        if (!id) id = c.Id
        else id += ',' + c.Id
      }

    })
    if (!id) return app.fa('请选择技师！')
    // this.setData({
    //   tid:id,

    // })

    app.fl()
    app.fg({
      action: 'WriteOffStoreActivityCard',
      // openId: 'os5--4owQV74ojA5Buv0UACHJhBE',//店主
      openId: app.globalData.GetMembersInfo.openId,

      ID: data.cid,
      TechnicianIds: id,
    }).then(r => {
      app.fh()
      app.fa(r.data.Message)
      if (r.data.Status == 'OK') {
        that.setData({
          show: false,
        })
        that.setData({
          ['hotPro[' + data.active + ']']: {
            name: data.hotPro[data.active].name,
            post: data.hotPro[data.active].cid,
            data: [],
            finsh: false,
            page: 1,
          }
        })
        that.getStoreCou()
      }

    })
  },

  // 选择卡片
  chooseCou(e) {
    console.log(e.currentTarget.dataset);
    if (!e.currentTarget.dataset.isok) return app.fa("该卡已使用完！")
    this.setData({
      cid: e.currentTarget.dataset.id,
      show: true,
    })

  },

  // 关闭
  onClose() {
    this.setData({
      show: false,
    })
  },

  // 技师列表
  getTeachList() {
    let data = this.data, that = this
    app.fl()
    app.fg({
      url: '/api/StoreManage.ashx?action=GetTechniciansList',
      data: {
        pageIndex: 1,
        pageSize: 1000,
        // StoreId:app.globalData.GetMembersInfo.stid
        StoreId: data.sf == 1 ? app.globalData.GetMembersInfo.StoreId : data.getStore.StoreId,
      }

    }, true).then(r => {
      app.fh()
      if (r.data.Status == 'OK') {

        r.data.Data.forEach(c => {
          c.choose = false
          data.teahList.push(c)
        })
        that.setData({
          teahList: data.teahList
        })
      }
    })
  },

  // 卡券分类
  getCateCou() {
    let data = this.data, that = this
    app.fl()
    app.fg({
      action: 'GetAllCategories',
      Type: 1
    }).then(r => {
      app.fh()
      if (r.data.Status == 'OK') {
        data.hotPro = []

         data.hotPro.push({
          name: '全部',
          post: '',
          data: [],
          finsh: false,
          page: 1,
        }) 

        r.data.Data.forEach(c => {
          let a = {
            name: c.name,
            post: c.cid,
            data: [],
            finsh: false,
            page: 1,
          }
          data.hotPro.push(a)
        })
        that.setData({
          hotPro: data.hotPro
        })
        if (data.sf) that.getStoreCou()
        else that.getCou()

      }
    })
  },

  // 
  onChange(e) {
    this.setData({
      active: e.detail.index
    })
    if (this.data.sf) this.getStoreCou()
    else this.getCou()
  },

  // 更多购买卡券列表
  getCou() {
    let data = this.data, that = this
    if (data.hotPro[data.active].finsh) return
    app.fl()
    app.fg({
      action: 'GetStoreActivityCardList',
      CategoryId: data.hotPro[data.active].post,
      PageSize: 10,
      page: data.hotPro[data.active].page,
      keyWord: data.seach,
      StoreSaleStatus:1,
    }).then(r => {
      app.fh()
      if (r.data.Status == 'OK') {
        r.data.Data.forEach(c => {
          data.hotPro[data.active].data.push(c)
        })
        data.hotPro[data.active].page++
        data.hotPro[data.active].finsh = r.data.Data.length < 10
        that.setData({
          hotPro: data.hotPro
        })
      }
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