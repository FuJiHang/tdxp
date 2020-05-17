// components/fujihang/upDownList/upDownList.js\

const app=getApp()
Component({

  /**
   * 页面的初始数据
   */
  data: {
    checked:false,
  },
  properties: {
    data:Object,
    isCard:Number,
    StoreId:String,
  },
  methods: {
      // 选择
      onChange(){
        if(this.data.isCard!=0){
          let checked=!this.data.checked
          this.setData({
            checked:checked
          })
          this.data.data.checked=checked
          this.triggerEvent('compontpass', this.data.data)
        }else{
          let fun='UploadStoreProduct'
          if(this.data.checked) fun='DeleteStoreProducts'
          app.fl()
          app.fg({
            openId:app.globalData.GetMembersInfo.openId,
            ProductId:this.data.data.ProductId,
            action:fun,
            StoreId:this.data.StoreId
          }).then(r=>{
            if(r.data.Status=="OK"){
              this.triggerEvent('compontpass', this.data.data)   
            }else{
              app.fh()
              app.fa("操作失败！")
            }
          })
        }
        
      },
    
  },
  attached:function(){
    this.setData({
      checked:this.data.data.choose
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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