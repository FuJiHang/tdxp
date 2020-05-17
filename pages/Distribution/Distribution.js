var e = getApp();

Page({
    data: {
        openId: "",
        headerbg: e.getRequestUrl + "/Templates/xcxshop/images/feixiao_header.png",
        DistributionInfo: ""
    },
    onLoad: function(t) {
        var n = this;
        e.getOpenId(function(t) {
            wx.request({
                url: e.getUrl("GetReferralInfo"),
                data: {
                    openId: t
                },
                success: function(t) {
                    e.globalData.ReferralInfo = t.data.referral_get_response, n.GetCheckData();
                }
            });
        });
    },
    RefferStore: function() {
        wx.navigateTo({
            url: "../RefferStore/RefferStore"
        });
    },
    bindstoreinfo: function() {
        wx.navigateTo({
            url: "../storeInfo/storeInfo"
        });
    },
    GetCheckData: function() {
        this.setData({
            DistributionInfo: e.globalData.ReferralInfo
        });
    },
    bindyongjin: function(e) {
        wx.navigateTo({
            url: "../Splittin/Splittin"
        });
    },
    bindxiaji: function(e) {
        wx.navigateTo({
            url: "../SubMembers/SubMembers"
        });
    }
});