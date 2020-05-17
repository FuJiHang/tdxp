const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.imgUrl,
    functionList:[
      {
        name:'',
        child:[
          {
            name:'上传门店环境',
            to:'/fuPackageA/fuStoreView/fuStoreView'
          },
          {
            name:'基础信息',
            to:'/fuPackageA/fuStoreInfo/fuStoreInfo'
          },
          // {
          //   name:'营销活动',
          //   to:'/fuPackageA/fuCardList/fuCardList'
          // },
        ],
      },
      // {
      //   name:'门店项目设置',
      //   child:[
      //     {
      //       name:'设置套餐项目',
      //       // edit:0,//0：热门，1：套餐，2：拼团
      //       to:'/pages/fujihang/fuUpDown/fuUpDown?edit=1'
      //     },
      //     {
      //       name:'设置团购项目',
      //       to:'/pages/fujihang/fuUpDown/fuUpDown?edit=2'
      //     },
      //     {
      //       name:'设置热门项目',
      //       to:'/pages/fujihang/fuUpDown/fuUpDown?edit=0'
      //     },
      //   ],
      // },
    ]
  },

  toFN(e){
    let data=e.currentTarget.dataset.to
    if(!data) return app.ff()
    wx.navigateTo({
      url:data
    })
  },

  
  toFND(){
    wx.navigateTo({
      url:'/pages/fujihang/fuStoreDet/fuStoreDet?id='+app.globalData.GetMembersInfo.StoreId
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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