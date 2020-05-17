const app=getApp()
import QQMapWX from '../../libs/qqmap-wx-jssdk.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navtap:['推荐','关注','附近'],
    nowCityName:'上海',
    one:1,
    two:1,
    imgUrl:app.imgUrl,
    choose:0,
    interested:[],
    LatiLongitude:'',
    userlatitude:'',
    userlongitude:'',
    addressData:'',
    nowCityName:'',
    showSelect:'',
    firstAddressId:'',
    followList:{
      finsh:false,
      data1:[],
      data2:[],
      page:1,
    },
    followListCZ:[],
    nearList:{
      finsh:false,
      data1:[],
      data2:[],
      page:1,
    },
    nearListCZ:[],
    tuijian:{
      finsh:false,
      data1:[],
      data2:[],
      page:1,
    },
    tuijianCZ:[],
    FollowData:[],
    seach:'',
    onfous:false,
  },

  chooseFN(e){
    this.setData({
      choose:e.currentTarget.dataset.index
    })
    if(e.currentTarget.dataset.index==2) this.getListT()
    else if(e.currentTarget.dataset.index==1) this.getListO()
    else this.getListTH()
    
   
  },
  // 
  toFN(e){

    let datac=e.currentTarget.dataset,data=this.data,WeiZhi=0
    setTimeout(()=>{
      WeiZhi=datac.no-1
      // if(datac.name=='le') WeiZhi=datac.index*2
      // else WeiZhi=datac.index*2+1
      let chuang='',choose=0,page=0
      if(datac.choose==0){
        page=data.tuijian.page
        if(WeiZhi%10==0) chuang=encodeURIComponent(JSON.stringify(data.tuijianCZ.slice(WeiZhi,((Math.ceil(WeiZhi/10)+1)*10))));
        else chuang=encodeURIComponent(JSON.stringify(data.tuijianCZ.slice(WeiZhi,(Math.ceil(WeiZhi/10)*10))));
      }else if(datac.choose==1){
        page=data.followList.page
        choose=1
        if(WeiZhi%10==0) chuang=encodeURIComponent(JSON.stringify(data.followListCZ.slice(WeiZhi,((Math.ceil(WeiZhi/10)+1)*10))));
        else chuang=encodeURIComponent(JSON.stringify(data.followListCZ.slice(WeiZhi,(Math.ceil(WeiZhi/10)*10))));
      }else{
        page=data.tuijian.page
        if(WeiZhi%10==0) chuang=encodeURIComponent(JSON.stringify(data.nearListCZ.slice(WeiZhi,((Math.ceil(WeiZhi/10)+1)*10))));
        else chuang=encodeURIComponent(JSON.stringify(data.nearListCZ.slice(WeiZhi,(Math.ceil(WeiZhi/10)*10))));
      }
     
      wx.navigateTo({
        url:'/fuPackageA/fuProjectVideo/fuProjectVideo?chuang='+chuang+'&page='+page+'&choose='+choose
      })
    },300)

    // wx.navigateTo({
    //   url:'/fuPackageA/fuCirFriDet/fuCirFriDet?id='+e.currentTarget.dataset.id
    // })
  },
  Fabulous(e){
    let datac=e.currentTarget.dataset
    app.fl()
    app.fg({
      action:'GoodAndCollection',
      // openId:"oGsqu4qBG6Icub2iLYzI3MJGH4iQ",
       openId:app.globalData.GetMembersInfo.openId,
      RelationType:3,
      ForID:datac.id
    }).then(r=>{
      app.fh() 
      if(r.data.Status=='OK'){
        this.setData({
          [datac.name]:datac.tf?false:true,
          [datac.namenum]:datac.tf?--datac.num:++datac.num
        })
      }
      app.fa(r.data.Message)
     
    })
   
    console.log(datac)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    this.setData({
      onfous:options.onfous?true:false
    })
    wx.getStorage({
      key: 'LatiLongitude',
      success (res) {
        that.setData({
          LatiLongitude:res.data
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
                that.getListTH()
              } else {
                wx.redirectTo({
                  url: "/pages/login/login"
                });
              }
            })
          })
        }else {
          that.getListTH()
          that.getData()
        } 
      }
    })
  },

  // 感兴趣人列表
  getData(){
    let data=this.data,that=this
    app.fl()
    app.fg({
      action:'GetBeInterestedManInfoList',
      // openId:"oGsqu4qBG6Icub2iLYzI3MJGH4iQ",
       openId:app.globalData.GetMembersInfo.openId,
    }).then(r=>{
      app.fh() 
      if(r.data.Status=='OK'){
        r.data.Data.forEach(c=>{
          c.follow=false
        })
        that.setData({
          interested:r.data.Data,
          FollowData:r.data.FollowData
        })
      }else app.fa(r.data.Message)
    })
  },

  //删除
  delectFN(e){
    let index=e.currentTarget.dataset.index,data=this.data
    data.interested.splice(index,1)
    this.setData({
      interested: data.interested
    })
  } ,

  // // 关注
  followFN(e){
    let data=this.data,that=this
    if(data.interested[e.currentTarget.dataset.index].follow) return
    app.fl()
    app.fg({
      action:'GoodAndCollection',
      // openId:"oGsqu4qBG6Icub2iLYzI3MJGH4iQ",
       openId:app.globalData.GetMembersInfo.openId,
      RelationType:2,
      ForID:e.currentTarget.dataset.id
    }).then(r=>{
      app.fh() 
      if(r.data.Status=='OK'){
        data.FollowData.push(data.interested[e.currentTarget.dataset.index])
        that.setData({
          ['interested['+e.currentTarget.dataset.index+'].follow']:true,
          FollowData:data.FollowData
        })
      }
      app.fa(r.data.Message)
      console.log(r) 
    })
  },
  seachChange(e){
   
    this.setData({
      seach:e.detail.value
    })
  },

  // 个人空间
  grkjFN(e){
    wx.navigateTo({
      url:'/fuPackageA/fuPerSpace/fuPerSpace?data='+encodeURIComponent(JSON.stringify(e.currentTarget.dataset.data))
    })
  },

  // 搜索
  seachFN(){
    let asd={
      finsh:false,
      data1:[],
      data2:[],
      page:1,
    }
    
    if(this.data.choose==2){
      this.setData({
        nearList:asd
      })
      this.getListT()

    }else if(this.data.choose==1){
      this.setData({
        followList:asd
      })
      this.getListO()
    }else{
      this.setData({
        tuijian:asd
      })
      this.getListTH()
    }
    

   
  },

  // // 朋友圈列表(推荐)
  getListTH(){
    let data=this.data,that=this
    if(data.tuijian.finsh) return
    app.fl()
    app.fg({
      action:'LoadAttention',
      // openId:"oGsqu4qBG6Icub2iLYzI3MJGH4iQ",
       openId:app.globalData.GetMembersInfo.openId,
      pageIndex:data.tuijian.page,
      pageSize:10,
      SearchText:data.seach,
      IsRecommended:true,
      // lat:data.LatiLongitude.Latitude,
      // lng:data.LatiLongitude.Longitude,
    }).then(r=>{
      app.fh() 
      if(r.data.Status=='OK'){
        let datar=r.data.Data,cc=[]
        cc.push(...data.tuijianCZ,...datar)
        that.setData({
          tuijianCZ:cc
        })
        for(let i=0;i<datar.length;i++){
          setTimeout(()=>{
            that.getHeightTH().then(r=>{
              if(r){
                if(datar[i].ImageUrls.indexOf('.mp4')!=-1) datar[i].isVideo=true
                data.tuijian.data2.push(datar[i])
                that.setData({
                  ['tuijian.data2']:data.tuijian.data2
                })
              }else{
                if(datar[i].ImageUrls.indexOf('.mp4')!=-1) datar[i].isVideo=true
                data.tuijian.data1.push(datar[i])
                that.setData({
                  ['tuijian.data1']:data.tuijian.data1
                })
              }
            })
          },i*500)
        }
        
        this.setData({
          ['tuijian.finsh']:datar.length<10?true:false,
          ['tuijian.page']:++data.tuijian.page
        })
      }else app.fa(r.data.Message)
    })
  },

  // // 朋友圈列表(关注)
  getListO(){
    let data=this.data,that=this
    if(data.followList.finsh) return
    app.fl()
    app.fg({
      action:'LoadAttention',
      // openId:"oGsqu4qBG6Icub2iLYzI3MJGH4iQ",
       openId:app.globalData.GetMembersInfo.openId,
      pageIndex:data.followList.page,
      pageSize:10,
      SearchText:data.seach,
      // lat:data.LatiLongitude.Latitude,
      // lng:data.LatiLongitude.Longitude,
    }).then(r=>{
      app.fh() 
      if(r.data.Status=='OK'){
        let datar=r.data.Data,cc=[]
        cc.push(...data.followListCZ,...datar)
        that.setData({
          followListCZ:cc
        })
        
        for(let i=0;i<datar.length;i++){
          setTimeout(()=>{
            that.getHeight().then(r=>{
              if(r){
                if(datar[i].ImageUrls.indexOf('.mp4')!=-1) datar[i].isVideo=true
                data.followList.data2.push(datar[i])
                that.setData({
                  ['followList.data2']:data.followList.data2
                })
              }else{
                if(datar[i].ImageUrls.indexOf('.mp4')!=-1) datar[i].isVideo=true
                data.followList.data1.push(datar[i])
                that.setData({
                  ['followList.data1']:data.followList.data1
                })
              }
            })
          },i*500)
        }
        
        this.setData({
          ['followList.finsh']:datar.length<10?true:false,
          ['followList.page']:++data.followList.page
        })
      }else app.fa(r.data.Message)
    })
  },
  getListT(){
    let data=this.data,that=this
    if(data.nearList.finsh) return
    app.fl()
    app.fg({
      action:'LoadAttention',
      // openId:"oGsqu4qBG6Icub2iLYzI3MJGH4iQ",
       openId:app.globalData.GetMembersInfo.openId,
      pageIndex:data.nearList.page,
      pageSize:10,
      SearchText:data.seach,
      lat:data.LatiLongitude.Latitude,
      lng:data.LatiLongitude.Longitude,
    }).then(r=>{
      app.fh() 
      if(r.data.Status=='OK'){
        let datar=r.data.Data,cc=[]
        cc.push(...data.nearListCZ,...datar)
        that.setData({
          nearListCZ:cc
        })
        for(let i=0;i<datar.length;i++){
          setTimeout(()=>{
            that.getHeightT().then(r=>{
              if(r){
                if(datar[i].ImageUrls.indexOf('.mp4')!=-1) datar[i].isVideo=true
                data.nearList.data2.push(datar[i])
                that.setData({
                  ['nearList.data2']:data.nearList.data2
                })
              }else{
                if(datar[i].ImageUrls.indexOf('.mp4')!=-1) datar[i].isVideo=true
                data.nearList.data1.push(datar[i])
                that.setData({
                  ['nearList.data1']:data.nearList.data1
                })
              }
            })
          },i*500)
        }
        
        this.setData({
          ['nearList.finsh']:datar.length<10?true:false,
          ['nearList.page']:++data.nearList.page
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
    let that=this
    
    if(this.data.choose==2) this.getListT()
    else if(this.data.choose==1) this.getListO()
    else this.getListTH()
    console.log(that.data.one)
    
  },
  // 获取高度推荐
  getHeightTH(){
    return new Promise((resolve, reject)=>{
        let leftK = wx.createSelectorQuery()
        let rightK = wx.createSelectorQuery()
        leftK.select('#leftKfTH').boundingClientRect()
        rightK.select('#rightKfTH').boundingClientRect()
        leftK.exec(function (res) {
          rightK.exec(r=>{
            if(res[0].height>r[0].height) resolve(true)
            else resolve(false)
          })
        })
    })
  },
  // 获取高度关注
  getHeight(){
    return new Promise((resolve, reject)=>{
        let leftK = wx.createSelectorQuery()
        let rightK = wx.createSelectorQuery()
        leftK.select('#leftKf').boundingClientRect()
        rightK.select('#rightKf').boundingClientRect()
        leftK.exec(function (res) {
          rightK.exec(r=>{
            if(res[0].height>r[0].height) resolve(true)
            else resolve(false)
          })
        })
    })
  },
  // 获取高度附近
  getHeightT(){
    return new Promise((resolve, reject)=>{
        let leftK = wx.createSelectorQuery()
        let rightK = wx.createSelectorQuery()
        leftK.select('#leftK').boundingClientRect()
        rightK.select('#rightK').boundingClientRect()
        leftK.exec(function (res) {
          rightK.exec(r=>{
            if(res[0].height>r[0].height) resolve(true)
            else resolve(false)
          })
        })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  getUserPoints() { //经纬度获取
    let that=this
    var qqmapsdk = new QQMapWX({
      key: '7V4BZ-4WFW4-L3LU6-XLRLM-ZZ7BJ-MBFAM' // 必填
    });
    var _this = this
    wx.getLocation({
      type: 'wgs84',
      success: function(res) { //经纬度成功回调
        
        let latitude = res.latitude;
        let longitude = res.longitude
        let fujihang={
          Latitude:res.latitude,
          Longitude:res.longitude
        }
        that.setData({
          fujihang:JSON.stringify(fujihang)
        })
        wx.setStorage({
          key:'LatiLongitude',
          data:fujihang
        })
        app.setLatitude(fujihang)
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function(res) { //通过第三方介入获取客户的省市区成功回调//重置省市区
            let firstProvince = res.result.address_component.province
            let firstCity = res.result.address_component.city
            let firstDistrict = res.result.address_component.district
            _this.data.firstProvince = firstProvince
            _this.data.firstCity = firstCity
            _this.data.firstDistrict = firstDistrict
            _this.firstaddress(firstProvince, firstCity, firstDistrict); //回调成功前往排查地址id发送给后端
          },
          complete: function(res) {
          }
        })
        _this.data.userlatitude = res.latitude; //赋值客户当前经度
        _this.data.userlongitude = res.longitude; //赋值客户当前纬度

      }
    })
  },

  isempty(){

    if (this.data.nowCityName == ""){//判断客户原先是否有选择过地区,如果没有请重新获取
    // console.log('需要重新获取经纬度')
      this.getUserPoints() //获取客户经纬度
    }else{
     
    }

  },

  // 
  getGps() {
    return new Promise((resolve, reject) => {
      wx.getLocation({
        success: function(res) {
          resolve(res)
        },
      })

    })
  },
  //调取腾讯地图
  getTencentMap(latitude, longitude) { 
    return new Promise((resolve, reject) => {
      var qqmapsdk = new QQMapWX({
        key: '7V4BZ-4WFW4-L3LU6-XLRLM-ZZ7BJ-MBFAM' // 必填
      });
      qqmapsdk.reverseGeocoder({
        location: {
          latitude: latitude,
          longitude: longitude
        },
        success: function(res) {
          resolve(res)
        }
      })
    })
  },

  // 调接口地址
  getaddress() {
    this.setData({
      showSelect: true
    })
  },

  remakeAddress() { //重新定位
    this.getGps().then(r => {
      this.data.userlatitude = r.latitude
      this.data.userlongitude = r.longitude; //重置经纬度
      // 获取客户的地理位置
      this.getTencentMap(r.latitude, r.longitude).then(res => {
        let sheng = res.result.address_component.province
        let shi = res.result.address_component.city
        let qu = res.result.address_component.district
        var addressData = this.data.addressData
        var shengID = '',
          shiId = '',
          quID = ''
        addressData.filter(function(item, index) {
          if (item.name == sheng) {
            shengID = item.id
            item.city.filter(function(item2, index2) {
              if (item2.name == shi) {
                shiId = item2.id
                if (item2.area.length !== 0) { //非市辖区
                  item2.area.filter(function(item3, index3) {
                    if (item3.name == qu) {
                      quID = item3.id
                    }
                  })
                } else {
                  quID = 0
                }
              }
            })
          }
        })

        var nowAddressId = shengID + "," + shiId + ',' + quID
        console.log(nowAddressId,333333)
      
        this.setData({ //重置显示区名字
          nowCityName: qu,
          // indexData: indexData,
          showSelect: false
        })
      })
    }) //异步等待结果
  },
  

  firstaddress(sheng, shi, qu) { //向后端发起地区的省市级请求
    var _this = this
    this.setData({
      nowCityName: qu
    })
    wx.request({
      url: app.gethsyurl,
      data: {
        action: 'GetRegionsOfProvinceCity'
      },
      success: function(res) {
        var addressData = res.data.province
        _this.data.addressData = addressData
        var shengID = '',
          shiId = '',
          quID = ''
        addressData.filter(function(item, index) {
          if (item.name == sheng) {
            shengID = item.id
            item.city.filter(function(item2, index2) {
              if (item2.name == shi) {
                shiId = item2.id
                if (item2.area.length !== 0) { //非市辖区
                  item2.area.filter(function(item3, index3) {
                    if (item3.name == qu) {
                      quID = item3.id
                    }
                  })
                } else {
                  quID = 0
                }
              }
            })
            var firstAddressId=shengID+','+shiId+','+quID
            console.log(firstAddressId,"2222222")
            _this.data.firstAddressId = firstAddressId
          }
        })
      }
    })
  },

  // 接受组件传递过来的值 data是成功
  onSelectRegion: function(data) {
    if (!data.detail.iscancel) {
      if (!data.detail.address || data.detail.address.province.name === "请选择") {
        // || data.detail.address.city.name === "请选择" || data.detail.address.area.name === "请选择"
        wx.showModal({
          title: '提示',
          content: '请选择地址',
          showCancel: false
        })
        return
      }
      // this.data.nowCityId = data.detail.address.city.id
      var nowCityId = data.detail.address.province.id + ',' + data.detail.address.city.id + ',' + data.detail.address.area.id
      this.data.nowCityId = nowCityId
      //预期设计功能 让客户选择省市区 发送省市区的id给后端
      if (data.detail.address.city.id == 0 && data.detail.address.area.id == 0) { //无选择市和区
        this.setData({
          nowCityName: data.detail.address.province.name
        })
      } else if (data.detail.address.city.id == 0 && data.detail.address.area.id !== 0) { //只选了区没选市
        this.setData({
          nowCityName: data.detail.address.province.name
        })
      } else if (data.detail.address.city.id !== 0 && data.detail.address.area.id == 0) { //只选了市没选区
        this.setData({
          nowCityName: data.detail.address.city.name
        })
        if (data.detail.address.city.name == '市辖区') {
          this.setData({
            nowCityName: data.detail.address.province.name
          })
        }
      } else if (data.detail.address.city.id !== 0 && data.detail.address.area.id !== 0) {
        this.setData({
          nowCityName: data.detail.address.area.name
        })
      }
      // 点击确定地址后判断客户目前所在页面  是项目,,,还是技师,,,门店
      console.log(data.detail.address,44444444444)
      this.setData({
        showSelect: false,
        region: data.detail.address,
        // isSelected: true
      })
    } else {
      this.setData({
        showSelect: false
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
    // this.isempty()
   
  },

})