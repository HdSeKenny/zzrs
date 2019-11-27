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
    firstRender: true,
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
          hasUserInfo: false,
          firstRender: false
        }, () => {
          Toast.warning('请先登录')
        })
      }

      const dataOptions = {
        firstRender: false
      }
      if (options && options.isOrder) {
        dataOptions.isFromOrder = true
      }

      dataOptions.addresses = (data.records || []).map((record) => {
        record.tagName = record.name.substring(0, 1)
        record.province = record.province || ''
        record.city = record.city || ''
        record.area = record.area || ''
        record.address = record.address || ''
        return record
      })
      this.setData(dataOptions)
    })
  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    if (!this.data.firstRender) {
      this.onLoad()
    }
  },

  onReady: function () {

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

  bindAddAddressTap: function(e) {
    const item = e.currentTarget.dataset.id
    if (item) {
      const { id, name, phone, province, city, area, address, defaultflag } = item
      const queryString = `id=${id}&name=${name}&phone=${phone}&province=${province}&city=${city}&area=${area}&address=${address}&defaultflag=${defaultflag}`
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