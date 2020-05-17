const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // btnList:['存草稿','发布'],
    imgUrl:app.imgUrl,
    // chooseList:[
    //   {
    //     name:'参与话题',
    //     img:'icon_address33.png'
    //   },
    // ],
    GetMembersInfo:{},
    choose:[
      {
        img:app.imgUrl+'store-16.png',
        name:'添加门店',
      },
      {
        img:app.imgUrl+'peoT.png',
        name:'选择技师',
      },
      {
        img:app.imgUrl+'music.png',
        name:'选择音频',
      },
      {
        img:'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/productCP.png',
        name:'选择产品',
      },
    ],
    imgLoad:'',
    imgSubmit:[],
    video:'',
    LatiLongitude:{},
    listDataS:{
      data:[],
      finsh:false,
      page:1,
      seach:'',
    },//门店列表
    listDataT:{
      data:[],
      finsh:false,
      page:1,
      seach:''

    },//技师列表
    listDataP:{
      data:[],
      finsh:false,
      page:1,
      seach:''

    },//商品列表
    showChoose:{
      show:false,
    },
    nowAddressId:'',
    TCId:0,
    STId:0,
    PDId:0,
    Contents:'',
    token:'',//
    musicList:[],//音乐列表
    musicUrl:'',
  },

  
  storeFN(e){
    
    this.setData({
      STId:e.currentTarget.dataset.index.StoreId,
      ['choose[0].name']:e.currentTarget.dataset.index.StoreName,
    })
    this.onClose()
  },
  teachFN(e){
    
    this.setData({
      TCId:e.currentTarget.dataset.index.UserId,
      ['choose[1].name']:e.currentTarget.dataset.index.Name,
      
    })
    this.onClose()
  },
  // 
  submitFN(){
    let data=this.data,that=this
    if(!data.Contents) return app.fa('请输入内容')
    app.fg({
      action:'CheckContentSecurity',
      Type:0,
      FormData:data.Contents
    }).then(t=>{
      if(t.data.Status!="OK"){
        app.fa(t.data.Message)
        that.setData({
          Contents:'',
        })
      }else{
        app.fl()
        app.fg({
          action:'PublishArticle',
          openId:app.globalData.GetMembersInfo.openId,
          // openId:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',
          Type:data.video?1:0,
          lat:data.LatiLongitude.Latitude,
          lng:data.LatiLongitude.Longitude,
          ImgList:data.video?data.video:data.imgLoad,
          Contents:data.Contents,
          TCId:data.TCId?data.TCId:'',
          STId:data.STId?data.STId:'',
          MusicUrl:data.musicUrl?data.musicUrl:'',
          ProductId:data.PDId?data.PDId:''
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
  delectFN(e){

  },

  // 上传logo
  uploadLogo(e){
    let that=this,data=this.data
    wx.chooseImage({ 
      sizeType: [ 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
      

        let logo=[]
        logo = logo.concat(res.tempFilePaths)
        logo=logo.length <= 8 ? logo : logo.slice(0, 8) 
        app.fl("正在上传中...")
        this.uploadImgs(logo,logo.length-1,'imgLoad').then(l=>{
          app.fg({
            action:'CheckContentSecurity',
            Type:1,
            FormData:data.imgLoad
          }).then(t=>{
            console.log(t)
            if(t.data.Status!="OK"){
              app.fa(t.data.Message)
              that.setData({
                imgLoad:'',
              })
            }else{
              that.setData({
                imgSubmit:that.data.imgLoad.split(',')
              })
            }
          })
              // that.setData({
              //   token:f.data.access_token
              // })
     

         
        
          
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

  // 选择视频
  chooseVideo(){
    console.log('========')
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
            console.log(datar)
            if(datar.Status=="OK"){
              that.setData({
                video:datar.Data[0].ImageUrl
              })
              console.log(that.data.video)
              
            }else{
              
              app.fa("上传视频失败！")
            }
          }
        })
      },fail(s){
        console.log(s,'000000000')
      }
    })
  },

  getStore(){
    let data=this.data,that=this
    app.fl()
    app.fg({
      action:"Search",
      tag:"store",
      Latitude:data.LatiLongitude.Latitude,
      Longitude:data.LatiLongitude.Longitude,
      pageindex:1,
      pagesize:1000,
      bindtype:1,
      content:data.listDataS.seach,
    }).then(r=>{
      app.fh() 
    
      that.setData({
        ['listDataS.data']:r.data.Models
      })

    })
  },
  onClose(e) {
    this.setData({
      ['showChoose.show']:false
    })
  },
  seaChFN(e){
    this.setData({
      [e.currentTarget.dataset.name]:e.detail.value
    })
  },
  seachJS(){
    let data=this.data
    let listDataT={
      data:[],
      finsh:false,
      page:1,
      seach:data.listDataT.seach

    }//技师列
    this.setData({
      listDataT:listDataT
    })
    this.getTeach()
  },
  // 搜索门店
  seachMD(){
    let data=this.data
    let listDataS={
      data:[],
      finsh:false,
      page:1,
      seach:data.listDataS.seach
    }//门店列表
    this.setData({
      listDataS:listDataS
    })
    this.getStore()
  },
  // 
  getTeach(){
    let data=this.data,that=this
    app.fl()
    app.fg({
      action: 'Search',
      content: data.listDataT.seach,
      regionPath: data.nowAddressId,
      // regionPath:'0,0,215',
      Latitude: data.LatiLongitude.Latitude,
      Longitude: data.LatiLongitude.Longitude,
      tag: 'technician',
      pageindex: 1,
      pagesize:1000,
    }).then(r=>{
      app.fh() 
      if(r.data.rows){
        that.setData({
          ['listDataT.data']:r.data.rows
        })
      }
     
        

      console.log(r) 
    })
    
  },
  StoreOrTea(e){
    let index={
      show:true,
      index:e.currentTarget.dataset.index
    }
    
    this.setData({
      showChoose:index
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    let data=this.data,that=this
    wx.getStorage({
      key: 'friends',
      success (res) {
        if(res.data) {
          wx.navigateTo({
            url:'/fuPackageA/fuEImgGai/fuEImgGai'
          })
          wx.setStorage({
            key:'friends',
            data:false,
          })
        }
      }
    })
    this.getProjcet()
  },

  // 获取项目
  getProjcet(){
    let data=this.data,that=this
    app.fl()
    app.fg({
      action:'GetProductByType',
      productType:0,
      Keywords:data.listDataP.seach,
    }).then(r=>{
      app.fh() 
      if(r.data.Result.Status=='Success'){
        that.setData({
          ['listDataP.data']:r.data.Result.Data
        })
       }
    })
  },

  // 获取音乐
  getMusic(){
    let data=this.data,that=this
    app.fl()
    app.fg({
      action:'GetFriendsMusic',
      openId:app.globalData.GetMembersInfo.openId,
    }).then(r=>{
      app.fh() 
      if(r.data.Status=='OK'){
        r.data.Data.forEach(c=>{
          c.isChoose=false
          data.musicList.push(c)
        })
        that.setData({
          musicList:data.musicList
        })
       }else app.fa(r.data.Message)
    })
    
  },


  // 选择音乐
  chooseMusic(e){
    let that=this,data=this.data,datar=e.currentTarget.dataset
    data.musicList.forEach((c,i)=>{
      if(i==datar.index) c.isChoose=!datar.data.isChoose
      else c.isChoose=false
    })
    this.setData({
      musicUrl:data.musicList[datar.index].isChoose?datar.data.FileUrl:'',
      musicList: data.musicList,
      ['choose[2].name']:data.musicList[datar.index].isChoose?datar.data.Name:'选择音频'
    })
    if(!datar.data.isChoose)  wx.createAudioContext('myAudio').play()
    else  wx.createAudioContext('myAudio').pause()
   
  },

  // 
  okMusic(e){
    let that=this,data=this.data,datar=e.currentTarget.dataset
    this.setData({
      musicUrl:data.musicUrl,
      ['choose[2].name']:data.choose[2].name,
    })
    wx.createAudioContext('myAudio').pause()
    this.onClose()
  },

  // 选择商品
  ChangeXM(e){
    this.setData({
      PDId:e.currentTarget.dataset.pid,
      ['choose[3].name']:e.currentTarget.dataset.name,
      ['showChoose.show']:false
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
    let data=this.data,that=this
    wx.getStorage({
      key: 'LatiLongitude',
      success (res) {
        console.log(res)
        that.setData({
          LatiLongitude:res.data
        })

        that.getStore()
        wx.getStorage({
          key: 'firstAddressId',
          success (res) {
            console.log(res.data)
            that.setData({
              nowAddressId:res.data.split(',')[2]
            })
            that.getTeach()
          }
        })
      }
    })
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
            console.log(dataR)
            that.setData({
              GetMembersInfo:dataR
            })
            if(data.musicList.length) return
            that.getMusic()
          } else {
            wx.redirectTo({
              url: "/pages/login/login"
            });
          }
        })
      })
    }else {
      that.setData({
        GetMembersInfo:app.globalData.GetMembersInfo
      })
      if(data.musicList.length) return
      that.getMusic()
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