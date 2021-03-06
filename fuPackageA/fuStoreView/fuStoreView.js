const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploadImg:[],
    imageLoad:[],
    logoLoad:[],
    logo:'',
    imgUrl:app.imgUrl,
    choose:[0,1,2],
    video:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  chooseFN(e){
    let index=e.currentTarget.dataset.index,choose=this.data.choose
    if(choose.indexOf(index)!=-1) return
    
    choose.push(index)
    choose=choose.slice(1)
    this.setData({
      choose:choose
    })
  },

  // 选择logo
  chooselogo(e) {
    let that=this
    wx.chooseImage({
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        console.log("输出logo",res)
        const logoLoad = this.data.logoLoad.concat(res.tempFilePaths)
        let logoList=[]
        logoList=logoLoad.length <= 1 ? logoLoad : logoLoad.slice(0, 1) 
        console.log(logoList)
        that.uploadImgs(logoList,0,'logo').then(c=>{
          console.log(that.data.logo)
        })
      }
    })
  },
  // 选择图片
  chooseImage(e) {
    wx.chooseImage({
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        const imageLoad = this.data.imageLoad.concat(res.tempFilePaths)
        this.setData({
          imageLoad:imageLoad.length <= 8 ? imageLoad : imageLoad.slice(0, 8) 
        })

      }
    })
  },
  // 选择视频
  chooseVideo(){
    let that=this
    wx.chooseVideo({
      sourceType: ['album','camera'],
      maxDuration: 60,
      camera: 'back',
      success(ccc) {
        app.fl()
        wx.uploadFile({
          url:app.getUrl('UploadAppletImage&UploadType=1'),
          filePath:ccc.tempFilePath,
          name:'file',
          formData:{
            appid:app.globalData.appId,
            openId:app.globalData.GetMembersInfo.openId,
            // openId:"oGsqu4kr4cw0lP0vIV5sTDoxa66k",
          },
          success:res=>{
            app.fh()
            let datar=JSON.parse(res.data)
            if(datar.Status=="OK"){
              that.setData({
                video:datar.Data[0].ImageUrl
              })
              
            }else{
              
              app.fa("上传视频失败！")
            }
          }
        })
      }
    })
  },

  // 
  submit(){
    let data=this.data,that=this
    // console.log(data.imageLoad[data.choose[0]])
    let upload=[]
    if(data.imageLoad.length<3) return app.fa('门店环境请上传至少3张')
    data.choose.forEach(n => {
      upload.push(data.imageLoad[n])
    });
    this.uploadImgs(upload,2,'uploadImg').then(r=>{
      if(r){
        app.fl()
        app.fg({
          action:'EditStoreInfo',
          openId:app.globalData.GetMembersInfo.openId,
          // openId:"oGsqu4kr4cw0lP0vIV5sTDoxa66k",
          EnvironmentImages:data.uploadImg?data.uploadImg:'',
          VideoUrl:data.video?data.video:'',
          storelogo:data.logo?data.logo:''
        }).then(c=>{
          app.fh()
          if(c.data.Status=="OK"){
            setTimeout(()=>{
              wx.navigateBack({
                delta: 1
              })
            },1450)
          }
          app.fa(c.data.Message)
        })
      }
    })
  },

  // 多图上传
  uploadImgs(images,num,name){
    let that=this
    const all=num
    let getImage=''
    return new Promise((resolve, reject) => {
      function  upload(num) {
        if(num<0){
          resolve(true)
          that.setData({
            [name]:getImage,
          })
          return
        }
        wx.uploadFile({
          url:app.getUrl('UploadAppletImage'),
          filePath:images[num],
          name:'file',
          formData:{
            appid:app.globalData.appId,
            openId:app.globalData.GetMembersInfo.openId,
            // openId:"oGsqu4kr4cw0lP0vIV5sTDoxa66k",
          },
          success:res=>{
            let datar=JSON.parse(res.data)
            if(datar.Status=="OK"){
              if(num==all) getImage=datar.Data[0].ImageUrl
              else getImage+=','+datar.Data[0].ImageUrl
              num=num-1
              upload(num)
            }else{
              app.fh()
              app.fa("上传图片失败！")
            }
          }
        })
      }
      upload(num)
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