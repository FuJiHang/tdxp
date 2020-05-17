let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.newImg,
    img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/sade.jpg',
    list:[
      {
        nums:'201910317823',
        time:'2019.11.31 12:38:23',
        img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/sade.jpg',
        title:'头道汤头疗一次头道汤头疗',
        yuji:'120.00',
        quank:'1900.00'
      },
      {
        nums: '201910317823',
        time: '2019.11.31 12:38:23',
        img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/sade.jpg',
        title: '头道汤头疗一次头道汤头疗',
        yuji: '120.00',
        quank: '1900.00'
      },
    ],
    showData:[
      {
        price:'788.00',
        name:'已结算金额'
      },
      {
        price: '178.00',
        name: '预计收益'
      },
      {
        price: '78.00',
        name: '推客奖励'
      }
    ],
    showData2: [
      {
        price: '7808.00',
        name: '累计业绩'
      },
      {
        price: '178.00',
        name: '订单数量'
      },
      {
        price: '78.00',
        name: '今日订单'
      }
    ],
    showData3: [
      {
        price: '7808.00',
        name: '已结算'
      },
      {
        price: '178.00',
        name: '待核算金额'
      },
      {
        price: '78.00',
        name: '推客奖励'
      }
    ],
    navData: [{ name: '已结算' }, { name: '预计收益' }],
    navData2:[{name:'已结算'},{name:'待结算'}],
    nums: 0, //平台奖励
    numss:0, //会员奖励
    pingtai: { price: '389.00', title: '佣金总金额(元)' },
    dianpu: { price: '65389.00', title: '净赚收入(元)' },
    huiyuan: {price:'3809.00', title:'奖励费用(元)'},
    index:2, //用于控制显示那个标题
    priceWin:['不限价格','5百以下','1-2千','2-4千','5-6千','8-8千'],
    isShow:false,//用于控制价格弹窗的显示隐藏
    winNum:0,//选择价格
    date: '2019年11月08日',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("输出num",options.num);
    let that = this;
    let index = options.num
    if(index==0){
      wx.setNavigationBarTitle({
        title: '店铺营收'
      })
      that.setData({
        index
      })
    }else if(index==1){
      wx.setNavigationBarTitle({
        title: '会员奖励'
      })
      that.setData({
        index
      })
    }else if(index==2){
      wx.setNavigationBarTitle({
        title: '平台奖励'
      })
      that.setData({
        index
      })
    }



    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  //点击nav导航栏
  handleNav(e){
    console.log(e);
    const { index } = e.currentTarget.dataset;
    this.setData({
      nums:index
    })
  },
  //点击nav导航栏2
  handleNav2(e) {
    console.log(e);
    const { index } = e.currentTarget.dataset;
    this.setData({
      numss: index
    })
  },

  //显示价格
  handleShow(){
    this.setData({
      isShow:true
    })
  },

  //输出点击的价格
  handleWin(e){
    const { index } = e.currentTarget.dataset;
    this.setData({
      winNum:index
    })
  },
  //选择价格的确认
  handleAffirm(){
    this.setData({
      isShow:false
    })
  },
  //关闭价格弹窗
  handleOff(){
    this.setData({
      isShow:false
    })
  },
  //年月日选择器
  bindDateChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    let newTime = e.detail.value;
    let year = newTime.substring(0, 4);
    let month = newTime.substring(5, 7);
    let day = newTime.substring(8, 10);
    console.log("输出年月日",year,month,day);
    let time = year + '年' + month + '月' + day + '日'
    this.setData({
      date: time
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