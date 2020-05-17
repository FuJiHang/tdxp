const app = getApp();
import { countdown } from '../../../utils/util';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    pageType: Number,
    goodsInfo: Object,
    storeid: Number,
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl: app.imgUrl2,
    IsCollect: "", //收藏
    ShopName: null,
    limitDay:'',
    limitTxt: '',
    limitHours: '',
    limitMin: '',
    limitSecond: '',
    getStore:{},
    jzjs: [
      {
        name: "精选好货",
        img: ' http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/dd@3x5.png'
      },
      {
        name: "正品保障",
        img: ' http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/dd@3x6.png'
      },
      {
        name: "假一赔十",
        img: ' http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/dd@3x1.png'
      },
      {
        name: "售后无忧",
        img: ' http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/dd@3x2.png'
      },
    ],
  },

  ready: function () {
    let ShopName = wx.getStorageSync("tab").SiteName
    console.log("======", ShopName)
    this.setData({//IsCollect
      // IsFavorite: this.data.goodsInfo.IsFavorite,
      IsCollect: this.data.goodsInfo.IsCollect,
      ShopName: ShopName,
      getStore: wx.getStorageSync("getStore")
    })
    

    this.data.goodsInfo.IsCountDown?this.djsFN():''
  },
 
  /**
   * 组件的方法列表
   */
  methods: {
    Celect() {
      app.fg({
        url: '/API/MembersHandler.ashx?action=AddFavorite',
        data: {
          ProductId: this.data.goodsInfo.DefaultSku.ProductId,
          StoreId: this.data.storeid
        }
      }, true).then(res => {
        console.log("输出点击收藏", res);
        if (this.data.IsCollect == false) {
          this.setData({
            IsCollect: true
          })
          wx.showToast({
            title: res.data.Message,
          })
        } else {
          this.setData({
            IsCollect: false
          })
          wx.showToast({
            title: '取消收藏',
            icon: 'none',
            image: '',
            duration: 1500,
            mask: false,
            success: (result) => {

            },
            fail: () => { },
            complete: () => { }
          });

        }
      })

      
    },
    addRed(){
      wx.redirectTo({
        url:'/fuPackageA/fuProductT/fuProductT?prDid=541&pagetype=undefined&storeid=undefined&dname=undefined&IsShowVideo=false'
      })
    },

    // 分享好友
    onShareAppMessage(res) {
      let prDid = this.data.goodsInfo.prDid;
      let storeid = this.data.goodsInfo.storeid;
      console.log("分享好友", obj);
      console.log("分享好友商品id", prDid);
      console.log("分享好友门店id", storeid);
      var paths = `/fuPackageA/fuProductT/fuProductT?prDid=${prDid}&storeid=${storeid}`
      console.log("输出分享路径", paths);
      return {
        title: '商品分享',
        path: paths,
        imageUrl: this.data.shareInfo.ImageUrl1
      }
      
    },

    djsFN(){
      let data = this.data, that = this
      console.log( countdown(data.goodsInfo.CountDownSkuInfo.StartDate), countdown(data.goodsInfo.CountDownSkuInfo.EndDate),22222222222111111);
      var djs = setInterval(() => {
        let startState = countdown(data.goodsInfo.CountDownSkuInfo.StartDate);
        let endState = countdown(data.goodsInfo.CountDownSkuInfo.EndDate);
        if (startState.overTime) {
          that.setData({
            limitTxt: '距结束',
            limitDay:parseInt( endState.limitHours/24),
            limitHours: endState.limitHours%24>10?endState.limitHours%24:'0'+endState.limitHours%24,
            limitMin: endState.limitMin,
            limitSecond: endState.limitSecond
          })
          if(endState.limitHours=='00'&&endState.limitMin=='00'&& endState.limitSecond=='00'){
            clearInterval(djs)
            that.setData({
              limitTxt: '已结束',
     
            })
          }
        } else {
          that.setData({
            limitTxt: '距降价',
            limitDay:parseInt( startState.limitHours/24),
            limitHours: startState.limitHours%24>10?startState.limitHours%24:'0'+startState.limitHours%24,
            limitMin: startState.limitMin,
            limitSecond: startState.limitSecond
          })
        }
  
      }, 1000)
  
    },

    // 客服
    serviceWin() {
      // wx.showToast({
      //   title: '美洽客服未开启',
      //   icon: 'none',
      //   duration: 2000,
      //   mask: false,
      //   success: (result) => {

      //   },
      //   fail: () => {},
      //   complete: () => {}
      // });
      // this.triggerEvent('shareBtn')
    },
    openShare(){
      console.log("2222222");
      this.triggerEvent('openShare')
    }
  }
})