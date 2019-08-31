// pages/add-address/add-address.js
Page({

  /**
   * Page initial data
   */
  data: {
    address: {
      id: null,
      name: '',
      phone: null,
      district: '',
      detail: ''
    },
    isAddAddress: false
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    const hasOptions = Object.keys(options).length
    wx.setNavigationBarTitle({
      title: hasOptions ? '修改地址' : '增加地址'
    })
    if (Object.keys(options).length) {
      const { id, phone, name, district, detail } = options
      this.setData({
        address: {
          id: parseInt(id),
          name,
          phone: parseInt(phone),
          district,
          detail
        }
      })
    }
    else {
      this.setData({
        isAddAddress: true
      })
    }
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },

  bindPhoneInput: function(e) {
    const address = this.data.address
    address.phone = e.detail.detail.value
    this.setData({ address })
  },
  bindDistrictInput: function (e) {
    const address = this.data.address
    address.district = e.detail.detail.value
    this.setData({ address })
  },
  bindDetailInput: function (e) {
    const address = this.data.address
    address.detail = e.detail.detail.value
    this.setData({ address })
  },
  bindNameInput: function (e) {
    const address = this.data.address
    address.name = e.detail.detail.value
    this.setData({ address })
  },
  onSaveAddress: function() {
    const pages = getCurrentPages()
    const prevPage = pages[pages.length - 2]
    const prevAdresses = prevPage.data.addresses
    const currentAddress = this.data.address
    
    if (this.data.isAddAddress) {
      // add address
      prevAdresses.push(currentAddress)
    }
    else {
      // change address
      const currentIndex = prevAdresses.findIndex((pa) => pa.id === currentAddress.id)
      prevAdresses[currentIndex] = currentAddress
    }
    
    prevPage.setData({ addresses: prevAdresses })
    wx.navigateBack({ delta: 1 })
  }
})