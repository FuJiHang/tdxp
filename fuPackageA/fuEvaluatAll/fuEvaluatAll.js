const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.imgUrl,
    page:1,
    finsh:false,
    chooseI:0,
    postType:0,
    moreType:true,
    chooseList:[
      {
        name:'精选'
      },
      {
        name:'全部'
      },
    ],
    typel:[ ],
    dataList:[],//评价列表
    commenT:{
      show:false,
      txt:'',
      aid:0,
    },//回复弹窗
    seachAll:{
      show:false,
      txt:'',
      aid:0,
    },//搜索弹窗
    focusfu:false,
    focusfuS:false,
    TeacherId:0,
    StoreId:0,
  },

  GetAppraiseTags(){
    let data=this.data,that=this
    app.fl()
    app.fg({
      action:'GetAppraiseTags'
    }).then(r=>{
      app.fh() 
      r.data.forEach(c=>{
        data.typel.push(c)
      })
      that.setData({
        typel:data.typel
      })
    })
  },

  // 
  moreType(){
    this.setData({
      moreType:!this.data.moreType
    })
  },

  openFN(e){
    let that=this,de=e.currentTarget.dataset
    let aaa={
      show:true,
      txt:'',
      aid:de.aid
    }
    this.setData({
      commenT:aaa,
    })
    setTimeout(()=>{
      that.setData({
        focusfu:true
      })
    },300)
  },

  // 
  chooseType(e){
    this.setData({
      postType:e.currentTarget.dataset.index,
      dataList:[],
      finsh:false,
      page:1,
    })
    
    this.getData()
  },

  // 第一层回复
  submitComT(){
    let data=this.data,that=this
    console.log(data.commenT)
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
      StoreId:options.sid?options.sid:'',
      TeacherId:options.TeacherId?options.TeacherId:''
    })
    this.GetAppraiseTags()
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

  // 
  allFN(e){
  
    this.setData({
      [e.currentTarget.dataset.index]:e.currentTarget.dataset.data?false:true
    })
  },
  
  // 
  toFN(e){
    let data=this.data,that=this,aid=e.currentTarget.dataset.aid
   
    wx.navigateTo({
      url:'/fuPackageA/fuEvaluatDet/fuEvaluatDet?aid='+aid+"&StoreId="+data.StoreId+"&TeacherId="+data.TeacherId
    })

  },

  // 
  getData(){
    let data=this.data,that=this
    if(data.finsh) return
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
      // TagType:data.typel[data.postType].TagId,
      Keyword:data.seachAll.txt,
      IsSpecial:data.chooseI?1:0,
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

  toTeach(e){
    wx.navigateTo({
      url:'/pages/fujihang/fuTeacherDet/fuTeacherDet?id='+e.currentTarget.dataset.id
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
      seachAll:data.commenT
    })
  },

  seachPJFN(e){
    let data=this.data,that=this
    this.setData({
      dataList:[],
      finsh:false,
      page:1,
      ['seachAll.show']:false,
    })
    this.getData()

  },
  openSeach(){
    let that=this
    let aaa={
      show:true,
      txt:'',
      aid:'',
    }
    this.setData({
      seachAll:aaa,
    })
    setTimeout(()=>{
      that.setData({
        focusfuS:true
      })
    },300)
  },

  // 
  goodFN(e){
    let datac=e.currentTarget.dataset
    console.log(datac.tf==0)
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

  changeTap(e){
    this.setData({
      chooseI:e.currentTarget.dataset.index,
      page:1,
      finsh:false,
      dataList:[],
    })
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
    this.getData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let data=this.data
    app.fl()
    return{
          
  　　　　title: "头道惠",        // 默认是小程序的名称(可以写slogan等)
  　　　　path: '/fuPackageA/fuEvaluatDet/fuEvaluatDet?aid='+data.dataList.AppraiseId+"&StoreId="+data.StoreId+"&TeacherId="+data.TeacherId
          ,        // 默认是当前页面，必须是以‘/’开头的完整路径
  　　　　imageUrl: '',   
  　　　　success: function(res){
            app.fh()
            console.log("======")
  　　　　　　// 转发成功之后的回调
  　　　　　　if(res.errMsg == 'shareAppMessage:ok'){
                app.fa("分享成功！")
  　　　　　　}
  　　　　},
  　　　　fail: function(){
            app.fh()
            console.log("32222222222222")
  　　　　　　if(res.errMsg == 'shareAppMessage:fail cancel'){
  　　　　　　　　app.fa("已取消")
  　　　　　　}else if(res.errMsg == 'shareAppMessage:fail'){
    　　　　　　　　app.fa("分享失败！")
  　　　　　　}
  　　　　},
    }
  }
})