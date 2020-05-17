
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tags:[],
    text:'',
    dataInfo:{},
    imgSubmit:'',
    imgShow:[],
    imgUrl:app.imgUrl,
    jsf:5,
    fwf:5,
    index:0,
  }, 

  onChange(e){
    this.setData({
      [e.currentTarget.dataset.name]:e.detail
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      dataInfo:JSON.parse(decodeURIComponent(options.orderData)),
      index:options.index
    })
    console.log(this.data.dataInfo,'============')
    this.GetAppraiseTags()
  }, 

  GetAppraiseTags(){
    let data=this.data,that=this
    app.fl()
    app.fg({
      action:'GetAppraiseTags'
    }).then(r=>{
      app.fh() 
      r.data.forEach(c=>{
        c.isChoose=false
      })
      that.setData({
        tags:r.data
      })
    })
  },
  
  // 
  changeFN(e){
   this.setData({
     text:e.detail.value,
   })
   
  },



  // 
  chooseFN(e){
    this.setData({
      ['tags['+e.currentTarget.dataset.index+'].isChoose']:  e.currentTarget.dataset.choose?false:true
    })
  },
  
  submit(){
    let data=this.data,that=this,tag='',n=0
    data.tags.forEach(c=>{
      if(c.isChoose&&n==0) {
        tag=c.TagId
        n++
      }
      else if(c.isChoose)  tag+=','+c.TagId
    })

    app.fg({
      action:'CheckContentSecurity', 
      Type:0,
      FormData:data.text
    }).then(t=>{
      if(t.data.Status!="OK"){
        app.fa(t.data.Message)
      }else{

        app.fl()
        app.fg({
          action:'AddScore',
          openId:app.globalData.GetMembersInfo.openId,
          // openId:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',
          orderid:data.dataInfo.OrderId,
          Tags:tag,
          SkuId:data.dataInfo.LineItems[data.index].SkuId,
          appraisetype:-1,
          technicalscore:data.jsf*20,
          servicescore:data.fwf*20,
          appraisetext:data.text,
          appraisepicture:data.imgSubmit,
          ProductId:data.dataInfo.LineItems[data.index].ProducId
        }).then(r=>{
          app.fh() 
          if(r.data.Status=='OK'){
        
           }
           app.fa(r.data.Message)
          console.log(r) 
        })

      }
    })

   
  },

   // 上传logo
   uploadLogo(e){
    let data=this.data,index=e.currentTarget.dataset.index
    let that=this
    // if(data.addImg.choose) return
    wx.chooseImage({ 
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        let logo=[]
        logo = logo.concat(res.tempFilePaths)
        logo=logo.length <= 9 ? logo : logo.slice(0, 9) 
        app.fl("正在上传中...")
        this.uploadImgs(logo,logo.length-1,'imgSubmit').then(l=>{
          that.setData({
            imgShow:data.imgSubmit.split(',')
          })
          app.fh()
          
        })
      }
    })
  },


  // 多图上传
  uploadImgs(images,num,name){
    let that=this,data=this.data
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