const { Toast } = require('../../utils/util.js')
const GoodService = require('../../services/good')
const app = getApp()

Page({
  data: {
    hasUserInfo: true,
    orders: []
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: '购物车' })
    if (!app.globalData.userInfo) {
      return this.setData({
        hasUserInfo: false
      }, () => {
        Toast.warning('请先登录')
      })
    }
    else if (options) {
      GoodService.getCartGoods({
        openid: 1,
        // userId: 1,
        pageSize: 1,
        pageNum: 20
      })
      .then(data => {
        this.setData({
          hasUserInfo: true,
          orders: data
        })
      })
      .catch(err => {
        Toast.error(err.toString())
      })
    }
  },

  bindDetailTap: function (e) {
    const gId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../detail/detail?id=${gId}`
    })
  },
  onShow: function() {
    this.onLoad({
      openid: 1,
      // userId: 1,
      pageSize: 1,
      pageNum: 20
    })
  }
})
