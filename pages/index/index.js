const GoodService = require('../../services/good')
const BannerService = require('../../services/banner')

const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    goods: [],
    sliders: [],

    // sliders configs
    indicatorDots: false,
    autoplay: true,
    interval: 3000,
    duration: 1000,

    showAuthModal: false,
    firstRender: true,
    spinShow: true
  },

  fetchData: function () {
    const goodsParams = {
      pageNum: 1,
      pageSize: 20,
      status: 1
    }

    Promise.all([
      BannerService.getHomeSliders(),
      GoodService.getGoodsList(goodsParams)
    ])
      .then((data) => {
        const sliders = data[0]
        const goods = data[1] ? data[1].records : []
        goods.forEach((g, idx) => {
          const beginTime = g.beginTime.replace(/-/g, '/')
          const beginTimeTamp = Date.parse(beginTime)
          const now = new Date().getTime()
          const tmp = beginTimeTamp - now
          g.isGrabbing = tmp <= 0
          g.classes = `item-block ${idx % 2 !== 0 ? 'right-one' : ''}`

          Object.keys(g).forEach(key => {
            if (key.includes('price') || key.includes('Price')) {
              const price = g[key]
              const intPrice = parseInt(price)
              const decimalPrice = intPrice.toFixed(2)
              g[key] = decimalPrice
            }
          })
        })
        this.setData({ goods, sliders, firstRender: false }, () => {
          this.setData({ spinShow: false })
          this.calculateCountDownTime(goods)
        })
      })
      .catch((err) => {
        console.log(err)
      })
  },

  bindDetailTap: function (e) {
    const item = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../detail/detail?id=${item.id}&skuid=${item.skuid}`
    })
  },
  bindGuideTap: function(e) {
    wx.navigateTo({
      url: `../guide/guide`
    })
  },

  onLoad: function () {
    wx.setNavigationBarTitle({ title: '首页' })
    this.fetchData()
  },

  calculateCountDownTime: function (goods) {
    const countInterval = setInterval(() => {
      goods.forEach((g) => {
        if (!g.isGrabbing) {
          const deadline = new Date(g.beginTime).getTime()
          const now = new Date().getTime()
          const tmp = deadline - now
          if (tmp > 0) {
            g.hours = Math.floor((tmp % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            g.minutes = Math.floor((tmp % (1000 * 60 * 60)) / (1000 * 60))
            g.seconds = Math.floor((tmp % (1000 * 60)) / 1000)
          }
          else {
            g.isGrabbing = true
          }
        }
      })

      const countedTimeGoods = goods.filter(g => !g.isGrabbing)
      if (countedTimeGoods.length) {
        this.setData({ goods })
      }
      else {
        clearInterval(countInterval)
      }
    }, 1000)
  },

  onShow: function () {
    if (!this.data.firstRender) {
      this.onLoad()
    }
  }
})
