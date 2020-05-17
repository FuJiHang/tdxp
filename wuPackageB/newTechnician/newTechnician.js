let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.newImg,
    img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/sade.jpg',
    list:[],//技师列表
    pIndex:1,
    isShow:false,
    finsh:false,
    storeid:'',
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
    this.data={
      imgUrl:app.newImg,
      img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/sade.jpg',
      list:[],//技师列表
      pIndex:1,
      isShow:false,
      finsh:false,
    }
    this.getData();
  },

  //获取初始化数据
  getData(){
    console.log("输出技师门店id2", app.globalData.GetMembersInfo.StoreId);
    
    let {pIndex} =  this.data,data=this.data,that=this
    if(data.finsh) return
    wx.request({
      url: app.data.url +'/api/StoreManage.ashx?action=GetTechniciansList',
      data: {
        StoreId:app.globalData.GetMembersInfo.StoreId ,//	是	int	门店Id
        pageIndex: pIndex,//	是	int	页码
        pageSize: 10,//	是	int	页大小
      },
      header: { Cookie: wx.getStorageSync('cookieFu') },
      success: (res) => {
        console.log("获取技师列表",res);
        if(res.data.Status=="OK"){
          res.data.Data.forEach(c=>{
            data.list.push(c)
          })
          this.setData({
            list:data.list,
            pIndex:++data.pIndex,
            finsh:res.data.Data.length<10,
          })
        }else{
          console.log("错误信息",res);
        }
      },
      fail: () => {},
      complete: () => {}
    });
      
    
  },
  //删除当前的技师
  handleDel(e){
    console.log("当前的技师",e);
    const { id } = e.currentTarget.dataset;
    wx.request({
      url: app.data.url+'/api/StoreManage.ashx?action=SetTechnicians',
      data: {
        IsSet:0,//	是	int	0删除，1添加，2更新
        Id:id,//	否	string	技师ID
        StoreId:this.data.storeid
      },
      header: { Cookie: wx.getStorageSync('cookieFu') },
      success: (res) => {
        console.log("删除状态",res);
        if(res.data.Status=="OK"){
          wx.showToast({
            title: res.data.Message,
            icon: 'none',
            duration: 1500,
            mask: true,
            success: (result) => {
              setTimeout(() => {
                this.setData({
                  list:[]
                })
                this.getData();
              }, 1000);
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

  //跳转技师添加
  handleClick(){
    wx.navigateTo({
      url: '/wuPackageB/addTechnician/addTechnician',
      success: (result) => {
        
      },
      fail: () => {},
      complete: () => {}
    });
  },
  //跳转编辑页面
  handleEdit(e){
    console.log("输出编辑数据",e);
    const { img, introduce, name,id,hid } = e.currentTarget.dataset;
    wx.navigateTo({//fuPackageA/fuTeachInfo/fuTeachInfo
      // url: `/wuPackageB/editTechnician/editTechnician?name=${name}&img=${img}&introduce=${introduce}&id=${id}`,
      url: `/fuPackageA/fuTeachInfo/fuTeachInfo?hid=${hid}&id=${id}`,
      success: (result) => {
        
      },
      fail: () => {},
      complete: () => {}
    });
      
  },

  //点击二维码按钮
  handleCode(e) {
    console.log(e);
    const { id,sid } = e.currentTarget.dataset;
    this.setCode(id,sid);
  },

  //生成店主绑定二维码
  setCode(num, sid) {
    let path = 'wuPackageB/kongTechnician/kongTechnician?authid=' + num
    // let path = 'pages/mine/mine?authid=' + num
    let data = {
      StoreId: sid || this.data.storeid, //	是	string	门店Id
      Path: path,  //	是	string	小程序路径，带参AuthId
      AppId:app.globalData.appId, //小程序appid
      AppSecrect:app.globalData.secret
    }
    wx.request({
      url: app.data.url + '/api/StoreManage.ashx?action=StoreCreateBindCode',
      data: data,
      dataType: 'json',
      header: { Cookie: wx.getStorageSync('cookieFu')},
      success: (res) => {
        console.log("输出店员生成二维码", res);
        if (res.data.Status == "OK") {
          let code = res.data.BindCode || res.data.BindCode.trim();//将字符串的前后空格去除
          console.log("能提取二维码",code);
          this.setData({
            codeImg: code,
            isShow: true,
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
          });
        }
      },
    });

  },
  //点击遮罩层隐藏
  handleHide() {
    this.setData({
      isShow: false
    })
  },
  //保存二维码到本地
  handleBC(e) {
    console.log("保存",e);
    var codeImg = e.currentTarget.dataset.code.trim()
    let imgSrc = this.data.codeImg;
    console.log("输出url", imgSrc);
    this.save(codeImg || imgSrc);
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
    console.log("监听用户下拉动作");
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})