const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,//

    GetMembersInfo: {},//人信息
    functionJosn: [], //功能
    showXY: false,//显示执行团队长列表
    richtext: '',//富文本内容
    totalTime: 6,
    userIDF: 0,
    SMS: '',
    jishi: [{
      name: '技师订单',
      fun: false,
      child: [{
        img: app.imgUrl + 'icon_order_01.png',
        name: '已预约',
        to: '/pages/technicianAppointment/technicianAppointment?type=0&active=0',
      },
      {
        img: app.imgUrl + 'icon_order_03.png',
        name: '已完成',
        to: '/pages/technicianAppointment/technicianAppointment?type=0&active=1',
      },
      ]
    },
    {
      name: '常用功能',
      fun: true,
      child: [
        {
          img: app.imgUrl + 'yj031.png',
          name: '我的业绩',
          to: '/pages/fujihang/fuExecuPer/fuExecuPer?type=2',
        },
        {
          img: app.imgUrl + 'team031.png',
          name: '绑定团队长',
          to: '/pages/fujihang/fuTeachTeam/fuTeachTeam?role=technician',
        },
        {
          img: app.imgUrl + 'wj031.png',
          name: '核销',
          to: '/pages/fujihang/fuWriteOff/fuWriteOff?tea=1'
        },
        {
          img: app.imgUrl + 'coupon031.png',
          name: '我的优惠券',
          to: '/pages/fujihang/fuCoupon/fuCoupon?type=1'
        },
        {
          img: app.imgUrl + 'qq031.png',
          name: '活动项目',
          to: '/pages/fujihang/fuTeaProGet/fuTeaProGet',
        },
        {
          img: app.imgUrl + 'help031.png',
          name: '帮助',
          to: '/pages/fujihang/fuHelp/fuHelp?role=TC',
        },
        {
          img: app.imgUrl + 'gxjj064.png',
          name: '我的经济',
          to: '/pages/myCommission/myCommission?type=8',
        },
        {
          img: app.imgUrl + 'edit031.png',
          name: '信息编辑',
          to: '/fuPackageA/fuEditerTeach/fuEditerTeach',
        },
        {
          img: app.imgUrl + 'phb051.png',
          name: '排行榜',
          to: '/fuPackageA/fuRank/fuRank',
        },
        {
          img: app.imgUrl + 'news031.png',
          name: '我要投诉',
          to: '/fuPackageA/fuApplyCom/fuApplyCom',
        },

      ]
    },
    ], //技师
    dianjia: [{
      name: '店家收益',
      fun: false,
      child: [
        {
          img: ' http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/shopMoney.png',
          name: '店主收益',
          to: '/fuPackageA/managerReturns/managerReturns',
        },
        // {
        //   img: "http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/gxjj064Black.png",
        //   name: "共享经济",
        //   to: '/pages/myCommission/myCommission?type=11'
        // },

        // {
        //   img: app.newImg + 'shop_yuyue@2x.png',
        //   name: '自提订单',
        //   // to: '/pages/storesOrder/storesOrder?aIndex=1',
        //   to: '/wuPackageB/wuOrderList/wuOrderList?aIndex=1',
        // },
        // {
        //   img: app.newImg+'shop_yuyue@2x.png',
        //   name: '已预约',
        //   to:'/pages/storesOrder/storesOrder?active=0',
        // },
        // {
        //   img: app.newImg +'shop_daizhipai@2x.png',
        //   name: '已核销',
        //   to:'/pages/storesOrder/storesOrder?active=1',
        // },
        // {
        //   img: app.newImg +'shop_wancheng@2x.png',
        //   name: '已完成',
        //   to:'/pages/storesOrder/storesOrder?active=2',
        // },
        // {
        //   img: app.newImg + 'shop_refund@2x.png',
        //   name: '待退款',
        //   to: '/pages/storesOrder/storesOrder?active=2',
        // },
        // {
        //   img: app.newImg +'shop_quxiao@2x.png',
        //   name: '已取消',
        //   to:'/pages/storesOrder/storesOrder?active=3',
        // },
        {
          img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/jiFenMyBlack.png',
          name: '我的积分',
          to: '/fuPackageA/fuUserPoint/fuUserPoint?isStore=true',
        }

      ]
    },
    // {
    //   name: '店铺经济',
    //   fun: true,
    //   child: [
    //     {
    //       img: app.newImg + 'shop_revenue@2x.png',
    //       name: '店铺营收',
    //       to: '/wuPackageB/rewardDetails/rewardDetails?num=0',
    //     },
    //     {
    //       img: app.newImg + 'shop_yeji@2x.png',
    //       name: '会员奖励',
    //       to: '/wuPackageB/rewardDetails/rewardDetails?num=1',
    //     },
    //     {
    //       img: app.newImg + 'shop_jiangli@2x.png',
    //       name: '平台奖励',
    //       to: '/wuPackageB/rewardDetails/rewardDetails?num=2',
    //     },]
    // },
    {
      name: '常用操作',
      fun: true,
      child: [
        {
          img: 'https://bcdj.9oasd.com/images/bank031.png',
          name: '核销卡',
          to: '/fuPackageA/fuPeople/fuPeople',
        },
        {
          img: app.newImg + 'shop_yuyue@2x.png',
          name: '自提商品',
          // to: '/pages/storesOrder/storesOrder?aIndex=1',
          to: '/wuPackageB/wuOrderList/wuOrderList?aIndex=1',
        },
        {
          img: app.newImg + 'shop_yuyue@2x.png',
          name: '拼团订单',
          // to: '/pages/storesOrder/storesOrder?aIndex=0',//
          to: '/wuPackageB/wuOrderList/wuOrderList?aIndex=0',//
        },


        {
          img: ' http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/jiangLi.png?1',
          name: '团队奖分配',
          to: '/fuPackageA/fuTeamReward/fuTeamReward',
        },

        // =================
        // {
        //   img: app.newImg + 'shop_hexiao@2x.png',
        //   name: '快速核销',
        //   to: '/pages/fujihang/fuWriteOff/fuWriteOff'
        // },


        // { wjx***
        //   img: app.imgUrl+'gxjj064.png',
        //   name: '我的经济',
        //   to:'/pages/myCommission/myCommission?type=11',
        // },

        // {
        //   img: app.imgUrl+'ssmd.png',
        //   name: '直属门店',
        // },

        // {
        //   img: app.imgUrl+'dmf.png',
        //   name: '当面付',
        // },

        // { wjx***
        //   img: app.imgUrl+'yj031.png',
        //   name: '我的业绩',
        //   to:'/pages/fujihang/fuExecuPer/fuExecuPer?type=4',
        // },

        // { wjx***
        //   img: app.imgUrl+'draw051.png',
        //   name: '奖品',
        //   to:'/fuPackageA/fuPrizeList/fuPrizeList?dzOrZxz=true',
        // },

        {
          img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/broadcast2@2x.png',
          name: '直播',
          to: '/subPackageC/entranceMenu/index',
        },

      ]
    },
    {
      name: '店内上架',
      fun: true,
      child: [
        {
          img: app.newImg + 'shop_xiangmu@2x.png',
          name: '上架卡',
          // to: '/pages/fujihang/fuUpDown/fuUpDown?edit=0',
          to: '/wuPackageB/projectUpper/projectUpper',
        },
        {
          img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/icon_hd.png',
          name: '上架拼团',
          to: '/wuPackageB/groupStores/groupStores',
        },
        {
          img: app.newImg + 'shop_active@2x.png',
          name: '上架打卡',
          to: '/wuPackageB/activities/activities',
        },

        // {
        //   img: app.newImg + 'user_jifen@2x.png',
        //   name: '发放奖品',
        //   to: '/fuPackageA/fuPrizeList/fuPrizeList?isStore=true',
        // },
        {
          img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/storeCou001.png',
          name: '上架抵用券',
          to: '/fuPackageA/fuCouponSet/fuCouponSet',
        },
        {
          img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/integralShop.png?1',
          name: '上架积分商品',
          to: '/fuPackageA/fuChangePoint/fuChangePoint',
        },
        {
          img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/sjsp003.png?1',
          name: '上架门店商品',
          to: '/fuPackageA/fuUpper/fuUpper',
        },

      ]
    },
    {
      name: '门店装修',
      fun: true,
      child: [
        {
          img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/storeBan001.png',
          name: '首页轮播图',
          to: '/fuPackageA/fuSetBack/fuSetBack',
        },
        {
          img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/storeCou001.png',
          name: '首页活动图',
          to: '/fuPackageA/fuSetfrequen/fuSetfrequen',
        },
        {
          img: app.newImg + 'shop_setup@2x.png',
          name: '门店设置',
          to: '/fuPackageA/fuEditerStore/fuEditerStore',
        },
        // {
        //   img: ' http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/toStoreOpen.png',
        //   name: '我的门店',
        //   to: '/fuIndexG',
        // },
        // {
        //   img: ' http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/toStoreOpen.png',
        //   name: '切换门店',
        //   to: '/fuPackageA/fuChangeStore/fuChangeStore',
        // },
        
      ]
    },
    {
      name: '店内管理',
      fun: true,
      child: [


        {
          img: app.newImg + 'shop_dianyuan@2x.png',
          name: '店员管理',
          to: '/wuPackageB/salesclerk/salesclerk',
        },
        {
          img: app.newImg + 'shop_guanli@2x.png',
          name: '技师管理',
          to: '/wuPackageB/newTechnician/newTechnician',
        },
        {
          img: app.newImg + 'shop_huiyuan@2x.png',
          name: '会员管理',
          to: '/wuPackageB/newMember/newMember',
        },

        {
          img: ' http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/servierStore.png',
          name: '设置客服',
          to: '/fuPackageA/setCustomer/setCustomer',
        },

      ]
    },
    {
      name: '其他',
      fun: true,
      child: [

        {
          img: app.newImg + 'shop_help@2x.png',
          name: '帮助',
          to: '/pages/fujihang/fuHelp/fuHelp?role=ST',
        },
        {
          img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/gxjj064Black.png',
          name: '我的管理津贴',
          to: '/fuPackageA/fuManageJT/fuManageJT',
        },


      ]
    },
    ], //店家

    zxtdz: [{
      name: '常用功能',
      fun: true,
      child: [{
        img: app.imgUrl + 'gxjj064.png',
        name: '我的经济',
        to: '/pages/myCommission/myCommission?type=9',

      },
      {
        img: app.imgUrl + 'yj031.png',
        name: '我的业绩',
        to: '/pages/fujihang/fuExecuPer/fuExecuPer?type=1',
      },
      {
        img: app.imgUrl + 'team032.png',
        name: '技师团队',
        to: '/pages/fujihang/fuTeachTeam/fuTeachTeam?role=head',
      },
      {
        img: app.imgUrl + 'wj031.png',
        name: '团队技师订单',
        to: '/pages/technicianAppointment/technicianAppointment?type=1',
      },
      {
        img: app.imgUrl + 'store031.png',
        name: '绑定门店',
        to: '/pages/fujihang/fuCountryStore/fuCountryStore',
      },
      {
        img: app.imgUrl + 'qq031.png',
        name: '活动申报',
        to: '/pages/fujihang/fuAction/fuAction',
      },
      {
        img: app.imgUrl + 'action031.png',
        name: '活动记录',
        to: '/pages/fujihang/fuActionList/fuActionList?zxz=1',
      },
      {
        img: app.imgUrl + 'pass031.png',
        name: '审核技师',
        to: '/pages/fujihang/fuExamine/fuExamine?type=TH',

      },
      {
        img: app.imgUrl + 'help031.png',
        name: '帮助',
        to: '/pages/fujihang/fuHelp/fuHelp?role=TH',
      },
      {
        img: app.imgUrl + 'sj051.png',
        name: '上架项目',
        to: '/pages/fujihang/fuShopChoose/fuShopChoose',
      },

      {
        img: app.imgUrl + 'phb051.png',
        name: '排行榜',
        to: '/fuPackageA/fuRank/fuRank',
      },
      {
        img: app.imgUrl + 'news031.png',
        name: '我要投诉',
        to: '/fuPackageA/fuApplyCom/fuApplyCom',
      },

        // {
        //   img: app.imgUrl+'shenbao.png',
        //   name: '业绩申报',
        //   to:'/fuPackageA/fuDeclare/fuDeclare?zxzOrtdz=1',
        // },
      ]
    },], //执行团队长

    jddls: [{
      name: '常用功能',
      fun: true,
      child: [{
        img: app.imgUrl + 'gxjj064.png',
        name: '我的经济',
        to: '/pages/myCommission/myCommission?type=10',
      },
      {
        img: app.imgUrl + 'store031.png',
        name: '我的门店',
        // to:'/pages/fujihang/fuGathStore/fuGathStore',
        to: '/pages/fujihang/fuCountryStore/fuCountryStore?judao=true',
      },
      {
        img: app.imgUrl + 'help031.png',
        name: '帮助',
        to: '/pages/fujihang/fuHelp/fuHelp?role=BS',
      },
      {
        img: app.imgUrl + 'wdsj051.png',
        name: '邀请门店',
        // to:'/wuPackageB/application/application?stype='+0,
        type: true
      },

      // {
      //   img: app.imgUrl+'shfxdz051.png',
      //   name: '审核分校弟子',
      //   to:'/pages/fujihang/fuExamine/fuExamine?type=BS',
      // },
      {
        img: app.imgUrl + 'shfxdz051.png',
        name: '机主资料',
        to: '/wuPackageB/mainData/mainData',
      },
      {
        img: app.imgUrl + 'yj031.png',
        name: '我的业绩',
        to: '/pages/fujihang/fuExecuPer/fuExecuPer?type=3',
      },
      {
        img: app.imgUrl + 'news031.png',
        name: '我要投诉',
        to: '/fuPackageA/fuApplyCom/fuApplyCom',
      },
      ]
    },], //聚到代理商
    zxz: [{
      name: '常用功能',
      fun: true,
      child: [
        {
          img: app.imgUrl + 'gxjj064.png',
          name: '我的经济',
          to: '/pages/myCommission/myCommission?type=14',
        },
        {
          img: app.imgUrl + 'star031.png',
          name: '执行者技师订单',
          to: '/pages/fujihang/fuExecutList/fuExecutList',
        },
        {
          img: app.imgUrl + 'zwsz031.png',
          name: '晋升团队长',
          to: '/pages/fujihang/fuPromot/fuPromot',
        },
        {
          img: app.imgUrl + 'qq031.png',
          name: '我的活动',
          to: '/pages/fujihang/fuAction/fuAction?zxz=true',
        },
        {
          img: app.imgUrl + 'action031.png',
          name: '活动记录',
          to: '/pages/fujihang/fuActionList/fuActionList?zxz=0',
        },
        {
          img: app.imgUrl + 'sj051.png',
          name: '上架项目',
          to: '/pages/fujihang/fuShopChoose/fuShopChoose?zxz=true',
        },

        {
          img: app.imgUrl + 'yj031.png',
          name: '我的业绩',
          to: '/pages/fujihang/fuExecuPer/fuExecuPer?type=0',
        },

        // {
        //   img: app.imgUrl+'shenbao.png',
        //   name: '业绩申报',
        //   to:'/fuPackageA/fuDeclare/fuDeclare?zxzOrtdz=0',
        // },


        {
          img: app.imgUrl + 'phb051.png',
          name: '排行榜',
          to: '/fuPackageA/fuRank/fuRank',
        },
        {
          img: app.imgUrl + 'news031.png',
          name: '我要投诉',
          to: '/fuPackageA/fuApplyCom/fuApplyCom',
        },
        {
          img: app.imgUrl + 'draw051.png',
          name: '奖品',
          to: '/fuPackageA/fuPrizeList/fuPrizeList?dzOrZxz=true',
        },
      ]
    }],//执行者

    dianYuan: [

      {
        name: '常用操作',
        fun: true,
        child: [
          {
            img: 'https://bcdj.9oasd.com/images/bank031.png',
            name: '核销卡',
            to: '/fuPackageA/fuPeople/fuPeople',
          },
          {
            img: app.newImg + 'shop_yuyue@2x.png',
            name: '自提商品',
            // to: '/pages/storesOrder/storesOrder?aIndex=1',
            to: '/wuPackageB/wuOrderList/wuOrderList?aIndex=1',
          },
          {
            img: app.newImg + 'shop_yuyue@2x.png',
            name: '拼团订单',
            // to: '/pages/storesOrder/storesOrder?aIndex=0',//
            to: '/wuPackageB/wuOrderList/wuOrderList?aIndex=0',//
          },]
      },
      {
        name: '店内上架',
        fun: true,
        child: [
          {
            img: app.newImg + 'shop_xiangmu@2x.png',
            name: '上架卡',
            // to: '/pages/fujihang/fuUpDown/fuUpDown?edit=0',
            to: '/wuPackageB/projectUpper/projectUpper',
          },
          {
            img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/icon_hd.png',
            name: '上架拼团',
            to: '/wuPackageB/groupStores/groupStores',
          },
          {
            img: app.newImg + 'shop_active@2x.png',
            name: '上架打卡',
            to: '/wuPackageB/activities/activities',
          },

          // {
          //   img: app.newImg + 'user_jifen@2x.png',
          //   name: '发放奖品',
          //   to: '/fuPackageA/fuPrizeList/fuPrizeList?isStore=true',
          // },
          {
            img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/storeCou001.png',
            name: '上架抵用券',
            to: '/fuPackageA/fuCouponSet/fuCouponSet',
          },
          {
            img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/integralShop.png?1',
            name: '上架积分商品',
            to: '/fuPackageA/fuChangePoint/fuChangePoint',
          },
          {
            img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/sjsp003.png?1',
            name: '上架门店商品',
            to: '/fuPackageA/fuUpper/fuUpper',
          },
        ]
      },
      {
        name: '门店装修',
        fun: true,
        child: [
          {
            img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/storeBan001.png',
            name: '首页轮播图',
            to: '/fuPackageA/fuSetBack/fuSetBack',
          },
          {
            img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/storeCou001.png',
            name: '首页活动图',
            to: '/fuPackageA/fuSetfrequen/fuSetfrequen',
          },
          {
            img: app.newImg + 'shop_setup@2x.png',
            name: '门店设置',
            to: '/fuPackageA/fuEditerStore/fuEditerStore',
          },
          {
            img: ' http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/toStoreOpen.png',
            name: '我的门店',
            to: '/fuIndexG',
          },
        ]
      },
      {
        name: '店内管理',
        fun: true,
        child: [


          {
            img: app.newImg + 'shop_huiyuan@2x.png',
            name: '会员管理',
            to: '/wuPackageB/newMember/newMember',
          },



        ]
      },

      {
        name: '其他',
        fun: true,
        child: [

          {
            img: app.newImg + 'shop_help@2x.png',
            name: '帮助',
            to: '/pages/fujihang/fuHelp/fuHelp?role=ST',
          },
        ]
      },
    ],

    navBar: [{
      name: '首页',
      img: '../../../images/home_tab_11.png',
      to: '/pages/bchome/bchome',
    },
    {
      name: '商城',
      img: '../../../images/home_tab_33.png',
      to: '/pages/fujihang/fuBeaStore/fuBeaStore',
    },
    {
      name: '我的预约',
      img: '../../../images/home_tab_22.png',
      to: '/pages/technician/technician',
    },
    {
      name: '我的',
      img: "../../../images/home_tab_44.png",
      to: '/pages/mine/mine',
    },

    ], //导航条

    // showData:[ //收入数据展示
    //   {
    //     nums:'0.00',
    //     name:'店铺营收',
    //     to:'/wuPackageB/rewardDetails/rewardDetails?num=0'
    //   },
    //   {
    //     nums: '100.00',
    //     name: '会员奖励',
    //     to: '/wuPackageB/rewardDetails/rewardDetails?num=1'
    //   },
    //   {
    //     nums: '0.00',
    //     name: '平台奖励',
    //     to: '/wuPackageB/rewardDetails/rewardDetails?num=2'
    //   },
    // ],



  },


  // // 关闭协议
  // closeXY(){
  //   wx.navigateBack({
  //     delta: 1
  //   })
  // },

  //我同意 
  // wtyFN(){
  //   let data=this.data,that=this
  //   if(this.data.totalTime>0) return
  //   app.fl()
  //   app.fg({
  //     action:'UpdateAgreement',
  //     openId:app.globalData.GetMembersInfo.openId,
  //     Status:true,
  //     Type:data.userIDF=='0'?3:data.userIDF=='1'?1:data.userIDF=='2'?4:data.userIDF=='3'?3:4,
  //   }).then(r=>{
  //     app.fh() 
  //     if(r.data.Status=='OK'){
  //       that.setData({
  //         showXY:false,
  //       })
  //     }
  //     app.fa(r.data.Message)
  //   })
  // },


  toMH() {
    wx.navigateTo({
      url: '/fuPackageA/fuFunChoose/fuFunChoose'
    })
  },
  // 跳转页面
  toFN(e) {
    let data = this.data
    let dataset = e.currentTarget.dataset
    if (data.functionJosn[dataset.id].child[dataset.index].to == '/fuIndexG') {

      app.globalData.storeId = app.globalData.GetMembersInfo.StoreId
      app.globalData.appId == 'wxa4d03cf8e1ea5904' ? wx.reLaunch({
        url: '/pages/fujihang/fuIndexG/fuIndexG?id=' + app.globalData.GetMembersInfo.StoreId
      }) : wx.navigateToMiniProgram({
        appId: 'wxa4d03cf8e1ea5904',
        path: 'pages/fujihang/fuIndexG/fuIndexG?id=' + app.globalData.GetMembersInfo.StoreId,
        // envVersion:'develop',
        success: function (e) {
          console.log(e)
        }, fail: function (e) {
          console.log(e)
        }
      })
      return
    }
    wx.navigateTo({ url: data.functionJosn[dataset.id].child[dataset.index].to })
  },
  // 底部按钮跳转
  toNavFN(e) {
    let data = this.data
    let index = e.target.dataset.index
    wx.switchTab({
      url: data.navBar[index].to
    })
  },
  handleTZ(e) {
    console.log(e);
    const { index, goto } = e.currentTarget.dataset;
    if (index == 0) {
      wx.navigateTo({
        url: goto,
      });
    } else if (index == 1) {
      wx.navigateTo({
        url: goto,
      });
    } else if (index == 2) {
      wx.navigateTo({
        url: goto,
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {




    let data = this.data
    let that = this

    this.setData({
      userIDF: options.id
    })

    if (!app.globalData.GetMembersInfo || !app.globalData.GetMembersInfo.openId) {
      app.getOpenId(function (a) {
        app.fg({
          action: 'GetMembersInfo',
          openId: a
        }).then(r => {
          if (r.data.Status == "OK") {
            let dataR = r.data.Data
            dataR.openId = a
            app.setMembersInfo(dataR)
            data.GetMembersInfo = app.globalData.GetMembersInfo
            that.setData({
              GetMembersInfo: data.GetMembersInfo
            })
            let change = []
            let name = ''

            app.fl()
            app.fg({
              action: 'CheckAgreement',
              openId: app.globalData.GetMembersInfo.openId,
              Type: options.id == '0' ? 3 : options.id == '1' ? 1 : options.id == '2' ? 4 : options.id == '3' ? 3 : 4,
            }).then(j => {
              app.fh()
              if (j.data.Status == 'Yes') {
                that.setData({
                  richtext: j.data.Message,
                  showXY: true
                })
                let clock = setInterval(() => {
                  data.totalTime--
                  data.SMS = data.totalTime + 's'
                  if (data.totalTime < 0) {
                    clearInterval(clock)
                    data.SMS = '同意'
                    // data.totalTime = 6
                  }
                  that.setData({
                    SMS: data.SMS,
                    totalTime: data.totalTime,
                  })
                }, 1000)
              }
            })


            console.log(options.id, '22222222');
            switch (options.id) {
              case "0":
                change = that.data.jishi
                name = '技师'
                break;
              case "1":
                change = that.data.dianjia
                name = '店家'
                break;
              case "2":
                change = that.data.zxtdz
                name = '执行团队长'
                break;
              case "3":
                change = that.data.jddls
                name = '黑卡代理'
                break;
              case "4":
                change = that.data.zxz
                name = '执行者'
                break;
              case '10':
                change = that.data.dianYuan
                name = "店员"
                break;

            }
            console.log(change, '===========');
            that.data.GetMembersInfo.gradeName = name
            that.setData({
              functionJosn: change,
              GetMembersInfo: that.data.GetMembersInfo
            })

          } else {
            wx.redirectTo({
              url: "/pages/login/login"
            });
          }
        })
      })
    } else {
      data.GetMembersInfo = app.globalData.GetMembersInfo
      this.setData({
        GetMembersInfo: data.GetMembersInfo
      })

      app.fl()
      app.fg({
        action: 'CheckAgreement',
        openId: app.globalData.GetMembersInfo.openId,
        Type: options.id == '0' ? 3 : options.id == '1' ? 1 : options.id == '2' ? 4 : options.id == '3' ? 3 : 4,
      }).then(j => {
        app.fh()
        if (j.data.Status == 'Yes') {
          that.setData({
            richtext: j.data.Message,
            showXY: true
          })
          let clock = setInterval(() => {
            data.totalTime--
            data.SMS = data.totalTime + 's'
            if (data.totalTime < 0) {
              clearInterval(clock)
              data.SMS = '同意'
              // data.totalTime = 6
            }
            that.setData({
              SMS: data.SMS,
              totalTime: data.totalTime,
            })
          }, 1000)
        }
      })


      let change = []
      let name = ''
      switch (options.id) {
        case "0":
          change = this.data.jishi
          name = '技师'
          break;
        case "1":
          change = this.data.dianjia
          name = '店家'
          break;
        case "2":
          change = this.data.zxtdz
          name = '执行团队长'
          break;
        case "3":
          change = this.data.jddls
          name = '黑卡代理'
          break;
        case "4":
          change = this.data.zxz
          name = '执行者'
          break;
        case '10':
          change = that.data.dianYuan
          name = "店员"
          break;


      }
      this.data.GetMembersInfo.gradeName = name
      this.setData({
        functionJosn: change,
        GetMembersInfo: this.data.GetMembersInfo
      })

    }




  },

  // 
  toFNS(){
    wx.navigateTo({
      url:'/fuPackageA/fuChangeStore/fuChangeStore'
    })
  },


  registerFormSubmit: function (e) {

    app.fg({
      action: 'SaveFormId',
      openId: app.globalData.GetMembersInfo.openId,
      // openId:'oGsqu4qBG6Icub2iLYzI3MJGH4iQ',
      formId: e.detail.formId
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
    return {

      title: '门店申请',

      desc: '完成表单',

      path: '/wuPackageB/application/application'

    }
  }
})