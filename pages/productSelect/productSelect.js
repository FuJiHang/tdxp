// pages/productSelect/productSelect.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    LiveProductList:[],
    dataLength: 0,
    PageNum:1,
    ischecked: false,
    goodsList:'',
    goodsSelectNum:0, //选中个数
  },

  // 选择商品
  checkboxGoodsChange: function (e) {
    console.log(e)
    this.data.LiveProductList[e.currentTarget.dataset.index].isSelected = !this.data.LiveProductList[e.currentTarget.dataset.index].isSelected
    let arr = this.data.LiveProductList.filter(el => el.isSelected),
      goodsList = [];
    this.data.selectItems = arr
    // console.log(arr)
    for (var i = 0; i < arr.length; i++) {
      var goodsItem = {}
      goodsItem.ProductId = arr[i].ProductId
      goodsItem.DisplaySequence = arr[i].DisplaySequence
      goodsList.push(goodsItem)
    }
    console.log(goodsList)
    this.setData({
      goodsList: JSON.stringify(goodsList),
      goodsSelectNum: goodsList.length
    })
  },

  // 获取关联商品
  getLiveProductList: function () {
    var _this = this
    wx.request({
      url: getApp().getUrl('GetLiveProduct'),
      data: {
        PageNum: _this.data.PageNum,
        pageSize: 10
      },
      success: function (res) {
        console.log('商品列表', res.data)
        if (res.data.Status === "success") {
          _this.data.dataLength = res.data.Data.Data.length
          _this.data.LiveProductList = _this.data.LiveProductList.concat(res.data.Data.Data)
          _this.setData({
            LiveProductList: _this.data.LiveProductList
          })
        }
      },
      fail: function (e) {
        console.log(e)
        wx.hideLoading()
      }
    })
  },

  // 完成
  toComplete:function(){
    wx.setStorage({
      key: "selectGoodsList",
      data: this.data.goodsList
    })
    wx.navigateBack({})
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getLiveProductList()
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
    if (this.data.dataLength === 10) {
      this.data.PageNum++
      this.getLiveProductList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})