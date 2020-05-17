const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.imgUrl,
    uploadImg:[],
    imageLoad:[],
  },
  // 
  changeFN(e){
    let aa=e.currentTarget.dataset.name
    this.setData({
      [aa]:e.detail.value
    })
  },

  // 选择图片
  chooseImage(e) {
    let aa=e.currentTarget.dataset.index
    
    this.data.imageLoad=[]
    wx.chooseImage({
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        app.fl()
        const imageLoad = this.data.imageLoad.concat(res.tempFilePaths)
        this.setData({
          imageLoad:imageLoad.length <= 1 ? imageLoad : imageLoad.slice(0, 1) 
        })

        this.uploadImgs(this.data.imageLoad,0,'dataInfo.Honors['+aa+'].Picture').then(c=>{
          app.fh()
        })
      }
    })
  },
  addFN(){
    let data=this.data,that=this
    let index=data.dataInfo.Honors.length
    // console.log(data.dataInfo.Honors[index-1].Picture||data.dataInfo.Honors[index-1].Title||data.dataInfo.Honors[index-1].Content)
    if(!data.dataInfo.Honors[index-1].Picture||!data.dataInfo.Honors[index-1].Title||!data.dataInfo.Honors[index-1].Content) return
    let aa={Picture:'',Title:'',Content:''}
    data.dataInfo.Honors.push(aa)
    this.setData({
      ['dataInfo.Honors']:data.dataInfo.Honors
    })
    console.log(data.dataInfo.Honors)
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
  },
  getData(){
    let data=this.data,that=this
    
    app.fl()
    app.fg({
      action:'GetTechnicianInfo',
      // TechnicianId:45,
      gettype:2,
      TechnicianId:app.globalData.GetMembersInfo.tcid,
    }).then(r=>{
      app.fh() 
      if(r.data.Status=='OK'){
        let datar=r.data.Data
        if(datar.Specialize){
          r.data.Data.Specialize=datar.Specialize.split(',')
        }else{
          r.data.Data.Specialize=['','','']
        }
        let aa={Picture:'',Title:'',Content:''}
        if(datar.Honors.length==0) r.data.Data.Honors.push(aa)
        if(datar.HeadPortrait) data.imageLoad.push(datar.HeadPortrait)
        that.setData({
          dataInfo:r.data.Data,
          imageLoad:data.imageLoad,
        })
      }else app.fa(r.data.Message)
    })
  },

  submit(){
    let data=this.data,that=this
    let t='',ct='',p=''
    data.dataInfo.Honors.forEach(c=>{
      if(c.Title){
        t+=c.Title+'()()()'
      }else t+='无'+'()()()'
      if(c.Content){
        ct+=c.Content+'()()()'
      }else ct+='无'+'()()()'
      if(c.Picture){
        p+=c.Picture+'()()()'
      }else p+='无'+'()()()'
    })
    t=t.slice(0,t.length-6)
    ct=ct.slice(0,ct.length-6)
    p=p.slice(0,p.length-6)
    

    app.fg({
      action:'CheckContentSecurity', 
      Type:0,
      FormData:t+ct
    }).then(t=>{
      if(t.data.Status!="OK"){
        app.fa(t.data.Message)
        that.setData({
          Contents:'',
        })
      }else{

        app.fl()
        app.fg({
          action:"UpdateInfoTechnician",
          openId:app.globalData.GetMembersInfo.openId,
          // openId:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',
          UpdateType:1,
          HonorTitle:t,
          HonorContent:ct,
          HonorPicture:p
        }).then(r=>{
          app.fh() 
          if(r.data.Status=='OK'){
            setTimeout(()=>{
              wx.navigateBack({
                delta: 1
              })
            },1450)
          }
          app.fa(r.data.Message)
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