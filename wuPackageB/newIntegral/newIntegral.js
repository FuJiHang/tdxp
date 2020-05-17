// wuPackageB/newIntegral/newIntegral.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    nav:[{name:'积分奖励'},{name:'积分兑换'}],
    list:[
      {
        danhao:'201910200763',
        img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/sade.jpg',
        title:'雅诗兰黛红石榴洁面乳 雅诗兰黛红石榴洁面乳',
        num:3,
        jifen:264,
        time:'2019/10/20'
      },
      {
        danhao: '201910200763',
        img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/sade.jpg',
        title: '雅诗兰黛红石榴洁面乳 雅诗兰黛红石榴洁面乳',
        num: 3,
        jifen: 264,
        time: '2019/10/20'
      },
      {
        danhao: '201910200763',
        img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/sade.jpg',
        title: '雅诗兰黛红石榴洁面乳 雅诗兰黛红石榴洁面乳',
        num: 3,
        jifen: 264,
        time: '2019/10/20'
      },
      {
        danhao: '201910200763',
        img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/sade.jpg',
        title: '雅诗兰黛红石榴洁面乳 雅诗兰黛红石榴洁面乳',
        num: 3,
        jifen: 264,
        time: '2019/10/20'
      },
    ],
    nums:0, //用于导航栏切换
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  //点击切换nav导航栏
  handleNav(e){
    // console.log(e);
    const { index } = e.currentTarget.dataset;

    if(index==0){
      this.setData({
        nums: index
      }) 
    }else{
      this.setData({
        nums: index
      })
    }
    
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