// pages/fujihang/fuTeachList/fuTeachList.js

const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.imgUrl,//
    technicianid:'',//老师id
    checked:false,
    orderId:'',//订单id
    cardId:'',//项目id
    SkuId:'',
    isExcutor:false,//执行者
    bs:false,
    teacher:[
      // {
      //   name:'阿萨德',
      //   join:'尴尬事的',
      //   good:'科技总数量较大时考虑是的考虑房价擦拭了看地方cos但非常卡是单纯暗示的健康',
      //   list:[
      //     {
      //       name:'阿是肯定',
      //       mon:25.00,
      //       company:'爱神的箭接口',
      //       address:'啊时间的考虑',
      //       time:'2015/04/03 15:00:00'
      //     },
      //     {
      //       name:'阿是肯定',
      //       mon:25.00,
      //       company:'爱神的箭接口',
      //       address:'啊时间的考虑',
      //       time:'2015/04/03 15:00:00'
      //     },
      //   ]
      // },
      // {
      //   name:'阿萨德',
      //   join:'尴尬事的',
      //   good:'科技总数量较大时考虑是的考虑房价擦拭了看地方cos但非常卡是单纯暗示的健康',
      //   list:[
      //     {
      //       name:'阿是肯定',
      //       mon:25.00,
      //       company:'爱神的箭接口',
      //       address:'啊时间的考虑',
      //       time:'2015/04/03 15:00:00'
      //     },
      //     {
      //       name:'阿是肯定',
      //       mon:25.00,
      //       company:'爱神的箭接口',
      //       address:'啊时间的考虑',
      //       time:'2015/04/03 15:00:00'
      //     },
      //   ]
      // },
    ]
  },

  // 立即分配
  subFN(){
    if(!this.data.technicianid) return app.fa('请选择技师！')
    app.fl()
    app.fg({
      SkuId:this.data.SkuId,
      action:'ConfrimOrder',
      orderid:this.data.orderId,
      programid:this.data.cardId,
      technicianid:this.data.technicianid,
      openId:app.globalData.GetMembersInfo.openId,
      ConfirmType:this.data.isExcutor?2:0,
      bs:this.data.isExcutor&&this.data.bs?1:''
    }).then(r=>{
      app.fl()
      if(r.data.Status=="OK") {
        wx.navigateBack({
          delta: 1
        })        
      }
      else app.fa(r.data.Message)
    })
  },

  onChange:function(e){
    let data=this.data
    let index=e.target.dataset.id
    data.teacher[index].ischoose=!data.teacher[index].ischoose
    console.log(data.teacher)
    if(data.teacher[index].ischoose){
      for(let i=0;i<data.teacher.length;i++){
        if(i==index)  continue
        data.teacher[i].ischoose=false
      }
      data.technicianid=data.teacher[index].tId
    }else data.technicianid=''
    this.setData({
      teacher:data.teacher,
      technicianid:data.technicianid
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      bs:options.bs=='补色'?true:false
    })
    let data=this.data
    let that=this
    app.fg({
      action:'GetTechnicianPrograms',
      openId:app.globalData.GetMembersInfo.openId,
      StoreId:options.isExcutor?'':options.StoreId,
      OrderId:options.isExcutor?options.orderId:'',
      bs:options.isExcutor&&that.data.bs?1:''
    }).then(r=>{
      if(r.errMsg=="request:ok"){
        let datar=r.data.technicians
        for(let i=0;i<datar.length;i++){
          datar[i].ischoose=false
          datar[i].isOpen=false
          data.teacher.push(datar[i])
        }
        that.setData({
          SkuId:options.SkuId,
          teacher:data.teacher,
          orderId:options.orderId,
          cardId:options.cardId,
          isExcutor:options.isExcutor?options.isExcutor:''
        })
      }else app.fa("获取分配技师列表失败！")
    })
  },

  openOrClose(e){
    let index=e.currentTarget.dataset.index
    let data=this.data
    this.setData({
      ['teacher['+index+'].isOpen']:!data.teacher[index].isOpen
    })
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