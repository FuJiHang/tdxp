const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.imgUrl,
    imgheights:[],//轮播图高度
    minImgH:0,//最小高度
    current: 0,//图片第几张
    background:[],//轮播图
    video:false,//视频
    LatiLongitude:{},//经纬度
    nowAddressId:'',
    active:0,
    hotPro:[
      {
        name:'匠心粉墨眉',
      },
      {
        name:'明眸亮瞳黑',
      },
      {
        name:'裸妆润彩唇',
      },
    ],
    getStore:{},
    myQcode:'',//我的二维码
    Qcode: false, //二维码弹窗
  },
  toFFN(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.to
    });
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
    imgheights.sort(function (a, b) {
      return a-b;
    }); 
    this.setData({
      // imgheights: imgheights,
      minImgH:imgheights[0]
    })
  },

  paixu(a,b){
    return b.SaleCounts-a.SaleCounts
  },
    
  //二维码弹窗
  QcodeFN(){
    let that=this
    console.log(this.data.getStore)
    app.getOpenId(function(a) {
    app.fl()
    app.fg({
      action:"GetShopExtension",
      openId:a,
      Path:'pages/fujihang/fuStoreDet/fuStoreDet?storeid='+that.data.getStore.StoreId+'&Referral='+app.globalData.GetMembersInfo.UserId,
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
  } ,
  exitImgFN(){
    this.setData({
      Qcode:false
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

  // 获取热门项目
  getHotPro(id){
    let data=this.data
    if(data.hotPro[data.active].finish) return
    app.fl()
    app.fg({
      action:'GetProducts',
      cId:data.hotPro[data.active].cid,
      Type:2,
      StoreId:data.getStore.StoreId?data.getStore.StoreId:id,
      pageIndex:1,
      pageSize:1000
    }).then(r=>{
      app.fh()
      if(r.data.Status=="OK"){
        let getdata=r.data.Data
        getdata.sort(this.paixu)
        data.hotPro[data.active].data=getdata.slice(0,5)
        data.hotPro[data.active].finish=true
      
        this.setData({
          hotPro:data.hotPro
        })
      }else app.fa("获取数据失败！")
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
  ff(){
    app.ff()
  },
  toProList(e){
    let id=e.currentTarget.dataset.id,data=this.data
    wx.navigateTo({
      url: "/pages/packageList/packageList?projectid="+id+"&addressid="+data.nowAddressId+
      "&userlatitude="+data.LatiLongitude.Latitude+"&userlongitude="+data.LatiLongitude.Longitude
    }); 
  },
  getData(id){
    let data=this.data,that=this
    app.fl()
    app.fg({
      // action: 'GetStoreDetail',
      // storeid: 600,
      // Latitude: 23.12901,
      // Longitude: 113.2668,
      action:'GetStoreDetail',
      storeid:id,
      Latitude:data.LatiLongitude.Latitude,
      Longitude:data.LatiLongitude.Longitude,
      openId:app.globalData.GetMembersInfo.openId,
    }).then(r=>{
      app.fh()
      if(r.data.Status=="OK"){
        let rf=r.data
        let bg=rf.EnvironmentImages.split(',')
        rf.yysj=rf.OpenStartDate.split(' ')[1].slice(0,5)+'~'+rf.OpenEndDate.split(' ')[1].slice(0,5)        
        if(rf.Video){
          data.background.push(rf.Video)
          data.video=true
        } 
        bg.forEach((c,i)=>{
          if(c) data.background.push(c) 
        })
        rf.Appraises.forEach(c=>{
          c.Pictures=c.Pictures.split(',')
          c.AddDate=c.AddDate.slice(5,7)+'月'+c.AddDate.slice(8,10)+'日'
          c.all=false
        })
        rf.FightGroups.forEach(c=>{
          c.ProductPicture=c.ProductPicture.split(",")[0]
        })
       
        // data.background=data.background.slice(0,data.background.length-1)
        that.setData({
          video: data.video,
          background:data.background,
          getStore:rf,
        })
      }else app.fa(r.data.Message)
      // console.log(r)
    })
  },
  // 
  allFN(e){
    
    this.setData({
      [e.currentTarget.dataset.index]:e.currentTarget.dataset.data?false:true
    })
  },

  // 
  toFN(e){
    wx.navigateTo({
      url:'/fuPackageA/fuCardGet/fuCardGet?data='+encodeURIComponent(JSON.stringify(e.currentTarget.dataset.data))
    })
    // console.log(e.currentTarget.dataset.data)
  },

  // 
  toFNEVA(){
    wx.navigateTo({
      url:'/fuPackageA/fuEvaluatAll/fuEvaluatAll?StoreId='+this.data.getStore.StoreId
    })
  },

  onChange(event) {
    this.setData({
      active:event.detail.index
    })
    this.getHotPro()
  },
  toProDet(e){
    wx.navigateTo({
      url:'/pages/fujihang/fuProduct/fuProduct?id='+e.currentTarget.dataset.id+"&StoreName="
      +encodeURIComponent(this.data.getStore.StoreName)+"&storeDet="+encodeURIComponent(JSON.stringify(this.data.getStore))
    })
  },
  toStroe(){
    wx.navigateTo({
      url:'/pages/fujihang/fuAppoint/fuAppoint?id='+this.data.getStore.StoreId
    })
  },
  callPhone: function() {
    wx.makePhoneCall({
      phoneNumber: this.data.getStore.Tel
    })
  },

   // 获取分类
  getProCat(id){
    let that=this
    app.fl()
    app.fg({
      action:'GetAllCategories',
      Type:1
    }).then(r=>{
      if(r.data.Status=="OK"){
        that.setData({
          hotPro:r.data.Data
        })
        that.getHotPro(id)
      }else {
        app.fh()
        app.fa("获取数据失败！")
      }
    })
  },

  //收藏 
  collectFN(){
      let data=this.data,that=this
      app.fl()
      app.fg({  
        action:'GoodAndCollection',
        // openId:"oGsqu4qBG6Icub2iLYzI3MJGH4iQ",
        openId:app.globalData.GetMembersInfo.openId,
        RelationType:5,
        ForID:data.getStore.StoreId
      }).then(r=>{
        app.fh() 
        if(r.data.Status=='OK'){
          if(r.data.Message=="取消操作成功") data.getStore.IsCollect="False"
          else data.getStore.IsCollect="True"
          that.setData({
            getStore:data.getStore
          })
        }
        app.fa(r.data.Message)
      })
  },

  // 
  toFigGro(e){
    let data=this.data
    wx.navigateTo({
      url:'/fuPackageA/fuCollageDet/fuCollageDet?type=0&id='+e.currentTarget.dataset.id
      +'&sid='+data.getStore.StoreId
    })
  },

  // 
  toFigList(){
    wx.navigateTo({
      url:'/pages/fujihang/fuAssemList/fuAssemList?id='+this.data.getStore.StoreId
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options.id=600
    let that=this
    wx.getStorage({
      key: 'LatiLongitude',
      success (res) {
        that.setData({
          LatiLongitude:res.data
        })
      } 
    })
    wx.getStorage({
      key: 'nowAddressId',
      success (res) {
        that.setData({
          nowAddressId:res.data
        })
      }
    })



    // 

    let bbbb=decodeURIComponent(options.scene)
    console.log( bbbb)
    let getBD=''
    if(bbbb!='undefined'){
      console.log("2323423")
      getBD=bbbb.split('storeid=')[1].split('&Referral=')
      console.log(getBD)
      wx.setStorage({
        key:'ReferralStoreUserId',
        data:getBD[1]
      })
      // app.getWxUserInfo(function(f) {
      //   if(!f.openId||options.isNew) return
      //   wx.request({
      //     url: app.getUrl("QuickLogin"),//
      //     data: {
      //       openId: f.openId,//微信返回的用户id
      //       nickName: f.nikeName,
      //       unionId: f.unionId,
      //       headImage: f.headImage,
      //       encryptedData: f.encryptedData,
      //       session_key: f.session_key,
      //       iv: f.iv,
      //       referralUserId:getBD[1],//上级id
      //     },
      //     success:c=>{
      //       console.log(c)
      //     }
      //   })
      // })
      

    } 
    

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
            let id=getBD[0]?getBD[0]:parseInt(options.id)
            that.getData(id)
            that.getProCat(id)
            that.sharePJ(options.aid)
          
          } else {

            wx.redirectTo({
              url: "/pages/login/login?isStroe=true&scene="+encodeURIComponent(bbbb)+'&referralUserId='+getBD[1]
            });
            // return
            
          }
        })
      })
    }else{
      // return
      setTimeout(()=>{
        let id=getBD[0]?getBD[0]:parseInt(options.id)
        that.getData(id)
        that.getProCat(id)
        that.sharePJ(options.aid)
      },200)
    }

    // 
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
            Latitude: that.data.LatiLongitude.Latitude,
            Longitude: that.data.LatiLongitude.Longitude,
            unionid: app.globalData.unionid
          },
          success:c=>{
            console.log(c)
          }
        })
      })
    }


    
    
  },

  sharePJ(aid){
    let data=this.data,that=this
    app.fl()
    app.fg({
      action:"ShareSuccess",
      openid:app.globalData.GetMembersInfo.openId,
      Id:aid
    }).then(r=>{
      app.fh() 
      if(r.data.Status=='OK'){
    
       }
      console.log(r) 
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
    let that=this
    let scene=encodeURIComponent('storeid='+that.data.getStore.StoreId+'&Referral='+app.globalData.GetMembersInfo.UserId) 
    return {
      title: that.data.getStore.StoreName,
      path: '/pages/fujihang/fuStoreDet/fuStoreDet?scene='+scene
    }
  }
})