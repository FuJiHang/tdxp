
const app = getApp();
import { getAddressList, getOrderInfo, submitOrderInfo, payOrder, } from "../../utils/requestApi";
import { toPay } from '../../utils/util';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    imgUrl2: app.newImg,
    chooseType: [
      {
        name: '公司发货',
        img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/ps652486d512200ca1-cd2a-496a-b56f-3c279886c11a.png',
        tip: '选择地址'
      },
      {
        name: '到店自提',
        img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/order_shop.png',
        tip: '选择门店'
      },
    ],
    isChoose: 0,
    defaultAddressData: null, //地址
    addName: '', //姓名
    addTell: '',//电话
    shippingid: '',//地址id
    express: ['顺丰', '圆通', '中通', '韵达'],
    expressVal: '', // 快递值
    defaultAddressData: null, //地址
    orderInfo: [], //商品列表
    goodsNum: 0, // 商品列表总数
    goodsTotalPrice: 0, //商品总价
    sku: null, //商品id
    fromPage: null,
    hiddenPay: true, //支付modal
    payType: false, // 选择支付类型
    buyAmount: null, //
    groupId: null,//拼团活动id
    couponList: null, //优惠券 
    FightGroupId: 0, //开团为0，参团为FightGroupId
    isDefault: true,
    OrderFreight: 0, //运费
    Balance: 0, // 余额
    deduction: false, // 控制是否采用余额抵消
    doorto: 0, // (0快递-1门店-2自提)
    zhifu: 0, // 控制支付
    remark: '', // 备注
    orderStatus: false, // 自提信息的显示隐藏
    amount: true, // 控制订单号的获取,false才可以支付
    BalanceAmount: 0, //可用于抵扣的值
    couponData: {}, // 选中的优惠卷数据
    prDid: null, //商品id
    storeid: '',//门店id
    mdMessage: null,
    pType: '',//用于判断是否是卡拼团
    list: [],//new优惠卷列表
    yhShow: false,
    code: '', //优惠券标识字符串
    price: '',//优惠价格
    mdList: [],//门店列表
    mdShow: false,
    mdHide: true,
    listShow: false,
    mdNums: -1,
    objData: {},
    notPayOne: false,
    countDownId:'',//限购id
    PreSaleId:'',
    zhiti:{
      name:'',
      phone:"",
    },
    giftList:'',//0元购列表
    isGift:{
      id:0,
      name:'',
      isShow:false,
    }
    // csSid:'171'
  },

  inputFN(e){
    this.setData({
      [e.currentTarget.dataset.name]:e.detail.value
    })
  },

  // 
  chooseGift(e){
    let isGift=this.data.isGift,datar=e.currentTarget.dataset
    isGift.id==datar.id?(isGift.id=0,isGift.name=''):(isGift.id=datar.id,isGift.name=datar.name)
    isGift.isShow=false
    this.setData({
      isGift:isGift
    })
  },
  openFN(){
    this.setData({
      ['isGift.isShow']:true
    })
  },
  handleCloseGoods(){
    this.setData({
      ['isGift.isShow']:false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.countDownId=options.countDownId?options.countDownId:''
    options.RoomId?this.data.RoomId=options.RoomId:''
    wx.removeStorage({
      key: 'isAddressF',
    })
    this.setData({
      giftList:wx.getStorageSync('isGiftList')
    })
    console.log(this.data.giftList,2222222222)
    console.log("输出options", options);
    // const {StoreId} = wx.getStorageSync('userinfo');
    let sid
    if (wx.getStorageSync('getStore')) {
      sid = wx.getStorageSync('getStore').StoreId
    } else {
      sid = options.storeid
    }
    let {
      sku,
      fromPage,
      buyAmount,
      groupId,
      FightGroupId,
      prDid,
      ProductId,
      productSku,
      storeid,
      pType,
      PreSaleId,
    } = options;
    app.globalData.storeId =sid
    console.log("是否获取到团id", FightGroupId);
    this.setData({
      sku,
      fromPage,
      buyAmount,
      groupId,
      FightGroupId,
      prDid,
      ProductId,
      productSku,
      storeid: sid,
      pType,//用判断是不是卡拼团
      PreSaleId,//是否预定
      RoomId:'',//购物车房间id
    })
    if (fromPage === undefined) {
      console.log("输出的fromPage的值是什么1", fromPage);
      console.log("输出的fromPage的值是什么2", fromPage === undefined);
      this.setData({
        fromPage: ''
      })
    }
    prDid?this.getDataR(prDid):''//获取优惠卷
    this.getdefaultAddress();
    // this.getData();//获取门店数据测试用
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that=this
    wx.getStorage({
      key: "isAddressF",
      success: function (r) {
        let isAddressF = JSON.parse(decodeURIComponent(r.data))
        let str = isAddressF.FullAddress.trim();
        let id = isAddressF.ShippingId
        that.setData({
          defaultAddressData: str,
          addName: isAddressF.ShipTo,
          addTell: isAddressF.CellPhone,
          shippingid: id
        })
      }
    })
  },
  //跳转添加地址
  handleAddress() {
    wx.navigateTo({
      url: '/wuPackageB/recAddress/recAddress?isBuy=true',
    });

  },
  //切换导航栏
  handleClick(e) {
    const { index } = e.currentTarget.dataset;
    if (this.data.mdMessage.SendGoodsType == 0 && index != 0) return app.fa('不支持到店自提！')
    if (this.data.mdMessage.SendGoodsType == 1 && index != 1) return app.fa('不支持公司发货！')
    if (index == 1) {
      let obj = {
        add: wx.getStorageSync('getStore').Address,
        name: wx.getStorageSync('getStore').StoreName,
        sid: wx.getStorageSync('getStore').StoreId,
        tell: wx.getStorageSync('getStore').CellPhone,
      }
      this.setData({
        isChoose: index,
        doorto: -2,
      })
      wx.getStorageSync('getStore') ? this.setData({
        listShow: false,
        objData: obj,
        mdShow: true,
        mdHide: false,
      }) : ''

      this.getData()
    } else {
      this.setData({
        isChoose: index,
        doorto: 0
      })

    }

  },
  //获取地址
  getdefaultAddress() {
    let that = this;
    getAddressList({
      openId:app.globalData.GetMembersInfo.openId,
    }).then(res => {
      if (res.data.Status == "Success") {
        let id = res.data.Data[0].ShippingId;
        console.log("获取地址", res)
        if (res.data.Data != "[]") {
          let data = res.data.Data;
          data.forEach(v => {
            if (v.IsDefault == true) {
              let str = v.FullAddress.trim();
              let id = v.ShippingId
              that.setData({
                defaultAddressData: str,
                addName: v.ShipTo,
                addTell: v.CellPhone,
                shippingid: id
              })
              // that.initData(id);///////---------------------------------
            }
          })
        }
        that.initData(that.data.shippingid || id);///////---------------------------------
      } else if (res.data.Status == "Login") {
        wx.showToast({
          title: '还未登录~~~',
          icon: 'none',
          duration: 2000,
          mask: true,
          success: (result) => {
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              });
            }, 1000);
          },
        });
      }
    })
  },

  ///---------------------------------------------------------------------------

  //初始化页面数据
  initData: function (id) {
    wx.hideLoading();
    let {
      fromPage,
      sku,
      buyAmount,
      ProductId,
      productSku
    } = this.data;
    // console.log("输出初始化fromPage", fromPage);

    // wx.showLoading({-----------------------------------------
    //   title: '加载中...',
    // })

    let {
      goodsNum,
      goodsTotalPrice,
      defaultAddressData,
      groupId,
      storeid
    } = this.data;
    let that = this
    console.log("订单生成页面1sku", sku);
    console.log("订单生成页面2sku", this.data.sku);
    console.log("订单生成页面2productSku", productSku);
    // console.log("订单生成页面2productSku",productSku);
    console.log("asdasd+++groupId", groupId);
    getOrderInfo({
      shipAddressId: id || 0,//defaultAddressData.ShippingId,
      fromPage: fromPage ? fromPage.trim() : '',
      productSku: this.data.sku || productSku,
      buyAmount: buyAmount || '',///
      fightGroupActivityId: groupId || '',//fromPage == 'signbuy'的时候为单独购买,不传团id
      RStoreId: storeid || '',///
      openId:app.globalData.GetMembersInfo.openId,
      countDownId:that.data.countDownId,
      PreSaleId:that.data.PreSaleId,
    }).then(res => {
      console.log("获取订单详情1", res);
      if (res.data.Status == 'Success') {
        wx.hideLoading();
        res.data.Data.ProductItems.forEach(item => {
          goodsNum += item.Quantity
          // goodsTotalPrice = res.data.Data.ProductAmount  TotalPrice
          goodsTotalPrice = res.data.Data.TotalPrice
        })
        // console.log("给优惠卷2", res.data.Data.CouponList);
        this.setData({
          Balance: res.data.Data.Balance,
          OrderFreight: res.data.Data.OrderFreight,
          orderInfo: res.data.Data.ProductItems,
          goodsNum,
          goodsTotalPrice,
          couponList: res.data.Data.CouponList,
          mdMessage: res.data.Data
        })
        let cs = {

          currentTarget: {
            dataset: {
              index: 1
            }
          }


        }
        if (res.data.Data.SendGoodsType == 1) that.handleClick(cs)
      } else {
        console.log("输出错误信息", res);
      }
    })

  },

  //确认订单
  submintOrder: function () {
    this.setData({
      amount: false  // 用于改变状态  可以获取到订单号
    })

    this.submitData(); // 提交订单
  },

  // 订单提交数据
  submitData() {


    let that = this;
    var {
      fromPage,
      sku,
      defaultAddressData,
      buyAmount,
      groupId,
      productSku,
      shippingid,
      storeid
    } = that.data;



    if (!shippingid && this.data.pType != 2 && that.data.doorto != -2) {
      wx.showToast({
        icon: "none",
        title: '请选择一个地址',
      })
      return
    }
    if (that.data.doorto == -2) {
      var wjxId = that.data.objData.sid
    } else {
      var wjxId = storeid
    }
    console.log("调起++++++++++++++++++", storeid); //171
    console.log("调起++++++++++++++++++", app.globalData.roomId,that.data.RoomId); //171

    submitOrderInfo({
      openId: app.globalData.GetMembersInfo.openId,
      shippingId: shippingid || 0,//defaultAddressData.ShippingId, //收货地址id（测试值43）
      productSku: sku || productSku, //购物车商品规格 多个商品用,隔开
      fromPage: fromPage == '' ? '' : fromPage ? fromPage.trim() : 'signbuy',   // 活动（详情见备注）
      buyAmount: buyAmount || "", // 购买数量
      fightGroupActivityId: fromPage == 'signbuy' ? '' : groupId, // 拼团活动ID
      FightGroupId: fromPage == 'signbuy' ? '' : that.data.FightGroupId,  // 参团的拼团ID，开团为0
      OrderSource: 8,
      // couponCode: this.data.couponData.code || '', //优惠劵代码 this.data.couponData.price 
      couponCode: this.data.code || '', //优惠劵代码 this.data.couponData.price 
      remark: that.data.remark || '',   //	备注
      IsAdvancePay: that.data.deduction,  // 是否使用余额抵扣
      IsGetOrderTotal: that.data.amount, // 是否只计算订单金额（true只计算金额false生成订单）
      ShippingModeId: that.data.doorto, // 配送方式(0快递-1门店-2自提)
      // StoreId: storeid ? storeid : this.data.storeid
      RStoreId: wjxId,
      ReferralUserId: wx.getStorageSync('referralUserIdTwo'),
      ReferralStoreUserId:wx.getStorageSync('referralUserIdTwo'),
      countDownId:that.data.countDownId,
      PreSaleId:that.data.PreSaleId,
      SelfPickName:that.data.zhiti.name,
      SelfPickPhone:that.data.zhiti.phone,
      roomId:that.data.RoomId||app.globalData.roomId,
      SendGiftId:that.data.mdMessage.SendGift&&that.data.mdMessage.SendGift.GiftId?that.data.mdMessage.SendGift.GiftId:0
    }).then(res => {

      console.log("支付详情", res);
      if (res.data.Status == 'Faile') return app.fa(res.data.Message)
      let pinId = res.data.FightGroupId // 拼团id
      console.log("输出拼团id1", pinId);
      if (that.data.zhifu == 1) {  // 为1的时候  调用支付功能
        // console.log("支付控制", that.data.zhifu);
        if (res.data.Status == "Success") {
          let {
            OrderTotal,
            OrderId
          } = res.data;
          console.log("正常支付输出formid", that.data.formid);
          // that.addFormData(that.data.formid, OrderId, 1)
          if (that.data.deduction) { //  采用抵扣余额
            if (pinId > 0) {  //判断是跳转拼团详情还是普通支付完成页面
              console.log("输出拼团id2", pinId);
              wx.showLoading({
                title: '加载中...',
                mask: true,
                success: (result) => {
                  setTimeout(() => {
                    wx.hideLoading();
                    wx.navigateTo({
                      url: `/wuPackageB/groupCompleted/groupCompleted?fromPage=${fromPage}&FightGroupId=${pinId}&sku=${sku}&prDid=${this.data.prDid}`,
                    })
                  }, 1000);
                },
                fail: () => { },
                complete: () => { }
              });

            } else {
              app.fh()
              wx.navigateTo({
                url: `/fuPackageA/fuOrderTip/fuOrderTip?total=${that.data.PreSaleId?that.data.mdMessage.DepositMoney:OrderTotal}&orderid=${OrderId}&PreSaleId=${that.data.PreSaleId}`,
              })
            }

            payOrder({ //将订单号传给后台
              orderId: OrderId,
              pinId
            }).tnen(res => {
              wx.hideLoading();
              console.log("正常支付输出formid", that.data.formid);
              // that.addFormData(that.data.formid, OrderId, 1)
              payOrder
              console.log("输出支付参数", res);
              wx.navigateTo({
                url: `/fuPackageA/fuOrderTip/fuOrderTip?total=${that.data.PreSaleId?that.data.mdMessage.DepositMoney:OrderTotal}&orderid=${OrderId}&PreSaleId=${that.data.PreSaleId}`,
              })
            })


          } else {


            if (pinId > 0) { //判断是跳转拼团详情还是普通支付完成页面
              console.log("输出拼团id", pinId);

              toPay(OrderId, res => {
                console.log("支付成功输出的值", res);
                console.log("正常支付输出formid", that.data.formid);
                app.fh()
                // that.addFormData(that.data.formid, OrderId, 2)
                wx.navigateTo({
                  url: `/wuPackageB/groupCompleted/groupCompleted?FightGroupId=${pinId}&prDid=${this.data.prDid}`,
                })
              }, storeid)

            } else {

              toPay(OrderId, res => {
                console.log("支付成功输出的值", res);
                // that.addFormData(that.data.formid, OrderId, 2)
                app.fh()
                wx.navigateTo({
                  url: `/fuPackageA/fuOrderTip/fuOrderTip?total=${that.data.PreSaleId?that.data.mdMessage.DepositMoney:OrderTotal}&orderid=${OrderId}&PreSaleId=${that.data.PreSaleId}`,
                })

              }, storeid)
            }

          }
        } else {
          app.fh()
          console.log("输出错误信息", res);
        }
      } else {
        wx.hideLoading();
        console.log("不支付数据", res);
        if (res.data.Status == "Success") {
          that.setData({
            BalanceAmount: res.data.BalanceAmount, // 可抵扣的钱
            goodsTotalPrice: res.data.OrderTotal   // 抵扣前后的值
          })
        }
      }
    })
  },
  // 获取支付参数

  //打开   关闭modal
  payModal: function () {
    app.fl()
    let that = this
    if (this.data.notPayOne) return
    this.data.notPayOne = true
    setTimeout(() => {
      that.data.notPayOne = false
    }, 1500)
    this.selectPay();
    // this.setData({
    //   hiddenPay: !this.data.hiddenPay
    // })
  },

  catchStop: function (e) { },

  //选择支付方式
  selectPay: function () {
    this.setData({
      payType: true,
      zhifu: 1
    })
    // wx.showLoading({
    //   title: "支付中~~~",
    //   mask: true,
    // });
    this.submintOrder()
  },

  //获取优惠券
  getCoupon: function () {
    this.selectComponent("#coupon").showModal();
  },

  //余额抵扣
  switchChange(e) {
    let baStatus = e.detail.value;
    if (baStatus) {
      this.setData({
        deduction: true,
        amount: true
      })
      this.submitData()
    } else {
      this.setData({
        deduction: false,
        amount: true
      })
      this.submitData()
    }
  },

  //是否自提
  doorTo(e) {
    this.setData({ amount: true })
    let doorInfo = e.detail.value;
    if (doorInfo) {
      this.setData({
        doorto: -2,
        orderStatus: true,
        amount: true
      })
      this.submitData()
    } else {
      this.setData({
        doorto: 0,
        orderStatus: false,
        amount: true
      })
      this.submitData()
    }

  },
  // 获取备注的值
  handleVal(e) {
    let val = e.detail.value;
    this.setData({
      remark: val
    })
  },

  //获取选中的优惠卷的数据
  getDataR(id) {
    console.log(id,21111111544);
    let data = this.data;
    let type = this.data.pType;
    var sid = data.storeid ? data.storeid : ''
    console.log("输出优惠券的类型", type)
    if (type == 0) {//代表是商品
      var nums = 1;
      var stoid = ''
    } else if (type == 2) {//代表次数卡
      var nums = 2
      var stoid = sid
    }
    app.fl()
    app.fg({
      action: 'LoadCoupon',
      openId: wx.getStorageSync('openId') || app.globalData.GetMembersInfo.openId,
      couponType: 1,
      pageIndex: 1,
      ProductId: id.trim(),
      pageSize: 10,
      StoreId: stoid,
      Type: nums
    }).then(res => {
      console.log("获取优惠卷2", res);
      app.fh()
      if (res.data.Status == "OK") {
        this.setData({
          list: res.data.Data
        })
      } else {
        console.log("输出错误信息", res);
      }
    })
  },

  //打开优惠券列表
  handleYH() {
    this.setData({
      yhShow: true
    })
  },
  //关闭优惠卷
  handleGB() {
    this.setData({
      yhShow: false
    })
  },
  //点击使用优惠卷
  chooseFN(e) {
    console.log("输出当前点击的优惠券", e);
    const { code, index, price } = e.currentTarget.dataset;
    this.setData({
      code,
      price,
      yhShow: false
    })
    // this.initData(this.data.shippingid)
  },

  //点击获取门店
  handleShop() {
    this.setData({
      mdShow: true,
      // mdHide:false
      listShow: true
    })
  },

  //获取门店列表数据
  // 
  getData(e) {
    let zb = wx.getStorageSync('LatiLongitude');//获取当前坐标
    // app.fl()
    app.fg({
      url: '/AppShop/AppShopHandler.ashx?action=GetStoreList',
      data: {
        pageIndex: 1,
        pageSize: 1000,
        Type: 1,
        Lan: zb.Latitude,
        Lng: zb.Longitude,
        StoreId: this.data.storeid
      }
    }, true).then(res => {
      console.log("输出门店数据", res);
      if (res.errMsg == "request:ok") {
        let arr = res.data.Result.StoreList;
        arr.forEach((c, i) => {
          if (c.Distance.indexOf('km') != -1) {
            c.add = c.Distance.replace('km', '千米')
          } else if (c.Distance.indexOf('m') != -1) {
            c.add = c.Distance.replace('m', '米')
          }
          if (c.StoreId == this.data.storeid) {
            console.log("输出171的index", i);
            let obj = {}
            obj.add = c.Address;
            obj.name = c.StoreName;
            obj.tell = c.Tel;
            obj.sid = c.StoreId;
            this.setData({
              mdNums: i,
              objData: obj
            })
          }
        })
        this.setData({
          mdList: arr
        })
      }
    })
  },
  //点击选中门店
  handleSearch(e) {
    console.log("触发了吗");
    console.log(e);
    const { index, add, name, tell, sid } = e.currentTarget.dataset;
    let obj = {}
    obj.add = add;
    obj.name = name;
    obj.tell = tell;
    obj.sid = sid;
    this.setData({
      mdNums: index,
      objData: obj
    })
  },
  //选择门店点击确定
  handleQD() {
    console.log("输出选中的结果", this.data.objData);
    let obj = this.data.objData;
    this.setData({
      listShow: false,
      objData: obj,
      mdShow: true,
      mdHide: false,
    })
  },
  //重新选择门店
  handleCX() {
    this.setData({
      listShow: true
    })
  },
  //点击关闭
  handleXX() {
    this.setData({
      listShow: false,
      // mdShow:false
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