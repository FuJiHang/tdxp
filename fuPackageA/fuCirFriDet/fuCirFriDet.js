const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    funtionL:[
      {
        img:'like-o',
        imgA:'like',
        val:0,
        data:'ArticleLikeCount',
        choose:false,
        chooseN:'IsArticleLike',
      },
      {
        img:'star-o',
        imgA:'star',
        val:0,
        data:'CollectionCount',
        choose:false,
        chooseN:'IsCollection',
      },
      {
        img:'chat-o',
        val:0,
        data:'CommentCount',
      },
    ],
    imgUrl:app.imgUrl,
    dataInfo:{},//
    GetMembersInfo:{},
    imgheights:[],
    current:0,
    seach:'',
    CommentList:{
      data:[],
      finsh:false,
      page:1,
    },//聊天信息
    commenT:{
      show:false,
      txt:'',
      aid:0,
      cid:0,
    },//回复弹窗
    optionId:0,
    focusfu:false,
    fixBot:false,
    commenO:false,
  },

  // 跳转个人空间
  toFNF(){
    wx.navigateTo({
      url:'/fuPackageA/fuPerSpace/fuPerSpace?data='+encodeURIComponent(JSON.stringify(this.data.dataInfo))
    })
  },

  // 
  openFN(){
    let that=this
    this.setData({
      ['commenT.show']:true,
      commenO:true,
    })
    setTimeout(()=>{
      that.setData({
        focusfu:true
      })
      
    },300)
  },
  toFN(){
    wx.redirectTo({
      url:'/fuPackageA/fuCircleFri/fuCircleFri'
    })
  },
  // 发表评论
  submitCom(){
    let data=this.data,that=this
    app.fl()
    app.fg({
      action:'SendComment',
      // openId:"oGsqu4qBG6Icub2iLYzI3MJGH4iQ",
       openId:app.globalData.GetMembersInfo.openId,
      ArticleID:data.dataInfo.Id,
      Contents:data.seach,
    }).then(r=>{
      app.fh() 
      if(r.data.Status=='OK'){
        let CommentList={
          data:[],
          finsh:false,
          page:1,
        }//聊天信息
        that.setData({
          seach:'',
          CommentList:CommentList,
          ['funtionL[2].val']:++data.funtionL[2].val
        })
        setTimeout(()=>{
          that.getComment()
        },1400)
      }
      app.fa(r.data.Message)
    })
  },

  // 关注
  followFN(){
    let data=this.data,that=this
    app.fl()
    app.fg({
      action:'GoodAndCollection',
      // openId:"oGsqu4qBG6Icub2iLYzI3MJGH4iQ",
       openId:app.globalData.GetMembersInfo.openId,
      RelationType:2,
      ForID:data.dataInfo.UserId
    }).then(r=>{
      app.fh() 
      if(r.data.Status=='OK'){
        that.setData({
          ['dataInfo.IsFavorite']:data.dataInfo.IsFavorite?false:true
        })
      }
      app.fa(r.data.Message)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options.id=37
    this.setData({
      optionId:options.id
    })
  },

  // 
  bindchangeImg: function (e) {
    this.setData({ current: e.detail.current })
  },
  // 轮播图变化
  imageLoad: function (e) {//获取图片真实宽度  
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比  
      ratio = imgwidth / imgheight;
    //计算的高度值  
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight;
    var imgheights = this.data.imgheights;
    //把每一张图片的对应的高度记录到数组里  
    imgheights[e.target.dataset.id] = imgheight;
    this.setData({
      imgheights: imgheights
    })
  },

  getComment(){
    let data=this.data,that=this
    if(data.CommentList.finsh) return
    app.fl()
    app.fg({
      action:'GetArticleComments',
     openId:app.globalData.GetMembersInfo.openId,
    //  openId:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',
     pageIndex:data.CommentList.page,
     pageSize:10,
     SortBy:'CommentDate',
     ArticleId:data.dataInfo.Id,
    }).then(r=>{
      app.fh() 
      if(r.data.Status=='OK'){
        r.data.Data.forEach(c=>{
          c.CommentDate=c.CommentDate.slice(5,10)+' '+c.CommentDate.slice(11,16)
          c.CommentsList.forEach(s=>{
            s.CommentDate=s.CommentDate.slice(5,10)+' '+c.CommentDate.slice(11,16)
          })
          data.CommentList.data.push(c)
       })
       if(r.data.Data.length<10) data.CommentList.finsh=true
        data.CommentList.page++
       that.setData({
        CommentList:data.CommentList
       })
      }
    })
  },
  // 搜索字
  seaChFN(e){
    
    this.setData({
      [e.currentTarget.dataset.name]:e.detail.value
    })
    console.log(e.currentTarget.dataset.name)
    console.log(e.detail.value)
    console.log(this.data.commenT)
  },

  // 第一层回复
  submitComT(){
    let data=this.data,that=this
    console.log(this.data.commenT)
    app.fl()
    app.fg({
      action:'SendComment',
      // openId:"oGsqu4qBG6Icub2iLYzI3MJGH4iQ",//me
      // openId:"oGsqu4kr4cw0lP0vIV5sTDoxa66k",
       openId:app.globalData.GetMembersInfo.openId,
      ArticleID:data.commenO?data.dataInfo.Id:data.commenT.aid,
      Contents:data.commenT.txt,
      commentid:data.commenO?'':data.commenT.cid
    }).then(r=>{
      app.fh() 
      if(r.data.Status=='OK'){
        that.onCloseP()
        let CommentList={
          data:[],
          finsh:false,
          page:1,
        }//聊天信息
        that.setData({
          CommentList:CommentList,
          ['funtionL[2].val']:++data.funtionL[2].val
        })
        console.log(data.funtionL,'===========')
        setTimeout(()=>{
          that.getComment()
        },1400)
      }
      app.fa(r.data.Message)
    })
  },
  commentOne(e){
    let data=this.data,that=this
    data.commenT={
      show:true,
      txt:'',
      aid:e.currentTarget.dataset.aid,
      cid:e.currentTarget.dataset.id,
    },//回复弹窗
    this.setData({
      commenT:data.commenT,
    })
    setTimeout(()=>{
      that.setData({
        focusfu:true
      })
      
    },300)
  },
  onCloseP(){
    let data=this.data,that=this
    data.commenT={
      show:false,
      txt:'',
      aid:0,
      cid:0,
    },//回复弹窗
    this.setData({
      commenT:data.commenT,
      commenO:false,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  getData(){
    let data=this.data,that=this
    app.fl()
    app.fg({
      action:'GetArticleInfo',
      openId:app.globalData.GetMembersInfo.openId,
      // openId:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',
      ArticleId:data.optionId,
    }).then(r=>{
      app.fh()
      if(r.data.Status=="OK"){
        let datar=r.data.Data
        data.funtionL.forEach(c=>{
          c.val=datar[c.data]>999?'999+':datar[c.data]
          c.choose=datar[c.chooseN]
        })
        r.data.Data.videoF=r.data.Data.ImageUrls.indexOf('.mp4')!=-1?true:false
        that.setData({
          funtionL:data.funtionL,
          dataInfo:r.data.Data
        })
        that.getComment()

      }else app.fa(r.data.Message)
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that=this
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
            that.setData({
              GetMembersInfo:dataR
            })
            console.log(that.GetMembersInfo)
            that.getData()
          } else {
            wx.redirectTo({
              url: "/pages/login/login"
            });
          }
        })
      })
    }else{
      that.getData()
      that.setData({
        GetMembersInfo:app.globalData.GetMembersInfo
      })
    } 
  },

  // 收藏点赞
  chooseFN(e){
    if(e.currentTarget.dataset.index==2) return
    let data=this.data,that=this
    let index=e.currentTarget.dataset.index,post={
      action:'GoodAndCollection',
      // openId:"oGsqu4qBG6Icub2iLYzI3MJGH4iQ",
       openId:app.globalData.GetMembersInfo.openId, 
      ForID:data.dataInfo.Id,
    }
    if(index==0) post.RelationType=3
    else post.RelationType=4
    app.fl()
    app.fg(post).then(r=>{
      app.fh() 
      if(r.data.Status=='OK'){

          data.funtionL[index].choose=data.funtionL[index].choose?false:true
          data.funtionL[index].val=data.funtionL[index].val=="999+"?"999+":(data.funtionL[index].choose?++data.funtionL[index].val:--data.funtionL[index].val)
          that.setData({
            funtionL:data.funtionL
          })
        
      }
      app.fa(r.data.Message)
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

  onPageScroll:function(){
    let a=false,that=this
    wx.createSelectorQuery().select('#people').boundingClientRect(function(rect){
      if(rect.top <250) a=true
      else a=false
      that.setData({
        fixBot:a
      })
    }).exec()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getComment()
    
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

      let data=this.data
      return{
  
    　　　　title: "头道惠",        // 默认是小程序的名称(可以写slogan等)
    　　　　path: "/fuPackageA/fuCirFriDet/fuCirFriDet?id="+data.optionId,
                
    　　　　imageUrl: '',   
    　　　　success: function(res){
    　　　　　　// 转发成功之后的回调
    　　　　　　if(res.errMsg == 'shareAppMessage:ok'){
                  app.fa("分享成功！")
    　　　　　　}
    　　　　},
    　　　　fail: function(){
    　　　　　　if(res.errMsg == 'shareAppMessage:fail cancel'){
    　　　　　　　　app.fa("已取消")
    　　　　　　}else if(res.errMsg == 'shareAppMessage:fail'){
      　　　　　　　　app.fa("分享失败！")
    　　　　　　}
    　　　　},
      }
    
  }
})