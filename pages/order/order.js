const GoodService = require('../../services/good')
const UserService = require('../../services/user')
const { Toast } = require('../../utils/util.js')

const app = getApp()

Page({

  data: {
    good: null,
    address: null
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '订单支付'
    })
    const { id, isLooker } = options
    Promise.all([
      GoodService.findGoodOnlook({ id }),
      UserService.getUserDefaultAddress()
    ]).then((data) => {
      this.setData({
        good: data[0],
        address: data[1],
        isLooker: isLooker === '1'
      })
    })

    // UserService.getUserDefaultAddress().then((data) => {
    //   console.log('user address', data)
    // })
    // wx.request({
    //   url: "https://www.cnqiangba.com/goodsku/findGoodSkuDetail",
    //   method: 'POST',
    //   data: {
    //     id: options.id
    //   },
    //   header: {
    //     "Content-Type": "application/x-www-form-urlencoded"
    //   },
    //   success: (res) => {
    //     console.log(res.data.data)
    //     this.setData({
    //       good: res.data.data,
    //       isLooker: options.isLooker === '1'
    //     })
    //   },
    //   fail: function (err) {
    //     console.log(err)
    //   }
    // })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },

  onPayOrder: function () {
    console.log(this.data.good)
    console.log(app.globalData)
    if (!this.data.address) {
      Toast.warning('请填写收货地址！')
    }
  }
})