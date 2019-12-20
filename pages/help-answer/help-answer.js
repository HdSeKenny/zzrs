Page({
  data: {
    question: ''
  },

  onLoad: function (options) {
    this.setData({
      question: options.title
    })
  }
})