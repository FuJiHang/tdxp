// fuPackageA/setCustomer/setCustomer.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{
      wxNum: '',
      img: ''
    }],
    storeId: 0
  },

  // 拼接字符串
  dealStr(arr, type) {
    return new Promise((resolve, reject) => {
      var str = "";
      for (var i = 0; i < arr.length; i++) {
        if (type == 1) {
          str += arr[i].wxNum + ",";
        } else {
          str += arr[i].img + ",";
        }
      }
      if (str.length > 0) {
        str = str.substr(0, str.length - 1);
      }
      resolve(str);
    })
  },

  // 提交
  submit() {
    let _this = this,
      list = _this.data.list,
      length = list.length,
      i
    for (i = 0; i < length; i++) {
      if (list[i].wxNum.replace(/\s+/g, "") == "") {
        wx.showToast({
          title: `请填写第${i+1}项微信号`,
          icon: 'none'
        })
        return
      }
      // if (list[i].img.replace(/\s+/g, "") == "") {
      //   wx.showToast({
      //     title: `请上传第${i + 1}项微信二维码`,
      //     icon: 'none'
      //   })
      //   return
      // }
    }
    _this.dealStr(list, 1).then(wxNum => {
      let wxName = wxNum
      _this.dealStr(list, 2).then(img => {
        let wxCodeImg = img
        app.fl()
        app.fg({
          action: 'SetStoreServices',
          StoreId: _this.data.storeId,
          Type: 0, //0-设置客服，1-获取客服
          wxCodeImg: wxCodeImg,
          wxName: wxName
        }).then(r => {
          app.fh()
          if (r.data.Status == 'Success') {
            wx.showToast({
              title: r.data.Message || '设置成功',
            })
            _this.getService()
          }else{
            wx.showToast({
              title: r.data.Message || '数组错误',
              icon:'none'
            })
          }
        })
      })
    })
  },

  // 上传图片
  uploadingImg(e) {
    let idx = e.currentTarget.dataset.idx,
      _this = this
    wx.chooseImage({
      count: 1,
      sourceType: ['album'],
      success: function(res) {
        _this.uploadImgs(idx, res.tempFilePaths)
      },
    })
  },
  uploadImgs(idx, images) {
    let _this = this
    wx.showLoading({
      title: '图片上传中',
      mask: true
    })
    wx.uploadFile({
      url: app.getUrl('UploadAppletImage'),
      filePath: images[0],
      name: 'file',
      formData: {
        // openId: app.globalData.GetMembersInfo.openId || '',
        openId: 'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',
        appid: app.globalData.appId,
      },
      success: res => {
        wx.hideLoading()
        let datar = JSON.parse(res.data)
        if (datar.Status == "OK") {
          _this.setData({
            [`list[${idx}].img`]: datar.Data[0].ImageUrl
          })
        } else {
          app.fh()
          app.fa("上传图片失败！")
        }
      }
    })
  },

  // 设置文字
  setValue(e) {
    let idx = e.target.dataset.idx
    this.setData({
      [`list[${idx}].wxNum`]: e.detail.value
    })
  },

  // 移除
  removeItem(e) {
    let idx = e.currentTarget.dataset.idx,
      list = this.data.list,
      _this = this
    list.splice(idx, 1)
    this.setData({
      list: list
    })
  },

  // 新增
  addListItem() {
    let arr = {
        wxNum: '',
        img: ''
      },
      list = this.data.list
    if (list.length == 3) {
      wx.showToast({
        title: '一次性最多设置三个',
        icon: 'none'
      })
      return
    }
    this.setData({
      list: list.concat(arr)
    })
  },

  // 获取客服
  getService() {
    let data = this.data, that = this
    app.fl()
    app.fg({
      action: 'SetStoreServices',
      StoreId: data.storeId,
      Type: 1,//0-设置客服，1-获取客服
    }).then(r => {
      app.fh()
      if (r.data.Status == 'Success') {
        if (r.data.Message == null) {
          that.data.existCustomer = false
        } else {
          that.data.existCustomer = true
          let res = JSON.parse(r.data.Message), list = [], imgArr, nameArr, i
          imgArr = res.WxCodeImg.split(',')
          nameArr = res.WxName.split(',')
          for (i = 0; i < imgArr.length; i++) {
            list[i] = {
              wxNum: nameArr[i],
              img: imgArr[i]
            }
          }
          that.setData({
            list: list
          })
          console.log('客服信息', list)
        }
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this
    _this.setData({
      storeId: app.globalData.GetMembersInfo.StoreId
    })
    this.getService()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

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