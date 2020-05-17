const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTop:[
      {
        name:'我的视频',
        img:app.imgUrl+'wdspFXYJ.png',
        url:'/fuPackageA/fuJitterPeo/fuJitterPeo',
      },
      {
        name:'我的评价',
        img:app.imgUrl+'wdpjFXYJ.png?1',
        url:'/fuPackageA/fuPorsonEva/fuPorsonEva',
      },
      {
        name:'门店',
        img:app.imgUrl+'mdFXYJ.png',
      },
      {
        name:'技师',
        img:app.imgUrl+'jsFXYJ.png',
      },
      {
        name:'抽奖',
        img:app.imgUrl+'cjFXYJ.png?1',
      },
    ],
    ss:'',
    regionid:'',
    LatiLongitude:{},
    shareData:{},
  },


  // 
  toFN(e){
    wx.navigateTo({
      url:e.currentTarget.dataset.url
    })
  },

  // 
  sss(){
    console.log('=========')
    this.setData({
      ss:1222222
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this,data=this.data
    wx.getStorage({
      key:'firstAddressId',
      success:function(res){
      data.regionid=res.data
      }
    })
    wx.getStorage({
      key:'LatiLongitude',
      success:function(res){
        data.LatiLongitude=res.data
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
            that.getData()
          } else {
            wx.redirectTo({
              url: "/pages/login/login"
            });
          }
        })
      })
    }else this.getData()
  },


  getData(){
    let data=this.data,that=this
    app.fl()
    app.fg({
      action:'GetShareConf',
      openId:app.globalData.GetMembersInfo.openId,
      regionid:data.regionid,
      Latitude: data.LatiLongitude.Latitude,
      Longitude:data.LatiLongitude.Longitude,
    }).then(r=>{
      app.fh() 
      if(r.data.Status=='OK'){
        data.shareData=r.data
      }else app.fa(r.data.Message)
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
  onShareAppMessage: function (options) {
    let data=this.data,that=this
    console.log(options,'========')
    switch(options.target.id){
      case '4':
          return {
            title: '抽奖可获得积分，积分可兑换商品',
            path: '/fuPackageA/fuLuckDraw/fuLuckDraw?fOpenId='+app.globalData.GetMembersInfo.UserId,
            imageUrl: app.imgUrl+'drawShare.png',
            success: (res) => {
              app.fa('转发成功')
            },
            fail: (res) => {
              app.fa('转发失败')
            }
          }
      case '3': 
        return {
          title: '【头道惠】'+data.shareData.StoreName,
          path: '/pages/fujihang/fuTeacherDet/fuTeacherDet?id='+data.shareData.TechnicianId+'&fOpenId='+app.globalData.GetMembersInfo.UserId,
          imageUrl: data.shareData.ShareTechnicianImg,
          success: (res) => {
            app.fa('转发成功')
          },
          fail: (res) => {
            app.fa('转发失败')
          }
        }
      case '2': 
        return {
          title: '【头道惠】'+data.shareData.StoreName,
          path: '/pages/fujihang/fuStoreDet/fuStoreDet?id='+data.shareData.StoreId+'&fOpenId='+app.globalData.GetMembersInfo.UserId,
          imageUrl: data.shareData.ShareStoreImg,
          success: (res) => {
            app.fa('转发成功')
          },
          fail: (res) => {
            app.fa('转发失败')
          }
        }

    }



    // return {
    //   title: data.ss,
    //   path: '/fuPackageA/fuJitter/fuJitter',
    //   imageUrl: "",
    //   success: (res) => {
    //     app.fa('转发成功')
    //   },
    //   fail: (res) => {
    //     app.fa('转发失败')
    //   }
    // }
  }
})