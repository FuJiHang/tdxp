
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.imgUrl,//
    functionList: [
      {
        name: '未付款'
      },
      {
        name: '已付款'
      },
    ], //导航条
    active: 0,
    chooseList: [
    ], //左边选择项
    isChoose: 0, //选择的选项
    nowDate: '',
    params: {},
    status: 1, //订单状态
    orderList: [], //订单列表
    dataLength: 0,
    pageIndex: 1, //页码
    statusType: 0, //0技师1执行团队长
    loadfalse:false,//判断加载
    Keyword:'',
  },
  seaChFN(e){
    this.setData({
      Keyword:e.detail.value
    })
  },
  // 搜索
  seachZXT(){
    this.setData({
      orderList:[],
      pageIndex:1,
      loadfalse:false,
    })
    this.getOrderList(this.data.chooseList[this.data.isChoose].id)
  },

  // 分配技师
  allocation:function(e){
    let dataset=e.target.dataset
    wx.navigateTo({
      url: '/pages/fujihang/fuTeachList/fuTeachList?orderId='+this.data.orderList[dataset.id].OrderId+
      '&cardId='+this.data.orderList[dataset.id].LineItems[dataset.index].Id+
      "&SkuId="+this.data.orderList[dataset.id].LineItems[dataset.index].SkuId+
      "&StoreId="+this.data.orderList[dataset.id].LineItems[dataset.index].StoreId
    })
  },

  //滚动底部
  scroll: function(e) {
    if (this.data.dataLength === 10) {
      this.data.pageIndex++
        var id = this.data.chooseList[this.data.isChoose].id
      this.getOrderList(id)
    }
  },

  // 选择日期
  selectTime: function(e) {
    console.log(e)
    this.setData({
      nowDate: e.detail.value
    })
    var id = this.data.chooseList[this.data.isChoose].id
    this.data.orderList = []
    this.setData({
      orderList:[]
    })
    this.getOrderList(id)
  },

  // 选择功能
  onChange(e) {

    // return
    var index = e.detail.index,id;
    id = this.data.chooseList[this.data.isChoose].id
    let post=[[1,2],[2,3,5]]
    this.data.orderList = []
    this.setData({
      status: post[this.data.statusType][index],
      orderList:[],
      loadfalse:false,
    })
    
    this.getOrderList(id)
  },

  // 选择分类
  chooseFN: function(e) {
    var idx = e.target.dataset.index
    var id = this.data.chooseList[idx].id
    this.data.orderList = []
    this.getOrderList(id)
    this.setData({
      isChoose: e.target.dataset.index,
      orderList:[],
      loadfalse:false,
    })
  },

  // 获取门店信息
  getStoresInformation: function(params) {
    let dataf=this.data
    wx.request({
      url: getApp().gethsyurl,
      data: {
        action: 'Search',
        content: '',
        regionid:app.globalData.GetMembersInfo.CountyId,
        Latitude: params.Latitude,
        Longitude: params.Longitude,
        tag: 'store',
        pageindex: 1,
        pagesize: 1000,
        tcid:app.globalData.GetMembersInfo.UserId,
      },
      success: (res) => {
        if(res.data.Status=="NO") return app.fa(res.data.Message)
        var i, total = res.data.Total,
          key = [{name:'所有',id:''}],
          date;
        for (i = 0; i < total; i++) {
          var arr = {}
          arr.name = res.data.Models[i].StoreName
          arr.id = res.data.Models[i].StoreId
          key.push(arr)
        }
        date = res.data.NowTime.slice(0, 10)
        this.setData({
          chooseList: key,
          // nowDate: date
        })
        this.getOrderList(key[0].id)
      },
      fail: (e) => {
        console.log(e)
      }
    })
  },

  // 获取订单列表
  getOrderList: function(id) {
    var _this = this
    app.fl()
    wx.request({
      url: getApp().gethsyurl,
      data: {
        action: 'OrderList',
        openId: getApp().globalData.GetMembersInfo.openId,
        ProductType: 3, //-1全部0商品订单2项目订单3活动
        status: this.data.status, //2已预约5已完成
        role: 4, //1客户2店家3执行团队长4技师
        Latitude: this.data.params.Latitude,
        Longitude: this.data.params.Longitude,
        storeid: id, //门店ID
        date: this.data.nowDate, //预约时间
        pageindex: this.data.pageIndex,
        pagesize: 10,
        Keyword:_this.data.Keyword,
      },
      success: (res) => {
        app.fh()
        if (res.data.Status === 'OK') {
          _this.data.dataLength = res.data.Data.length
          _this.data.orderList = _this.data.orderList.concat(res.data.Data)
          this.setData({
            orderList: _this.data.orderList,
            loadfalse:true,
          })
          console.log(this.data.orderList)
        }
      },
      fail: (e) => {
        app.fh()
        console.log(e)
      }
    })
  },

  // 认领
  renlin(e){
    let zid=e.currentTarget.dataset,that=this
    console.log(zid)
    app.fl('正在认领...')
    app.fg({
      action:'ConfrimOrder',
      orderid:zid.oid,
      programid:zid.id,
      technicianid:app.globalData.GetMembersInfo.UserId,
      SkuId:zid.sid,
      openId:app.globalData.GetMembersInfo.openId,
      ConfirmType:1,
    }).then(r=>{
      console.log(r)
      app.fh()
      if(r.data.Status="OK"){
        setTimeout(()=>{
          var id = that.data.chooseList[that.data.isChoose].id
          that.data.orderList = []
          that.setData({
            orderList:[]
          })
          that.getOrderList(id)
        },1450)
        
      }
      app.fa(r.data.Message)
    })  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    

  
    // this.getStoresInformation(params)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      orderList:[]
    })
    let params,that=this

    if(app.globalData.GetMembersInfo==null){
      app.getOpenId(function(a) {
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
              success (res) {
                params={
                  Latitude:res.data.Latitude,
                  Longitude:res.data.Longitude
                }
                that.setData({
                  params:params
                })
                that.getStoresInformation(that.data.params)
              }
            })

          } else {
            wx.redirectTo({
              url: "/pages/login/login"
            });
          }
        })
      })

      return
    }

    wx.getStorage({
      key: 'LatiLongitude',
      success (res) {
        params={
          Latitude:res.data.Latitude,
          Longitude:res.data.Longitude
        }
        that.setData({
          params:params
        })
        that.getStoresInformation(that.data.params)
      }
    })


  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log(1)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})