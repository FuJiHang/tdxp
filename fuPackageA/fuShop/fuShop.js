const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    proList:{
      data:[],
      page:1,
      finsh:false,
    },//商品列表
    imgheights:[],//所有图片高度
    imgUrls: [],//轮播图
    showClassfiy:false,//
    imgUrl:app.imgUrl,
    isChoose:0,
    titleArr:[],
    seach:'',
    clear:false,
    listData:[],//商品列表
    title:'',//商品列表标题
  },

  // 选择分类
  chooseFN(e){
    console.log("+++++++++",e);
    const { cid, index,name } = e.currentTarget.dataset;
    this.setData({
      isChoose:e.currentTarget.dataset.index
    })
    this.getList(cid,name);
  },

  seaChFN(e){
    let t=this.data.seach.length
    this.setData({
      seach: e.detail.value,
      clear:t>0?true:false
    })
  },

  clearFN(){
    this.setData({
      seach:'',
      clear:false
    })
  },

  onClose(){
    this.setData({
      showClassfiy:false,
    })
  },
  openClassfiy(){
    this.setData({
      showClassfiy:true,
    })
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("输出更多的", options);
    let sid = wx.getStorageSync('getStore').StoreId?wx.getStorageSync('getStore').StoreId:0;
    this.getProductData(sid)
    let data=this.data,that=this
    this.setData({
      hotList:[{"GiftId":6,"Name":"自拍杆（赠）","ShortDescription":"华为自拍杆（赠品）","LongDescription":"http://img.hmeshop.cn/hmeshopV3/Storage/master/201904221128327977350.jpg,","CostPrice":"89.00","ImageUrl":"http://img.hmeshop.cn/hmeshop/Storage/master/201901141134533165390.jpg","NeedPoint":199,"IsPromotion":true,"IsExemptionPostage":true,"IsCollected":"False","Type":null,"IsSpecial":null,"Stock":0,"RowNumber":1},{"GiftId":7,"Name":"IPhoneXs Max手机壳（赠）","ShortDescription":"IPhoneXs Max手机壳（赠）","LongDescription":"http://img.hmeshop.cn/hmeshopV3/Storage/master/201904221128267722930.jpg,","CostPrice":"30.00","ImageUrl":"http://img.hmeshop.cn/hmeshop/Storage/master/201901141736533855070.jpg","NeedPoint":300,"IsPromotion":true,"IsExemptionPostage":true,"IsCollected":"False","Type":null,"IsSpecial":null,"Stock":0,"RowNumber":2},{"GiftId":9,"Name":"兑换卷123","ShortDescription":"瑞士莲","LongDescription":"http://img.hmeshop.cn/hmeshopV3/Storage/master/201904221127389585650.jpg,","CostPrice":"100.00","ImageUrl":"http://img.hmeshop.cn/hmeshop/Storage/master/201901211028013142540.png","NeedPoint":1000,"IsPromotion":true,"IsExemptionPostage":true,"IsCollected":"False","Type":106,"IsSpecial":false,"Stock":100,"RowNumber":3}]
    })

    // 轮播图
    // banner
    app.fg({
      action:"GetBannerPicturesByCateName",
      pTypeName:'商城轮播图'
    }).then(r=>{
      that.setData({
        imgUrls:r.data.rows
      })
    })

    this.getClassify();
    // this.getList();
    this.referUser();
  },


  // 获取个人信息
  referUser() {
    let that = this
    app.getOpenId(function (a) {
      app.fg({
        action: 'GetMembersInfo',
        openId: a
      }).then(r => {
        console.log("输出个人信息", r);
        if (r.data.Status == "OK") {
          let dataR = r.data.Data
          let cookie = r.cookies[0];
          wx.setStorageSync('cookie', cookie);
        } 
      })
    })
  },

  //跳转详情
  handleDetail(e){
    const { productid, storeid, pagetype } = e.currentTarget.dataset; //商品id和门店id
    wx.navigateTo({
      url: `/fuPackageA/fuProductT/fuProductT?prDid=${productid}&pagetype=${pagetype}&storeid=${storeid}`,
    })
  },

  //wjx初始化分类标题数据
  getClassify(){
    app.fg({
      action:'GetAllCategories',	//是	string	GetAllCategories
      Type:0,	//是	int	0商品1项目
    }).then(res=>{
      console.log("初始化数据", res.data.Data);
      let arr = res.data.Data;
      console.log("输出初始化数组",arr);
      let id = arr[0].cid;
      console.log(id);
      let name = arr[0].name;
      console.log(name);
      if(res.data.Status=="OK"){
        this.setData({
          titleArr: arr
        })
      }
      

      this.getList(id,name)
    })
  },

  //获取商品列表
  getList(id,name){
    wx.request({
      url: app.data.url +'/api/ProductHandler.ashx?action=GetProducts',
      data: {
        productType: 0,//	是	int	商品- 0 / 项目 - 2
        pageSize: 10,//	是	int	每页数量
        pageIndex: 1,//	是	int	当前第几页
        CatetoryId: id,//	否	int	分类id
      },
      header: {'content-type':'application/json'},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        console.log("输出商品列表", res);
        if (res.data.Result.Status=="Success"){
          let arr = res.data.Result.Data;
         
          this.setData({
            listData:arr,
            title:name
          })
        }
      },
      fail: () => {},
      complete: () => {}
    });
      
  },







  //wjx跳转详情
  handleDetail(e) {
    console.log("跳转输出了吗", e);
    const { productid, storeid, pagetype, dname } = e.currentTarget.dataset; //商品id和门店id
    wx.navigateTo({
      url: `/fuPackageA/fuProductT/fuProductT?prDid=${productid}&pagetype=${pagetype}&storeid=${storeid}&dname=${dname}`,
    })
  },


  // 
  getProductData(id){
    let data=this.data,that=this
    if(data.proList.finsh) return
    app.fl()
    app.fg({
      url:'/api/ProductHandler.ashx?action=GetProducts',
      data:{
        pageSize:10,
        pageIndex:data.proList.page,
        // tagId:18,
        StoreId: id,
        ProductType: 0
      },
    },true).then(r=>{
      app.fh() 
      if(r.data.Result.Status=='Success'){
        let datar=r.data.Result.Data
        datar.forEach(c => {
          data.proList.data.push(c)
        })
        if(datar.length<10) data.proList.finsh=true
        data.proList.page++
        that.setData({
          proList:data.proList
        })
      }else app.fa('获取失败')
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})