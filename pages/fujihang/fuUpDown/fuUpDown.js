
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.imgUrl,
    functionList:[
      { 
        // cid:38,
        // name:"身体护理",
        // subs:[
        //   {
        //     cid:355,
        //     name:"身体护理",
        //   }
        // ]
      }
      
    ],//导航条
    active:0,
    isChoose:0,//选择的选项
    storeData:[],//门店列表
    sid:'',//门店id
    storeInfo:{},//门店信息
    edit:0,//0：热门，1：套餐，2：拼团,
    menuList:[],//套餐
  },

  // 选择功能
  onChange(event) {
    let index=event.detail.index
    let ischoose=this.data.functionList[index].choose
    this.setData({
      active:index,
      isChoose:ischoose
    })
    this.getDataR()
    // console.log()
  },
  // 下拉加载
  getDataR(isLoaing){
    let data=this.data
    if(!data.functionList[data.active].hasChild) return
    if(data.functionList[data.active].subs[data.isChoose].finish) return;
    if(!isLoaing) app.fl()
    app.fg({
      action:'GetProducts',
      openId:app.globalData.GetMembersInfo.openId,
      // openId:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',
      cId:data.functionList[data.active].subs[data.isChoose].cid,
      Type:2,
      pageIndex:data.functionList[data.active].subs[data.isChoose].page,
      pageSize:10
    }).then(r=>{ 
      app.fh()
      if(r.data.Status=="OK"){
        let getdata=r.data.Data
        for(let i=0;i<getdata.length;i++){
          getdata[i].choose=false

          if(data.edit==0){
            for(let j=0;j<data.storeData.length;j++){
              if(data.storeData[j]==getdata[i].ProductId){
                getdata[i].choose=true
              }
            }
          }
          

          data.functionList[data.active].subs[data.isChoose].list.push(getdata[i])
        }
        if(getdata.length<10) data.functionList[data.active].subs[data.isChoose].finish=true
        data.functionList[data.active].subs[data.isChoose].page++
        this.setData({
          functionList:data.functionList
        })
      }else app.fa("获取数据失败！")
    })
   
  },
  // 选择分类
  chooseFN:function(e){
    let data=this.data
    let index=e.target.dataset.index
    data.functionList[data.active].choose=index
    this.setData({
      isChoose:index,
      functionList:data.functionList
    })
    this.getDataR()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.edit==0?'上下架热门项目':options.edit==1?'设置套餐':'编辑拼团活动'
    })
    this.setData({
      edit:options.edit,
      sid:options.id?options.id:''
    })
    // app.fg({
    //   action:'GetStoreInfo',
    //   openId:app.globalData.GetMembersInfo.openId
    // }).then(r=>{
    //   console.log(r)
    // })

    // 门店详情
    
  },

  // 重新获取门店信息
  getStore(isLoaing){
    // 门店详情
    if(!isLoaing) app.fl()
    let sid=this.data.sid
    app.fg({
      action:"GetStoreDetail",
      storeid:sid?sid:app.globalData.GetMembersInfo.StoreId
      // storeid:523
    }).then(f=>{
      if(!isLoaing) app.fh()
      let dataf=f.data
      if(dataf.Status=="OK"){
        let isChooseXM=[]
        for(let f=0;f<dataf.Programs.length;f++){
            isChooseXM.push(dataf.Programs[f].ProgramId)
        }
        let data=this.data
        data.functionList[data.active].subs[data.isChoose].list=[]
        data.functionList[data.active].subs[data.isChoose].finish=false
        data.functionList[data.active].subs[data.isChoose].page=1
        this.setData({
          functionList:data.functionList,
          storeData:isChooseXM
        })
        this.getDataR(true)
      }else{
        app.fh()
        app.fa("获取数据失败")
      }
    })
  },

  // 组件页面回调
  compontpass(sss){
    let data=this.data,that=this
    if(this.data.edit==1){
      if(sss.detail.checked){
        data.menuList.push(sss.detail)
      }else{
        let gb=data.menuList
        data.menuList.forEach((c,i)=>{
          if(c.ProductId==sss.detail.ProductId) gb.splice(i,1)
        })
        data.menuList=gb
      }
   

    }else if(this.data.edit==2){
      wx.navigateTo({
        url: "/fuPackageA/fuCollAciton/fuCollAciton?data="+encodeURIComponent(JSON.stringify(sss.detail))
      });
    }else this.getStore(true)
    
  },

  toSetMenu(){
    wx.navigateTo({
      url: "/fuPackageA/fufSetMeal/fufSetMeal?data="+encodeURIComponent(JSON.stringify(this.data.menuList))
    });
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
    let data=this.data
    app.fg({
      action:"GetStoreDetail",
      // storeid:523,
      storeid:data.sid?data.sid:app.globalData.GetMembersInfo.StoreId
    }).then(f=>{
      let dataf=f.data
      if(dataf.Status=="OK"){
        let isChooseXM=[]
        for(let f=0;f<dataf.Programs.length;f++){
            isChooseXM.push(dataf.Programs[f].ProgramId)
        }
        dataf.EnvironmentImages=dataf.EnvironmentImages.split(',')[0]
        this.setData({
          storeData:isChooseXM,
          storeInfo:dataf
        })

        // 获取分类
        app.fg({
          action:'GetAllCategories',
          Type:1
        }).then(r=>{
          if(r.data.Status=="OK"){
            let data=r.data.Data
            for(let i=0;i<data.length;i++){
              data[i].choose=0
              data[i].hasChild=true
              if(!data[i].subs.length) data[i].hasChild=false
              for(let c=0;c<data[i].subs.length;c++){
                data[i].subs[c].page=1
                data[i].subs[c].finish=false
                data[i].subs[c].list=[]
              }
            }
            this.setData({
              functionList:data
            })
            this.getDataR()
          }else app.fa("获取数据失败！")
        })


      }else app.fa("获取数据失败！")

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