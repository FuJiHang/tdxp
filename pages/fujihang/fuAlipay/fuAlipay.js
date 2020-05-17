// pages/fujihang/fuAlipay/fuAlipay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oId:'',
    imgUrl:'',
    bc:0,
    xfj:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      imgUrl:options.url?options.url:'',
      oId:options.oId?options.oId:'',
      bc:options.bc?options.bc:0,
      xfj:options.xfj?options.xfj:'',
    })
  },
  toFN(){
    if(this.data.bc==1){
      wx.switchTab({
        url:"/pages/fujihang/fuIndexG/fuIndexG"
        // url:'/pages/bchome/bchome'
      })
    }else{
      wx.navigateTo({
        url: "/pages/fujihang/fuOrderDetail/fuOrderDetail?id="+this.data.oId+"&type=0"
      })
    }
  },

  // 保存二维码
  saveImgFN(e){
    let url=e.currentTarget.dataset.index?this.data.xfj:this.data.imgUrl
    wx.downloadFile({
      url:url,     //仅为示例，并非真实的资源
      success: function (res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode ==200) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(res) {
              wx.showModal({
                title: '保存图片成功！',
              })
            },
            fail(res){
              wx.showModal({
                title: '提示',
                content: '请打开相册授权',
                success(res) {
                  if (res.confirm) {
                    wx.openSetting({})
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
              
            }
          })
        }
      }
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