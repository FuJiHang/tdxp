require("../../utils/config.js"), getApp();

const app=getApp()
Page({
    data: {
        sss:222,
        imgUrl:app.imgUrl
    },
    onLoad: function(n) {},
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    viewTap: function() {
        this.setData({
            text: "Set some data for updating view."
        });
    },
    customData: {
        hi: "MINA"
    }
});