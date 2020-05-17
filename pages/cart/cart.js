import { getCartList, clearGoods, changeGoodsNum } from '../../utils/requestApi';
const app = getApp();
let touchDotX = 0;//X按下时坐标
let touchDotY = 0;//y按下时坐标
let interval;//计时器
let time = 0;//从按下到松开共多少时间*100
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.data.imgurl,
    storeList: [],
    totalPrice: 0,  // 总价
    goodsTotal: 0, //商品条数
    selectAllStatus: false, // 全选
    magnitudeObj: {},  //等于判断数据
    boo: false,
    navBar: [{
      name: '首页',
      img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/meunsy@3x.png',
      to: '/pages/fujihang/fuIndexG/fuIndexG',
    },
    {
      name: '惠选商城',
      img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/menu@3x4.png',
      to: '/pages/fujihang/fuNewMarket/fuNewMarket',
    },
    {
      name: '红卡专区',
      img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/menu@3x1.png',
      to: '/pages/fujihang/fuHongKaPro/fuHongKaPro'

    },
    {
      name: '购物车',
      img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/sele@3x4.png',
      to: '/pages/cart/cart'

    },
    {
      name: '我的',
      img: "http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/menu@3x3.png",
      to: '/pages/mine/mine',
    },
      //门店导航条
    ], //导航条
    xz: 3,
    newImg:app.newImg,
  },

  // 跳转页面
  toFNavc(e) {


    wx.switchTab({
      url: e.currentTarget.dataset.to
    })


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.getStorId()
    if (!app.globalData.GetMembersInfo || !app.globalData.GetMembersInfo.openId) {
      app.getOpenId(function (a) {
        app.fg({
          action: 'GetMembersInfo',
          openId: a
        }).then(r => {
          if (r.data.Status == "OK") {
            let dataR = r.data.Data
            dataR.openId = a
            app.setMembersInfo(dataR)
          } else {
            wx.navigateTo({
              url: "/pages/login/login"
            });
          }
        })
      })
    }
  },

  //获取门店信息id
  getStorId() {
    const { StoreId, BrandLevel } = wx.getStorageSync("userInfo");
    // console.log(StoreId+"==============="+BrandLevel);
    let obj = {
      StoreId: StoreId ? StoreId : 0,
      BrandLevel: BrandLevel ? BrandLevel : 0,
    }

    console.log(obj)
    this.setData({
      magnitudeObj: obj
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let user = wx.getStorageSync("userInfo");
    console.log(user);
    this.initData();
    wx.hideTabBar({})
    wx.hideShareMenu()
  },



  // 初始化页面数据
  initData: function () {
    wx.showLoading({
      title: '加载中...',
    })
    getCartList().then(res => {
      console.log("输出购物车列表数据", res);
      if (res.statusCode == 200) {
        wx.hideLoading()
        let { CartItemInfo } = res.data.Data
        CartItemInfo.forEach(item => {
          item.status = false;
          item.clearStatus = false;
          item.Quantity = parseInt(item.Quantity);
          item.ItemAdjustedPrice = parseFloat(item.ItemAdjustedPrice);
          item.MemberPrice = parseFloat(item.MemberPrice);
        })
        let list = res.data.Data
        let boo = list.CartItemInfo.length != 0;
        // console.log('布尔值',boo);
        this.setData({
          storeList: list,
          totalPrice: 0,
          goodsTotal: 0,
          selectAllStatus: false,
          boo,
        })
        app.data.cartNum = res.data.Data.RecordCount
      }
    })
  },

  // 改变商品的数量
  changeNum: function (e) {
    console.log('22222222222');
    let { storeList } = this.data;
    let { id, num } = e.currentTarget.dataset;
    let type = e.currentTarget.dataset.type;

    storeList.CartItemInfo.forEach(item => {
      item.Quantity = Number(item.Quantity)
      if (item.SkuID == id) {
        if (type == 'reduce') {
          if (item.Quantity != 1) item.Quantity -= 1;
        } else {
          this.changeGoods(item.SkuID, item.Quantity).then(res => {
            if (res) item.Quantity += 1;
          })
        }
        this.changeGoods(item.SkuID, item.Quantity);
        this.setData({ storeList })
        this.goodsSum()
      }
    })
  },

  blurFN(e) {
    let { storeList } = this.data;
    let { id } = e.currentTarget.dataset;
    let that = this
    storeList.CartItemInfo.forEach(item => {
      if (item.SkuID == id) {
        item.Quantity < 1 ? (item.Quantity = 1, that.goodsSum(), that.setData({ storeList })) : ''
      }
    })
  },

  inputFN(e) {
    let { storeList } = this.data;
    let { id } = e.currentTarget.dataset;
    let val = e.detail.value, that = this
    let type = e.currentTarget.dataset.type;
    storeList.CartItemInfo.forEach(item => {
      if (item.SkuID == id) {
        this.changeGoods(item.SkuID, val).then(res => {
          if (res) item.Quantity = val;
          that.goodsSum()
          that.setData({ storeList })
        })

        // if (type == 'reduce') {
        //   if (item.Quantity != 1) item.Quantity -= 1;
        // } else {
        //   this.changeGoods(item.SkuID, item.Quantity).then(res => {
        //     if (res) item.Quantity += 1;
        //   })



      }
    })


  },

  //改变商品的数量  发起请求
  changeGoods: function (id, num) {
    return changeGoodsNum({
      SkuID: id,
      Quantity: num
    }).then(res => {
      if (res.data.Status == 'Faile') {
        wx.showToast({
          icon: 'none',
          title: res.data.Message,
        })
        return false;
      }
      else return true
    })
  },


  // 全选
  selectAll: function () {
    let { storeList, selectAllStatus } = this.data;
    storeList.CartItemInfo.forEach(item => {
      item.status = !selectAllStatus
    })
    this.setData({
      storeList,
      selectAllStatus: !selectAllStatus
    })
    this.goodsSum()
  },

  //单选
  selelctSingle: function (e) {
    let { storeList } = this.data;
    let l = 0; // 选择项的长度
    let id = e.currentTarget.dataset.id;
    storeList.CartItemInfo.forEach(item => {
      if (item.SkuID == id) {
        item.status = !item.status;
        this.setData({ storeList })
      }
      if (item.status) l++;
      else l--;
    })
    if (l == storeList.CartItemInfo.length) this.setData({ selectAllStatus: true })
    else this.setData({ selectAllStatus: false })
    this.goodsSum();
  },

  // 计算价格
  goodsSum: function () {
    let { storeList, goodsTotal } = this.data;
    goodsTotal = 0;
    let totalPrice = 0;
    storeList.CartItemInfo.forEach(item => {
      if (item.status) {
        goodsTotal += item.Quantity;
        totalPrice += item.Quantity * item.MemberPrice;
      }
      this.setData({ totalPrice: totalPrice.toFixed(2), goodsTotal })
    })
  },

  // 触摸开始事件
  touchStart: function (e) {
    touchDotX = e.touches[0].pageX; // 获取触摸时的原点
    touchDotY = e.touches[0].pageY;
    // 使用js计时器记录时间    
    interval = setInterval(function () {
      time++;
    }, 100);
  },

  // 触摸结束事件
  touchEnd: function (e) {
    let { storeList } = this.data;
    let id = e.currentTarget.dataset.id;
    let touchMoveX = e.changedTouches[0].pageX;
    let touchMoveY = e.changedTouches[0].pageY;
    let tmX = touchMoveX - touchDotX;
    let tmY = touchMoveY - touchDotY;
    if (time < 20) {
      let absX = Math.abs(tmX);
      let absY = Math.abs(tmY);
      if (absX > 2 * absY) {
        storeList.CartItemInfo.forEach(item => {
          if (id == item.SkuID) {
            if (tmX < -5) item.clearStatus = true;
            else item.clearStatus = false;
            this.setData({ storeList })
          }
        })
      }

    }
    clearInterval(interval); // 清除setInterval
    time = 0;
  },

  //删除商品
  clear: function (e) {
    let { id, num } = e.currentTarget.dataset;
    clearGoods({
      SkuIDs: id,
      Quantity: num
    }).then(res => {
      console.log(res)
      this.initData();
    })

  },

  // 
  toFN() {
    wx.switchTab({
      url: wx.getStorageSync('getStore') ? '/pages/fujihang/fuIndexG/fuIndexG' : '/pages/fujihang/fuIndexZB/fuIndexZB'
    })
  },

  //获取优惠券
  getCoupon: function () {
    this.selectComponent("#coupon").showModal();
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