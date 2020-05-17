const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.imgUrl, 
    post:{
      action:"UploadStoreProduct",
      ProductId:"",
      StoreSalePrice:'',
      UpType:1,
      ActivityName:'',
      packPrice:"",
      Images:'',
      // Images2:"",
      Description:'',
    },//请求的主题
    product:[],//项目信息
  },  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data=this.data
    data.post.openId=app.globalData.GetMembersInfo.openId,
    this.setData({
      product:JSON.parse(decodeURIComponent(options.data)),
      post:data.post,
    })
    data.product.forEach((c,i)=>{
      console.log(c,i)
      if(i==0) data.post.ProductId=c.ProductId
      else data.post.ProductId+=','+c.ProductId
      
    })
  
    // data.post.StoreSalePrice=data.product.SalePrice
  },

  inputChange(e){
    this.setData({
      [e.currentTarget.dataset.name]:e.detail.value
    })
  },  


  // 上传logo
  uploadLogo(e){
    wx.chooseImage({ 
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        let logo=[]
        logo = logo.concat(res.tempFilePaths)
        logo:logo.length <= 5 ? logo : logo.slice(0, 1) 
        
        app.fl("正在上传中...")
        this.uploadImgs(logo,0,'post.Images').then(l=>{
          if(l){
            
          }
          app.fh()
          
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
            // openId:"oGsqu4qBG6Icub2iLYzI3MJGH4iQ",
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

  // 提交套餐 
  submit(){
    let data=this.data
    


    app.fg({
      action:'CheckContentSecurity', 
      Type:0,
      FormData:data.post.ActivityName+data.post.Description,
    }).then(t=>{
      if(t.data.Status!="OK"){
        app.fa(t.data.Message)
      
      }else{
        app.fl()
        app.fg(data.post).then(r=>{
          app.fh()
          app.fa(r.data.Message)
          if(r.data.Status=="OK"){
            setTimeout(()=>{
              wx.navigateBack({
                delta: 1
              })
            },1450)
          }
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