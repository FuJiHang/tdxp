const app = getApp()
import QQMapWX from '../../libs/qqmap-wx-jssdk.js';
import { countdown } from '../../utils/util';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    getStore: {},
    page: 1,
    teamList: [],
    finsh: false,
    seach: '',
    fujihang: {},
    AdImg: "",
    disList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    if (options.StoreId) return this.getUserPoints(options.StoreId)
    wx.getStorage({
      key: 'getStore',
      success: function (r) {
        that.setData({
          getStore: r.data
        })
        wx.setNavigationBarTitle({
          title: r.data.StoreName
        })
        that.getTeamBuy()
      },
    })
  },


  getUserPoints(StoreId) { //经纬度获取
    let that = this
    var qqmapsdk = new QQMapWX({
      key: '7V4BZ-4WFW4-L3LU6-XLRLM-ZZ7BJ-MBFAM' // 必填
    });
    var _this = this
    wx.getLocation({
      type: 'wgs84',
      fail: function () {
        wx.showModal({
          title: '提示',
          content: '请打开位置信息授权',
          success(res) {
            if (res.confirm) {
              wx.openSetting({})
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      },
      success: function (res) { //经纬度成功回调
        console.log("输出经纬度回调", res);
        let fujihang = {
          Latitude: res.latitude,
          Longitude: res.longitude
        }

        that.setData({
          fujihang: fujihang
        })
        wx.setStorage({
          key: 'LatiLongitude',
          data: fujihang
        })
        that.getStoreFN(StoreId)
      }
    })
  },

  // 设置全局变量
  getStoreFN(StoreId) {
    let data = this.data, that = this
    app.fl()
    app.fg({
      url: "/api/PublicHandler.ashx?action=GetBaseStoreInfo",
      data: {
        StoreId: StoreId,
        Lat: data.fujihang.Latitude,
        Lng: data.fujihang.Longitude,
      }
    }, true).then(r => {
      app.fh()
      if (r.data.Status == "Success") {
        r.data.Result.StoreId = StoreId
        that.setData({
          getStore: r.data.Result,
        })
        wx.setStorage({
          key: 'getStore',
          data: r.data.Result
        })
        that.getTeamBuy()
        wx.setNavigationBarTitle({
          title: r.data.Result.StoreName
        })
      } else app.fa(r.data.Message)
    })
  },

  // 
  changInput(e) {
    this.setData({
      seach: e.detail.value
    })
  },

  // 
  seachFN() {

    this.data.finsh = false
    this.data.teamList = []
    this.data.page = 1
    this.getTeamBuy()

  },

  // 获取拼团
  getTeamBuy() {
    let data = this.data, that = this
    if (data.finsh) return
    app.fl()
    app.fg({
      url: '/API/ProductHandler.ashx?action=GetFightGroupActivityInfos',
      data: {
        pageSize: 10,
        pageIndex: data.page,
        sortBy: 'SalePrice',
        StoreId: data.getStore.StoreId,
        Keywords: data.seach
      },
    }, true).then(r => {
      // console.log("拼团数据", r);
      app.fh()
      if (r.data.Result.Data) {
        r.data.Result.Data.forEach((c, i) => {
          data.disList['child' + i] = setInterval(() => {
            let startState = countdown(c.StartDate);
            console.log(startState,11111122222);
            let endState = countdown(c.EndDate);
            if (startState.overTime) {
              c.limitTxt = '离活动结束',
                c.day=parseInt(endState.limitHours/24)
                c.limitHours = endState.limitHours%24,
                c.limitMin = endState.limitMin,
                c.limitSecond = endState.limitSecond
              if (endState.limitHours == '00' && endState.limitMin == '00' && endState.limitSecond == '00') {
                clearInterval(data.disList['child' + i])
                c.limitTxt = '已结束'
              }
            } else {
              c.limitTxt = '离活动开始',
              c.day=parseInt(startState.limitHours/24)
                c.limitHours = startState.limitHours%24,
                c.limitMin = startState.limitMin,
                c.limitSecond = startState.limitSecond
            }
            that.setData({
              ['teamList[' + i + ']']: c
            })
          }, 1000)

        })
        that.setData({
          AdImg: r.data.Result.AdImg,
          page: ++data.page,
          finsh: r.data.Result.Data,
        })
      }
    })
  },

  // 


  // // 跳转详情
  handleDetail(e) {
    const { productid, storeid, pagetype, dname } = e.currentTarget.dataset; //商品id和门店id
    wx.navigateTo({
      url: `/fuPackageA/fuProductT/fuProductT?prDid=${productid}&pagetype=${pagetype}&storeid=${storeid}&dname=${dname}`,
    })
    wx.setStorageSync("buyType", "fightgroup")
  },

  // 
  toFN(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.to
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

  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let data = this.data
    return {
      title: data.getStore.StoreName,
      path: '/fuPackageA/fuTeamList/fuTeamList?StoreId=' + data.getStore.StoreId,
      imageUrl: "",
      success: (res) => {
        app.fa('转发成功')
      },
      fail: (res) => {
        app.fa('转发失败')
      }

    }
  }
})