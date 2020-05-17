// var url = 'wss://m.hmeshop.cn'; //服务器地址
// console.log(getApp().globalData.userInfo)

function connect(roomInfo, OpenId, func) {
  var groupId = roomInfo.GroupId
  wx.connectSocket({
    url: 'ws' + getApp().getAllUrl + '/CommunicationCircle/GroupChat.ashx?groupId=' + groupId + '&openId=' + OpenId,
    header: {
      'content-type': 'application/json'
    },
    success: function() {
      console.log('连接成功')
    },
    fail: function() {
      console.log('连接失败')
    }
  })
  wx.onSocketOpen(function(res) {
    console.log('WebSocket 连接打开')
    wx.showToast({
      title: 'WebSocket连接打开',
      icon: "none",
      duration: 2000
    })
    //接受服务器消息
    wx.onSocketMessage(func); //func回调可以拿到服务器返回的数据
  });
  wx.onSocketError(function(res) {
    wx.showToast({
      title: 'WebSocket连接错误，请检查',
      icon: "none",
      duration: 2000
    })
  })
  wx.onSocketClose(function(res) {
    if (res.code == 1000 || res.reason == 'normal closure') {
      console.log('正常关闭')
    } else {
      console.log('连接关闭', res)
      wx.showToast({
        title: res.reason,
        icon:'none'
      })
      // wx.showLoading({
      //   title: '连接中',
      // })
      // setTimeout(function() {
      //   wx.hideLoading()
      //   wx.showModal({
      //     title: '提示',
      //     content: '网络超时，请重新连接',
      //     success(res) {
      //       if (res.confirm) {
      //         wx.connectSocket({
      //           url: 'ws' + getApp().getAllUrl + '/CommunicationCircle/GroupChat.ashx?groupId=' + groupId + '&openId=' + OpenId,
      //           header: {
      //             'content-type': 'application/json'
      //           }
      //         })
      //       } else if (res.cancel) {
      //         wx.redirectTo({
      //           url: '/pages/livePage/livePage',
      //         })
      //       }
      //     }
      //   })
      // }, 5000)
    }
  })
}

//发送消息
function send(msg) {
  wx.sendSocketMessage({
    data: msg,
    fail: function() {
      wx.showToast({
        title: '连接失败，请重连',
        icon: "none",
        duration: 1500,
        mask: true
      })
      // setTimeout(function() {
      //   wx.hideLoading()
      //   wx.switchTab({
      //     url: '/pages/index/index',
      //   })
      // }, 1500)
    }
  });
  if (JSON.parse(msg).type != 'input') {
    wx.showToast({
      title: '正在发送',
      icon: 'loading',
      mask: true,
      duration: 1500,
      success: function() {
        setTimeout(function() {
          wx.hideLoading()
        }, 5000)
      }
    })
  }
  // console.log(JSON.parse(msg))
}

module.exports = {
  connect: connect,
  send: send
}