// const app=getApp()
// Page({

//   /**
//    * 页面的初始数据
//    */
//   data: {
//     imgUrl:app.imgUrl,
//     userName:{
//       name:'',
//       img:"",
//     },
//     functionL:[
//       {
//         name:'发表动态',
//         img:'grkjxq.png',
//         url:'/fuPackageA/fuRelease/fuRelease'
//       },
//       // {
//       //   name:'我的足迹',
//       //   img:'',
//       // },
//       {
//         name:'我的收藏',
//         img:'grkjxx.png',
//         url:'/fuPackageA/fuMyCollect/fuMyCollect'
//       },
//     ],
//     myImg:{
//       data:[],
//       num:0,
//     },
//     myVideo:{
//       data:[],
//       num:0,
//     },
//     dataInfo:[],
//     finsh:false,
//     page:1,
//     UserId:'',
//   },

//   /**
//    * 生命周期函数--监听页面加载
//    */
//   onLoad: function (options) {
//     let that=this
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
//             that.setData({
//               ['userName.name']:dataR.NickName,
//               ['userName.img']:dataR.Picture
//             })
//             if(options.data){
//               let userFu=JSON.parse(decodeURIComponent(options.data))
//               that.setData({
//                 ['userName.name']:userFu.NickName,
//                 ['userName.img']:userFu.Picture,
//                 UserId:userFu.UserId
//               })
//             }
//             that.getData()
//             that.getImgList()
//             that.getVideoList()
            
           
//           } else {
//             wx.redirectTo({
//               url: "/pages/login/login"
//             });
//           }
//         })
//       })
//     }else {
//       that.setData({
//         ['userName.name']:app.globalData.GetMembersInfo.NickName,
//         ['userName.img']:app.globalData.GetMembersInfo.Picture
//       })
//       if(options.data){
//         let userFu=JSON.parse(decodeURIComponent(options.data))
//         that.setData({
//           ['userName.name']:userFu.NickName,
//           ['userName.img']:userFu.Picture,
//           UserId:userFu.UserId
//         })
//       }
//       that.getData()
//       that.getImgList()
//       that.getVideoList()
      
//     } 

 
   
//   },

//   getData(){
//     let data=this.data,that=this
//     if(data.finsh) return
//     app.fl()
//     app.fg({
//       action:'LoadAttention',
//       // openId:"oGsqu4qBG6Icub2iLYzI3MJGH4iQ",
//        openId:app.globalData.GetMembersInfo.openId,
//       pageIndex:data.page,
//       pageSize:10,
//       IsMyArticle:true,
//       UserId:data.UserId,
//     }).then(r=>{
//       app.fh() 
//       if(r.data.Status=='OK'){
//         let datar=r.data.Data
//         for(let i=0;i<datar.length;i++){
//           if(datar[i].ImageUrls.indexOf('.mp4')!=-1) datar[i].isVideo=true
//           datar[i].timef= datar[i].CreateDate.slice(11,16)
//           datar[i].CreateDate= datar[i].CreateDate.slice(5,10)
//           data.dataInfo.push(datar[i])
//         }
        
//         this.setData({
//           finsh:datar.length<10?true:false,
//           page:++data.page,
//           dataInfo:data.dataInfo,
//         })
//       }else app.fa(r.data.Message)
//     })
//   },


//   getImgList(){
//     let data=this.data,that=this
//     app.fl()
//     app.fg({
//       action:'LoadAttention',
//       // openId:"oGsqu4qBG6Icub2iLYzI3MJGH4iQ",
//        openId:app.globalData.GetMembersInfo.openId,
//       // pageIndex:data.followList.page,
//       pageIndex:1,
//       pageSize:10,
//       IsMyArticle:true,
//       Type:0,
//       UserId:data.UserId,
//     }).then(r=>{
//       app.fh() 
//       if(r.data.Status=='OK'){
//         r.data.Data.forEach(c=>{
//           c.ImageUrlsArr.forEach(j=>{
//             data.myImg.data.push(j)
//           })
//         })
//         data.myImg.num=r.data.Total
//         that.setData({
//           myImg:data.myImg
//         })
//       }else app.fa(r.data.Message)
//     })
//   },

//   getVideoList(){
//     let data=this.data,that=this
//     app.fl()
//     app.fg({
//       action:'LoadAttention',
//       // openId:"oGsqu4qBG6Icub2iLYzI3MJGH4iQ",
//        openId:app.globalData.GetMembersInfo.openId,
//       // pageIndex:data.followList.page,
//       pageIndex:1,
//       pageSize:10,
//       IsMyArticle:true,
//       Type:1,
//       UserId:data.UserId,
//     }).then(r=>{
//       app.fh() 
     
//       if(r.data.Status=='OK'){
//         r.data.Data.forEach(c=>{
        
//             data.myVideo.data.push(c.ImageUrls)

//         })
//         data.myVideo.num=r.data.Total
//         that.setData({
//           myVideo:data.myVideo
//         })
//       }else app.fa(r.data.Message)
//     })
//   },

//   toFN(e){
    
//     wx.navigateTo({
//       url:'/fuPackageA/fuAlbum/fuAlbum?type='+e.currentTarget.dataset.ty+"&UserId="+this.data.UserId
//     })
//   },
//   toXC(){
//     wx.navigateTo({
//       url:'/fuPackageA/fuRelease/fuRelease'
//     })
//   },
//   toFUN(e){
//     wx.navigateTo({
//       url:e.currentTarget.dataset.url
//     })
    
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
//     this.getData()
//   },

//   /**
//    * 用户点击右上角分享
//    */
//   onShareAppMessage: function () {

//   }
// })