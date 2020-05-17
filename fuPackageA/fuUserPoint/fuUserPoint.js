// pages/myBeautyIntegral/myBeautyIntegral.js

const app = getApp()
Page({
  data: {
    imgUrl: app.imgUrl,//
    page: 1,
    finsh: false,//是否完成
    dataInfor: {},//内容
    dataList: [],//列表内容
  },

  getDataR() {
    let data = this.data
    if (data.finsh) return;
    app.fl()
    app.fg({
      action: 'GetUserPoints',
      openId: app.globalData.GetMembersInfo.openId,
      // openId:'os5--4mv2odIzdzHB9Gu-XjGUx2k',
      pageIndex: data.page,
      pageSize: 10,

    }).then(r => {
      app.fh()
      if (r.errMsg == "request:ok") {

        data.dataInfor = r.data.userpoint_get_response
        for (let i = 0; i < data.dataInfor.List.length; i++) {
          data.dataList.push(data.dataInfor.List[i])
        }
        if (data.dataInfor.List.length < 10) {
          data.finsh = true
        }
        data.page++
        this.setData({
          dataList: data.dataList,
          dataInfor: data.dataInfor,
          page: data.page,
          finsh: data.finsh,
        })
      }
      else app.fa('获取信息失败！')
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    options.isStore ? this.getDataStore() : this.getDataR()
  },

  getDataStore() {
    let data = this.data
    if (data.finsh) return;
    app.fl()
    app.fg({
      url: '/API/StoreManage.ashx?action=StorePointsDetail',
      data: {
        StoreId:app.globalData.GetMembersInfo.StoreId,
        // StoreId: 19,
      }

    }, true).then(r => {
      app.fh()
      if (r.data.Status == "OK") {

        data.dataInfor = r.data

        for (let i = 0; i < data.dataInfor.Data.length; i++) {
          data.dataList.push(data.dataInfor.Data[i])
        }
       
        if (data.dataInfor.Data.length < 10) {
          data.finsh = true
        }
        data.page++
        this.setData({
          dataList: data.dataList,
          dataInfor: data.dataInfor,
          page: data.page,
          finsh: data.finsh,
        })
        console.log(data.dataList,'=======');
      }
      else app.fa('获取信息失败！')
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
    options.isStore ? this.getDataStore() : this.getDataR()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})