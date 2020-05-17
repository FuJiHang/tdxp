const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.imgUrl,
    people:[
      {
        name:'2人',
        isChoose:false,
      },
      {
        name:'3人',
        isChoose:false,
      },
      {
        name:'4人',
        isChoose:false,
      },
    ],
    dataInfo:{},
    post:{
      action:'CreateFightGroupActivitiy',
      ProductPrice:'',
      JoinNumber:'',
      StartDate:'',
      EndDate:'',
      Remark:'',
    },
    timeIndex:'StartDate',
    showTime:false,
    currentDate: new Date().getTime(),//默认时间
    minDate:new Date().getTime(),
  },
  checkFN(e){
    let data=this.data,that=this
    data.people.forEach((c,i)=>{
      c.isChoose=false
      if(e.currentTarget.dataset.index==i) c.isChoose=true
    })
    this.setData({
      people:data.people
    })
  },
  // 
  inputChange(e){
    let data=this.data,that=this
    if(e.currentTarget.dataset.data=='post.JoinNumber'){
      data.people.forEach((c,i)=>{
        c.isChoose=false
      })
    }
    this.setData({
      [e.currentTarget.dataset.data]:e.detail.value,
      people:data.people
    })
  },

  // 
  submitFN(){
    let data=this.data,that=this
    data.post.openId=app.globalData.GetMembersInfo.openId
    data.post.ProductId=data.dataInfo.ProductId
    
    let aaa=''
    data.people.forEach((c,i)=>{
      if(c.isChoose) aaa=i+2
    })
    data.post.JoinNumber=aaa?aaa:data.post.JoinNumber

    app.fg({
      action:'CheckContentSecurity', 
      Type:0,
      FormData:data.post.Remark
    }).then(t=>{
      if(t.data.Status!="OK"){
        app.fa(t.data.Message)
      }else{

        app.fl()
        app.fg(data.post).then(r=>{
          app.fh() 
          if(r.data.Status=='OK'){
            setTimeout(()=>{
              wx.navigateBack({
                delta: 1
              })
            },1450)
          }
          app.fa(r.data.Message)
        })
      }
    
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
  okTime(){
    let data=this.data
    // console.log(app.fttsM(this.data.currentDate))
    this.setData({
      [data.timeIndex]:app.fttst(data.currentDate),
      showTime:false,
    })
  },
  // 选择时间
  onInput:function(event) {
    // console.log(event)
    this.setData({
      currentDate: event.detail
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      dataInfo:JSON.parse(decodeURIComponent(options.data))
    })
    console.log(this.data.dataInfo)
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
          } else {
            wx.redirectTo({
              url: "/pages/login/login"
            });
          }
        })
      })
    }
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