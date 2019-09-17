const { Toast } = require('../../utils/util.js')
const UserService = require('../../services/user')
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    isFromOrder: false,
    hasUserInfo: true,
    addresses: []
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '收货地址'
    })

    UserService.findBizUserContactByUser({
      pageSize: 10,
      pageNum: 1
    }).then((data) => {
      if (!app.globalData.userInfo) {
        return this.setData({
          hasUserInfo: false
        }, () => {
          // Toast.warning('请先登录')
        })
      }

      if (options && options.isOrder) {
        this.setData({
          isFromOrder: true
        });
      }

      const addresses = (data.records || []).map((record) => {
        record.tagName = record.name.substring(0, 1)
        return record
      })
      this.setData({ addresses })
    })
  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    this.onLoad()
    this.onReady()
  },

  onReady: function () {
    if (!this.data.hasUserInfo) {
      Toast.warning('请先登录')
    }
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

  bindAddAddressTap: function(e) {
    const item = e.currentTarget.dataset.id
    if (item) {
      const { id, name, phone, district, detail } = item
      const queryString = `id=${id}&name=${name}&phone=${phone}&district=${district}&detail=${detail}`
      wx.navigateTo({
        url: `../add-address/add-address?${queryString}`
      })
    }
    else {
      wx.navigateTo({
        url: `../add-address/add-address`
      })
    }
  },

  bindBackToOrderTap: function(e) {
    if (!this.data.isFromOrder) {
      return;
    }

    let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
    let prevPage = pages[pages.length - 2];
    //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
    prevPage.setData({  // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
      address: e.currentTarget.dataset.item
    })
    wx.navigateBack({
      delta: 1
    })
  }
})