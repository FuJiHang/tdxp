let app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    navData: [{ name: '进行中' }, { name: '已下架' }],
    nums: 1,
    list: [
      // {
      //   logo:'抢',
      //   title:'限时抢购',
      //   test:'通过滚动转盘进行抽奖',
      //   time:'2019/11/17 22:12:09',
      //   status:true
      // },
    ],
    lists: [
      // {
      //   logo: '满',
      //   title: '满减活动',
      //   test: '引导好友一起购买',
      //   time: '2019/11/17 22:12:09',
      //   status: true
      // },
    ],
    storeid: '', //门店id
    cookie:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.referUser();
    this.setData({
      storeid: app.globalData.GetMembersInfo.StoreId
    })

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getData(this.data.storeid, 2)
  },
  // 获取个人信息
  referUser() {
    let that = this
    app.getOpenId(function (a) {
      app.fg({
        action: 'GetMembersInfo',
        openId: a
      }).then(r => {
        console.log("输出个人信息", r);
        if (r.data.Status == "OK") {
          let dataR = r.data.Data
          wx.setStorageSync('cookie', r.data.Cookie);
          that.setData({
            storeid: that.data.storeid || dataR.StoreId,
            cookie: r.data.Cookie
          })
        }
      })
    })
  },

  //获取初始化数据
  getData(id, num) {
    let that = this;
    wx.request({
      url: app.data.url + '/API/OrdersHandler.ashx?action=StoreInitActivity',
      data: {
        StoreId: id,
        IsOpen: num
      },
      header: {
        'content-type': 'application/json', // 默认值
        Cookie: wx.getStorageSync('cookieFu') || this.data.cookie
      },
      success: (res) => {
        console.log("输出活动列表", res);
        if (res.data.Status == "Success") {
          if (num == 1) {
            let list = res.data.List;
            list.forEach(i => {
              if (i.TypeId == 26) {
                i.logo = '团';
                i.title = '拼团活动'
                i.status = false
              }
            })
            that.setData({
              list: list
            })
          } else if (num == 2) {
            let data = res.data.List;
            data.forEach(v => {
              if (v.TypeId == 26) {
                v.logo = '团';
                v.title = '拼团活动'
                v.status = true
              }
            })
            that.setData({
              lists: data
            })
          }
        }else{
          console.log("输出错误",res);
        }
      },
      fail: () => { },
      complete: () => { }
    });

  },
  //活动上下架
  handleClick(e) {
    console.log(e);
    let { id, num, type } = e.currentTarget.dataset;
    this.setUpdata(id, num, type);
  },
  //点击上下架
  setUpdata(id, num, type) {
    console.log("活动上下架输出cookie", wx.getStorageSync('cookie'));
    wx.request({
      url: app.data.url + '/API/OrdersHandler.ashx?action=StoreOpentActivity',
      data: {
        StoreId: this.data.storeid,
        ActivityId: id,
        IsOpen: num,
        TypeId: type
      },
      header: {
        'content-type': 'application/json', // 默认值
        Cookie: wx.getStorageSync('cookieFu') || this.data.cookie
      },
      success: (res) => {
        console.log("输出上下架状态", res);
        if (res.data.Status == "Success") {
          if(num=="0"){
            wx.showToast({
              title: res.data.Message,
              icon: 'none',
              duration: 2000,
              mask: true,
              success: (result) => {
                
              },
              fail: () => { },
              complete: () => { }
            });
           this.setData({
              list:[]
           })
           this.getData(this.data.storeid, 1)
          }else if(num=="1"){
            wx.showToast({
              title: res.data.Message,
              icon: 'none',
              duration: 2000,
              mask: true,
              success: (result) => {
                
              },
              fail: () => { },
              complete: () => { }
            });
            this.setData({
              lists: []
            })
            this.getData(this.data.storeid, 2)
          }
        }else{
          wx.showToast({
            title: res.data.Message,
            icon: 'none',
            duration: 2000,
            mask: true,
          });
        }
      },
      fail: () => { },
      complete: () => { }
    });
  },

  //点击nav导航栏
  handleNav(e) {
    // console.log(e);
    const { index } = e.currentTarget.dataset;
    let storeid = this.data.storeid;
    if (index == 0) {
      this.setData({
        nums: index
      })
      this.getData(storeid, 1)
    } else if (index == 1) {
      this.setData({
        nums: index
      })
      this.getData(storeid, 2)
    }

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