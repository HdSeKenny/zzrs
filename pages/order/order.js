const GoodService = require('../../services/good')
const UserService = require('../../services/user')
const { Toast } = require('../../utils/util.js')

const app = getApp()

Page({
  data: {
    good: null,
    address: null,
    coupon: null,
    spinShow: true,
    firstRender: true,

    navData: {
      showCapsule: 1,
      title: '订单支付'
    },
  },

  onLoad: function (options) {
    const { id, isGrabbing, is_order_pay, order_price } = options
    if (is_order_pay === '1') {
      const { phone, address, area, city, province, lookid, name } = options
      GoodService
        .findOrderDetail({ id: parseInt(options.id) })
        .then((order) => {
          const { price, orderprice, skuname, productlogo } = order
    
          order.displayPrice = parseInt(orderprice)
          order.sumPrice = parseInt(orderprice)
          order.goodname = skuname
          order.goodimg = productlogo
    
          Object.keys(order).forEach(key => {
            if (key.toLowerCase().includes('price')) {
              const intPrice = parseInt(order[key])
              const decimalPrice = intPrice.toFixed(2)
              order[key] = decimalPrice
            }
          })
          this.setData({
            good: order,
            address: {
              name,
              phone,
              address,
              area,
              city,
              province
            },
            isLooker: false,
            isPayLookAgain: false,
            isPayOrderAgain: true,
            lookid: null,
            orderid: parseInt(id),
            firstRender: false
          }, () => {
            this.setData({ spinShow: false })
          })
        })
    }
    else {
      Promise.all([
        GoodService.weChatFindGoodOnlook({ id }),
        UserService.getUserDefaultAddress()
      ]).then((data) => {
        const good = data[0]
        const isLooker = options.isLooker === '1'
        const isGrabbing = options.isGrabbing === '1'
        const isPayLookAgain = options.isPayLookAgain === '1'
        const { lookAmount, purchaseprice, currentprice } = good
        good.displayPrice = isLooker ? lookAmount : (isGrabbing ? currentprice : purchaseprice)

        const { coupon } = this.data
        const discountPrice = coupon ? (good.displayPrice - coupon.minusamount) : good.displayPrice
        good.sumPrice = isLooker ? lookAmount : discountPrice

        Object.keys(good).forEach(key => {
          if (key.includes('price') || key.includes('Price')) {
            const price = good[key]
            const intPrice = parseInt(price)
            const decimalPrice = intPrice.toFixed(2)
            good[key] = decimalPrice
          }
        })

        this.setData({
          good,
          address: data[1],
          isLooker,
          isGrabbing,
          isPayLookAgain,
          lookid: options.lookid || null,
          firstRender: false
        }, () => {
          this.setData({ spinShow: false })
        })
      })
    }
  },

  onPayOrder: function () {
    const {
      address,
      good,
      isLooker,
      isPayLookAgain,
      isPayOrderAgain,
      lookid,
      orderid
    }= this.data
  
    if (isPayLookAgain) {
      GoodService.payAgain({
        orderType: 0,
        id: lookid
      })
      .then((res) => {
        this.processPay(res)
      })
      .catch((err) => {})
    }
    else if (isPayOrderAgain) {
      GoodService.payAgain({
        orderType: 1,
        id: orderid
      })
      .then((res) => {
        this.processPay(res)
      })
      .catch((err) => { })
    }
    else if (isLooker) {
      GoodService.onLookGood({
        onlookid: good.id,
        transType: 'JSAPI'
      })
      .then((res) => {
        this.processPay(res)
      })
      .catch((err) => {})
    }
    else {
      if (!this.data.address) {
        return Toast.warning('请填写收货地址！')
      }

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
        // TO DO
      })
    }
  },

  processPay: function(param) {
    if (param.timeStamp) {
      wx.requestPayment({
        timeStamp: param.timeStamp,
        nonceStr: param.nonceStr,
        package: param.packageValue,
        signType: param.signType || 'MD5',
        paySign: param.paySign || param.sign,
        success: (res) => {
          wx.showModal({
            title: '支付成功',
            content: '您将在“微信支付”官方号中收到支付凭证',
            showCancel: false,
            success: (res) => {
              const { id, skuid } = this.data.good;
              if (res.confirm) {
                wx.navigateTo({
                  url: `../detail/detail?id=${id}&skuid=${skuid}`
                })
              } else if (res.cancel) {
              }
            }
          })
        },
        fail: function (err) {
          // console.log("支付失败", err)
        },
        complete: function () {
          // console.log("支付完成(成功或失败都为完成)")
        }
      })
    }
    else if (param.msg) {
      Toast.warning(param.msg)
    }
  },
  onUserCoupon() {
    wx.navigateTo({
      url: '../coupon/coupon?is_order=1'
    })
  },
  
  onShow() {
    if (this.data.firstRender) {return}
    const { coupon, good, isLooker } = this.data
    const { lookAmount, purchaseprice } = good
    const discountPrice = coupon ? (purchaseprice - coupon.minusamount) : purchaseprice
    good.sumPrice = isLooker ? lookAmount : discountPrice

    Object.keys(good).forEach(key => {
      if (key.toLowerCase().includes('price')) {
        const price = good[key]
        const intPrice = parseInt(price)
        const decimalPrice = intPrice.toFixed(2)
        good[key] = decimalPrice
      }
    })

    this.setData({good})
  }
})