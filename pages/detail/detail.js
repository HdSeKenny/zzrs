const { Toast } = require('../../utils/util.js')
const { GoodService } = require('../../services/index')
const app = getApp()

Page({
  data: {
    good: null,
    hasUserInfo: true
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: '详细' })
    if (options) {
      GoodService.getGoodDetail(options).then((data) => {
        this.findGoodOnlook(options, data)
      })
      .catch(err => {
        Toast.error(err.toString())
      })
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
        const good = data
        const newGood = Object.assign({}, detailGood, good)
        newGood.swiperImgs = detailGood.imagePath.split(',')

        const deadline = new Date(newGood.beginTime).getTime();
        const now = new Date().getTime();
        const tmp = deadline - now;
        newGood.isGrabbing = tmp <= 0;

        this.setData({ good: newGood }, () => {
          if (!newGood.isGrabbing) {
            this.calculateCountDownTime()
          }
        })
      })
      .catch(err => {
        Toast.error(err.toString())
      })
  },

  calculateCountDownTime: function () {
    const good = this.data.good;
    const timeInterval = setInterval(() => {
      const deadline = new Date(good.beginTime).getTime();
      const now = new Date().getTime();
      const tmp = deadline - now;
      if (tmp < 0) {
        clearInterval(timeInterval)
        good.isGrabbing = true;
      }
      else {
        good.hours = Math.floor((tmp % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        good.minutes = Math.floor((tmp % (1000 * 60 * 60)) / (1000 * 60));
        good.seconds = Math.floor((tmp % (1000 * 60)) / 1000);
      }
      this.setData({ good })
    }, 1000);
  },

  onShow: function() {
    this.onLoad()
  },

  bindDetailTap: function (e) {
    wx.navigateTo({
      url: `../swiper-details/swiper-details?detail=${this.data.good.detail}`
    })
  },
})
