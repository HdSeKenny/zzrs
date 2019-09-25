const GoodService = require('../../services/good')
const UserService = require('../../services/user')
const { Toast } = require('../../utils/util.js')

const app = getApp()

Page({

  data: {
    good: null,
    address: null
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({title: '订单支付'})
    const { id, isLooker } = options
    Promise.all([
      GoodService.weChatFindGoodOnlook({ id }),
      UserService.getUserDefaultAddress()
    ]).then((data) => {
      this.setData({
        good: data[0],
        address: data[1],
        isLooker: isLooker === '1'
      })
    })
  },

  onPayOrder: function () {
    const { address, good, isLooker }= this.data
    if (!this.data.address) {
      Toast.warning('请填写收货地址！')
    }
    else if (this.data.isLooker) {
      GoodService.onLookGood({ onlookid: good.id, transType: 'JSAPI' })
        .then((res) => {
          this.processPay(res)
        })
        .catch((err) => {
          console.log(err)
        })
    }
    else {
      const { id } = this.data.good
      const { phone, address, area, city, province } = this.data.address
      const { userInfo } = app.globalData
      const { nickName } = userInfo
      GoodService.buyGood({
        onlookid: parseInt(id),
        buyerremark: '',
        receivername: nickName,
        receivertel: phone,
        receiveraddress: address,
        receiverarea: area,
        receivercity: city,
        receiverprovince: province,
        ordertype: 1,
        transType: 'JSAPI',
        buynum: 1
      }).then((res) => {
        this.processPay(res)
      })
      .catch((err) => {
        console.log(err)
      })
    }
  },

  processPay: function(param) {
    wx.requestPayment({
      timeStamp: param.timeStamp,
      nonceStr: param.nonceStr,
      package: param.packageValue,
      signType: param.signType,
      paySign: param.paySign,
      success: function (res) {
        console.log("wx.requestPayment返回信息", res)
        wx.showModal({
          title: '支付成功',
          content: '您将在“微信支付”官方号中收到支付凭证',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
            } else if (res.cancel) {
            }
          }
        })
      },
      fail: function (err) {
        console.log("支付失败", err)
      },
      complete: function () {
        console.log("支付完成(成功或失败都为完成)")
      }
    })
  },
  onUserCoupon() {
    wx.navigateTo({
      url: '../coupon/coupon'
    })
  }
})