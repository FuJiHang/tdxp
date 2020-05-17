const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.imgUrl,
    one:[],
    two:[],
    page:1,
    seach:'',
    finsh:false,
    nowAddressId:'',//省市区id
    LatiLongitude:'',//用户的经纬
    StoreId:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data=this.data,that=this
    data.StoreId=options.StoreId?options.StoreId:""
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
      that.getData()
    },500)
  },

  // 搜索字
  seaChFN(e){
    this.setData({
      seach:e.detail.value
    })
  },
  seachZXT(){
    this.setData({
      one:[],
      two:[],
      page:1,
      finsh:false,
    })
    this.getData()
  },

  toFN(e){
    wx.navigateTo({
      url: '/pages/fujihang/fuTeacherDet/fuTeacherDet?id='+e.currentTarget.dataset.id
    });
  },
  // 获取数据
  getData(){
    let data=this.data,that=this
    app.fl()
    wx.request({
      url: app.data.url + '/api/StoreManage.ashx?action=GetTechniciansList',
      data: {
        Name: data.seach,
        // regionPath: data.nowAddressId,
        Latitude: data.LatiLongitude.Latitude,
        Longitude: data.LatiLongitude.Longitude,
        // tag: 'technician',
        pageindex: data.page,
        pagesize: 8,
        StoreId:data.StoreId
      },
      header: { Cookie: wx.getStorageSync('cookieFu') },
      success: (r) => {
        console.log("输出技师列表",r);
        app.fh()
        
        data.page++
        if(r.data.Status=="OK"){
          let datar = r.data.Data
          for (let i = 0; i < datar.length; i++) {
          setTimeout(() => {
            that.getHeight().then(r => {
              if (r) {
                data.two.push(datar[i])
                that.setData({
                  two: data.two,
                  page: data.page,
                })
              } else {
                data.one.push(datar[i])
                that.setData({
                  one: data.one,
                  page: data.page,
                })
              }
            })
          }, i * 200)
          }
          if (datar.length < 8) {
          this.setData({
            finsh: true
          })
          }
        }
        
        console.log(r)
      },
      fail: () => {},
      complete: () => {}
    });
      
    // app.fg({
    //   action: 'Search',
    //   content: data.seach,
    //   regionPath: data.nowAddressId,
    //   Latitude: data.LatiLongitude.Latitude,
    //   Longitude: data.LatiLongitude.Longitude,
    //   tag: 'technician',
    //   pageindex: data.page,
    //   pagesize:8,
    // }).then(r=>{
    //   app.fh()
    //   let datar=r.data.rows
    //   data.page++
    //   for(let i=0;i<datar.length;i++){
    //     setTimeout(()=>{
    //       that.getHeight().then(r=>{
    //         if(r){
    //           data.two.push(datar[i])
    //           that.setData({
    //             two:data.two,
    //             page: data.page,
    //           })
    //         }else{
    //           data.one.push(datar[i])
    //           that.setData({
    //             one: data.one,
    //             page: data.page,
    //           })
    //         }
    //       })
    //     },i*200)
    //   }
    //   if(datar.length<8){
    //     this.setData({
    //       finsh:true
    //     })
    //   }
      
    //   console.log(r)
    // })
  },

 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  // 获取高度
  getHeight(){
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
    if(!this.data.finsh) this.getData()
    
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})