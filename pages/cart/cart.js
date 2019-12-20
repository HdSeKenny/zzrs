const { Toast } = require('../../utils/util.js')
const GoodService = require('../../services/good')
const app = getApp()

let cartInterval = null

Page({
  data: {
    hasUserInfo: true,
    orders: [],
    firstRender: true,
    spinShow: true,
    navData: {
      showCapsule: 1,
    },
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
          const beginTime = record.beginTime.replace(/-/g, '/')
          const begin = Date.parse(beginTime)
          const now = new Date().getTime()
          const isGrabbing = now >= begin

          record.isGrabbing = isGrabbing && record.goodOnlookStatus !== 2
          record.isStopped = record.goodOnlookStatus === 2
          record.statusText = record.isGrabbing ? '正在开抢' : (record.isStopped ? '抢购结束' : '')
          record.statusClasses = `tag-btn ${record.statusText === '抢购结束' ? 'stopped' : ''}`
          return record
        })
        const hasIntervalOrders = orders.filter(o => !o.isGrabbing && !o.statusText);
        if (!cartInterval && hasIntervalOrders.length) {
          cartInterval = setInterval(() => {
            orders.forEach((g) => {
              if (!g.isGrabbing) {
                const beginTime = g.beginTime.replace(/-/g, '/')
                const deadline = Date.parse(beginTime)
                const now = new Date().getTime()
                const tmp = deadline - now
                if (tmp > 0) {
                  g.hours = Math.floor((tmp % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
                  g.minutes = Math.floor((tmp % (1000 * 60 * 60)) / (1000 * 60))
                  g.seconds = Math.floor((tmp % (1000 * 60)) / 1000)
                }
                else {
                  g.isGrabbing = true
                  // console.log('开始抢购', g.goodname)
                }
              }
            })
    
            const countedTimeOrders = orders.filter(g => !g.isGrabbing)
            if (countedTimeOrders.length) {
              this.setData({ orders, firstRender: false }, () => {
                this.setData({ spinShow: false })
              })
            }
            else {
              // console.log('清空 interval')
              cartInterval = clearInterval(cartInterval)
              this.onLoad({
                pageSize: 20,
                pageNum: 1
              })
            }
          }, 1000)
        } else {
          this.setData({
            hasUserInfo: true,
            firstRender: false,
            orders
          }, () => {
            this.setData({ spinShow: false })
          })
        }
      })
      .catch(err => {
        Toast.error(err.toString())
      })
    }
  },

  bindDetailTap: function (e) {
    const item = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../detail/detail?id=${item.onlookid}&skuid=${item.skuid}&lookStatus=${item.status}&lookid=${item.id}`
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
    if (cartInterval) {
      cartInterval = clearInterval(cartInterval)
    }
  }
})
