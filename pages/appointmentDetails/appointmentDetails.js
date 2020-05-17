// pages/appointmentDetails/appointmentDetails.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showDatePicke: false,
    appointTime: '请选择',
    selectedTechnician: {name:"请选择"}, // 选择技师
    mainTabs: [{
      text: "脸部1",
      id: 0,
      selected: true
    }, {
      text: "脸部2",
      id: 1,
      selected: false
    }, {
      text: "脸部3",
      id: 2,
      selected: false
    }, {
      text: "脸部4",
      id: 3,
      selected: false
    }, {
      text: "脸部5",
      id: 4,
      selected: false
    }, ],
    subTabs: [{
      text: "脸部1",
      id: 0,
      selected: true
    }, {
        text: "脸部2",
        id: 1,
        selected: false
      }, {
        text: "脸部3",
        id: 2,
        selected: false
      }, {
        text: "脸部4",
        id: 3,
        selected: false
      }, {
        text: "脸部5",
        id: 4,
        selected: false
      },]
  },


  // 显示时间选择器
  showPicker() {
    this.setData({
      showDatePicke: true
    })
  },

  // 选择时间
  bindSure(data) {
    console.log(data)
    this.setData({
      appointTime: data.detail.time
    })
  },

  // 主标签选择
  bindMainTab(e) {
    // console.log(e.currentTarget.dataset.index)
    var index = e.currentTarget.dataset.index;
    if(this.data.mainTabs[index].selected){ // 不能重复选中
      return
    }
    for (let val of this.data.mainTabs){
      if (val.selected) {
        console.log(val.selected)
        val.selected = false
        break
      }
    }
    this.data.mainTabs[index].selected = true
    this.setData({
      mainTabs: this.data.mainTabs,
    })
  },

  // 二级标签选择
  bindSubTab(e){
    var index = e.currentTarget.dataset.index;
    console.log(this.data.subTabs[index])
    if (this.data.subTabs[index].selected) { // 不能重复选中
      return
    }
    console.log()
    for (let val of this.data.subTabs) {
      console.log(val)
      if (val.selected) {
        val.selected = false
        break
      }
    }
    this.data.subTabs[index].selected = true
    this.setData({
      subTabs: this.data.subTabs,
    })
  },

  // 选择项目
  checkboxChange(e){
    console.log('选择项目', e.detail.value)
  },
  
  // 预约
  bindAppointment() {
    console.log('预约')
    // 预约成功后删除缓存
    wx.removeStorageSync('selectedTechnician')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (wx.getStorageSync('selectedTechnician')){
      this.setData({
        selectedTechnician: JSON.parse(wx.getStorageSync('selectedTechnician'))
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    wx.removeStorageSync('selectedTechnician')
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})