let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.newImg,
    inputData:[
      {
        title:'店员名字',
        status:true,
        pla:'请输入店员姓名',
        name:'clerkName',
        type:'text',
        val:''
      },
      {
        title: '角色身份',
        status: true,
        pla: '请输入职位',
        name: 'roleName',
        type: 'text',
        val: ''
      },
      // {
      //   title: '登录密码',
      //   status: true,
      //   pla: '请输入登录密码',
      //   name: 'password',
      //   type: 'text',
      //   val: ''
      // },
      {
        title: '手机号',
        status: true,
        pla: '请输入手机号',
        name: 'phone',
        type: 'number',
        val: ''
      },
    ],
    storeid:'',//门店id
    type:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { storeid } = options;
    // console.log(storeid);
    this.setData({
      storeid
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  //添加店员选项
  handleChange(e) {
    const { value } = e.detail;
    if (value) {
      let type = 1
      this.setData({
        type
      })
    } else if (!value) {
      let type = 0
      this.setData({
        type
      })
    }
  },





  //获取form表单数据
  formSubmit: function (e) {
    wx.showLoading({
      title: '添加中~',
      mask: true,
    });
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    let obj = e.detail.value;
    console.log("输出信息",obj);
    let data = {
      IsSet:1,      //	是	int	1添加，0删除
      StoreId: this.data.storeid || 50, //	是	int	门店Id
      Phone:obj.phone,//	否	string	手机号码
      Role:obj.roleName,//	否	string	角色
      Name:obj.clerkName,//	否	string	姓名
      IsFont:this.data.type,//是否 为店员
    }
      wx.request({
        url: app.data.url + '/api/StoreManage.ashx?action=StoreSetChecker',
        data: data,
        header: { Cookie: wx.getStorageSync('cookieFu') },
        success: (res) => {
          console.log("添加店员", res);
          if(res.data.Status=="OK"){
            setTimeout(() => {
              wx.hideLoading();
              wx.navigateBack({
                delta: 1
              }); 
            }, 1500);
          }else{
            wx.hideLoading();
            wx.showToast({
              title: res.data.Message,
              icon: 'none',
              image: '',
              duration: 1500,
              mask: false,
              success: (result) => {
         
              },
              fail: () => {},
              complete: () => {}
            });
              
          }
        },
        fail: () => { },
        complete: () => { }
      });

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