// pages/user-details/user-details.js
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    navData: {
      showCapsule: 1,
    },
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      // wx.getUserInfo({
      //   success: res => {
      //     app.globalData.userInfo = res.userInfo
      //     this.setData({
      //       userInfo: res.userInfo,
      //       hasUserInfo: true
      //     })
      //   }
      // })
    }
  },

  logOut: function() {
    app.globalData.userInfo = null
    this.setData({
      userInfo: {},
      hasUserInfo: false
    }, () => {
      const pages = getCurrentPages()
      const prevPage = pages[pages.length - 2]
      prevPage.setData({
        userInfo: {},
        hasUserInfo: false,
      })
      wx.navigateBack({ delta: 1 })
    })
  }
})