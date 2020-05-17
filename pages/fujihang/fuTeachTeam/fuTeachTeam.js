
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */

  data: {
    imgUrl:app.imgUrl,
    open:false,
    seach:'',
    dataList:[],//
    teachlist:[],
    role:'technician',
    finsh:false,
    page:1,
    show:false,
    choose:['成为执行者','解绑','流动'],
    index:0,//选择的下表
  },


  chooseFN(e){
    let index=e.currentTarget.dataset.index
    let data=this.data.teachlist[this.data.index]
    let pd=this.data.teachlist[this.data.index].IsExcutor
    let that=this
    if(index==0){
      app.fl()
      app.fg({
          action:'BindRequest',
          role:'THTCE',
          tcid:data.UserId,
          SetType:pd=='False'?1:0,
          // userid:297,
          userid:app.globalData.GetMembersInfo.UserId,
      }).then(r=>{
        app.fh()
        app.fa(r.data.Message)
        setTimeout(()=>{
          if(r.data.Status=="OK"){
            that.setData({
              finsh:false,
              page:1,
              dataList:[],
              teachlist:[],
            })
            that.getData()
          }
        },1450)
        
      })
    }else if(index==1) {
      wx.navigateTo({
        url:"/pages/fujihang/fuUntyStore/fuUntyStore?tcid="+data.UserId
      })
    }else {

      app.fl()
      app.fg({
          action:'SetAutoUntying',
          IsAutoUntying:data.IsAutoUntying=='False'?'True':'False',
          technicianid:data.UserId,
          openId:app.globalData.GetMembersInfo.openId,
      }).then(r=>{
        app.fh()
        app.fa(r.data.Message)
        setTimeout(()=>{
          if(r.data.Status=="OK"){
            that.setData({
              finsh:false,
              page:1,
              dataList:[],
              teachlist:[],
            })
            that.getData()
          }
        },1450)
        
      })
    }
    that.setData({
      show:false
    })
  },
  // 打开功能
  openFunFN(e){
    let index=e.currentTarget.dataset.index
    let data=this.data
    this.setData({
      index:index,
      show:true,
      ['choose[0]']:data.teachlist[index].IsExcutor=='False'?'成为执行者':'取消执行者',
      ['choose[2]']:data.teachlist[index].IsAutoUntying=='False'?'流动':'非流动'
    })
  },
  onCloseP(){
    this.setData({
      show:false
    })
  },
  // 搜索字
  seaChFN(e){
    console.log(e)
    this.setData({
      seach:e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
        role:options.role
        // role:"head"
    })
    
    this.getData()
  },

  getData(){
    
    let data=this.data
    if(data.finsh) return
    app.fl()
    app.fg({ 
      action:'GetTeamMembers',
      // openId:"oGsqu4qBG6Icub2iLYzI3MJGH4iQ",
      openId:app.globalData.GetMembersInfo.openId,
      role:this.data.role,
      PageIndex:data.page,
      PageSize:10,
    }).then(r=>{
      app.fh()
      if(r.errMsg=="request:ok"){
        let t=r.data.Technicians
        t.forEach(c=>{
          data.teachlist.push(c)

        })
        data.page++
        this.setData({
          teachlist:data.teachlist,
          page:data.page,
          dataList:r.data,
          finsh:r.data.Technicians.length<10?true:false
        })
      }else app.fa("查询失败！")
    })
  },


  toFNSQ(){
    wx.navigateTo({
      url:"/pages/fujihang/fuBind/fuBind"
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
    console.log("======")
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