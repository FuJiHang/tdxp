const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    confirmList: {},
    pointOrder: {},
    couponsData: {}, // 优惠相关数据
    timeType: ['不限', '周一至周五', '周六、周日及公众假期'],
    payType: [],
    timeIndex: 0, // 送货时间，0不限，1周一至周五，2周六等假期
    payIndex: 0, // 付款方式后台返回
    integral: 0.00, // 积分
    isSelectIntegral: false, // 是否选择积分抵扣
    isUseBalance: false, // 是否使用余额,
    totalMoney: 0, // 支付总金额
    RealPaymentPoint: 0, //积分总额
    selectAddress: {}, // 地址
    cur: 0, //如果有优惠券，那么初始化进来是选择第一个的
    conpouPrice: 0,
    isShow: true,
    selectIndex: 0,
    pointList: [], //积分信息
    // DifferenceValue: 0, //积分差额 
    MemberPoint: 0, //积分余额
    selectId: 0,
    isPayType:false,
  },

  /**
   * 进入地址列表
   * */
  onToAddressPage: function(e) {
    wx.navigateTo({
      url: "../choiceaddress/choiceaddress?type=point"
    });
  },


  // 获取订单信息
  getOrderInfo: function() {
    var _this = this
    getApp().getOpenId(function(e) {
      wx.request({
        url: getApp().getUrl("GetGiftOrderDetail"),
        data: {
          openId: e,
          ShippingId: _this.data.selectId
        },
        success: function(res) {
          if (res.data.Status === 'OK') {
            _this.setData({
              selectAddress: res.data.Message
            })
          }
        }
      });
    });
  },

  // 提交订单
  submit() {
    let that=this
    if (!this.data.selectAddress.ShippingId) {
      wx.showToast({
        title: '请填写地址',
        icon: 'none',
        duration: 2000
      })
      return
    }
    // } else if (this.data.selectAddress.Points < this.data.confirmList.data[0].NeedPoint) {
    //   // wx.showToast({
    //   //   title: '积分余额不足',
    //   //   icon: 'none',
    //   //   duration: 2000
    //   // })
    //   // return
    //   wx.showModal({
    //     title: '提示',
    //     content: '积分余额不足，是否用现金抵扣',
    //     success (res) {
    //       if (res.confirm) {
    //         that.buyOKFN()
    //       }   
    //     }
    //   })
    //   return
    // }
    
    that.buyOKFN()
   
    
  },

  buyOKFN(){
    let _this = this
    wx.showLoading({})
    getApp().getOpenId(function(e) {
      console.log(e,'222222222222222');
      wx.request({
        url: getApp().getUrl("ProcessSubmmitorder"),
        data: {
          openId: e,
          shippingId: _this.data.selectAddress.ShippingId,
          giftId: _this.data.confirmList.data[0].id,
          PayType:_this.data.confirmList.data[0].payType?1:0,
          RStoreId:wx.getStorageSync('getStore').StoreId?wx.getStorageSync('getStore').StoreId:0,
        },
        success: function(res) {
          console.log(res,'22222222222');
          wx.hideLoading()
          if (res.data.Status === 'OK') {
            if(res.data.NeedPay!='True'){
              
              wx.showModal({
                title: '提示',
                content: '兑换成功',
                showCancel: false,
                success: function(res) {
                  if (res.confirm) {
                    wx.redirectTo({
                      url: '/pages/pointAllOrder/pointAllOrder?active=1',
                    })
                  }
                }
              })
            }else{
              app.fg({
                action:'GetPayParam',
                openId:e,
                orderId:res.data.OrderId,
                appid:app.globalData.appId,
              }).then(p=>{
                console.log(p,'333333333');

                if(p.data.Status=="OK"){
                  var pay=p.data.Data
                  wx.requestPayment({
                    timeStamp: pay.timeStamp,
                    nonceStr: pay.nonceStr,
                    package: "prepay_id="+pay.prepayId,
                    signType: 'MD5',
                    paySign: pay.sign,
                    success(resfu) {
                      if(resfu.errMsg=="requestPayment:ok"){
                      console.log(resfu,'444444');
                       
                        app.fa('支付成功！')
                        app.fg({
                          action:'BuyerPaid',
                          openId:e,
                          orderId:res.data.OrderId,
                          shopType:1,
                        })
                        setTimeout(()=>{
                          wx.redirectTo({
                            url: '/pages/pointAllOrder/pointAllOrder?active=1',
                          })
                        },1450)
                      }else app.fa('支付失败！')
                    }
                  })
                }else app.fa('支付失败！')
              })
            }
            
          }else app.fa(res.data.ErrorMsg)
        }
      });
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this,
      returnId = 0;
    if (options.id) {
      returnId = options.id
    }
    var pointInfo = JSON.parse(wx.getStorageSync('confirmList'))
    _this.setData({
      isPayType:pointInfo.data[0].payType,
      confirmList: pointInfo,
      selectId: returnId
    })
    console.log(pointInfo)
    _this.getOrderInfo()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})