const { Toast } = require('../../utils/util.js')
const UserService = require('../../services/user')
const app = getApp()

Page({
  data: {
    hasUserInfo: true,
    firstRender: true,
    messages: [],
    spinShow: true
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: '消息' })
    if (!app.globalData.userInfo) {
      return this.setData({
        hasUserInfo: false,
        firstRender: false,
        spinShow: false
      }, () => {
        Toast.warning('请先登录')
      })
    }
    else {
      UserService.findTransMessageByUserId({
        pageSize: 20,
        pageNum: 1
      })
      .then(data => {
        this.setData({
          hasUserInfo: true,
          firstRender: false,
          messages: data.records
        }, () => {
          this.setData({spinShow: false})
        })
      })
      .catch(err => {
        Toast.error(err.toString())
      })
    }
  },

  onShow: function () {
    if (!this.data.firstRender) {
      this.onLoad()
    }
  },
  onHide() {
    Toast.hide()
  }
})
