const app = getApp();
import { payOrder } from "../../utils/requestApi";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 50,
    navTop: ['次数卡订单', '自提订单'],//导航条
    isChoose: 0,//被选择的导航条
    active: 0,//功能导航条的默认
    functionList: [
      {
        name: "待成团",//导航条名
        // name: "已预约",//导航条名
        data: [],//列表数据
        page: 1,//加载页数
        finish: false,//是否加载完成
        post: 2,//请求参数
      },
      {
        name: "已成团",
        // name: "已核销",
        data: [],
        page: 1,
        finish: false,
        post: 5,//请求参数
      },
      {
        name: "成团失败",
        // name: "已完成",
        data: [],
        page: 1,
        finish: false,
        post: 4,//请求参数
      },
      {
        name: "售后订单",
        // name: "已完成",
        data: [],
        page: 1,
        finish: false,
        post: 6,//请求参数
      },
     
    ],//功能导航条
    functionList2: [
      {
        name: "待收货",//导航条名
        data: [],//列表数据
        page: 1,//加载页数
        finish: false,//是否加载完成
        post: 3,//请求参数
      },
      {
        name: "已收货",
        data: [],
        page: 1,
        finish: false,
        post: 5,//请求参数
      },
      {
        name: "已取消",
        data: [],
        page: 1,
        finish: false,
        post: 4,//请求参数
      },
    ],//功能导航条
  },

  // 选择导航条
  changeTop: function (event) {
    let index = event.currentTarget.dataset.index
    console.log("输出选中的导航栏",index);
    let jw = wx.getStorageSync('LatiLongitude');
    if(index==0){
      this.setData({ 
        isChoose: index,
        // functionList:[]
      })
      this.getDataR(jw)
    }else if(index==1){
      this.setData({ 
        isChoose: index,
        // functionList2:[]
      })
      this.getDataR(jw)
    }
  },


  // 选择功能
  onChange(event) {
    let index = event.detail.index;
    this.setData({
      active: event.detail.index
    })
    if (this.data.functionList[event.detail.index].finish) {
      return;
    }
    this.getDataR()
  },

  //获取数据 
  getDataR(jw) {
    let functionList = this.data.functionList
    let functionList2 = this.data.functionList2
    let active = this.data.active
    let isChoose = this.data.isChoose;//导航条索引值
    console.log("输出索引值",active);
    // if (functionList[active].finish) {
    //   app.fa()
    //   return
    // }
    if(isChoose==0){
      var str = true;
      var nums = '';
      var cCard = 2
    }else if(isChoose==1){
      var str = false;
      var nums = -2;
      var cCard = 0
    }
    // app.fl()
    app.fg({
      action: 'OrderList',
      openId: app.globalData.GetMembersInfo.openId,
      pageIndex: isChoose == 0 ? functionList[active].page : functionList2[active].page,
      pageSize: 10,
      ProductType: cCard,//订单类型（-1全部0商品订单2次数卡订单）
      status: isChoose == 0 ? functionList[active].post : functionList2[active].post,//订单状态(0所有订单1待付款2待发货3已发货4已取消5已完成)
      role:2,//角色（1客户2店家3执行团队长4技师）
      // Latitude:app.globalData.Latitude,
      // Longitude:app.globalData.Longitude,
      storeid:app.globalData.GetMembersInfo.StoreId,//	是	int	门店ID
      Latitude: wx.getStorageSync('LatiLongitude').Latitude,
      Longitude: wx.getStorageSync('LatiLongitude').Longitude,
      IsFightGroup:str,	//否	bool	是否拼团订单
      ShippingModeId:nums,	//否	int	-2自提
    }).then(r => {
      console.log("输出请求值",r);
      app.fh()
      if (r.data.Status == "OK") {
        let data = r.data.Data
        if(isChoose==0){
          for (let i = 0; i < data.length; i++) {
            functionList[active].data.push(data[i])
          }
          if (data.length < 10) {
            functionList[active].finish = true
            // app.fa()
          }
          functionList[active].page++
          this.setData({
            functionList: functionList
          })
        }else if(isChoose==1){
          for (let i = 0; i < data.length; i++) {
            functionList2[active].data.push(data[i])
          }
          if (data.length < 10) {
            functionList2[active].finish = true
            // app.fa()
          }
          functionList2[active].page++
          console.log("++++++++++++", functionList2);
          this.setData({
            functionList2: functionList2
          })
        }

      } else {
        app.fa(r.data.errMsg)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { aIndex } = options
    console.log("输跳转的值",aIndex);

    this.setData({
      // active: options.active,
      isChoose: aIndex?aIndex:0
    })
    
     



    
  },

  
  // 调起支付
  payFN(e){
    // return console.log(e)
    var _this = this,
      functionList = this.data.functionList,
      active = this.data.active;
    payOrder({
      orderId: e.currentTarget.dataset.oid,
      StoreId: app.globalData.GetMembersInfo.StoreId
    }).then(p=>{
      console.log("输出支付参数",p);
      if (p.data.Status == "Success") {
        var pay = p.data.Data
        wx.requestPayment({
          timeStamp: pay.timeStamp,
          nonceStr: pay.nonceStr,
          package: "prepay_id=" + pay.prepayId,
          signType: 'MD5',
          paySign: pay.sign,
          success(resfu) {
            if (resfu.errMsg == "requestPayment:ok") {
              app.fa('支付成功！')
              app.fg({
                action: 'BuyerPaid',
                openId: e,
                orderId: resfu.data.OrderId,
                shopType: 1,
              })
              
              functionList[active].page = 1
              functionList[active].finish = false
              functionList[active].data = []
              setTimeout(function () {
                _this.getDataR()
              }, 1450)

            } else app.fa('支付失败！')
          }
        })
      } else app.fa(p.data.Message)
    })
  },
  // 确认收货
  toConfirm: function(e) {
    var _this = this,
      id = e.currentTarget.dataset.id,
      functionList = this.data.functionList,
      functionList2 = this.data.functionList2,
      active = this.data.active,isChoose=this.data.isChoose
      
    app.fl()
    app.fg({
      action: 'FinishOrder',
      orderid: id,
      openid: _this.data.openId
    }).then(r => {
      app.fh()
      if (r.data.Status == "OK") {
        app.fa(r.data.Message)
        if(isChoose){
          functionList2[active].page = 1
          functionList2[active].finish=false
          functionList2[active].data = []
        }else{
          functionList[active].page = 1
          functionList[active].finish=false
          functionList[active].data = []
        }

        setTimeout(function() {
          _this.getDataR()
        }, 1500)
      } else {
        app.fa(r.data.Message)
      }
    })
  },


  // 
  




  // 
  openAppFN(e){

    // let oId=e.currentTarget.dataset.oId
    wx.navigateTo({
      url:'/fuPackageA/fuAfterSale/fuAfterSale?OrderId='+e.currentTarget.dataset.oid
    })
    // wxcc
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
    let jw = wx.getStorageSync('LatiLongitude');
    let that=this 

    this.data.functionList=[
      {
        name: "待成团",//导航条名
        // name: "已预约",//导航条名
        data: [],//列表数据
        page: 1,//加载页数
        finish: false,//是否加载完成
        post: 2,//请求参数
      },
      {
        name: "已成团",
        // name: "已核销",
        data: [],
        page: 1,
        finish: false,
        post: 5,//请求参数
      },
      {
        name: "成团失败",
        // name: "已完成",
        data: [],
        page: 1,
        finish: false,
        post: 4,//请求参数
      },
      {
        name: "售后订单",
        // name: "已完成",
        data: [],
        page: 1,
        finish: false,
        post: 6,//请求参数
      },
     
    ]
    this.data.functionList2= [
      {
        name: "待收货",//导航条名
        data: [],//列表数据
        page: 1,//加载页数
        finish: false,//是否加载完成
        post: 3,//请求参数
      },
      {
        name: "已收货",
        data: [],
        page: 1,
        finish: false,
        post: 5,//请求参数
      },
      {
        name: "已取消",
        data: [],
        page: 1,
        finish: false,
        post: 4,//请求参数
      },
    ]



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
            that.getDataR(jw);
          } else {
            wx.redirectTo({
              url: "/pages/login/login"
            });
          }
        })
      })
    }else this.getDataR(jw);
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

  }
})