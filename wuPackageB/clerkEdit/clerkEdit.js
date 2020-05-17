let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.newImg,
    formData:[
      {
        title: '店员名字',
        status: true,
        pla: '请输入店员姓名',
        name: 'clerkName',
        type: 'text',
        val: '',
        nums:'140'
      },
      // {
      //   title: '登录密码',
      //   status: true,
      //   pla: '请输入登录密码',
      //   name: 'password',
      //   type: 'text',
      //   val: 'Wx1236456s'
      // },
      {
        title: '角色身份',
        status: true,
        pla: '',
        name: 'roleName',
        type: 'text',
        val: '',
        jues:true,
        nums:'140'
      },
      {
        title: '手机号',
        status: true,
        pla: '请输入手机号',
        name: 'phone',
        type: 'number',
        val: '',
        nums:'11'
      },
    ],
    level: ['店长', '高级头疗师', '初级头疗师', '中级头疗师','顶级头疗师'],
    nums:1,
    isShow:false,
    storeid:'', // 门店id
    authid:'', //删除需要的参数
    sta:null,//选择状态
    type: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    const { storeid, index, authid,name,phone,role,sta } = options;
    let arr = this.data.formData;
    arr.forEach(v=>{
      v.sta=sta
    })
    console.log("输出数组",arr);
    this.setData({
      storeid,
      authid,
      'formData[0].val': name,
      'formData[1].val': role,
      'formData[2].val': phone,
      sta,
    })
    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  //添加前台选项
  handleChange(e) {
    const { value } = e.detail;
    console.log("输出设置值");
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
      title: '修改中~',
      mask: true,
    });
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    let obj = e.detail.value;
    console.log("输出门店id", this.data.storeid);
    
    let data = {
      IsSet: 2,      //	是	int	1添加，2更新,0删除
      StoreId: this.data.storeid, //	是	int	门店Id
      Phone: obj.phone,//	否	string	手机号码
      Role: obj.roleName,//	否	string	角色
      Name: obj.clerkName,//	否	string	姓名
      AuthId: this.data.authid,
      IsFont:this.data.type
    }
    wx.request({
      url: app.data.url + '/api/StoreManage.ashx?action=StoreSetChecker',
      data: data,
      header: { Cookie: wx.getStorageSync('cookieFu') },
      success: (res) => {
        console.log("更新状态",res);
        if(res.data.Status=="OK"){
          wx.showToast({
            title: res.data.Message,
            icon: 'none',
            image: '',
            duration: 1500,
            mask: true,
            success: (result) => {
              setTimeout(() => {
                wx.hideLoading();
                wx.navigateBack({
                  delta: 1
                });
              }, 1500);
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

  //删除店员
  delClerk(){
    wx.showLoading({
      title: '删除中~',
      mask: true,
    });
    console.log("输出门店id", this.data.storeid);
    let data = {
      IsSet:0, //	是	int	1添加，0删除
      StoreId: this.data.storeid,
      AuthId: this.data.authid, //	否	int	Id，删除时要传
    }
    wx.request({
      url: app.data.url+ '/api/StoreManage.ashx?action=StoreSetChecker',
      data: data,
      header: { Cookie: wx.getStorageSync('cookieFu') },
      success: (res) => {
        // console.log("添加店员", res);
        if (res.data.Status == "OK") {
          wx.showToast({
            title: res.data.Message,
            icon: 'none',
            duration: 1500,
            mask: true,
            success: (result) => {
              setTimeout(() => {
                wx.hideLoading();
                wx.navigateBack({
                  delta: 1
                });
              }, 1500);
            },
            fail: () => { },
            complete: () => { }
          });
        }
      },
      fail: () => { },
      complete: () => { }
    });
  },
  

  //打开弹窗
  handleJS(){
    this.setData({
      isShow:true
    })
  },

  //选择取消
  handleQX(e){
    this.setData({
      isShow: false
    })
  },
  //选择确定
  handleQD(e){
    let that = this;
    let oldData = that.data.formData;
    oldData.forEach(v=>{
      if (v.jues==true){
        v.val = that.data.seachVal
      }
    })
    this.setData({
      isShow: false,
      formData: oldData
    })
  },
  //选择等级
  handleSeach(e){
    console.log(e);
    const {index,item} = e.currentTarget.dataset;
    this.setData({
      nums:index,
      seachVal:item
    })
  },
  //点击遮罩层关闭
  handleZZ(e){
    this.setData({
      isShow: false
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