// pages/fuMyOrder/fuMyOrder.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTop:['项目订单','商品订单'],//导航条
    type:"TH",// TH执行团队长查，BS聚到查
    isChoose:0,//被选择的导航条
    active: 0,//功能导航条的默认
    showStore:{
      show:false,
      data:[],
    },
    functionList:[
      {
        name:"未结束",//导航条名
        data:[],//列表数据
        page:1,//加载页数
        finish:false,//是否加载完成
        post:0,//请求参数
      },
      {
        name:"已结束",//导航条名
        data:[],//列表数据
        page:1,//加载页数
        finish:false,//是否加载完成
        post:1,//请求参数
      },
      // {
      //   name:"已拒绝",
      //   data:[],
      //   page:1,
      //   finish:false,
      //   post:2,//请求参数
      // },
      // {
      //   name:"已完成",
      //   data:[],
      //   page:1,
      //   finish:false,
      //   post:5,//请求参数
      // },
     
    ],//功能导航条
    zxz:0,//执行者
    activityId:0,
    typeOP:false,
    indexT:0,
  },

  // 选择导航条
  changeTop:function(event){
    let index=event.currentTarget.dataset.index
    this.setData({isChoose:index})
  },

  openChoose(e){
    let data=this.data
    let datar=e.currentTarget.dataset

    console.log(datar)

    if(datar.length==0) return
    let showStore={
      show:true,
      data:datar.data,
    }
    this.setData({
      showStore:showStore,
      activityId:datar.id?datar.id:'',
      typeOP:datar.type?true:'',
      indexT:datar.index||datar.index==0?datar.index:'',
    })
  },
  onClose(){
    let showStore={
      show:false
    }
    this.setData({
      showStore:showStore
    })
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
    let type=this.data.type
    let functionList=this.data.functionList
    let active=this.data.active,zxz=this.data.zxz
    if(functionList[active].finish){
      return
    }
    app.fl()
    app.fg({
      action:'GetTechniciaHeadActivitys',
      openId:app.globalData.GetMembersInfo.openId,
      // openId:'oGsqu4jy27K6q7I9HP4vnhTlh_cA',
      IsEnd:functionList[active].post,
      pageIndex:functionList[active].page,
      pageSize:10,
      IsExcutor:zxz==0?1:''
    }).then(r=>{
      setTimeout(()=>{
        app.fh()
      },1000)
      console.log(r)
      if(r.data.Status=="OK"){
        let datar=r.data.Data
        datar.forEach(c=>{
          let tnum=0;
          c.Technicians.forEach(t=>{
            if(t.inAct=="True") tnum++
          })
          c.tnum=tnum
         
          functionList[active].data.push(c)
        })
        
        if(datar.length<10) functionList[active].finish=true
        functionList[active].page++
        this.setData({
          functionList:functionList
        })
        console.log(this.data.functionList)
      }else{
        app.fa(r.data.Message)
      }
    })
  },

  //修改技师
  changeTea(e){
    if(!this.data.typeOP) return
    if(this.data.active) return
    let data=this.data,that=this,ts='',cc=e.currentTarget.dataset,num=0
    let cvArray=JSON.parse(JSON.stringify(data.showStore.data)) 
    cvArray[cc.index].inAct=(cc.inact=='False'?'True':'False')
    cvArray.forEach((c,i)=>{
      if(c.inAct=='True'){
        ts+=c.Id+','
        num++
      } 
    })
    ts=ts.slice(0,ts.length-1)
    app.fl()
    app.fg({
      action:'TechniciaHeadRequestActivity',
      openid:app.globalData.GetMembersInfo.openId,
      RequestType:2,
      ActivityId:data.activityId,
      Technicians:ts,
      IsExcutor:data.zxz==0?1:''
    }).then(r=>{
      app.fh() 
      if(r.data.Status=='OK'){
        data.functionList[0].data[data.indexT].tnum=num
        data.functionList[0].data[data.indexT].Technicians=cvArray
        that.setData({
          functionList:data.functionList,
          ['showStore.data']:cvArray,
        })
      }
      app.fa(r.data.Message,600)
    })
  },

  toDetail(e){
    let a=e.currentTarget.dataset
    if(!this.data.active){
      wx.navigateTo({
        url:'/fuPackageA/fuAchieveG/fuAchieveG?aid='+a.id+'&zxzOrtdz='+this.data.zxz
      })
      return
    } 


    wx.navigateTo({
      url:'/fuPackageA/fuActionDetOut/fuActionDetOut?id='+a.id+'&zxz='+this.data.zxz
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    this.setData({
      zxz:options.zxz?options.zxz:''
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
            that.getDataR()
          } else {
            wx.redirectTo({
              url: "/pages/login/login"
            });
          }
        })
      })
    }else{
      that.getDataR()
    
    } 

    
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