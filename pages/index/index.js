const GoodService = require('../../services/good')
const BannerService = require('../../services/banner')
const UserService = require('../../services/user')

const app = getApp()

let countInterval = null
let pageNum = 1

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    goods: [],
    sliders: [],

    // sliders configs
    indicatorDots: false,
    autoplay: true,
    interval: 3000,
    duration: 1000,

    showAuthModal: false,
    firstRender: true,
    spinShow: true,
    loadMore: false,
    noMoreData: false,
    navData: {
      showCapsule: 1,
      title: '首页',
    },

    swiperHeight: app.globalData.swiperHeight,
    itemBottomMargin: app.globalData.systeminfo.screenWidth * 0.03,
    hideModal: true,
    animationData: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showAuth: false
  },

  onLoad: function () {
    pageNum = 1
    const userSettingsConfigs = {
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.queryUsreInfo(res)
            }
          })
        }
        else {
          this.showModal()
        }
      }
    }

    wx.login({
      success: res => {
        UserService.login({ code: res.code }).then((data) => {
          wx.setStorageSync('token', data.token)
          wx.getSetting(userSettingsConfigs)
        })
      }, fail: (err) => {
        console.log(err)
      }
    })
  },

  fetchData: function (loadMore) {
    if (!loadMore) {
      pageNum = 1
      BannerService.getHomeSliders()
        .then((sliders) => {
          this.setData({ sliders })
        })
    }
    else {
      pageNum += 1
    }

    GoodService.getGoodsList({
      pageNum,
      pageSize: 10,
      status: 1,
      orderby: 'beginTime',
      asc: 'true'
    })
    .then((data) => {
      if (!data.records.length) {
        this.setData({
          spinShow: false,
          noMoreData: true,
          loadMore: false,
          firstRender: false
        })
      }
      else if (loadMore) {
        if (countInterval) {
          countInterval = clearInterval(countInterval)
        }
        this.setData({ loadMore: true }, () => {
          this.setInitialData(data.records)
        })
      }
      else {
        this.setInitialData(data.records)
      }
    })
  },

  setInitialData(goods) {
    goods.forEach((good, idx) => {
      const beginTime = good.beginTime.replace(/-/g, '/')
      const beginTimeTamp = Date.parse(beginTime)
      const now = new Date().getTime()
  
      good.isGrabbing = beginTimeTamp <= now
      good.classes = `item-block ${idx % 2 !== 0 ? 'right-one' : ''}`

      Object.keys(good).forEach(key => {
        const isTime = key.toLowerCase().includes('time')
        if (key.toLowerCase().includes('price') && !isTime) {
          const intPrice = parseInt(good[key])
          const decimalPrice = intPrice.toFixed(2)
          good[key] = decimalPrice
        }
      })
    })

    this.calculateCountDownTime(goods)
},

  bindDetailTap: function (e) {
    const item = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../detail/detail?id=${item.id}&skuid=${item.skuid}`
    })
  },
  bindGuideTap: function(e) {
    wx.navigateTo({
      url: `../guide/guide`
    })
  },

  getCountDownGoodsNum: function(goods) {
    const hasCountedDownGoods = goods.filter((good) => {
      const { isGrabbing, beginTime } = good
      const deadline = Date.parse(beginTime.replace(/-/g, '/'))
      const now = new Date().getTime()
      good.deadline = deadline
      return !isGrabbing && (deadline > now)
    })
    return hasCountedDownGoods.length
  },

  calculateCountDownTime: function (goods) {
    const newGoods = this.data.goods.concat(goods)
    const countedDownLength = this.getCountDownGoodsNum(newGoods)
    
    if (countedDownLength && !countInterval) {
      countInterval = setInterval(() => {
        newGoods.forEach((g) => {
          const now = new Date().getTime()
          const tmp = g.deadline - now
          if (tmp > 0) {
            g.hours = Math.floor((tmp % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            g.minutes = Math.floor((tmp % (1000 * 60 * 60)) / (1000 * 60))
            g.seconds = Math.floor((tmp % (1000 * 60)) / 1000)
          }
          else {
            g.isGrabbing = true
          }
        })

        const _countedDownLength = newGoods.filter(g => !g.isGrabbing)
        if (!_countedDownLength.length) {
          countInterval = clearInterval(countInterval)
        }
        const result = {
          goods: newGoods,
        }

        if (this.data.spinShow) {
          result.spinShow = false
        }

        if (this.data.firstRender) {
          result.firstRender = false
        }
  
        this.setData(result)
      }, 1000)
    }
    else {
      this.setData({
        goods: newGoods,
        spinShow: false,
        firstRender: false
      })
    }
  },

  showModal: function () {
    this.setData({ hideModal: false, spinShow: false })
    const animation = wx.createAnimation({
      duration: 600,
      timingFunction: 'ease',
    })
    this.animation = animation
    setTimeout(() => {
      this.fadeIn()
    }, 200)
  },

  hideModal: function () {
    const animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease',
    })
    this.animation = animation
    this.fadeDown()
    setTimeout(() => {
      this.setData({ hideModal: true })
    }, 200)
  },

  fadeIn: function () {
    this.animation.translateY(0).step()
    this.setData({
      animationData: this.animation.export()
    })
  },

  fadeDown: function () {
    this.animation.translateY(300).step()
    this.setData({
      animationData: this.animation.export(),
    })
  },

  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      this.setData({ spinShow: true, hideModal:true }, () => {
        this.queryUsreInfo(e.detail)
      })
    } else {
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {}
      })
    }
  },

  queryUsreInfo: function (res) {
    UserService.getUserInfo(res).then((data) => {
      app.globalData.userInfo = data
      wx.setStorageSync('open_params', {
        openId: data.openId,
        unionId: data.unionId
      })

      this.fetchData()
    })
  },

  onReachBottom: function() {
    if (!this.data.noMoreData) {
      this.fetchData(true)
    }
  }
})
