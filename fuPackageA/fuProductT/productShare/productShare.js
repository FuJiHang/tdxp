// component/productShare.js
var baseImg = "https://img.hmeshop.cn/hmeshopV3/20190708/bg_pinzhi.png";
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    shareInfo: {
      type: Object,
      value: {}
    }, //画布数据
  },

  /**
   * 组件的初始数据
   */
  data: {
    ratio: 1, //屏幕比例
  },

  /**
   * 组件的方法列表
   */
  methods: {
    aawq(){
      console.log(1112222222211111111222222);
    },
    // 关闭蒙层
    closeMask(e) {
      console.log(11111111111222222);
      this.triggerEvent('closeEvent', {
        mode: e.target.dataset.mode
      });
    },
    // 防止滚动穿透
    disableScroll() { },
    // 创建画布
    creatCanvas(ratio) {
      const ctx = wx.createCanvasContext('qrCanvas', this),
        info = this.data.shareInfo;
      ctx.setFillStyle('#fff')
      ctx.fillRect(0, 0, 320 * ratio, 480 * ratio)
      // 顶部
      this.getImgPath(baseImg).then((res) => {
        ctx.drawImage(res.path, 0, 0, 320 * ratio, 27 * ratio);
        ctx.draw(true);
      })
      // 用户信息
      ctx.save()
      ctx.beginPath()
      ctx.arc(32 * ratio, 55 * ratio, 20 * ratio, 0, 2 * Math.PI, false)
      ctx.clip()
      this.getImgPath(info.Picture).then((res) => {
        ctx.drawImage(res.path, 12 * ratio, 35 * ratio, 40 * ratio, 40 * ratio);
        ctx.draw(true);
      })
      ctx.restore()
      ctx.font = "normal bold 13px arial,sans-serif"
      ctx.setFillStyle('#333')
      ctx.fillText(info.NickName, 62 * ratio, 50 * ratio)
      ctx.font = "normal lighter 11px arial,sans-serif"
      ctx.setFillStyle('#999')
      ctx.fillText('我有一份好东西要分享给你', 62 * ratio, 70 * ratio)
      // 商品图片
      this.getImgPath(info.ImageUrl1).then((res) => {
        ctx.drawImage(res.path, 16 * ratio, 90 * ratio, 288 * ratio, 248 * ratio);
        ctx.draw(true);
      })
      // 二维码
      this.getImgPath(info.MiniProgramCard).then((res) => {
        ctx.drawImage(res.path, 208 * ratio, 340 * ratio, 100 * ratio, 106 * ratio);
        ctx.draw(true);
      })
      // 扫码文字
      ctx.setFillStyle('#999')
      ctx.setFontSize(10)
      ctx.fillText('长按扫码进入', 230 * ratio, 470 * ratio)
      // 金额
      ctx.font = "normal bold 24px arial,sans-serif"
      ctx.setFillStyle('#ff4444')
      ctx.fillText('￥' + info.SalePrice, 16 * ratio, 420 * ratio)
      ctx.font = "normal lighter 12px arial,sans-serif"
      ctx.setFillStyle('#999')
      ctx.fillText('商城价：￥' + info.MarketPrice, 16 * ratio, 440 * ratio)
      // 商品名称
      ctx.setFillStyle('#333')
      let productName = "";
      for (let i = 0; i < info.ProductName.length; i++) {
        let letter = info.ProductName[i],
          productNameWidth = ctx.measureText(productName).width;
        if (productNameWidth > 120) {
          productName += "..."
          break
        } else {
          productName += letter
        }
      }
      ctx.fillText(productName, 16 * ratio, 460 * ratio)
      ctx.draw()
      wx.hideLoading()
    },
    // 获取图片临时路径
    getImgPath(img) {
      return new Promise((resolve, reject) => {
        wx.getImageInfo({
          src: img,
          success(res) {
            resolve(res)
          },
          fail(e) {
            reject(e)
          }
        })
      })
    },
    // 检查权限
    checkAuthority() {
      var _this = this
      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.writePhotosAlbum']) {
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success() {
                _this.saveImg();
              },
              fail() {
                _this.getAuthorityAgain();
              }
            })
          } else {
            _this.saveImg();
          }
        }
      })
    },
    // 保存图片
    saveImg() {
      wx.showLoading({
        title: '正在保存',
        icon: 'none'
      })
      let _this = this

      wx.canvasToTempFilePath({
        canvasId: 'qrCanvas',
        success(res) {
          console.log(res, '11111111111');
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(data) {
              console.log(data, '111112222111111');
              wx.showToast({
                title: '已保存到相册',
                icon: 'success',
                duration: 2000
              })
            },
            fail(err) {
              console.log(err);
              if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
                console.log("用户拒绝时再次发起授权")
                this.getAuthorityAgain();
              } else if (err.errMsg != "saveImageToPhotosAlbum:fail cancel") {
                wx.showToast({
                  title: '请截屏保存分享',
                  icon: 'success',
                  duration: 2000
                })
              }
            },
            complete(res) {
              var timer = setTimeout(() => {
                wx.hideLoading();
                clearTimeout(timer)
              }, 1500)
              console.log(res);
            }
          })




        },
        fail(e) {
          console.log(e,11111111111)
          setTimeout(() => {
            _this.saveImg()
          }, 1500)

        }
      }, _this)









    },
    // 再次获取权限
    getAuthorityAgain() {
      let _this = this;
      wx.showModal({
        title: '保存海报',
        content: '需要你提供保存相册权限',
        success: function (res) {
          if (res.confirm) {
            wx.openSetting({
              success(setData) {
                if (setData.authSetting['scope.writePhotosAlbum']) {
                  _this.saveImg()
                } else {
                  wx.hideLoading();
                  wx.showToast({
                    title: '获取相册权限失败',
                    icon: 'none'
                  })
                }
              }
            })
          } else {
            wx.hideLoading();
            wx.showToast({
              title: '保存海报需要提供相册授权',
              icon: 'none'
            })
          }
        }
      });
    },
    // 分享好友
    onShareAppMessage(res) {
      return {
        title: this.data.shareInfo.ProductName,
        path: '/pages/moduleHome/moduleHome',
        imageUrl: this.data.shareInfo.ImageUrl1
      }
    },
    // 生成图片
    createPngForCanvas(id) {
      let _this = this
      setTimeout(() => {
        return new Promise((resolve, reject) => {
          wx.canvasToTempFilePath({
            canvasId: id,
            success(res) {
              console.log(res, '1199');
              resolve(res)
            },
            fail(e) {
              console.log(e, '2vgvv');
              reject(e)
            }
          }, _this)
        })
      }, 500)
      console.log(id, 'qqqqqqqq');

    },
  },
  attached() {
    var _this = this
    wx.getSystemInfo({
      success(res) {
        var width = res.windowWidth,
          height = res.windowHeight,
          ratio = 1;
        if (width <= 320) {
          ratio = 0.7
        } else if (320 < width <= 380) {
          ratio = 0.8
        }
        _this.setData({
          ratio: ratio
        })
        wx.showLoading({
          title: '正在生成海报',
        })
        _this.creatCanvas(ratio)
      }
    })

  }
})