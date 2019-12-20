const GoodService = require('../../services/good')
const WxParse = require('../../modules/wxParse/wxParse.js')

Page({
  data: {
    detailString: null,
    navData: {
      showCapsule: 1,
    },
  },
  onLoad: function (options) {
    GoodService.getGoodDetail({
      id: options.skuid
    })
    .then((data) => {
      WxParse.wxParse('article', 'html', data.detail, this, 0);
    })
    .catch(err => {
      Toast.error(err.toString())
    })
  }
})