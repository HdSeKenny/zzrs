const UserService = require('./services/user')
//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        UserService.login({ code: res.code }).then((data) => {
          wx.setStorageSync('token', data.token);
          this.globalData.needGetInfo = data.needGetInfo;

          // 获取用户信息
          wx.getSetting({
            success: res => {
              if (res.authSetting['scope.userInfo']) {
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                this.wxGetUserInfo();
              }
              else {
                wx.switchTab({
                  url: '/pages/authorize/authorize'
                })
              }
            }
          })
        })



      },
      fail: (err) => {
        console.log(err)
      }
    })
  

  },

  wxGetUserInfo: function () {
    wx.getUserInfo({
      success: res => {
        this.globalData.userInfo = res
        // 可以将 res 发送给后台解码出 unionId
        if (this.globalData.needGetInfo) {
          this.getServerUserInfo(res)
        }
        else {
          wx.switchTab({
            url: '/pages/home/home'
          })
        }
      },
      fail: (err) => {
        console.log('error', err)
      }
    })
  },

  getServerUserInfo: function (res) {
    UserService.getUserInfo(res).then((data) => {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      wx.setStorageSync('open_params', {
        openId: data.openId,
        unionId: data.unionId
      })

      if (this.userInfoReadyCallback) {
        this.userInfoReadyCallback(res)
      }
      wx.switchTab({
        url: '/pages/home/home'
      })
    })
  },

  globalData: {
    userInfo: null,
    needGetInfo: true
  }
})
