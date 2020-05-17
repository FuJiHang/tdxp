const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [
      {
        name: '全部',
        data: [],
        finsh: false,
        page: 1,
        post: 0
      },
    ],
    seach: '',
    active: 0,
    focus: false,
    ggw:'',
  },

  getFocus() {
    this.setData({
      focus: true,
    })
  },
  getBlur() {
    this.setData({
      focus: false,
    })
  },

  /** 
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let wwww = JSON.parse(decodeURIComponent(options.data)), data = this.data
    wx.setNavigationBarTitle({
      title: JSON.parse(decodeURIComponent(options.data)).name
    })
    this.setData({
      ggw:wwww.BigImg
    })
    data.dataList[0].post = wwww.cid
    wwww.subs.forEach(s => {
      data.dataList.push({
        name: s.name,
        data: [],
        finsh: false,
        page: 1,
        post: s.cid
      })
    })
    this.setData({
      dataList: data.dataList
    })
    this.getData()
  },


  // 
  onChange(e) {
    this.setData({
      active: e.detail.index
    })
    this.getData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  // 
  inputFN(e){
    this.setData({
      [e.currentTarget.dataset.name]:e.detail.value
    })
  },

    //跳转详情
    handleDetail(e) {
      const { productid, storeid, pagetype } = e.currentTarget.dataset; //商品id和门店id
      wx.navigateTo({
        url: `/fuPackageA/fuProductT/fuProductT?prDid=${productid}&pagetype=${pagetype}&storeid=${storeid}`,
      })
    },

  getData() {
    let data = this.data, that = this
    if (data.dataList[data.active].finsh) return
    app.fl()
    app.fg({
      url: "/api/WeChatApplet.ashx?action=GetProductByType",
      data: {
        productType: 0,
        pageSize: 10,
        pageIndex: data.dataList[data.active].page,
        CatetoryId: data.dataList[data.active].post,
        Keywords: data.seach
      }
    }, true).then(r => {
      app.fh()
      if (r.data.Result.Status == 'Success') {
        data.dataList[data.active].data = data.dataList[data.active].data.concat(r.data.Result.Data)
        data.dataList[data.active].page++
        data.dataList[data.active].finsh = r.data.Result.Data.length < 10
        that.setData({
          dataList: data.dataList
        })
      } else app.fa(r.data.Message)
      console.log(r)
    })
  },


  // 
  seachFN() {
    let data = this.data, that = this

    data.dataList.forEach(s => {
      s.data = []
      s.finsh = false
      s.page = 1
    })
    that.setData({
      dataList: data.dataList
    })
    this.getData()
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