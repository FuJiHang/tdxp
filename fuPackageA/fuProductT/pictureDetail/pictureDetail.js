var WxParse = require('../../../wxParse/wxParse');

const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    description: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl: app.imgUrl2,
    iconList:[
      { icon: 'icon_zhengpinbaozhang_w@2x.png', txt:'正品保障' },
      { icon: 'icon_zhengpinbaozhang_w@2x.png', txt: '买贵必赔' },
      { icon: 'icon_zhengpinbaozhang_w@2x.png', txt: '正品保障' },
      { icon: 'icon_shouhouwuyou_w@2x.png', txt: '售后无忧' },
    ],
    img:'',
  },

  ready: function () {
    WxParse.wxParse('article', 'html', this.data.description, this, 0);
    console.log("输出富文本",this.data);
    let { description } = this.data;
    description.replace(/\<img/gi, '<img style="width:100%;height:auto"');
    this.setData({
      img: description.replace(/\<img/gi, '<img style="width:100%;height:auto"')
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
