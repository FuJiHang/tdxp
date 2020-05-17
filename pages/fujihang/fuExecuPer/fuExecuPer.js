const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.imgUrl,
    price:[
      {
        name:'积分',
        mon:0,
        bg:'bg01',
        data:'Point',
      },
      {
        name:'累计业绩',
        mon:0,
        bg:'bg02',
        data:'OrdersTotal',
      },
      {
        name:'活动场数',
        mon:0,
        bg:'bg03',
        data:'ActivitysNum',
      },
    ],//皮肤管理（门店），技师，执行者
    type:0,
    store:["门店直开发","门店转介绍"],
    dataList:{},
    orderS:[],
    page:1,
    finsh:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let jd=[
      {
        name:'积分',
        mon:0,
        bg:'bg01',
        data:'Point',
      },
      {
        name:'累计业绩',
        mon:0,
        bg:'bg02',
        data:'OrdersTotal',
      },
      {
        name:'门店数',
        mon:0,
        bg:'bg03',
        data:'Point',
      },
    ]//渠道、
    let tdz=[
      {
        name:'累计业绩',
        mon:0,
        bg:'bg01',
        data:'OrdersTotal',
      },
      {
        name:'执行者人数',
        mon:0,
        bg:'bg02',
        data:'ExcutorsCount',
      },
      {
        name:'头疗师人数',
        mon:0,
        bg:'bg03',
        data:'TechniciansCount',
      },
     
    ]
    
    let data=this.data,that=this
    // options.type=4 //type:0执行者,1团队长,2技师,3渠道,4门店
    this.setData({
      price:options.type==1?tdz:options.type==3?jd:data.price,
      type:options.type?options.type:''
    })
    wx.setNavigationBarTitle({
      title: options.type==2?'头疗师':options.type==4?'店主'
      :options.type==1?'执行者团队长':options.type==3?'渠道':options.type==0?'执行者':''
    })
    
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
            that.getData()
          } else {
            wx.redirectTo({
              url: "/pages/login/login"
            });
          }
        })
      })
    }else {
      that.getData()
    } 
  

  },

  // 
  toFN(e){
    // if(this.data.type!=0) return app.ff()
    wx.navigateTo({
      url: e.currentTarget.dataset.url+'?type='+this.data.type
    })
  },
  
  // 
  openFN(e){
    
    let a=e.currentTarget.dataset,data=this.data
    if(data.type==2) return
    data.orderS.forEach((c,i)=>{
      if(i==a.index) c.openDet=!a.open
      else c.openDet=true
    })
  
    this.setData({
      orderS:data.orderS
    })
  },

  // 
  getData(){
  
    let that=this,data=this.data
    if(data.finsh) return
    app.fl()
    app.fg({
      action:'SalesGoalsList',
      // openid:'oGsqu4lwEf06UfdEEQ76C7i9uWPg', 
      // openid:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',//门店
      // openid:'oGsqu4vpTI-ZFHAGNYTeaTES1TRc', //聚到
      PageIndex:data.page,
      PageSize:10,
      openId:app.globalData.GetMembersInfo.openId,
      role:data.type

    }).then(r=>{
      // console.log(r)
      if(r.data.Status=="OK"){
        app.fh()
        let datar=r.data.splittin_get_response
        datar.Orders.forEach(c=>{
          if(c.OrderDate) {
            c.timeFJ=c.OrderDate.substring(0,10)
            c.OrderDate=c.OrderDate.substring(5,10)
          }
          c.openDet=(data.type!=2?true:false)
          if(c.OrderDetails){
            c.OrderDetails.forEach(s=>{
              if(s.OrdersDate) {
                s.timeFJ=s.OrdersDate.substring(0,10)
              }
            })
          }
          
          // else c.OrderDate=c.OrdersDate.substring(5,10)
          data.orderS.push(c)
        })
        // if(data.page >1)data.orderS=data.orderS.concat(datar.Orders)
        // else data.orderS=datar.Orders
        for(let i=0;i<data.price.length;i++){
          data.price[i].mon=datar[data.price[i].data]
        }
        if(datar.Orders.length<10) data.finsh=true
        data.page++
        that.setData({
          price:data.price,
          dataList:datar,
          page: data.page,
          finsh:data.finsh,
          orderS:data.orderS
        })
      }else app.fa(r.data.Message)
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
    this.getData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})