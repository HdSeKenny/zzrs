const { GoodService } = require('../../services/index')
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    // canIUse: wx.canIUse('button.open-type.getUserInfo'),
    goods: []
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  bindDetailTap: function (e) {
    const gId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../detail/detail?id=${gId}`
    })
  },

  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '首页'
    })

    const goodsParams = {
      categoryId: 1,
      pageNum: 1,
      pageSize: 20,
      status: 1
    }

    GoodService.getGoodsList(goodsParams)
      .then((data) => {
        const goods = data.records;
        goods[goods.length] = {
          "id": 55,
          "createTime": "2019-01-24 16:31:19",
          "updateTime": "2019-04-02 02:36:00",
          "categoryId": 1,
          "goodid": null,
          "skuid": 55,
          "goodname": "华为METE20",
          "goodimg": "https://img11.360buyimg.com/n1/s450x450_jfs/t25954/134/1930444050/488286/31587d0d/5bbf1fc9N3ced3749.jpg",
          "purchaseprice": 7000.11,
          "currentprice": 6538.11,
          "redlineprice": 6300.11,
          "lastCalcPriceTime": "2019-04-02 02:36:00",
          "beginTime": "2019-08-05 09:53:40",
          "timespan": 5,
          "downprice": 1,
          "lookercount": 1,
          "goodnum": 10,
          "status": 1,
          "userId": null,
          "orderno": "DB1231231231231",
          "onlookRecordNo": "DC211231231",
          "topflag": 0,
          "minPrice": 6300.01,
          "salesVolume": 0,
          "lockgoodnum": 0
        }

        if (goods && goods.length) {
          goods.forEach((g) => {
            const deadline = new Date(g.beginTime).getTime();
            const now = new Date().getTime();
            const tmp = deadline - now;
            g.isGrabbing = tmp <= 0;
          })

          this.setData({ goods }, () => {
            this.calculateCountDownTime()
          })
        }
      })
      .catch((err) => {
        console.log(err.toString())
      })
  },
  calculateCountDownTime: function () {
    const goods = this.data.goods;
    goods.forEach((g) => {
      if (!g.isGrabbing) {
        this[`timeInterval_${g.skuid}`] = setInterval(() => {
          const deadline = new Date(g.beginTime).getTime();
          const now = new Date().getTime();
          const tmp = deadline - now;
          if (tmp < 0) {
            clearInterval(this[`timeInterval_${g.skuid}`]);
            g.isGrabbing = true;
          }
          else {
            g.hours = Math.floor((tmp % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            g.minutes = Math.floor((tmp % (1000 * 60 * 60)) / (1000 * 60));
            g.seconds = Math.floor((tmp % (1000 * 60)) / 1000);
          }
          this.setData({ goods })
        }, 1000);
      }
    })    
  },
  onShow: function() {
    this.onLoad()
  }
})
