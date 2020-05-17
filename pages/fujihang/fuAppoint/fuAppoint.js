
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    all:0,//选择多少项
    functionList:[
      { 
        // cid:38,
        // name:"身体护理",
        // subs:[
        //   {
        //     cid:355,
        //     name:"身体护理",
        //   }
        // ]
      }
      
    ],//导航条
    storeData:{},//门店信息
    active:0,
    isChoose:0,//选择的选项
    cartList:[],//选中的项目，拿去下单
    imgUrl:app.imgUrl,//
  },

  // 选择功能
  onChange(event) {
    let index=event.detail.index
    let ischoose=this.data.functionList[index].choose
    this.setData({
      active:index,
      isChoose:ischoose
    })
    this.getDataR()
    // console.log()
  },
  // 下拉加载
  getDataR(){
    let data=this.data
    if(!data.functionList[data.active].hasChild) return
    if(data.functionList[data.active].subs[data.isChoose].finish) return;
    app.fl()
    app.fg({
      action:'GetProducts',
      openId:app.globalData.GetMembersInfo.openId,
      cId:data.functionList[data.active].subs[data.isChoose].cid,
      Type:2,
      StoreId:data.storeData.StoreId,
      pageIndex:data.functionList[data.active].subs[data.isChoose].page,
      pageSize:10
    }).then(r=>{
      app.fh()
      if(r.data.Status=="OK"){
        let getdata=r.data.Data
        for(let i=0;i<getdata.length;i++){
          getdata[i].choose=false
          data.functionList[data.active].subs[data.isChoose].list.push(getdata[i])
        }
        if(getdata.length<10) data.functionList[data.active].subs[data.isChoose].finish=true
        data.functionList[data.active].subs[data.isChoose].page++
        this.setData({
          functionList:data.functionList
        })
      }else app.fa("获取数据失败！")
    })
   
  },
  // 选择分类
  chooseFN:function(e){
    let data=this.data
    let index=e.target.dataset.index
    data.functionList[data.active].choose=index
    this.setData({
      isChoose:index,
      functionList:data.functionList
    })
    this.getDataR()
  },

  // 选择项目
  ChangeXM(event){
    let index=event.target.dataset.index
    let data=this.data
    data.functionList[data.active].subs[data.isChoose].list[index].choose=!data.functionList[data.active].subs[data.isChoose].list[index].choose
    if(data.functionList[data.active].subs[data.isChoose].list[index].choose){
      data.cartList.push(data.functionList[data.active].subs[data.isChoose].list[index])
    }else{
      for(let i=0;i<data.cartList.length;i++){
        if(data.cartList[i].ProductId==data.functionList[data.active].subs[data.isChoose].list[index].ProductId){
          data.cartList.splice(i,1)
        }
      }
    }
    data.all=data.cartList.length
    this.setData({
      functionList:data.functionList,
      all:data.all
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    app.getOpenId(function(a) {
      app.fg({
        action: 'GetMembersInfo',
        openId: a
      }).then(r => {
        if (r.data.Status == "OK") {
          let dataR=r.data.Data
          dataR.openId=a
          app.setMembersInfo(dataR)
          // 获取门店信息
          app.fg({
            action:"GetStoreDetail",
            storeid:options.id,
            Latitude:app.globalData.Latitude,
            Longitude:app.globalData.Longitude
          }).then(r=>{
            if(r.data.Status=="OK"){
              let data=r.data
              data.EnvironmentImages=data.EnvironmentImages.split(",")[0]  
              that.setData({
                storeData:data
              })
              // 获取分类
              app.fl()
              app.fg({
                action:'GetAllCategories',
                Type:1
              }).then(r=>{
                if(r.data.Status=="OK"){
                  let data=r.data.Data
                  for(let i=0;i<data.length;i++){
                    data[i].choose=0
                    data[i].hasChild=true
                    if(!data[i].subs.length) data[i].hasChild=false
                    for(let c=0;c<data[i].subs.length;c++){
                      data[i].subs[c].page=1
                      data[i].subs[c].finish=false
                      data[i].subs[c].list=[]
                    }
                  }
                  that.setData({
                    functionList:data
                  })
                  that.getDataR()
                }else {
                  app.fh()
                  app.fa("获取数据失败！")
                }
              })
            }else app.fa("获取门店信息失败！")
          })
        
        
          
        } else {
          wx.redirectTo({
            url: "/pages/login/login"
          });
        }
      })
})

   

    
},


  // 组件回调
  compontpass(callback){
    
    let change=callback.detail
    let data=this.data
    console.log(data.isChoose)
    for(let i=0;i<data.functionList[data.active].subs[data.isChoose].list.length;i++){
      if(data.functionList[data.active].subs[data.isChoose].list[i].ProductId==change.ProductId){
        data.functionList[data.active].subs[data.isChoose].list[i].choose=!change.choose
      }
    }
    this.setData({
      functionList:data.functionList
    })
    console.log(data.functionList)
  },
  // 预约
  // 全额
  toBuy(e){
    if(!this.data.all) return app.fa("请先选择项目！")
    if(this.data.all>1) return app.fa("一次只能预约一个哦！")
    wx.navigateTo({
      url:'/pages/fujihang/fuPlace/fuPlace?cartList='+encodeURIComponent(JSON.stringify(this.data.cartList))+'&storeData='+encodeURIComponent(JSON.stringify(this.data.storeData))+'&pasreAll='+e.currentTarget.dataset.data
    })
  },

  // 去项目详情
  toProduct(e){
    let data=this.data
    let index=e.currentTarget.dataset.index
    let ProductId=data.functionList[data.active].subs[data.isChoose].list[index].ProductId
    // console.log(data.functionList[data.active].subs[data.isChoose].list[index])
    // '&addressid=' + this.data.nowAddress + "&userlatitude=" + this.data.Latitude + '&userlongitude=' + this.data.Longitude+
    // Latitude:app.globalData.Latitude,
    //         Longitude:app.globalData.Longitude
    
    let aaaa=[]
    this.data.storeData.isChoose=true
    aaaa.push(this.data.storeData)
    wx.navigateTo({
      url:'/pages/projectDetails/projectDetails?projectid='+ProductId+"&addressid="+app.globalData.address+'&userlatitude='+app.globalData.Latitude+'&userlongitude='+app.globalData.Longitude+'&storeData='+encodeURIComponent(JSON.stringify(aaaa)),
      // url:'/pages/projectDetails/projectDetails?projectid='+ProductId+"&addressid="+app.globalData.address+'&userlatitude='+app.globalData.Latitude+'&userlongitude='+app.globalData.Longitude+'&storeData='+JSON.stringify(data.storeData)
    })
    // console.log(e)
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