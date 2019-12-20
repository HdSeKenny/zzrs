const { Toast, keepDecimalSpaces } = require('../../utils/util.js')
const GoodService = require('../../services/good')
const app = getApp()
const screen = {
  width: app.globalData.systeminfo.screenWidth
}

let detailInterval = null

Page({
  data: {
    good: null,
    hasUserInfo: true,
    indicatorDots: false,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    firstRender: true,
    spinShow: true,

    navData: {
      showCapsule: 1,
    },

    swiperHeight: app.globalData.swiperHeight,
    bodyHeightPrecent: app.globalData.bodyHeightPrecent
  },
  onLoad: function (options) {
    if (options && Object.keys(options).length) {
      if (this.data.firstRender) {
        detailInterval = null
      }
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
  handleCheckoutLookerPriceAgain: function(e) {
    if (!app.globalData.userInfo) {
      return Toast.warning('请先登录')
    }
    const item = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../order/order?id=${item.id}&isLooker=1&isPayLookAgain=1&lookid=${item.lookid || -1}`
    })
  },

  handleCheckoutGrabbingPrice: function(e) {
    if (!app.globalData.userInfo) {
      return Toast.warning('请先登录')
    }
    const gId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../order/order?id=${gId}&isGrabbing=1`
    })
  },

  findGoodOnlook: function (options, detailGood){

    GoodService.findGoodOnlook(options)
      .then(data => {
        const newGood = Object.assign({}, detailGood, data)
        newGood.swiperImgs = detailGood.imagePath.split(',')
        
        const { status, lookStatus, orderno, onlookRecordNo } = newGood
        // const showOrginalBuyBtn_1 = status === 1 && lookStatus === -1 && !orderno
        // const showOrginalBuyBtn_2 = status === 1 && lookStatus === 1 && !orderno
        
        newGood.showOrginalBuyBtn = (!orderno && ![0, 2].includes(lookStatus)) || (status !== 1 && !orderno)

        const showLookerBuyBtn_1 = lookStatus === -1 && status === 1 && !onlookRecordNo
        const showLookerBuyBtn_2 = ![-1, 0, 1, 2].includes(lookStatus) && status === 1 && !onlookRecordNo
        newGood.showLookerBuyBtn = showLookerBuyBtn_1 || showLookerBuyBtn_2
        
        newGood.showGrabBuyBtn = status === 1 && onlookRecordNo

        newGood.showAlreadyBuyBtn = lookStatus !== -1 && orderno
        newGood.showAlreayCancelBtn = status === 1 && lookStatus === 2
        newGood.showOverTimeNoPay = status === 1 && lookStatus === 0 && !onlookRecordNo
        newGood.showToFinish = status === 1 && lookStatus === 1

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
    const { beginTime, lastCalcPriceTime, timespan, skuid, id, currentprice, downprice, minPrice, status, lookStatus } = good
    const _beginTime = beginTime.replace(/-/g, '/')
    const begin = Date.parse(_beginTime)

    const _lastCalcPriceTime = lastCalcPriceTime.replace(/-/g, '/')
    const lastCalcute = Date.parse(_lastCalcPriceTime)
    
    const now = new Date().getTime()
    const nextPrice = currentprice - downprice

    good.isGrabbing = now >= begin && status !== 2
    good.willGrab = now < begin
    good.nextPrice = nextPrice < minPrice ? minPrice : nextPrice
  
    if (good.isGrabbing && !detailInterval) {
      detailInterval = setInterval(() => {
        const current = new Date().getTime()
        const tmp = lastCalcute + timespan * 60000 - current
        if (tmp < 0) {
          detailInterval = clearInterval(detailInterval)
          // console.log('下轮价格开启')
          this.fetchData({ skuid, id, lookStatus })
        }
        else {
          good.hours = Math.floor((tmp % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          good.minutes = Math.floor((tmp % (1000 * 60 * 60)) / (1000 * 60))
          good.seconds = Math.floor((tmp % (1000 * 60)) / 1000)
          this.setData({ good, firstRender: false, spinShow: false })
        }
      }, 1000)
    }
    else {
      if (good.willGrab && !detailInterval) {
        detailInterval = setInterval(() => {
          const beginTime = good.beginTime.replace(/-/g, '/')
          const deadline = Date.parse(beginTime)
          const now = new Date().getTime()
          const tmp = deadline - now
          if (tmp > 0) {
            good.hours = Math.floor((tmp % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            good.minutes = Math.floor((tmp % (1000 * 60 * 60)) / (1000 * 60))
            good.seconds = Math.floor((tmp % (1000 * 60)) / 1000)
            this.setData({ good, firstRender: false }, () => {
              if (this.data.spinShow) {
                this.setData({ spinShow: false })
              }
            })
          }
          else {
            detailInterval = clearInterval(detailInterval)
            this.fetchData({ skuid, id, lookStatus })
          }
        }, 1000)
      }
      else {
        // console.log('抢购结束')
        this.setData({ good, firstRender: false }, () => {
          if (this.data.spinShow) {
            this.setData({ spinShow: false })
          }
        })
      }
    }
  },

  onShow: function() {
    if (!this.data.firstRender) {
      this.onLoad()
    }
  },

  fetchData(options) {
    GoodService.getGoodDetail({ id: parseInt(options.skuid) })
      .then((data) => {
        data.lookStatus = options.lookStatus ? parseInt(options.lookStatus) : -1
        data.lookid = options.lookid ? parseInt(options.lookid) : null
        this.findGoodOnlook({ id: parseInt(options.id) }, data)
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

  onHide: function () {
    if (detailInterval) {
      detailInterval = clearInterval(detailInterval)
    }
  },

  onUnload: function () {
    if (detailInterval) {
      detailInterval = clearInterval(detailInterval)
    }
  },

})
