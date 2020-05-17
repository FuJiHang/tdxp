const app=getApp()
import QQMapWX from '../../../libs/qqmap-wx-jssdk.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.imgUrl,
    functionList:[
     
    ],
    paiLie:true,//显示方式
    nowAddressId:'',//省市区id
    LatiLongitude:'',//用户的经纬
    seach:'',
    active:0,
    showC:true,
    fujihang:{},//经纬度
  },

  onCloseP(){
    this.setData({
      showC:false
    })
  },
  toProduct(e){
    let xx=e.currentTarget.dataset
    wx.navigateToMiniProgram({
      appId: 'wxa4d03cf8e1ea5904',
      path: 'pages/fujihang/fuIndexG/fuIndexG?id='+e.currentTarget.dataset.id,
      // envVersion:'develop',
      success:function(e){
        console.log(e)
      },fail:function(e){
        console.log(e)
      }
    })
    return
    this.getUserPoints(xx.store.StoreId,xx.id)
  

  },
  toStroe(e){
    console.log("输出点击的门店id",e);

      wx.navigateToMiniProgram({
        appId: 'wxa4d03cf8e1ea5904',
        path: 'pages/fujihang/fuIndexG/fuIndexG?id='+e.currentTarget.dataset.id,
        // envVersion:'develop',
        success:function(e){
          console.log(e)
        },fail:function(e){
          console.log(e)
        }
      })

    
    // wx.reLaunch({
    //   url: "/pages/fujihang/fuIndexG/fuIndexG?id="+e.currentTarget.dataset.id
    // });
  },
  toFFN(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.to
    });
  },
  // 
  ff(e){

    wx.navigateToMiniProgram({
      appId: 'wxa4d03cf8e1ea5904',
      path: '/fuPackageA/fuTeamList/fuTeamList?StoreId='+e.currentTarget.dataset.id,
      // envVersion:'develop',
      success:function(e){
        console.log(e)
      },fail:function(e){
        console.log(e)
      }
    })

    return
    wx.navigateTo({
      url:'/fuPackageA/fuTeamList/fuTeamList?StoreId='+e.currentTarget.dataset.id
    })
  },
  seaChFN(e){
    this.setData({
      seach:e.detail.value
    })
  },
  seachZXT(){
    let data=this.data
    data.functionList.forEach(c=>{
      c.data=[]
      c.page=1
      c.finsh=false
    })
    this.setData({
      functionList:data.functionList
    })
    this.getData()
  },
  // 选择功能
  onChange(event) {
    this.setData({
      active:event.detail.index
    })
    if(this.data.functionList[this.data.active].page!=1) return
    this.getData()
  },

  // 切换显示
  changePai(){
    let paiLie=this.data.paiLie
    this.setData({
      paiLie:!paiLie,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data=this.data,that=this
    wx.getStorage({
      key: 'nowAddressId',
      success (res) {
        that.setData({
          nowAddressId:res.data
        })
      }
    })
    wx.getStorage({
      key: 'LatiLongitude',
      success (res) {
        that.setData({
          LatiLongitude:res.data
        })
      }
    })
    setTimeout(()=>{
      that.getTas()
    },500)
  },

  // 获取
  getData(){
    let data=this.data,that=this
    if(data.functionList[data.active].finsh) return
    let shi=data.nowAddressId.split(',')
    app.fl()
    app.fg({
      action: 'Search',
      content: data.seach,
      // regionPath: data.nowAddressId,
      RegionId:shi[1],
      Latitude: data.LatiLongitude.Latitude,
      Longitude:  data.LatiLongitude.Longitude,
      tag: 'store',
      pageindex: data.functionList[data.active].page,
      pagesize: 10,
      StoreTagId:data.functionList[data.active].TagId
    }).then(r=>{
      app.fh()
      let datar=r.data.Models,pingjie=[]
      datar.forEach(c=>{
        c.ProductList.forEach(s=>{
          s.Description=s.Description.split(',')
        })
        c.EnvironmentImages=c.EnvironmentImages?c.EnvironmentImages.split(','):''
        console.log(c,'=======');
      })
      if(data.functionList[data.active].page==1) data.functionList[data.active].data=datar
      else data.functionList[data.active].data=data.functionList[data.active].data.concat(datar)
      if(datar.length<10)  data.functionList[data.active].finsh=true
      data.functionList[data.active].page++
      that.setData({
        functionList:data.functionList
      })
      
      

      
      console.log(r)
    })
  },

  getTas(){
    let data=this.data,that=this
    app.fl()
    app.fg({
      action: 'GetStoresTags',
    }).then(r=>{
      app.fh() 
      r.data.forEach(c=>{
        c.data=[]
        c.page=1
        c.finsh=false
        data.functionList.push(c)
      })
      that.setData({
        functionList:data.functionList
      })
     that.getData()
    })
  },


  getUserPoints(StoreId,pid) { //经纬度获取
    let that = this
    var qqmapsdk = new QQMapWX({
      key: '7V4BZ-4WFW4-L3LU6-XLRLM-ZZ7BJ-MBFAM' // 必填
    });
    var _this = this
    wx.getLocation({
      type: 'wgs84',
      fail: function () {
        wx.showModal({
          title: '提示',
          content: '请打开位置信息授权',
          success(res) {
            if (res.confirm) {
              wx.openSetting({})
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      },
      success: function (res) { //经纬度成功回调
        console.log("输出经纬度回调",res);
        let fujihang = {
          Latitude: res.latitude,
          Longitude: res.longitude
        }
       
        that.setData({
          fujihang:fujihang
        })
        wx.setStorage({
          key: 'LatiLongitude',
          data: fujihang
        })
        that.getStoreFN(StoreId,pid) 
      }
    })
  },

  // 设置全局变量
  getStoreFN(StoreId,pid){
    let data=this.data,that=this
    app.fl()
    app.fg({
      url:"/api/PublicHandler.ashx?action=GetBaseStoreInfo",
      data:{
        StoreId:StoreId,
        Lat:data.fujihang.Latitude,
        Lng:data.fujihang.Longitude,
      }
    },true).then(r=>{
      app.fh()
      if(r.data.Status=="Success"){
        r.data.Result.StoreId=StoreId
        that.setData({
          getStore:r.data.Result,
        })
        wx.setStorage({
          key:'getStore',
          data:r.data.Result
        })
        wx.navigateTo({
          url:'/fuPackageA/fuProductCou/fuProductCou?pId='+pid
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
    console.log("===========")
    this.getData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})