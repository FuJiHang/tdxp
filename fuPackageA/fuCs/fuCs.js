// fuPackageA/fuLive/fuLive.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    page: 1,
    finsh: false,
    cs:'<p><a href="http://fuPackageA/fuProductT/fuProductT?prDid=23014" target="_self" _href="http://fuPackageA/fuProductT/fuProductT?prDid=23014"><img src="https://img.hmeshop.cn/TDH/20200224/24113230782.jpg"/></a></p><p><br/></p>'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let imgList=[],aReg = /<a.*?(?:a>|\/a>)/gi,bind=/<a[^>]*href=['"]([^"]*)['"].*?[^>]*>(.*?)<\/a>/g;
    this.data.cs.match(aReg).forEach(s=>{
      let child={}
      while(bind.exec(s)!=null)  {
        child.to=RegExp.$1.split('http:/')[1]
        console.log(  RegExp.$1.split('http:/')[1],1111123);
      }
      s.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
          child.img=capture
      })
      imgList.push(child) 
    })
    console.log(imgList);
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