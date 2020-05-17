// packageA/pages/MyCollection/MyCollection.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgurl: app.data.imgurl,
    List: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    this.initData()
  },
  initData() {
    app.Fg({
      url: '/API/MembersHandler.ashx?action=GetFavorites'
    }).then(res => {
      console.log("=====", res)
      if (res.data.Status == "Login") {
          wx.showToast({
            title: '还未登录~~~',
            icon:'none',
            duration:1500,
            mask:true,
            success(){
              // setTimeout(() => {
              //   wx.navigateTo({
              //     url: '/pages/authorizationLogin/authorizationLogin',
              //   });
              // }, 1500);
            }
          })
      }else{
        this.setData({
          List: res.data.Data
        })
      }
    })
  },
  
  // 跳转详情
  Toprodetai(e) {
    console.log("shanglp",e)
    wx.navigateTo({
      url: `/pages/goodsDetail/goodsDetail?prDid=${e.currentTarget.dataset.productid}`,
    })
    wx.setStorageSync("buyType", "fightgroup")
  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})