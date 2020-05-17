
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    dataObj: {},
    dataList: [
      {
        name: '手机号码',
        val: '',
        data: 'CellPhone'
      },
      {
        name: '身份证号',
        val: '',
        data: 'IdentityCard'
      },
      {
        name: '微信号',
        val: '',
        data: 'WeChat'
      },
      {
        name: '邀请时间',
        val: '',
        data: 'CreateDate'
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = this.data
    app.fg({
      action: 'GetMyParenInfo',
      openId: app.globalData.GetMembersInfo.openId
    }).then(r => {
      console.log("输出r", r);
      if (r.errMsg == "request:ok") {
        let dataR = r.data.userpoint_get_response
        for (let i = 0; i < data.dataList.length; i++) {
          data.dataList[i].val = dataR[data.dataList[i].data]
        }
        this.setData({
          dataList: data.dataList,
          dataObj: dataR
        })

      } else app.fa("查询失败！")
      console.log(r)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  jieBan() {
    let data = this.data, that = this

    wx.showModal({
      title: '警告',
      content: '确定要解绑上级吗？',
      success(res) {
        if (res.confirm) {
          app.fl()
          app.fg({
            action: 'ClearReferral',
            openId: app.globalData.GetMembersInfo.openId
          }).then(r => {
            app.fh()
            if (r.data.Status == "OK") {
             setTimeout(()=>{
               wx.navigateBack({
                 delta: 1
               })
             },1450)
            } 
             app.fa(r.data.message)
     
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })


     
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