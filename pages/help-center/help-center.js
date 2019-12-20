Page({
  data: {
    titles: [
      '无法购买',
      '无法支付',
    ],

    navData: {
      showCapsule: 1,
    },
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '帮助中心'
    })
  },

  bindAnswerTap: function(e) {
    const title = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../help-answer/help-answer?title=${title}`
    })
  }
})