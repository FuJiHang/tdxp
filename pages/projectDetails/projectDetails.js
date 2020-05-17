const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.imgUrl,//
    active: 0,
    nowData:'',
    background: [],
    vertical: false,
    circular: false,
    interval: 4000,
    Name:'',
    Description:'',
    Deposit:'',
    Price:'',
    SaleCounts:'',
    Info:'',
    Id:'',
    Images:'',
    regionid:'',
    Latitude:'',
    Longitude:'',
    checked:false,
    storeList:[],//门店列表
    fOpenId:0,//分享的父级id
    imgheights:[],//所有图片高度
    //默认  
    current: 0,
    pasreAll:true,//全额：定金
    // alert:'',
    // fu01:'',
    // fu02:'',
    // fu03:'',
    // fu04:'',
    GetstoreData:[],//门店
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onChange(e) {
    let index=e.target.dataset.index
    let data=this.data
    for(let i=0;i<data.storeList.length;i++){
      if(i==index){
        data.storeList[i].isChoose=!data.storeList[i].isChoose
        continue
      }
      data.storeList[i].isChoose=false
    }
    this.setData({
      storeList:data.storeList
    })
  },
  onLoad: function (options) {
    // console.log(JSON.parse(decodeURIComponent(options.storeData)))

    // let abc=options.toString()
    // app.fa(abc)
    // app.fa(app.globalData.Latitude)
    // app.fa(app.globalData.Longitude)


    // this.setData({
    //   GetstoreData:options.storeData?aaa:''
    // })
    let that=this
    if(!options.addressid){
      wx.getStorage({
        key:'firstAddressId',
        success:res=>{
          that.setData({
            Id:options.projectid,
            regionid:res.data,
            Latitude:app.globalData.Latitude,
            Longitude:app.globalData.Longitude,
            GetstoreData:options.storeData?JSON.parse(decodeURIComponent(options.storeData)):''
          })
          this.getData(options)
        }
      })
    }else{
      var listObj = options
      that.setData({
        Id:listObj.projectid,
        regionid:listObj.addressid,
        Latitude:listObj.userlatitude,
        Longitude:listObj.userlongitude,
        GetstoreData:options.storeData?JSON.parse(decodeURIComponent(options.storeData)):''
      })
      this.getData(options)
    }

    console.log(this.data.GetstoreData)
    
  },

  getData(options){
    
    if(options.fOpenId){
      this.setData({
        fOpenId:options.fOpenId
      })
    }
    var _this = this
    let fuxiu=_this.data.regionid.split(",")
    app.fl()
    wx.request({
      url: getApp().gethsyurl,
      data: {
        action: 'GetProgramDetail',
        ProductId: _this.data.Id,
        regionid:fuxiu[2],
        regionPath: _this.data.regionid,
        Latitude:_this.data.Latitude,
        Longitude:_this.data.Longitude
      },
      success(res) {
        // let sssss=JSON.parse('{"Status":"OK","Id":"428","Name":"匠心粉墨眉","ProgramLogo":"http://img.hmeshop.cn/hmeshopV3/Storage/master/201904250935157494000.jpg","Images":"http://img.hmeshop.cn/hmeshopV3/Storage/master/201904241912358235900.jpg,","Description":"运用韩式裸妆理念，全程无菌操作，用精密的针点纯手工蘸取小分子色乳，根据肤质、发色调制眉色，让深浅自然过度，浓淡相宜，效果栩栩如生，宛若天生，为客户打造朦胧的自然清新感的温和型眉型","Price":0.01,"SaleCounts":"0","Info":"http://img.hmeshop.cn/hmeshopV3/Storage/master/201904260056290901060.jpg","rows": [{"Position":null,"Delivery":null,"AddressSimply":null,"Address":"上海上海市杨浦区市市鞍山路66号","FullRegionPath":null,"IsOpen":false,"CloseStartTime":null,"CloseEndTime":null,"OpenStartTime":"0001-01-01T00:00:00","OpenEndTime":"0001-01-01T00:00:00","Distance":"4.7km","IsInServiceArea":false,"Introduce":null,"TopRegionId":223,"StoreId":87,"StoreName":"颜多金半永久纹绣皮肤管理","StoreImages":""}]}')
        // res.data=sssss
        // app.fa(res.data.Status)
        // _this.setData({
        //   alert:sssss
        // })
        app.fh()
          if(res.data.Status=="OK"){

            var imglis = res.data.Images.split(',')


            var imglist=[]
            for(let i=0;i<imglis.length;i++){
              if(i==imglis.length-1) break;
              imglist.push(imglis[i])
            }

            var data = res.data;
            for(let i=0;i<data.rows.length;i++){
              if(i==0) data.rows[i].isChoose=true
              else data.rows[i].isChoose=false
              _this.data.storeList.push(data.rows[i])
            }
            
            
            _this.setData({
              ProgramLogo:data.ProgramLogo,
              Info:data.Info,
              background:imglist,
              SaleCounts:data.SaleCounts,
              Name:data.Name,
              Price:data.Price,
              Deposit:data.Deposit,
              Description:data.Description,
              storeList:_this.data.GetstoreData?_this.data.GetstoreData:_this.data.storeList,
              // fu01:JSON.stringify(_this.data.storeList),
              // fu02:JSON.stringify(data.Name),
              // fu03:JSON.stringify(data.ProgramLogo),
              // fu04:JSON.stringify(_this.data.storeList),
              // alert:JSON.stringify(data.Price),

            })
          }else app.fa('获取项目详情失败！')
      }
    })
  },
  qiehuan(){
    let pasreAll=this.data.pasreAll
    this.setData({
      pasreAll:pasreAll?false:true
    })
  },
  toBayAll(){
    // this.setData({
    //   pasreAll:true,
    // })
    this.toBay()
  },
  toBayMin(){
    // this.setData({
    //   pasreAll:false,
    // })
    this.toBay()
  },
  // 去购买
  toBay(a){
    let tdata=this.data
    let that=this
    let storeData={}
    if(tdata.storeList.length==0) return app.fa("附件无门店，不能购买！")
    for(let i=0;i<tdata.storeList.length;i++){
      if(tdata.storeList[i].isChoose){
        storeData=tdata.storeList[i]
        break;
      }
    }
    if(!storeData.StoreId) return app.fa("请选择门店!")

    if(app.globalData.GetMembersInfo==null){
      app.getWxUserInfo(function(f) {
        wx.request({
          url: app.getUrl("QuickLogin"),//
          data: {
            openId: f.openId,//微信返回的用户id
            nickName: f.nikeName,
            unionId: f.unionId,
            headImage: f.headImage,
            encryptedData: f.encryptedData,
            session_key: f.session_key,
            iv: f.iv,
            referralUserId:tdata.fOpenId,//上级id
            Latitude: app.globalData.Latitude,
            Longitude: app.globalData.Longitude,
            unionid: app.globalData.unionid
          },
          success: function(a) {
            void 0 == a.data.error_response ?(
            app.fg({
              action:'GetMembersInfo',
              openId:f.openId
            }).then(r=>{
              if(r.data.Status=="OK"){
                let dataR=r.data.Data
                dataR.openId=f.openId
                app.setMembersInfo(dataR)
                that.isCanBuy()
              }else app.fa("获取个人信息失败！")
            })
            ): hishop.showTip(a.data.error_response.sub_msg);
          }
        });
        
      });
    }else that.isCanBuy()
},
  // 校验是否满足
  isCanBuy(){
    let data=this.data
    let storeData={}
    if(data.storeList.length==0) return app.fa("您当前位置没有门店可做该项目！")
    for(let i=0;i<data.storeList.length;i++){
      if(data.storeList[i].isChoose){
        storeData=data.storeList[i]
        break;
      }
    }
    if(!storeData.StoreId) return app.fa("请选择门店!")
    let cartList=[{
      Deposit:data.Deposit,
      Pic:data.ProgramLogo,
      ProductName:data.Name,
      SalePrice:data.Price,
      ShortDescription:data.Description,
      ProductId:data.Id,

    }]
    
    
    wx.navigateTo({
      url: "/pages/fujihang/fuPlace/fuPlace?storeData="+encodeURIComponent(JSON.stringify(storeData))+"&cartList="+encodeURIComponent(JSON.stringify(cartList))+'&pasreAll='+data.pasreAll
    });
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
  bindchange: function (e) {
    this.setData({ current: e.detail.current })
  },

  // 跳去门店
  toStoreFN(e){
    let data=this.data
    let index=e.currentTarget.dataset.index
    wx.navigateTo({
      url: "/pages/storeDetail/storeDetail?storeid=" +data.storeList[index].StoreId
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
    return{

  　　　　title: "头道惠",        // 默认是小程序的名称(可以写slogan等)
  　　　　path: '/pages/projectDetails/projectDetails?projectid='+data.Id+"&addressid="+
              data.regionid+'&userlatitude='+data.Latitude+'&userlongitude='+data.Longitude+"&fOpenId="+app.globalData.userInfo.UserId
          ,        // 默认是当前页面，必须是以‘/’开头的完整路径
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