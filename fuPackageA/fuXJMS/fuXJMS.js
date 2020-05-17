/*
 * @Author: fujihang
 * @Date: 2020-02-16 16:39:10
 * @LastEditors: fujihang
 * @LastEditTime: 2020-02-19 14:35:27
 * @FilePath: \头道惠\fuPackageA\fuXJMS\fuXJMS.js
 */
const app = getApp()
import { countdown } from '../../utils/util';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productList: [],
    page: 1,
    finsh: false,
    disList: [],
  },

  getData() {
    let data = this.data, that = this
    if (data.finsh) return
    app.fl()
    app.fg({
      action: 'GetCountDownInfos',
    }).then(r => {
      if (r.data.Status == 'Success') {
        r.data.CountDownList.Data.forEach((c, i) => {
          data.disList['child' + i] = setInterval(() => {
            let startState = countdown(c.StartDate);
            let endState = countdown(c.EndDate);
            if (startState.overTime) {
              c.limitTxt = '距结束',
                c.limitHours = endState.limitHours,
                c.limitMin = endState.limitMin,
                c.limitSecond = endState.limitSecond
              if (endState.limitHours == '00' && endState.limitMin == '00' && endState.limitSecond == '00') {
                clearInterval(data.disList['child' + i])
                c.limitTxt = '已结束'
              }
            } else {
              c.limitTxt = '距降价',
                c.limitHours = startState.limitHours,
                c.limitMin = startState.limitMin,
                c.limitSecond = startState.limitSecond
            }
            c.bfb = parseInt(c.BoughtCount / c.TotalCount * 100)
            that.setData({
              ['productList[' + i + ']']: c,
            })
          }, 1000)
        })
        setTimeout(()=>{
          app.fh()
          that.setData({
            finsh:true,
          })
        },1000)
      } else{
        app.fh()
        app.fa(r.data.message)
      }
    })


  },

  /*  */
  djsFN() {
    let data = this.data, that = this

    var djs = setInterval(() => {
      let startState = countdown(data.goodsInfo.CountDownSkuInfo.StartDate);
      let endState = countdown(data.goodsInfo.CountDownSkuInfo.EndDate);
      if (startState.overTime) {
        that.setData({
          limitTxt: '距结束',
          limitHours: endState.limitHours,
          limitMin: endState.limitMin,
          limitSecond: endState.limitSecond
        })
        if (endState.limitHours == '00' && endState.limitMin == '00' && endState.limitSecond == '00') {
          clearInterval(djs)
          that.setData({
            limitTxt: '已结束',

          })
        }
      } else {
        that.setData({
          limitTxt: '距降价',
          limitHours: startState.limitHours,
          limitMin: startState.limitMin,
          limitSecond: startState.limitSecond
        })
      }

    }, 1000)

  },


  //跳转详情
  handleDetail(e) {
    if (e.currentTarget.dataset.sx == '100') return
    const { productid, storeid, pagetype } = e.currentTarget.dataset; //商品id和门店id
    wx.navigateTo({
      url: `/fuPackageA/fuProductT/fuProductT?prDid=${productid}&pagetype=${pagetype}&storeid=${storeid}`,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
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
    this.data.disList.forEach(c => {
      clearInterval(c)
    })
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
    /*  this.getData() */
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})