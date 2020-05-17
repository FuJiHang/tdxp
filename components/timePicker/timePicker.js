// components/timePicker/timePicker.js
const date = new Date();
const days = [];
const hours = [];
const minutes = [];
for (let d = 1; d <= 31; d++) {
  days.push(d)
}
for (let h = 0; h <= 23; h++) {
  hours.push(h >= 10 ? h : ('0' + h))
}
for (let s = 0; s <= 59; s++) {
  minutes.push(s >= 10 ? s : ('0' + s));
}
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
      observer(newVal, oldVal, changedPath) {
        console.log('时间选择器显示show=', newVal)
        this.setData({
          show: newVal
        })
      }
    },

    startYear: {
      type: Number,
      value: 1989,
      observer(newVal, oldVal, changedPath) {
        var year = date.getFullYear()
        if (parseInt(newVal) > year) {
          console.error('起始时间不能大于当前时间')
          return
        }
        if ((/\./g).test(String(newVal))) {
          console.error('输入的年份不能为小数')
          return
        }
        if (String(newVal).length) {
          console.error('输入的年份有误')
          return
        }
      }
    },
    endYear: {
      type: Number,
      value: 2039,
      observer(newVal, oldVal, changedPath) {
        var year = date.getFullYear()
        if (parseInt(newVal) < year) {
          console.error('起始时间不能小于当前时间')
          return
        }
        if ((/\./g).test(String(newVal))) {
          console.error('输入的年份不能为小数')
          return
        }
        if (String(newVal).length) {
          console.error('输入的年份有误')
          return
        }
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    years: [],
    months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    days,
    hours,
    minutes,
    value: [],
  },
  selectDate: '', //  当前选中时间

  /**
   * 组件的方法列表
   */
  methods: {
    // 初始化
    init() {
      let year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate(),
        hour = date.getHours(),
        minute = date.getMinutes();
      this.selectDate = year + "/" + month + "/" + day + " " + hour + ":" + minute;

      this.setData({
        years: this.getYears()
      }, () => {
        this.setData({
          days: this.getDays(year, month),
          value: [
            this.getYears().indexOf(year),
            this.data.months.indexOf(month),
            this.data.days.indexOf(day),
            this.data.hours.indexOf(hour),
            this.data.minutes.indexOf(minute),
          ]
        })
      })
    },

    getYears() {
      var year = date.getFullYear();
      var years = [];
      var temp = this.properties.endYear - this.properties.startYear;
      for (let i = 0; i < temp + 1; i++) {
        years.push(this.properties.startYear + i)
      }
      return years
    },

    getDays(year, month) {
      let flag = year % 400 == 0 || (year % 4 == 0 && year % 100 != 0);
      let array = [];
      switch (month) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
          array = days.slice(0)
          break;
        case 4:
        case 6:
        case 9:
        case 11:
          array = days.slice(0, 31)
          break;
        case 2:
          array = flag ? days.slice(0, 29) : days.slice(0, 28);
          break;
        default:
          array = '月份格式不正确，请重新输入！'
      }
      return array
    },

    // 禁止滑动
    stopMove() {},

    // picker的change事件处理函数
    bindChange(e) {
      // console.log(e.detail.value)
      let val = e.detail.value;
      this.selectDate = this.data.years[val[0]] + '/' + this.data.months[val[1]] + '/' + this.data.days[val[2]] + " " + this.data.hours[val[3]] + ":" + this.data.minutes[val[4]];
      this.setData({
        days: this.getDays(this.data.years[val[0]], this.data.months[val[1]])
      })
    },

    // 取消
    bindCancel() {
      this.setData({
        show: false
      })
    },

    // 确定
    bindSure() {
      this.triggerEvent('sure', {
        time: this.selectDate
      })
      this.setData({
        show: false
      })
    }
  },

  //组件生命周期函数
  lifetimes: {
    // 组件生命周期函数，在组件实例进入页面节点树时执行
    attached() {
      this.init()
    },
  }
})