const { Toast, keepDecimalSpaces } = require('../../utils/util.js')
const GoodService = require('../../services/good')
const app = getApp()

Page({
  data: {
    good: null,
    hasUserInfo: true,
    indicatorDots: false,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    firstRender: true,
    spinShow: true
  },
  methods: {
    keepPriceDecimal(value, num) {
      return keepDecimalSpaces(value, num)
    }
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: '详细' })
    if (options && Object.keys(options).length) {
      this.fetchData(options)
    }
  },
  handleCheckoutOriginalPrice: function(e) {
    const gId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../order/order?id=${gId}`
    })
  },

  handleCheckoutLookerPrice: function (e) {
    if (!app.globalData.userInfo) {
      return Toast.warning('请先登录')
    }
    const gId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../order/order?id=${gId}&isLooker=1`
    })
  },

  findGoodOnlook: function (options, detailGood){
    GoodService.findGoodOnlook(options)
      .then(data => {
        const newGood = Object.assign({}, detailGood, data)
        const deadline = new Date(newGood.beginTime).getTime()
        const now = new Date().getTime();
        const tmp = deadline - now;
        newGood.swiperImgs = detailGood.imagePath.split(',')

        // 如果状态不为1，中间显示抢购结束，如果getOrderno不为空，底部中间显示已购买，否则显示直接购买按钮
        // newGood.isGrabbing = newGood.status !== 2 && tmp <= 0

        // Object.keys(newGood).forEach((goodKey) => {
        //   let propertyValue = newGood[goodKey]
        //   // const isPrice = goodKey.includes('price') || goodKey.includes('Price')
        //   if (goodKey.includes('price') || goodKey.includes('Price')) {
        //     const a = propertyValue
        //     propertyValue = a.toFixed(2)
        //   }
        // });

        Object.keys(newGood).forEach(key => {
          const isTime = key.includes('Time') || key.includes('time')
          if ((key.includes('price') || key.includes('Price')) && !isTime) {
            const price = newGood[key]
            const intPrice = parseInt(price)
            const decimalPrice = intPrice.toFixed(2)
            newGood[key] = decimalPrice
          }
        })

        this.calculateCountDownTime(newGood)
      })
      .catch(err => {
        Toast.error(err.toString())
      })
  },

  calculateCountDownTime: function (good) {
    const { beginTime, lastCalcPriceTime, timespan, skuid, id, currentprice, downprice, minPrice, status } = good
    const _beginTime = beginTime.replace(/-/g, '/')
    const begin = Date.parse(_beginTime)

    const _lastCalcPriceTime = lastCalcPriceTime.replace(/-/g, '/')
    const lastCalcute = Date.parse(_lastCalcPriceTime)
    
    const now = new Date().getTime()
    const nextPrice = currentprice - downprice

    good.isGrabbing = now > begin && status !== 2
    good.nextPrice = nextPrice < minPrice ? minPrice : nextPrice
  
    if (good.isGrabbing) {
      const grabbingInterval = setInterval(() => {
        const current = new Date().getTime()
        const tmp = lastCalcute + timespan * 60000 - current
        if (tmp < 0) {
          clearInterval(grabbingInterval)
          this.fetchData({ skuid, id})
        }
        else {
          good.hours = Math.floor((tmp % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          good.minutes = Math.floor((tmp % (1000 * 60 * 60)) / (1000 * 60))
          good.seconds = Math.floor((tmp % (1000 * 60)) / 1000)
          this.setData({ good, firstRender: false }, () => {
            if (this.data.spinShow) {
              this.setData({spinShow: false})
            }
          })
        }
      }, 1000)
    }
    else {
      this.setData({ good, firstRender: false }, () => {
        this.setData({spinShow: false})
      })
    }
  },

  onShow: function() {
    if (!this.data.firstRender) {
      this.onLoad()
    }
  },

  fetchData(options) {
    GoodService.getGoodDetail({
      id: options.skuid
    })
    .then((data) => {
      this.findGoodOnlook({ id: options.id }, data)
    })
    .catch(err => {
      Toast.error(err.toString())
    })
  },

  bindDetailTap: function (e) {
    const details = this.data.good.detail.replace(/"/g, "'")
    wx.navigateTo({
      url: `../swiper-details/swiper-details?skuid=${this.data.good.skuid}`
    })
  },

})
