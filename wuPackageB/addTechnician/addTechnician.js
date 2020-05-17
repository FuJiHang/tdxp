let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.newImg,
    img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/sade.jpg',
    iconImg: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/sjmed/icon_photo2@2x.png',
    photoList:[],
    uploadImg: [],
    imageLoad: [],
    logoLoad: [],
    StoreImages:'',
    nameVal:'',
    storeid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let storeid = wx.getStorageSync('userinfo').StoreId;
    this.setData({
      storeid
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  // 提交数据
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    let obj = e.detail.value;
    wx.request({
      url: app.data.url+'/api/StoreManage.ashx?action=SetTechnicians',
      data: {
        IsSet:1,//	是	int	0删除，1添加，2更新
        StoreId: this.data.storeid,//	否	int	门店Id
        Name: obj.nameVal,//	否	string	姓名
        Introduce: obj.introduce,//	否	string	介绍
        HeadPortrait: obj.addImg,//	否	string	头像
      },
      header: { Cookie: wx.getStorageSync('cookieFu') },
      success: (res) => {
        console.log("输出添加技师状态",res);
        if(res.data.Status=="OK"){
          wx.showToast({
            title: res.data.Message,
            icon: 'none',
            duration: 1500,
            mask: true,
            success: (result) => {
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                });
              }, 1500);
            },
            fail: () => {},
            complete: () => {}
          });
            
        }
      },
      fail: () => {},
      complete: () => {}
    });
      





  },

  // 拍照、选图
  postImg(e) {
    let that = this;
    console.log("输出点e", e);
    let { typeid } = e.currentTarget.dataset;
    console.log(typeid);
    wx.chooseImage({
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        const logoLoad = this.data.logoLoad.concat(res.tempFilePaths)
        let logoList = []
        logoList = logoLoad.length <= 1 ? logoLoad : logoLoad.slice(0, 1)
        that.uploadImgs(logoList, 0, 'logo', typeid).then(c => {
        })
      }
    })
  },
  uploadImgs(images, num, name, id) {
    let that = this
    const all = num
    let getImage = ''
    return new Promise((resolve, reject) => {
      function upload(num) {
        if (num < 0) {
          resolve(true)
          that.setData({
            [name]: getImage,
          })
          return
        }
        wx.uploadFile({
          url: app.getUrl('UploadAppletImage'),
          filePath: images[num],
          name: 'file',
          formData: {
            appid:app.globalData.appId,
            openId: wx.getStorageSync('openId') || app.globalData.GetMembersInfo.openId,
          },
          success: res => {
            console.log("输出调用接口",res);
            let datar = JSON.parse(res.data)
            if (datar.Status == "OK") {
              getImage = datar.Data[0].ImageUrl
              console.log("++++++++++", getImage);
              that.setData({
                photoList: datar.Data,
                StoreImages: getImage
              })
            } else {
              app.fh()
              app.fa("上传图片失败！")
            }
          }
        })
      }
      upload(num)
    })
  },
  // 删除图片
  Deleted(e) {
    let { index } = e.currentTarget.dataset;
    this.data.photoList.splice(index, 1)
    this.setData({
      photoList: this.data.photoList
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})