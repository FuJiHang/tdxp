const app = getApp();
import { payOrder } from '../utils/requestApi';
function e(e) {
    return (e = e.toString())[1] ? e : "0" + e;
}

module.exports = {
    formatTime: function (n) {
        if (void 0 != n) {
            n = n.replace(/(\d{4})-(\d{2})-(\d{2})T(.*)?\.(.*)/, "$1/$2/$3 $4");
            var t = (n = new Date(n)).getFullYear(), o = n.getMonth() + 1, r = n.getDate(), i = n.getHours(), u = n.getMinutes(), a = n.getSeconds();
            return [t, o, r].map(e).join("-") + " " + [i, u, a].map(e).join(":");
        }
    },
    json2Form: function (e) {
        var n = [];
        for (var t in e) n.push(encodeURIComponent(t) + "=" + encodeURIComponent(e[t]));
        return n.join("&");
    },

    /**
  *  [ 倒计时函数 调用须知 ]: 
  *  @param {[array]} date [设定超时时间]  
  *  列如：  '2019-5-30 14:30:00' 
  * **/
    countdown: (date) => {
        let dateArr = '';
        date = date.toString()
        if (date.indexOf('T') != -1) dateArr = date.split('T');
        else dateArr = date.split(' ');
        let dateArr2 = dateArr[0].split('-').map((item) => {
            return parseInt(item)
        });
        dateArr2[1] -= 1;
        let dateArr3 = dateArr[1].split(':').map((item) => {
            return parseInt(item)
        });

        let now = new Date(); // 当前系统时间
        let to = new Date(...dateArr2, ...dateArr3); // 用户设定的时间
        let deltaTime = to - now; // 时间差 (单位/毫秒ms)
        
        let limitHours, limitMin, limitSecond;

        //超时
        if (deltaTime <= 0) {
            return {
                limitHours: '00',
                limitMin: '00',
                limitSecond: '00',
                overTime: true // 倒计时已过
            }
        }
        //计算天数后剩余的毫秒数
        let leave1 = deltaTime % (24 * 3600 * 1000);
      
        let day=Math.floor(deltaTime / (24 * 3600 * 1000))
        //计算出小时数
        let hours = Math.floor(leave1 / (3600 * 1000));
   
        hours+=day*24
        //计算小时数后剩余的毫秒数
        let leave2 = leave1 % (3600 * 1000);
        //计算相差分钟数
        let minutes = Math.floor(leave2 / (60 * 1000));

        //计算分钟数后剩余的毫秒数
        let leave3 = leave2 % (60 * 1000);
        //计算相差秒数
        let seconds = Math.round(leave3 / 1000);

        return {
            limitHours: hours < 10 ? '0' + hours : hours,
            limitMin: minutes < 10 ? '0' + minutes : minutes,
            limitSecond: seconds < 10 ? '0' + seconds : seconds,
            overTime: false
        }
    },




    // 支付订单
    toPay: function (id, callback, sid) {
        wx.showLoading({
            title: '加载中...',
        })
        console.log("输出支付门店sid", sid);
        payOrder({
            orderId: id || '',
            StoreId: sid || '',
            appid: app.globalData.appId,
            openId: app.globalData.GetMembersInfo.openId,
        }).then(res => {
            console.log("支付参数", res)
            if (res.data.Status == "Success") {
                wx.hideLoading();
                let {
                    prepayId,
                    nonceStr,
                    timeStamp,
                    sign
                } = res.data.Data;
                wx.requestPayment({
                    timeStamp: timeStamp,
                    // timeStamp: timeStamp.toString(),
                    nonceStr: nonceStr,
                    package: 'prepay_id=' + prepayId,
                    paySign: sign,
                    signType: 'MD5',
                    success(res) {
                        callback(res)
                    },
                    fail(res) {
                        wx.showToast({
                            title: '支付失败',
                            icon: 'none',
                            duration: 2000,
                            mask: true,
                            success: (result) => {
                                setTimeout(() => {
                                    wx.navigateBack({
                                        delta: 1
                                    });
                                    // wx.redirectTo({
                                    //   url: '/pages/orderDetail/orderDetail?orderId='+ id,
                                    // });

                                }, 1000);
                            },
                        });
                    }
                })
            } else {
                wx.hideLoading();
                wx.showModal({
                    title: res.data.Message,
                    // content: '',
                    showCancel: true,
                    cancelText: '取消',
                    cancelColor: '#000000',
                    confirmText: '确定',
                    confirmColor: '#3CC51F',
                    success: (result) => {
                        if (result.confirm) {

                        }
                    },
                    fail: () => {
                        wx.navigateBack({
                            delta: 1
                        });
                    },
                    complete: () => { }

                })
            }
        })
    },

    /**
     *  检查是否还有更多
     * @param {number} curPage 当前页码
     * @param {number} curSize 当前页数
     * @param {number} dataLen 当前数据长度
     * @param {number} dataTotal 当前数据总长度
     */
    checkMore(curPage, curSize, dataLen, dataTotal) {
        let hasMore = true;
        
        if (!dataLen || dataLen + (curPage - 1) * curSize >= +dataTotal) {
          hasMore = false;
        }
        return hasMore;
    },

    /**
     *
     * @param {string} str 需要判断是否是 JSON字符串的 字符串
     */
    isJSONStr(str) {
        if (typeof str == 'string') {
            try {
                const complete = JSON.parse(str);
                return complete;
            } catch(e) {
                return false;
            }
        }
    },
    
    /**
     *
     * @param {number} min 分钟格式化成小时 例如：60 -> 01:00
     */
    formatMinute(min) {
        const minute = min % 60;
        const hour = parseInt(min / 60);

        return String(hour).padStart(2, '0') + ':' + String(minute).padStart(2, '0');
    }
};