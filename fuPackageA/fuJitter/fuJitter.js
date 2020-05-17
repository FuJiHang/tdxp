const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTH:0,





    start:0,
    wH:0,
    top:0,
    sTop:0,
    show:0,
    list:5,
    imgUrl:app.imgUrl,
    navTop:[
      {
        name:'推荐'
      },
      {
        name:'关注'
      },
    ],
    funtion:[
      {
        img:app.imgUrl+'like_pyq.png',
        img1:app.imgUrl+'like_acv_pyq.png',
        val:22,
        data:'ArticleLikeCount',
        choose:false,
        chooseN:'IsArticleLike',
      },
      {
        img:app.imgUrl+'news_pyq.png',
        val:22,
        data:'CommentCount',
      },
      {
        img:app.imgUrl+'share_pyq.png',
        val:0,

      },
    ],
    choose:0,
    tuijian:{
      finsh:false,
      data:[],
      page:1,
    },
    seach:"",//搜索
    navBar: [{
      name: '头道惠',
      img:'sySy.png?2',
      to:'/pages/fujihang/fuIndexG/fuIndexG',
    },
    {
      name: '商城',
      img: 'sySc.png',
      to:'/pages/fujihang/fuBeaStore/fuBeaStore',
    },
    {
      img: 'syAdd.png?2',
      to:'/fuPackageA/fuRelease/fuRelease'
    },
    {
      name: '消息',
      img:'syYy.png?2',
      to:'/pages/technician/technician',
    },
    {
      name: '我',
      img:"syMy.png?2",
      to:'/fuPackageA/fuJitterPeo/fuJitterPeo',
    },
  ], //导航条
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
  focusfu:false,
  commenO:false,
  isComShow:false,
  quanOrBan:true,
  muted:false,//选音频播放的
  loop:false,//循环播放
  },
  
  // 
  ComShowFN(){
    let CommentList={
      data:[],
      finsh:false,
      page:1,
    }//聊天信息
    this.setData({
      isComShow:false,
      CommentList:CommentList
    })
  },

  // 
  finshFN(e){
    let data=this.data,that=this
    this.setData({
      showTH:e.detail.current
    })
    data.funtion.forEach(c=>{
      c.val=data.tuijian.data[data.showTH][c.data]
      c.choose=data.tuijian.data[data.showTH][c.chooseN]
    })
    that.setData({
      funtion:data.funtion,
    })
    if(data.showTH>data.tuijian.data.length-4) {
      if(data.choose==1) this.getListTH(false)
      else this.getListTH(true)
    }
  },

  // 
  getVideo(e){
    let cc=e.detail
    if( cc.height/cc.width>1.6){
      this.setData({
        quanOrBan:true
      })
    }else{
      this.setData({
        quanOrBan:false
      })
    }
    
  },

  // 结束播放
  bindtimeupdateFN(e){
   
    let det=e.detail,that=this
    if(det.currentTime<=det.duration&&det.currentTime+0.25>=det.duration){
      this.setData({
        muted:false,
      })
      setTimeout(()=>{
        that.setData({
          muted:true
        })
        wx.createAudioContext('myAudio').play()
      },10)
    }

    // let that=this
    // this.setData({
    //   loop:true
    // })
    // setTimeout(()=>{
    //   that.setData({
    //     loop:false
    //   })
    // },500)
  },

  // 
  chooseFN(e){
    let index=e.currentTarget.dataset.index,tuijian={
      finsh:false,
      data:[],
      page:1,
    }
    this.setData({
      choose:index,
      tuijian:tuijian,
    })
    if(index==0)  this.getListTH(true)
    else this.getListTH(false)
    
    
  },

  // 
  toFN(e){
    wx.navigateTo({
      url:e.currentTarget.dataset.url+"?onfous=true"
    })
    
  },
    // 跳转页面
    toFNNav(e){
      wx.switchTab({
        url: e.currentTarget.dataset.to
      });
      wx.navigateTo({
        url: e.currentTarget.dataset.to
      });
    },


  sfun(e){
    this.setData({
      start:e.changedTouches[0].clientY
    })
  },
  hfun(e){
    let data=this.data,that=this
    this.setData({
      sTop:data.top
    })
   
    let mi=parseInt(data.top/data.wH)
    
    if((e.changedTouches[0].clientY-this.data.start)<-200){
      mi++ 
      if(mi>=(data.list-1)) mi=data.list-1
    this.toNext(mi*data.wH)
    }else if(200>(e.changedTouches[0].clientY-this.data.start)&&(e.changedTouches[0].clientY-this.data.start)>-200){
      this.toNext(mi*data.wH)
    }else{
      mi=mi==0?0:mi--
      this.toNext(mi*data.wH)
    }
    setTimeout(()=>{ 
      data.funtion.forEach(c=>{
        c.val=data.tuijian.data[mi][c.data]
        c.choose=data.tuijian.data[mi][c.chooseN]
      })
      that.setData({
        show:mi,
        funtion:data.funtion,
      })
    },200)
    if(data.show>data.tuijian.data.length-4) {
      if(data.choose==1) this.getListTH(false)
      else this.getListTH(true)
    }
  },
  playMusic(e){
    wx.createAudioContext('myAudio').pause()
    wx.createAudioContext('myAudio').play()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    

    let data=this.data,that=this
    this.setData({
      wH:wx.getSystemInfoSync().windowHeight
    })
    data.tuijian={
      finsh:false,
      page:parseFloat(options.page) ,
      data:JSON.parse(decodeURIComponent(options.chuang))
    }
    data.funtion.forEach(c=>{
      c.val=data.tuijian.data[0][c.data]
      c.choose=data.tuijian.data[0][c.chooseN]
    })
    that.setData({
      funtion:data.funtion,
    })
    this.setData({
      tuijian:data.tuijian,
      choose:parseFloat(options.choose)
    })
    if(options.choose==0) this.getListTH(true)
    else this.getListTH(false)
  
  },


  toFNGR(){
    let data=this.data,that=this
    // console.log(data.tuijian.data[data.show]);
    wx.navigateTo({
      // url:'/fuPackageA/fuJitterPeo/fuJitterPeo?UserId='+data.tuijian.data[data.show].UserId
      url:'/fuPackageA/fuJitterPeo/fuJitterPeo?UserId='+data.tuijian.data[data.showTH].UserId
      
    })
  },

  // 
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
     ArticleId:data.tuijian.data[data.showTH].Id,
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
  // 
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
  // 
  openfutionFN(e){
      let data=this.data,that=this
      switch (e.currentTarget.dataset.index) {
        case 0:
            app.fl()
            app.fg({
              action:'GoodAndCollection',
              // openId:"oGsqu4qBG6Icub2iLYzI3MJGH4iQ",
               openId:app.globalData.GetMembersInfo.openId, 
              ForID:data.tuijian.data[data.showTH].Id,
              RelationType:3
            }).then(r=>{
              app.fh() 
              if(r.data.Status=='OK'){
                data.tuijian.data[data.showTH].IsArticleLike=data.funtion[0].choose?false:true
                data.funtion[0].choose=data.funtion[0].choose?false:true
                data.tuijian.data[data.showTH].ArticleLikeCount=="999+"?"999+":(data.funtion[0].choose?++data.tuijian.data[data.showTH].ArticleLikeCount:--data.tuijian.data[data.showTH].ArticleLikeCount)
                  data.funtion[0].val=="999+"?"999+":(data.funtion[0].choose?++data.funtion[0].val:--data.funtion[0].val)

                  that.setData({
                    tuijian:data.tuijian,
                    funtion:data.funtion
                  })
                
              }
              app.fa(r.data.Message)
            })
        break;
        case 1:
          
          this.getComment()
          this.setData({
            isComShow:true
          })
        break;
        case 2:

          this.onShareAppMessage()



          console.log("33333333");
          
        break;
      
      
      }
  },

  // 
  // 第一层回复
  submitComT(){
    let data=this.data,that=this

    app.fg({
      action:'CheckContentSecurity', 
      Type:0,
      FormData:data.commenT.txt
    }).then(t=>{
      if(t.data.Status!="OK"){
        app.fa(t.data.Message)
      }else{
        app.fl()
        app.fg({
          action:'SendComment',
          // openId:"oGsqu4qBG6Icub2iLYzI3MJGH4iQ",//me
          // openId:"oGsqu4kr4cw0lP0vIV5sTDoxa66k",
          openId:app.globalData.GetMembersInfo.openId,
          ArticleID:data.commenO?data.tuijian.data[data.showTH].Id:data.commenT.aid,
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
            data.tuijian.data[data.showTH].CommentCount+=1
            that.setData({
              CommentList:CommentList,
              ['funtion[1].val']:++data.funtion[1].val,
              tuijian:data.tuijian
            })
            setTimeout(()=>{
              that.getComment()
            },1400)
          }
          app.fa(r.data.Message)
        })
      }
    })

    
  },

  // // 朋友圈列表(推荐)
  getListTH(istuijian){
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
      IsRecommended:istuijian,
      // lat:data.LatiLongitude.Latitude,
      // lng:data.LatiLongitude.Longitude,
    }).then(r=>{
      app.fh() 
      if(r.data.Status=='OK'){
        let datar=r.data.Data,a=data.tuijian.data
        if(data.tuijian.page==1){
          data.funtion.forEach(c=>{
            c.val=datar[0][c.data]
            c.choose=datar[0][c.chooseN]
          })
          this.setData({
            funtion:data.funtion,
          })
        }
      
        for(let i=0;i<datar.length;i++){
          if(datar[i].ArticleLikeCount>999) datar[i].ArticleLikeCount="999+"
          if(datar[i].ImageUrls.indexOf('.mp4')!=-1) datar[i].isVideo=true
          a.push(datar[i])
        }
        this.setData({
          ['tuijian.data']:a,
          ['tuijian.finsh']:datar.length<10?true:false,
          ['tuijian.page']:++data.tuijian.page,
          funtion: data.funtion,
        })
        this.setData({
          list:data.tuijian.data.length
        })
      }else app.fa(r.data.Message)
    })
  },


  // 旋转
  toNext(mi){
    this.setData({
      sTop:mi
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
  lFun(e){
    this.setData({
      top:e.detail.scrollTop
    })
  },

  onPageScroll:function(e){
    // this.setData({
    //   top:e.scrollTop
    // })
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
   


    let data=this.data,that=this
    return {
      title: '头道惠',
      path: '/fuPackageA/fuJitter/fuJitter?chuang='+encodeURIComponent(JSON.stringify(data.tuijian.data.slice(data.showTH,(data.tuijian.page*10-1))))+"&page="+data.tuijian.page+"&choose="+data.choose,
      imageUrl: "",
      success: (res) => {
        app.fa('转发成功')
      },
      fail: (res) => {
        app.fa('转发失败')
      }
    }

  }
})