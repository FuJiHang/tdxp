let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.newImg,
    photoList: [],  //照片数组
    logo:'',
    iconImg: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/sjmed/icon_photo2@2x.png',
    iconDel:'http://hmqy.oss-cn-hangzhou.aliyuncs.com/sjmed/close@2x(1).png',
    main:[
      {
        title:'机子昵称',
        pla:'修改机主的昵称',
        val:'',
        name:'mainName'
      },
      {
        title: '机子编码',
        pla: '填写代表的机子编码',
        val: '',
        name: 'mainCode'
      },
      {
        title: '存放位置',
        pla: '修改机主的昵称',
        val: '',
        name: 'mainPlace',
        status:false,
      },
      {
        title: '备注说明',
        pla: '添加文字描述',
        val: '',
        name: 'remark',
        status:true,
        type:true
      },
    ],
    uploadImg: [],
    imageLoad: [],
    logoLoad: [],
    logo:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = wx.getStorageSync('address');
    console.log("输出地址", data);
    let main = this.data.main;
    main.forEach(v=>{
      if (v.name =="mainPlace"){
        v.val=data
      }
    })
    this.setData({
      main
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  //form表单数据
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    let obj = e.detail.value;
    app.fp({
      action: 'AddFaceBrushMachine',
      openid: app.globalData.GetMembersInfo.openId,
      Address: obj.mainPlace,//	是	string	存放地址
      NickName: obj.mainName,//	是	string	机子昵称
      Code: obj.mainCode, //	是	string	机子编码
      Remark: obj.remark, //	是	string	备注说明
      Images: obj.hjImg, //	是	string	环境图 多张图片用英文逗号, 隔开
    }).then(res => {
      console.log('输出form状态',res);
      if(res.data.Status=='NO'){
        wx.showToast({
          title: res.data.Message,
          icon: 'none',
          duration: 1500,
          mask: true,
        });
      }else {
        wx.showToast({
          title: res.data.Message,
          icon: 'none',
          image: '',
          duration: 1500,
          mask: false,
          success: (result) => {
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              });
            }, 1500);
          },
        });
          
      }
    })
  },

  // 拍照、选图
  postImg(e) {
    let that = this;
    console.log("输出点e", e);
    // let { typeid } = e.currentTarget.dataset;
    // console.log(typeid);
    wx.chooseImage({
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        const logoLoad = that.data.logoLoad.concat(res.tempFilePaths)
        let logoList = []
        logoList = logoLoad.length <= 1 ? logoLoad : logoLoad.slice(0, 1)
        console.log(logoList)
        that.uploadImgs(logoList, 0, 'logo').then(c => {
          console.log("图片上传", that.data.logo)
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
            openId: app.globalData.GetMembersInfo.openId,
          },
          success: res => {
            console.log("输出调用接口", res);
            // let newArr = [];
            let datar = JSON.parse(res.data)
            if (datar.Status == "OK") {
              if (num == all) {
                getImage = datar.Data[0].ImageUrl
                console.log("++++++++++", getImage);
                that.setData({
                  photoList: datar.Data,
                  logo: getImage
                })
              } else {
                getImage += ',' + datar.Data[0].ImageUrl
              }
              // if (num == all) getImage = datar.Data[0].ImageUrl
              // else getImage += ',' + datar.Data[0].ImageUrl
              // num = num - 1
              // num = num - 1
              // upload(num)
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

})