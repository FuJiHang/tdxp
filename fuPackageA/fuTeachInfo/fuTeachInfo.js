const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploadImg:[],
    imageLoad:[],
    imgUrl:app.imgUrl,
    choose:[0,1,2],
    dataInfo:{},//信息
    numList:[],
    you:true,
    hid:'',
    wid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {hid,id} = options;
    let numList=this.data.numList
    for(let i=0;i<50;i++){
      numList.push(i)
    }
    this.setData({
      numList:numList,
      hid,
      wid:id,
    })
    this.getData()
  },

  // 地址
  bindRegion(e) {//省市区选择结束
    this.setData({
      ['dataInfo.WorkYeas']: e.detail.value
    })
  },

  // 
  changeFN(e){
    this.setData({
      [e.currentTarget.dataset.name]:e.detail.value
    })
  },

  // 
  chooseFN(e){
    let a=e.currentTarget.dataset
    this.setData({
      ["dataInfo.Tags["+a.index+"].IsInclude"]:a.tf?false:true
    })
    console.log(this.data.dataInfo.Tags)
  },
  // 
  getData(){
    let data=this.data,that=this
    app.fl()
    app.fg({
      action:'GetTechnicianInfo',
      // TechnicianId:45,
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
        if(datar.HeadPortrait) data.imageLoad.push(datar.HeadPortrait)
        that.setData({
          dataInfo:r.data.Data,
          imageLoad:data.imageLoad,
        })
      }else app.fa(r.data.Message)
    })
  },

  // 选择图片
  chooseImage(e) {
    this.data.imageLoad=[]
    wx.chooseImage({
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        const imageLoad = this.data.imageLoad.concat(res.tempFilePaths)
        this.setData({
          imageLoad:imageLoad.length <= 1 ? imageLoad : imageLoad.slice(0, 1) ,
          you:false
        })

      }
    })
  },

  // 
  submit(){
    let data=this.data,that=this
    // console.log(data.imageLoad[data.choose[0]])
    let Tags='',Specialize=''
    data.dataInfo.Tags.forEach(c=>{
      if(c.IsInclude) Tags+=c.TagID+','
    })
    data.dataInfo.Specialize.forEach(c=>{
      Specialize+=c+','
    })
    if(Specialize.substr(-1) == ",") {   
      Specialize = Specialize.substring(0, Specialize.length - 1) 
    }

    app.fg({             
      action:'CheckContentSecurity', 
      Type:0,
      FormData:Tags+Specialize+data.dataInfo.Introduce+
      data.dataInfo.WorkYeas+data.dataInfo.Sign
    }).then(t=>{
      if(t.data.Status!="OK"){
        app.fa(t.data.Message)
      }else{

        if (data.you) { //HeadId
          app.fg({
            action:'UpdateInfoTechnician',
            openId:app.globalData.GetMembersInfo.openId,
            // openId:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',
            Tags:Tags,
            Specialize:Specialize,
            Introduce:data.dataInfo.Introduce,
            WorkYeas:data.dataInfo.WorkYeas,
            Sign:data.dataInfo.Sign,
            HeadId: data.hid,
            Id:data.wid
          }).then(c=>{
            app.fa(c.data.Message)
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              });
            }, 1500);
          })
          return
        }
        this.uploadImgs(data.imageLoad,data.imageLoad.length-1,'uploadImg').then(r=>{
          if(r){
            app.fg({
              action:'UpdateInfoTechnician',
              openId:app.globalData.GetMembersInfo.openId,
              // openId:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',   
              HeadPortrait:data.uploadImg,
              Tags:Tags,
              Specialize:Specialize,
              Introduce:data.dataInfo.Introduce,
              WorkYeas:data.dataInfo.WorkYeas,
              Sign:data.dataInfo.Sign,
              HeadId: data.hid,
              Id: data.wid
            }).then(c=>{
              app.fa(c.data.Message);
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                });
              }, 1500);
            })
          }
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
        
            // openId:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',

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