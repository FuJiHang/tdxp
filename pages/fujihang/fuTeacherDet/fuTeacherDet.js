const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.imgUrl,
    imgheights:[],//轮播图高度
    current: 0,//图片第几张
    background:[],//轮播图
    teaData:{},
    video:false,
    active:0,
    teacherId:0,
    myQcode:'',//我的二维码
    Qcode: false, //二维码弹窗
    collect:[
      {
        name:'已收藏',
        img:'xinH.png',
        fiter:false,
      },
      {
        name:'分享',
        img:'shareT.png'
      },
    ],//收藏分享
    classL:['匠心纹绣','皮肤管理'],
    functionList:[
      {
        name:'个人简历',
      },
      {
        name:'特色服务',
      },
    ],
    jianli:[
      {
        name:'未来之星教育系统',
        img:'schT.png',
        to:'/fuPackageA/fuTeachSchDet/fuTeachSchDet'
      },
      {
        name:'头道汤签约头疗师',
        img:'peoT.png',
        to:'/fuPackageA/fuTeachDet/fuTeachDet'

      },
    ],
    tid:'',
    LatiLongitude:{}
  },


  exitImgFN(){
    this.setData({
      Qcode:false
    })
  },

  // 
  toFNEVA(){
    wx.navigateTo({
      url:'/fuPackageA/fuEvaluatAll/fuEvaluatAll?TeacherId='+this.data.tid
    })
  },

   // 保存二维码
  saveImgFN(){
    let url=this.data.myQcode.replace('http:','https:')
    wx.downloadFile({
      url:url,     //仅为示例，并非真实的资源
      success: function (res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode ==200) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(res) {
              app.fa('保存图片成功！')
            },
            fail(res){
              wx.showModal({
                title: '提示',
                content: '请打开相册授权',
                success(res) {
                  if (res.confirm) {
                    wx.openSetting({})
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
              
            }
          })
        }
      }
    })
  },


  //收藏 
  collectFN(e){
    let data=this.data,that=this
 
    if(e.currentTarget.dataset.index){
      app.getOpenId(function(a) {
        app.fl()
        app.fg({
          action:"GetShopExtension",
          openId:a,
          Path:app.globalData.GetMembersInfo.StoreId?('pages/fujihang/fuStoreDet/fuStoreDet?storeid='+app.globalData.GetMembersInfo.StoreId+'&Referral='+app.globalData.GetMembersInfo.UserId):'',
        }).then(r=>{
          app.fh()
          if(r.data.Status=="OK"){
    
            that.setData({
              Qcode:true,
              myQcode:r.data.data[0].MiniProgramCard
            })
          }else app.fa(r.data.Message)
        })
        
      })
    }else{
      app.fl()
      app.fg({  
        action:'GoodAndCollection',
        // openId:"oGsqu4qBG6Icub2iLYzI3MJGH4iQ",
        openId:app.globalData.GetMembersInfo.openId,
        RelationType:6,
        ForID:data.teacherId
      }).then(r=>{
        app.fh() 
        if(r.data.Status=='OK'){
          if(r.data.Message=="取消操作成功"){
            data.collect[0]={
              fiter:false,
              img:'xinH.png',
              name:'收藏'
            }
          }
          else {
            data.collect[0]={
              fiter:true,
              img:'xinH.png',
              name:'已收藏'
            }
          }
          that.setData({
            collect:data.collect
          })
        }
        app.fa(r.data.Message)
      })
    }
    
  },


  toFN(e){
    let to=e.currentTarget.dataset.to,data=this.data
    console.log(e)
    if(to=='/fuPackageA/fuTeachSchDet/fuTeachSchDet'){
      app.globalData.appId=='wxa4d03cf8e1ea5904'?wx.switchTab({
     url:'/pages/fujihang/fuIndexG/fuIndexG'
   }):  wx.navigateToMiniProgram({
    appId: 'wxa4d03cf8e1ea5904',
    path: 'pages/fujihang/fuIndexG/fuIndexG?id='+data.teaData.HeadId,
    // envVersion:'develop',
    success:function(e){
      console.log(e)
    },fail:function(e){
      console.log(e)
    }
  })
      return
    }
    wx.navigateTo({
      url:to+'?tid='+this.data.tid
    })
  },

  ff(){
    app.ff()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    wx.getStorage({
      key: 'LatiLongitude',
      success (res) {
        that.setData({
          LatiLongitude:res.data
        })
      } 
    })
    this.setData({
      tid:options.id
    })
    if(options.fOpenId){
      app.getWxUserInfo(function(f) {
        wx.request({
          url: app.getUrl("QuickLogin"),//
          data: {
            openId: f.openId,//微信返回的用户id
            nickName: f.nikeName,
            unionId: f.unionId,
            headImage: f.headImage,
            encryptedData: f.encryptedData,
            session_key: f.session_key,
            iv: f.iv,
            referralUserId:options.fOpenId,//上级id
            IsShareFromLotteryActivity:1,
            Latitude: that.data.LatiLongitude.Latitude,
            Longitude: that.data.LatiLongitude.Longitude,
            unionid: app.globalData.unionid
          }
        })
      })
    }

  },

  // 轮播图变化
  imageLoad: function (e) {//获取图片真实宽度  
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比  
      ratio = imgwidth / imgheight;
    //计算的高度值  
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight;
    var imgheights = this.data.imgheights;
    //把每一张图片的对应的高度记录到数组里  
    imgheights[e.target.dataset.id] = imgheight;
    this.setData({
      imgheights: imgheights
    })
  },

  bindchangeImg: function (e) {
    let imgheights=this.data.imgheights
    this.setData({ current: e.detail.current })
    if(e.detail.current==0&&this.data.video){
      imgheights[0]=(wx.getSystemInfoSync().windowWidth)*4/3
      this.setData({
        imgheights:imgheights
      })
    }
  },

  getData(){
    let data=this.data,that=this
    app.fl()
    app.fg({
      action:'GetTechnicianInfo',
      TechnicianId:data.tid,
      openId:app.globalData.GetMembersInfo.openId,
      gettype:1,
    }).then(r=>{
      app.fh()
      if(r.data.Status=="OK"){
        let rf=r.data.Data
        data.collect[0]={
          fiter:rf.IsCollect,
          img:'xinH.png',
          name:rf.IsCollect?'已收藏':'收藏'
        }
        let bg=rf.HeadPortrait.split(',')
        // if(rf.Video){
        //   data.background.push(rf.Video)
        //   data.video=true
        // } 
        let wc=rf.WorksCase.split(',')
        bg.forEach((c,i)=>{
          if(c!='') data.background.push(c) 
        })
        rf.WorksCase=[]
        wc.forEach((w,i)=>{
          if(w)  rf.WorksCase.push(w) 
        })
        rf.Reviews.forEach(c=>{
          c.Pictures=c.Pictures.split(',')
        })

       
        // data.background=data.background.slice(0,data.background.length-1)
        that.setData({
          video: data.video,
          background:data.background,
          teaData:rf,
          teacherId:data.tid,
          collect:data.collect,
        })
      }else app.fa(r.data.Message)
    })
  },
  
  // toFNTS(){
  //   wx.navigateTo({
  //     url:'/fuPackageA/fuSpecial/fuSpecial?edit=true&t='+encodeURIComponent(JSON.stringify(this.data.teaData))
  //   })
    
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
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
            that.getData()
          } else {
            wx.redirectTo({
              url: "/pages/login/login"
            });
          }
        })
      })
    }else {
      that.getData()
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