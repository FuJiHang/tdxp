let app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      console.log("解码后的值", scene);
      //&是我们定义的参数链接方式
      let id = scene.split("=")[1];
      console.log("输出裁剪后的值", id);
      this.setData({
        authid: id
      })
      this.bindData(id);
    }
  },


  //绑定技师关系
  bindData(id){
    wx.showLoading({
      title: "绑定中~",
      mask: true,
      success: (res) => {
      },
      fail: () => {},
      complete: () => {}
    });
    wx.request({
      url: app.data.url+'/API/WeChatApplet.ashx',
      data: {
        action:'BindRole',//	是	string	BindRole
        openId: wx.getStorageSync('openId'),//	是	string	微信openId
        id:id,//	是	int	角色ID
        type:'TC',//	是	string	角色类型 TC技师TH团队长BS渠道ST店主
      },
      header: { Cookie: wx.getStorageSync('cookieFu') },
      success: (res) => {
        console.log("技师绑定状态",res);
        wx.hideLoading();
        if (res.data.Status) {
          wx.showToast({
            title: res.data.Message,
            icon: 'success',
            duration: 1500,
            mask: false,
            success: (res) => {
              setTimeout(() => {
                wx.hideLoading();
                wx.reLaunch({
                  url: '/pages/fujihang/fuIndexG/fuIndexG',
                });
              }, 1500);
            },
            fail: () => { },
            complete: () => { }
          });
        }else{
          console.log("输出错误信息",res);
          wx.showToast({
            title: res.data.Message,
            icon: 'success',
            duration: 1500,
            mask: false,
            success: (res) => {
              
            },
          });
        }
      },
      fail: () => {},
      complete: () => {}
    });
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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