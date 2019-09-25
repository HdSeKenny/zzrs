const GoodService = require('../../services/good')

Page({

  /**
   * Page initial data
   */
  data: {

  },

  fetchData: function () {
    wx.setNavigationBarTitle({
      title: '我的优惠券'
    })

    GoodService.getMyCoupon({
      pageSize: 20,
      pageNum: 1
    }).then((res) => {
      
    })
    .catch((err) => {
      console.log(err)
    })
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.fetchData()
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

  }
})