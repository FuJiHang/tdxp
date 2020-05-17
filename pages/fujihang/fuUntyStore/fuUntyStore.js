const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    textarea:'',//申请路由
    imageLoad:[],//选择图片
    postImage:'',//提交图片路径
    state:0,//true？解绑：绑定
    store:0,//门店id
    tOrs:false,//true?门店：技师
    tcid:0,//技师id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options.tOrs)
    // console.log(typeof options.tOrs)
    this.setData({
      tOrs:options.tOrs?options.tOrs:false,
      state:options.state?options.state:'',
      store:options.store?options.store:'',
      tcid:options.tcid?options.tcid:'',
    })
    // state="+data.active+'&store='+data.contantList[data.active].data[index].StoreId
  },
  // 提交
  submitFN(){
    let data=this.data
    
    app.fl()
    this.uploadImgs(data.imageLoad,data.imageLoad.length-1,'postImage').then(i=>{
      if(i){
        let post={
          action:'BindRequest',
          role:data.tOrs==false?'THTC':(data.tOrs=="1"?'THST':'BSST'),
          userid:app.globalData.GetMembersInfo.UserId,
          RequestReason:data.textarea,
          RequestPic:data.postImage
        }
        if(data.tOrs){
          post.StoreId=data.store
          post.bindtype=data.state=="0"?1:0
          if(data.tOrs==2) post.bsid=app.globalData.GetMembersInfo.UserId
          
        }else{
          post.tcid=data.tcid
        }
        app.fg(post).then(r=>{
          app.fh()
          app.fa(r.data.Message)
          if(r.data.Status!="NO"){
            setTimeout(()=>{
              wx.navigateBack({
                delta: 1
              })            
            },1500)
          }
          
        })
      }
      
    })
    
  },
  // 更新输入
  textAreaFN(e){
    this.setData({
      textarea:e.detail.value
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
          imageLoad:imageLoad.length <= 5 ? imageLoad : imageLoad.slice(0, 5) 
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
            // openId:"oGsqu4qBG6Icub2iLYzI3MJGH4iQ",
            openId:app.globalData.GetMembersInfo.openId
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