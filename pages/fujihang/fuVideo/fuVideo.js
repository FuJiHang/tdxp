const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    open:false,
    first:false,
    videoSrc:'',
    yulan:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.ctx = wx.createCameraContext();

  },
  closeFN(){
    this.setData({
      first:false,

    })
  },
   //开始录像
   btnClick1:function(){
     let that=this,data=this.data
     console.log(data.open)
     if(!data.open){
      this.ctx.startRecord({
        success: (res) => {
          console.log('startRecord')
        },
        timeoutCallback:r=>{
          that.setData({
            videoSrc: r.tempVideoPath,
            first:true,
            open:false,
          })
        }
      })
     }else{
      this.ctx.stopRecord({
        success: (res) => {
          console.log('endRecord')
          that.setData({
            videoSrc: res.tempVideoPath
          })
        }
      })
      this.setData({
        first:true,
      })
     }
     let open=this.data.open
     this.setData({
       open:open?false:true,
     })
    
  },
  //结束录像
  btnClick2: function () {
    
  },
  //拍摄照片
  btnClick3: function () {
    this.ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          src: res.tempImagePath
        })
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