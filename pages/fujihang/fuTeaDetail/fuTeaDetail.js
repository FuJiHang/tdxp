

const app=getApp()
Page({

  /**
   * 页面的初始数据
   */

  data: {
    addOrsub:'+',
    openPic:false,//
    addPrice:[
      {
        name:'金额',
        val:'',
        plr:'点击左边的按钮切换加价减价',
      },
      {
        name:'申请理由',
        val:'',
        plr:'请输入申请理由',
      },
    ],
    showTime:false,//时间弹窗
    imgUrl:app.imgUrl,//
    orderData:{},//订单详细信息
    showCou:false,
    couponId:{
      id:0,
      pic:0,
    },//优惠券
    infoList:[
      {
        name:'姓名',
        val:'',
        data:'UserName',
      },
      {
        name:'手机号码',
        val:'',
        data:'UserTel',
      },
      // {
      //   name:'身份证号',
      //   val:'',
      //   data:'IdentityCard',
      // },
    ],//个人信息
    storeList:[
      {
        name:'门店名称',
        val:'',
        data:'StoreName',
      },
      {
        name:'门店地址',
        val:'',
        data:'Address',
      },
    ],//门店信息
    appointList:[
      {
        name:'芭比美甲装',
        money:'25.00',
        tea:'待分配技师',
        com:'广州市曙光整形医院',
        add:'广州市天河区天河北路曙光整形医院',
        code:'123659'
      },
      {
        name:'芭比美甲装',
        money:'25.00',
        tea:'待分配技师',
        com:'广州市曙光整形医院',
        add:'广州市天河区天河北路曙光整形医院',
        code:'123659'
      },
    ],//预约信息
    currentDate: new Date().getTime(),//默认时间
    chooseIndex:0,//选择修改的项目
  },
  changeType(){

    this.setData({
      addOrsub:this.data.addOrsub=="+"?'-':'+'
    })
  },
  openPicFn(){
    this.setData({
      openPic:true
    })
  },
  onClosePic(){
    this.setData({
      openPic:false
    })
  },
  bindpic(e){
    let index=e.currentTarget.dataset.index
    this.setData({
      ["addPrice["+index+"].val"]:e.detail.value
    })
  },
  okPriFN(){
    let data=this.data,that=this
    let addpricePD=parseFloat(data.addOrsub+data.addPrice[0].val)
    if( data.orderData.OrderTotal+addpricePD<200) return app.fa('不能低于200元')
    app.fl()
    app.fg({
      action:'TechnicianPromotePrice',
      orderid:data.orderData.OrderId,
      PromotePrice:addpricePD,
      PromoteReason:data.addPrice[1].val,
      // openId:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ'
      openId:app.globalData.GetMembersInfo.openId,
    }).then(r=>{
      that.setData({
        openPic:false,
      })
      app.fh()
      setTimeout(()=>{
        that.getData(data.orderData.OrderId)
      },1450)
      app.fa(r.data.Message)
    })
  },



  // 关闭时间弹窗
  onClose() {
    this.setData({ showTime: false });
  },
  // 选择时间
  onInput:function(event) {
    this.setData({
      currentDate: event.detail
    });
  },
  okTime(){
    let that=this 
    let data=this.data
    let product=data.orderData.LineItems[data.chooseIndex]
    product.SelectDate = product.SelectDate.substring(0,19);    
    product.SelectDate= product.SelectDate.replace(/-/g,'/'); 
    var timestamp =new Date(data.currentDate).getTime()-new Date(product.SelectDate).getTime()
    if(timestamp<60*60*1000*12) return app.fa("修改时间要大于上次预约时间的半天")
    app.fg({
      action:'EditProgramDate',
      orderid:data.orderData.OrderId,
      productid:product.SkuId,
      selectdate:app.fttst(data.currentDate)
    }).then(r=>{
      if(r.data.Status=="OK"){
        that.setData({
          showTime:false,
          ["orderData.LineItems["+data.chooseIndex+"].SelectDate"]:app.fttst(data.currentDate)
        })
      }
      app.fa(r.data.Message)
    })
    
  },

  // 退货
  errOrder(){
    let data=this.data

    data.orderData.OrderDate = data.orderData.OrderDate.substring(0,19);    
    data.orderData.OrderDate= data.orderData.OrderDate.replace(/-/g,'/'); 
    var timestamp =new Date().getTime()-new Date(data.orderData.OrderDate).getTime()
    if(timestamp<60*60*1000*12) return app.fa('退款要12小时后才能申请')
    
    wx.navigateTo({
      url:'/pages/ApplyRefund/ApplyRefund?orderid='+data.orderData.OrderId
    })
    return
    app.fl("正在申请...")
    app.fg({
      action:'CloseOrder',
      openId:app.globalData.GetMembersInfo.openId,
      orderId:data.orderData.OrderId
    }).then(r=>{
      app.fh()
      app.fa(r.data.Message)
      setTimeout(()=>{
        wx.navigateBack({delta: 1})
      },1450)
    })
  },

  // 评价
  pjFN(e){
    console.log(e)
    let index=e.currentTarget.dataset.index
    wx.navigateTo({
      url: "/pages/fujihang/fuEvaluate/fuEvaluate?orderData="+JSON.stringify(this.data.orderData)+"&index="+index
    });
  },
  // 支付
  payFN(){
    let data=this.data
    app.fg({
      action:'BuyerPaid',
      openId:app.globalData.GetMembersInfo.openId,
      orderId:data.orderData.OrderId
    }).then(r=>{
      console.log(r)
    })

    // let data=this.data
    // app.fl()
    // app.fg({
    //   action:'GetPayParam',
    //   openId:app.globalData.GetMembersInfo.openId,
    //   orderid:data.orderData.OrderId
    // }).then(p=>{
    //   if(p.data.Status=="OK"){
    //     var pay=p.data.Data
    //     wx.requestPayment({
    //       timeStamp: pay.timeStamp,
    //       nonceStr: pay.nonceStr,
    //       package: "prepay_id="+pay.prepayId,
    //       signType: 'MD5',
    //       paySign: pay.sign,
    //       success(res) {
    //         if(res.errMsg=="requestPayment:ok"){
    //           app.fg({
    //             action:'BuyerPaid',
    //             openId:app.globalData.GetMembersInfo.openId,
    //             orderId:data.orderData.OrderId
    //           })
    //           wx.navigateTo({
    //             url: "/pages/fujihang/fuPayState/fuPayState?money="+data.allPrice
    //           });
    //         }
    //       },
    //       fail(res) { 
    //       }
    //     })
    //   }else app.fa("支付失败！")
    // })
  },
  // 修改预约时间
  changeTime(e){
    let data=this.data
    let product=data.orderData.LineItems[e.currentTarget.dataset.index]
    product.SelectDate = product.SelectDate.substring(0,19);    
    product.SelectDate= product.SelectDate.replace(/-/g,'/'); 
    var timestamp =new Date().getTime()-new Date(product.SelectDate).getTime()
    if(timestamp<12*60*60*1000) return app.fa("修改预约时间要半天后")
    this.setData({
      chooseIndex:e.currentTarget.dataset.index,
      showTime:true  
    })
  },
  // 取消订单 
  canclFN(){
    let data=this.data
    app.fl("正在取消...")
    app.fg({
      orderId:data.orderData.OrderId,
      action:'CloseOrder',
      openId:app.globalData.GetMembersInfo.openId,
    }).then(r=>{
      app.fh()
      app.fa(r.data.Message)
      setTimeout(()=>{
        wx.navigateBack({delta: 1})
      },1450)
    })
  },
  //升单  
  upgradeFN(e){
    let data=this.data
    let product=data.orderData.LineItems[e.currentTarget.dataset.index]
    if(product.CanUpdate=="False") return app.fa('此项目未核销,不能升单')
    wx.showModal({
      title: '警告',
      content: '升单成功后当前订单将作废！',
      success(res) {
        if (res.confirm) {
         
          wx.setStorage({
            key:'upgrade',
            data:{
              orderId:data.orderData.OrderId,
              productId:product.SkuId,
              VerificationPassword:product.VerificationPassword
            }
          })
          wx.navigateTo({
            // url: "/pages/storeDetail/storeDetail?storeid="+data.orderData.StoreId
            url: "/pages/fujihang/fuStoreDet/fuStoreDet?id="+data.orderData.StoreId

          });
        } 
      }
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setStorage({
      key:"couponId",
      data:{
        id:0,
        pic:0,
      },
    })
    let data=this.data
    this.getData(options.id)

 
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
          } else {
            wx.redirectTo({
              url: "/pages/login/login"
            });
          }
        })
      })
    }
  },

  getData(options){
    let data=this.data
    app.fl()
    app.fg({
      action:'GetOrderDetail',
      // orderId:201905204208162,
      // type:0,
      orderId:options,
      type:0,
    }).then(r=>{
      console.log(r)
      app.fh()
      if(r.data.Status=="OK"){
        data.orderData=r.data.Data
        for(let i=0;i<data.infoList.length;i++){
          data.infoList[i].val=data.orderData[data.infoList[i].data]
        }
        for(let i=0;i<data.storeList.length;i++){
          data.storeList[i].val=data.orderData[data.storeList[i].data]
        }
        this.setData({
          infoList:data.infoList,
          orderData:data.orderData,
          storeList:data.storeList,
        })
        
      }else app.fa(r.data.Message)
    })
  },

  // 选择优惠券
  coupon(){
    let that=this
    wx.showModal({
      title: '警告',
      content: '一旦选择优惠券,用户将不能使用电子券', 
      success(res) {
        if (res.confirm) {
          wx.navigateTo({
            url:'/pages/fujihang/fuCoupon/fuCoupon?price='+that.data.orderData.OrderTotal+"&type=1"
          })
        }
      }
    })
  },
  // 优惠券
  couponOP(){
    this.setData({
      showCou:true,
    })
  },
  onCloseCou(){
    this.setData({
      showCou:false,
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
    let that=this
    wx.getStorage({
      key:'couponId',
      success:r=>{
        that.setData({
          couponId:r.data
        })
        if(r.data.pic==0) return
        that.fuCouRefter()
        // that.
      }
    })
  },

  // 选择优惠
  fuCouRefter(){
    let data=this.data,that=this
    app.fl()
    app.fg({
      action:'TechnicianUseCoupon',
      openid:app.globalData.GetMembersInfo.openId,
      OrderId:data.orderData.OrderId,
      ClaimCode:data.couponId.id
    }).then(r=>{
      app.fh()
      if(r.data.Status=="OK") that.getData(data.orderData.OrderId)
      else app.fa(r.data.Message)
    })
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