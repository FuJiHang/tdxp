const app=getApp()
Component({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.imgUrl,
    payMode:{
      show:false,
      mode:0
    },//支付方式，==0?微信:支付宝
    payList:[
      'wxzf.png',
      'zfbzf.png',
    ],
    xfj:false,
  },

  properties: {
    order:Object,
  },



  methods: {




    // 打开关闭选择支付方式
  openPay(e){
    console.log(e)
    this.setData({
      ["payMode.show"]:true,
      xfj:e.currentTarget.dataset.xfj?true:false
    })
  },
  onCloseP(){
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
    if(this.data.xfj) this.payxfj()
    else this.payFN()
    
  },
    // 跳转页面
    toFN:function(e){
      wx.navigateTo({
        url: "/pages/fujihang/fuOrderDetail/fuOrderDetail?id="+this.data.order.OrderId+"&type=0"
      });
      // console.log(e)
    },
 
    // 支付
    payFN(){
      console.log(this.data.order,'========')
      // return
      let that=this
      app.fl('正在支付...')
      app.fg({
        action:'GetPayParam',
        appid:app.globalData.appId,
        openId:app.globalData.GetMembersInfo.openId,
        orderid:this.data.order.OrderId,
        PaymentType:that.data.payMode.mode==1?'alipay':'wx',
      }).then(p=>{
        if(p.data.Status=="OK"){
          if(this.data.payMode.mode==1){
            app.fh()
            // if(that.data.order.RestorerHasPaid=="False"&&that.data.order.RestoresCount>0){
            //   that.getXiuFuJi(that.data).then(xfj=>{
            //     wx.navigateTo({
            //       url:'/pages/fujihang/fuAlipay/fuAlipay?url='+p.data.Message+'&oId='+that.data.order.OrderId+'&xfj='+xfj
            //     })
            //   })
            // }else{
              wx.navigateTo({
                url:'/pages/fujihang/fuAlipay/fuAlipay?url='+p.data.Message+'&oId='+that.data.order.OrderId
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
                app.fh()

                app.fg({
                  action:'BuyerPaid',
                  openId:app.globalData.GetMembersInfo.openId,
                  orderId:that.data.order.OrderId
                })

                // 修复剂
                // if(that.data.order.RestorerHasPaid=="False"&&that.data.order.RestoresCount>0){
                //   app.fa('正在拉起修复剂支付')
                //   setTimeout(()=>{
                //     that.getXiuFuJi(that.data).then(i=>{
                //       setTimeout(()=>{
                //         wx.navigateTo({
                //           url: "/pages/fujihang/fuPayState/fuPayState?money="+that.data.order.Amount
                //         });
                //       },1450)
                        
                //     })
                //   },1450)
                  

                // }else  {
                  wx.navigateTo({
                    url: "/pages/fujihang/fuPayState/fuPayState?money="+that.data.order.Amount+"&orderData="+encodeURIComponent(JSON.stringify(that.data.order))+"&des="+this.data.order.LineItems[0].Description
                  });
                // }

                
                
              }
            },
            fail(res) { 
              app.fh()
              app.fa("订单支付失败！")
            }
          })
        }else {
          app.fh()
          app.fa("下单失败！")
        }
      })
    },

    payxfj(){
      let that=this
      this.getXiuFuJi(that.data).then(c=>{
        if(that.data.payMode.mode==1){
          wx.navigateTo({
            url:'/pages/fujihang/fuAlipay/fuAlipay?oId='+that.data.order.OrderId+'&xfj='+c
          })
        }
      })
    },

     // 
  // 获得修复剂
  getXiuFuJi(data){
    return new Promise((resolve, reject) => {
      app.fl()
      app.fg({
        action:'GetPayParam',
        appid:app.globalData.appId,
        openId:app.globalData.GetMembersInfo.openId,
        orderid:data.order.OrderId,
        PaymentType:data.payMode.mode==1?'alipay':'wx',
        RestorerPay:1,
      }).then(s=>{
        app.fh()
        if(s.data.Status=="NO") app.fa(s.data.Message)
        var x=s.data.Data
        if(data.payMode.mode==1){
          resolve(s.data.Message)
          return
        }
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











  },
  

 
 
})