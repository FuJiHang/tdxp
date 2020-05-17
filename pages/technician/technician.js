// pages/fuMyOrder/fuMyOrder.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.imgUrl,
    navTop:['项目订单','商品订单'],//导航条
    isChoose:0,//被选择的导航条
    active: 0,//功能导航条的默认
    functionList:[
      {
        name:"待付款",//导航条名
        data:[],//列表数据
        page:1,//加载页数
        finish:false,//是否加载完成
        post:1,//请求参数
      },
      {
        name:"已预约",//导航条名
        data:[],//列表数据
        page:1,//加载页数
        finish:false,//是否加载完成
        post:2,//请求参数
      },
      {
        name:"已完成",
        data:[],
        page:1,
        finish:false,
        post:3,//请求参数
      },
      // {
      //   name:"已完成",
      //   data:[],
      //   page:1,
      //   finish:false,
      //   post:5,//请求参数
      // },
      {
        name:"已取消",
        data:[],
        page:1,
        finish:false,
        post:4,//请求参数
      },
      {
        name:"退款中",
        data:[],
        page:1,
        finish:false,
        post:6,//请求参数
      },
      

    ],//功能导航条

    navBar: [{
      name: '首页',
      img:'sySy.png?2',
      to:'/pages/fujihang/fuIndexG/fuIndexG',
    },
    {
      name: '商城',
      img: 'sySc.png',
      to:'/pages/fujihang/fuBeaStore/fuBeaStore',
    },
    {
      img: 'syAdd.png?2',
      to:'/fuPackageA/fuRelease/fuRelease'
    },
    {
      name: '我的预约',
      img:'syYy.png?2',
      to:'/pages/technician/technician',
    },
    {
      name: '我的',
      img:"syMy.png?2",
      to:'/pages/mine/mine',
    },
  ], //导航条
  xz:3,
  hiedTan:true,//弹窗关闭底部导航条
  },

  toggleToast(e){
    this.setData({
      hiedTan:e.detail
    })
    console.log(e)
  },
  // 跳转页面
  toFNavc(e){

    wx.switchTab({
      url: e.currentTarget.dataset.to
    });
    wx.navigateTo({
      url: e.currentTarget.dataset.to
    });
  },
  // 选择导航条
  changeTop:function(event){
    let index=event.currentTarget.dataset.index
    this.setData({isChoose:index})
  },


  // 选择功能
  onChange(event) {
    this.setData({
      active:event.detail.index
    })
    if(this.data.functionList[event.detail.index].finish){
      return;
    }
    this.getDataR()
  },

  //获取数据 
  getDataR(){
    let functionList=this.data.functionList
    let active=this.data.active
    if(functionList[active].finish){
      return
    }
    app.fl()
    app.fg({
      action:'OrderList',
      openId:app.globalData.GetMembersInfo.openId,
      pageIndex:functionList[active].page,
      pageSize:10,
      ProductType:2,
      status:functionList[active].post,
      Latitude:app.globalData.Latitude,
      Longitude:app.globalData.Longitude
    }).then(r=>{
      app.fh()
      if(r.data.Status=="OK"){
        let data=r.data.Data
        for(let i=0;i<data.length;i++){
          functionList[active].data.push(data[i])
        }
        if(data.length<10){
          functionList[active].finish=true
          // app.fa()
        }
        functionList[active].page++
        this.setData({
          functionList:functionList
        })

      }else{
        app.fa(r.data.Message)
      }
    })
  },

  // 跳转详情
  toFN(){
    console.log("ssssss")
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideTabBar({})
    
    if(!options.active)  options.active=0
    this.setData({
      active:options.active
    })
    
    // return;
    
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
    let data=this.data
    for(let i=0;i<data.functionList.length;i++){
      data.functionList[i].finish=false,
      data.functionList[i].page=1
      data.functionList[i].data=[]
    }
    let that=this
    if(!app.globalData.GetMembersInfo||!app.globalData.GetMembersInfo.openId) {
      app.getOpenId(function(a) {
        app.setMembersInfo({openId:a})
        that.getDataR();
      })
    }
    else     that.getDataR();
    // app.getOpenId(function(a) {
    //   app.fg({
    //     action: 'GetMembersInfo',
    //     openId: a
    //   }).then(r => {
    //     if (r.data.Status == "OK") {
    //       let dataR=r.data.Data
    //       dataR.openId=a
    //       app.setMembersInfo(dataR)
    //       that.getDataR();
    //     } else {
    //       wx.redirectTo({
    //         url: "/pages/login/login"
    //       });
    //     }
    //   })
    // })

    wx.removeStorage({
      key:'upgrade'
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