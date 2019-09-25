const UserService = require('../../services/user')
const app = getApp()

Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showAuth: false
  },
  onLoad: function () {
    wx.setNavigationBarTitle({ title: '查看授权' })
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: (res) => {
              app.globalData.userInfo = res.userInfo
              this.queryUsreInfo(res)
            }
          })
        }
        else {
          this.setData({showAuth: true})
        }
      }
    })
  },
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      this.queryUsreInfo(e.detail)
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },

  //获取用户信息接口
  queryUsreInfo: function (res) {
    UserService.getUserInfo(res).then((data) => {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.globalData.userInfo = data
      wx.setStorageSync('open_params', {
        openId: data.openId,
        unionId: data.unionId
      })

      wx.switchTab({
        url: '/pages/home/home'
      })
    })
  }

})