// pages/swiper-details/swiper-details.js
const GoodService = require('../../services/good')
const WxParse = require('../../modules/wxParse/wxParse.js')

Page({

  /**
   * Page initial data
   */
  data: {
    detailString: null
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    GoodService.getGoodDetail({
      id: options.skuid
    })
    .then((data) => {
      WxParse.wxParse('article', 'html', data.detail, this, 0);
    })
    .catch(err => {
      Toast.error(err.toString())
    })
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