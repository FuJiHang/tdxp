
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTop: ['抽奖会员列表', '中奖名单'],
    isChoose: 0,
    dataInfo: {},
    endTime: {},
    dingTime: '',
    isShow: 1,
    scrollId: 0,
    getPeoList: {
      data: [],
      finsh: false,
      page: 1,
    },
    getHisList: {
      data: [],
      finsh: false,
      page: 1,
    },
    isWait: false,//解决多次请求
    ActivityId: '',//活动id
    showGet: false,
    scrollTopP: 0,
    scrollTopH: 0,
    onePost: '',//定时器清除
    twoPost: '',
    threePost: '',
    isEnd:false,
  },

  onCloseP() {
    this.setData({
      showGet: false,

    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isEnd:options.isEnd?options.isEnd:'',
    })
    
    let that=this
    this.data.ActivityId = options.aid
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
            that.getData()
            that.data.threePost = setInterval(function () {
              that.data.getPeoList = {
                data: [],
                finsh: false,
                page: 1,
              }
              clearInterval(that.data.onePost)
              that.GetUserPointsFN()
            }, 5000)
            that.GetUserPointsFN()
          } else {
            wx.redirectTo({
              url: "/pages/login/login"
            });
          }
        })
      })
    } else {
      this.getData()

      this.data.threePost = setInterval(function () {
        that.data.getPeoList = {
          data: [],
          finsh: false,
          page: 1,
        }
        clearInterval(that.data.onePost)
        that.GetUserPointsFN()
      }, 5000)
      that.GetUserPointsFN()
    }

  },

  // 
  getData() {
    let data = this.data, that = this
    // app.fl()
    // app.fg({
    //   action: 'GetActivitylistByType',
    //   ActivityType: 7
    // }).then(r => {
    //   app.fh()

    //   if (r.data.Status == 'OK') {

    that.GetAwardListFN(data.ActivityId)
    app.fl()
    app.fg({
      action: 'GetActivityInfo',
      ActivityId: data.ActivityId
    }).then(r => {
      app.fh()
      if (r.data.Status == 'OK') {
        that.setData({
          dataInfo: r.data.Data,
        })
        data.isWait ? r.data.Data.LotteryList.forEach(c => {
          if (c.LotteryName == app.globalData.GetMembersInfo.NickName) {
            that.setData({
              showGet: true
            })
          }
        }) : ''
        if (that.countdown(r.data.Data.LotteryTime).overTime) {
          that.setData({
            isShow: 0,
          })
        }
        data.dingTime = setInterval(function () {
          that.setData({
            endTime: that.countdown(r.data.Data.LotteryTime)
          })
          if (data.endTime.limitSecond == '03' && data.endTime.limitHours == '00' && data.endTime.limitMin == '00' && !data.isWait) {
            data.isWait = true
            that.setData({
              isShow: 2,
            })
            setTimeout(function () {
              that.setData({
                isShow: 0,
              })
              that.getData()
            }, 3000)
          }
          if (that.countdown(r.data.Data.LotteryTime).overTime) clearInterval(data.dingTime)
        }, 90);
      } else app.fa(r.data.Messgae)
    })

    //   } else app.fa(r.data.Messgae)
    // })
  },


  countdown(date) {
    date ? date : date = '2020-5-30 14:30:00'
    var dateArr = date.split(' ');
    if (date.indexOf('T') != -1) dateArr = date.split('T');
    let dateArr2 = dateArr[0].split('-').map((item) => { return parseInt(item) });
    dateArr2[1] -= 1;
    let dateArr3 = dateArr[1].split(':').map((item) => { return parseInt(item) });
    let now = new Date();  // 当前系统时间
    let to = new Date(...dateArr2, ...dateArr3);  // 用户设定的时间
    let deltaTime = to - now;  // 时间差 (单位/毫秒ms)
    let limitHours, limitMin, limitSecond;
    let obj = null;
    //超时
    if (deltaTime <= 0) {
      return {
        limitHours: '00',
        limitMin: '00',
        limitSecond: '00',
        Millisecond: '00',
        overTime: true // 倒计时已过
      }
    }
    var time = deltaTime / 1000
    if (time > 0) {
      let day = parseInt(time / (60 * 60 * 24));
      let hou = parseInt(time % (60 * 60 * 24) / 3600);
      let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
      let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
      let ms = parseInt(((time * 1000) % 1000) / 100)
      obj = {
        day: day,
        hou: hou,
        min: min,
        sec: sec,
        ms: new Date(deltaTime).getMilliseconds()
      }
    }

    //计算天数
    let days = parseInt((deltaTime * 1000) / (24 * 3600))
    // 计算小时
    let hours = parseInt((deltaTime / 1000) % (60 * 60 * 24) / 3600)
    //计算分
    let minutes = parseInt(deltaTime / 1000 / 60 % 60);

    //获取还剩多少秒
    var seconds = parseInt(deltaTime / 1000 % 60);



    return {
      limitHours: hours < 10 ? '0' + hours : hours,
      limitMin: minutes < 10 ? '0' + minutes : minutes,
      limitSecond: seconds < 10 ? '0' + seconds : seconds,
      Millisecond: (deltaTime.toString().substring(deltaTime.toString().length - 2))[0],
      overTime: false
    }
  },


  ActivityDrawFN() {
    let data = this.data, that = this
    app.fl()
    app.fg({
      action: "ActivityDraw",

    }).then(r => {
      app.fh()
      if (r.data.Status == 'OK') {

      } else app.fa(r.data.Messgae)
    })
  },

  GetUserPointsFN() {
    let data = this.data, that = this
    if (data.getPeoList.finsh) return
    // app.fl()
    app.fg({
      action: 'GetUserPoints',
      openId: app.globalData.GetMembersInfo.openId,
      pageIndex: 1,
      pageSize: 10000000,
      TradeType: 15,
      ActivityId: data.ActivityId
    }).then(r => {
      // app.fh()
      r.data.userpoint_get_response.List.forEach(c => {
        let time = c.TradeDate.split(' ')[1].split(':')
        let timeEnd = c.TradeDate.split(' ')[0].split('-')
        c.TradeDate = time[0] + '时' + time[1] + '分'
        c.TradeDateEnd = timeEnd[1] + '月' + timeEnd[2] + '日'
        data.getPeoList.data.push(c)
      })
      var i = 0
      data.onePost = setInterval(() => {
        that.setData({
          scrollTopP: 'to' + i
        })
        i++
        if (i == data.getPeoList.data.length - 2) i = 0
      }, 1000)
      data.getPeoList.page++
      data.getPeoList.finsh = r.data.userpoint_get_response.length < 10000000
      that.setData({
        getPeoList: data.getPeoList
      })
    })
  },


  GetAwardListFN(id) {
    let data = this.data, that = this
    app.fl()
    app.fg({
      action: 'GetAwardList',
      openId: app.globalData.GetMembersInfo.openId,
      ActivityId: id,
      PageIndex: 1,
      PageSize: 10000000,
      IsALL: true,
    }).then(r => {
      app.fh()
      r.data.Models.forEach(c => {
        let time = c.CreateDate.split('T')[0].split('-')
        c.TradeDate = time[1] + '月' + time[2] + '日'
        c.TradeDateEnd=time[1] + '月' + time[2] + '日'
        data.getHisList.data.push(c)
      })
      var i = 0
      data.twoPost = setInterval(() => {
        that.setData({
          scrollTopH: 'to' + i
        })
        i++
        if (i == data.getHisList.data.length - 2) i = 0

      }, 1000)
      data.getHisList.page++
      data.getHisList.finsh = r.data.Models.length < 10000000
      that.setData({
        getHisList: data.getHisList
      })
    })
  },

  // 切换列表
  changeFN(e) {
    this.setData({
      isChoose: e.currentTarget.dataset.index
    })
  },


  // 立即参与
  joinFN() {
    let data = this.data, that = this
    app.fl()
    app.fg({
      action: "ActivityDraw",
      openId: app.globalData.GetMembersInfo.openId,
      ActivityId: data.ActivityId
    }).then(r => {
      app.fh()
      if (r.data.Status != 'NO') {
        that.setData({
          getPeoList: {
            data: [],
            finsh: false,
            page: 1,
          }
        })
        that.GetUserPointsFN()
      }
      app.fa(r.data.Message)
    })
  },

  toFN() {
    wx.navigateTo({
      url: '/fuPackageA/fuPrizeList/fuPrizeList'
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
    clearInterval(this.data.onePost)
    clearInterval(this.data.twoPost)
    clearInterval(this.data.threePost)
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