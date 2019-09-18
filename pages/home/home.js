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

    showAuthModal: false
  },

  bindDetailTap: function (e) {
    const item = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../detail/detail?id=${item.id}&skuid=${item.skuid}`
    })
  },

  onLoad: function () {
    wx.setNavigationBarTitle({ title: '首页' })
    this.fetchData()
  },
  calculateCountDownTime: function () {
    const goods = this.data.goods;
    goods.forEach((g) => {
      if (!g.isGrabbing) {
        this[`timeInterval_${g.skuid}`] = setInterval(() => {
          const deadline = new Date(g.beginTime).getTime();
          const now = new Date().getTime();
          const tmp = deadline - now;
          if (tmp < 0) {
            clearInterval(this[`timeInterval_${g.skuid}`]);
            g.isGrabbing = true;
          }
          else {
            g.hours = Math.floor((tmp % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            g.minutes = Math.floor((tmp % (1000 * 60 * 60)) / (1000 * 60));
            g.seconds = Math.floor((tmp % (1000 * 60)) / 1000);
          }
          this.setData({ goods })
        }, 1000);
      }
    })
  },

  onShow: function () {
    this.onLoad()
  },

  fetchData: function () {
    const goodsParams = {
      // categoryId: 1,
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
        const goods = data[1].records
        goods.forEach((g, idx) => {
          const deadline = new Date(g.beginTime).getTime();
          const now = new Date().getTime();
          const tmp = deadline - now;
          g.isGrabbing = tmp <= 0;
          g.classes = `item-block ${idx % 2 !== 0 ? 'right-one' : ''}`
        })

        this.setData({ goods, sliders }, () => {
          this.calculateCountDownTime()
        })
      })
      .catch((err) => {
        // TO DO
      })
  }
})
