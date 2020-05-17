let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.newImg,
    img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/sade.jpg',
    showData:[
      {
        price:'183',
        title:'门店会员'
      },
      {
        price: '100.00',
        title: '佣金总额'
      },
      {
        price: '192.00',
        title: '服务总费'
      },
    ],
    list:[
      {
        id:'1',
        img:'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/sade.jpg',
        icon:'',
        name:'张天爱',
        miaoshu:'真漂亮66666',
        price:'64466.00'
      },
      {
        id: '2',
        img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/sade.jpg',
        icon: '',
        name: '张天爱',
        miaoshu: '真漂亮66666',
        price: '64466.00'
      },
      {
        id: '3',
        img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/sade.jpg',
        icon: '',
        name: '张天爱',
        miaoshu: '真漂亮66666',
        price: '64466.00'
      },
      {
        id: '4',
        img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/sade.jpg',
        icon: '',
        name: '张天爱',
        miaoshu: '真漂亮66666',
        price: '64466.00'
      },
      {
        id: '5',
        img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/sade.jpg',
        icon: '',
        name: '张天爱',
        miaoshu: '真漂亮66666',
        price: '64466.00'
      },
      {
        id: '6',
        img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/sade.jpg',
        icon: '',
        name: '张天爱',
        miaoshu: '真漂亮66666',
        price: '64466.00'
      },
      {
        id: '7',
        img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/sade.jpg',
        icon: '',
        name: '张天爱',
        miaoshu: '真漂亮66666',
        price: '64466.00'
      },
    ],
    date:'请选择时间段',
    date1:'请选择起始时间',
    date2:'请选择结束时间',
    isShow:false,
    memberList:[],
    memberObj:{},
    storeid:'',//门店id
    post: {
      Integral: ''
    },//送积分
    showAlert: false,
    page:1,
  },  

  changeInput(e) {
    this.setData({
      [e.currentTarget.dataset.name]: e.detail.value
    })
  },
  giveOpen(e) {
    this.setData({
      showAlert: true,
      ['post.StoreId']: app.globalData.GetMembersInfo.StoreId,
      ['post.UserId']: e.currentTarget.dataset.data.UserId,
    })
  },
  onCloseP() {
    this.setData({
      showAlert: false,
    })
  },
  giveFN() {
    let data = this.data, that = this
    app.fl()
    app.fg({
      url: "/api/StoreManage.ashx?action=StoreGiveIntegral",
      data: data.post
    }, true).then(r => {
      app.fh()
      if (r.data.Status == 'OK') {
        that.onCloseP()
      }
      app.fa(r.data.Message)
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let sid = wx.getStorageSync('getStore').StoreId;
    this.setData({
      storeid:sid
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getMember()
  },

  //获取会员列表
  getMember(num1,num2,id){
    if (num1 =='请选择起始时间'){
      num1=''
    }
    if (num2 == '请选择结束时间') {
      num2 = ''
    }
    let that=this
    app.fp({
      action:'GetStoreMembers',//	是	string	GetStoreMembers
      StoreId:app.globalData.GetMembersInfo.StoreId, //	是	int	门店Id
      PageIndex:that.data.page,//	是	int	页数
      PageSize:100,	//是	int	每页显示条数
      BeginDate: num1 || '',//	否	DateTime	订单开始时间
      EndDate:num2 || '',//	否	DateTime	订单结束时间
    }).then(res=>{
      console.log("输出会员列表",res);
      if (res.data.Status == "Success"){
        let data = res.data.Message
        data.MemberList.forEach(v=>{
          v.newTime = v.LastOrderTime.split('T')[0];
          v.newTime = v.newTime.replace(/-/g,'.')
        })
        if (data.StoreOrderCount.OrderSum==null){
          wx.showToast({
            title: '这段时间没有订单',
            icon: 'none',
            image: '',
            duration: 2000,
            mask: true,
            success: (result) => {

            },
            fail: () => { },
            complete: () => { }
          });
        }
        that.data.memberList.push(...data.MemberList)
        this.setData({
          memberList:that.data.memberList,//会员列表
          memberObj: data.StoreOrderCount, //订单汇总
          page:++that.data.page,
        })
        console.log(this.data.memberList,'222222222222222');
      }
    })
  },



  //点击搜索
  handleSeach(){

  },

  //选择时间
  bindDateChange1: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date1: e.detail.value
    })
  },
  bindDateChange2: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date2: e.detail.value
    })
  },

  //打开时间弹窗
  handleClick(){
    this.setData({
      isShow:true
    })
  },
  
  //时间选弹窗确定
  handleHide(){
    this.data.page=1
    this.data.memberList=[]
    this.getMember(this.data.date1, this.data.date2)
    this.setData({
      isShow: false,
      date1: '请选择起始时间',
      date2:'请选择结束时间',
    })
    
  },
  //点击遮罩层关闭弹窗
  handleHide2(){
    this.setData({
      isShow:false
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
    console.log('2222222222222');
    this.getMember()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})