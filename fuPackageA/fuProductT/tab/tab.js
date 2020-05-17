const app = getApp();
import { countdown } from '../../../utils/util.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goodsInfo: Object,
    num: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl: app.imgUrl2,
    newImg: app.newImg,
    buyTxt: '立即购买',
    buyBtnBg: 'inner2-bg1',
    isDefault: null,
  },

  ready: function () {
    if (wx.getStorageSync('tab').WapTheme == 'fruit') this.setData({ isDefault: 1 })
    else this.setData({ isDefault: 2 })
    this.initData();
  },




  /**
   * 组件的方法列表
   */
  methods: {
    openShare(){
      console.log("2222222");
      this.triggerEvent('openShare')
    },
    // 
    toFN() {
      wx.switchTab({
        url: wx.getStorageSync('getStore') ? '/pages/fujihang/fuIndexG/fuIndexG' : '/pages/fujihang/fuIndexZB/fuIndexZB'
      })
    },

    toFNN(e){
      wx.switchTab({
        url:e.currentTarget.dataset.url
      })
      wx.navigateTo({
        url:e.currentTarget.dataset.url
      })
    },
    
    // 分享
    onShare() {
      this.triggerEvent("share")
    },
    //初始化页面数据
    initData: function () {
      let { buyTxt, buyBtnBg, goodsInfo } = this.data;
      let zc = goodsInfo.DefaultSku;//正常商品信息
      let pt = goodsInfo.FightGroupActivityInfo;//当前团购信息
      let gsku = goodsInfo.FightGroupSkuInfos[0];//团购sku列表
      if (goodsInfo.IsDiscount) buyBtnBg = 'inner2-bg2'
      if (goodsInfo.Is99) buyBtnBg = 'inner2-bg3'
      if (goodsInfo.IsCountDown) buyBtnBg = 'inner2-bg4'
      if (goodsInfo.IsWaitSale) buyBtnBg = 'inner2-bg5', buyTxt = '即将开抢'
      this.setData({
        buyTxt,
        buyBtnBg,
        normal: zc,
        ginfo: pt,
        gsku,
      })

      if (goodsInfo.FightGroupActivityInfo == null) return;
      if (goodsInfo.FightGroupActivityInfo.length == 0) return;
      let endState = countdown(goodsInfo.FightGroupActivityInfo.EndDate);
      if (endState.overTime) {
        goodsInfo.IsFightGroup = false;
        this.setData({
          goodsInfo: this.data.goodsInfo
        })
      }
    },

    onAdd: function (e) {
      console.log("输出点击规格弹窗", e);
      let obj = e.currentTarget.dataset
      // console.log("选择规格的参数",obj);
      // console.log("输出发起拼团", obj);
      wx.setStorageSync('buyType', e.currentTarget.dataset.type)
      // wx.setStorageSync('goumaizhi', obj.ddgm)
      this.triggerEvent('open', obj)
    },

  },
})
