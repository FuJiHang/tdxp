const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.imgUrl,
    showTime:false,//时间弹窗
    currentDate: '10:00',//默认时间
    time:['10:00','22:00'],
    address:'',
    door:'',
    phone:'',
    say:'',
    timeIndex:0,
    Latitude:'',
    Longitude:'',
    zxAddress:["请选择所在区域"],
    chooseType:[],
    storeInfo:{},
  },

  // 获取门店信息
  getInfo(){
    let data=this.data,that=this
    app.fl()
    app.fg({
      action:'GetStoreInfo',
      openId:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',
      // openId:app.globalData.GetMembersInfo.openId,
    }).then(r=>{
      app.fh() 
      if(r.data.Status=='OK'){
        that.setData({
          storeInfo:r.data.Data,
          phone:r.data.Data.Tel,
          say:r.data.Data.TDescription,
          ['time[0]']:r.data.Data.StoreOpenTime.split('-')[0],
          ['time[1]']:r.data.Data.StoreOpenTime.split('-')[1],
          zxAddress:r.data.Data.RegionName.split(',')
        })
      }else app.fa(r.data.Message)
      console.log(r) 
      that.getChooseType()
    })
  },

  // 
  openTime(e){
    this.setData({
      timeIndex:e.currentTarget.dataset.index,
      showTime:true,
    })
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
    let index=this.data.timeIndex
    // console.log(app.fttsM(this.data.currentDate))
    this.setData({
      ['time['+index+']']:this.data.currentDate,
      showTime:false,
    })
    
    // console.log(this.data.currentDate)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.removeStorage({
      key:'storeFujihang'
    })
    this.getInfo()
   
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  toFN(){
    if(!this.data.zxAddress[2]) return app.fa('请选择地区')
    wx.navigateTo({
      url: "/pages/editaddress/editaddress?fujihang=true&region="+this.data.zxAddress[2]
    });
  },

  // 
  changeInput(e){
    this.setData({
      [e.currentTarget.dataset.name]:e.detail.value
    })
  },

  // 地址
  bindRegion(e) {//省市区选择结束
    this.setData({
      zxAddress: e.detail.value
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that=this
    wx.getStorage({
      key:'storeFujihang',
      success:res=>{
        if(!res.data) return
        let data=JSON.parse(res.data)
        
        that.setData({
          address:data.name,
          Latitude:data.lat,
          Longitude:data.lng
        })
      }
    })
  },

  // 
  submit(){
    let data=this.data,that=this,Tag=''
    if(!data.zxAddress[2]||!data.address) return app.fa('请完善地址信息')
    if(!(/^1[3|4|5|6|7|8][0-9|9]\d{4,8}$/.test(data.phone))) return app.fa('手机号码不正确！')
    // data.chooseType.forEach(c=>{
    //   if(c.isChoose){
    //     if(Tag) Tag+=','+c.TagId
    //     else Tag=c.TagId
    //   } 
    // })
    // if(!Tag) return app.fa('请至少选择一个门店分类')

    // app.fg({
    //   action:'CheckContentSecurity', 
    //   Type:0,
    //   FormData:data.address+data.door+data.phone+
    //   data.say
    // }).then(t=>{
    //   if(t.data.Status!="OK"){
    //     app.fa(t.data.Message)
    //   }else{

        app.fl()
        app.fg({
          action:'EditStoreInfo',
          openId:app.globalData.GetMembersInfo.openId,
          // openId:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',
          Longitude:data.Longitude,
          Latitude:data.Latitude,
          address:data.address+data.door,
          contacttel:data.phone,
          TDescription:data.say,
          storeopentimeStart:data.time[0],
          storeopentimeEnd:data.time[1],
          RegionName:data.zxAddress[0]+','+data.zxAddress[1]+','+data.zxAddress[2],
          // TagIds:Tag,
        }).then(c=>{
          app.fh()
          if(c.data.Status=="OK"){
            setTimeout(()=>{
              wx.navigateBack({
                delta: 1
              })
            },1450)
          }
          app.fa(c.data.Message)
        })

    //   }
    // })

    
  },


  // 获取门店分类
  getChooseType(){
    let data=this.data,that=this
    app.fl()
    app.fg({
      action:'GetStoreTagList',
    }).then(r=>{
      app.fh() 
      if(r.data.Status=='OK'){
        let aa=data.storeInfo.Tags.split(','),bb=r.data.Data
        for(let b=0;b<bb.length;b++){
          for(let a=0;a<aa.length;a++){
            if(aa[a]==bb[b].TagId){
              bb[b].isChoose=true
              break
            }else bb[b].isChoose=false
          }
        }
        that.setData({
          chooseType:r.data.Data
        })
      }
    })
  },

  // 选择门店分类
  chooseMdType(e){
    let ev=e.currentTarget.dataset
    this.setData({
      [ev.name]:!ev.xz
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