const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.imgUrl,
    appList:[
      {
        name:'技师',
        text:'描述的小文字',
        img:app.imgUrl+'role_icon_02.png',
        bg:"bg1",
      },
      {
        name:'渠道',
        text:'描述的小文字',
        img:app.imgUrl+'role_icon_04.png',
        bg:"bg3",
      },
      {
        name:'店家',
        text:'描述的小文字',
        img:app.imgUrl+'role_icon_01.png',
        bg:"bg0",
      },
    ],//身份列表
    applicaData:{},//申请身份
    bottomConter:'本人为人和善，医德高尚，对生活充满激情。勤学好问，认真负责，对工作细心、热忱。在实习过程中，以患者为中心，向患者学习，积累了大量的实际临床经验，对常见疾病有丰富的经验，对疑难杂症亦有一定的了解。我相信，只要不断学习，技术就能不断进步。',
    informationData:[
      {
        title:'姓名',
        val:'',
        data:'RealName'
      },
      {
        title: '生日',
        val: '',
        data:'BirthDate'
      },
      {
        title: 'QQ',
        val: '',
        data:'QQ'
      }
    ],
    isOpen:false,//弹窗
    getData:{},//获取数据
    repelreason:'',//理由
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    wx.getStorage({
      key:'toData',
      success:res=>{
        let data=JSON.parse(res.data)
        for(let i=0;i<that.data.informationData.length;i++){
          that.data.informationData[i].val=data[that.data.informationData[i].data]
        }
        if(data.fSF!=2){
          
          data.Picture=data.Picture.split(",")
          console.log(data)
        }else{
          data.Picture=data.EnvironmentImages.split(",")
          
        }
        
        that.setData({
          applicaData:that.data.appList[data.fSF],
          getData:data,
          informationData:that.data.informationData
        })
        
        console.log(JSON.parse(res.data) )
      }
    })
  },

  // 提交内容
  submitFN(e){
    let data=this.data
    let index=e.currentTarget.dataset.index
    
    let postD={
      action:'RoleAuditing',
      openId:app.globalData.GetMembersInfo.openId,
      auditingid:data.getData.Id?data.getData.Id:data.getData.StoreId
    }
    if(index){
      postD.isauditing=0
      postD.repelreason=data.repelreason
    }else{
      postD.isauditing=1
      
    }
    switch (data.getData.fSF) {
      case 0:
          postD.type="TC"
      break;
      case 1:
        postD.type="BS"
      break;
      case 2:
        postD.type="ST"
      break;
    }
    app.fl()
    app.fg(postD).then(r=>{
      app.fh()
      setTimeout(()=>{
        wx.navigateBack({
          delta: 1
        })            
      },1500)
      this.setData({
        isOpen:false
      })
      app.fa(r.data.Message)

    })

  },
  openFN(){
    this.setData({
      isOpen:true
    })
  },
  closeFN(){
    this.setData({
      isOpen:false
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