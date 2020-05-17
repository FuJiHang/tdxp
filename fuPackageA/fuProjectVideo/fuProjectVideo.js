const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTH: 0,
    start: 0,
    wH: 0,
    top: 0,
    sTop: 0,
    show: 0,
    list: 5,
    imgUrl: app.imgUrl,
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
        data: 'ArticleLikeCount',
        choose: true,
        chooseN: 'IsArticleLike',
      },
      {
        img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/icon_ping.png',
        val: 22,
        data: 'CommentCount',
      },
      {
        img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/icon_shou.png',
        img1: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/icon_shou_01.png',
        choose: true,
        chooseN: 'IsCollection',
      },
      {
        img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/icon_home.png',
        
      },
      {
        img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/icon_geren.png',
      },

    ],
    tuijian: {
      finsh: false,
      data: [],
      page: 1,
    },
    seach: "",//搜索

    CommentList: {
      data: [],
      finsh: false,
      page: 1,
    },//聊天信息
    commenT: {
      show: false,
      txt: '',
      aid: 0,
      cid: 0,
    },//回复弹窗
    focusfu: false,
    commenO: false,
    isComShow: false,
    quanOrBan: true,
    muted: false,//选音频播放的
    loop: false,//循环播放
    callBackL:[],//解决缓存的喜欢
    callBackC:[],//解决缓存的评价
    shareData:{},
    LatiLongitude:{},
    newJL:0,
  },

  // 
  ComShowFN() {
    let CommentList = {
      data: [],
      finsh: false,
      page: 1,
    }//聊天信息
    this.setData({
      isComShow: false,
      CommentList: CommentList
    })
  },

  // 
  finshFN(e) {
    let data = this.data, that = this
    this.setData({
      showTH: e.detail.current
    })
    data.funtion.forEach(c => {
      c.val = data.tuijian.data[data.showTH][c.data]
      c.choose = data.tuijian.data[data.showTH][c.chooseN]
    })
    that.setData({
      funtion: data.funtion,
    })
    if (data.showTH > data.tuijian.data.length - 4) {
      if (data.choose == 1) this.getListTH(false)
      else this.getListTH(true)
    }
  },

  // 去详情页购买
  toBuy(){
    
    wx.navigateTo({
      url: `/fuPackageA/fuProductT/fuProductT?prDid=`+this.data.tuijian.data[this.data.showTH].ProductId,
    })
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

    // let that=this
    // this.setData({
    //   loop:true
    // })
    // setTimeout(()=>{
    //   that.setData({
    //     loop:false
    //   })
    // },500)
  },

  // 






  sfun(e) {
    this.setData({
      start: e.changedTouches[0].clientY
    })
  },
  hfun(e) {
    let data = this.data, that = this
    this.setData({
      sTop: data.top
    })

    let mi = parseInt(data.top / data.wH)

    if ((e.changedTouches[0].clientY - this.data.start) < -200) {
      mi++
      if (mi >= (data.list - 1)) mi = data.list - 1
      this.toNext(mi * data.wH)
    } else if (200 > (e.changedTouches[0].clientY - this.data.start) && (e.changedTouches[0].clientY - this.data.start) > -200) {
      this.toNext(mi * data.wH)
    } else {
      mi = mi == 0 ? 0 : mi--
      this.toNext(mi * data.wH)
    }
    setTimeout(() => {
      data.funtion.forEach(c => {
        c.val = data.tuijian.data[mi][c.data]
        c.choose = data.tuijian.data[mi][c.chooseN]
      })
      that.setData({
        show: mi,
        funtion: data.funtion,
      })
    }, 200)
    if (data.show > data.tuijian.data.length - 4) {
      if (data.choose == 1) this.getListTH(false)
      else this.getListTH(true)
    }
  },
  playMusic(e) {
    wx.createAudioContext('myAudio').pause()
    wx.createAudioContext('myAudio').play()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

 
    let data = this.data, that = this
    this.setData({
      wH: wx.getSystemInfoSync().windowHeight,
      newJL:options.newJL?options.newJL:0
    })
    data.tuijian = {
      finsh: false,
      page: parseFloat(options.page),
      data: JSON.parse(decodeURIComponent(options.chuang))
    }
    data.funtion.forEach(c => {
      c.val = data.tuijian.data[0][c.data]
      c.choose = data.tuijian.data[0][c.chooseN]
    })
    that.setData({
      funtion: data.funtion,
    })
    this.setData({
      tuijian: data.tuijian,
      choose: parseFloat(options.choose)
    })
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
            wx.getStorage({
              key: 'LatiLongitude',
              success: function (res) {

                data.LatiLongitude = res.data

                if (options.choose == 0) that.getListTH(true)
                else that.getListTH(false)
                that.getShareImg()
              }
            })

          } else {
            wx.redirectTo({
              url: "/pages/login/login"
            });
          }
        })
      })
    } else {
      wx.getStorage({
        key: 'LatiLongitude',
        success: function (res) {

          data.LatiLongitude = res.data

          if (options.choose == 0) that.getListTH(true)
          else that.getListTH(false)
          that.getShareImg()
        }
      })
    }
    // 是否是点分享进来的
    if (options.isShare) {

      app.getOpenId(function (a) {
        app.fg({
          action: 'ShareSuccess',
          openId: a,
          Id: data.tuijian[0].Id,
          Type: 1,
        }).then(r => {

          console.log(r)
        })
      })
    }

  },

  // 
  getShareImg(){
    let data=this.data,that=this
    app.fl()
    app.fg({
      action:'GetShareConf',
      openId:app.globalData.GetMembersInfo.openId,
      regionid:data.regionid,
      Latitude: data.LatiLongitude.Latitude,
      Longitude:data.LatiLongitude.Longitude,
    }).then(r=>{
      app.fh() 
      if(r.data.Status=='OK'){
        data.shareData=r.data
      }else app.fa(r.data.Message)
      console.log(r) 
    })
  },


  // 
  getComment() {

    let data = this.data, that = this
    if (data.CommentList.finsh) return
    app.fl()
    app.fg({
      action: 'GetArticleComments',
      openId: app.globalData.GetMembersInfo.openId,
      //  openId:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',
      pageIndex: data.CommentList.page,
      pageSize: 10,
      SortBy: 'CommentDate',
      ArticleId: data.tuijian.data[data.showTH].Id,
    }).then(r => {
      app.fh()
      if (r.data.Status == 'OK') {
        r.data.Data.forEach(c => {
          c.CommentDate = c.CommentDate.slice(5, 10) + ' ' + c.CommentDate.slice(11, 16)
          c.CommentsList.forEach(s => {
            s.CommentDate = s.CommentDate.slice(5, 10) + ' ' + c.CommentDate.slice(11, 16)
          })
          data.CommentList.data.push(c)
        })
        if (r.data.Data.length < 10) data.CommentList.finsh = true
        data.CommentList.page++
        that.setData({
          CommentList: data.CommentList
        })
      }
    })
  },

  // 搜索字
  seaChFN(e) {
    this.setData({
      [e.currentTarget.dataset.name]: e.detail.value
    })
  },

  // 
  openFN() {
    let that = this
    this.setData({
      ['commenT.show']: true,
      commenO: true,
    })
    setTimeout(() => {
      that.setData({
        focusfu: true
      })

    }, 300)
  },
  // 
  commentOne(e) {
    let data = this.data, that = this
    data.commenT = {
      show: true,
      txt: '',
      aid: e.currentTarget.dataset.aid,
      cid: e.currentTarget.dataset.id,
    },//回复弹窗
      this.setData({
        commenT: data.commenT,
      })
    setTimeout(() => {
      that.setData({
        focusfu: true
      })

    }, 300)
  },
  onCloseP() {
    let data = this.data, that = this
    data.commenT = {
      show: false,
      txt: '',
      aid: 0,
      cid: 0,
    },//回复弹窗
      this.setData({
        commenT: data.commenT,
        commenO: false,
      })
  },
  // 
  openfutionFN(e) {
    let data = this.data, that = this
    switch (e.currentTarget.dataset.index) {
      case 0:
        app.fl()
        app.fg({
          action: 'GoodAndCollection',
          // openId:"oGsqu4qBG6Icub2iLYzI3MJGH4iQ",
          openId: app.globalData.GetMembersInfo.openId,
          ForID: data.tuijian.data[data.showTH].Id,
          RelationType: 3
        }).then(r => {
          app.fh()
          if (r.data.Status == 'OK') {
            data.tuijian.data[data.showTH].IsArticleLike = data.funtion[0].choose ? false : true
            data.funtion[0].choose = data.funtion[0].choose ? false : true
            data.tuijian.data[data.showTH].ArticleLikeCount == "999+" ? "999+" : (data.funtion[0].choose ? ++data.tuijian.data[data.showTH].ArticleLikeCount : --data.tuijian.data[data.showTH].ArticleLikeCount)
            data.funtion[0].val == "999+" ? "999+" : (data.funtion[0].choose ? ++data.funtion[0].val : --data.funtion[0].val)

            that.setData({
              tuijian: data.tuijian,
              funtion: data.funtion
            })
            // 解决缓存
            data.callBackL.push({
              id: data.tuijian.data[data.showTH].Id,
              IsArticleLike: data.tuijian.data[data.showTH].IsArticleLike,
              ArticleLikeCount: data.tuijian.data[data.showTH].ArticleLikeCount,
            })

          }
          app.fa(r.data.Message)
        })
        break;
      case 1:

        this.getComment()
        this.setData({
          isComShow: true
        })
        break;
      case 2:
        console.log('=-==========');
        this.onShareAppMessage()

        break;
      case 3:
        wx.switchTab({
          url:wx.getStorageSync('getStore')?'/pages/fujihang/fuIndexG/fuIndexG':'/pages/fujihang/fuIndexZB/fuIndexZB'
        })
        break;
        case 4:
            wx.navigateTo({
              // url:'/fuPackageA/fuJitterPeo/fuJitterPeo?UserId='+data.tuijian.data[data.show].UserId
              url: '/fuPackageA/fuJitterPeo/fuJitterPeo?UserId=' + data.tuijian.data[data.showTH].UserId
        
            })
          
        break;


    }
  },

  // 
  // 第一层回复
  submitComT() {
    let data = this.data, that = this

    app.fg({
      action: 'CheckContentSecurity',
      Type: 0,
      FormData: data.commenT.txt
    }).then(t => {
      if (t.data.Status != "OK") {
        app.fa(t.data.Message)
      } else {
        app.fl()
        app.fg({
          action: 'SendComment',
          // openId:"oGsqu4qBG6Icub2iLYzI3MJGH4iQ",//me
          // openId:"oGsqu4kr4cw0lP0vIV5sTDoxa66k",
          openId: app.globalData.GetMembersInfo.openId,
          ArticleID: data.commenO ? data.tuijian.data[data.showTH].Id : data.commenT.aid,
          Contents: data.commenT.txt,
          commentid: data.commenO ? '' : data.commenT.cid
        }).then(r => {
          app.fh()
          if (r.data.Status == 'OK') {
            that.onCloseP()
            let CommentList = {
              data: [],
              finsh: false,
              page: 1,
            }//聊天信息
            data.tuijian.data[data.showTH].CommentCount += 1
            that.setData({
              CommentList: CommentList,
              ['funtion[1].val']: ++data.funtion[1].val,
              tuijian: data.tuijian
            })
            setTimeout(() => {
              that.getComment()
            }, 1400)
            data.callBackC.push({
              Id:data.tuijian.data[data.showTH].Id,
              CommentCount:data.tuijian.data[data.showTH].CommentCount
            })
          }
          app.fa(r.data.Message)
        })
      }
    })


  },

  // // 朋友圈列表(推荐)
  getListTH(istuijian) {
    let data = this.data, that = this
    if (data.tuijian.finsh) return
    app.fl()
    app.fg({
      action: 'LoadAttention',
      // openId:"oGsqu4qBG6Icub2iLYzI3MJGH4iQ",
      openId: app.globalData.GetMembersInfo.openId,
      pageIndex: data.tuijian.page,
      pageSize: 10,
      SearchText: data.seach,
      IsRecommended: istuijian,
      limitDis:data.newJL,
      lat:data.newJL?data.LatiLongitude.Latitude:'',
      lng:data.newJL?data.LatiLongitude.Longitude:'',
    }).then(r => {
      app.fh()
      if (r.data.Status == 'OK') {
        let datar = r.data.Data, a = data.tuijian.data
        if (data.tuijian.page == 1) {
          data.funtion.forEach(c => {
            c.val = datar[0][c.data]
            c.choose = datar[0][c.chooseN]
          })
          this.setData({
            funtion: data.funtion,
          })
        }

        for (let i = 0; i < datar.length; i++) {
          if (datar[i].ArticleLikeCount > 999) datar[i].ArticleLikeCount = "999+"
          if (datar[i].ImageUrls.indexOf('.mp4') != -1) datar[i].isVideo = true
          a.push(datar[i])
        }
        this.setData({
          ['tuijian.data']: a,
          ['tuijian.finsh']: datar.length < 10 ? true : false,
          ['tuijian.page']: ++data.tuijian.page,
          funtion: data.funtion,
        })
        this.setData({
          list: data.tuijian.data.length
        })
      } else app.fa(r.data.Message)
    })
  },


  // 旋转
  toNext(mi) {
    this.setData({
      sTop: mi
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
  lFun(e) {
    this.setData({
      top: e.detail.scrollTop
    })
  },

  onPageScroll: function (e) {
    // this.setData({
    //   top:e.scrollTop
    // })
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
    let data=this.data
    wx.setStorage({
      key:'callBackL',
      data:data.callBackL
    })
    wx.setStorage({
      key:'callBackC',
      data:data.callBackC
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



    let data = this.data, that = this
    return {
      title: '头道惠',
      path: '/fuPackageA/fuJitter/fuJitter?chuang=' + encodeURIComponent(JSON.stringify(data.tuijian.data.slice(data.showTH, (data.tuijian.page * 10 - 1)))) + "&page=" + data.tuijian.page + "&choose=" + data.choose+'&isShare=true',
      imageUrl: data.shareData.ShareVideoImg,

      success: (res) => {
        app.fa('转发成功')
      },
      fail: (res) => {
        app.fa('转发失败')
      }
    }

  }
})