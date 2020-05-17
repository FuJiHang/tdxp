const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logo:'',
    imgUrl:app.imgUrl,
    ratio: 0.7, //屏幕比例
    getStore:{},
    img: 'https://tdh.hmeshop.cn/Storage/master/QRCode/StoreQRCode_50.png',
    mdImg:'',
    address:'',
    status:false,
    newAdd:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = this.data, that = this
    // wx.getStorage({
    //   key:'getStore',
    //   success:function(r){
    //     that.setData({
    //       getStore:r.data
    //     })
    //     console.log("个人资料",data.getStore);
    //   }
    // })
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
            let obj = wx.getStorageSync('getStore');
            // console.log("个人资料", obj);
            // console.log('地址', obj.RegionName.split('区')[0]);
            let newAdd = obj.RegionName.split('区')[0];
            that.setData({
              // mdImg: obj.StoreImages,//门店头像
              address: obj.RegionName + obj.Address,
              newAdd
            })
            that.getMdImg(obj.StoreImages)
            that.getCode(obj.StoreId);


          } else {
            wx.redirectTo({
              url: "/pages/login/login"
            });
          }
        })
      })
    }else{
      let obj = wx.getStorageSync('getStore');
      // console.log("个人资料", obj);
      // console.log('地址', obj.RegionName.split('区')[0]);
      let newAdd = obj.RegionName.split('区')[0];
      this.setData({
        // mdImg: obj.StoreImages,//门店头像
        address: obj.RegionName + obj.Address,
        newAdd
      })
      this.getMdImg(obj.StoreImages)
      this.getCode(obj.StoreId);
    
    }
   
  },

  // 获取后台返回的二维
  getCode(id) {
    wx.showLoading({
      title: '生成中~',
      mask: true,
    });
      
    let that = this;
    app.fl()
    app.fg({
      action: 'GetStoreQrCode',
      StoreId: id,
      ReferralUserId:app.globalData.GetMembersInfo.UserId,
    }).then(r => {
      console.log('请求二维码数据', r);
      app.fh()
      if (r.data.Status == 'Success') {
        //logo: 'https://tdh.hmeshop.cn/Storage/master/QRCode/StoreQRCode_50.png'
        let str = 'https://tdh.hmeshop.cn' + r.data.Message
        // console.log("输出完成的二维码链接", str);
        that.setData({
          logo: 'https://tdh.hmeshop.cn' + r.data.Message,
          status:true
        })
        that.getQrCode(str);
      }else{
        wx.showToast({
          title: r.data.Message,
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
    })
  },


  //获取门店头像
  getMdImg(img) {
    var that = this;
    console.log("能获取logo吗", that.data.logo);
    wx.downloadFile({
      url: img, //二维码路径
      success: function (res) {
        console.log("生成的二维码", res);
        wx.hideLoading();
        if (res.statusCode === 200) {
          var codeSrc = res.tempFilePath;
          that.setData({
            mdImg: codeSrc
          })
        } else {
          wx.showToast({
            title: '二维码下载失败！',
            icon: 'none',
            duration: 2000,
            success: function () {
              var codeSrc = "";
              // that.sharePosteCanvas(avaterSrc, codeSrc);
            }
          })
        }
      }
    })
  },
  /**
   * 下载二维码图片
   */
  getQrCode(img) {
    // wx.showLoading({
    //   title: '生成中...',
    //   mask: true,
    // });
    var that = this;
    console.log("能获取logo吗",that.data.logo);
    wx.downloadFile({
      url: img, //二维码路径
      success: function (res) {
        console.log("生成的二维码",res);
        wx.hideLoading();
        if (res.statusCode === 200) {
          var codeSrc = res.tempFilePath;
          that.creatCanvas(0.7, codeSrc, that.data.mdImg, that.data.address)
        } else {
          wx.showToast({
            title: '二维码下载失败！',
            icon: 'none',
            duration: 2000,
            success: function () {
              var codeSrc = "";
              // that.sharePosteCanvas(avaterSrc, codeSrc);
            }
          })
        }
      }
    })
  },
  // 创建画布
  creatCanvas(ratio, codeSrc,img2,add) {
    let data = this.data, that = this;
    // console.log("输出了吗1", img2);
    // console.log("输出了吗2", add);
    // console.log("输出了吗3", codeSrc);
    const ctx = wx.createCanvasContext('qrCanvas', this)
    ctx.setFillStyle('#fff')
    ctx.fillRect(0, 0, 320 * ratio, 480 * ratio)
    //头像
    ctx.drawImage(img2, 15 * ratio, 20 * ratio, 50 * ratio, 50 * ratio)

    // 用户信息
    ctx.save()
    ctx.beginPath()

    ctx.clip()

    ctx.restore()
    ctx.font = "normal lighter 11px arial,sans-serif"
    ctx.setFillStyle('#333')
    ctx.fillText(that.data.newAdd+'区头道惠养生坊', 73 * ratio, 33 * ratio)

    // this.drawText(ctx, "广东省广州市越秀区中山三路108号创举大厦8楼", 73 * ratio, 55 * ratio, 3, 240 * ratio)
    this.drawText(ctx, add, 73 * ratio, 55 * ratio, 3, 240 * ratio)

    // 二维码
    ctx.drawImage(codeSrc, 35 * ratio, 140 * ratio, 250 * ratio, 250 * ratio);


    // 扫码文字
    ctx.restore()
    ctx.setFillStyle('#999')
    ctx.setFontSize(13)
    ctx.fillText('长按识别图片中的二维码', 55 * ratio, 450 * ratio)
    ctx.draw(true);


    wx.hideLoading()
  },
  
  //文本换行 参数：1、canvas对象，2、文本 3、距离左侧的距离 4、距离顶部的距离 5、6、文本的宽度
  drawText: function (ctx, str, leftWidth, initHeight, titleHeight, canvasWidth) {
    var lineWidth = 0;
    var lastSubStrIndex = 0; //每次开始截取的字符串的索引
    for (let i = 0; i < str.length; i++) {
      lineWidth += ctx.measureText(str[i]).width;
      if (lineWidth > canvasWidth) {
        // ctx.font = "normal lighter 10px arial,sans-serif"
        ctx.setFillStyle('#999')
        ctx.fillText(str.substring(lastSubStrIndex, i), leftWidth, initHeight); //绘制截取部分
        initHeight += 16; //16为字体的高度
        lineWidth = 0;
        lastSubStrIndex = i;
        titleHeight += 9;
      }
      if (i == str.length - 1) { //绘制剩余部分
        ctx.font = "normal lighter 10px arial,sans-serif"
        ctx.setFillStyle('#999')
        ctx.fillText(str.substring(lastSubStrIndex, i + 1), leftWidth, initHeight);
      }
    }
    // 标题border-bottom 线距顶部距离
    titleHeight = titleHeight + 10;
    return titleHeight
  },
  

  savePoster() {
    var that = this;
    this.drawCanvas();//调用绘制函数
    // that.getQrCode();
    wx.showLoading({
      title: '努力生成中...'
    });
  },


  /**
  * 保存到相册
  */
  //点击保存到相册
  saveShareImg: function () {
    var that = this;
    wx.showLoading({
      title: '正在保存',
      mask: true,
    })
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'qrCanvas',
        success: function (res) {
          wx.hideLoading();
          var tempFilePath = res.tempFilePath;
          wx.saveImageToPhotosAlbum({
            filePath: tempFilePath,
            success(res) {
              wx.showModal({
                content: '图片已保存到相册，赶紧晒一下吧~',
                showCancel: false,
                confirmText: '好的',
                confirmColor: '#333',
                success: function (res) {
                  if (res.confirm) { }
                },
                fail: function (res) { }
              })
            },
            fail: function (res) {
              wx.showToast({
                title: res.errMsg,
                icon: 'none',
                duration: 2000
              })
            }
          })
        }
      });
    }, 1000);
  },

  

  
})