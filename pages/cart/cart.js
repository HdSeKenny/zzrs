const { Toast } = require('../../utils/util.js')
const GoodService = require('../../services/good')
const app = getApp()

Page({
  data: {
    hasUserInfo: true,
    orders: [],
    firstRender: true,
    spinShow: true
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: '我的围观' })
    if (!app.globalData.userInfo) {
      return this.setData({
        hasUserInfo: false,
        firstRender: false,
        spinShow: false
      }, () => {
        Toast.warning('请先登录')
      })
    }
    else if (options) {
      GoodService.getCartGoods({
        pageSize: 20,
        pageNum: 1
      })
      .then(data => {
        const orders = data.records.map((record) => {
          const begin = new Date(record.beginTime).getTime()
          const now = new Date().getTime()
          const isGrabbing = now > begin
          record.isStopped = record.goodOnlookStatus === 2
          record.statusText = (isGrabbing && !record.isStopped) ? '正在开抢' : (record.isStopped ? '抢购结束' : '')
          record.statusClasses = `tag-btn ${record.statusText === '抢购结束' ? 'stopped' : ''}`
          return record
        })
        this.setData({
          hasUserInfo: true,
          firstRender: false,
          orders
        }, () => {
          this.setData({spinShow: false})
        })
      })
      .catch(err => {
        Toast.error(err.toString())
      })
    }
  },

  bindDetailTap: function (e) {
    const item = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../detail/detail?id=${item.id}&skuid=${item.skuid}`
    })
  },

  onShow: function() {
    if (!this.data.firstRender) {
      this.onLoad({
        pageSize: 20,
        pageNum: 1
      })
    }
  },
  onHide() {
    Toast.hide()
  }
})
