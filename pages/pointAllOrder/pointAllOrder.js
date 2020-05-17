// pages/pointAllOrder/pointAllOrder.js
const app = getApp();
import { toPay } from "../../utils/util"
import { payOrder } from "../../utils/requestApi";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 50,
    active: 0, //功能导航条的默认
    functionList: [
      {
        name:"全部订单",
        data:[],
        page:1,
        finish:false,
        post:0,//请求参数
      },
      {
        name: "待付款", //导航条名
        data: [], //列表数据
        page: 1, //加载页数
        finish: false, //是否加载完成
        post: 1, //请求参数
      },
      {
        name: "待发货", //导航条名
        data: [], //列表数据
        page: 1, //加载页数
        finish: false, //是否加载完成
        post: 2, //请求参数
      },
      {
        name: "已发货", //导航条名
        data: [], //列表数据
        page: 1, //加载页数
        finish: false, //是否加载完成
        post: 3, //请求参数
      },
      {
        name: "已完成",
        data: [],
        page: 1,
        finish: false,
        post: 5, //请求参数
      },
      {
        name: "已取消",
        data: [],
        page: 1,
        finish: false,
        post: 4, //请求参数
      },
      {
        name:"退款中",
        data:[],
        page:1,
        finish:false,
        post:6,//请求参数
      },
     
    ], //功能导航条
    openId: ''
  },

  // 确认收货
  toConfirm: function(e) {
    var _this = this,
      id = e.currentTarget.dataset.id,
      functionList = this.data.functionList,
      active = this.data.active;
    app.fl()
    app.fg({
      action: 'FinishOrder',
      orderid: id,
      openid: _this.data.openId
    }).then(r => {
      app.fh()
      if (r.data.Status == "OK") {
        app.fa(r.data.Message)
        functionList[active].page = 1
        functionList[active].finish=false
        functionList[active].data = []
        setTimeout(function() {
          _this.getDataR()
        }, 1500)
      } else {
        app.fa(r.data.Message)
      }
    })
  },

  // 选择功能
  onChange(event) {
    this.setData({
      active: event.detail.index,
      pageIndex: 1,
    })
    if (this.data.functionList[event.detail.index].finish) {
      return;
    }
    this.getDataR()
  },

  //获取数据 
  getDataR() {
    let functionList = this.data.functionList
    let active = this.data.active
    if (this.data.functionList[active].finish) {
      return;
    }
    app.fl()
    app.fg({
      action: 'OrderList',
      openId: this.data.openId,
      pageIndex: functionList[active].page,
      pageSize: 10,
      ProductType: -1,
      // storeid: 0,
      status: functionList[active].post
    }).then(r => {
      console.log("初始化数据",r);
      app.fh()
      if (r.data.Status == "OK") {
        let data = r.data.Data
        for (let i = 0; i < data.length; i++) {
          functionList[active].data.push(data[i])
        }
        if (data.length < 10) {
          functionList[active].finish = true
        }
        functionList[active].page++
          this.setData({
            functionList: functionList
          })
      } else {
        app.fa(r.data.errMsg)
      }
    })
  },

  // 跳转详情
  handleClick(e) {
    // console.log("点击跳转详情",e)
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/wuPackageB/wuorderDetail/wuorderDetail?id=${id}`,
      success: (result) => {
        
      },
      fail: () => {},
      complete: () => {}
    });
      
  },
  //查看物流
  toLogistics(e){
    // console.log("输出查看物流",e);
    const { id, items } = e.currentTarget.dataset;
    let obj = JSON.stringify(items)
    wx.navigateTo({
      url: `/wuPackageB/wuLogistics/wuLogistics?id=${id}&item=${obj}`,
      success: (result) => {
        console.log("跳转成功了吗", result);
      },
      fail: () => {},
      complete: () => {}
    });
      
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    var _this = this
    if (!options.active||options.active=='6') options.active = 0
    else options.active=parseInt(options.active)+1
    this.setData({
      active: options.active
    })
   
    // return;

  },
  // 
  coloseFN(e){
    let data=this.data,that=this
    app.fl("正在取消...")
    app.fg({
      orderId:e.currentTarget.dataset.oid,
      action:'CloseOrder',
      openId:app.globalData.GetMembersInfo.openId,
    }).then(r=>{
      app.fh()
      app.fa(r.data.Message)
      console.log(r)
      if(r.data.Status=="OK"){
        data.functionList[1]={
          name: "待付款", //导航条名
          data: [], //列表数据
          page: 1, //加载页数
          finish: false, //是否加载完成
          post: 1, //请求参数
        }
        that.setData({
          functionList:data.functionList
        })
        that.getDataR()
      }
    })
  },

  // 
  // 退货
  errOrder(e){
    wx.navigateTo({
      url:'/pages/ApplyRefund/ApplyRefund?orderid='+e.currentTarget.dataset.oid
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
      openId:app.globalData.GetMembersInfo.openId,
      StoreId: app.globalData.GetMembersInfo.StoreId,
      AppId: app.globalData.appId,
      AppSecret: app.globalData.secret,
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
      } else app.fa('支付失败！')
    })
    // app.fg({
    //   action:'GetPayParam',
    //   openId:app.globalData.GetMembersInfo.openId,
    //   orderId:e.currentTarget.dataset.oid
    // }).then(p=>{
    //   if(p.data.Status=="OK"){
    //     var pay=p.data.Data
    //     wx.requestPayment({
    //       timeStamp: pay.timeStamp,
    //       nonceStr: pay.nonceStr,
    //       package: "prepay_id="+pay.prepayId,
    //       signType: 'MD5',
    //       paySign: pay.sign,
    //       success(resfu) {
    //         if(resfu.errMsg=="requestPayment:ok"){
    //           app.fa('支付成功！')
    //           app.fg({
    //             action:'BuyerPaid',
    //             openId:e,
    //             orderId:resfu.data.OrderId,
    //             shopType:1,
    //           })
    //           functionList[active].page = 1
    //           functionList[active].finish=false
    //           functionList[active].data = []
    //           setTimeout(function() {
    //             _this.getDataR()
    //           }, 1450)
              
    //         }else app.fa('支付失败！')
    //       }
    //     })
    //   }else app.fa('支付失败！')
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  // 
  returnOrder(e){
    let data=this.data,that=this
    app.fl()
    app.fg({
      action:"MemberCancelRefundApply",
      OrderId:e.currentTarget.dataset.oid
    }).then(r=>{
      app.fh() 
      if(r.data.Status=='OK'){
        data.functionList[data.active].finish=false
        data.functionList[data.active].page=1
        data.functionList[data.active].data=[]
        setTimeout(()=>{
          that.getDataR()
        },1450)
        
       }
       app.fa(r.data.Message)
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let a=[
      {
        name:"全部订单",
        data:[],
        page:1,
        finish:false,
        post:0,//请求参数
      },
      {
        name: "待付款", //导航条名
        data: [], //列表数据
        page: 1, //加载页数
        finish: false, //是否加载完成
        post: 1, //请求参数
      },
      {
        name: "待发货", //导航条名
        data: [], //列表数据
        page: 1, //加载页数
        finish: false, //是否加载完成
        post: 2, //请求参数
      },
      {
        name: "已发货", //导航条名
        data: [], //列表数据
        page: 1, //加载页数
        finish: false, //是否加载完成
        post: 3, //请求参数
      },
      {
        name: "已完成",
        data: [],
        page: 1,
        finish: false,
        post: 5, //请求参数
      },
      {
        name: "已取消",
        data: [],
        page: 1,
        finish: false,
        post: 4, //请求参数
      },
      {
        name:"退款中",
        data:[],
        page:1,
        finish:false,
        post:6,//请求参数
      },
      
    ] //功能导航条
    this.setData({
      functionList:a
    })
    let that=this
    app.getOpenId(function(oId) {
      that.setData({
        openId: oId
      })
      that.getDataR();
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})