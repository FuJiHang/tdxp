const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    UserId:0,
    imgUrl:app.imgUrl,
    active:0,
    allData:{},
    functionList:[
      {
        name:'作品',
        num:0,
        data:'Total',
      },
      {
        name:'动态',
        num:0,
        data:'Total',
      },
      {
        name:'喜欢',
        num:0,
        data:'LikeTotal',
      },
    ],
    page:1,
    page2:1,
    finsh:false,
    finsh2:false,
    dataList:[],
    likeList:[],
    showPlay:-1,
    funL:[
      {
        name:'分享',
        img:app.imgUrl+'share_pyq.png',
      },
      {
        name:'评论',
        img:app.imgUrl+'news_pyq.png',
      },
      {
        name:'赞',
        img:app.imgUrl+'like_pyq.png',
        img1:app.imgUrl+'like_acv_pyq.png',
      },
    ],
    nearTop:false,
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
    tuijianId:0,
    findex:0,
    openDet:true,
  },

  // 
  collectFN(){
    this.setData({
      openDet:!this.data.openDet
    })
  },

    // 搜索字
    seaChFN(e){ 
      this.setData({
        [e.currentTarget.dataset.name]:e.detail.value
      })
    },
  

    // 第一层回复
  submitComT(){
    let data=this.data,that=this

    app.fg({
      action:'CheckContentSecurity', 
      Type:0,
      FormData:data.commenT.txt,
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
          ArticleID:data.commenO?data.tuijianId:data.commenT.aid,
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
            data.dataList[data.findex].CommentCount+=1
            that.setData({
              CommentList:CommentList,
              dataList:data.dataList
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

  // 
  commentOne(e){
    console.log('===========');
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
     ArticleId:data.tuijianId,
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

  //回复弹窗
  onCloseP(){
    let data=this.data,that=this
    data.commenT={
      show:false,
      txt:'',
      aid:0,
      cid:0,
    },
    this.setData({
      commenT:data.commenT,
      commenO:false,
    })
  },

  // 播放
  playFN(e){
    this.setData({
      showPlay: e.currentTarget.dataset.index
    })
   
  },

  onChange(event) {
    this.setData({
      active:event.detail.index
    })
    this.getData()
  },

  // 监听顶部
  changeTop(e){
    if(e.detail.scrollTop<0){
      this.setData({
        nearTop:true
      })
    }else{
      this.setData({
        nearTop:false
      })
    }
    // console.log(e);
  },

  // 
  callFN(){
    wx.makePhoneCall({
      phoneNumber:this.data.allData.CellPhone
    })
  },

  toStore(){
    wx.navigateTo({
      url:'/pages/fujihang/fuStoreDet/fuStoreDet?id='+this.data.allData.StoreId
    })
  },

  // // 关注
  Favorite(){
    console.log("==========");
    let data=this.data,that=this
    // if(data.allData.IsFavorite) return
    app.fl()
    app.fg({
      action:'GoodAndCollection',
      // openId:"oGsqu4qBG6Icub2iLYzI3MJGH4iQ",
       openId:app.globalData.GetMembersInfo.openId,
      RelationType:2,
      ForID:data.UserId
    }).then(r=>{
      app.fh() 
      if(r.data.Status=='OK'){
        
        that.setData({
          ['allData.IsFavorite']:data.allData.IsFavorite?false:true,
        })
      }
      app.fa(r.data.Message)
    })
  },

  // 
  getData(){
    console.log(app.globalData);
    let data=this.data,that=this
    if(data.active==2?data.finsh2:data.finsh) return
    app.fl()
    app.fg({
      action:'LoadAttention',
      // openId:"oGsqu4qBG6Icub2iLYzI3MJGH4iQ",
       openId:app.globalData.GetMembersInfo.openId,
      pageIndex:data.active==2?data.page2:data.page,
      pageSize:10,
      IsMyArticle:true, 
      UserId:data.UserId?data.UserId:app.globalData.GetMembersInfo.UserId,
    }).then(r=>{
      app.fh() 
      if(r.data.Status=='OK'){
        let datar=r.data.Data
        // if(data.active==2){
          r.data.LikeData.forEach(c=>{
            if(c.ImageUrls.indexOf('.mp4')!=-1) c.isVideo=true
            c.kaisiTime=c.CreateDate.slice(0,10)
            data.likeList.push(c)
          })
          that.setData({
            likeList:data.likeList,
            page2:++data.page2,
            finsh2:datar.length<10?true:false,
          })
        // }else{
          datar.forEach(c=>{
            if(c.ImageUrls.indexOf('.mp4')!=-1) c.isVideo=true
            c.kaisiTime=c.CreateDate.slice(0,10)
            c.isDelect=false
            data.dataList.push(c)
          })
          that.setData({
            dataList:data.dataList,
            page:++data.page,
            finsh:datar.length<10?true:false,
          })
        // }
        data.functionList.forEach(c=>{
          c.num=r.data[c.data]
        })
       that.setData({
        allData:r.data,
        functionList:data.functionList
       })
      }else app.fa(r.data.Message)
    })
  },



  //  点击功能
  chooseFN(e){
    let chuan=e.currentTarget.dataset,data=this.data,that=this
    console.log(chuan);
    switch (chuan.index) {
      case 0:
        
      break;
      case 1:
        this.setData({
          tuijianId:chuan.id,
          isComShow:true,
          findex:chuan.findex,
        })
        this.getComment()
      break;
      case 2:
        app.fl()
        app.fg({
          action:'GoodAndCollection',
          // openId:"oGsqu4qBG6Icub2iLYzI3MJGH4iQ",
           openId:app.globalData.GetMembersInfo.openId, 
          ForID:data.dataList[chuan.findex].Id,
          RelationType:3
        }).then(r=>{
          app.fh() 
          if(r.data.Status=='OK'){
            // ArticleLikeCount
            data.dataList[chuan.findex].IsArticleLike= data.dataList[chuan.findex].IsArticleLike?false:true
            data.allData.ArticleLikeCount=="999+"?"999+":(data.dataList[chuan.findex].IsArticleLike?++data.allData.ArticleLikeCount:--data.allData.ArticleLikeCount)
            data.dataList[chuan.findex].ArticleLikeCount=="999+"?"999+":(data.dataList[chuan.findex].IsArticleLike?++data.dataList[chuan.findex].ArticleLikeCount:--data.dataList[chuan.findex].ArticleLikeCount)
            
              that.setData({
                allData:data.allData,
                dataList:data.dataList
              })
            
          }
          app.fa(r.data.Message)
        })

      break;
     
    }
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      UserId:options.UserId?options.UserId:''
    })
    let data=this.data,that=this
    console.log(app.globalData,'==');
    if(!app.globalData.GetMembersInfo||!app.globalData.GetMembersInfo.UserId||!app.globalData.GetMembersInfo.openId){
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
    }else{
      that.getData()
    } 
  },

  // 
  toJitterFN(e){
    

    let datac=e.currentTarget.dataset,data=this.data
    if(data.openDet){
      setTimeout(()=>{
      
      let chuang=encodeURIComponent(JSON.stringify(data.dataList));
      wx.navigateTo({
        url:'/fuPackageA/fuJitterOne/fuJitterOne?chuang='+chuang+'&page='+data.page+'&index='+datac.index+'&UserId='+data.UserId
      })
    },300)
    }else{
      this.setData({
        ['dataList['+datac.index+'].isDelect']:!datac.det
      })
    }
   
    



  },

  // 删除
  delectFN(){
    let data=this.data,that=this,id='',i=0
    data.dataList.forEach(c=>{
      if(c.isDelect){
        id+=i?','+c.Id:c.Id
        i++
      }
    })
    app.fl()
    app.fg({
      action:'ArticleDelete',
      openId:app.globalData.GetMembersInfo.openId,
      Articleids:id,
    }).then(r=>{
      app.fh() 
      if(r.data.Status=='OK'){
        data.page=1
        data.page2=1
        data.finsh=false
        data.finsh2=false
        data.dataList=[]
        data.likeList=[]
        that.getData()
      }
      app.fa(r.data.Message)
      console.log(r) 
    })
  },


  toJitterFNX(e){
    let datac=e.currentTarget.dataset,data=this.data
    setTimeout(()=>{
      
      let chuang=encodeURIComponent(JSON.stringify(data.likeList));
      wx.navigateTo({
        url:'/fuPackageA/fuJitterOne/fuJitterOne?chuang='+chuang+'&page='+data.page+'&index='+datac.index+'&UserId='+data.UserId+'&like=true'
      })
    },300)
    
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

  // 
  onPageScroll(){

    
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
      path: '/fuPackageA/fuJitterPeo/fuJitterPeo?UserId='+data.UserId,
      imageUrl: '',
      success: (res) => {
        app.fa('转发成功')
      },
      fail: (res) => {
        app.fa('转发失败')
      }
    }
  }
})