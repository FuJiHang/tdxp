// pages/fujihang/fuApplicaMate/fuApplicaMate.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    zxAddress: ["请选择所在区域"],
    grjj: '',//个人简介
    shengfeng: 0,//身份
    imgUrl: app.imgUrl,
    applicaData: {},//申请身份
    textarea: '',
    seach: '',//搜索
    teachTDZ: [
      {
        name: '名字',
        val: '',
        plr: '请输入名字',
      },
      // {
      //   name:'区域',
      //   val:['请选择所在区域'],
      //   plr:['请选择所在区域'],
      // }, 
      {
        name: '执行团队长',
        val: '',
        plr: '请选择执行团队长',
        id: '',
      },
      {
        name: '电话',
        val: '',
        plr: '无',
      },
    ],//技师名字，团队长
    appList: [
      {
        name: '店家',
        text: '描述的小文字',
        img: app.imgUrl + 'role_icon_01.png',
        bg: "bg0",
      },
      {
        name: '技师',
        text: '描述的小文字',
        img: app.imgUrl + 'role_icon_02.png',
        bg: "bg1",
      },
      {
        name: '执行团队长',
        text: '描述的小文字',
        img: app.imgUrl + 'role_icon_03.png',
        bg: "bg2",
      },
      {
        name: '渠道',
        text: '描述的小文字',
        img: app.imgUrl + 'role_icon_04.png',
        bg: "bg3",
      },
    ],//身份列表
    storeList: [
      {
        name: '门店头像',
        val: app.imgUrl + 'add_2.png',
        right: true,
        isUpload: false,
      },
      {
        name: '门店名称',
        val: "",
        plr: '请输入店名',
        right: false,
      },
      {
        name: '所在区域',
        val: ['请选择所在区域'],
        right: true,
      },
      {
        name: '详细地址',
        val: '请选择详细地址',
        right: true,
      },
      {
        name: '门牌号',
        val: '',
        right: false,
        plr: '请输入门牌号'
      },
      {
        name: '门店介绍',
        val: app.imgUrl + 'add_2.png',
        right: true,
        isUpload: false,
      },
      {
        name: '售后服务',
        val: app.imgUrl + 'add_2.png',
        right: true,
        isUpload: false,
      },

      // {
      //   name:'营业时间',
      //   val:'请选择营业时间',
      //   right:true,
      // },
      {
        name: '上传门店',
        val: '最多可上传5张图片)',
        right: false,
      },
    ],//店家申请资料
    imageLoad: [],//上传图片
    getImage: '',
    detailAdd: '',
    Latitude: 0,
    Longitude: 0,
    getAddress: [],//获取省市级
    getAddressId: '',//省市级id
    getZxtdz: [],//执行团队长列表
    show: false,//显示执行团队长列表
    richtext: '',//富文本内容
    showXY: false,//显示富文本
    SMS: "",
    totalTime: 6,
    chooseType: [],//选择门店分类
    BsRoleList:{},//渠道数据
    showBS:false,//渠道列表弹窗
  },
  // 打开执行团队长列表
  onOpen(e) {
    this.getZxtdzFN()

  },

  //关闭渠道列表弹窗
  closeBSFN(){
    this.setData({
      showBS:false
    })
  },
  openBSChoose(){
    this.setData({
      showBS:true
    })
  },
  chooseBSFN(e){
    let datar=e.currentTarget.dataset.data
    this.setData({
      ['BsRoleList.HeadCellPhone']:datar.CellPhone,
      ['BsRoleList.HeadName']:datar.RealName,
      ['BsRoleList.HeadUserId']:datar.UserId,
      showBS:false

    })
  },

  // 关闭协议
  closeXY() {
    this.setData({
      showXY: false
    })
  },
  //关闭执行团队长列表
  onClose() {
    this.setData({ show: false });
  },
  // 修改技师名称
  jsNmae(e) {
    this.setData({
      ["teachTDZ[0].val"]: e.detail.value
    })
  },
  seachZXT() {
    this.setData({
      getZxtdz: []
    })
    this.getZxtdzFN()
  },
  // 修改店名
  nameFN(e) {
    this.setData({
      ["storeList[" + 1 + "].val"]: e.detail.value
    })
  },
  mpFN(e) {
    this.setData({
      ["storeList[" + 4 + "].val"]: e.detail.value
    })
  },
  // 去地址
  toChooseAdd() {
    if (this.data.storeList[2].val.length < 3) return app.fa("请先选择区域")
    wx.navigateTo({
      url: "/pages/editaddress/editaddress?fujihang=true&region=" + this.data.storeList[2].val[2]
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = this.data,that=this
    if (!app.globalData.GetMembersInfo || !app.globalData.GetMembersInfo.openId) {
      app.getOpenId(function (a) {
        app.fg({
          action: 'GetMembersInfo',
          openId: a
        }).then(r => {
          if (r.data.Status == "OK") {
            let dataR = r.data.Data
            dataR.openId = a
            app.setMembersInfo(dataR)
            that.getBsRoleList()

          } else {
            wx.redirectTo({
              url: "/pages/login/login"
            });
          }
        })
      })
    }





    this.setData({
      shengfeng: options.id,
      applicaData: data.appList[options.id]
      // shengfeng:"1",
      // applicaData:data.appList[1]
    });
    
    if (data.shengfeng == "0"){
      this.getBsRoleList()
      this.getChooseType();
    } 
    if (data.shengfeng != 1) return
    this.getAddressFN()
 
  },



  // 获取地址
  getAddressFN() {
    let that = this
    app.fg({
      action: 'GetRegionsOfProvinceCity'
    }).then(r => {
      if (r.data.Status == "OK") {
        that.setData({
          getAddress: r.data.province
        })
      } else app.fa("获取地址信息失败！")
      // console.log(r)
    })
  },
  // 选择团队长
  chooseTDZ(e) {
    let index = e.currentTarget.dataset.index
    let data = this.data
    data.teachTDZ[1].val = data.getZxtdz[index].RealName
    data.teachTDZ[1].id = data.getZxtdz[index].UserId
    data.teachTDZ[2].val = data.getZxtdz[index].CellPhone
    this.setData({
      teachTDZ: data.teachTDZ,
      show: false
    })
  },
  // 获取执行团队长列表
  getZxtdzFN() {
    let that = this
    // if(this.data.teachTDZ[1].val.length!=3) return app.fa("您还没选择区域")
    app.fl()
    app.fg({
      content: this.data.seach,
      action: 'GetTechnicianHeadsList',
      // regionName:that.data.getAddressId
      regionName: '',
    }).then(r => {
      app.fh()
      that.setData({ show: true });
      if (r.errMsg == "request:ok") {
        that.setData({
          getZxtdz: r.data.rows
        })
      }
    })
  },
  // 搜索字
  seaChFN(e) {
    this.setData({
      seach: e.detail.value
    })
  },

  // 获取门店分类
  getChooseType() {
    let data = this.data, that = this
    app.fl()
    app.fg({
      action: 'GetStoreTagList',
    }).then(r => {
      app.fh()
      if (r.data.Status == 'OK') {
        r.data.Data.forEach(c => {
          c.isChoose = false
        })
        that.setData({
          chooseType: r.data.Data
        })
      }
    })
  },

  // 选择门店分类
  chooseMdType(e) {
    let ev = e.currentTarget.dataset
    this.setData({
      [ev.name]: !ev.xz
    })
  },

  textAreaFN(e) {
    this.setData({
      textarea: e.detail.value
    })
  },
  grjjFN(e) {
    this.setData({
      grjj: e.detail.value
    })
  },
  // 上传logo
  uploadLogo(e) {
    // return console.log(e)
    let index = e.currentTarget.dataset.index
    let data = this.data
    let that = this
    wx.chooseImage({
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        let logo = []
        logo = logo.concat(res.tempFilePaths)
        logo: logo.length <= 5 ? logo : logo.slice(0, 1)
        let name = "storeList[" + index + "].val"
        app.fl("正在上传中...")
        this.uploadImgs(logo, 0, name).then(l => {
          if (l) {
            that.setData({
              ["storeList[" + index + "].isUpload"]: true
            })
          }
          app.fh()

        })
      }
    })
  },
  // 选择图片
  chooseImage(e) {
    wx.chooseImage({
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        const imageLoad = this.data.imageLoad.concat(res.tempFilePaths)
        this.setData({
          imageLoad: imageLoad.length <= 5 ? imageLoad : imageLoad.slice(0, 5)
        })
      }
    })
  },

  // 第一次注册我同意
  wtyFN() {
    if (this.data.totalTime > 0) return
    this.submitFN(2)
  },
  // 提交请求
  submitFN(ProtocolType) {

    let data = this.data, that = this

    app.fl('正在提交中...')
    let postD = {}
    switch (data.shengfeng) {
      case "0":
        let Latitude = parseFloat(data.Latitude)
        let Longitude = parseFloat(data.Longitude)
        if (data.storeList[2].val.length < 3 || !data.Latitude) return app.fa("请选择地址！")
        let add = '', Tag = ''
        for (let i = 0; i < data.storeList[2].val.length; i++) {
          if (i == 0) add = data.storeList[2].val[i]
          else add += ',' + data.storeList[2].val[i]
          // add+=data.storeList[2].val[i]
        }
        data.chooseType.forEach(c => {
          if (c.isChoose) {
            if (Tag) Tag += ',' + c.TagId
            else Tag = c.TagId
          }
        })
        if (!Tag) return app.fa('请至少选择一个门店分类')
        postD = {
          action: 'RoleRegister',
          openId: app.globalData.GetMembersInfo.openId,
          // openId:'oGsqu4kr4cw0lP0vIV5sTDoxa66k',
          Type: "ST",
          RequetReason: data.textarea,
          StoreName: data.storeList[1].val,
          RegionId: add,
          Address: data.storeList[3].val + data.storeList[4].val,
          StoreImages: data.storeList[0].isUpload ? data.storeList[0].val : '',
          Introduce: data.storeList[5].isUpload ? data.storeList[5].val : '',
          WxImage: data.storeList[6].isUpload ? data.storeList[6].val : '',
          Longitude: Longitude,
          Latitude: Latitude,
          ProtocolType: ProtocolType ? ProtocolType : 0,
          IsTest: 1,
          TagIds: Tag,
          BsUserId:data.BsRoleList.HeadUserId?data.BsRoleList.HeadUserId:''
        }
        break;
      case "1":
        if (!data.teachTDZ[0].val) return app.fa('请填写技师名称!')
        postD = {
          action: 'RoleRegister',
          openId: app.globalData.GetMembersInfo.openId,
          // openId:'oGsqu4kr4cw0lP0vIV5sTDoxa66k',
          Type: "TC",
          RequetReason: data.textarea,
          Introduce: data.grjj,
          TName: data.teachTDZ[0].val ? data.teachTDZ[0].val : '',
          HeadId: data.teachTDZ[1].id ? data.teachTDZ[1].id : '',
          ProtocolType: ProtocolType ? ProtocolType : 0,
          IsTest: 1,
        }
        break; 
      case "2":
        if (data.zxAddress.length < 3) return app.fa("请选择地址！")
        let zxadd = ''
        for (let i = 0; i < data.zxAddress.length; i++) {
          if (i == 0) zxadd = data.zxAddress[i]
          else zxadd += ',' + data.zxAddress[i]
        }
        app.fl()
        app.fg({
          action: 'RoleRegister',
          openId: app.globalData.GetMembersInfo.openId,
          Type: "TH",
          RequetReason: data.textarea,
          regionName: zxadd,
          ProtocolType: ProtocolType ? ProtocolType : 0,
        }).then(j => {
          app.fh()

          if (j.data.Status == "Yes") {
            that.setData({
              richtext: j.data.Message,
              showXY: true
            })


            let clock = setInterval(() => {
              data.totalTime--
              data.SMS = data.totalTime + 's'
              if (data.totalTime < 0) {
                clearInterval(clock)
                data.SMS = '同意'
                // data.totalTime = 6
              }
              that.setData({
                SMS: data.SMS,
                totalTime: data.totalTime,
              })
            }, 1000)


            return
          }

          app.fa(j.data.Message)
          setTimeout(() => {
            if (j.data.Status == "OK") {
              wx.switchTab({
                url: "/pages/mine/mine"
              });
            }
          }, 1500)

        })

        break;
      case "3":

        app.fg({
          action: 'RoleRegister',
          openId: app.globalData.GetMembersInfo.openId,
          Type: "BS",
          RequetReason: data.textarea,
          regionName: data.detailAdd,
          ProtocolType: ProtocolType ? ProtocolType : 0,
        }).then(j => {
          app.fh()

          if (j.data.Status == "Yes") {
            that.setData({
              richtext: j.data.Message,
              showXY: true
            })


            let clock = setInterval(() => {
              data.totalTime--
              data.SMS = data.totalTime + 's'
              if (data.totalTime < 0) {
                clearInterval(clock)
                data.SMS = '同意'
                // data.totalTime = 6
              }
              that.setData({
                SMS: data.SMS,
                totalTime: data.totalTime,
              })
            }, 1000)


            return
          }

          app.fa(j.data.Message)
          setTimeout(() => {
            if (j.data.Status == "OK") {
              wx.switchTab({
                url: "/pages/mine/mine"
              });
            }
          }, 1500)

        })
        break;
    }
    if (data.shengfeng == 3 || data.shengfeng == 2) return
    if (data.imageLoad.length == 0) return app.fa("至少上传一张图片！")
    this.uploadImgs(data.imageLoad, data.imageLoad.length - 1, "getImage").then(r => {
      if (r) {
        if (data.shengfeng == 0) postD.EnvironmentImages = data.getImage
        if (data.shengfeng == 1) {
          postD.WorksCase = data.getImage
        }

        app.fg(postD).then(j => {
          app.fh()
          if (j.data.Status == "Yes") {
            that.setData({
              richtext: j.data.Message,
              showXY: true
            })


            let clock = setInterval(() => {
              data.totalTime--
              data.SMS = data.totalTime + 's'
              if (data.totalTime < 0) {
                clearInterval(clock)
                data.SMS = '同意'
                // data.totalTime = 6
              }
              that.setData({
                SMS: data.SMS,
                totalTime: data.totalTime,
              })
            }, 1000)


            return
          }
          app.fa(j.data.Message)
          setTimeout(() => {
            if (j.data.Status == "OK") {
              wx.switchTab({
                url: "/pages/mine/mine"
              });
            }
          }, 1500)


        })
      }
    })
  },


  // 多图上传
  uploadImgs(images, num, name) {
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
            openId: app.globalData.GetMembersInfo.openId,
            // openId:"oGsqu4kr4cw0lP0vIV5sTDoxa66k",
            appid:app.globalData.appId,
          },
          success: res => {
            let datar = JSON.parse(res.data)
            if (datar.Status == "OK") {
              if (num == all) getImage = datar.Data[0].ImageUrl
              else getImage += ',' + datar.Data[0].ImageUrl
              num = num - 1
              upload(num)
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

  // 地址
  bindRegionChange(e) {//省市区选择结束
    let data = this.data
    this.setData({
      ["storeList[" + 2 + "].val"]: e.detail.value,
    })
    if (data.shengfeng != 1) return
    data.teachTDZ[1].val = e.detail.value
    for (let i = 0; i < data.getAddress.length; i++) {
      if (data.teachTDZ[1].val[0].indexOf(data.getAddress[i].name) != -1) {
        data.getAddressId = data.getAddress[i].id
        for (let j = 0; j < data.getAddress[i].city.length; j++) {
          if (data.teachTDZ[1].val[1].indexOf(data.getAddress[i].city[j].name) != -1) {
            data.getAddressId += ',' + data.getAddress[i].city[j].id
            for (let z = 0; z < data.getAddress[i].city[j].area.length; z++) {
              if (data.teachTDZ[1].val[2].indexOf(data.getAddress[i].city[j].area[z].name) != -1) {
                data.getAddressId += ',' + data.getAddress[i].city[j].area[z].id
              }
            }
          }
        }
      }
    }
    this.setData({
      ['teachTDZ[1].val']: e.detail.value,
      getAddressId: data.getAddressId
    })


  },
  // 地址
  bindRegion(e) {//省市区选择结束
    this.setData({
      zxAddress: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  detailAddFN(e) {
    this.setData({
      detailAdd: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    wx.getStorage({
      key: 'storeFujihang',
      success: res => {
        let data = JSON.parse(res.data)
        that.setData({
          ["storeList[" + 3 + "].val"]: data.name,
          Latitude: data.lat,
          Longitude: data.lng
        })
        // this.getData(options)
      }
    })

  },

  // 获取渠道
  getBsRoleList() {
    let data = this.data, that = this
    app.fl()
    app.fg({
      action: 'GetBsRoleList',
      openId: app.globalData.GetMembersInfo.openId,
      Search:data.seach
    }).then(r => {
      app.fh()
      if (r.data.Status == 'OK') {
        that.setData({
          BsRoleList:r.data
        })
      }else app.fa(r.data.Message)
      console.log(r)
    })
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
    app.fh()

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