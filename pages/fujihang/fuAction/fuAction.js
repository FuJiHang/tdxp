const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.imgUrl,
    shenghezhon:false,
    ActivityId:0,
    timeList:[
      {
        name:'开始日期',
        val:'',
        plr:'请选择开始日期',
        min:0,
      },
      {
        name:'结束日期',
        val:'',
        plr:'请选择结束日期',
      },
    ],//活动时间
    storeList:[
      {
        name:'门店名称',
        val:'',
        plr:'请选择门店',
      },
      {
        name:'项目',
        val:'',
        plr:'请选择项目',
      },
      {
        name:'技师',
        val:'',
        plr:'请选择技师',
      },
      {
        name:'执行者',
        val:'',
        plr:'请选择执行者',
      },
    ],//所有信息
    listDataS:{
      data:[],
      finsh:false,
      page:1,
      seach:'',
    },//门店列表
    listDataP:{
      data:[],
      finsh:false,
      page:1,
    },//项目列表
    listDataT:{
      data:[],
      finsh:false,
      page:1,
      seach:''

    },//技师列表
    listDataE:[],//执行者
    choosePJ:[false,false,false],
    showStore:{
      show:false,
      index:0,
    },
    showTime:false,
    timeIndex:0,
    currentDate: new Date().getTime(),//默认时间
    minDate:new Date().getTime(),
    nameAC:'',//名字
    jdsAC:'',//聚到商
    gsdAC:'',//归属地
    beizhu:'',//备注
    storeId:0,
    Excutor:'',//执行者
    zxz:'',//执行者
    teachListC:[],//技师选择列表
  },
  // 
  seaChFN(e){
    this.setData({
      [e.currentTarget.dataset.name]:e.detail.value
    })
  },

  // 搜索门店
  seachMD(){
    let data=this.data
    let listDataS={
      data:[],
      finsh:false,
      page:1,
      seach:data.listDataS.seach
    }//门店列表
    this.setData({
      listDataS:listDataS
    })
    this.getStore()
  },

  //弹窗时间
  openTime:function(e){
    let data=this.data
    if(data.shenghezhon) return
    this.setData({
      showTime:true,
      timeIndex:e.currentTarget.dataset.index,
    })
  },
  // 关闭时间弹窗
  onClose(e) {
    let data=this.data
    if(data.shenghezhon&&data.showStore.index!=2) {
      this.setData({ 
        [e.target.dataset.name]: false ,
      })
      return
    }
    let pNum=0,tNum=0,eNum=0
    data.listDataP.data.forEach(c=>{
      if(c.choose) pNum++
    })
    data.teachListC=this.rrrrr(data.teachListC)
    data.teachListC.forEach(c=>{
      if(c.choose) tNum++
    })
    data.listDataE.forEach(c=>{
      if(c.choose) {
        eNum++
        data.Excutor=c.UserId
      }
    })
    this.setData({ 
      [e.target.dataset.name]: false ,
      ['storeList[1].plr']:data.listDataP.data.length==pNum?'已选择全部':'已选择'+pNum+'个',
      ['storeList[2].plr']:data.teachListC.length==tNum?'已选择全部':'已选择'+tNum+'位',
      Excutor:eNum?data.Excutor:''
    });
    if(!data.zxz){
      this.setData({ 
        ['storeList[3].plr']:data.listDataE.length==eNum?'已选择全部':'已选择'+eNum+'位',
      });
    }
  },

  // 去重
  rrrrr(arr){
    var result = [];
    var obj = {};
    for(var i =0; i<arr.length; i++){
      if(!obj[arr[i].UserId]){
          result.push(arr[i]);
          obj[arr[i].UserId] = true;
        }
    }
    return result
  },
  // 选择时间
  onInput:function(event) {
    // console.log(event)
    this.setData({
      currentDate: event.detail
    });
  },
  okTime(){ 
    let data=this.data
    // console.log(app.fttst(data.currentDate))
    this.setData({
      ["timeList["+data.timeIndex+"].plr"]:app.fttst(data.currentDate),
      ["timeList["+data.timeIndex+"].val"]:app.fttst(data.currentDate),
      showTime:false
    })
  },
  // 输入
  inputFN(e){
    this.setData({
      [e.target.dataset.name]:e.detail.value
    })
  },
  openChoose(e){
    let data=this.data
    let index=e.currentTarget.dataset.index
    let showStore={
      show:true,
      index:index
    }
    if(index==0&&data.shenghezhon) return
    if(index==1&&data.storeId==0&&!data.shenghezhon){
      app.fa('请先选择门店')
      return
    }
    this.setData({
      showStore:showStore,
    })
  },  

  // 获取门店
  getStore(){
    let data=this.data,that=this
    if(data.listDataS.finsh) return 

    let post={
      action: 'Search',
      tag: 'store',
      content:data.listDataS.seach,
      Longitude: app.globalData.Longitude,
      Latitude: app.globalData.Longitude,
      pageindex: data.listDataS.page,
      pagesize: 10,
      bindtype: 1,
    }
    if(data.zxz) post.exid=app.globalData.GetMembersInfo.UserId
    else post.thid=app.globalData.GetMembersInfo.UserId
    app.fg(post).then(r=>{
      if(r.data.Status!="NO"){
        let datar=r.data.Models
        for(let i=0;i<datar.length;i++){
            data.listDataS.data.push(datar[i])
        }
        if(datar.length<10){
          data.listDataS.finsh=true
        }
        data.listDataS.page++
        that.setData({
          listDataS:data.listDataS
        })
      }else app.fa(r.data.Message)
    })
  },

  // 获取项目
  getProject(showStore){
    let data=this.data
    if(data.listDataP.finsh) return 
    app.fg({
      action: 'GetProducts',
      // openId: 'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',
      openId:app.globalData.GetMembersInfo.openId,
      Type: 2,
      StoreId: data.storeId,
      pageIndex: data.listDataP.page,
      pageSize: 10,
    }).then(r=>{
      app.fh()
      if(r.data.Status=="OK"){
        let getdata=r.data.Data
        for(let i=0;i<getdata.length;i++){
          getdata[i].choose=data.choosePJ[1]
          data.listDataP.data.push(getdata[i])
        }
        if(getdata.length<10) data.listDataP.finsh=true
        data.listDataP.page++
        this.setData({
          listDataP:data.listDataP,
        })
      }else app.fa("获取数据失败！")
    })
  },

  // 选择项目
  ChangeXM(e){
   
    let index=e.currentTarget.dataset.index
    let data=this.data
    if(data.shenghezhon) return
    this.setData({
      ["listDataP.data["+index+"].choose"]:data.listDataP.data[index].choose?false:true
    })
  },
  allFN(e){
    let dd=e.currentTarget.dataset
    let data=this.data
    this.setData({
      ["choosePJ["+dd.index+"]"]:dd.data      
    })
    let list=[]
    if(dd.index==1){
      data.listDataP.data.forEach(c=>{
        c.choose=dd.data
        list.push(c)
      })
      this.setData({
        ['listDataP.data']:list
      })
     
    }
    if(dd.index==2){
      data.listDataT.data.forEach(c=>{
        c.choose=dd.data
        list.push(c)
      })
      this.setData({
        ['listDataT.data']:list,
        teachListC:list
      })
      
    }
  },
  seachJS(){
    let data=this.data
    let listDataT={
      data:[],
      finsh:false,
      page:1,
      seach:data.listDataT.seach

    }//技师列
    this.setData({
      listDataT:listDataT
    })
    this.getTeach()
  },



  // 获取技师
  getTeach(){
    let data=this.data,that=this
    app.fg({ 
      action: 'GetTeamMembers',
      openId: app.globalData.GetMembersInfo.openId,
      role: 'head',
      PageIndex:data.listDataT.page,
      PageSize:9999,
      Keyword:data.listDataT.seach,
      IsExcutor:data.zxz?1:''
    }).then(r=>{
      if(r.errMsg=="request:ok"){
        let i=0
        data.teachListC.forEach(ls=>{
          if(ls.Name.indexOf(data.listDataT.seach)!=-1) data.listDataT.data.push(ls)
        })
        
        r.data.Technicians.forEach(c=>{
          c.choose=data.choosePJ[2]
          i++
          data.listDataT.data.push(c)
          data.teachListC.push(c)
        })
        console.log( data.listDataT.data,'===222==')
        data.listDataT.data=that.rrrrr(data.listDataT.data)
        console.log( data.listDataT.data,'===33==')
        if(data.teachListC.length==0) data.teachListC=data.listDataT.data
        if(data.listDataE.length==0){
          r.data.Excutors.forEach(e=>{
            e.choose=false
            data.listDataE.push(e)
          })
          that.setData({
            listDataE:data.listDataE
          })
        }
        
    
        data.listDataT.page++
        this.setData({
          ['listDataT.page']:data.listDataT.page,
          ['listDataT.data']:data.listDataT.data,
          teachListC:data.teachListC,
          ['listDataT.finsh']:i<9999?true:false,
        })
      }else app.fa("查询失败！")
    })
  },
  ChangeTC(e){
    let index=e.currentTarget.dataset.index
    let data=this.data
    this.setData({
      ["listDataT.data["+index+"].choose"]:data.listDataT.data[index].choose?false:true
    })
    for(let i=0;i<data.teachListC.length;i++){
      if(data.teachListC[i].UserId==data.listDataT.data[index].UserId){
        // if(!data.listDataT.data[index].choose) {
          data.teachListC.splice(i,1)
          data.teachListC.push(data.listDataT.data[index])
          // break
        // } 
      }else{
        if(data.listDataT.data[index].choose){
          data.teachListC.push(data.listDataT.data[index])
          // break
        } 
      }
    }

     

    this.setData({
      teachListC:data.teachListC
    })
    
  },
  ChangeTE(e){
    let index=e.currentTarget.dataset.index
    let data=this.data
    let gai=[]
    data.listDataE.forEach((e,i)=>{
      if(i==index){
        e.choose=e.choose?false:true
      }else  e.choose=false
      gai.push(e)
    })
    this.setData({
      listDataE:gai
    })
  },

  // 选择门店
  storeFN(e){
    let data=this.data
    this.setData({
      storeId:e.currentTarget.dataset.index.StoreId,
      ['storeList[0].plr']:e.currentTarget.dataset.index.StoreName,
      ['showStore.show']:false,
      ['storeList[1].plr']:data.choosePJ[1]?'已选择全部':'请选择项目',
    })
    data.listDataP.finsh=false
    data.listDataP.page=1
    data.listDataP.data=[]
    this.getProject()
  },

  // 去重
  

  // 提交
  submitFN(){
    let data=this.data
    // if(!data.storeId) return app.fa('请选择门店')
    let ps='',ts='',pNum=0,tNum=0

    data.listDataP.data.forEach(c=>{
      if(c.choose){
        pNum++
        if(!ps) ps=c.ProductId
        else ps+=','+c.ProductId 
      }
    })
    data.teachListC.forEach(c=>{
      console.log(c)
      if(c.choose){
        tNum++
        if(data.shenghezhon){
          if(!ts) ts=c.Id
          else ts+=','+c.Id
        }else{
          if(!ts) ts=c.UserId
          else ts+=','+c.UserId
        }
        
      }
    })
    app.fl('正在提交...')
    if(data.shenghezhon){
      app.fg({
        action:'TechniciaHeadRequestActivity',
        openid:app.globalData.GetMembersInfo.openId,
        RequestType:2,
        ActivityId:data.ActivityId,
        Technicians:data.teachListC.length==tNum&&data.choosePJ[2]?1:ts,
        Place:data.gsdAC,
        Channels:data.jdsAC,
      }).then(r=>{
        app.fh()
        if(r.data.Status=='OK'){
          wx.navigateBack({
            delta: 1
            })
        }
        app.fa(r.data.Message)
        })
        return
    }
    if(!data.beizhu) return app.fa('请输入备注')
    app.fg({
      action:'CheckContentSecurity', 
      Type:0,
      FormData:data.nameAC+data.beizhu
    }).then(t=>{
      if(t.data.Status!="OK"){
        app.fh()
        app.fa(t.data.Message)
      }else{
        
        app.fg({
          action:'TechniciaHeadRequestActivity',
          openid:app.globalData.GetMembersInfo.openId,
          StoreId:data.storeId,
          ProductIds:data.listDataP.data.length==pNum&&data.choosePJ[1]?1:ps,
          Technicians:data.teachListC.length==tNum&&data.choosePJ[2]?1:ts,
          StartDate:data.timeList[0].val,
          EndDate:data.timeList[1].val,
          ActivityName:data.nameAC,
          ActivityRemark:data.beizhu,
          ExcutorId:data.Excutor,
          IsExcutor:data.zxz?1:'',
          Place:data.gsdAC,
          Channels:data.jdsAC,
        }).then(r=>{
          app.fh()
          if(r.data.Status=='OK'){
            wx.navigateBack({
              delta: 1
              })
          }
          app.fa(r.data.Message)
        })

      }
    })

    
  },


  getDATA(){
    let data=this.data,that=this
    app.fl()
    app.fg({
      action:'GetTechniciaHeadActivity',
      // openid:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ'
      openId:app.globalData.GetMembersInfo.openId,
      IsExcutor:data.zxz?1:''
    }).then(r=>{
      app.fh()
      if(r.data.Status=="OK"){
        let datar=r.data.Data
        // if(datar.Products){
        //   data.timeList[0].plr=datar.StartDate
        //   data.timeList[1].plr=datar.EndDate
        //   data.storeList[0].plr=datar.StoreName
        //   let pn=0,tn=0
        //   datar.Products.forEach(c=>{
        //     c.choose=true
        //     data.listDataP.data.push(c)
        //     pn++
        //   })
        //   datar.Technicians.forEach(c=>{
        //     c.choose=c.inAct
        //     data.listDataT.data.push(c)
        //     if(c.inAct) tn++
        //   })
        //   data.storeList[1].plr='已选择'+pn+'个'
        //   data.storeList[2].plr='已选择'+tn+'位'
        //   data.listDataP.finsh=true
        //   data.listDataT.finsh=true
        //   data.beizhu=datar.Remark
        //   that.setData({
        //     timeList:data.timeList,
        //     storeList:data.storeList,
        //     listDataP:data.listDataP,
        //     listDataT:data.listDataT,
        //     beizhu:data.beizhu,
        //     shenghezhon:true,
        //     nameAC:datar.ActivityName,
        //     ActivityId:datar.ActivityId,
        //   })

        // }else{
          this.getStore()
          this.getTeach()
        // }
      }else app.fa(r.data.Message)
      console.log(r)   
    })
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.storeList.pop()
    console.log(this.data.storeList)
    if(options.zxz){
      this.setData({
        zxz:true,
        storeList:this.data.storeList,
      })
    }
    
    this.getDATA()
    
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