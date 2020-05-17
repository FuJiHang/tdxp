let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.newImg,
    navData: [{ name: '设为热门' }, { name: '取消热门' }],
    nums: 0,
    img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/sade.jpg',
    list:[
      {
        img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/sade.jpg',
        name:'头道惠头疗一次',
        price:'25.00',
        info: '身体各器官的反射区和经络穴位,通过按摩,可以达到活络化淤, 强身健...',
        status:false
      },
      {
        img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/sade.jpg',
        name: '头道惠头疗一次',
        price: '25.00',
        info: '身体各器官的反射区和经络穴位,通过按摩,可以达到活络化淤, 强身健...',
        status: false
      },
      {
        img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/sade.jpg',
        name: '头道惠头疗一次',
        price: '25.00',
        info: '身体各器官的反射区和经络穴位,通过按摩,可以达到活络化淤, 强身健...',
        status: false
      },
    ],
    isSHow:false,
    seachNum:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  //点击单选按钮
  handleIndex(e){
    // console.log(e);
    let that = this;
    const { nums } = e.currentTarget.dataset;
    let list = that.data.list;
    list.forEach((v,i)=>{
      if(nums==i){
        v.status = !v.status
      }
      let sta = list.every(v => v.status != false);
      console.log("输出是否是我想要的",sta);
      if(sta===true){
        that.setData({
          isShow: sta
        })
      }else{
        that.setData({
          isShow: sta
        })
      }
    })
    that.setData({
      seachNum:nums,
      list
    })
  },
  //点击全选
  handleAll(e){
    let list = this.data.list;
    list.forEach(v=>{
      v.status = !this.data.isShow
    })
    this.setData({
      list,
      isShow:!this.data.isShow
    })
  },

  //点击nav导航栏
  handleNav(e) {
    // console.log(e);
    const { index } = e.currentTarget.dataset;
    this.setData({
      nums: index
    })
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