const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.imgUrl,
    page:1,
    finsh:false,
    dataInfo:[],
    showVideo:{
      show:false,
      url:'',
    },
    type:'img',
    UserId:''
  },

  aa(e){
    let data=this.data
    wx.previewImage({
      current:e.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: data.dataInfo // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type:options.type,
      UserId:options.UserId?options.UserId:''
    })
    if(options.type=="img")  this.getImgList()
    else this.getVideoList()
   
    
  },

  getImgList(){
    let data=this.data,that=this
    app.fl()
    app.fg({
      action:'LoadAttention',
      // openId:"oGsqu4qBG6Icub2iLYzI3MJGH4iQ",
       openId:app.globalData.GetMembersInfo.openId,
      // pageIndex:data.followList.page,
      pageIndex:data.page,
      pageSize:10,
      IsMyArticle:true,
      Type:0,
      UserId:data.UserId,
    }).then(r=>{
      app.fh() 
      if(r.data.Status=='OK'){
        if(r.data.Data.length!=0){
          r.data.Data.forEach(c=>{
            if(c.ImageUrlsArr.length!=0){
              c.ImageUrlsArr.forEach(j=>{
                data.dataInfo.push(j)
              })
            }
          })
        }
        
        that.setData({
          dataInfo:data.dataInfo,
          page:++data.page,
          finsh:r.data.Data.length<10?true:false
        })
      }else app.fa(r.data.Message)
    })
  },
  


  getVideoList(){
    let data=this.data,that=this
    app.fl()
    app.fg({
      action:'LoadAttention',
      // openId:"oGsqu4qBG6Icub2iLYzI3MJGH4iQ",
       openId:app.globalData.GetMembersInfo.openId,
      // pageIndex:data.followList.page,
      pageIndex:data.page,
      pageSize:10,
      IsMyArticle:true,
      Type:1,
      UserId:data.UserId
    }).then(r=>{
      app.fh() 
     
      if(r.data.Status=='OK'){
        r.data.Data.forEach(c=>{
        
            data.dataInfo.push(c.ImageUrls)

        })
        that.setData({
          dataInfo:data.dataInfo,
          page:++data.page,
          finsh:r.data.Data.length<10?true:false
        })
      }else app.fa(r.data.Message)
    })
  },


  openFN(e){
    let a={
      show:true,
      url:e.currentTarget.dataset.url
    }
    
    this.setData({
      showVideo:a
    })
  },

  // 
  downFN(){
    let data=this.data
    console.log( data.showVideo.url)
    wx.downloadFile({
      url:data.showVideo.url,
      success:function (ccc){
        wx.saveVideoToPhotosAlbum({
          filePath: ccc.tempFilePath,
          success (res) {
            app.fa('保存视频成功')
          },
          fail(res){
            console.log(res.errMsg)
            app.fa(res.errMsg)
          }
        })
      }
    })
    
  },

  errFN(){
    let a={
      show:false,
      url:''
    }
    
    this.setData({
      showVideo:a
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
    if(this.data.type=="img")  this.getImgList()
    else this.getVideoList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})