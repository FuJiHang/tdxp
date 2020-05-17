const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.imgUrl,
    // openId:app.globalData.GetMembersInfo.openId
    // openId:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',
    functionList:[
      {
        name:'线上业绩',
        page:1,
        data:[],
        finsh:false,
        post:0,
      },
      {
        name:'线下业绩',
        page:1,
        data:[],
        finsh:false,
        post:0,
      },
    ],
    choose:[false,false],
    prjXfj:{
      prj:0,
      Xfj:0,
    },//选择的项目修复级数量
    active:0,
    dataList:{},
    addImg:{
      choose:false,
      img:'add_2.png',
      imgc:'',
    },

   
    submitList:[
      { 
        name:"项目：",
        val:'',
        t:'请输入项目名称'
      },
      { 
        name:"付款金额：",
        val:'',
        t:'请输入付款金额'
      },
      { 
        name:"打款人：",
        val:'',
        t:'请输入打款人'
      },
    ],
    listDataT:{
      data:[],
      finsh:false,
      page:1,
    },//技师列表
    storeList:{
      data:[],
      finsh:false,
      page:1,
    },//门店列表
    teacher:{
      show:false,
      name:'',
      id:'',
    },
    store:{
      show:false,
      name:'',
      id:'',
    },
    project:{
      id:0,
      sid:0
    },
 
    postDeclare:[
      {
        store:{
          show:false,
          name:'',
          id:'',
        },
        teacher:{
          show:false,
          name:'',
          id:'',
        },
        djjxfjD:[
          {
            choose:false,
            name:"线上",
          },
          {
            choose:false,
            name:"线下",
          }
        ],
        djjxfjX:[
          {
            choose:false,
            name:"线上",
          },
          {
            choose:false,
            name:"线下",
          }
        ],
        submitList:[
          { 
            name:"项目：",
            val:'',
            t:'请输入项目名称'
          },
          { 
            name:"付款金额：",
            val:'',
            t:'请输入付款金额'
          },
          { 
            name:"打款人：",
            val:'',
            t:'请输入打款人'
          },
          { 
            name:"备注：",
            val:'',
            t:'请输入备注'
          },
        ],
        addImg:{
          choose:false,
          img:'add_2.png',
          imgc:'',
        },
       
      },
    ],
    sIndex:0,
    tIndex:0,
    zxzOrtdz:0,//0执行者1团队长
    LatiLongitude:{},//经纬度
    Remark:'',//线上业绩备注

  },
  openFN(e){
    this.setData({
      ['teacher.show']:true,
      tIndex:e.currentTarget.dataset.index
    })
  },
  openSFN(e){
    
    this.setData({
      ['store.show']:true,
      sIndex:e.currentTarget.dataset.index
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      zxzOrtdz:options.zxzOrtdz
    })
    let that=this
    this.getData()
    this.getTeach()
    wx.getStorage({
      key: 'LatiLongitude',
      success (res) {
        that.setData({
          LatiLongitude:res.data
        })
        that.getStore()
      }
    })
  },
  onClose(){
    this.setData({
      ["teacher.show"]:false,
    })
  },
  onSClose(){
    this.setData({
      ["store.show"]:false,
    })
  },

  getData(){
    let data=this.data,that=this
    if(data.active) return
    if(data.functionList[0].finsh) return app.fa('没有更多的了')
    app.fl()
    app.fg({
      action: 'SalesGoalsList',
      // openId:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',
      openId:app.globalData.GetMembersInfo.openId,
      PageIndex: data.functionList[0].page,
      PageSize: 10,
      Role: 0,
      SearchBy: 2,
      Role:data.zxzOrtdz
    }).then(r=>{
      app.fh()
      if(r.data.Status=="OK"){
        let datar=r.data.splittin_get_response.Orders
        let num=0
        
        
        datar.forEach(c=>{
          num++
          c.djjxfjD=[
            {
              choose:c.IsIncludeCoupon=="False"?false:true,
              name:"线上",
            },
            // {
            //   choose:false,
            //   name:"线下",
            // }
          ],
          c.djjxfjX=[
            {
              choose:c.IsIncludeRestorer=="False"?false:true,
              name:"线上",
            },
            // {
            //   choose:false,
            //   name:"线下",
            // }
          ],
          c.isChoose=false
          data.functionList[data.active].data.push(c)
        })
        if(num<10) data.functionList[0].finsh=true
        data.functionList[data.active].page++
        this.setData({
          functionList:data.functionList,
          dataList:r.data.splittin_get_response
        })
      }else app.fa(r.data.Message)
    })
  },
  // 备注更新
  changeRem(e){
    this.setData({
      Remark:e.detail.value
    })
  },
  // 
  djjxfjFNT(e){

    let data=e.currentTarget.dataset
    console.log(data.xz)
    let aa='',bb=''
    if(data.i=="djjxfjD"){
      aa='postDeclare['+data.c+'].djjxfjD.['+data.si+'].choose'
      bb='postDeclare['+data.c+'].djjxfjD'
    }
    else{
      aa='postDeclare['+data.c+'].djjxfjX.['+data.si+'].choose'
      bb='postDeclare['+data.c+'].djjxfjX'
    } 
    
    this.setData({
      [bb]:[
        {
          choose:false,
          name:"线上",
        },
        {
          choose:false,
          name:"线下",
        }
      ],
    })
    console.log(data.xz)
    console.log(typeof data.xz)
    this.setData({
     [aa]:data.xz?false:true
    })
  },

  // 
  djjxfjFN(e){
    return
    let data=e.currentTarget.dataset
    let aa='',bb=''
    if(data.i=="djjxfjD"){
      aa='functionList[0].data['+data.c+'].djjxfjD.['+data.si+'].choose'
      bb='functionList[0].data['+data.c+'].djjxfjD'
    }
    else{
      aa='functionList[0].data['+data.c+'].djjxfjX.['+data.si+'].choose'
      bb='functionList[0].data['+data.c+'].djjxfjX'
    } 
    console.log(data.xz)
    this.setData({
      [bb]:[
        {
          choose:false,
          name:"线上",
        },
        {
          choose:false,
          name:"线下",
        }
      ],
    })
    console.log(data.xz)
    console.log(typeof data.xz)
    this.setData({
     [aa]:data.xz?false:true
    })
    console.log(this.data.functionList[0].data)
    this.ChangeCheck(true,true)
  },
  // 
  ChangeCheck(e,hd){
    let data=this.data
     if(!hd){
      let index=e.currentTarget.dataset.index
      this.setData({
        ['functionList[0].data['+index+'].isChoose']:data.functionList[0].data[index].isChoose?false:true,
      })
    }
    
    let i=0,j=0
    data.functionList[0].data.forEach(c=>{
      if(c.isChoose){
        i++
        if(c.IsIncludeRestorer=='True'&&c.djjxfjX[0].choose) j++
      }
      
    })
    let pr={
      prj:i,
      Xfj:j,
    }
    this.setData({
      prjXfj:pr
    })

  },

  // 
  addDeclare(){
    let data=this.data.postDeclare[this.data.postDeclare.length-1],that=this
    if(!data.addImg.choose) return app.fa('请上传凭证')
    if(!data.teacher.id) return app.fa('请选择技师')
    if(!data.store.id&&this.data.zxzOrtdz==1) return app.fa('请选择门店')
    for(let i=0;i<data.submitList.length;i++){
      if(!data.submitList[i].val&&i!=3){
        app.fh()
        app.fa(data.submitList[i].t)
        return
      }
    }
    let dataAdd=this.data.postDeclare
    dataAdd.push({
      store:{
        show:false,
        name:'',
        id:'',
      },
      teacher:{
        show:false,
        name:'',
        id:'',
      },
      djjxfjD:[
        {
          choose:false,
          name:"线上",
        },
        {
          choose:false,
          name:"线下",
        }
      ],
      djjxfjX:[
        {
          choose:false,
          name:"线上",
        },
        {
          choose:false,
          name:"线下",
        }
      ],
      submitList:[
        { 
          name:"项目：",
          val:'',
          t:'请输入项目名称'
        },
        { 
          name:"付款金额：",
          val:'',
          t:'请输入付款金额'
        },
        { 
          name:"打款人：",
          val:'',
          t:'请输入打款人'
        },
        { 
          name:"备注：",
          val:'',
          t:'请输入备注'
        },
      ],
      addImg:{
        choose:false,
        img:'add_2.png',
        imgc:'',
      },
    })
    this.setData({
      postDeclare:dataAdd
    })
    
  },
  // 
  delFN(){
    let data=this.data.postDeclare.slice(0,this.data.postDeclare.length-1)
    this.setData({
      postDeclare:data
    })
  },

  // 
  onChange(event) {
    this.setData({
      active:event.detail.index
    })
  },

  // 循环线下申报
  submitXX(){

    let that=this,data=this.data
    let num=data.postDeclare.length
    return new Promise((resolve, reject) => {
      function  upload(num) {
        if(num<0){
          console.log("========")
          resolve(true)
          return
        }

        app.fg({
          action:'OfflineReportSend',
          // openId:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',
          openId:app.globalData.GetMembersInfo.openId,
          TechnicianId:data.postDeclare[num].teacher.id,
          ProductName:data.postDeclare[num].submitList[0].val?data.postDeclare[num].submitList[0].val:'',
          OrderTotal:data.postDeclare[num].submitList[1].val?data.postDeclare[num].submitList[1].val:'',
          BuyerName:data.postDeclare[num].submitList[2].val?data.postDeclare[num].submitList[2].val:'',
          Restorer:data.postDeclare[num].djjxfjX[0].choose?1:data.postDeclare[num].djjxfjX[1].choose?2:0,
          Coupon:data.postDeclare[num].djjxfjD[0].choose?1:data.postDeclare[num].djjxfjD[1].choose?2:0,
          PayPicture:data.postDeclare[num].addImg.imgc,
          Role:data.zxzOrtdz,
          StoreId:data.zxzOrtdz=='1'?data.postDeclare[num].store.id:'',
          Remark:data.postDeclare[num].submitList[3].val?data.postDeclare[num].submitList[3].val:'',
        }).then(r=>{
          app.fh()
          if(r.data.Status=="NO") {
            app.fa(r.data.Message)
            resolve(false)
          }
          else upload(num-1)
          
        })
      }
      upload(num-1)
    })

  },

  // 申报
  submit(){
    
    let data=this.data,that=this
    app.fl()
    if(data.active){
      that.submitXX().then(c=>{
        app.fh()
        if(c){
          app.fa("上报成功")
          that.setData({
            postDeclare:[
              {
                store:{
                  show:false,
                  name:'',
                  id:'',
                },
                teacher:{
                  show:false,
                  name:'',
                  id:'',
                },
                djjxfjD:[
                  {
                    choose:false,
                    name:"线上",
                  },
                  {
                    choose:false,
                    name:"线下",
                  }
                ],
                djjxfjX:[
                  {
                    choose:false,
                    name:"线上",
                  },
                  {
                    choose:false,
                    name:"线下",
                  }
                ],
                submitList:[
                  { 
                    name:"项目：",
                    val:'',
                    t:'请输入项目名称'
                  },
                  { 
                    name:"付款金额：",
                    val:'',
                    t:'请输入付款金额'
                  },
                  { 
                    name:"打款人：",
                    val:'',
                    t:'请输入打款人'
                  },
                ],
                addImg:{
                  choose:false,
                  img:'add_2.png',
                  imgc:'',
                },
              },
            ],
          })
        } 
      })
    }else{  
      if(!data.choose[0]||!data.choose[1]) return app.fa('请确认项目和修复剂')
      let oId='',sss=0
      data.functionList[0].data.forEach((c,i)=>{
        if(c.isChoose){
          // if(i==0) oId=c.OrderId+'-'+(c.djjxfjD[0].choose?1:c.djjxfjD[1].choose?2:0)+'-'+(c.djjxfjX[0].choose?1:c.djjxfjX[1].choose?2:0)
          // else oId+=','+c.OrderId+'-'+(c.djjxfjD[0].choose?1:c.djjxfjD[1].choose?2:0)+'-'+(c.djjxfjX[0].choose?1:c.djjxfjX[1].choose?2:0)

           if(sss==0) oId=c.OrderId
          else oId+=','+c.OrderId
          sss++
        }
      })
      // return
      app.fg({
        action:'ExcutorRequestReport',
        // openId:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',
        openId:app.globalData.GetMembersInfo.openId,
        OrderIds:oId,
        RestoreProductsCount:data.prjXfj.Xfj,
        Role:data.zxzOrtdz,
        Remark:data.Remark
      }).then(r=>{
        app.fh()
        if(r.data.Status=="OK"){
          let fun={
            name:'线上业绩',
            page:1,
            data:[],
            finsh:false,
            post:0,
          }
          setTimeout(()=>{
            let pr={
              prj:0,
              Xfj:0,
            },av=[false,false]
            that.setData({
              ['functionList[0]']:fun,
              prjXfj:pr,
              choose:av,
              Remark:'',
            })
            that.getData()
          },1450)
          
        }
        app.fa(r.data.Message)
      })
    }
    
  },
  changeCheck(e){
    let index=e.currentTarget.dataset.in
    let choose=this.data.choose
    choose[index]=choose[index]?false:true
    this.setData({
      choose:choose
    })
  },

  // 
  changeInput(e){
    let index=e.currentTarget.dataset
    this.setData({
      ["postDeclare["+index.idf+"]submitList["+index.id+"].val"]:e.detail.value
    })
  },
  


  // 点击项目
  changeTea(e){
    let p={
      id:e.currentTarget.dataset.child.OrderId,
      sid:e.currentTarget.dataset.child.SkuId,
    }
    this.setData({
      project:p,
      ["teacher.show"]:true
    })
  },
  // 点击技师
  chooseTea(e){
    let data=this.data,that=this
    let aa=e.currentTarget.dataset
    if(!data.active){
      let cid=data.project.sid.slice(0,data.project.sid.indexOf('_'))
      app.fl()
      app.fg({
        SkuId:data.project.sid,
        action:'ConfrimOrder',
        orderid:data.project.id,
        programid:cid,
        technicianid:aa.id,
        openId:app.globalData.GetMembersInfo.openId,
        // openId:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',
        ConfirmType:data.zxzOrtdz=='1'?0:2,
      }).then(r=>{
        app.fl()
        if(r.data.Status=="OK") {
          let fun={
            name:'线上业绩',
            page:1,
            data:[],
            finsh:false,
            post:0,
          }
          that.setData({
            ['functionList[0]']:fun
          })
         that.getData()
        }
        else app.fa(r.data.Message)
        that.setData({
          ["teacher.show"]:false
        })

      })
    }else{
      let a={
        show:false,
        name:aa.name,
        id:aa.id
      }
      this.setData({
        teacher:a,
        ['postDeclare['+data.tIndex+'].teacher']:a,
      })
    }


    
  },

  // 获取技师列表
  getTeach(){
    let data=this.data,that=this
    app.fg({ 
      action: 'GetTeamMembers',
      openId:app.globalData.GetMembersInfo.openId,
      // openId:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',
      role: 'head',
      PageIndex:data.listDataT.page,
      PageSize:9999,
      IsExcutor:data.zxzOrtdz=='1'?'':1
    }).then(r=>{
      if(r.errMsg=="request:ok"){
        let i=0
        r.data.Technicians.forEach(c=>{
          i++
          data.listDataT.data.push(c)
        })
        data.listDataT.page++
        this.setData({
          ['listDataT.page']:data.listDataT.page,
          ['listDataT.data']:data.listDataT.data,
          ['listDataT.finsh']:i<9999?true:false,
        })
      }else app.fa("查询失败！")
    })
  },
  // 选择门店
  chooseStore(e){
    let store={
      show:false,
      name:e.currentTarget.dataset.index.StoreName,
      id:e.currentTarget.dataset.index.StoreId,
    },data=this.data
    this.setData({
      store:store,
      ['postDeclare['+data.sIndex+'].store']:store,
    })
    // console.log(e)
  },
  // 获取门店列表
  getStore(){
    let data=this.data
    let that=this
    if(data.storeList.finsh) return
    let post={
      action:"Search",
      tag:"store",
      Latitude:data.LatiLongitude.Latitude,
      Longitude:data.LatiLongitude.Longitude,
      pageindex:data.storeList.page,
      pagesize:999,
      bindtype:1,
      // thid:297,
      thid:app.globalData.GetMembersInfo.UserId,
    }
    app.fl()
    app.fg(post).then(r=>{
      app.fh()
      if(r.data.Status!="NO"){
        let datar=r.data.Models
        for(let i=0;i<datar.length;i++){
            data.storeList.data.push(datar[i])
        }
        if(datar.length<9999){
          data.storeList.finsh=true
        }
        data.storeList.page++
       
        that.setData({
          storeList:data.storeList
        })
      }else app.fa(r.data.Message)
    })
  
  },


   // 上传logo
  uploadLogo(e){
    let data=this.data,index=e.currentTarget.dataset.index
    let that=this
    // if(data.addImg.choose) return
    wx.chooseImage({ 
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        let logo=[]
        logo = logo.concat(res.tempFilePaths)
        logo=logo.length <= 1 ? logo : logo.slice(0, 1) 
        let name="postDeclare["+index+"]addImg.imgc"
        app.fl("正在上传中...")
        this.uploadImgs(logo,0,name).then(l=>{
          if(l){
            that.setData({
              ["postDeclare["+index+"]addImg.choose"]:true
            })
          }
          app.fh()
          
        })
      }
    })
  },


  // 多图上传
  uploadImgs(images,num,name){
    let that=this,data=this.data
    const all=num
    let getImage=''
    return new Promise((resolve, reject) => {
      function  upload(num) {
        if(num<0){
          resolve(true)
          that.setData({
            [name]:getImage,
          })
          return
        }
        wx.uploadFile({
          url:app.getUrl('UploadAppletImage'),
          filePath:images[num],
          name:'file',
          formData:{
            appid:app.globalData.appId,
            openId:app.globalData.GetMembersInfo.openId,
            // openId:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',
          },
          success:res=>{
            let datar=JSON.parse(res.data)
            if(datar.Status=="OK"){
              if(num==all) getImage=datar.Data[0].ImageUrl
              else getImage+=','+datar.Data[0].ImageUrl
              num=num-1
              upload(num)
            }else{
              app.fh()
              app.fa("上传图片失败！")
            }
          }
        })
      }
      upload(num)
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