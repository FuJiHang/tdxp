let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderid:'',//订单号
    total:'', //价格
    isCou:false,
    PreSaleId:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("输出options",options);
    const { orderid, total,PreSaleId} = options;
    this.setData({
      orderid,
      total,
      PreSaleId,
      // isCou:options.isCou
    })
    this.getDataR(orderid)
    
  },

  //获取选中的优惠卷的数据
  getDataR(id) {
    console.log("输出订单号",id);
    console.log("输出openid", app.globalData.GetMembersInfo.openId);
    app.fl()
    app.fg({
      action: 'LoadCoupon',
      openId: app.globalData.GetMembersInfo.openId,
      couponType: 1,
      pageIndex: 1,
      pageSize: 1,
      GatewayPayId: id,
      
    }).then(res => {
      console.log("获取优惠卷2", res);
      app.fh()
      if (res.data.Status == "OK") {
          this.setData({
            list:res.data.Data
          })
        }
    })
  },
  

  //返回首页
  handleIndex(){
    wx.switchTab({
      url: wx.getStorageSync('getStore')?'/pages/fujihang/fuIndexG/fuIndexG':'/pages/fujihang/fuIndexZB/fuIndexZB',
      success: (result) => {
        
      },
      fail: () => {},
      complete: () => {}
    });
      
  },
  //查看订单
  handleSee(){
    // wx.reLaunch({
    //   url: '/pages/pointAllOrder/pointAllOrder?active=1'
    // })
    let PreSaleId=this.data.PreSaleId
    if(this.data.isCou){
      wx.reLaunch({
        url: '/fuPackageA/fuCouponList/fuCouponList?sf=2'
      })
      
    }else{
      wx.reLaunch({
        url: `/pages/pointAllOrder/pointAllOrder?active=${PreSaleId?0:1}`
      })
    }

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  /**
     * 用户点击右上角分享
     */
  onShareAppMessage: function (e) {
    const { couponid, order } = e.target.dataset;
    console.log("输出点击分享时的值", couponid + '++++++++++++++' + order);
    let data = this.data
    return {
      title: '头道惠',
      path: `/fuPackageA/fuCouponDet/fuCouponDet?couponid=${couponid}&order=${order}`,
      imageUrl: app.imgUrl +"index009.jpg",//分享图片
      success: (res) => {
        app.fa('转发成功')
      },
      fail: (res) => {
        app.fa('转发失败')
      }

    }
  }

})