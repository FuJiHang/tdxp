// fuPackageA/fuUpper /fuUpper.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:0,
    functionList:[
      {
        name:'已上架',
        page:1,
        data:[],
        finsh:false,
        post:1,
      },
      {
        name:'已下架',
        page:1,
        data:[],
        finsh:false,
        post:2,
      },
    ],
    seach:'',
  },

  // 
  inputFN(e){
    console.log(e,2222222);
    this.setData({
      [e.currentTarget.dataset.name]:e.detail.value
    })
  },

  // 
  confirmFN(){
    let data=this.data,that=this
    data.functionList[data.active].data=[]
    data.functionList[data.active].page=1
    data.functionList[data.active].finsh=false
    this.getData()
  },

  // 
  onChange(e) {
    this.setData({
      active: e.detail.index
    })
    this.getData()
  },


  // 
  getData(){
    let data=this.data,that=this
    if(data.functionList[data.active].finsh) return
    app.fl()
    app.fg({
      url:"/api/ProductHandler.ashx?action=GetProducts",
      data:{
        pageSize:10,
        pageIndex:data.functionList[data.active].page,
        RsSaleStatus:data.functionList[data.active].post,
        RStoreId:app.globalData.GetMembersInfo.StoreId,
        openId:app.globalData.GetMembersInfo.openId,
        Keywords:data.seach||''
      }
    },true).then(r=>{
      app.fh() 
      if(r.data.Result.Status=="Success"){
          r.data.Result.Data.forEach(s=>{
            s.isChoose=false
            data.functionList[data.active].data.push(s)
          })
          data.functionList[data.active].page++
          data.functionList[data.active].finsh=r.data.Result.Data.length<10
          that.setData({
            functionList:data.functionList
          })
       }else app.fa(r.data.message)
      console.log(r) 
    })
  },

  // 
  chooseFN(e){
    this.setData({
      [e.currentTarget.dataset.name]:!e.currentTarget.dataset.choose
    })
  },

  // 
  subMitFN(){
    let data=this.data,that=this,idList=''
    data.functionList[data.active].data.forEach(s=>{
      s.isChoose?idList?idList+=','+s.ProductId:idList=s.ProductId:''
      
    })
    if(!idList) return app.fa('请勾选商品！')
    app.fl()
    app.fg({
      url:'/api/OrdersHandler.ashx?action=StoreSetOnProduct',
      data:{
        ProductId:idList,
        RStoreId:app.globalData.GetMembersInfo.StoreId,
        openId:app.globalData.GetMembersInfo.openId,
        SaleStatus:data.active?1:2
      }
    },true).then(r=>{
      app.fh() 
      if(r.data.Status=='Success'){
        let functionList=[
          {
            name:'已上架',
            page:1,
            data:[],
            finsh:false,
            post:1,
          },
          {
            name:'已下架',
            page:1,
            data:[],
            finsh:false,
            post:2,
          },
        ]
        that.setData({
          functionList:functionList
        })
        that.getData()
       }else app.fa(r.data.Message)
      console.log(r) 
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
 

    this.getData()
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