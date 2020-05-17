let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authid: '',//权限id
    typeId:'',
    storeId:'',
  }, 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("小程序码的数据", options);
    if (options.scene) {
      wx.showLoading({
        title: '绑定中~',
        mask: true,
      });
      let scene = decodeURIComponent(options.scene);
      app.globalData.storeId=scene.split('&')[2].split('=')[1]
      console.log("解码后的值", scene);
      console.log(scene.split('&'));
      
      //&是我们定义的参数链接方式
      let id = scene.split('&')[0].split('=')[1];
      console.log("输出裁剪后的值", id);
      this.setData({
        authid: id,
        typeId:scene.split('&')[1].split('=')[1]
      })
      if (this.data.authid) {
        this.referUser(this.data.authid);
      } else {
        wx.showToast({
          title: '未绑定成功,请重新绑定!!!',
          icon: 'none',
          duration: 1500,
          mask: true,
          success: (result) => {
            setTimeout(() => {
              wx.reLaunch({
                url: '',
                success: (result) => {

                },
                fail: () => { },
                complete: () => { }
              });

            }, 1500);
          },
          fail: () => { },
          complete: () => { }
        });

      }
    }else{
      console.log("输出错误信息",res)
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  //获取个人信息
  referUser(id) {
    let that = this
    app.getOpenId(function (a) {
      app.fg({
        action: 'GetMembersInfo',
        openId: a
      }).then(r => {
        console.log("输出个人信息", r);
        if (r.data.Status == "OK") {
          let dataR = r.data.Data
          wx.setStorageSync('userinfo', dataR);
          that.bindInfo(id)
          dataR.openId = a
          app.setMembersInfo(dataR)

          that.setData({
            GetMembersInfo: dataR
          })
        } else {
          wx.redirectTo({
            url: "/pages/login/login"
          });
        }
      })
    }) 

  },
  //绑定用户
  bindInfo(id) {
    let data = {
      a: id,
      t:this.data.typeId
    }
    wx.request({
      url: app.data.url + '/api/StoreManage.ashx?action=UserScanBindCode',
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        Cookie: wx.getStorageSync('cookieFu') || app.data.cookie
      },
      success: (res) => {
        console.log("绑定结果", res);
        if (res.data.Status == "OK") {
          wx.hideLoading();
          wx.showToast({
            title: '绑定成功!!!',
            icon: 'success',
            duration: 1500,
            mask: true,
            success: (result) => {
              setTimeout(() => {
                wx.reLaunch({
                  url: '/pages/fujihang/fuIndexG/fuIndexG',
                });

              }, 1500);
            },
          });
        }else{
          wx.hideLoading();
          console.log("输出错误信息", res.data.Message);
          wx.showToast({
            title: res.data.Message,
            icon: 'none',
            duration: 1500,
            mask: true,
            success: (result) => {
              setTimeout(() => {
                wx.reLaunch({
                  url: '/pages/qidong/qidong',
                });
              }, 1500);
            },
          });
        }
      },
      fail: () => { },
      complete: () => { }
    });
  }
})