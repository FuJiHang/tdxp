const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.imgUrl,
    server:[{
        name:'',
        text:'',
        img:'',
      },
      {
        name:'',
        text:'',
        img:'',
      },
    ],
    show:[],
    workList:'',
    imageLoad:[],
    edit:false,
  },

  // 
  changeFN(e){
    if(this.data.edit) return
    let aa=e.currentTarget.dataset.name,bb=e.detail.value
    this.setData({
      [aa]:bb
    })
  },

  // 选择图片
  chooseImage(e) {
    if(this.data.edit) return
    console.log(e)
    let name=e.currentTarget.dataset.name,num=e.currentTarget.dataset.num
    this.data.imageLoad=[],
    wx.chooseImage({
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        const imageLoad = this.data.imageLoad.concat(res.tempFilePaths)
        this.setData({
          imageLoad:imageLoad.length <= num ? imageLoad : imageLoad.slice(0, num) 
        })

        this.uploadImgs(imageLoad,imageLoad.length-1,name).then(c=>{
          console.log()
          if(!this.data.workList) return
          this.setData({
            show:this.data.workList.split(',')
          })
        })
      }
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
  submit(){
    let data=this.data,that=this
    
    app.fg({
      action:'CheckContentSecurity', 
      Type:0,
      FormData:data.server[0].name+data.server[0].text+
      data.server[1].name+data.server[1].text
    }).then(t=>{
      if(t.data.Status!="OK"){
        app.fa(t.data.Message)
      }else{
        
        app.fl()
        app.fg({
          action:'UpdateInfoTechnician',
          openId:app.globalData.GetMembersInfo.openId,
          // openId:"oGsqu4kr4cw0lP0vIV5sTDoxa66k",
          tst1:data.server[0].name,
          tsc1:data.server[0].text,
          tsp1:data.server[0].img,
          tst2:data.server[1].name,
          tsc2:data.server[1].text,
          tsp2:data.server[1].img,
          MyWorks:data.workList
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.edit){
      let t=JSON.parse(decodeURIComponent(options.t))
        let server=[{
          name:t.TsServiceTitle1?t.TsServiceTitle1:' ',
          text:t.TsServiceContent1?t.TsServiceContent1:' ',
          img:t.TsServicePicture1?t.TsServicePicture1:' ',
        },
        {
          name:t.TsServiceTitle2?t.TsServiceTitle2:' ',
          text:t.TsServiceContent2?t.TsServiceContent2:' ',
          img:t.TsServicePicture2?t.TsServicePicture2:' ',
        },
      ]
      this.setData({
        edit:true,
        server:server,
        show:t.WorksCase
      })
    }
    
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