
import QQMapWX from '../../utils/qqmap-wx-jssdk.min';
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.newImg,
    bankList:['工商银行','交通银行','招商银行','民生银行','中信银行',
    '浦发银行','兴业银行','光大银行','广发银行','平安银行','北京银行',
    '华夏银行','农业银行','建设银行','邮政储蓄银行','中国银行','宁波银行',
    '其他银行'],
    showBank:false,
    img: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/sade.jpg',
    iconImg: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/tdhmd/sctp003.png',
    iconDel: 'http://hmqy.oss-cn-hangzhou.aliyuncs.com/sjmed/close@2x (1).png',
    zwtpImg: app.newImg + 'zwtp.jpg',
    basicData: [ //基础信息数据
      {
        title: '店名',
        pla: '* 请填写门店名称',
        val: '',
        name: 'StoreName',
        type: 'text',
        status: false,//用于控制省市区
        show: false,//用于控制是否上传图片
      },
      {
        title: '门店省市区',
        pla: '* 请选择省市区',
        val: '',
        name: 'FullRegionPath',
        type: 'text',
        status: true,//用于控制省市区
        show: false,//用于控制是否上传图片
        ssq: true,
      },
      {
        title: '门店地址',
        pla: '* 请填写门店地址',
        val: '',
        name: 'Address',
        type: 'text',
        status: false,//用于控制省市区
        show: false,//用于控制是否上传图片
      },
      {
        title: '联系电话',
        pla: '* 请填写手机号码',
        val: '',
        name: 'Tel',
        type: 'number',
        status: false,//用于控制省市区
        show: false,//用于控制是否上传图片
      },
      {
        title: '联系人',
        pla: '* 请填写联系人',
        val: '',
        name: 'ContactMan',
        type: 'text',
        status: false,//用于控制省市区
        show: false,//用于控制是否上传图片
      },
      {
        title: '门店logo',
        pla: '* 请填写门店logo 1/1',
        val: '',
        name: 'StoreImages',
        type: 'text',
        status: false,//用于控制省市区
        show: true,//用于控制是否上传图片
        nums: 0,//代表logo
      },


      {
        title: '门店门口照片',
        pla: '* 请上传门店门口照片 1/1',
        val: '',
        name: 'SWXIndoorPic',
        type: 'text',
        status: false,//用于控制省市区
        show: true,//用于控制是否上传图片
        nums: 1,//代表门店门口照片
      },
      {
        title: '店内环境照片',
        pla: '* 请上传店内环境照片 1/1',
        val: '',
        name: 'SWXStoreEntrancePic',
        type: 'text',
        status: false,//用于控制省市区
        show: true,//用于控制是否上传图片
        nums: 7,//代表门店门口照片
      },
      {
        title: '经营场地照片',
        pla: ' 请上传经营场地证明照片 1/1',
        val: '',
        name: 'SWXAddressCertification',
        type: 'text',
        status: false,//用于控制省市区
        show: true,//用于控制是否上传图片
        nums: 8,//代表门店门口照片
        xh: true,//提示不是必传参数
      },
      {
        title: '补充材料照片',
        pla: ' 补充材料照片 1/1',
        val: '',
        name: 'SWXBusinessAdditionPics',
        type: 'text',
        status: false,//用于控制省市区
        show: true,//用于控制是否上传图片
        nums: 2,//代表补充材料照片
        xh: true,//提示不是必传参数
      },
      {
        title: '补充说明',
        pla: ' 补充说明,限制在300个字以内',
        val: '',
        name: 'SWXBusinessAdditionDesc',
        type: 'text',
        status: false,//用于控制省市区
        show: false,//用于控制是否上传图片
        buSta: true,  //用于显示补充说明输入框
        xh: true,//提示不是必传参数
      },
      {
        title: '身份证姓名',
        pla: '* 请填写身份证姓名',
        val: '',
        name: 'SWXIdCardName',
        type: 'text',
        status: false,//用于控制省市区
        show: false,//用于控制是否上传图片
      },
      {
        title: '身份证号码',
        pla: '* 请填写身份证号码',
        val: '',
        name: 'SWXIDCardNumber',
        type: 'idcard',
        status: false,//用于控制省市区
        show: false,//用于控制是否上传图片

      },
      {
        title: '身份证有效期',
        pla: '',
        val: '',
        name: 'identityTime',
        type: 'text',
        status: false,//用于控制省市区
        show: false,//用于控制是否上传图片
        period: true,//用于显示有效期输入框
        end: 'endTime',//结束时间
        str: 'strTime',//开始时间
      },
      {
        title: '身份证人像正面照片',
        pla: '* 身份证人像正面照片 1/1',
        val: '',
        name: 'SWXIDCardCopy',
        type: 'text',
        status: false,//用于控制省市区
        show: true,//用于控制是否上传图片
        nums: 3,//代表身份证号码
      },
      {
        title: '身份证国徽照片',
        pla: '* 身份证国徽照片 1/1',
        val: '',
        name: 'SWXIDCardNational',
        type: 'text',
        status: false,//用于控制省市区
        show: true,//用于控制是否上传图片
        nums: 4,//身份证国徽照片
      },
    ],
    smallData: [ //小微商户数据
      {
        title: '开户名称',
        pla: '* 请填写开户名称',
        val: '',
        name: 'SWXAccountName',
        type: 'text',
        status: false,
        show: false,//用于控制是否上传图片
      },
      {
        title: '开户银行',
        pla: '* 请选择开户银行',
        val: '',
        name: 'SWXBankName',
        type: 'text',
        status: false,
        show: true,//用于控制是否上传图片
      },
      {
        title: '开户银行全称(含支行)',
        pla: '* 请填写开户银行全称',
        val: '',
        name: 'SWXAccountBank',
        type: 'text',
        status: false,
        show: false,//用于控制是否上传图片
      },
      {
        title: '开户银行所在市',
        pla: '* 请填写开户银行市区(如:广州市)',
        val: '',
        name: 'SWXBankAddressCode',
        type: 'text',
        status: false,
        show: false,//用于控制是否上传图片
      },
      {
        title: '银行账号',
        pla: '* 请填写银行账号',
        val: '',
        name: 'SWXAccountNumber',
        type: 'number',
        status: false,
        show: false,//用于控制是否上传图片
      },
      {
        title: '联系邮箱',
        pla: '* 请填写联系邮箱',
        val: '',
        name: 'SWXContactEmail',
        type: 'text',
        status: false,
        show: false,//用于控制是否上传图片
      },
      {
        title: '门店所在市',
        pla: '* 请填写门店市区(如:广州市)',
        val: '',
        name: 'SWXStoreAddressCode',
        type: 'text',
        status: false,
        show: false,//用于控制是否上传图片
      },
      {
        title: '门店街道名称',
        pla: '* 请填写门店街道名称',
        val: '',
        name: 'SWXStoreStreet',
        type: 'text',
        status: false,
        show: false,//用于控制是否上传图片
      },
      {
        title: '商户简称',
        pla: '* 请填写商户简称',
        val: '',
        name: 'SWXMerchantShortName',
        type: 'text',
        status: false,
        show: false,//用于控制是否上传图片
      },
      {
        title: '客服电话',
        pla: '* 请填写客服电话',
        val: '',
        name: 'SWXServicePhone',
        type: 'number',
        status: false,
        show: false,//用于控制是否上传图片
      },
      {
        title: '提供服务描述',
        pla: '* 请选择服务描述',
        val: '',
        name: 'SWXProductDesc',
        type: 'number',
        status: false,
        show: true,//用于控制是否上传图片
        fusta: true, //显示服务下拉框
      },
      {
        title: '费率',
        pla: '* 请填写费率',
        val: '0.60%',
        name: 'SWXRateType',
        type: 'number',
        status: false,
        show: true,//用于控制是否上传图片
      },
    ],
    // businessData:[ //商户信息
    //   {
    //     title: '主营类型',
    //     pla: '请填写主营类型',
    //     val: '',
    //     name: 'mainTypes',
    //     type: 'text',
    //     status: false,//用于控制省市区
    //     show: false,//用于控制是否上传图片
    //   },
    //   {
    //     title: '营业执照注册号',
    //     pla: '请填写营业执照注册号',
    //     val: '',
    //     name: 'registration',
    //     type: 'text',
    //     status: false,//用于控制省市区
    //     show: false,//用于控制是否上传图片
    //   },
    //   {
    //     title: '营业执照类型',
    //     pla: '请填写营业执照类型',
    //     val: '',
    //     name: 'typeOf',
    //     type: 'text',
    //     status: false,//用于控制省市区
    //     show: false,//用于控制是否上传图片
    //   },
    //   {
    //     title: '营业期限',
    //     pla: '',
    //     val: '',
    //     name: 'businessTime',
    //     type: 'text',
    //     status: true,//用于控制省市区
    //     show: false,//用于控制是否上传图片
    //   },
    //   {
    //     title: '经营场景',
    //     pla: '请填写经营场景',
    //     val: '',
    //     name: 'jyingTypes',
    //     type: 'text',
    //     status: false,//用于控制省市区
    //     show: false,//用于控制是否上传图片
    //   },
    //   {
    //     title: '营业执照扫描件',
    //     pla: '营业执照扫描件 1/1',
    //     val: '',
    //     name: 'businessImg',
    //     type: 'text',
    //     status: false,//用于控制省市区
    //     show: true,//用于控制是否上传图片
    //     nums: 5,//代表营业执照扫描件
    //   },
    //   {
    //     title: '组织机构代码',
    //     pla: '请填写组织机构代码',
    //     val: '',
    //     name: 'barCode',
    //     type: 'text',
    //     status: false,//用于控制省市区
    //     show: false,//用于控制是否上传图片

    //   },
    //   {
    //     title: '组织机构有效期',
    //     pla: '',
    //     val: '',
    //     name: 'validity',
    //     type: 'text',
    //     status: true,//用于控制省市区
    //     show: false,//用于控制是否上传图片
    //   },
    //   {
    //     title: '组织机构代码证照片',
    //     pla: '组织机构代码证照片 1/1',
    //     val: '',
    //     name: 'codeImg',
    //     type: 'text',
    //     status: false,//用于控制省市区
    //     show: true,//用于控制是否上传图片
    //     nums: 6,//代表组织机构代码证照片
    //   },
    //   {
    //     title: '法定代表人',
    //     pla: '请填写法定代表人',
    //     val: '',
    //     name: 'legal',
    //     type: 'text',
    //     status: false,//用于控制省市区
    //     show: false,//用于控制是否上传图片
    //   },
    //   {
    //     title: '注册地址',
    //     pla: '请填写注册地址',
    //     val: '',
    //     name: 'registered',
    //     type: 'text',
    //     status: false,//用于控制省市区
    //     show: false,//用于控制是否上传图片
    //   },
    // ],
    region: ['广东省', '广州市', '越秀区'],
    // region: [],
    customItem: '全部',
    photoList: [],  //照片数组 门店logo
    photoList2: [],  //照片数组 门店门口照片
    photoList3: [],  //照片数组 //补充材料照片
    photoList4: [],  //照片数组 //身份证人像正面照片
    photoList5: [],  //照片数组 //身份证国徽照片
    photoList6: [],  //照片数组
    photoList7: [],  //照片数组
    photoList8: [],  //照片数组 //店内环境照片
    photoList9: [],  //照片数组 //经营场地照
    StoreImages: '',  //logo图片
    SWXIndoorPic: '', //门店门口照片
    SWXStoreEntrancePic: '',//店内环境照片
    SWXAddressCertification: '',//经营照片
    SWXBusinessAdditionPics: '',//补充材料图片
    SWXIDCardCopy: '', //身份证正面
    SWXIDCardNational: '',//反面
    businessImg: '',
    codeImg: '',
    environmentImg: '',
    premisesImg: '',
    uploadImg: [],
    imageLoad: [],
    logoLoad: [],
    prosivion: ['餐饮', '线下零售', '居民生活服务', '休闲娱乐', '交通出行', '其他'],
    pull: false,
    dateSta: '2019-11-13',
    dateEnd: '2019-12-13',
    staVal: '',
    endVal: '',
    getForm: {}, //获取表单的数据.
    UserId: '',//用户id
    StoreId: '',//门店id
    main: '',//驳回理由
    mrzhi: '审核不通过',
    sals: '',
    longitude: 113.324520,
    latitude: 23.099994,
    circles: [],
    srShow:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.getLocation({
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
      },
    })
    // app.globalData.GetMembersInfo={
    //   stid:747,
    //   UserId:3121
    // }
    // let { StoreId,UserId,stid } = wx.getStorageSync('userinfo');
    this.setData({
      StoreId: app.globalData.GetMembersInfo.stid,
      UserId: app.globalData.GetMembersInfo.UserId,
    })
    this.getForm(this.data.StoreId);

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  // //获取个人信息
  // referUser() {
  //   let that = this
  //   app.getOpenId(function (a) {
  //     app.fg({
  //       action: 'GetMembersInfo',
  //       openId: a
  //     }).then(r => {
  //       if (r.data.Status == "OK") {
  //         let dataR = r.data.Data
  //         console.log("dataR",dataR);
  //         const { StoreId, UserId } = dataR;
  //         that.setData({
  //           StoreId:dataR.stid,
  //           UserId,
  //         })
  //       } 
  //     })
  //   })
  // },
  //获取表单数据
  getForm(id) {
    let that = this;
    let url = '?action=StoreApproval';
    let img = that.data.img;
    let data = {
      StoreType: 1, //	是	int	获取类型(0- 新增门店、1 - 获取门店申请)
      StoreId: id, //	是	int	门店Id
    }
    app.wPost(data, url).then(res => {
      console.log("输出form表单数据", res);
      let data = JSON.parse(res.data.Message)
      console.log("获取初始化数据", data);
      let basic = that.data.basicData;
      let small = that.data.smallData;
      basic.forEach(item => {
        for (let v in data) {
          if(v=='FullRegionPath'){
            that.setData({
              region:data[v].split(',')
            })
          }
          if (item.name == v) {
            if (item.name == 'StoreImages') { //
              let obj = {}
              obj.ImageUrl = data[v]
              let kArr = []
              kArr.push(obj)
              // console.log('门店logo', kArr);
              that.setData({
                photoList: kArr,
                StoreImages: data[v]
              })
            } else if (item.name == 'SWXIndoorPic') { //门店门口照片
              let obj = {}
              obj.ImageUrl = data[v]
              let kArr = []
              kArr.push(obj)
              // console.log('门店门口照片', kArr);
              that.setData({
                photoList2: kArr,
                SWXIndoorPic: data[v]
              })
            } else if (item.name == 'SWXStoreEntrancePic') { //店内环境图片
              let obj = {}
              obj.ImageUrl = data[v]
              let kArr = []
              kArr.push(obj)
              // console.log('店内环境图片', kArr);
              that.setData({
                photoList8: kArr,
                SWXStoreEntrancePic: data[v]
              })
            } else if (item.name == 'SWXAddressCertification') { //经营场地证明图片
              let obj = {}
              obj.ImageUrl = data[v] || that.data.zwtpImg//用于默认图片
              let kArr = []
              kArr.push(obj)
              // console.log('经营场地证明图片', kArr);
              that.setData({
                photoList9: kArr,
                SWXAddressCertification: data[v]
              })
            } else if (item.name == 'SWXBusinessAdditionPics') { //补充材料照片
              let obj = {}
              obj.ImageUrl = data[v] || that.data.zwtpImg//用于默认图片
              let kArr = []
              kArr.push(obj)
              // console.log("补充材料照片",kArr);
              that.setData({
                photoList3: kArr,
                SWXBusinessAdditionPics: data[v]
              })
            } else if (item.name == 'SWXIDCardCopy') { //身份证人像面图片SWXIDCardCopy
              let obj = {}
              obj.ImageUrl = data[v]
              // console.log("输出了8吗", data[v]);
              let kArr = []
              kArr.push(obj)
              // kArr.push(img)
              // console.log("身份证人像面图片",kArr);
              that.setData({
                photoList4: kArr,
                SWXIDCardCopy: data[v]
              })
            } else if (item.name == 'SWXIDCardNational') { //身份证国徽面图片
              let obj = {}
              obj.ImageUrl = data[v]
              // console.log("输出了9吗", data[v]);
              let kArr = []
              kArr.push(obj)
              // kArr.push(img)
              // console.log("身份证国徽面图片", kArr);
              that.setData({
                photoList5: kArr,
                SWXIDCardNational: data[v]
              })
            } else if (item.name == 'SWXBusinessAdditionDesc') {
              if (data[v] == '' || data[v] == null) {
                that.setData({
                  'basicData[10].val': ''
                })
              } else {
                that.setData({
                  'basicData[10].val': data[v]
                })
              }
            } else {
              item.val = data[v]
            }
          }
        }
      })
      small.forEach(item => {
        for (let v in data) {
          if (item.name == v) {
            if (item.title == "费率") { //用于匹配费率
              if (v.SWXRateType == 10) {
                item.val = '0.60%'
              } else if (v.SWXRateType == 9) {
                item.val = '0.59%'
              } else if (v.SWXRateType == 8) {
                item.val = '0.58%'
              } else if (v.SWXRateType == 7) {
                item.val = '0.55%'
              } else if (v.SWXRateType == 6) {
                item.val = '0.50%'
              } else if (v.SWXRateType == 5) {
                item.val = '0.49%'
              } else if (v.SWXRateType == 4) {
                item.val = '0.48%'
              } else if (v.SWXRateType == 3) {
                item.val = '0.45%'
              } else if (v.SWXRateType == 2) {
                item.val = '0.40%'
              } else if (v.SWXRateType == 1) {
                item.val = '0.39%'
              }
            } else {
              item.val = data[v]
            }
          }
        }
      })
      //驳回理由
      let rl = data.RepelReason;
      //小微商户状态
      let sals = data.SWXApplyStatus;
      if (rl == '' || rl == null) {
        if (sals == -1) {
          that.setData({
            main: '申请失败',
            mrzhi: '申请失败'
          })
        } else if (sals == 0) {
          that.setData({
            main: '填写资料',
            mrzhi: '填写资料'
          })
        } else if (!sals && !rl) {
          that.setData({
            main: '审核中',
            mrzhi: '审核中'
          })
        } else if (sals == 2) {
          that.setData({
            main: '已驳回',
            mrzhi: '已驳回'
          })
        } else if (sals == 3) {
          that.setData({
            main: '已冻结',
            mrzhi: '已冻结'
          })
        } else if (sals == 4) {
          that.setData({
            main: '待签约',
            mrzhi: '待签约'
          })
        } else if (sals == 5) {
          that.setData({
            main: '完成',
            mrzhi: '完成'
          })
        }
      } else {
        that.setData({
          main: data.RepelReason,//驳回理由
        })
      }
      that.setData({
        getForm: data,
        dateSta: data.SWXIdCardValidTimeStart.split('T')[0],
        dateEnd: data.SWXIdCardValidTimeEnd.split('T')[0],
        basicData: basic,
        smallData: small,
        main: data.RepelReason,//驳回理由
        sals,//小微商户状态
      })

    })
  },

  //form表单
  formSubmit: function (e) {
    wx.showLoading({
      title: '提交中~',
      mask: true,
    });

    let obj = e.detail.value, that = this, fu = this.data
    console.log("输出form表单", obj);
    let data = {
      action: 'StoreApproval',
      UserId: this.data.UserId,
      StoreId: this.data.StoreId,
      StoreType: 0, //	是	string	获取类型（0-申请门店、1-获取门店）
      StoreName: obj.StoreName, //	是	string	门店名
      StoreArea: obj.FullRegionPath || '广东省,广州市,越秀区', //	是	string	省市区
      StoreAdress: obj.Address, //	是	string	地址
      ContactName: obj.ContactMan, //	是	string	联系人
      ContactTel: obj.Tel,  //	是	string	联系电话(必须为手机号)
      StoreLogo: obj.StoreImages,  //	是	string	门店logo
      IdCardName: obj.SWXIdCardName,  //	是	string	身份证姓名
      IDCardNumber: obj.SWXIDCardNumber,  //	是	string	身份证号码
      IDCardCopy: obj.SWXIDCardCopy,  //	是	string	身份证人像面图片
      IDCardNational: obj.SWXIDCardNational,  //	是	string	身份证国徽面图片
      IdCardValidTimeStart: obj.dateSta || '2018-11-12',  //	是	DateTime	身份证有限期限开始时间
      IdCardValidTimeEnd: obj.dateEnd || '2020-12-31',  //	是	DateTime	身份证有限期限截止时间
      AccountName: obj.SWXAccountName,  //	是	string	开户名称
      BankName: obj.SWXBankName,  //	是	string	开户银行（工商银行√ 中国工商银行× ）
      AccountBank: obj.SWXAccountBank,  //	是	string	开户银行全称
      AccountNumber: obj.SWXAccountNumber,  //	是	string	银行账号
      BankAddressCode: obj.SWXBankAddressCode,  //	是	string	开户银行省市代码（输入地级市）*************
      StoreAddressCode: obj.SWXStoreAddressCode,  //	是	string	门店省市编码（输入地级市）***********
      ContactEmail: obj.SWXContactEmail,  //	是	string	联系邮箱
      RateType: '10',  //	是	string	费率（下拉框0=0.38 % (默认)1= 0.39 % 2=0.40% 3=0.45% 4=0.48% 5=0.49% 6=0.50% 7=0.55% 8=0.58% 9=0.59% 10=0.60%）
      StoreStreet: obj.SWXStoreStreet,  //	是	string	门店街道名称
      MerchantShortName: obj.SWXMerchantShortName,  //	是	string	商户简称
      IndoorPic: obj.SWXIndoorPic,  //	是	string	门店门口照片
      StoreEntrancePic: obj.SWXStoreEntrancePic,  //	是	string	店内环境图片
      ServicePhone: obj.SWXServicePhone,  //	是	string	客服电话
      ProductDesc: obj.SWXProductDesc || '线下零售',  //	是	string	提供服务描述
      AddressCertification: obj.SWXAddressCertification,  //	否	string	经营场地证明图片
      BusinessAdditionPics: obj.SWXBusinessAdditionPics,  //	否	string	补充材料照片
      BusinessAdditionDesc: obj.SWXBusinessAdditionDesc,  //	否	string	补充说明
      Coordinate: fu.latitude + ',' + fu.longitude,
      IsBlack:0,
    }
    // app.wPost(data).then(res=>{
    //   console.log("表单提交结果",res);
    // })
    wx.request({
      url: app.getUrl('StoreApproval') ,
      // url: 'http://192.168.3.82:8086/AppShop/AppShopHandler.ashx?action=StoreApproval',
      data: data,
      // header: { 'content-type': 'application/json' },
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      dataType: 'json',
      success: (res) => {
        console.log("表单提交结果", res);
        if (res.data.Status == "Success") {
          that.updataUser()
          setTimeout(() => {
            wx.hideLoading();
            wx.showToast({
              title: res.data.Message,
              icon: 'none',
              duration: 1500,
              mask: true,
              success: (result) => {
                setTimeout(() => {
                  wx.navigateBack({
                    delta: 3
                  });
                }, 1500);
              },
            });
          }, 1500);
        } else {
          wx.hideLoading();
          wx.showToast({
            title: res.data.Message,
            icon: 'none',
            image: '',
            duration: 1500,
            mask: true,
            success: (result) => {

            },
            fail: () => { },
            complete: () => { }
          });

        }
      },
    });

  },

  //选择省市区
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value,
      'basicData[1].val': e.detail.value || this.data.region
    })
  },
  // 拍照、选图
  postImg(e) {
    let that = this;
    console.log("输出点e", e);
    let { typeid } = e.currentTarget.dataset;
    console.log(typeid);
    wx.chooseImage({
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        const logoLoad = this.data.logoLoad.concat(res.tempFilePaths)
        let logoList = []
        logoList = logoLoad.length <= 1 ? logoLoad : logoLoad.slice(0, 1)
        console.log(logoList)
        that.uploadImgs(logoList, 0, 'logo', typeid).then(c => {
          console.log("图片上传", that.data.logo)
        })
      }
    })
  },
  uploadImgs(images, num, name, id) {

    let that = this
    const all = num
    let getImage = ''
    return new Promise((resolve, reject) => {
      function upload(num) {
        if (num < 0) {
          resolve(true)
          that.setData({
            [name]: getImage,
          })
          return
        }
        wx.uploadFile({
          url: app.getUrl('UploadAppletImage'),
          appid: app.globalData.appId,
          filePath: images[num],
          NotCheck: true,
          name: 'file',
          formData: {
            appid: app.globalData.appId,
            openId: app.globalData.GetMembersInfo.openId,
          },
          success: res => {
            // console.log("输出调用接口",res);
            // let newArr = [];
            let datar = JSON.parse(res.data)
            if (datar.Status == "OK") {
              if (num == all) {
                if (id == 0) { //logo
                  getImage = datar.Data[0].ImageUrl
                  console.log("++++++++++", getImage);
                  that.setData({
                    photoList: datar.Data,
                    StoreImages: getImage
                  })
                } else if (id == 1) { //门店门口照片
                  getImage = datar.Data[0].ImageUrl
                  that.setData({
                    photoList2: datar.Data,
                    SWXIndoorPic: getImage,
                  })
                } else if (id == 2) { //补充材料照片
                  console.log("输出补充材料nums==2", id);
                  getImage = datar.Data[0].ImageUrl
                  that.setData({
                    photoList3: datar.Data,
                    SWXBusinessAdditionPics: getImage,
                  })
                } else if (id == 3) { //身份证人像正面照片
                  getImage = datar.Data[0].ImageUrl
                  that.setData({
                    photoList4: datar.Data,
                    SWXIDCardCopy: getImage,
                  })
                } else if (id == 4) { //身份证国徽照片
                  getImage = datar.Data[0].ImageUrl
                  that.setData({
                    photoList5: datar.Data,
                    SWXIDCardNational: getImage,
                  })
                } else if (id == 5) {
                  getImage = datar.Data[0].ImageUrl
                  that.setData({
                    photoList6: datar.Data,
                    businessImg: getImage,
                  })
                } else if (id == 6) {
                  getImage = datar.Data[0].ImageUrl
                  that.setData({
                    photoList7: datar.Data,
                    codeImg: getImage,
                    environmentImg: '',
                    premisesImg: '',
                  })
                } else if (id == 7) { //店内环境照片
                  getImage = datar.Data[0].ImageUrl
                  that.setData({
                    photoList8: datar.Data,
                    SWXStoreEntrancePic: getImage,

                  })
                } else if (id == 8) { //经营场地照
                  console.log("输出经营场地照nums==8", id);
                  getImage = datar.Data[0].ImageUrl
                  that.setData({
                    photoList9: datar.Data,
                    SWXAddressCertification: getImage,//** */
                  })
                }
              } else {
                getImage += ',' + datar.Data[0].ImageUrl
              }
              // if (num == all) getImage = datar.Data[0].ImageUrl
              // else getImage += ',' + datar.Data[0].ImageUrl
              // num = num - 1
              // num = num - 1
              // upload(num)
            } else {
              app.fh()
              app.fa("上传图片失败！")
            }
          }
        })
      }
      upload(num)
    })
  },

  // 打开银行显示
  openBank(e){
    console.log(e,'99999999');
    if(e.currentTarget.dataset.index==1){
      this.setData({
        showBank:true,
      })
    }
  },
  // 删除图片
  Deleted(e) {
    let { index } = e.currentTarget.dataset;
    this.data.photoList.splice(index, 1)
    this.setData({
      photoList: this.data.photoList,
      StoreImages: '',
    })
  },
  Deleted2(e) {
    let { index } = e.currentTarget.dataset;
    this.data.photoList2.splice(index, 1)
    this.setData({
      photoList2: this.data.photoList2,
      SWXIndoorPic: '',
    })
  },
  Deleted3(e) {
    let { index } = e.currentTarget.dataset;
    this.data.photoList3.splice(index, 1)
    this.setData({
      photoList3: this.data.photoList3,
      SWXBusinessAdditionPics: '',
    })
  },
  Deleted4(e) {
    let { index } = e.currentTarget.dataset;
    this.data.photoList4.splice(index, 1)
    this.setData({
      photoList4: this.data.photoList4,
      SWXIDCardCopy: '',
    })
  },
  Deleted5(e) {
    let { index } = e.currentTarget.dataset;
    this.data.photoList5.splice(index, 1)
    this.setData({
      photoList5: this.data.photoList5,
      SWXIDCardNational: '',
    })
  },
  Deleted8(e) { //身份证正面
    let { index } = e.currentTarget.dataset;
    this.data.photoList8.splice(index, 1)
    this.setData({
      photoList8: this.data.photoList8,
      SWXStoreEntrancePic: '',
    })
  },
  Deleted9(e) { //身份证反面
    console.log("输出了啊");
    let { index } = e.currentTarget.dataset;
    this.data.photoList9.splice(index, 1)
    this.setData({
      photoList9: this.data.photoList9,
      SWXAddressCertification: '',
    })
  },
  //控制服务下拉框
  handlePull() {
    this.setData({
      pull: !this.data.pull
    })
  },
  //获取下拉框选中的值
  handleDown(e) {
    console.log(e);
    const { val, index } = e.currentTarget.dataset;
    this.setData({
      'smallData[10].val': val,
      pull: false
    })
  },
  //开始时间
  bindDateChange1: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      dateSta: e.detail.value,
      staVal: e.detail.value || this.data.dateSta
    })
  },
  //结束时间
  bindDateChange2: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      dateEnd: e.detail.value,
      endVal: e.detail.value || this.data.dateEnd
    })
  },

  updataUser() {
    app.getOpenId(function (a) {
      app.fg({
        action: 'GetMembersInfo',
        openId: a
      }).then(r => {
        if (r.data.Status == "OK") {
          let dataR = r.data.Data
          dataR.openId = a
          app.setMembersInfo(dataR)
          wx.setStorageSync('userinfo', dataR);

        } else {
          wx.redirectTo({
            url: "/pages/login/login"
          });
        }
      })
    })

  },

  // 触发点击地图
  DingWeiFN(e) {
    console.log(e, '=======');
    let a = {
      longitude: e.detail.longitude,
      latitude: e.detail.latitude,
      radius: 40,
      fillColor: '#ff0000',
    }

    this.setData({
      longitude: e.detail.longitude,
      latitude: e.detail.latitude,
      ['circles[0]']: a
    })
  },

  blurFN(e) {
    if (e.currentTarget.dataset.name == "Address") {
      this.getTencentMap(e.detail.value)
    }
  },

  //调取腾讯地图
  getTencentMap(address) {
    let that = this, data = this.data
    var qqmapsdk = new QQMapWX({
      key: '7V4BZ-4WFW4-L3LU6-XLRLM-ZZ7BJ-MBFAM' // 必填
    });
    console.log('2w2');
    qqmapsdk.geocoder({
      address: data.region[0]+data.region[1]+data.region[2] + address,
      success: function (res) {
        console.log(res,'111111');
        that.setData({
          longitude: res.result.location.lng,
          latitude: res.result.location.lat,
        })
      },
      fail: function (e) {
      }
    })
  },

  // 
  saveJScode() {
    let url=this.data.getForm.SWXSignUrl
    console.log(url,444444444);
    // wx.showModal({
    //   title: '提示01',
    //   content: url,
    // })
    wx.downloadFile({
      url: url,     //仅为示例，并非真实的资源
      success: function (res) {
        console.log(res,1111111);
        // wx.showModal({
        //   title: '提示02',
        //   content: res.tempFilePath,
        // })
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode == 200) {
          app.fl('正在保存图片！')
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(res) {
              app.fh()
              app.fa('保存图片成功！')
            },
            fail(res) { 
              console.log(res,222222);
              wx.showModal({
                title: '提示',
                content: '请打开相册授权',
                success(res) {
                  if (res.confirm) {
                    wx.openSetting({})
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            }
          })
        }
      }
    })
  },
  inputFN(e){
    this.setData({
      [e.target.dataset.name]:e.detail.value
    })
  },
  // 選擇銀行
  chooseBank(e){
    this.setData({
      ['smallData[1].val']:e.currentTarget.dataset.name,
      showBank:false,
      srShow:e.currentTarget.dataset.name=='其他银行'
    })
   
  },
  // 
  fuNameFN(){
    this.setData({
      srShow:false
    })
  }
  
})