import QQMapWX from '../../utils/qqmap-wx-jssdk.min';
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: 113.324520,
    latitude: 23.099994,
    postLon:0,
    postLat:0,
    seach:'',
    toView:'id0',
    markers: [],
    circles:[],
    allShow:false,
    dataList:[],
    region: ['', '', ''],
    showSelect:false,
    addName:"",
    oldAddName:'',
  },

  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
    this.getTencentMap(e.detail.value[2])
  },

  toViewFN(e){
    let data=this.data
    data.markers.forEach((c,i)=>{
      c.callout.display='BYCLICK'
      if(e.currentTarget.dataset.index==i)  c.callout.display='ALWAYS'
    })

    this.setData({
      toView:'id'+e.currentTarget.dataset.index,
      longitude: data.markers[e.currentTarget.dataset.index].longitude,
      latitude: data.markers[e.currentTarget.dataset.index].latitude,
      markers:data.markers
      
    })
  },
  onLoad(e){
    let that=this
    this.setData({
      // ['region[2]']:e.city
      oldAddName:e.city,
      addName:e.city,
    })
    wx.getLocation({
      success: function(res) {
        that.setData({
          postLat:res.latitude,
          postLon:res.longitude
        })
        that.getData()
      },
    })
  },

  seaChFN(){
    this.setData({
      seeSeach:true
    })
  },
  seachZXT(){
    this.setData({
      seeSeach:false
    })
    this.getData()
  },

  // 触发点击地图
  DingWeiFN(e){
    console.log(e,'=======');
    let a={
      longitude:e.detail.longitude,
      latitude:e.detail.latitude,
      radius:40,
      fillColor:'#ff0000',
    }
    
    this.setData({
      longitude:e.detail.longitude,
      latitude:e.detail.latitude,
      postLat:e.detail.latitude,
      postLon:e.detail.longitude,
      ['circles[0]']:a,
    })
    this.getData()
  },


  // 
  getData(e){
    let seach=e?e.detail.value:""
    let data=this.data,that=this
    app.fl()
    app.fg({
      url:'/AppShop/AppShopHandler.ashx?action=GetStoreList',
      data:{
        pageIndex:1,
        pageSize:1000,
        Type:1,
        Lan:data.postLat,
        Lng:data.postLon,
        SearchKey:seach
      }
    },true).then(r=>{
      
      app.fh() 
      data.markers=[]
      data.dataList=[]
      r.data.Result.StoreList.forEach((c,i)=>{
        if(c.Distance.indexOf('km') != -1){
          c.add = c.Distance.replace('km','千米')
        }else if(c.Distance.indexOf('m') != -1){
          c.add = c.Distance.replace('m','米')
        }
        // if (c.Distance.indexOf('km') != -1) c.add = c.Distance.replace('km', '千米')
        // else if (c.Distance.indexOf('m') != -1) c.add = c.Distance.replace('m', '米')
        let obj={
          iconPath: c.StoreImages,
          id: i,
          latitude:c.Position.Latitude,
          longitude:c.Position.Longitude,
          width: 20,
          height: 20,
          callout: {
            content: c.StoreName+">",
            color: "#666",
            bgColor:"#fff",
            padding:5,
            borderRadius:5,
            display:i==0?'ALWAYS':'BYCLICK'
          }
        }
        data.markers.push(obj)
        data.dataList.push(c)
      })
      console.log("地图中获取门店",r.data.Result.StoreList);
      this.setData({
        longitude: r.data.Result.StoreList.length?r.data.Result.StoreList[0].Position.Longitude:data.longitude,
        latitude:r.data.Result.StoreList.length?r.data.Result.StoreList[0].Position.Latitude:data.latitude,
        markers:data.markers,
        dataList:data.dataList,
      })
    })
  },

  //调取腾讯地图
  getTencentMap(address) {
    let that=this,data=this.data
      var qqmapsdk = new QQMapWX({
        key: '7V4BZ-4WFW4-L3LU6-XLRLM-ZZ7BJ-MBFAM' // 必填
      });
      qqmapsdk.geocoder({
        address:address,
        success: function (res) {
          console.log(res,'===========');
          that.setData({
            postLat:res.result.location.lat,
            postLon:res.result.location.lng,
            longitude: res.result.location.lng,
            latitude: res.result.location.lat,
          })
          that.getData()
        },
        fail:function(e){
          console.log(e,'22222222');
        }
      })
  },


  allShowFN(){
    let a=this.data.allShow
    this.setData({
      allShow:!a
    })
  },
  markertap(e) {
    let data = this.data
    data.markers.forEach((c,i)=>{
      c.callout.display='BYCLICK'
      if(e.markerId==i)  c.callout.display='ALWAYS'
    })
    this.setData({
      toView:'id'+e.markerId,
      markers:data.markers,
      longitude: data.markers[e.markerId].longitude,
      latitude: data.markers[e.markerId].latitude,
    })
  },

  toFN(e){
    let aa=e.currentTarget.dataset.sid?e.currentTarget.dataset.sid:this.data.dataList[e.markerId].StoreId
    wx.navigateToMiniProgram({
      appId: 'wxa4d03cf8e1ea5904',
      path: 'pages/fujihang/fuIndexG/fuIndexG?id='+aa,
      // envVersion:'develop',
      success:function(e){
        console.log(e)
      },fail:function(e){
        console.log(e)
      }
    })
    return
   
    wx.reLaunch({

      url:'/pages/fujihang/fuIndexG/fuIndexG?id='+aa
    })
  },

  // 
  chooseFN(e){
    let datar=e.currentTarget.dataset,data=this.data
    data.markers.forEach((c,i)=>{
      c.callout.display='BYCLICK'
      if(datar.index==i)  c.callout.display='ALWAYS'
    })

    this.setData({
      toView:'id'+datar.index,
      markers:data.markers,
      longitude: datar.data.Position.Longitude,
      latitude: datar.data.Position.Latitude ,
      seeSeach:false,
    })
  },

  // 选择省市区
  onSelectRegion: function (e) {
    console.log(e,'2222222');
    let that=this
    this.setData({
      showSelect:!e.detail.iscancel,
    })
    if(!e.detail.iscancel&&e.detail.address&&e.detail.address.city.name!='请选择'){
       let address=e.detail.address
      this.getTencentMap(address.area.name!='请选择'?address.area.name:address.city.name!='请选择'?address.city.name:address.province.name)
      this.setData({
        showSelect:false,
        addName:address.area.name!='请选择'?address.area.name:address.city.name!='请选择'?address.city.name:address.province.name
      })
    }
   
  },

  // 
  showSelectFN(){
    this.setData({
      showSelect:true
    })
  },
  remakeAddress(){
    let that=this
    wx.getLocation({
      success: function(res) {
        that.setData({
          addName:that.data.oldAddName,
          postLat:res.latitude,
          postLon:res.longitude,
          showSelect:false
        })
        that.getData()
      },
    })
  },

})