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
    functionList:[
      {
        name:"待审核",//导航条名
        data:[],//列表数据
        page:1,//加载页数
        finish:false,//是否加载完成
        post:0,//请求参数
      },
      {
        name:"已审核",//导航条名
        data:[],//列表数据
        page:1,//加载页数
        finish:false,//是否加载完成
        post:1,//请求参数
      },
      {
        name:"已拒绝",
        data:[],
        page:1,
        finish:false,
        post:2,//请求参数
      },
      // {
      //   name:"已完成",
      //   data:[],
      //   page:1,
      //   finish:false,
      //   post:5,//请求参数
      // },
     
    ],//功能导航条
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
    let type=this.data.type
    let functionList=this.data.functionList
    let active=this.data.active
    if(functionList[active].finish){
      return
    }
    app.fl()
    app.fg({
      action:'GetRoleRegisterList',
      openId:app.globalData.GetMembersInfo.openId,
      // openId:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',
      Type:type,
      Status:functionList[active].post,
      pageIndex:functionList[active].page,
      pageSize:10,
    }).then(r=>{
      setTimeout(()=>{
        app.fh()
      },1000)
      
      if(r.errMsg=="request:ok"){
        // fSF 0技师 1分校弟子 2门店
        if(type=="TH"){
          let data=r.data
          for(let i=0;i<data.rows.length;i++){
            data.rows[i].fSF=0
            functionList[active].data.push(data.rows[i])
          }
          if(data.rows.length<10){
            functionList[active].finish=true
          }
        }else{
          let data=r.data.Data.rows
          let data2=r.data.Data2.rows
          for(let i=0;i<data.length;i++){
            data[i].fSF=1
            functionList[active].data.push(data[i])
          }
          for(let i=0;i<data2.length;i++){
            data2[i].fSF=2
            functionList[active].data.push(data2[i])
          }
          if(data.length+data2.length<10){
            functionList[active].finish=true
          }
          
        }
        console.log(functionList[active].data)
        functionList[active].page++
          this.setData({
            functionList:functionList
          })  
        
      }else{
        app.fa('查询失败！')
      }
    })
  },

  // 跳转到审核
  toFN(e){
    
    let data=this.data
    if(data.active) return
    let index=e.currentTarget.dataset.index
    let toData=data.functionList[data.active].data[index]
    console.log(toData)
    wx.setStorage({
      key:"toData",
      data:JSON.stringify(toData)
    })
    wx.navigateTo({
      url: "/pages/identityVerification/identityVerification"
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if(!options.active)  options.active=0
    this.setData({
      type:options.type,
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
    
    this.getDataR()
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