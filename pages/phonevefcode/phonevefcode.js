var e = require("../../utils/config.js"), o = getApp();

Page({
    data: {
        PhoneText: "重新发送",
        IsSend: !1
    },
    onLoad: function(e) {
        this.setData({
            UserName: o.globalData.userInfo.realName,
            VcodeUrl: o.getRequestUrl + "/VerifyCodeImage.aspx?openid=" + o.globalData.openId
        });
    },
    ChangeCode: function() {
        this.setData({
            VcodeUrl: o.getRequestUrl + "/VerifyCodeImage.aspx?openid=" + o.globalData.openId + "&&d=" + new Date()
        });
    },
    InputValue: function(e) {
        var o = e.currentTarget.dataset.key;
        this.data[o] = e.detail.value;
    },
    GetPhoneCode: function() {
        var a = this.data;
        a.PhoneCell && e.checkPhone(a.PhoneCell) ? !a.ImageCode || a.ImageCode.length <= 0 ? e.showTip("输入图形验证码", "tips") : wx.request({
            url: o.getUrl("SendVerifyCode"),
            data: {
                Phone: a.PhoneCell,
                imgCode: a.ImageCode,
                IsValidPhone: !0,
                OpenId: o.globalData.openId
            },
            success: function(o) {
                if (void 0 == o.data.error_response) if ("OK" == o.data.Status) {
                    e.showTip("验证码发送成功", "success");
                    var a = 60, n = setInterval(function() {
                        a > 0 ? (a--, that.setData({
                            PhoneText: a + "s后可重发",
                            IsSend: !0
                        })) : (that.setData({
                            PhoneText: "重新发送",
                            IsSend: !1
                        }), clearInterval(n));
                    }, 1e3);
                } else e.showTip(o.data.Message, "warning"); else e.showTip(o.data.error_response.sub_msg);
            }
        }) : e.showTip("手机号格式不对", "tips");
    },
    Savephone: function() {
        var a = this.data;
        e.checkPhone(a.PhoneCell) ? a.PhoneCode.length <= 0 ? e.showTip("输入手机验证码", "tips") : o.getOpenId(function(n) {
            wx.request({
                url: o.getUrl("BindPhone"),
                data: {
                    OpenId: n,
                    Phone: a.PhoneCell,
                    VerifyCode: a.PhoneCode
                },
                success: function(o) {
                    void 0 == o.data.error_response ? "OK" == o.data.Status ? wx.switchTab({
                        url: "../usehome/usehome"
                    }) : e.showTip(o.data.Message, "warning") : e.showTip(o.data.error_response.sub_msg);
                }
            });
        }) : e.showTip("手机号格式不对", "tips");
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});