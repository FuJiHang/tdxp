const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.imgUrl,
    post:{},//请求数据
    dataList:[
      
    ],
    finsh:false,
    seach:'',
    
  },
  
  // 搜索字
  seaChFN(e){
    this.setData({
      seach:e.detail.value
    })
  },
  getDataS(){
    let data=this.data
    data.post.pageindex=1
    data.post.keyword=data.seach
    this.setData({
      post:data.post,
      finsh:false,
      dataList:[],
    })
    this.getData()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let post=JSON.parse(options.post)
    post.pageindex=1;
    post.pagesize=10;
    this.setData({
      post:post
    })
    this.getData()
  },

  getData(){
    let data=this.data,that=this
    if(data.finsh) return
    app.fl()
    app.fg(data.post).then(r=>{
      app.fh()
      let datar=r.data.rows
      datar.forEach(arr=>{
        data.dataList.push(arr)
      })
      if(datar.length<10){
        data.finsh=true
      }
      data.post.pageindex++
      that.setData({
        dataList:data.dataList,
        post:data.post,
        finsh:data.finsh,
      })
    })
  },
  // 收藏
  collFN(e){
    let data=this.data,that=this
    let index=e.currentTarget.dataset
    app.fl('正在收藏中...')
    app.fg({
      action:'AddCollection',
      giftid:e.currentTarget.dataset.giftid,
      CollectType:'Gift',
      // openId:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',
      openId:app.globalData.GetMembersInfo.openId,
    }).then(r=>{
      app.fh()
      app.fa(r.data.Message)
      if(r.data.Status=="OK"){
        data.dataList[index.index].IsCollected=r.data.Message=='取消收藏成功'?'False':'True'
        that.setData({
          dataList:data.dataList
        })
      }
   
    })
  },
  // 详情
  buyFN(e){
    let data=e.currentTarget.dataset
    // pointDetail
    wx.navigateTo({
      url:'/pages/pointDetail/pointDetail?costprice='+data.costprice+'&id='+data.giftid
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