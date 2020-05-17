// const app=getApp()
// Page({

//   /**
//    * 页面的初始数据
//    */
//   data: {
//     imgUrl:app.imgUrl,//
//     background: [],
//     video:false,//视频
//     imgheights:[],//所有图片高度
//     current: 0,    //默认  
//     project:{},//详情
//     name:'',
//     storeDet:'',
//     LatiLongitude:{}
//   },
//   /**
//    * 生命周期函数--监听页面加载
//    */
//   ff(){
//     app.ff()
//   },
//   onLoad: function (options) {
//     let that=this
//     wx.getStorage({
//       key: 'LatiLongitude',
//       success (res) {
//         that.setData({
//           LatiLongitude:res.data
//         })
      
//       } 
//     })
//     if(options.sid){
//       setTimeout(()=>{
//         getStoreData(sid)
//       },500)
//     }else{
//       this.setData({
//         name:decodeURIComponent(options.StoreName),
//         storeDet:JSON.parse(decodeURIComponent(options.storeDet))
//       })
//     }
//     this.getData(options.id)
//   },
  

//   // 获取门店信息
//   getStoreData(id){
//     let data=this.data,that=this
//     app.fl()
//     app.fg({
//       // action: 'GetStoreDetail',
//       // storeid: 600,
//       // Latitude: 23.12901,
//       // Longitude: 113.2668,
//       action:'GetStoreDetail',
//       storeid:id,
//       Latitude:data.LatiLongitude.Latitude,
//       Longitude:data.LatiLongitude.Longitude,
//       openId:app.globalData.GetMembersInfo.openId,
//     }).then(r=>{
//       app.fh()
//       if(r.data.Status=="OK"){
//         let rf=r.data
//         let bg=rf.EnvironmentImages.split(',')
//         rf.yysj=rf.OpenStartDate.split(' ')[1].slice(0,5)+'~'+rf.OpenEndDate.split(' ')[1].slice(0,5)        
//         rf.Appraises.forEach(c=>{
//           c.Pictures=c.Pictures.split(',')
//           c.AddDate=c.AddDate.slice(5,7)+'月'+c.AddDate.slice(8,10)+'日'
//           c.all=false
//         })
//         rf.FightGroups.forEach(c=>{
//           c.ProductPicture=c.ProductPicture.split(",")[0]
//         })
//         that.setData({
//           storeDet:rf,
//           name:rf.StoreName
//         })
//       }else app.fa(r.data.Message)
//     })
//   },

//   // 
//   toBayPT(e){
    
//     let data=this.data,a=e.currentTarget.dataset
//     if(data.project.IsHasFightGroup!='True') return
//     wx.navigateTo({
//       url:'/fuPackageA/fuCollageDet/fuCollageDet?sid='+data.storeDet.StoreId+'&type='+a.type+'&id='+a.id
//     })

//   },


//   getData(id){
//     let data=this.data,that=this
//     app.fl()
//     app.fg({
//       action:'GetProgramDetail_new',
//       productId:id,
//       StoreId:data.storeDet.StoreId,
//     }).then(r=>{
//       app.fh()
//       if(r.data.Status=="OK"){
//         let datar=r.data
//         let bg=datar.Images.split(',')
//         if(datar.Video){
//           data.background.push(datar.Video)
//           data.video=true
//         } 
//         bg.forEach((c,i)=>{
//           if(i!=bg.length-1) data.background.push(c) 
//         })
//         datar.FightGroups.forEach(c=>{
//           console.log(c)
//           c.ProductPicture=c.ProductPicture.split(',')[0]
//         })
//         that.setData({
//           background:data.background,
//           video:data.video,
//           project:datar
//         })

//       }else app.fa(r.data.Message)
//     })

   
//   },
//   qiehuan(){
//     let pasreAll=this.data.pasreAll
//     this.setData({
//       pasreAll:pasreAll?false:true
//     })
//   },

//   // 

//   // 
//   toBayAll(e){
//     let data=this.data,that=this
//     app.getOpenId(function(a) {
//       app.fg({
//         action: 'GetMembersInfo',
//         openId: a
//       }).then(r => {
//         if (r.data.Status == "OK") {
//           let dataR = r.data.Data
//           dataR.openId = a
//           that.setData({
//             GetMembersInfo: dataR
//           })
//           let cartList=[{
//             Deposit:data.project.Deposit,
//             Pic:data.project.ProgramLogo,
//             ProductName:data.project.Name,
//             SalePrice:data.project.Price,
//             ShortDescription:data.project.Description,
//             ProductId:data.project.Id,
      
//           }]

//           let storeData={
//             StoreId:data.storeDet.StoreId,
//             EnvironmentImages:data.storeDet.EnvironmentImages.split(',')[0],
//             StoreName:data.storeDet.StoreName,
//             Distance:data.storeDet.Distance,
//             Address:data.storeDet.Address,
//           }
//           wx.navigateTo({
//             url: "/pages/fujihang/fuPlace/fuPlace?storeData="+encodeURIComponent(JSON.stringify(storeData))+"&cartList="+encodeURIComponent(JSON.stringify(cartList))+'&pasreAll='+(e.currentTarget.dataset.all?true:false)
//           })
//         } else {
//           wx.redirectTo({
//             url: "/pages/login/login"
//           });
//         }
//       })
//     })
   
//     // this.setData({
//     //   pasreAll:true,
//     // })
//     // this.toBay()



//   },
//   toBayMin(){
//     // this.setData({
//     //   pasreAll:false,
//     // })
//     this.toBay()
//   },
//   // 去购买
//   toBay(a){
//     let tdata=this.data
//     let that=this
//     let storeData={}
//     if(tdata.storeList.length==0) return app.fa("附件无门店，不能购买！")
//     for(let i=0;i<tdata.storeList.length;i++){
//       if(tdata.storeList[i].isChoose){
//         storeData=tdata.storeList[i]
//         break;
//       }
//     }
//     if(!storeData.StoreId) return app.fa("请选择门店!")

