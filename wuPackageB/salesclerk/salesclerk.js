let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.newImg,
    img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/sade.jpg',
    list: [
      // {
      //   img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/sade.jpg',
      //   title:'张天爱',
      //   test:'超级明星'
      // },
      // {
      //   img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/sade.jpg',
      //   title: '张天爱',
      //   test: '超级明星'
      // },
      // {
      //   img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/sade.jpg',
      //   title: '张天爱',
      //   test: '超级明星'
      // },
    ],
    isShow: false,
    storeid: '', // 门店id
    codeImg: '',  //小程序码
    switchChecked: false,
    mrImg: app.newImg + 'zwtp.jpg',
    pIndex: 1,
    finsh: false,
    post: {
      Integral: ''
    },//送积分
    showAlert: false,
  },

  changeInput(e) {
    this.setData({
      [e.currentTarget.dataset.name]: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let storeid = wx.getStorageSync('userinfo').StoreId;
    // let sid = wx.getStorageSync('getStore').StoreId;
    this.setData({
      storeid:app.globalData.GetMembersInfo.StoreId
    })

  },

  // 打开积分窗口
  giveOpen(e) {
    this.setData({
      showAlert: true,
      ['post.StoreId']: e.currentTarget.dataset.data.StoreId,
      ['post.UserId']: e.currentTarget.dataset.data.UserId,
    })
  },
  onCloseP() {
    this.setData({
      showAlert: false,
    })
  },
  giveFN() {
    let data = this.data, that = this
    app.fl()
    app.fg({
      url: "/api/StoreManage.ashx?action=StoreGiveIntegral",
      data: data.post
    }, true).then(r => {
      app.fh()
      if (r.data.Status == 'OK') {
        that.onCloseP()
      }
      app.fa(r.data.Message)
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.data.pIndex = 1
    this.data.finsh = false
    this.data.list = []
    this.getSalesclerk(this.data.storeid);
  },

  //设置店员
  handleChange(e) {
    console.log('输出店员的值', e);
    const { authid, name, phone, picture, role, storeid } = e.currentTarget.dataset;
    const { value } = e.detail;
    console.log("输出选择的结果", value);
    if (value) {
      let type = 1
      this.subChange(authid, name, phone, picture, role, storeid, type)
    } else if (!value) {
      let type = 0
      this.subChange(authid, name, phone, picture, role, storeid, type)
    }
  },

  //修改店员请求
  subChange(authid, name, phone, picture, role, storeid, type) {
    console.log("输出设置店员的门店id", storeid);
    wx.request({
      url: app.data.url + '/api/StoreManage.ashx?action=StoreSetChecker',
      data: {
        IsSet: 2,//	是	int	1添加，2更新，0删除
        StoreId: storeid,//	是	int	门店Id
        Phone: phone,//	否	string	手机号码
        Role: role,//	否	string	角色
        Name: name,//	否	string	姓名
        AuthId: authid,//	否	int	Id，删除和更新时要传
        IsFont: type,
        openId:app.globalData.GetMembersInfo.openId
      },
      header: { Cookie: wx.getStorageSync('cookieFu') },
      success: (res) => {
        console.log("输出改变状态", res);
        this.setData({
          list: [],
          pIndex: 1,
          finsh: false
        })

        this.getSalesclerk(this.data.storeid);
      },
      fail: () => { },
      complete: () => { }
    });
  },

  //获取店员管理列表
  getSalesclerk(id) {
    console.log("输出获取店员列表的门店id",id);
    let that = this, data = this.data
    let post = {
      StoreId: id,  //	是	int	门店Id
      pageIndex: data.pIndex, //	是	int	页码
      pageSize: 20, //	是	int	页大小
      openId:app.globalData.GetMembersInfo.openId
    }
    if (data.finsh) return
    wx.request({
      url: app.data.url + '/api/StoreManage.ashx?action=StoreGetAuthList',
      data: post,
      header: { Cookie: wx.getStorageSync('cookieFu') },
      success: (res) => {
        console.log("输出管理员列表", res.data.Data);
        if (res.data.Status == "OK") {
          res.data.Data.forEach(v => {
            if (v.IsFont == 1) {
              v.sta = true
            } else if (v.IsFont == 0) {
              v.sta = false
            }
            data.list.push(v)
          })
          that.setData({
            list: data.list,
            pIndex: ++data.pIndex,
            finsh: res.data.Data.length < 20,
          })
        }
      }, 
      fail: () => { },
      complete: () => { }
    });
  },
  //生成店主绑定二维码
  setCode(num, id) {
    console.log("生成二维码的门店id",id);
    let path = 'wuPackageB/kongPage/KongPage?a=' + num+'&t=0&storeId='+app.globalData.GetMembersInfo.StoreId
    // let path = 'pages/mine/mine?authid=' + num
    let data = {
      StoreId: id || this.data.storeid, //	是	string	门店Id
      Path: path,  //	是	string	小程序路径，带参AuthId
      openId:app.globalData.GetMembersInfo.openId,
      AppId:app.globalData.appId, //小程序appid
      AppSecrect:app.globalData.secret
    }
    wx.request({ 
      url: app.data.url + '/api/StoreManage.ashx?action=StoreCreateBindCode',
      data: data,
      dataType: 'json',
      header: { Cookie: wx.getStorageSync('cookieFu') },
      success: (res) => {
        console.log("输出店员生成二维码", res);
        if (res.data.Status == "OK") {
          let code = res.data.BindCode.trim();//将字符串的前后空格去除
          this.setData({
            isShow: true,
            codeImg: code
          })
        } else {
          this.setData({
            isShow: false
          })
          wx.showToast({
            title: res.data.Message,
            icon: 'none',
            duration: 1500,
            mask: true,
            success: (result) => {

            },
            fail: () => { },
            complete: () => { }
          });

        }
      },
      fail: () => { },
      complete: () => { }
    });

  },

  //跳转添加
  handleClick() {
    wx.navigateTo({
      url: '/wuPackageB/addClerk/addClerk?storeid=' + this.data.storeid,
      success: (result) => {

      },
      fail: () => { },
      complete: () => { }
    });

  },
  //跳转编辑
  handleEdit(e) {
    // console.log(e);
    let { index, authid, storeid, name, phone, role, sta } = e.currentTarget.dataset;
    wx.navigateTo({
      // url: '/wuPackageB/clerkEdit/clerkEdit?index=' + index,
      url: `/wuPackageB/clerkEdit/clerkEdit?index=${index}&authid=${authid}&storeid=${storeid}&name=${name}&phone=${phone}&role=${role}&sta=${sta}`,
      success: (result) => {

      },
      fail: () => { },
      complete: () => { }
    });

  },

  //点击二维码按钮
  handleCode(e) {
    console.log(e);
    let { index, authid, storeid } = e.currentTarget.dataset;
    this.setCode(authid, storeid);
    // this.setData({
    //   isShow:true
    // })

  },
  //点击遮罩层隐藏
  handleHide() {
    this.setData({
      isShow: false
    })
  },
  //保存二维码到本地
  handleBC() {
    let imgSrc = this.data.codeImg;
    console.log("输出url", imgSrc);
    this.save(imgSrc);
  },
  save(img) {
    let save = wx.getStorageSync('save');//用户是否拒绝过
    let that = this;
    let saveImg = () => {
      console.log("输出img", img);
      wx.downloadFile({
        url: img,
        success: res => {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function (data) {
              wx.showToast({
                title: "保存成功",
                icon: "success",
                duration: 1400,
                success() {
                  setTimeout(() => {
                    that.setData({
                      isShow: false
                    })
                  }, 1500);
                }
              });
              if (save) {
                wx.removeStorageSync('save')
              }
            },
            fail: data => {
              wx.setStorageSync('save', 'fail')
            }
          })
        },
        fail: err => {
          wx.showToast({
            title: '下载图片失败',
            icon: 'none'
          })
        }
      })
    }
    //打开用户设置
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.writePhotosAlbum']) {
          wx.removeStorageSync('save')
          saveImg()
        } else {
          if (!save) {
            saveImg()
          } else {
            //拒绝过授权，再次保存让用户开启授权
            wx.openSetting({
              success: res => {
                console.log(res)
              }
            })
          }

        }
      }
    })
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

    this.getSalesclerk(this.data.storeid);

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})