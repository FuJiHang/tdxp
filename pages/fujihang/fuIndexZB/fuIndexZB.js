const app = getApp()
import QQMapWX from '../../../libs/qqmap-wx-jssdk.js';
Page({

  /**
   * 页面的初始数据
   */

  data: {
    imgUrl: app.imgUrl,
    getAddressDet: '', //详细地址
    current: 0,
    openId: 0,
    xz: 0,
    seach: '',
    teamList: [],
    navBar: [{
        name: '首页',
        img: 'sySy.png?2',
        to: '/pages/fujihang/fuIndexZB/fuIndexZB',
      },
      {
        name: '大健康商城',
        img: 'sySc.png',
        to: '/pages/fujihang/fuNewMarket/fuNewMarket',
      },
      {
        img: 'syAdd.png?2',
        to: '/fuPackageA/fuRelease/fuRelease'
      },
      {
        name: '购物车',
        img: 'syYy.png?2',
        to: '/pages/cart/cart',
      },
      {
        name: '我的',
        img: "syMy.png?2",
        to: '/pages/mine/mine',
      },
    ], //导航条
    inputval: '', //搜索
    userlatitude: '', //经度
    userlongitude: '', //纬度
    addressData: '', //获取的地区总数
    nowCityName: '', //默认的地址显示
    nowCityId: '', //默认的区的id 或者市的id  
    isFalse: true, //判断客户是否使用第一次的id
    firstProvince: '', //客户第一次获取的省
    firstCity: '', //客户第一次获取的市
    firstDistrict: '', //客户第一次获取的区
    aaaaa: '',
    background: [], //轮播图
    imgheights: [], //所有图片高度
    // firstAddressId: '',
    nearList: {
      finsh: false,
      data1: [],
      data2: [],
      page: 1,
    },
    neerPdD: [],
    getXKTList: [],
    getXKTListYS: [],
    LatiLongitude: {},
    GradeId: 0,
    newAlert: false,
    postList: [{
        name: '手机号：',
        plr: '请输入要绑定的手机号',
        img: 'phone',
        val: '',
      },
      {
        name: '验证码：',
        plr: '请输入验证码',
        img: 'coupon',
        val: '',
      },
      {
        name: '输入新密码：',
        plr: '请输入新密码',
        img: 'lock',
        val: '',
      },
      {
        name: '再次输入新密码：',
        plr: '请输入新密码',
        img: 'lock',
        val: '',
      },
    ],
    SMS: '获取验证码',
    canClick: true,
    totalTime: 45,
    proList: {
      data: [],
      page: 1,
      finsh: false,
    }, //商品列表
    newJL: 0,
    IsShowVideo: false, //是否切换视频导购
    bannerTwo: [
      // {
      //   img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/index201.png',
      //   to: '/pages/fujihang/fuAssemList/fuAssemList'
      // },
      {
        img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/index202.jpg?1',
        to: '/pages/fujihang/fuBeaStore/fuBeaStore'
      },
    ],
    bannerThree: [{
        img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/indexCou001.png',
        to: '/pages/fujihang/fuCoupon/fuCoupon?active=3'
      },
      {
        img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/indexCou002.png',
        to: '/pages/fujihang/fuCoupon/fuCoupon?active=3'
      },
    ],
  },

  //跳转详情
  handleDetail(e) {
    const {
      productid,
      storeid,
      pagetype,
      dname
    } = e.currentTarget.dataset; //商品id和门店id
    wx.navigateTo({
      url: `/fuPackageA/fuProductT/fuProductT?prDid=${productid}&pagetype=${pagetype}&storeid=${storeid}&dname=${dname}&IsShowVideo=` + this.data.IsShowVideo,
    })


  },


  changInput(e) {
    this.setData({
      seach: e.detail.value
    })
  },
  seaChFN() {
    let a = {
      finsh: false,
      data1: [],
      data2: [],
      page: 1,
    }
    this.setData({
      nearList: a
    })
    // this.getListT()
  },

  // 
  toPYQFN(e) {
    let datac = e.currentTarget.dataset,
      data = this.data,
      WeiZhi = 0
    setTimeout(() => {
      WeiZhi = datac.no - 1
      // if(datac.name=='le') WeiZhi=datac.index*2
      // else WeiZhi=datac.index*2+1
      let chuang = ''
      if (WeiZhi % 10 == 0) chuang = encodeURIComponent(JSON.stringify(data.neerPdD.slice(WeiZhi, ((Math.ceil(WeiZhi / 10) + 1) * 10))));
      else chuang = encodeURIComponent(JSON.stringify(data.neerPdD.slice(WeiZhi, (Math.ceil(WeiZhi / 10) * 10))));
      wx.navigateTo({
        url: '/fuPackageA/fuProjectVideo/fuProjectVideo?chuang=' + chuang + '&page=' + data.nearList.page + '&choose=0'
      })
    }, 300)
  },

  // 跳转小游戏
  toGame() {
    wx.navigateToMiniProgram({
      appId: 'wxd3ceb1e87a8c0f81',
      path: 'pages/index/index',
      success(res) {
        // 打开成功
      }
    })
  },

  //注册更新
  changeInput(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      ["postList[" + index + "].val"]: e.detail.value
    })
  },

 

  



  // toPYQLB() {
  //   wx.navigateTo({
  //     url: '/fuPackageA/fuCircleFri/fuCircleFri'
  //   })
  // },
  Fabulous(e) {
    let datac = e.currentTarget.dataset
    app.fl()
    app.fg({
      action: 'GoodAndCollection',
      // openId:"oGsqu4qBG6Icub2iLYzI3MJGH4iQ",
      openId: app.globalData.GetMembersInfo.openId,
      RelationType: 3,
      ForID: datac.id
    }).then(r => {
      app.fh()
      if (r.data.Status == 'OK') {
        this.setData({
          [datac.name]: datac.tf ? false : true,
          [datac.namenum]: datac.tf ? --datac.num : ++datac.num
        })
      }
      app.fa(r.data.Message)

    })

  },
  // 小课堂
  getXKT(a) {
    let data = this.data, that = this
    if (a > 1000000) return
    app.fg({
      action: 'LoadAttention',
      // openId:"oGsqu4qBG6Icub2iLYzI3MJGH4iQ",
      limitDis: a,
      openId: app.globalData.GetMembersInfo.openId,
      pageIndex: 1,
      pageSize: 10,
      SearchText: data.seach,
      lat: data.LatiLongitude.Latitude,
      lng: data.LatiLongitude.Longitude,
      IsRecommended: true,
    }).then(r => {
      app.fh()
      if (r.data.Status == 'OK') {
        if (r.data.Data.length == 0) return that.getXKT(a * 10)
        let datar = r.data.Data
        for (let i = 0; i < datar.length;) {
          let a = {
            one: datar[i],
            two: datar[i + 1]
          }
          data.getXKTList.push(a)
          i += 2
        }
        let huanChun=[]
        r.data.Data.forEach(c=>{
          if (c.ImageUrls.indexOf('.mp4') != -1) c.isVideo = true
          huanChun.push(c)
        })
        this.setData({
          getXKTListYS:huanChun,
          getXKTList: data.getXKTList,
          newJL:a,
        })
        console.log(data.newJL)
      } else {
        that.getXKT(a * 10)
      }
    })
  },


  // 大家都在看
  getListT() {
    let data = this.data, that = this
    if (data.nearList.finsh) return
    app.fl()
    app.fg({
      action: 'LoadAttention',
      // openId:"oGsqu4qBG6Icub2iLYzI3MJGH4iQ",
      openId: app.globalData.GetMembersInfo.openId,
      pageIndex: data.nearList.page,
      pageSize: 10,
      SearchText: data.seach,
      // lat:data.LatiLongitude.Latitude,
      // lng:data.LatiLongitude.Longitude,
      IsRecommended: true,
    }).then(r => {
      app.fh()
      if (r.data.Status == 'OK') {
        let datar = r.data.Data, cc = []
        cc.push(...data.neerPdD, ...datar)
        that.setData({
          neerPdD: cc
        })
        for (let i = 0; i < datar.length; i++) {
          setTimeout(() => {
            that.getHeight().then(r => {
              if (r) {
                if (datar[i].ImageUrls.indexOf('.mp4') != -1) datar[i].isVideo = true
                data.nearList.data2.push(datar[i])
                that.setData({
                  ['nearList.data2']: data.nearList.data2
                })
              } else {
                if (datar[i].ImageUrls.indexOf('.mp4') != -1) datar[i].isVideo = true
                data.nearList.data1.push(datar[i])
                that.setData({
                  ['nearList.data1']: data.nearList.data1
                })
              }
            })
          }, i * 500)
        }

        this.setData({
          ['nearList.finsh']: datar.length < 10 ? true : false,
          ['nearList.page']: ++data.nearList.page
        })
      } else app.fa(r.data.Message)
    })
  },

  ff() {
    app.ff()
  },

  getGps() {
    return new Promise((resolve, reject) => {
      wx.getLocation({
        success: function(res) {
          resolve(res)
        },
      })

    })
  },
  //调取腾讯地图
  getTencentMap(latitude, longitude) {
    return new Promise((resolve, reject) => {
      var qqmapsdk = new QQMapWX({
        key: '7V4BZ-4WFW4-L3LU6-XLRLM-ZZ7BJ-MBFAM' // 必填
      });
      qqmapsdk.reverseGeocoder({
        location: {
          latitude: latitude,
          longitude: longitude
        },
        success: function(res) {
          resolve(res)
        }
      })
    })
  },

  // 调接口地址
  getaddress() {
    // this.setData({
    //   showSelect: true
    // })
    wx.navigateTo({
      url: '/fuPackageA/fuMapDoor/fuMapDoor?city=' + this.data.nowCityName
    })
  },

  remakeAddress() { //重新定位
    this.getGps().then(r => {
      this.data.userlatitude = r.latitude
      this.data.userlongitude = r.longitude; //重置经纬度
      // 获取客户的地理位置
      this.getTencentMap(r.latitude, r.longitude).then(res => {
        let sheng = res.result.address_component.province
        let shi = res.result.address_component.city
        let qu = res.result.address_component.district
        var addressData = this.data.addressData
        var shengID = '',
          shiId = '',
          quID = ''
        addressData.filter(function(item, index) {
          if (item.name == sheng) {
            shengID = item.id
            item.city.filter(function(item2, index2) {
              if (item2.name == shi) {
                shiId = item2.id
                if (item2.area.length !== 0) { //非市辖区
                  item2.area.filter(function(item3, index3) {
                    if (item3.name == qu) {
                      quID = item3.id
                    }
                  })
                } else {
                  quID = 0
                }
              }
            })
          }
        })

        var nowAddressId = shengID + "," + shiId + ',' + quID
        wx.setStorage({
          key: 'nowAddressId',
          data: nowAddressId
        })
        this.data.nowCityId = nowAddressId
        this.data.nowCityName = qu
        // var indexData = this.data.indexData
        // for (var i = 0; i < indexData.length; i++) {
        //   indexData[i].pageindex = 1 //重置所有的页数
        // }
        // 333
        // if (this.data.nowPage == '项目') {
        //   // 清空项目数据  重新获取 
        //   indexData[0].projectData = ''
        //   this.setData({
        //     indexData: indexData
        //   }) //重现渲染
        //   this.getprojectData();
        // } else if (this.data.nowPage == '门店') {
        //   indexData[2].storeData = []
        //   indexData[2].pageindex=1
        //   indexData[2].finsh=false
        //   this.setData({
        //     indexData: indexData
        //   })
        //   this.getstoreData();
        // } else if (this.data.nowPage == '技师') {
        //   indexData[1].technicianData = []
        //   indexData[1].pageindex=1
        //   indexData[1].finsh=false
        //   this.setData({
        //     indexData: indexData
        //   })
        //   this.gettechnicianData();
        // }
        this.data.showSelect = false; //关闭蒙版
        this.data.isFalse = false //关闭使用第一次获取的地址
        // 444
        this.setData({ //重置显示区名字
          nowCityName: this.data.nowCityName,
          // indexData: indexData,
          showSelect: this.data.showSelect
        })
      })
    }) //异步等待结果
  },



  // 接受组件传递过来的值 data是成功
  onSelectRegion: function(data) {
    if (!data.detail.iscancel) {
      if (!data.detail.address || data.detail.address.province.name === "请选择") {
        // || data.detail.address.city.name === "请选择" || data.detail.address.area.name === "请选择"
        wx.showModal({
          title: '提示',
          content: '请选择地址',
          showCancel: false
        })
        return
      }
      // this.data.nowCityId = data.detail.address.city.id
      var nowCityId = data.detail.address.province.id + ',' + data.detail.address.city.id + ',' + data.detail.address.area.id
      this.data.nowCityId = nowCityId
      wx.setStorage({
        key: 'nowAddressId',
        data: nowCityId
      })
      //预期设计功能 让客户选择省市区 发送省市区的id给后端
      if (data.detail.address.city.id == 0 && data.detail.address.area.id == 0) { //无选择市和区
        this.setData({
          nowCityName: data.detail.address.province.name
        })
      } else if (data.detail.address.city.id == 0 && data.detail.address.area.id !== 0) { //只选了区没选市
        this.setData({
          nowCityName: data.detail.address.province.name
        })
      } else if (data.detail.address.city.id !== 0 && data.detail.address.area.id == 0) { //只选了市没选区
        this.setData({
          nowCityName: data.detail.address.city.name
        })
        if (data.detail.address.city.name == '市辖区') {
          this.setData({
            nowCityName: data.detail.address.province.name
          })
        }
      } else if (data.detail.address.city.id !== 0 && data.detail.address.area.id !== 0) {
        this.setData({
          nowCityName: data.detail.address.area.name
        })
      }
      // 点击确定地址后判断客户目前所在页面  是项目,,,还是技师,,,门店
      this.data.isFalse = false //重置值
      // var nowPage = this.data.nowPage
      // if (nowPage == "项目") {
      //   this.data.indexData[0].projectData = '' //点击确定时候清空再 获取
      //   this.data.indexData[0].pageindex = '1'
      //   this.getprojectData();
      // } else if (nowPage == "门店") {
      //   this.data.indexData[2].storeData = []
      //   this.data.indexData[2].pageindex = 1
      //   this.data.indexData[2].finsh=false
      //   this.getstoreData()
      // } else if (nowPage == "技师") {
      //   this.data.indexData[1].technicianData = []
      //   this.data.indexData[1].pageindex=1
      //   this.data.indexData[1].finsh=false
      //   this.gettechnicianData();
      // }
      this.setData({
        showSelect: false,
        region: data.detail.address,
        // isSelected: true
      })
    } else {
      this.setData({
        showSelect: false
      })
    }
  },
  // 跳转页面
  toFN(e) {
    wx.switchTab({
      url: e.currentTarget.dataset.to
    });
    wx.navigateTo({
      url: e.currentTarget.dataset.to
    });

  },
  toFNNav(e) {


    wx.navigateTo({
      url: e.currentTarget.dataset.to
    })
    wx.switchTab({
      url: e.currentTarget.dataset.to
    })

  },
  toFFN(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.to
    });
  },

  getUserPoints() { //经纬度获取
    let that = this
    var qqmapsdk = new QQMapWX({
      key: '7V4BZ-4WFW4-L3LU6-XLRLM-ZZ7BJ-MBFAM' // 必填
    });
    var _this = this
    wx.getLocation({
      type: 'wgs84',
      fail: function() {
        wx.showModal({
          title: '提示',
          content: '请打开位置信息授权',
          success(res) {
            if (res.confirm) {
              wx.openSetting({})
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      },
      success: function(res) { //经纬度成功回调

        let latitude = res.latitude;
        let longitude = res.longitude
        let fujihang = {
          Latitude: res.latitude,
          Longitude: res.longitude
        }
        that.setData({
          fujihang: JSON.stringify(fujihang)
        })
        wx.setStorage({
          key: 'LatiLongitude',
          data: fujihang
        })

        app.setLatitude(fujihang)
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function(res) { //通过第三方介入获取客户的省市区成功回调//重置省市区
            let firstProvince = res.result.address_component.province
            let firstCity = res.result.address_component.city
            let firstDistrict = res.result.address_component.district
            _this.data.firstProvince = firstProvince
            _this.data.firstCity = firstCity
            _this.data.firstDistrict = firstDistrict
            that.setData({
              getAddressDet: res.result.address_component.street_number
            })
            let bbbbbb = {
              firstProvince: firstProvince,
              firstCity: firstCity,
              firstDistrict: firstDistrict,
            }
            that.setData({
              bbbbbb: JSON.stringify(bbbbbb)
            })
            _this.firstaddress(firstProvince, firstCity, firstDistrict); //回调成功前往排查地址id发送给后端
          },
          complete: function(res) {}
        })
        _this.data.userlatitude = res.latitude; //赋值客户当前经度
        _this.data.userlongitude = res.longitude; //赋值客户当前纬度

      }
    })
  },

  isempty() {

    if (this.data.nowCityName == "") { //判断客户原先是否有选择过地区,如果没有请重新获取
      // console.log('需要重新获取经纬度')
      this.getUserPoints() //获取客户经纬度
    } else {

      // var nowPage = this.data.nowPage , indexData = this.data.indexData
      // for (let i = 0 ;i<indexData.length;i++){
      //   indexData[i].pageindex = '1'
      // }

      // nowPage
      // console.log(nowPage,'点击回来本页')
      // if (nowPage == '项目'){
      //   indexData[0].projectData = ''
      //   this.setData({
      //     indexData: indexData
      //   })
      //   this.getProjectList()
      // } else if (nowPage == '门店'){
      //   indexData[2].storeData = []
      //   indexData[2].pageindex=1
      //   indexData[2].finsh=false
      //   this.setData({
      //     indexData: indexData
      //   })
      //   this.getstoreData()

      // } else if (nowPage == '技师'){
      //   indexData[1].technicianData = []
      //   indexData[1].pageindex=1
      //   indexData[1].finsh=false
      //   this.setData({
      //     indexData: indexData
      //   })
      //   this.gettechnicianData()
      // }

    }

  },

  firstaddress(sheng, shi, qu) { //向后端发起地区的省市级请求
    let aaaaa = {
      sheng: sheng,
      shi: shi,
      qu: qu,
    }
    this.setData({
      aaaaa: JSON.stringify(aaaaa)
    })
    var _this = this
    this.setData({
      nowCityName: qu
    })
    wx.request({
      url: app.gethsyurl,
      data: {
        action: 'GetRegionsOfProvinceCity'
      },
      success: function(res) {
        var addressData = res.data.province
        _this.data.addressData = addressData
        var shengID = '',
          shiId = '',
          quID = ''
        addressData.filter(function(item, index) {
          if (item.name == sheng) {
            shengID = item.id
            item.city.filter(function(item2, index2) {
              if (item2.name == shi) {
                shiId = item2.id
                if (item2.area.length !== 0) { //非市辖区
                  item2.area.filter(function(item3, index3) {
                    if (item3.name == qu) {
                      quID = item3.id
                    }
                  })
                } else {
                  quID = 0
                }
              }
            })
            // var firstAddressId = shengID + "," + shiId + ',' + quID//首次获取省市区id
            var firstAddressId = shengID + ',' + shiId + ',' + quID


            // if(quID){

            //   app.setRegionsOfProvinceCity(quID)
            // }else{
            //   app.setRegionsOfProvinceCity(shiId)
            // }
            app.setAddress(firstAddressId)
            _this.data.firstAddressId = firstAddressId
            console.log(firstAddressId)
            wx.setStorage({
              key: 'firstAddressId',
              data: firstAddressId
            })
            wx.setStorage({
              key: 'nowAddressId',
              data: firstAddressId
            })
            // _this.getProjectList(); //获取项目分类列表
          }
        })
      }
    })
  },

  // 轮播图变化
  imageLoad: function(e) { //获取图片真实宽度  
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比  
      ratio = imgwidth / imgheight;
    //计算的高度值  
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight;
    var imgheights = this.data.imgheights;
    //把每一张图片的对应的高度记录到数组里  
    imgheights[e.target.dataset.id] = imgheight;
    this.setData({
      imgheights: imgheights
    })
  },

  bindchangeImg: function(e) {
    this.setData({
      current: e.detail.current
    })
  },

  getSwiperData() {
    var _this = this
    wx.request({
      url: app.gethsyurl,
      data: {
        action: 'GetBannerPictures'
      },
      success: function(res) {
        _this.setData({
          background: res.data.Message
        })
      }
    })
  },

  // 获取高度
  getHeight() {
    return new Promise((resolve, reject) => {
      let leftK = wx.createSelectorQuery()
      let rightK = wx.createSelectorQuery()
      leftK.select('#leftK').boundingClientRect()
      rightK.select('#rightK').boundingClientRect()
      leftK.exec(function(res) {
        rightK.exec(r => {
          if (res[0].height > r[0].height) resolve(true)
          else resolve(false)
        })
      })
    })
  },

  // 点击banner
  clickImg(e) {
    let idx = e.currentTarget.dataset.id,
      _this = this,
      url,
      item = _this.data.background[idx]
      // 0次数卡，1优惠券，2抵用券，3商品
    switch (item.AdType) {
      case 0:
        url = 'miniProgram'
        break;
      case 1:
        url = 'request'
        break;
      case 2:
        url =`/fuPackageA/fuNearStore/fuNearStore`
        break;
      case 3:
        url = `/fuPackageA/fuProductT/fuProductT?prDid=${item.AdValue}&pagetype=undefined&storeid=null&dname=undefined&IsShowVideo=true`
        break;
      case 4://积分兑换
        url = `/pages/pointDetail/pointDetail?id=${item.AdValue}`
        break;
      case 5://奖金池
        url = `/fuPackageA/fuRewardPool/fuRewardPool?aid=${item.AdValue}`
        break;
      case 6://天天抽奖
        // url = `/fuPackageA/fuPrizeList/fuPrizeList?dzOrZxz=true`
        url='/fuPackageA/fuRewordList/fuRewordList'
        break;
    } 
    if (url == 'request'){
      app.fl()
      app.fg({
        action: 'UserGetCoupon',
        openID: _this.data.openId,
        shopType: 2,
        couponId: item.AdValue,
      }).then(r => {
        app.fh()
        app.fa(r.data.Message)
      })
    }else if(url == 'miniProgram'){
      wx.navigateToMiniProgram({
        appId: 'wxa4d03cf8e1ea5904',
        path: `fuPackageA/fuProductCou/fuProductCou?pId=${item.AdValue}&type=1&nowCityId=${_this.data.nowCityId}&
        userlatitude=${_this.data.userlatitude}&userlongitude=${_this.data.userlongitude}`,
        success: function (e) {
          console.log(e)
        }, fail: function (e) {
          console.log(e)
        }
      })
    }else{
      wx.navigateTo({
        url: url,
      })
    }
  },
 

  // 
  getTeamBuy() {
    let data = this.data,
      that = this
    app.fl()
    app.fg({
      url: '/API/ProductHandler.ashx?action=GetFightGroupActivityInfos',
      data: {
        pageSize: 4,
        pageIndex: 1,
        sortBy: 'SalePrice',
      },
    }, true).then(r => {
      app.fh()
      if (r.data.Result.Data) {
        that.setData({
          teamList: r.data.Result.Data
        })
      }
    })
  },


  // 
  toProOrCouFN(e){
    let aa=e.currentTarget.dataset
    if(aa.type==2){
      wx.navigateToMiniProgram({
        appId: 'wxa4d03cf8e1ea5904',
        path: `/fuPackageA/fuProductT/fuProductT?prDid=${aa.productid}&isNotStore=true`,
        success: function (e) {
          console.log(e)
        }, fail: function (e) {
          console.log(e)
        }
      })

      // wx.navigateTo({
      //   url:`/fuPackageA/fuProductT/fuProductT?prDid=${aa.productid}`
      // })

    }else{
      wx.navigateTo({
        url: `/fuPackageA/fuProductT/fuProductT?prDid=${aa.productid}&IsShowVideo=${this.data.IsShowVideo}` ,
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideTabBar({})
    wx.removeStorage('callBackLogin')
    this.getProductData()
    this.getSwiperData()
    wx.removeStorage({
      key: 'getStore'
    })
    this.getLoadCoupon()
    this.getTeamBuy()
    console.log(options);
    // 扫码绑定临时关系接口
    // let bbbb=decodeURIComponent(options.scene)
    // if(bbbb!='undefined'){
    //   let getBD=bbbb.split('ReferralUserId=')[1]
    //   app.fg({
    //     url:"/API/QrcodeHandler.ashx?action=BindTemReferral",
    //     data:{
    //       ReferralUserId:getBD
    //     },
    //   },true).then(r=>{})
    // }
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
    let that = this
    this.isempty()
    wx.removeStorage({
      key: 'upgrade'
    })
    wx.removeStorage({
      key: 'ReferralStoreUserId'
    })
    wx.getStorage({
      key: 'LatiLongitude',
      success(res) {
        that.setData({
          LatiLongitude: res.data
        })
      }
    })
    if (!app.globalData.GetMembersInfo || !app.globalData.GetMembersInfo.openId) {
      app.getOpenId(function(a) {
        app.setMembersInfo({
          openId: a
        })
        // that.getListT()
        // that.getXKT(5000)
      })

      // app.getOpenId(function(a) {
      //   app.fg({
      //     action: 'GetMembersInfo',
      //     openId: a
      //   }).then(r => {
      //     if (r.data.Status == "OK") {
      //       let dataR = r.data.Data
      //       dataR.openId = a
      //       app.setMembersInfo(dataR)
      //       that.getListT()
      //       that.getXKT(5000)
      //     } else {



      //     }
      //   })
      // })
    } else {
      // that.getListT()
      // that.getXKT(5000)
    }



    let dataN = this.data.nearList

    wx.getStorage({
      key: "callBackL",
      success: function(datac) {

        if (datac.data.length != 0) {

          datac.data.forEach(s => {
            dataN.data2.forEach((c, i) => {
              if (c.Id == s.id) {
                that.setData({
                  ['nearList.data2[' + i + '].ArticleLikeCount']: s.ArticleLikeCount,
                  ['nearList.data2[' + i + '].IsArticleLike']: s.IsArticleLike
                })
              }
            })
            dataN.data1.forEach((c, i) => {
              if (c.Id == s.id) {
                that.setData({
                  ['nearList.data1[' + i + '].ArticleLikeCount']: s.ArticleLikeCount,
                  ['nearList.data1[' + i + '].IsArticleLike']: s.IsArticleLike
                })
              }
            })

          })
        }

      }
    })
    wx.getStorage({
      key: "callBackC",
      success: function(datac) {
        console.log(datac, 'nnnnnnnnnn')
        if (datac.data.length != 0) {
          datac.data.forEach(s => {
            dataN.data2.forEach((c, i) => {
              if (c.Id == s.Id) {
                console.log('ccccccccc')

                that.setData({
                  ['nearList.data2[' + i + '].CommentCount']: s.CommentCount,
                })
              }
            })
            dataN.data1.forEach((c, i) => {
              if (c.Id == s.Id) {
                console.log('yyyyyyyyy')
                that.setData({
                  ['nearList.data1[' + i + '].CommentCount']: s.CommentCount,
                })
              }
            })

          })
        }
      }
    })

  },



  // 
  getLoadCoupon() {
    let data = this.data,
      that = this
    app.getOpenId(function(a) {
      console.log(a, '=========');
      data.openId = a
      app.fl()
      app.fg({
        action: "LoadSiteCoupon",
        openID: a,
        Role: 1,
        pageIndex: 1,
        PageSize: 10,
        Type: -1,
      }).then(r => {
        app.fh()
        if (r.data.Status == 'OK') {
          that.setData({
            bannerThree: r.data.Data
          })
        } else app.fa(r.data.Message)
        console.log(r)
      })
    })

  },

  // 
  couponFN(e) {
    let datar = e.currentTarget.dataset.data,
      data = this.data,
      that = this
    console.log(datar);
    if (datar.ObtainWay == '3') {
      wx.navigateTo({
        url: '/fuPackageA/fuNearStore/fuNearStore?data=' + encodeURIComponent(JSON.stringify(datar))
      })

    } else {
      app.fl()
      app.fg({
        action: 'UserGetCoupon',
        openID: data.openId,
        shopType: 2,
        couponId: datar.CouponId,
      }).then(r => {
        app.fh()
        app.fa(r.data.Message)

      })
    }
    console.log(e);
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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.data.proList={
      data: [],
      page: 1,
      finsh: false,
    } //商品列表
    this.getProductData()
    this.getSwiperData()
    this.getLoadCoupon()
    this.getTeamBuy()

    app.fl()
    setTimeout(()=>{
      app.fh()
      wx.stopPullDownRefresh()
    },3000)
  },

  toFFNSS() {
    if (!app.globalData.GetMembersInfo.UserId) return app.fuLo()
    wx.navigateTo({
      url: '/fuPackageA/fuRewordList/fuRewordList'
    })


  },
  onCloseP() {
    this.setData({
      newAlert: false
    })
  },

  // 获取验证码
  getSMS() {
    let data = this.data,
      that = this
    if (!(/^1[3|4|5|6|7|8|9][0-9]\d{4,8}$/.test(data.postList[0].val))) return app.fa('请输入正确的手机号')
    if (!data.canClick) {
      return
    } else {
      data.canClick = false
      data.SMS = data.totalTime + 's'
      let clock = setInterval(() => {
        data.totalTime--
          data.SMS = data.totalTime + 's'
        if (data.totalTime < 0) {
          clearInterval(clock)
          data.SMS = '获取验证码'
          data.totalTime = 45
          data.canClick = true //这里重新开启
        }
        that.setData({
          canClick: data.canClick,
          SMS: data.SMS,
          totalTime: data.totalTime,
        })
      }, 1000)


      app.fl()
      app.fg({
        action: "SendVerifyCode",
        Phone: data.postList[0].val,
        IsValidPhone: true,
        // openId:"oGsqu4qBG6Icub2iLYzI3MJGH4iQ",
        openId: app.globalData.GetMembersInfo.openId,
        imgCode: 0
      }).then(r => {
        app.fh()
        app.fa(r.data.Message)
      })


    }
  },

   // 提交注册验证码
   subimt() {
    let data = this.data,
      that = this
    // if (data.postList[2].val.toString().trim().length < 6) return app.fa("密码不能小于6位！")


    app.fg({
      action: 'CheckContentSecurity',
      Type: 0,
      FormData: data.postList[0].val + data.postList[1].val +
        data.postList[2].val
    }).then(t => {
      if (t.data.Status != "OK") {
        app.fa(t.data.Message)
      } else {
        app.fl()
        app.fg({
          action: "CellPhoneVerification",
          Phone: data.postList[0].val,
          IsSetPwd: false,
          imgCode: data.postList[1].val,
          // password: data.postList[2].val,
          // repassword: data.postList[2].val,
          //  openId:"oGsqu4qBG6Icub2iLYzI3MJGH4iQ",
          openId: app.globalData.GetMembersInfo.openId,
        }).then(r => {
          // console.log(r)
          app.fh()
          app.fa(r.data.Message)
          if (r.data.Status != "OK") return
          setTimeout(() => {
            app.fg({
              action: 'GetMembersInfo',
              openId: app.globalData.GetMembersInfo.openId
            }).then(r => {
              if (r.data.Status == "OK") {
                let dataR = r.data.Data
                dataR.openId = app.globalData.GetMembersInfo.openId
                app.setMembersInfo(dataR)
                that.setData({
                  newAlert: false
                })
                // wx.navigateTo({
                //   url: '/fuPackageA/fuLuckDraw/fuLuckDraw'
                // })
              } else {
                wx.redirectTo({
                  url: "/pages/login/login"
                });
              }
            })
          }, 1450)
        })
      }
    })
  },



  // 
  getProductData() {
    let data = this.data,
      that = this
    app.fl()
    app.fg({
      url: '/api/ProductHandler.ashx?action=GetProducts',
      data: {
        pageSize: 10,
        pageIndex: 1,
        // tagId:18,
        ProductType: 0
      },
    }, true).then(r => {
      app.fh()
      if (r.data.Result.Status == 'Success') {
        let datar = r.data.Result.Data
        datar.forEach(c => {
          data.proList.data.push(c)
        })
        if (datar.length < 10) data.proList.finsh = true
        data.proList.page++
          that.setData({
            proList: data.proList,
            IsShowVideo: r.data.Result.IsShowVideo
          })
      } else app.fa('获取失败')
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let that = this
    if (!app.globalData.GetMembersInfo || !app.globalData.GetMembersInfo.openId) app.fuLo()
    else this.getListT()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})