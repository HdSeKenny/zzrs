const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: true,
    firstRender: true,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的'
    })

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        firstRender: false
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          firstRender: false
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
            firstRender: false
          })
        }
      })
    }
  },

  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  bindUserDetailsTap: function() {
    if (this.data.hasUserInfo) {
      wx.navigateTo({
        url: '../user-details/user-details'
      })
    }
    else {
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  
  onShow: function() {
    if (!this.data.firstRender) {
      this.onLoad()
    }
  },

  onShareAppMessage: function() {
    wx.showShareMenu({
      withShareTicket: true,
      success: function (shareTickets) {
        console.info(shareTickets + '成功');
        // 转发成功
      },
      fail: function (res) {
        console.log(res + '失败');
        // 转发失败
      },
      complete: function (res) {
        // 不管成功失败都会执行
        console.log('complete', res)
      }
    })
  }
})
