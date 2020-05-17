const app = getApp();
import {
  countdown
} from '../../../utils/util.js'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goodsInfo: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl: app.imgUrl2,
    hiddenModal: true,
    limitShow: false,
    limitTxt: '',
    limitHours: '00',
    limitMin: '00',
    limitSecond: '00',
    groupList: [],  // 参团数据
    newSku:'',//商品sku
  },

  ready: function() {
    // console.log("拼团数据+++", this.data.goodsInfo.FightGroupInfos);
    // 参团倒计时
    setInterval(() => {
      this.Clusterdata()
    }, 1000)

    // 拼图狂欢倒计时
    setInterval(() => {
      this.initData()
    }, 1000)
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initData: function() {
      let {
        FightGroupActivityInfo,
        FightGroupInfos
      } = this.data.goodsInfo;
      // console.log("拼团组件的数据", FightGroupActivityInfo);
      let startState = countdown(FightGroupActivityInfo.StartDate);
      let endState = countdown(FightGroupActivityInfo.EndDate);
      if (startState.overTime) {
        this.setData({
          limitTxt: '距结束',
          limitHours: endState.limitHours,
          limitMin: endState.limitMin,
          limitSecond: endState.limitSecond
        })
      } else {
        this.setData({
          limitTxt: '距开始',
          limitHours: startState.limitHours,
          limitMin: startState.limitMin,
          limitSecond: startState.limitSecond
        })
      }
    },
    // 参团数据
    Clusterdata() {
      let {
        goodsInfo
      } = this.data;
      // console.log("参团数据", goodsInfo.FightGroupInfos);
      goodsInfo.FightGroupInfos.forEach((item, index) => {
        let endDate = countdown(item.EndTime);
        item.limitHours = endDate.limitHours;
        item.limitMin = endDate.limitMin;
        item.limitSecond = endDate.limitSecond;
        item.index = index;
      })
      // console.log("输出时间", goodsInfo.FightGroupInfos.limitSecond);
      // console.log("拼团数据", goodsInfo.FightGroupInfos);
      this.setData({
        groupList: goodsInfo.FightGroupInfos, //FightGroupSkuInfos
        // newSku: goodsInfo.FightGroupSkuInfos.SkuId
      })
      
    },

    //立即拼团
    joinGroup: function(e) {
      console.log("点击参团", e)
      let {goodsInfo} = this.data;
      let skuss = goodsInfo.FightGroupSkuInfos[0].SkuId;
      console.log("输出sku", skuss);
      this.setData({
        newSku:skuss
      })
      let {
        id,
        isown,
        sku,
        fightgroupid
      } = e.currentTarget.dataset;
      if (isown) {
        wx.showToast({
          icon: 'none',
          title: '不能参加自己的团'
        })
        return
      }
      wx.navigateTo({
        url: `/fuPackageA/fuOkOrder/fuOkOrder?fromPage=fightgroup&sku=${sku}&buyAmount=1&groupId=${id}&FightGroupId=${fightgroupid}`,
      })
    },
    //拼团结束
    joinOver(){
      wx.showToast({
        title: '已经结束啦!',
        icon: 'none',
        duration: 1500,
        mask: true,
        success: (result) => {
          
        },
        fail: () => {},
        complete: () => {}
      });
        
    },
  }
})