const GoodService = require('../../services/good')

Page({
  data: {
    spinShow: true,
    navData: {
      showCapsule: 1,
      title: '订单详情',
      titleColor: '#fff'
    },
    orderDetail: null
  },

  onLoad: function (options) {
    GoodService
      .findOrderDetail({id: parseInt(options.id)})
      .then((data) => {
        if (data.orderstatus === 1) {
          data.statusText = '已支付'
          data.payprice = data.orderprice
        } else if (data.orderstatus === 0) {
          data.statusText = '未支付'
          data.payprice = 0
        } else if (data.orderstatus === 2) {
          data.statusText = '已发货'
          data.payprice = data.orderprice
        } else if (data.orderstatus === 3) {
          data.statusText = '确认收货'
          data.payprice = data.orderprice
        } else if (data.orderstatus === 4) {
          data.statusText = '已取消'
          data.payprice = 0
        }
        Object.keys(data).forEach(key => {
          const isTime = key.includes('Time') || key.includes('time')
          if ((key.includes('price') || key.includes('Price')) && !isTime) {
            const price = data[key]
            const intPrice = parseInt(price)
            const decimalPrice = intPrice.toFixed(2)
            data[key] = decimalPrice
          }
        })

        this.setData({ orderDetail: data, spinShow: false })
      })
      .catch((err) => {
        this.setData({ spinShow: false })
      })
  },
})