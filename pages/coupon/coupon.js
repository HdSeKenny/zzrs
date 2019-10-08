const GoodService = require('../../services/good')
const { Toast } = require('../../utils/util.js')
const app = getApp()

Page({
  data: {
    coupons: [],
    hasUserInfo: true,
    firstRender: true,
    spinShow: true,
    isFromOrder: false
  },

  fetchData: function (options) {
    GoodService.getMyCoupon({
      pageSize: 20,
      pageNum: 1
    }).then((res) => {
      this.setData({
        coupons: res.records,
        firstRender: false,
        spinShow: false,
        isFromOrder: options.is_order === '1'
      })
    })
    .catch((err) => {
      console.log(err)
    })
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({title: '我的优惠券'})
    if (!app.globalData.userInfo) {
      return this.setData({
        hasUserInfo: false,
        firstRender: false,
        spinShow: false
      }, () => {
        Toast.warning('请先登录')
      })
    }

    this.fetchData(options)
  },

  onShow: function () {
    if (!this.data.firstRender) {
      this.onLoad()
    }
  },
  onHide() {
    Toast.hide()
  },
  onUseCoupon(e) {
    if (this.data.isFromOrder) {
      const coupon = e.currentTarget.dataset.id
      const intMinus = parseInt(coupon.minusamount)
      coupon.minusamount = intMinus.toFixed(2)
      
      let pages = getCurrentPages()
      let prevPage = pages[pages.length - 2]
      prevPage.setData({coupon})
      wx.navigateBack({delta: 1})
    }
    else {
      wx.switchTab({
        url: '../home/home'
      })
    }
  }
})