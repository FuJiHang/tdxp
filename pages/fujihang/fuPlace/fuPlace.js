// pages/fujihang/fuPlace/fuPlace.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */


  data: {
    imgUrl:app.imgUrl,//
    timeIndex:0,//选择时间的索引
    payInfo:{},//支付信息
    payMode:{
      show:false,
      mode:0
    },//支付方式，==0?微信:支付宝
    payList:[
      'wxzf.png',
      'zfbzf.png',
    ],
    project:[
      {
        topName:'项目1',
        timeS:"请选择预约时间",
        timeV:0,
        name:'芭比美甲装',
        money:'25.00',
        company:'广州市曙光整形医院',
        address:'广州市天河区天河北路曙光整形医院',
      },
      {
        topName:'项目1',
        timeS:"请选择预约时间",
        timeV:0,
        name:'芭比美甲装',
        money:'25.00',
        company:'广州市曙光整形医院',
        address:'广州市天河区天河北路曙光整形医院',
      },
    ],//项目资料
    personData:[
      {
        name:'姓名',
        val:'',
        plr:'请输入姓名',
        data:'RealName',
      },
      {
        name:'电话号码',
        val:'',
        plr:'请输入电话号码',
        data:'CellPhone',
      },
      // {
      //   name:'身份证号',
      //   val:'',
      //   plr:'请输入身份证号',
      //   data:'IdentityCard'
      // },
    ],//个人资料
    showTime:false,//时间弹窗
    currentDate: new Date().getTime(),//默认时间
    storeData:{},//门店信息
    allPrice:0,//总金额
    jisuanPrice:0,//计算金额
    pasreAll:false,//全额：定金
    upgrade:{},//升单
    couponId:{
      id:0, 
      pic:0,
    },//优惠券
    xiuFuJi:false,//修复剂
    richtext:'',//富文本内容
    showXY:false,//显示富文本
    wtyFNP:{
      yyTime:'',
      programids:''
    },//协议购买参数
    SMS:"",
    totalTime:6,
    FightGroupActivityId:'',//拼团
    FightGroupId:'',//拼团
    ReferralStoreUserId:'',//推荐人id
  },
  // 关闭协议
  closeXY(){
    this.setData({
      showXY:false
    })
  },
  // 协议购买
  wtyFN(){
    if(this.data.totalTime>0) return
    this.payOkFN(this.data.wtyFNP.yyTime,this.data.wtyFNP.programids,1)
  },
  // 打开关闭选择支付方式
  openPay(){
    this.setData({
      ["payMode.show"]:true,
    })
  },
  onCloseP(){
    let aa=""
    this.setData({
      ["payMode.show"]:false,
    })
  },
  // 选择支付方式
  chooseFN(e){
    let payMode={
      mode:e.currentTarget.dataset.index,
      show:false,
    }
    this.setData({
      payMode:payMode
    })
    console.log(e)
  },
  // 选择优惠券
  coupon(){
    let that=this
    wx.navigateTo({
      url:'/pages/fujihang/fuCoupon/fuCoupon?price='+this.data.jisuanPrice
    })
  }, 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data=this.data,that=this
    // 
    wx.getStorage({
      key:'ReferralStoreUserId',
      success(res){
        that.setData({
          ReferralStoreUserId:res.data?res.data:''
        })
      }
    })
    
    data.project=JSON.parse(decodeURIComponent(options.cartList))
    data.FightGroupActivityId=data.project[0].FightGroupActivityId
    data.FightGroupId=data.project[0].FightGroupId
    data.storeData=JSON.parse(decodeURIComponent(options.storeData))
    for(let i=0;i<data.project.length;i++){
      data.project[i].timeS="请选择预约时间"
      data.project[i].timeV=0    
      data.project[i].xm="项目"+(i+1)   

    }
    for(let i=0;i<data.project.length;i++){
      console.log(data.project[i],'2222222');
      let money=options.pasreAll=="true"?data.project[i].SalePrice*100:data.project[i].Deposit*100
      data.allPrice+=money/100
    }
    this.setData({
      pasreAll:options.pasreAll,//全额：定金
      project:data.project,
      storeData:data.storeData,
      jisuanPrice:data.allPrice,
      allPrice:data.allPrice,
      FightGroupActivityId:data.FightGroupActivityId,
      FightGroupId:data.FightGroupId,
    })

    wx.setStorage({
      key:"couponId",
      data:{
        id:0,
        pic:0,
      },
    })


  },
  // 更新填入的数据
  bindinputFN(e){
    let index=e.currentTarget.dataset.index
    let val=e.detail.value
    var change="personData["+index+"].val"
    this.setData({
      [change]:val
    })
  },
  
  // 立即支付
  payFN:function(){
    let data=this.data,that=this
    let yyTime=''
    let programids=''
    for(let i=0;i<data.project.length;i++){
      if(data.project[i].timeV==0) return app.fa("请选择预约时间！")
      if(i==0){
        yyTime=data.project[i].timeV
        programids=data.project[i].ProductId
      }
      else{
        yyTime+=','+data.project[i].timeV
        programids+=','+data.project[i].ProductId
      }
      
    }
    for(let i=0;i<data.personData.length;i++){
      if(!data.personData[i].val) return app.fa(data.personData[i].plr)
    }
    if(!(/^1[3|4|5|6|7|8][0-9|9]\d{4,8}$/.test(data.personData[1].val))) return app.fa('手机号码不正确！')
    if(data.couponId.id==0){
      that.payOkFN(yyTime,programids)
    }else{
      wx.showModal({
        title: '提示',
        content: '一旦选择电子券,将不能使用技师优惠券',
        success(res) {
          if (res.confirm) {
            that.payOkFN(yyTime,programids)
                
          } 
        }
      })
    }
  },

  // 如果个人信息没收货地址，自动更新填入数据
  updataUser(){
    // console.log("1122222222222221333333")
    app.fg({
      action:'UpdateInformationMember',
      openId:app.globalData.GetMembersInfo.openId,
      RealName:app.globalData.GetMembersInfo.RealName?app.globalData.GetMembersInfo.RealName:this.data.personData[0].val,
      CellPhone:app.globalData.GetMembersInfo.CellPhone?app.globalData.GetMembersInfo.CellPhone:this.data.personData[1].val,
      gender:app.globalData.GetMembersInfo.Gender,
      birthday:app.globalData.GetMembersInfo.BirthDate,
    })
    // .then(r=>{
    //   console.log(r)
    // })
  },

  // 修复剂
  xiuFuJiFN(){
    this.setData({
      xiuFuJi:this.data.xiuFuJi?false:true,
      jisuanPrice:this.data.xiuFuJi?(this.data.allPrice*100-20000)/100:(this.data.allPrice*100+20000)/100,
      allPrice:this.data.xiuFuJi?(this.data.allPrice*100-20000)/100:(this.data.allPrice*100+20000)/100,
    })
  },
  payOkFN(yyTime,programids,ProtocolType){
    let data=this.data,that=this
    
    app.fg({
      action:'CheckContentSecurity', 
      Type:0,
      FormData:data.personData[0].val
    }).then(t=>{
      if(t.data.Status!="OK"){
        app.fa(t.data.Message)
        that.setData({
          Contents:'',
        })
      }else{

        app.fl()
        // 下订单
        app.fg({
          action:'SubmmitOrder',
          selectdates:yyTime,
          storeid:data.storeData.StoreId,
          programids:programids,
          type:0,
          name:data.personData[0].val,
          tel:data.personData[1].val,
          // identitynum:data.personData[2].val,
          openId:app.globalData.GetMembersInfo.openId,
          // openId:'oGsqu4kr4cw0lP0vIV5sTDoxa66k',
          ReferralStoreUserId:data.ReferralStoreUserId?data.ReferralStoreUserId:'',
          paytype:data.pasreAll=="true"?1:0,
          ClaimCode:data.couponId.id?data.couponId.id:'',
          PaymentType:data.payMode.mode==1?'alipay':'wx',
          RestoreProductCount:data.xiuFuJi?1:'',
          ProtocolType:ProtocolType?ProtocolType:0,
          IsTest:1,
          FightGroupActivityId:data.FightGroupId?'':(data.FightGroupActivityId?data.FightGroupActivityId:''),
          FightGroupId:data.FightGroupId?data.FightGroupId:'',
        }).then(r=>{
          wx.setStorage({
            key:'personData',
            data:{
              RealName:data.personData[0].val,
              CellPhone:data.personData[1].val
            }
          })
          if(r.data.Status=="Yes"){
            app.fh()
            let wtyFNP={
              yyTime:yyTime,
              programids:programids
            }
            that.setData({
              richtext:r.data.Message,
              showXY:true,
              wtyFNP:wtyFNP
            })

            let clock =setInterval(() => {
              data.totalTime--
              data.SMS = data.totalTime + 's'
              if (data.totalTime < 0) {
                clearInterval(clock)
                data.SMS = '同意'
                // data.totalTime = 6
              }
              that.setData({
                SMS:data.SMS,
                totalTime:data.totalTime,
              })
            },1000)

            return
          }
          if(r.data.Status=="OK"){
            app.fg({
              action:data.pasreAll=="true"?'GetPayParam':'GetPayParamDeposit',
              openId:app.globalData.GetMembersInfo.openId,
              // openId:'oGsqu4kr4cw0lP0vIV5sTDoxa66k',
              appid:app.globalData.appId,
              orderid:r.data.Data.Message,
              PaymentType:data.payMode.mode==1?'alipay':'wx',
              UpOrderId:data.upgrade.data&&data.payMode.mode==1?data.upgrade.data.orderId:'',
              SkuId:data.upgrade.data&&data.payMode.mode==1?data.upgrade.data.productId:'',
            }).then(p=>{
              console.log(p)
              if(p.data.Status=="OK"){
                if(data.payMode.mode==1){
                  app.fh()
                  // if(data.xiuFuJi==1){
                  //   that.getXiuFuJi(data,r).then(xfj=>{
                  //     wx.navigateTo({
                  //       url:'/pages/fujihang/fuAlipay/fuAlipay?url='+p.data.Message+'&oId='+r.data.Data.Message+'&xfj='+xfj
                  //     })
                  //   })
                  // }else{
                    wx.navigateTo({
                      url:'/pages/fujihang/fuAlipay/fuAlipay?url='+p.data.Message+'&oId='+r.data.Data.Message
                    })
                  // }
                  
                  
                  return
                }
                var pay=p.data.Data
                wx.requestPayment({
                  timeStamp: pay.timeStamp,
                  nonceStr: pay.nonceStr,
                  package: "prepay_id="+pay.prepayId,
                  signType: 'MD5',
                  paySign: pay.sign,
                  success(res) {
                    if(res.errMsg=="requestPayment:ok"){
                      // that.updataUser()
                      wx.setStorage({
                        key:"couponId",
                        data:{
                          id:0,
                          pic:0,
                        },
                      })
                      app.fh()

                      // 修复剂
                      // if(data.xiuFuJi==1){
                      //   app.fa('正在拉起修复剂支付')
                      //   setTimeout(()=>{
                      //     that.getXiuFuJi(data,r).then(i=>{
                      //       setTimeout(()=>{
                      //         that.okzhongji(data,r)
                      //       },1450)
                              
                      //     })
                      //   },1450)
                        

                      // }else  that.okzhongji(data,r)
                      that.okzhongji(data,r)

                      
                    
                    }
                  },
                  fail(res) { 
                    if(data.upgrade.data){
                      app.fg({
                        action:'CloseOrder',
                        openId:app.globalData.GetMembersInfo.openId,
                        orderId:r.data.Data.Message
                      })
                    }
                    app.fh()
                    app.fa("支付失败！")
                  }
                })
              }else {
                app.fh()
                app.fa(p.data.Message)
              }
            })
          }else {
            app.fh()
            app.fa(r.data.Message)
          }

        })



        
      }
    })

    
  },

  // 支付成功炒作
  okzhongji(data,r){
    if(data.upgrade.data){
      app.fg({
        action:"UpdateProgramFromOrder",
        orderid:data.upgrade.data.orderId,
        SkuId:data.upgrade.data.productId,
        verificationcode:data.upgrade.data.VerificationPassword
      }).then(u=>{
        if(u.data.Status="OK") app.fa('升单成功！')
        else app.fa(u.data.Message)
        setTimeout(()=>{
          wx.navigateTo({
            url: "/pages/fujihang/fuOrderDetail/fuOrderDetail?id="+r.data.Data.Message+"&type=0&tc=true"
          })
        },1450)
      })
       return
    }
    app.fa('订单支付成功')
    app.fg({
      action:'BuyerPaid',
      openId:app.globalData.GetMembersInfo.openId,
      orderId:r.data.Data.Message
    })
    setTimeout(()=>{
      wx.navigateTo({
        url: "/pages/fujihang/fuOrderDetail/fuOrderDetail?id="+r.data.Data.Message+"&type=0&tc=true"
      })
    },1450)
  },


  // 获得修复剂
  getXiuFuJi(data,r){
    return new Promise((resolve, reject) => {
      app.fl()
      app.fg({
        action:data.pasreAll=="true"?'GetPayParam':'GetPayParamDeposit',
        openId:app.globalData.GetMembersInfo.openId,
        appid:app.globalData.appId,
        orderid:r.data.Data.Message,
        PaymentType:data.payMode.mode==1?'alipay':'wx',
        UpOrderId:data.upgrade.data&&data.payMode.mode==1?data.upgrade.data.orderId:'',
        SkuId:data.upgrade.data&&data.payMode.mode==1?data.upgrade.data.productId:'',
        RestorerPay:1,
      }).then(s=>{
        app.fh()
        if(s.data.Status=="NO") app.fa(s.data.Message)
        var x=s.data.Data
        if(data.payMode.mode==1){
          resolve(s.data.Message)
          return
        }
        console.log("2222222222")
        console.log(x)
        wx.requestPayment({
          timeStamp: x.timeStamp,
          nonceStr: x.nonceStr,
          package: "prepay_id="+x.prepayId,
          signType: 'MD5',
          paySign: x.sign,
          success(res) {
            if(res.errMsg=="requestPayment:ok"){
              app.fa('修复剂支付成功！')
              resolve(true)
            }else{
              app.fa('修复剂支付失败！')
              resolve(false)
            }
          }, fail(res) { 
            app.fa('修复剂支付失败！')
            resolve(false)
          }
        })
      })
    })
    
  },
  
  //弹窗时间
  openTime:function(e){
    let data=this.data
    data.timeIndex=e.target.dataset.index
    this.setData({
      showTime:true,
      timeIndex:data.timeIndex,
    })
  },
  // 关闭时间弹窗
  onClose() {
    this.setData({ showTime: false });
  },
  // 选择时间
  onInput:function(event) {
    // console.log(event)
    this.setData({
      currentDate: event.detail
    });
  },
  okTime(){ 
    let data=this.data
    for(let i=0;i<data.project.length;i++){
      if(data.project[i].timeV==0){
        data.project[i].timeV=app.fttst(data.currentDate)
        data.project[i].timeS='预约时间 '+app.ftts(data.currentDate)
      } 
    }
    data.project[data.timeIndex].timeV=app.fttst(data.currentDate)
    data.project[data.timeIndex].timeS='预约时间 '+app.ftts(data.currentDate)
    this.setData({
      project:data.project,
      showTime:false
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
    let that = this,data = this.data
    if(!app.globalData.GetMembersInfo||!app.globalData.GetMembersInfo.openId||!app.globalData.GetMembersInfo.RealName){
      app.getOpenId(function(a) {
        app.fg({
          action: 'GetMembersInfo',
          openId: a
        }).then(r => {
          if (r.data.Status == "OK") {
            let dataR = r.data.Data
            dataR.openId = a
            app.setMembersInfo(dataR)
            wx.getStorage({
              key: 'personData',
              success (res) {
                for(let i=0;i<data.personData.length;i++){
                  data.personData[i].val=res.data[data.personData[i].data]?res.data[data.personData[i].data]:app.globalData.GetMembersInfo[data.personData[i].data]
                }
                that.setData({
                  personData:data.personData
                })
              },fail(res){
                for(let i=0;i<data.personData.length;i++){
                  data.personData[i].val=app.globalData.GetMembersInfo[data.personData[i].data]
                }
                that.setData({
                  personData:data.personData
                })
              }
            })
          } else {
            wx.redirectTo({
              url: "/pages/login/login"
            });
          }
        })
      })
    }else{
      wx.getStorage({
        key: 'personData',
        success (res) {
          for(let i=0;i<data.personData.length;i++){
            data.personData[i].val=res.data[data.personData[i].data]?res.data[data.personData[i].data]:app.globalData.GetMembersInfo[data.personData[i].data]
          }
          that.setData({
            personData:data.personData
          })
        },fail(res){
          for(let i=0;i<data.personData.length;i++){
            data.personData[i].val=app.globalData.GetMembersInfo[data.personData[i].data]
          }
          that.setData({
            personData:data.personData
          })
        }
      })
    }
    
    let dataF=this.data
    
    wx.getStorage({
      key:'couponId',
      success:r=>{
        that.setData({
          couponId:r.data,
          allPrice:dataF.jisuanPrice-r.data.pic>0?(dataF.jisuanPrice*100-r.data.pic*100)/100:0
        })

      }
    })
    

  
    wx.getStorage({
      key:'upgrade',
      success:r=>{
        that.setData({
          upgrade:r
        })
      }
    })

    
    
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