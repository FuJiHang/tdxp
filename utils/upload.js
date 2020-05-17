const app = getApp();

function uploadFile(files, options = {}) {
  if (!Array.isArray(files)) {
    return;
  }

  const { 
    spin = true, 
    title = '正在上传...' 
  } = options;

  spin && wx.showLoading({
    mask: true,
    title,
  });

  const promises = files.map(item => {
    return new Promise((resolve, reject) => {
      const userInfo = wx.getStorageSync('userinfo');

      wx.uploadFile({
        url: app.getUrl('UploadAppletImage'),
        filePath: item,
        name: 'file',
        formData: {
          openId: userInfo.openId,
          appid: app.globalData.appId,
        },
        success(res) {
          let data = JSON.parse(res.data);
          
          if (data.Status === "OK") {
            resolve(data.Data.map(item => item.ImageUrl));
          } else {
            reject(data);
          }

          wx.hideLoading();
        },
        fail(err) {
          wx.hideLoading();

          reject(err);
        },
      });
    })
  });

  return Promise.all(promises);
};

export default uploadFile;