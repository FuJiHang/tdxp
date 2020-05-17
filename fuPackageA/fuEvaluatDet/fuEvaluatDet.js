const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.imgUrl,
    page:1,
    finsh:false,
    dataList:[],//评价列表
    commenT:{
      show:false,
      txt:'',
      aid:0,
    },//回复弹窗
    focusfu:false,
    aid:0,
    StoreId:0,
    TeacherId:0,
    dataInfo:{},
  },

  openFN(e){
    let that=this,de=e.currentTarget.dataset
    let aaa={
      show:true,
      txt:'',
      aid:de.aid
    }
    console.log(e)
    this.setData({
      commenT:aaa,
    })
    setTimeout(()=>{
      that.setData({
        focusfu:true
      })
    },300)
  },

  // 第一层回复
  submitComT(){
    let data=this.data,that=this
    app.fl()
    app.fg({
      action:'SendComment',
      openId:app.globalData.GetMembersInfo.openId,
      ArticleID:data.commenT.aid,
      Contents:data.commenT.txt,
      CommentType:1,
    }).then(r=>{
      app.fh() 
      if(r.data.Status=='OK'){
        that.onCloseP()
        that.setData({
          dataList:[],
          page:1,
          finsh:false,

        })
        that.getData()
      }
      app.fa(r.data.Message)
    })
  },

  // 搜索字
  seaChFN(e){
    this.setData({
      [e.currentTarget.dataset.name]:e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    this.setData({
      aid:options.aid,
      StoreId:options.StoreId?options.StoreId:'',
      TeacherId:options.TeacherId?options.TeacherId:''
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
          } else {
            wx.redirectTo({
              url: "/pages/login/login"
            });
          }
        })
      })
    }else that.getData()
  },

  toTeach(e){
    wx.navigateTo({
      url:'/pages/fujihang/fuTeacherDet/fuTeacherDet?id='+e.currentTarget.dataset.id
    })
  },

  // 
  allFN(e){
  
    this.setData({
      [e.currentTarget.dataset.index]:e.currentTarget.dataset.data?false:true
    })
  },
  

  // 
  getData(){
    let data=this.data,that=this
    app.fl()
    app.fg({
      action:'GetAppraiseList',
      openId:app.globalData.GetMembersInfo.openId,
      // openId:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',
      StoreId:data.StoreId?data.StoreId:'',
      TechnicianId:data.TeacherId?data.TeacherId:'',
      TagType:1,
      PageIndex:data.page,
      PageSize:10,
      AppraiseId:data.aid
    }).then(r=>{
      app.fh() 
      if(r.data.Status=='OK'){
        console.log(r.data)
         r.data.Appraises.forEach(s=>{
           s.Pictures=s.Pictures.split(',')
           s.all=false
           s.Comments.forEach(w=>{
             w.CommentDate=w.CommentDate.slice(5,10)
           })
          data.dataList.push(s)
        })
       
        that.setData({
          dataList:data.dataList,
          page:++data.page,
          finsh:r.data.Appraises.length<10?true:false
        })
       }
      console.log(r) 
    })
  },

  // 
  onCloseP(){
    let data=this.data,that=this
    data.commenT={
      show:false,
      txt:'',
      aid:0,
    },//回复弹窗
    this.setData({
      commenT:data.commenT,
    })
  },

  // 
  goodFN(e){
    let datac=e.currentTarget.dataset
    console.log(e)
    app.fl()
    app.fg({
      action:'GoodAndCollection',
      // openId:"oGsqu4qBG6Icub2iLYzI3MJGH4iQ",
       openId:app.globalData.GetMembersInfo.openId,
      RelationType:7,
      ForID:datac.id
    }).then(r=>{
      app.fh() 
      if(r.data.Status=='OK'){
        this.setData({
          [datac.name]:datac.tf==0?1:0,
          [datac.namenum]:datac.tf==1?--datac.num:++datac.num
        })
      }
      app.fa(r.data.Message)
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
    app.fh()
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
    let data=this.data
    app.fl()
    return{

  　　　　title: "头道惠",        // 默认是小程序的名称(可以写slogan等)
  　　　　path: '/fuPackageA/fuEvaluatDet/fuEvaluatDet?aid='+data.aid+'&StoreId='+data.StoreId+"&TeacherId="+data.TeacherId
          ,        // 默认是当前页面，必须是以‘/’开头的完整路径
  　　　　imageUrl: '',   
  　　　　success: function(res){
          app.fh()
  　　　　　　// 转发成功之后的回调
  　　　　　　if(res.errMsg == 'shareAppMessage:ok'){
                app.fa("分享成功！")
  　　　　　　}
  　　　　},
  　　　　fail: function(){
          app.fh()
  　　　　　　if(res.errMsg == 'shareAppMessage:fail cancel'){
  　　　　　　　　app.fa("已取消")
  　　　　　　}else if(res.errMsg == 'shareAppMessage:fail'){
    　　　　　　　　app.fa("分享失败！")
  　　　　　　}
  　　　　},
    }
  }
})