//     if(app.globalData.GetMembersInfo==null){
//       app.getWxUserInfo(function(f) {
//         wx.request({
//           url: app.getUrl("QuickLogin"),//
//           data: {
//             openId: f.openId,//微信返回的用户id
//             nickName: f.nikeName,
//             unionId: f.unionId,
//             headImage: f.headImage,
//             encryptedData: f.encryptedData,
//             session_key: f.session_key,
//             iv: f.iv,
//             referralUserId:tdata.fOpenId,//上级id
//             Latitude: that.data.LatiLongitude.Latitude,
//             Longitude: that.data.LatiLongitude.Longitude,
//             unionid: app.globalData.unionid
//           },
//           success: function(a) {
//             void 0 == a.data.error_response ?(
//             app.fg({
//               action:'GetMembersInfo',
//               openId:f.openId
//             }).then(r=>{
//               if(r.data.Status=="OK"){
//                 let dataR=r.data.Data
//                 dataR.openId=f.openId
//                 app.setMembersInfo(dataR)
//                 that.isCanBuy()
//               }else app.fa("获取个人信息失败！")
//             })
//             ): hishop.showTip(a.data.error_response.sub_msg);
//           }
//         });
        
//       });
//     }else that.isCanBuy()
// },
//   // 校验是否满足
//   isCanBuy(){
//     let data=this.data
//     let storeData={}
//     if(data.storeList.length==0) return app.fa("您当前位置没有门店可做该项目！")
//     for(let i=0;i<data.storeList.length;i++){
//       if(data.storeList[i].isChoose){
//         storeData=data.storeList[i]
//         break;
//       }
//     }
//     if(!storeData.StoreId) return app.fa("请选择门店!")
//     let cartList=[{
//       Deposit:data.Deposit,
//       Pic:data.ProgramLogo,
//       ProductName:data.Name,
//       SalePrice:data.Price,
//       ShortDescription:data.Description,
//       ProductId:data.Id,

//     }]
    
//     wx.navigateTo({
//       url: "/pages/fujihang/fuPlace/fuPlace?storeData="+encodeURIComponent(JSON.stringify(storeData))+"&cartList="+encodeURIComponent(JSON.stringify(cartList))+'&pasreAll='+data.pasreAll
//     });
//   },

//   // 轮播图变化
//   imageLoad: function (e) {//获取图片真实宽度  
//     var imgwidth = e.detail.width,
//       imgheight = e.detail.height,
//       //宽高比  
//       ratio = imgwidth / imgheight;
//     //计算的高度值  
//     var viewHeight = 750 / ratio;
//     var imgheight = viewHeight;
//     var imgheights = this.data.imgheights;
//     //把每一张图片的对应的高度记录到数组里  
//     imgheights[e.target.dataset.id] = imgheight;
//     this.setData({
//       imgheights: imgheights
//     })
//   },

//   bindchangeImg: function (e) {
//     let imgheights=this.data.imgheights
//     this.setData({ current: e.detail.current })
//     if(e.detail.current==0&&this.data.video){
//       imgheights[0]=(wx.getSystemInfoSync().windowWidth)*4/3
//       this.setData({
//         imgheights:imgheights
//       })
//     }
//   },

//   // 跳去门店
//   toStoreFN(e){
//     let data=this.data
//     let index=e.currentTarget.dataset.index
//     wx.navigateTo({
//       // url: "/pages/storeDetail/storeDetail?storeid=" +data.storeList[index].StoreId
//       url: "/pages/fujihang/fuStoreDet/fuStoreDet?id="+data.storeList[index].StoreId
//     });
//   },
//   toFFN(e){
//     wx.navigateTo({
//       url: e.currentTarget.dataset.to
//     });
//   },

//   /**
//    * 生命周期函数--监听页面初次渲染完成
//    */
//   onReady: function () {

//   },

//   /**
//    * 生命周期函数--监听页面显示
//    */
//   onShow: function () {
//     let that = this
//     if(!app.globalData.GetMembersInfo||!app.globalData.GetMembersInfo.openId){
//       app.getOpenId(function(a) {
//         app.fg({
//           action: 'GetMembersInfo',
//           openId: a
//         }).then(r => {
//           if (r.data.Status == "OK") {
//             let dataR = r.data.Data
//             dataR.openId = a
//             app.setMembersInfo(dataR)
//           } else {
//             wx.redirectTo({
//               url: "/pages/login/login"
//             });
//           }
//         })
//       })
//     }
//   },

//   /**
//    * 生命周期函数--监听页面隐藏
//    */
//   onHide: function () {

//   },

//   /**
//    * 生命周期函数--监听页面卸载
//    */
//   onUnload: function () {

//   },

//   /**
//    * 页面相关事件处理函数--监听用户下拉动作
//    */
//   onPullDownRefresh: function () {

//   },

//   /**
//    * 页面上拉触底事件的处理函数
//    */
//   onReachBottom: function () {

//   },

//   /**
//    * 用户点击右上角分享
//    */
//   onShareAppMessage: function () {
//     let data=this.data
//     return{

//   　　　　title: data.name+' 项目：'+data.project.Name,        // 默认是小程序的名称(可以写slogan等)
//   　　　　path: "/pages/fujihang/fuProduct/fuProduct?StoreName="+encodeURIComponent(data.name)+"&storeDet="+encodeURIComponent(JSON.stringify(data.storeDet))
//           +"&id="+data.project.Id,        // 默认是当前页面，必须是以‘/’开头的完整路径
//   　　　　
//     }
//   }
// })