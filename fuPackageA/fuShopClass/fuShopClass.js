const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    functionList: [

    ],
    seach: '',
    active: 0,
    focus:false,
  },

  getFocus(){
    this.setData({
      focus:true,
    })
  },
  getBlur(){
    this.setData({
      focus:false,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
  },

  // 
  inputFN(e){
    this.setData({
      [e.currentTarget.dataset.name]:e.detail.value
    })
  },

  getData() {
    let data = this.data, that = this
    app.fl()
    app.fg({
      url: "/AppShop/AppShopHandler.ashx?action=GetProductCategories",
    }, true).then(r => {
      app.fh()
      r.data.Result.Data.forEach(s => {
        let w = {
          name: s.Name,
          data: [],
          finsh: false,
          page: 1,
          post: s.CategoryId,
          BigImageUrl:s.BigImageUrl
        }
        data.functionList.push(w)
      })
      that.setData({
        functionList: data.functionList,
      })
      that.getDataList()
    })
  },

  // 
  seachFN(){
    let data = this.data, that = this
    data.functionList.forEach(s=>{
      s.data=[]
      s.finsh=false
      s.page=1
    })
    that.setData({
      functionList:data.functionList
    })
    this.getDataList()
  },

  // 
  onChange(e) {
    this.setData({
      active: e.detail.index
    })
    this.getDataList()
  },


  getDataList() {
    let data = this.data, that = this
    if( data.functionList[data.active].finsh) return
    app.fl()
    app.fg({
      url: '/api/ProductHandler.ashx?action=GetProducts',
      data: {
        pageSize: 10,
        pageIndex: data.functionList[data.active].page,
        Keywords: data.seach,
        CatetoryId: data.functionList[data.active].post,
      }
    }, true).then(r => {
      app.fh()
      r.data.Result.Data.forEach(s => {
        data.functionList[data.active].data.push(s)
      })
      data.functionList[data.active].page++
      data.functionList[data.active].finsh = r.data.Result.Data.length < 10
      that.setData({
        functionList: data.functionList,
      })
      console.log(r)
    })
  },


  //跳转详情
  handleDetail(e) {
    const { productid, storeid, pagetype } = e.currentTarget.dataset; //商品id和门店id
    wx.navigateTo({
      url: `/fuPackageA/fuProductT/fuProductT?prDid=${productid}&pagetype=${pagetype}&storeid=${storeid}`,
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
    this.getDataList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})