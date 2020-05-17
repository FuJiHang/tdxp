const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.imgUrl,
    isChoose:0,
    subs:[
      {
        name:"推荐"
      },
      {
        name:"美妆个护"
      },
      {
        name:"推荐"
      },
      {
        name:"美妆个护"
      },
      {
        name:"推荐"
      },
      {
        name:"美妆个护"
      },
      {
        name:"推荐"
      },
      {
        name:"美妆个护"
      },
      {
        name:"推荐"
      },
      {
        name:"美妆个护"
      },
      {
        name:"推荐"
      },
      {
        name:"美妆个护"
      },
      {
        name:"推荐"
      },
      {
        name:"美妆个护"
      },
      {
        name:"推荐"
      },
      {
        name:"美妆个护"
      },{
        name:"推荐"
      },
      {
        name:"美妆个护"
      },
      {
        name:"推荐"
      },
      {
        name:"美妆个护"
      },
    ],
    seach:'',
    clear:false,
  },  

  // 选择分类
  chooseFN(e){
    this.setData({
      isChoose:e.currentTarget.dataset.index
    })
    
  },

  seaChFN(e){
    let t=this.data.seach.length
    this.setData({
      seach: e.detail.value,
      clear:t>0?true:false
    })
  },

  clearFN(){
    this.setData({
      seach:'',
      clear:false
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