const WxParse = require('../../modules/wxParse/wxParse.js')
Page({
  data: {
    spinShow: true,
    navData: {
      showCapsule: 1,
    },
  },

  onLoad: function (options) {
    const htmlStr = "<div class='guide'><div class='contents'><img src='http://files-test.bmwgd.com/40On+R3XzRbkLFwV9qhYgRWdJZgwPiOAYUkny+1pmG8=' /></div></div>"
    WxParse.wxParse('article', 'html', htmlStr, this, 0);
  },

  onReady: function () {
    setTimeout(() => {
      this.setData({ spinShow: false })
    }, 1000) 
  }
})