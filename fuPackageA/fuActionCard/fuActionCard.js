const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.imgUrl,
    bg:0,
    submitList:[
      {
        name:'卡名',
        val:'',
        plr:'请输入卡名',
        pp:'ActivityCardName',
      },
      {
        name:'活动项目名称',
        val:'',
        plr:'请输入活动项目名称',
        pp:'ProductName',
      },
      {
        name:'价格',
        val:'',
        plr:'请输入价格',
        pp:'CostPrice',
      },
      {
        name:'领取所需金额',
        val:'',
        plr:'请输入金额',
        pp:'GetNeedPrice',
      },
      {
        name:'使用次数',
        val:'',
        plr:'请输入使用次数',
        pp:'RowNumber',
      },
      {
        name:'有效期',
        val:'',
        plr:'请选择有效期',
        pp:'CloseTime',
      },
    ],
    CardId:'',
    change:0,//0新建1更新2减少次数
    textarea:'',
    currentDate: new Date().getTime(),//默认时间
    minDate:new Date().getTime(),
  },

  // 
  openTime(e){
    this.setData({
      // timeIndex:e.currentTarget.dataset.index,
      showTime:true,
    })
  },
  // 选择时间
  onInput:function(event) {
    // console.log(event)
    this.setData({
      currentDate: event.detail
    });
  },
  // 关闭时间弹窗
  onClose() {
    this.setData({ showTime: false });
  },
  // 
  okTime(){
    let data=this.data
    // console.log(app.fttsM(this.data.currentDate))
    this.setData({
      ['submitList[5].val']:app.fttst(data.currentDate),
      showTime:false,
    })
    
    // console.log(this.data.currentDate)
  },
  // 
  colorFN(e){
      this.setData({
        bg:e.currentTarget.dataset.index,
      })
    
  },

  // 
  changFN(e){
    this.setData({
    [e.currentTarget.dataset.index]:e.detail.value

    })
  },
  submit(){
    let data=this.data,that=this
    for(let i=0;i<data.submitList.length;i++){
      if(!data.submitList[i].val) return app.fa(data.submitList[i].plr)
    }

    app.fg({
      action:'CheckContentSecurity', 
      Type:0,
      FormData:data.submitList[0].val+data.submitList[4].val+
      data.submitList[5].val+data.submitList[1].val+data.textarea
    }).then(t=>{
      if(t.data.Status!="OK"){
        app.fa(t.data.Message)
      }else{

        app.fl()
        app.fg({
          action:"EditStoreActivityCard",
          openId:app.globalData.GetMembersInfo.openId,
          // openId:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',
          UpdateType:data.change,
          CardName:data.submitList[0].val,
          UseCount:data.submitList[4].val,
          CloseTime:data.submitList[5].val,
          ColorType:data.bg,
          ProductName:data.submitList[1].val,
          GetNeedPrice:data.submitList[3].val,
          CostPrice:data.submitList[2].val,
          CardDetail:data.textarea,
          CardId:data.CardId,
        }).then(r=>{
          app.fh()
          if(r.data.Status=="OK"){
            setTimeout(()=>{
              wx.navigateBack({
                delta: 1
              })
            },1450)
          }
          app.fa(r.data.Message)

        })


      }
    })


    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.data){
      let data=JSON.parse(decodeURIComponent(options.data)),submitList=this.data.submitList
      submitList.forEach((c,i)=>{
        submitList[i].val=data[c.pp]  
      })
      this.setData({
        submitList:submitList,
        textarea:data.CardDetail,
        bg:data.ColorType,
        change:1,
        CardId:data.ActivityCardId,
      })
    }
    
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