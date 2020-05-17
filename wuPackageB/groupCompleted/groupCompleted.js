let app = getApp();
import {countdown} from "../../utils/util";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.newImg,
    imgss: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/sade.jpg',
    teamList:[],
    prDid:'',//商品id
    limitHours: '00',
    limitMin: '00',
    limitSecond: '00',
    gid:'',
    prDid:'',
    status:null,
    userArr:[],//成功数组
    dataInfo:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTeamBuy();
    this.getInit(options.FightGroupId);
    this.setData({
      gid: options.FightGroupId,//团id
      prDid:options.prDid.trim()//商品id
    })

    // setInterval(() => {
    //   this.countData(this.data.sTime,this.data.eTime)
    // }, 1000)
  },

  // 参团数据 
  countData (start,end) {
    let startState = countdown(start);
    let endState = countdown(end);
    // console.log('startState',startState);
    // console.log('endState',endState);
    this.setData({
      limitHours: endState.limitHours,
      limitMin: endState.limitMin,
      limitSecond: endState.limitSecond,
    })
  },
  

  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  //初始化数
  getInit(id){
    app.fl()
    app.fg({
      url: '/API/OrdersHandler.ashx?action=FightGroupDetailsById',
      data: {
        FightGroupId:id,	//是	string	团Id
      },
    }, true).then(res => {
      app.fh()
      if(res.data.Status=="Success"){
        let sTime = res.data.StartTime;
        let eTime = res.data.EndTime;
        this.setData({
          prDid:res.data.ProductId,
          sTime,
          eTime,
          status: res.data.FightGroupStatus,
          userArr: res.data.FightGroupUsers,
          dataInfo:res.data,
        })
        setInterval(() => {
          this.countData(sTime,eTime)
        }, 1000)
        // this.countData(sTime,eTime)
      }
    })
  },

  // 获取拼团列表数据
  getTeamBuy() {
    let data = this.data, that = this
    app.fl()
    app.fg({
      url: '/API/ProductHandler.ashx?action=GetFightGroupActivityInfos',
      data: {
        pageSize: 4,
        pageIndex: 1,
        sortBy: 'SalePrice',
        StoreId:wx.getStorageSync('getStore').StoreId
      },

    }, true).then(r => {
      // console.log("拼团数据", r);
      app.fh()
      if (r.data.Result.Data) {
        that.setData({
          teamList: r.data.Result.Data
        })
      }
    })
  },
  //跳转详情-------------
  handleDetail(e) {
    const { productid, storeid, pagetype, dname } = e.currentTarget.dataset; //商品id和门店id
    wx.navigateTo({
      url: `/fuPackageA/fuProductT/fuProductT?prDid=${productid}&pagetype=${pagetype}&storeid=${storeid}&dname=${dname}`,
    })
    wx.setStorageSync("buyType", "fightgroup")
  },
  //跳转首页
  handleIndex(){
    wx.switchTab({
      url: '/pages/fujihang/fuIndexG/fuIndexG'
    });
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
    let productid =this.data.prDid,id='',data=this.data
    data.dataInfo.FightGroupUsers.forEach(c=>{
      if(c.IsFightGroupHead) id=c.UserId
    })
    return {
        title: '拼团分享',
        path: `/fuPackageA/fuYQPT/fuYQPT?prDid=${productid}&storeid=${app.globalData.storeId}&isTeam=${id}`,
        success: (res) => { 
          wx.showToast({
            title: '分享成功',
            icon: 'none',
            image: '', 
            duration: 1500,
            mask: true,
            success: (result) => {
              
            },
            fail: () => {},
            complete: () => {}
          });
            
        },
        fail: (res) => {
        }
    }
  }
})