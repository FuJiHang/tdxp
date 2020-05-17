const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    totalPrice: Number,  // 商品总价  非传值
    goodsTotal: Number, // 商品总条数  非传值
    storeList: Object,
    magnitude: Object,
    selectAllStatus:Boolean,
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl: app.data.imgurl,
    isDefault: null, //判断是否为默认tab样式
  },

  ready(){
    if (wx.getStorageSync('tab').WapTheme == 'fruit') this.setData({ isDefault: 1 })
    else this.setData({ isDefault: 2 })
  },

  /**
   * 组件的方法列magnitude表
   */
  methods: {
    placeOrder:function(e){
      // console.log(e);
      // let str = e.currentTarget.dataset.frompage;
      // console.log("=====87948======", str);
      let { storeList } = this.data;
      console.log("输出购物车数组",storeList);
      let sku = [];
      storeList.CartItemInfo.forEach(item =>{
        if (item.status) sku.push(item.SkuID)
      })
      if (sku.length == 0){
        wx.showToast({
          icon: 'none',
          title: '请选择商品'
        })
        return;
      }
      console.log("输出结算的规格", sku);
      wx.navigateTo({
        // url: `/fuPackageA/fuOkOrder/fuOkOrder?sku=${sku.join(',')}&fromPage=${str}`,
        // url: `/fuPackageA/fuOkOrder/fuOkOrder?sku=${sku.join(',')}&buyAmount=${RecordCount}`,
        url: `/fuPackageA/fuOkOrder/fuOkOrder?sku=${sku.join(',')}&RoomId=&{storeList.RoomId}`,
      })
    },


    // 跳转掌柜页面
    handleMagnitude(){
      wx.redirectTo({
        url: '/packageA/pages/shopkeeperList/shopkeeperList',
        success: (result) => {
          
        },
        
      });
        
    },

    // 跳转升级页面
    handleUpgrade(){
      wx.navigateTo({
        url: '/pages/upgradeMember/upgradeMember',
        success: (result) => {
          
        },
      });
    },
    
    selectAll(){

      this.triggerEvent('selectAllZ','')
    },
    // 回首页
    goIndex(){
      console.log("触发了");
      wx.switchTab({
        url: wx.getStorageSync('getStore')?'/pages/fujihang/fuIndexG/fuIndexG':'/pages/fujihang/fuIndexZB/fuIndexZB'
      });
    },
  }
})
