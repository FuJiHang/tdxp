const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    seach:'',
    active:0,
    imgUrl:app.imgUrl,
    contantList:[
      {
        name:'未绑定',
        page:1,
        post:0,
        finsh:false,
        data:[],
      },
      {
        name:'可解绑',
        page:1,
        post:1,
        finsh:false,
        data:[],
      },
      {
        name:'审核中',
        page:1,
        post:2,
        finsh:false,
        data:[],
      },
    ],
    judao:false,//判断是聚到还是团队长
  },

  // 搜索字
  seaChFN(e){
    this.setData({
      seach:e.detail.value
    })
  },
  getData(){
    let contantList=[
      {
        name:'可绑定',
        page:1,
        post:0,
        finsh:false,
        data:[],
      },
      {
        name:'可解绑',
        page:1,
        post:1,
        finsh:false,
        data:[],
      },
      {
        name:'审核中',
        page:1,
        post:2,
        finsh:false,
        data:[],
      },
    ]
    if(this.data.judao){
      contantList[1].post=2
      contantList[2].post=1
    }
    this.setData({
      contantList:contantList
    })
    this.getDataR()
  },

  // 获取内容
  getDataR(){
    
    let data=this.data
    let that=this
    if(data.contantList[data.active].finsh) return
    let post={
      action:"Search",
      tag:"store",
      // Longitude:100,
      // Latitude:100,
      // thid:297
      content:data.seach,
      Longitude:app.globalData.Longitude,
      Latitude:app.globalData.Latitude,
      pageindex:data.contantList[data.active].page,
      pagesize:10,
      bindtype:data.contantList[data.active].post,
    }
    if(data.judao){
      post.bsid=app.globalData.GetMembersInfo.UserId
    }else{
      post.thid=app.globalData.GetMembersInfo.UserId
    }
    
    if(data.active==0&&!data.seach&&data.judao) return
    app.fl()
    app.fg(post).then(r=>{
      console.log(r)
      app.fh()
      if(r.data.Status!="NO"){
        let datar=r.data.Models
        for(let i=0;i<datar.length;i++){
            data.contantList[data.active].data.push(datar[i])
        }
        if(datar.length<10){
          data.contantList[data.active].finsh=true
        }
        data.contantList[data.active].page++
       
        that.setData({
          contantList:data.contantList
        })
      }else app.fa(r.data.Message)
    })
  },  

  onChange(event) {
    this.setData({
      active:event.detail.index
    })
    this.getDataR()
  },

  // 跳转
  toFN(e){
    let data=this.data
    if(data.active==2) return
    let index=e.currentTarget.dataset.index
    let state=data.active?0:1
    let url="/pages/fujihang/fuUntyStore/fuUntyStore?state="+state+
    '&store='+data.contantList[data.active].data[index].StoreId
    if(data.judao) url+='&tOrs=2'
    else url+='&tOrs=1'
    wx.navigateTo({
      url:url
    })
  },

  // 撤回
  callback(e){
    let data=this.data,that=this
    let index=e.currentTarget.dataset.index
    console.log(index)
    wx.showModal({
      title: '警告',
      content: '确定要撤回申请吗？',
      success(res) {
        if (res.confirm) {
          app.fl()
          app.fg({
            action:'BindRequest',
            role:data.judao?'BSST':'THST',
            userid:app.globalData.GetMembersInfo.UserId,
            StoreId:data.contantList[data.active].data[index].StoreId,
            bindtype:2,
            RequestReason:'撤回'
          }).then(r=>{
              app.fh()
              app.fa(r.data.Message)
              if(r.data.Status=="OK"){
                that.getData()
              }
          })
        } 
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        judao:options.judao?true:false
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
    this.getData()

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