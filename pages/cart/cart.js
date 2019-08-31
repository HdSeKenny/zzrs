const { Toast } = require('../../utils/util.js')
const { GoodService } = require('../../services/index')
const app = getApp()

Page({
  data: {
    hasUserInfo: true,
    orders: [
      {
        "id": 1,
        "createTime": "2019-02-17 09:49:55",
        "goodid": 1,
        "goodname": "华为METE20",
        "skuid": 1,
        "payserino": null,
        "wxprepayid": null,
        "lookerid": 1,
        "lookeropenid": "oCKcl54wbR59eimiFDMEhrmOXCE0",
        "lookamount": 1,
        "status": 3,
        "onlookid": 1,
        "inviteuserid": null,
        "inviteopenid": null,
        "orderTogether": null,
        "currentprice": 6538.11,
        "lastCalcPriceTime": "2019-04-02 02:36:00",
        "timespan": 5,
        "beginTime": "2019-03-19 17:50:40",
        "redlineprice": 6300.11,
        "lookercount": 1,
        "lookeramount": 1,
        "goodimg": "https://img11.360buyimg.com/n1/s450x450_jfs/t25954/134/1930444050/488286/31587d0d/5bbf1fc9N3ced3749.jpg",
        "minPrice": 6300.01
      },
      {
        "id": 2,
        "createTime": "2019-02-17 09:49:55",
        "goodid": 1,
        "goodname": "华为METE20",
        "skuid": 1,
        "payserino": null,
        "wxprepayid": null,
        "lookerid": 1,
        "lookeropenid": "oCKcl54wbR59eimiFDMEhrmOXCE0",
        "lookamount": 1,
        "status": 3,
        "onlookid": 1,
        "inviteuserid": null,
        "inviteopenid": null,
        "orderTogether": null,
        "currentprice": 6538.11,
        "lastCalcPriceTime": "2019-04-02 02:36:00",
        "timespan": 5,
        "beginTime": "2019-03-19 17:50:40",
        "redlineprice": 6300.11,
        "lookercount": 1,
        "lookeramount": 1,
        "goodimg": "https://img11.360buyimg.com/n1/s450x450_jfs/t25954/134/1930444050/488286/31587d0d/5bbf1fc9N3ced3749.jpg",
        "minPrice": 6300.01
      },
    ]
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: '购物车' })
    if (!app.globalData.userInfo) {
      return this.setData({
        hasUserInfo: false
      }, () => {
        Toast.warning('请先登录')
      })
    }
    else if (options) {
      GoodService.getCartGoods({
        openid: 1,
        // userId: 1,
        pageSize: 1,
        pageNum: 20
      })
      .then(data => {
        this.setData({
          hasUserInfo: true,
          // orders: data
        })
      })
      .catch(err => {
        Toast.error(err.toString())
      })
    }
  },

  bindDetailTap: function (e) {
    const gId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../detail/detail?id=${gId}`
    })
  },
  onShow: function() {
    this.onLoad({
      openid: 1,
      // userId: 1,
      pageSize: 1,
      pageNum: 20
    })
  }
})
