const app = getApp();
import { orderDetail } from '../../utils/requestApi';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.data.imgurl,
    data: null,  //数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {
    this.initData(opt.id)
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
  // 获取订单详情
  initData: function (id) {
    orderDetail({
      orderId: id
    }).then(res => {
      console.log("获取订单详情", res)
      if (res.data.Status == "Success") this.setData({ data: res.data.Data })
    })
  },

  // 设置系统剪贴板的内容
  _setClipboard: function (e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.code,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data)  // code 数据
          }
        })
      }
    })
  },

  //跳转商品详情
  // handleDetail(){
  //   wx.navigateTo({
  //     url: '/pages/goodsDetail/goodsDetail',
  //     success: (result) => {

  //     },
  //     fail: () => {},
  //     complete: () => {}
  //   });

  // },

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