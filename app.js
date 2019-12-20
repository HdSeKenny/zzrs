const UserService = require('./services/user')

App({
  onLaunch: function () {
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    wx.getSystemInfo({ // iphonex底部适配
      success: res => {
        this.globalData.headerBtnPosi = wx.getMenuButtonBoundingClientRect()
        this.globalData.systeminfo = res
        this.globalData.swiperHeight = (res.screenWidth * 375) / 800

        const bodyHeightPrecent = (res.windowHeight - this.globalData.swiperHeight) / res.windowHeight
        this.globalData.bodyHeightPrecent = (bodyHeightPrecent.toFixed(2)) * 100
      }
    })
  },

  // wxGetUserInfo: function () {
  //   wx.getUserInfo({
  //     success: res => {
  //       this.globalData.userInfo = res.userInfo
  //       if (this.userInfoReadyCallback) {
  //         this.userInfoReadyCallback(res)
  //       }
  //       // 可以将 res 发送给后台解码出 unionId
  //       if (this.globalData.needGetInfo) {
  //         this.getServerUserInfo(res)
  //       }
  //     },
  //     fail: (err) => {
  //       console.log('error', err)
  //     }
  //   })
  // },

  // getServerUserInfo: function (res) {
  //   UserService.getUserInfo(res).then((data) => {
  //     // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
  //     // 所以此处加入 callback 以防止这种情况
  //     wx.setStorageSync('open_params', {
  //       openId: data.openId,
  //       unionId: data.unionId
  //     })
  //   })
  // },

  // onHide: function () {
  //   if (wx.getStorageSync('token')) {
  //     wx.clearStorage()
  //   }
  // },

  globalData: {
    userInfo: null,
    needGetInfo: true,
    headerBtnPosi: {
      bottom: 82,
      height: 32,
      left: 278,
      right: 365,
      top: 50,
      width: 87,
    },
    systeminfo: {},
    swiperHeight: 0,
    bodyHeightPrecent: 0
  }
})
