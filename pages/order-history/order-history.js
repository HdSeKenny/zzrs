const { Toast } = require('../../utils/util.js')
const UserService = require('../../services/user')
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    hasUserInfo: true,
    firstRender: true,
    orders: []
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: '我的订单' })
    if (!app.globalData.userInfo) {
      return this.setData({
        hasUserInfo: false,
        firstRender: false
      }, () => {
        Toast.warning('请先登录')
      })
    }
    else {
      this.fetchData()
    }
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
    if (!this.data.firstRender) {
      this.onLoad()
    }
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {
    Toast.hide()
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

  fetchData: function () {
    UserService.getUserOrder({
      pageSize: 20,
      pageNum:1
    }).then((res) => {

      const orders = (res.records || []).map((record) => {
        let statusText = ''
        if (record.orderstatus === 1) {
          statusText = '已支付'
        } else if (record.orderstatus === 0) {
          statusText = '未支付'
          holder.status.setBackgroundResource(R.drawable.corner_shape_gray);
        } else if (record.orderstatus === 2) {
          statusText = '已发货'
        } else if (record.orderstatus === 3) {
          statusText = '确认收货'
        } else if (record.orderstatus === 4) {
          statusText = '已取消'
        }
        record.statusText = statusText
        return record
      })

      this.setData({ orders, firstRender: false })
    }).catch((err) => {
      console.log(err)
    })
  }
})