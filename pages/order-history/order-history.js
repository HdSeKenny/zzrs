const { Toast } = require('../../utils/util.js')
const UserService = require('../../services/user')
const app = getApp()

Page({
  data: {
    hasUserInfo: true,
    firstRender: true,
    orders: [],
    spinShow: true,

    navData: {
      showCapsule: 1,
      title: '我的订单',
      titleColor: '#fff'
    },
  },

  onLoad: function (options) {
    if (!app.globalData.userInfo) {
      return this.setData({
        hasUserInfo: false,
        firstRender: false,
        spinShow: false
      }, () => {
        Toast.warning('请先登录')
      })
    }
    else {
      this.fetchData()
    }
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

      this.setData({ orders, firstRender: false, spinShow: false })
    }).catch((err) => {
      console.log(err)
    })
  },
  bindOrderDetail: function (e) {
    const item = e.currentTarget.dataset.id
    const {
      id,
      receiveraddress,
      receiverarea,
      receivercity,
      receivername,
      receiverprovince,
      receivertel,
      orderprice } = item
    if (item.orderstatus === 0) {
      wx.navigateTo({
        url: `../order/order?id=${id}&is_order_pay=1&phone=${receivertel}&address=${receiveraddress}&area=${receiverarea}&city=${receivercity}&province=${receiverprovince}&name=${receivername}&order_price=${orderprice}`
      })
    }
    else {
      wx.navigateTo({
        url: `../order-history-detail/order-history-detail?id=${item.id}`
      })
    }

  },
})