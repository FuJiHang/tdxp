const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.imgUrl,
    type:0,
    navTop:[
      {
        name:'日期筛选',
        icon:false,
      },
      {
        name:'金额排序',
        icon:false,
        num:0,
      }
    ],
    dataList:{},
    orderS:[],
    page:1,
    finsh:false,
    showTime:false,//时间弹窗
    currentDate: new Date().getTime(),//默认时间
    StartEnd:{
      bz:0,
      start:'',
      end:'',
    },
  },


  // 关闭时间弹窗
  onClose() {
    this.setData({ showTime: false });
  },
  // 选择时间
  onInput:function(event) {
    // console.log(event)
    this.setData({
      currentDate: event.detail
    });
  },
  okTime(){
    let StartEnd=this.data.StartEnd
    if(!StartEnd.bz) {
      app.fa('请选择结束时间')
      StartEnd.start=app.fttst(this.data.currentDate)
    }else{
      StartEnd.end=app.fttst(this.data.currentDate)
      this.setData({
        page:1,
        orderS:[],
        finsh:false,
      })
      this.getData()
    } 
    StartEnd.bz++
   
    this.setData({
      showTime:StartEnd.bz>1?false:true,
      StartEnd:StartEnd,
    })
  },

  chooseFN(e){
    let index=e.currentTarget.dataset.index
    let data=this.data,that=this
    switch(index){
      case 0:
          app.fa('请选择开始时间')
          setTimeout(()=>{
            that.setData({
              showTime:true,
              ["StartEnd.bz"]:0
            })
          },1450)
         
      break;
      case 1:
          if(data.navTop[1].num==0) data.navTop[1].icon=false
          else data.navTop[1].icon=data.navTop[1].icon?false:true
          if(data.navTop[1].num==2) data.navTop[1].num=0
          else data.navTop[1].num++
          this.setData({
            navTop: data.navTop,
            finsh:false,
            page:1,
            orderS:[],
          })
          this.getData()
      break;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type:options.type,
    })
    // options.type=4 //type:0执行者,1团队长,2技师,3渠道,4门店
    this.setData({
      type:options.type?options.type:''
    })
    wx.setNavigationBarTitle({
      title: options.type==2?'头疗师':options.type==4?'店主'
      :options.type==1?'执行者团队长':options.type==3?'渠道':options.type==0?'执行者':''
    })
    this.getData()
  },

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



  getData(){
    // options.type=4 //type:0执行者,1团队长,2技师,3渠道,4门店
    let that=this,data=this.data
    if(data.finsh) return
    app.fl()
    app.fg({
      action:'SalesGoalsList',
      //  openid:'oGsqu4lwEf06UfdEEQ76C7i9uWPg', 
      //  openid:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',//门店
      //  openid:'oGsqu4vpTI-ZFHAGNYTeaTES1TRc', //聚到
      PageIndex:data.page,
      role:data.type, 
      PageSize:10,
      openid:app.globalData.GetMembersInfo.openId,
      Sort:data.navTop[1].num,
      StartDate:data.StartEnd.start,
      EndDate:data.StartEnd.end,
    }).then(r=>{
      if(r.data.Status=="OK"){
        app.fh()
        // let datar=r.data.splittin_get_response
        // if(data.page >1)data.orderS=data.orderS.concat(datar.Orders)
        // else data.orderS=datar.Orders
        // if(datar.Orders.length<10) data.finsh=true
        // data.page++
        // that.setData({
        //   dataList:datar,
        //   page: data.page,
        //   finsh:data.finsh,
        //   orderS:data.orderS
        // })

        // 
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
        // for(let i=0;i<data.price.length;i++){
        //   data.price[i].mon=datar[data.price[i].data]
        // }
        if(datar.Orders.length<10) data.finsh=true
        data.page++
        that.setData({
          // price:data.price,
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})