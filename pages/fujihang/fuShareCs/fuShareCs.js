
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  aliasss(){
    // console.log("============")
  },

  


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(app.imgUrl)
    // app.getWxUserInfo(function(a) {
    //   var s = app.getRefferUserId();
    //   wx.request({
    //     url: app.getUrl("QuickLogin"),//
    //     data: {
    //       openId: a.openId,//微信返回的用户id
    //       nickName: a.nikeName,
    //       unionId: a.unionId,
    //       headImage: a.headImage,
    //       encryptedData: a.encryptedData,
    //       session_key: a.session_key,
    //       iv: a.iv,
    //       ReferralUserId: s
    //     },
    //     success: function(a) {
    //       // console.log(a)//a 这里有客户想要的openid 以及其他信息
    //       void 0 == a.data.error_response ? (app.setUserInfo(a.data.Data),
    //         wx.switchTab({
    //         url: "/pages/bchome/bchome"
    //         })) :  hishop.showTip(a.data.error_response.sub_msg);
    //     }
    //   });
    // })

    app.fg({
      action:'GetShopExtension',
      openId:"oKpzE5KafB-Ctptnm6T6pVQeZXZs",
      // Path:'/pages/fujihang/bchome/bchome',
      Path:"/pages/fujihang/fuIndexG/fuIndexG"
      // Path
    }).then(r=>{
      console.log(r)
      if(r.data.Status=="OK"){
        let datar=r.data.data[0]
        console.log( datar)

      }else app.fa("获取二维码失败")

      
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
  onShareAppMessage: function (res) {
    
    return {
      title: '妹子图片',
      path: '/pages/fujihang/fuShareCst/fuShareCst?id=123',
      imageUrl: "/images/1.jpg",
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  }
})