Page({

  /**
   * 页面的初始数据
   */
  data: {
    startX: 0,
    endX: 0,
    iCenter: 3,
    datas: [{
      id: 1,
      zIndex: 2,
      opacity: 0.2,
      left: 40,
      iamge: "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1845400277,2638003513&fm=26&gp=0.jpg",
      animation: null
    },
    {
      id: 2,
      zIndex: 4,
      opacity: 0.4,
      left: 80,
      iamge: "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3966869538,2225441697&fm=26&gp=0.jpg",
      animation: null
    },
    {
      id: 3,
      zIndex: 6,
      opacity: 0.6,
      left: 120,
      iamge: "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1517782704,2320025119&fm=26&gp=0.jpg",
      animation: null
    },
    {
      id: 4,
      zIndex: 8,
      opacity: 1,
      left: 160,
      iamge: "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1471398266,568801884&fm=26&gp=0.jpg",
      animation: null
    },
    {
      id: 5,
      zIndex: 6,
      opacity: 0.6,
      left: 200,
      iamge: "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=255173728,1824510235&fm=15&gp=0.jpg",
      animation: null
    },
    {
      id: 6,
      zIndex: 4,
      opacity: 0.4,
      left: 240,
      iamge: "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2643824650,4235424612&fm=111&gp=0.jpg",
      animation: null
    },
    {
      id: 7,
      zIndex: 2,
      opacity: 0.2,
      left: 280,
      iamge: "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1472344083,3111074307&fm=111&gp=0.jpg",
      animation: null
    },
    ],
    order: [],
    photoTempath:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.__set__();
    this.move();
    this.getBD();///
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  //获取本地图片
  getBD(){
    var that = this;
    wx.downloadFile({
      url: 'https://tdh.hmeshop.cn/Storage/master/QRCode/StoreQRCode_50.png',
      success: function (res) {
        console.log('图片：' + res.tempFilePath);
        that.setData({
          photoTempath: res.tempFilePath
        })
        this.drawImage(res.tempFilePath)
      }
    })
  },
  
  drawImage(one) {
    //绘制canvas图片
    var that = this;
    console.log(that.data.userInfo);
    var qrPath = that.data.qrcode_temp; //小程序码本地路径
    var imgLogo = one; //微信头像本地路径
    // var imgLogo = that.data.photoTempath; //微信头像本地路径
    var banner = that.data.banner_temp; //展会bannertu的本地路径
    var bgimg = "/images/bg4@2x.png"; //背景图

    //创建一个canvas对象
    const ctx = wx.createCanvasContext('shareBox', this);

    ctx.setFillStyle("white");
    var canvasWidth = that.data.width; //自适应宽
    var canvasHeight = that.data.height - that.data.footHeight;  //自适应高 (减去底部高度)

    console.log(canvasWidth + "--" + canvasHeight)
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(bgimg, 10, 10, canvasWidth - 20, canvasHeight - 20);

    //绘制分享标题

    ctx.setFontSize(15);
    ctx.setFillStyle('#000');
    ctx.setTextAlign('left');
    ctx.fillText(that.data.userInfo.nickName + "邀请您一起参加", 110, 50, canvasWidth - 135);
    var title = that.data.exhibitionDetail.ExName;
    if (title.length > 17) {
      var a = title.substr(0, 17);
      var b = title.substr(17, title.length);
      ctx.fillText(a, 110, 70, canvasWidth - 135);
      ctx.fillText(b, 110, 90, canvasWidth - 135);
    } else {
      ctx.fillText(title, 110, 70, canvasWidth - 135);
    }


    //绘制标题
    ctx.setFontSize(15);
    ctx.setTextAlign('left');
    ctx.setFillStyle('#000');
    ctx.fillText(title, 30, 250, canvasWidth - 60);
    ctx.fillText(title, 30, 250, canvasWidth - 60);

    //绘制时间
    ctx.setFontSize(12);
    ctx.setTextAlign('left');
    ctx.setFillStyle('#333');
    var time = that.data.exhibitionDetail.StartTime + "至" + that.data.exhibitionDetail.EndTime;
    ctx.fillText(time, 30, 270, canvasWidth - 60);

    //绘制地点
    ctx.setFontSize(12);
    ctx.setTextAlign('left');
    ctx.setFillStyle('#333');
    var place = that.data.exhibitionDetail.Place;
    ctx.fillText(place, 30, 290, canvasWidth - 60);

    //绘制圆形头像
    ctx.save();
    ctx.beginPath();
    ctx.arc(65, 65, 35, 0, 2 * Math.PI, false);
    ctx.setStrokeStyle('#eee')
    ctx.stroke(); //画了背景的话要先画圆在裁剪才能有圆形图片
    ctx.clip(); //裁剪
    ctx.drawImage(imgLogo, 30, 30, 70, 70);
    ctx.restore();


    //绘制banner图
    // ctx.drawImage(banner, 15, 120, 150, 315);

    //绘制小程序码图
    //ctx.drawImage(banner, 70, 310, 100, 100);

    ctx.draw();

  },

  


  ////-------------------------------------------------
  move: function () {
    var datas = this.data.datas;
    /*图片分布*/
    for (var i = 0; i < datas.length; i++) {
      var data = datas[i];
      var animation = wx.createAnimation({
        duration: 200
      });
      animation.translateX(data.left).step();
      this.setData({
        ["datas[" + i + "].animation"]: animation.export(),
        ["datas[" + i + "].zIndex"]: data.zIndex,
        ["datas[" + i + "].opacity"]: data.opacity,
      })
    }
  },
  /**左箭头 */
  left: function () {
    //
    var last = this.data.datas.pop(); //获取数组的最后一个
    this.data.datas.unshift(last);//放到数组的第一个
    var orderFirst = this.data.order.shift();
    this.data.order.push(orderFirst);
    this.move();
  },
  /** */
  right: function () {
    var first = this.data.datas.shift(); //获取数组的第一个
    this.data.datas.push(first);//放到数组的最后一个位置
    var orderLast = this.data.order.pop();
    this.data.order.unshift(orderLast);
    this.move();
  },
  /**点击某项 */
  choose: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var order = that.data.order;
    var index = 0;
    for (var i = 0; i < order.length; i++) {
      if (id == order[i]) {
        index = i;
        break;
      }
    }
    if (index < that.data.iCenter) {
      for (var i = 0; i < that.data.iCenter - index; i++) {
        this.data.datas.push(this.data.datas.shift()); //获取第一个放到最后一个
        this.data.order.unshift(this.data.order.pop());
        // this.right()  
      }
    } else if (index > that.data.iCenter) {
      for (var i = 0; i < index - that.data.iCenter; i++) {
        this.data.datas.unshift(this.data.datas.pop()); //获取最后一个放到第一个
        this.data.order.push(this.data.order.shift());
        // this.left();
      }
    }
    this.move();
  },
  /**新的排列复制到新的数组中 */
  __set__: function () {
    var that = this;
    var order = that.data.order;
    var datas = that.data.datas;
    for (var i = 0; i < datas.length; i++) {
      that.setData({
        ["order[" + i + "]"]: datas[i].id
      })
    }
  },
  //手指触发开始移动
  moveStart: function (e) {
    console.log(e);
    var startX = e.changedTouches[0].pageX;
    this.setData({
      startX: startX
    });
  },
  //手指触摸后移动完成触发事件
  moveItem: function (e) {
    console.log(e);
    var that = this;
    var endX = e.changedTouches[0].pageX;
    this.setData({
      endX: endX
    });
    //计算手指触摸偏移剧距离
    var moveX = this.data.startX - this.data.endX;
    //向左移动
    if (moveX > 20) {
      this.left();
    }
    if (moveX < -20) {
      this.right();
    }
  },
})
