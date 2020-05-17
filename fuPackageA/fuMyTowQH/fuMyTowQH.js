const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    idCard: [
    // {
    //   name: '技师',
    //   img: app.newImg +'jishi@2x.png',
    // },
    
    {
      name: '线下门店',
      img: app.newImg +'xxmd003.png?1',
    },
    // {
    //   name: '店员',
    //   img: app.newImg + 'dianyuan@2x.png',
    // },
    // {
    //   // name: '执行',
    //   name: '机主',
    //   img: app.newImg +'jizhu@2x.png',
    // },
    {
      name: '智慧门店',
      img: app.newImg +'zhmd003.png?1',
    },
    {
      name: '员工',
      img: app.newImg +'yg003.png',
    }
    
  ],
    zxtdzShow:false,//执行者团队长
    zxtdzList:['执行者','执行团队长'],
    imgUrl:app.newImg,
    GetMembersInfo:{},
  },

  // 执行者或者团队长
  zxtdzFN(e){
    let index=e.currentTarget.dataset.index
    let data=this.data.GetMembersInfo
    let storeid = wx.getStorageSync('userinfo').StoreId;
    if (index == 0 && storeid !=0){
      if(data.ExcutorId){
        wx.navigateTo({
          url: '/pages/fujihang/fuMy/fuMy?id=4'
        })
      }
      else app.fa('您还不是执行者')
    }

    if (index == 1 && storeid != 0){
      if(data.thid){
        wx.navigateTo({
          url: '/pages/fujihang/fuMy/fuMy?id=2'
        })
      }else app.fa('您还不是店长')
    }
    this.setData({
      zxtdzShow:false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getCheck()
  },


  // 
  // getCheck(){
  //   let data=this.data,that=this
  //   app.fl()
  //   app.fg({
  //     action:'CheckAgreement',
  //     openId:123,
  //     Type:0,
  //   }).then(r=>{
  //     app.fh() 
  //     if(r.data.Status=='OK'){
        
  //     }
  //     console.log(r) 
  //   })
  // },

  registerFormSubmit: function (e) {
    app.fg({
      action:'SaveFormId',
      openId:app.globalData.GetMembersInfo.openId,
      // openId:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',
      formId:e.detail.formId
    })

  }, 

  // 身份入口
  toFNF(e) {
    let id = e.target.dataset.index
    let that = this
    app.getOpenId(function(a) {
      app.fl()
      app.fg({
        action: 'GetMembersInfo',
        openId: a
      }).then(r => {
        console.log("身份入口",r);
        app.fh()
        if (r.data.Status == "OK") {
          let dataR = r.data.Data
          dataR.openId = a
          app.setMembersInfo(dataR)
          that.setData({
            GetMembersInfo: dataR
          })
 
          switch (id) {
            case 0:
              // if (!dataR.tcid) return app.fa("您还不是技师！")
              // console.log("dataR.stid", dataR.stid)
              // if (!dataR.stid) return app.fa("您还不是店主！")
              if (!dataR.StoreId||!(dataR.IdentityName.indexOf('店长')!=-1)) return app.fa("您还不是店主！")
              wx.navigateTo({
                url: '/pages/fujihang/fuMy/fuMy?id=1'
              })
              break;
            case 1:
              // if (!dataR.stid) return app.fa("您还不是店主！")
              if (!dataR.bsid) return app.fa("您还不是智慧门店！")
              wx.navigateTo({
                url: '/pages/fujihang/fuMy/fuMy?id=3'
              })
              break;
            case 2:
              if(dataR.IdentityName!='店员') return app.fa("您还不是店员！")
                wx.navigateTo({
                  url: '/pages/fujihang/fuMy/fuMy?id=10'
                })
                break;
              
            // case 2:
            //   // if (!dataR.thid) return app.fa("您还没有店员！")
            //   wx.navigateTo({
            //     url: '/wuPackageB/salesclerk/salesclerk',
            //   });
            //   break;
            // case 3:
            //   if (!dataR.bsid) return app.fa("您还不是黑卡代理！")
            //   break;
          }
          // if(id==2){
          //   that.setData({
          //     zxtdzShow:true
          //   })
          //   return
          // }

          // wx.navigateTo({
          //   url: '/pages/fujihang/fuMy/fuMy?id=' + id
          // })
        } else {
          wx.redirectTo({
            url: "/pages/login/login"
          });
        }
      })
    })
    
  },

  //跳转角色申请页面
  handleRole(e){
    wx.navigateTo({
      url: '/pages/fujihang/fuIdentity/fuIdentity',
      success: (result) => {
        
      },
      fail: () => {},
      complete: () => {}
    });
      
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