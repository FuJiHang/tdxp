const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.imgUrl,
    active:0,
    typeList:['建议','投诉','询问'],
    choose:0,
    functionList:[
      { 
        name:"申诉请求",
        page:1,
        data:[],
        finsh:false,
      },
      {
        name:"申诉核实",
        // page:1,
        post:1,
        data:[],
        finsh:false,
      },
      {
        name:"申诉结果",
        // page:1,
        post:2,
        data:[],
        finsh:false,
      },
    ],
    imageLoad:[],//
    postData:{
      Title:'',
      MainBody:'',
      PictureList:'',
    },
    
  },

  chuLiFN(e){
    let data=this.data,that=this
    app.fl()
    app.fg({
      action:'ApplyComplaint',
      ActionType:4,
      id:e.currentTarget.dataset.id,
      openId:app.globalData.GetMembersInfo.openId,
    }).then(r=>{
      app.fh() 
       app.fa(r.data.Messages)
    })
  },
  chooseFNT(e){
    this.setData({
      choose:e.currentTarget.dataset.data
    })
  },

  // 
  // 选择图片
  chooseImage(e) {
    this.data.imageLoad=[]
    let that=this

      wx.chooseImage({
        sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
        sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
        success: res => {
          const imageLoad = that.data.imageLoad.concat(res.tempFilePaths)
          if(imageLoad.length <2) return app.fa('图片不能少于两张') 
          that.setData({
            imageLoad:imageLoad.length <= 5 ? imageLoad : imageLoad.slice(0, 5) 
          })
          that.uploadImgs(imageLoad,imageLoad.length-1,'postData.PictureList').then(c=>{
            if(c){
              that.setData({
                imageLoad:that.data.postData.PictureList.split(',')
              })
            }
            
          })
        }
      })

  },

  // 
  submitFN(){
    let data=this.data,that=this
    app.fl()
    data.postData.MainBody=data.typeList[data.choose]+data.postData.MainBody
    data.postData.action='ApplyComplaint'
    data.postData.ActionType=0
    data.postData.openId=app.globalData.GetMembersInfo.openId,
    app.fg(data.postData).then(r=>{
      app.fh() 
      app.fa(r.data.Messages)
    })
  },

  // 
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


  // 
  onChange(e){
    this.setData({
      active:e.detail.index
    })
    if(this.data.active==0) return
    this.getData()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    if(!app.globalData.GetMembersInfo||!app.globalData.GetMembersInfo.openId){
      app.getOpenId(function(a) {
        app.fg({
          action: 'GetMembersInfo',
          openId: a
        }).then(r => {
          if (r.data.Status == "OK") {
            let dataR = r.data.Data
            dataR.openId = a
            app.setMembersInfo(dataR)
          } else {
            wx.redirectTo({
              url: "/pages/login/login"
            });
          }
        })
      })
    }
  },
  

  getData(){
    let data=this.data,that=this
    app.fl()
    app.fg({
      action:'ApplyComplaint',
      ActionType:data.functionList[data.active].post,
      openId:app.globalData.GetMembersInfo.openId,
    }).then(r=>{
      app.fh() 
      if(r.data.Status=='OK'){
        that.setData({
          ['functionList['+data.active+'].data']:r.data.Data
        })
      }else app.fa(r.data.Messages)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  inputFN(e){
    this.setData({
      [e.currentTarget.dataset.name]:e.detail.value
    })
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