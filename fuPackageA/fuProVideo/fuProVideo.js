const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl2,
    navTop: [
      {
        name: '推荐'
      },
      {
        name: '关注'
      },
    ],
    funtion: [
      {
        img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/icon_zan.png',
        img1: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/icon_zan_01.png',
        val: 22,
        data: 'LikeCount',
        choose: false,
        chooseN: 'IsLike',
      },
      {
        img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/icon_ping.png',
        val: 22,
        data: 'ReviewCount',
      },
      {
        img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/icon_shou.png',
        img1: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/icon_shou_01.png',
        choose: false,
        chooseN: 'IsCollect',

      },
      {
        img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/icon_home.png',
      },
      {
        img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/icon_geren.png',
      },

    ],
    dataList: [],//现在视频
    quanOrBan: true,
    muted: false,//选音频播放的
    loop: false,//循环播放
    showTH: 0,
    tipList: [],//提示文字
    pid: 0,//商品id
    page: 1,//
    finsh: false,
    cto: [],
    listData: [],//评价列表
    pageP: 1,
    showAlert: false,
    finshP:false,
  },

  onCloseP() {
    this.setData({
      showAlert: false,
    })
  },

  // 
  finshFN(e) {
    let data = this.data, that = this
    if (data.dataList[e.detail.current].keepAlike) {

      for (var i = 0; i < data.cto.length; i++) {
        clearTimeout(data.cto[i]);
      }

      that.setData({
        tipList: [],
        showTH: e.detail.current

      })
      let ci = 0
      data.dataList[e.detail.current].BuyPeopleList.forEach((c, i) => {
        data.cto[i + 1] = setTimeout(() => {
          that.setData({
            ['tipList[0]']: ci,
            ['tipList[1]']: ci + 1,
          })
          ci += 2
        }, i * 3400)
      })
      data.cto[0] = setTimeout(() => {
        that.setData({
          tipList: []
        })
      }, (data.dataList[e.detail.current].BuyPeopleList.length / 2 + 0.5) * 3500)

      data.funtion.forEach(c => {
        c.val = data.dataList[data.showTH][c.data]
        c.choose = data.dataList[data.showTH][c.chooseN]
      })
      that.setData({
        funtion: data.funtion,
        dataList: data.dataList
      })

      return
    }



    app.fl()
    app.fg({
      url: '/AppShop/AppShopHandler.ashx?action=getProductDetail',
      data: {
        ProductID: data.dataList[e.detail.current].ProductId
      }
    }, true).then(r => {
      app.fh()
      that.setData({
        showTH: e.detail.current
      })
      if (r.data.Result) {
        r.data.Result.ProductId = data.dataList[e.detail.current].ProductId
        r.data.Result.keepAlike = true
        data.dataList.splice(e.detail.current, 1, r.data.Result)

        for (var i = 0; i < data.cto.length; i++) {
          clearTimeout(data.cto[i]);
        }

        that.setData({
          tipList: []
        })
        let ci = 0
        data.dataList[e.detail.current].BuyPeopleList.forEach((c, i) => {
          data.cto[i + 1] = setTimeout(() => {
            that.setData({
              ['tipList[0]']: ci,
              ['tipList[1]']: ci + 1,
            })
            ci += 2
          }, i * 3400)
        })
        data.cto[0] = setTimeout(() => {
          that.setData({
            tipList: []
          })
        }, (data.dataList[e.detail.current].BuyPeopleList.length / 2 + 0.5) * 3500)

        data.funtion.forEach(c => {
          c.val = data.dataList[data.showTH][c.data]
          c.choose = data.dataList[data.showTH][c.chooseN]
        })
        that.setData({
          funtion: data.funtion,
          dataList: data.dataList
        })
      }


    })






    if (data.showTH > data.dataList.length - 4) this.getData()
  },

  // 
  getVideo(e) {
    let cc = e.detail
    if (cc.height / cc.width > 1.6) {
      this.setData({
        quanOrBan: true
      })
    } else {
      this.setData({
        quanOrBan: false
      })
    }

  },

  // 结束播放
  bindtimeupdateFN(e) {

    let det = e.detail, that = this
    if (det.currentTime <= det.duration && det.currentTime + 0.25 >= det.duration) {
      this.setData({
        muted: false,
      })
      setTimeout(() => {
        that.setData({
          muted: true
        })
        wx.createAudioContext('myAudio').play()
      }, 10)
    }


  },

  // 








  playMusic(e) {
    wx.createAudioContext('myAudio').pause()
    wx.createAudioContext('myAudio').play()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let data = this.data, that = this
    data.pid = options.pid
    // 分享的
    if (options.data) {
      let r = {}
      r.data = JSON.parse(decodeURIComponent(options.data))
      this.firstData(r, options)
      return
    }


    wx.getStorage({
      key: 'productDataFu',
      success: function (r) {
        that.firstData(r, options)
      }
    })
  },


  // 首次拿取
  firstData(r, options) {
    let data = this.data, that = this
    r.data.ProductId = options.pid
    r.data.keepAlike = true
    data.dataList.push(r.data)
    data.funtion.forEach(c => {
      c.val = r.data[c.data]
      c.choose = r.data[c.chooseN]
    })

    let ci = 0
    r.data.BuyPeopleList.forEach((c, i) => {
      data.cto[i + 1] = setTimeout(() => {
        that.setData({
          ['tipList[0]']: ci,
          ['tipList[1]']: ci + 1,
        })
        ci += 2

      }, i * 3400)
    })
    data.cto[0] = setTimeout(() => {
      that.setData({
        tipList: []
      })
    }, (r.data.BuyPeopleList.length / 2 + 0.5) * 3500)
    that.setData({
      dataList: data.dataList,
      funtion: data.funtion
    })
    that.getData()
  },




  // 去详情页购买
  toBuy() {
    console.log(this.data.dataList[this.data.showTH]);
    console.log(this.data.dataList);

    wx.reLaunch({
      url: `/fuPackageA/fuProductT/fuProductT?prDid=` + this.data.dataList[this.data.showTH].ProductId,
    })
  },




  // 
  openfutionFN(e) {
    let data = this.data, that = this
    switch (e.currentTarget.dataset.index) {
      case 0:

        app.fg({
          url: '/API/MembersHandler.ashx?action=AddFavorite',
          data: {
            ProductId: data.dataList[data.showTH].ProductId,
            Type: 1,
          }
        }, true).then(r => {
          app.fh()
          if (r.data.Status == "Success") {
            if (r.data.Message == "点赞成功") {
              data.dataList[data.showTH].LikeCount += 1
              data.dataList[data.showTH].IsLike = true
              data.funtion[0].val = data.dataList[data.showTH].LikeCount < 999 ? data.dataList[data.showTH].LikeCount : '999+'

              data.funtion[0].choose = true
            } else {
              data.dataList[data.showTH].LikeCount -= 1
              data.funtion[0].val = data.dataList[data.showTH].LikeCount < 999 ? data.dataList[data.showTH].LikeCount : '999+'
              data.funtion[0].choose = false
              data.dataList[data.showTH].IsLike = false
            }
            that.setData({
              funtion: data.funtion
            })
          }
          app.fa(r.data.Message)
        })
        break;
      case 1:
        data.pageP=1,
        data.listData=[]
        data.finshP=false
        that.getPri()

        break;
      case 2:
        app.fg({
          url: '/API/MembersHandler.ashx?action=AddFavorite',
          data: {
            ProductId: data.dataList[data.showTH].ProductId,
            Type: 0,
          }
        }, true).then(r => {
          app.fh()
          if (r.data.Status == "Success") {
            if (r.data.Message == "收藏成功") {
              data.dataList[data.showTH].IsCollect = true
              data.funtion[2].choose = true
            } else {
              data.dataList[data.showTH].IsCollect = false
              data.funtion[2].choose = false
            }
            that.setData({
              funtion: data.funtion
            })
          }
          app.fa(r.data.Message)
        })
        break;
      case 3:
        wx.switchTab({
          url: wx.getStorageSync('getStore')?'/pages/fujihang/fuIndexG/fuIndexG':'/pages/fujihang/fuIndexZB/fuIndexZB'
        })
        break;
      case 4:
        wx.switchTab({
          url: '/pages/mine/mine'
        })
        break;
    }
  },


  // 获取数据
  getData() {
    let data = this.data, that = this
    if (data.finsh) return
    app.fl()
    app.fg({
      url: "/api/ProductHandler.ashx?action=GetProducts",
      data: {
        pageSize: 10,
        pageIndex: data.page,
        ProductType: 0,
      }
    }, true).then(r => {
      app.fh()
      if (r.data.Result.Status == "Success") {
        r.data.Result.Data.forEach(c => {
          if (c.ProductId != data.pid) data.dataList.push(c)
        })
        that.setData({
          finsh: r.data.Result.TotalRecords < 10 * data.page,
          dataList: data.dataList,
          page: ++data.page,

        })

      } else app.fa(r.data.Message)


    })
  },

  // 获取评价
  getPri() {
    let data = this.data, that = this
    if(data.finshP) return
    app.fl()
    app.fg({
      url: "/API/ReviewHandler.ashx?action=LoadReviewYinLiu",
      data: {
        PageSize: 10,
        pageIndex: data.pageP,
        ProductId: data.dataList[data.showTH].ProductId,
      }
    }, true).then(r => {
      app.fh()
      that.setData({
        showAlert: true
      })
      if (r.data.Result) {
        r.data.Result.Data.forEach(c => {
          data.listData.push(c)
        })
        that.setData({
          listData: data.listData,
          finshP:r.data.Result.Data.length<10,
          pageP:++data.pageP
        })
      }
    })
  },


  //立即拼团
  joinGroup: function (e) { 
    console.log("点击参团", e)
    let { id, isown, fightgroupid } = e.currentTarget.dataset;
    let { goodsInfo } = this.data.dataList[this.data.showTH];
    console.log("输出商品信息",goodsInfo);
    let skuss = goodsInfo.FightGroupSkuInfos[0].SkuId;
    console.log("输出sku", skuss);
    if (isown) {
      wx.showToast({
        icon: 'none',
        title: '不能参加自己的团'
      })
      return
    }
    wx.navigateTo({
      url: `/fuPackageA/fuOkOrder/fuOkOrder?fromPage=fightgroup&sku=${skuss}&buyAmount=1&groupId=${id}&FightGroupId=${fightgroupid}`,
    })
  },



  // splice(0,1,222)

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


  onPageScroll: function (e) {

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



    let data = this.data, that = this
    return {
      title: '头道惠',
      path: '/fuPackageA/fuProVideo/fuProVideo?data=' + encodeURIComponent(JSON.stringify(data.dataList[data.showTH])) + '&pid=' + data.dataList[data.showTH].ProductId,
      imageUrl: "",
      success: (res) => {
        app.fa('转发成功')
      },
      fail: (res) => {
        app.fa('转发失败')
      }
    }

  }
})