// pages/ technicianDetails/ technicianDetails.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: getApp().imgUrl,
    technicianObj: [],
    technician_id: '',
    active: 0,
    myQcode:'',//我的二维码
    Qcode: false, //二维码弹窗
  },

  onChange(event) {
    // wx.showToast({
    //   title: `切换到标签 ${event.detail.index + 1}`,
    //   icon: 'none'
    // });
  },
  //二维码弹窗
  QcodeFN(){
    let that=this
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    // 获取技师id
    that.setData({
      technician_id: parseInt(options.technicianid)
    });
    console.log("获取到的技师参数" + that.data.technician_id)
    console.log(typeof(that.data.technician_id)) //判断是什么类型
    console.log(Number.isInteger(that.data.technician_id)) //判断是否为整形
    wx.request({
      url: getApp().gethsyurl,
      data: {
        TechnicianId: that.data.technician_id,
        action: "GetTechnicianInfo"
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        res.data.Data.Reviews.forEach(v => {
          v.serStars = parseInt((v.ServiceScore * 10) / 2).toFixed(0) <= 0 ? 1 : parseInt((v.ServiceScore * 10) / 2).toFixed(0)
          v.tecStars = parseInt((v.TechnicalScore * 10) /2).toFixed(0)
        })
        console.log(res.data.Data.Reviews)
        const {
          Data
        } = res.data;
        that.setData({
          technicianObj: Data
        })
      },
      fail: (erro) => {
        console.log(erro)
      }
    });

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


  // 去项目详情
  toStoreFN(e){
    let data=this.data
    
    
    let index=e.currentTarget.dataset.index
    wx.navigateTo({
      url: "/pages/projectDetails/projectDetails?projectid="+data.technicianObj.Programs[index].ProductId
    });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})