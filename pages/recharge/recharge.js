// pages/recharge/recharge.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openId:'',
    money: '',
    userInfo:{}
  },

  // 获取我的礼物列表
  getMemberInfo: function (oId) {
    var _this = this;
    wx.request({
      url: getApp().getUrl('GetLiveMemberInfo'),
      data: {
        openId: oId
      },
      success: function (res) {
        if (res.data.Status === 'success') {
          _this.setData({
            userInfo: res.data.Data
          })
        }
      },
      fail: function (e) {
        console.log(e)
      }
    })
  },

  //提现金额
  writeMoney(e) {
    this.data.money = e.detail.value
  },

  //确认充值
  confirmPrepaid: function () {
    var _this = this
    let rgx = /^([1-9][0-9]*(\.\d{1,2})?)|(0\.\d{1,2})$/
    if (!rgx.test(_this.data.money)) {
      wx.showToast({
        title: '请输入正确金额',
        icon: 'none',
        duration: 2000
      })
      return
    }
    wx.showLoading({
      title: '',
    })
    // 从服务器获取支付信息
    this.GetWxPayOrderByMiniPro().then(res => {
      console.log(res)
      // 调用微信支付
      this.WxPay(res).then(data => {
        wx.hideLoading()
        wx.showToast({
          title: '充值成功！',
        })
        console.log('sucess-pay', data)
      }).catch(e => {   // 支付出错
        wx.hideLoading()
        wx.showToast({
          title: '充值失败',
          icon: 'none',
          mask: true
        })
        console.log('fail-pay', e)
      })
    }).catch(e => {  // 获取数据出错
      wx.hideLoading()
      wx.showToast({
        title: e.errorMsg || '出错了',
        icon:'none'
      })
      _this.setData({
        isMask: false
      })
    })
  },

  /**
   * 微信支付api
   * */
  WxPay: function (options) {
    console.log(options)
    return new Promise((resovle, reject) => {
      wx.requestPayment({
        timeStamp: options.timeStamp,
        nonceStr: options.nonceStr,
        package: "prepay_id="+options.prepayId,
        paySign: options.sign,
        signType: 'MD5',
        'success': function (res) {
          resovle(res)
        },
        'fail': function (res) {
          reject(res)
        },
        'complete': function (res) {
          console.log(res)
          if (res.errMsg.indexOf('cancel') != -1) {
            reject(res)
          }
        }
      })
    })
  },

  /**
   * 获取支付信息接口--http
   * */
  GetWxPayOrderByMiniPro: function () {
    var _this = this
    return new Promise((resolve, reject) => {
      wx.request({
        url: getApp().getUrl('MemberRechargeRequest'),
        data: {
          openId: _this.data.openId,
          remark: '',
          Amount: _this.data.money,
          TradeType:1,
          PayType:8
        },
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: (res) => {
          if (res.data.Status === 'success') {
            resolve(res.data.Data)
          }
          if (res.data.Status === 'fail') {
            wx.hideLoading()
            wx.showModal({
              title: '警告',
              content: res.data.ErrorMsg || '出错了',
              showCancel: false
            })
          }
        },
        fail: function (e) {
          reject(e)
        }
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    getApp().getOpenId(function (oId) {
      _this.getMemberInfo(oId)
      _this.setData({
        openId: oId
      })
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