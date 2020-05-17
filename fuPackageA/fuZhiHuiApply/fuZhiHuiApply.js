const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newImg: app.newImg,
    dataList: [
      {
        name: '小铺名称',
        val: '',
        plr: '请输入小铺名称',
        add: '',
      },
      {
        name: '真实姓名',
        val: '',
        plr: '请输入真实姓名',
        add: '',
      },
      {
        name: '身份证号码',
        val: '',
        plr: '请输入身份证号码',
        add: '',
      },
      {
        name: '联系电话',
        val: '',
        plr: '请输入联系电话',
        add: '',
      },
      {
        name: '省市区',
        val: ['广东省', '广州市', '海珠区'],
        plr: '请选择门店省市区',
        add: true,
      },
      {
        name: '详细地址',
        val: '',
        plr: '请输入详细地址',
        add: '',
      }
    ],
    region: ['广东省', '广州市', '海珠区'],
    getForm: {}, //获取表单的数据.

  },

  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value,

    })
  },
  inputFN(e) {
    this.setData({
      ['dataList[4].val']: e.detail.value,
      [e.currentTarget.dataset.name]: e.detail.value
    })
  },


  //form表单
  formSubmit: function (e) {
    let data = this.data, that = this
    for (let i = 0; i < data.dataList.length; i++) {
      if (!data.dataList[i].val) return app.fa(data.dataList[i].plr)
    }
    if (!(/^1[3|4|5|6|7|8|9][0-9]\d{4,8}$/.test(data.dataList[3].val))) return app.fa('请输入正确的手机号')
    if (!(/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(data.dataList[2].val))) {
      app.fa('请输入正确的身份证')

    }

    app.fl()
    app.fg({
      action: 'StoreApproval',
      UserId: app.globalData.GetMembersInfo.UserId || 555,
      StoreType: 0, //	是	string	获取类型（0-申请门店、1-获取门店）
      StoreName: data.dataList[0].val, //	是	string	门店名
      StoreArea: data.region || '广东省,广州市,越秀区', //	是	string	省市区
      StoreAdress: data.dataList[5].val, //	是	string	地址
      ContactName: data.dataList[1].val, //	是	string	联系人
      ContactTel: data.dataList[3].val,  //	是	string	联系电话(必须为手机号)
      IDCardNumber: data.dataList[2].val,  //	是	string	身份证号码
      IsBlack: 1,
    }).then(r => {
      app.fh()
      if (r.data.Status == 'Success') {
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1450)
      }
      app.fa(r.data.Message)
      console.log(r)
    })




  },

  // 
  saveJScode() {
    let url = this.data.getForm.SWXSignUrl
    console.log(url, 444444444);
    // wx.showModal({
    //   title: '提示01',
    //   content: url,
    // })
    wx.downloadFile({
      url: url,     //仅为示例，并非真实的资源
      success: function (res) {
        console.log(res, 1111111);
        // wx.showModal({
        //   title: '提示02',
        //   content: res.tempFilePath,
        // })
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode == 200) {
          app.fl('正在保存图片！')
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(res) {
              app.fh()
              app.fa('保存图片成功！')
            },
            fail(res) {
              console.log(res, 222222);
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
  onLoad: function (options) {
    this.getForm(app.globalData.GetMembersInfo.stid);

  },

  

  //获取表单数据
  getForm(id) {
    let that = this;
    let url = '?action=StoreApproval';
    let img = that.data.img;
    let data = {
      StoreType: 1, //	是	int	获取类型(0- 新增门店、1 - 获取门店申请)
      StoreId: id, //	是	int	门店Id
    }
    app.wPost(data, url).then(res => {
      console.log("输出form表单数据", res);
      let data = JSON.parse(res.data.Message)
      console.log("获取初始化数据", data);
     
      that.setData({
        getForm: data,
      
      })

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

  }
})