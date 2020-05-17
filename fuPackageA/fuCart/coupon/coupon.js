const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    coupons: Array,  // 领劵
    promotionStr: Array  // 促销
  },

  /**
   * 组件的初始数据
   */

  data: {
    imgUrl: app.data.imgurl,
    hiddenModal: true,  //显示弹框  选择优惠券
    couponsData:[], // 优惠卷数据
    select:false, // 选择按钮
    id:'', // 优惠卷id
    nums:0, //选中的索引
    selectObj:{}, // 选中的数据
  },

  ready: function () {

  },

  /**
   * 组件的方法列表
   */
  methods: {

    //打开 / 关闭  modal
    showModal:function(){
      this.setData({
        hiddenModal: !this.data.hiddenModal
      })
      this.triggerEvent('selectedValue',this.data.selectObj)
    },

    //选择优惠券
    selectCou: function (e) {

      let {id,index,name,price,code} = e.currentTarget.dataset;
      let obj ={
        id:id,
        index:index,
        name:name,
        price:price,
        code:code
      }
      this.setData({
        select:!this.data.select,
        id,
        nums:index+1,
        selectObj:obj
      })
      

    },
    
  },
  // 隐藏
  handleHide(){
    console.log("触发了吗");
  }
})
