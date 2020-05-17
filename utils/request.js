const app = getApp();

/**
 * 调用须知： 
 *  url: 请求的链接  必传值
 *  type： 请求类型  默认为POST 选传值
 *  data: 请求携带数据 默认值为{}  选传值  
 **/ 
function ajaxRequset(opt){
  return new Promise(function (resolve, reject) {
    wx.request({
      method: opt.type || 'GET',  // 默认请求类型为 GET
      url: app.data.url + opt.url,
      data: opt.data || {},
      header: {
        'content-type': opt.type == 'POST' ? 'application/x-www-form-urlencoded' : 'application/json', // 默认值
        Cookie: wx.getStorageSync('cookieFu') || app.data.cookie
      },
      success(res) { 
        console.log(res,11111111111888888888888)
        if (res.data.Status == 'Login' || res.data.IsBindUser) wx.navigateTo({ url: '/pages/login/login' })
        else resolve(res) 
        // resolve(res)
      },
      fail(err){ reject(err) }
    })
  })
}

module.exports = ajaxRequset;