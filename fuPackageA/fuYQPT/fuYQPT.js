const app = getApp()
import { countdown } from '../../utils/util';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    prDid: 0,
    storeid: 0,
    isTeam: 0,
    goodsInfo: {},
    skuItem: {},
    djs:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.storeId=options.storeid
    this.setData({
      prDid: options.prDid,
      storeid: options.storeid,
      isTeam: options.isTeam
    })

    if (!app.globalData.GetMembersInfo || !app.globalData.GetMembersInfo.openId) {
      app.getOpenId(function (a) {
        app.fg({
          action: 'GetMembersInfo',
          openId: a
        }).then(r => {
          if (r.data.Status == "OK") {
            let dataR = r.data.Data
            dataR.openId = a
            app.setMembersInfo(dataR)
          } else {
            wx.redirectTo({
              url: "/pages/login/login"
            });
          }
        })
      })
    }


    this.getData()
  },

  getData() {
    //初始化页面数据
    wx.showLoading({
      title: '加载中...',
    })
    let that = this
    let {
      prDid,
      storeid,
    } = this.data
    app.getOpenId(function (a) {
      app.fg({
        url: '/AppShop/AppShopHandler.ashx',
        data: {
          action: 'getProductDetail',
          ProductID: prDid,
          RStoreId: storeid || '',
          openId: a,
        }

      }, true).then(res => {
        console.log("商品详情数据", res)
        if (res.statusCode == 200) {
          wx.hideLoading();
          let { Result } = res.data;
          Result.prDid = that.data.prDid
          Result.storeid = that.data.storeid
          let sta = Result.IsFightGroup; //开团状态
          that.setData({
            skuItem: Result.SkuItem,
            goodsInfo: Result,
          }, () => {

          })
          // 参团倒计时
          if (sta) {
            that.data.djs=setInterval(() => {
              that.Clusterdata()
            }, 1000)
          }
        }
      })
    })
  },

  Clusterdata() {
    let { goodsInfo, isTeam } = this.data, that = this
    goodsInfo.FightGroupInfos.forEach((item, index) => {
      if (item.THeadUserId == isTeam) {
        let endDate = countdown(item.EndTime);
        item.limitHours = endDate.limitHours;
        item.limitMin = endDate.limitMin;
        item.limitSecond = endDate.limitSecond;
        that.setData({
          groupList: item,
        })
      }

    })

  },


  // 
  toBuy() {

    if(app.globalData.GetMembersInfo.UserId==this.data.groupList.THeadUserId) return app.fa('不能参与自己开的团')
    let that=this,data=this.data
    wx.navigateTo({
   
      url: '/fuPackageA/fuOkOrder/fuOkOrder?fromPage=fightgroup&sku='+data.goodsInfo.FightGroupSkuInfos[0].SkuId+'&buyAmount=1'
      +'&groupId='+data.groupList.FightGroupActivityId+'&FightGroupId='+data.groupList.FightGroupId+"&data="+data.prDid+"&storeid="+data.storeid
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
    clearInterval(this.data.djs)
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