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
    else {
      const { id } = this.data.good
      const { phone, address, area, city, province } = this.data.address
      const { userInfo } = app.globalData.userInfo
      const { nickName } = userInfo
      GoodService.buyGood({
        onlookid: id,
        buyerremark: '',
        receivername: nickName,
        receivertel: phone,
        receiveraddress: address,
        receiverarea: area,
        receivercity: city,
        receiverprovince: province,
        ordertype: 1
      }).then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })
    }
  }
})