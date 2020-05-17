const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    proList: {
      data: [],
      page: 1,
      finsh: false,
    },//商品列表
    imgheights: [],//所有图片高度
    imgUrls: [],//轮播图
    showClassfiy: false,//
    imgUrl: app.imgUrl,
    isChoose: 0,
    seach: '',
    clear: false,
    listData: [],//商品列表
    title: '',//商品列表标题
    
    functionList:[
      {
        name:'',
        data:[],
        page:1,
        finsh:false
      },
    ],
    active:0,
  },



  submitComT(){
    this.data.functionList.forEach(c=>{
      c.data=[]
      c.page=1
      c.finsh=false
    })
    this.getListData()
  },

  seaChFN(e) {
    let t = this.data.seach.length
    this.setData({
      seach: e.detail.value,
      clear: t > 0 ? true : false
    })


  
  },

  clearFN() {
    this.setData({
      seach: '',
      clear: false
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
    wx.hideTabBar({})

    let sid = wx.getStorageSync('getStore').StoreId ? wx.getStorageSync('getStore').StoreId : 0;

    let data = this.data, that = this


    // 轮播图
    // banner
    app.fg({
      action: "GetBannerPicturesByCateName",
      pTypeName: '商城轮播图'
    }).then(r => {
      that.setData({
        imgUrls: r.data.rows
      })
    })

    this.getClassify(options.id);

  },


 

  //跳转详情
  handleDetail(e) {
    const { productid, storeid, pagetype } = e.currentTarget.dataset; //商品id和门店id
    wx.navigateTo({
      url: `/fuPackageA/fuProductT/fuProductT?prDid=${productid}&pagetype=${pagetype}&storeid=${storeid}`,
    })
  },

  //wjx初始化分类标题数据
  getClassify(id) {
    let data=this.data,that=this
    app.fg({
      action: 'GetAllCategories',	//是	string	GetAllCategories
      Type: 0,	//是	int	0商品1项目
    }).then(res => {

      res.data.Data.forEach((c,i)=>{
        id&&id==c.cid?data.active=i:''
        c.data=[]
        c.page=1
        c.finsh=false
      })
      that.setData({
        active:data.active,
        functionList:res.data.Data
      })
      that.getListData()
    })
  },

  







  //wjx跳转详情
  handleDetail(e) {
    const { productid, storeid, pagetype, dname } = e.currentTarget.dataset; //商品id和门店id
    wx.navigateTo({
      url: `/fuPackageA/fuProductT/fuProductT?prDid=${productid}&pagetype=${pagetype}&storeid=${storeid}&dname=${dname}`,
    })
  },


  

  // 切换类型
  onChangeTop(e){
    let data=this.data,that=this
    this.setData({
      active: e.detail.index
    })
    this.getListData()
  },

  //获取商品列表
  getListData() {
    let data=this.data,that=this
    if( data.functionList[data.active].finsh) return
    wx.request({
      url: app.data.url + '/api/ProductHandler.ashx?action=GetProducts',
      data: {
        Keywords:data.seach,
        productType: 0,//	是	int	商品- 0 / 项目 - 2
        pageSize: 10,//	是	int	每页数量
        pageIndex:data.functionList[data.active].page ,//	是	int	当前第几页
        CatetoryId: data.functionList[data.active].cid,//	否	int	分类id
      },
      header: { 'content-type': 'application/json' },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {

        if (res.data.Result.Status == "Success") {
          res.data.Result.Data.forEach(c=>{
            data.functionList[data.active].data.push(c)
          });
          data.functionList[data.active].page++
          data.functionList[data.active].finsh=res.data.Result.Data.length<10
          
        
          this.setData({
            functionList:data.functionList
          })
        }
      },
      fail: () => { },
      complete: () => { }
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
    this.getListData()

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})