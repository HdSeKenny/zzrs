const UserService = require('../../services/user')
const model = require('../choose-address/model/model.js')
const { Toast } = require('../../utils/util.js')
const app = getApp()

var show = false;
var item = {};

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
      city: '',
      detail: '',
      defaultflag: 1,
      areaString: '',
      province: ''
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
      const { id, name, phone, province, city, area, address } = options
      // const { id, phone, name, district, detail } = options
      this.setData({
        address: {
          id: parseInt(id),
          name,
          phone: parseInt(phone),
          province,
          city,
          district: area,
          detail: address,
          areaString: `${province} ${city} ${area}`
        }
      })
    }
    else {
      this.setData({
        isAddAddress: true
      })
    }
  },

  //生命周期函数--监听页面初次渲染完成
  onReady: function (e) {
    var that = this;
    //请求数据
    model.updateAreaData(that, 0, e);
  },
  //点击选择城市按钮显示picker-view
  translate: function (e) {
    model.animationEvents(this, 0, true, 400);
  },
  //隐藏picker-view
  hiddenFloatView: function (e) {
    model.animationEvents(this, 200, false, 400);
    item = this.data.item;
    this.convertAddressData(item);
  },

  convertAddressData: function (item) {
    const province = item.provinces[item.value[0]].name
    const city = item.citys[item.value[1]].name
    const county = item.countys[item.value[2]].name
    const areaString = `${province} ${city} ${county}`
    const address = this.data.address
    
    address.province = province
    address.city = city
    address.county = county
    address.areaString = areaString

    this.setData({ address })
  },

  //滑动事件
  bindChange: function (e) {
    model.updateAreaData(this, 1, e);
    item = this.data.item;
    this.convertAddressData(item);
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
    const { name, phone, province, county, detail, defaultflag, city } = currentAddress
    if (!name || !phone || !province || !county || !detail || !defaultflag || !city) {
      return Toast.warning('请填写完整的地址信息')
    }

    if (this.data.isAddAddress) {
      // add address
      prevAdresses.push(currentAddress)
    }
    else {
      // change address
      const currentIndex = prevAdresses.findIndex((pa) => pa.id === currentAddress.id)
      prevAdresses[currentIndex] = currentAddress
    }
    
    UserService.addUserContact({
      name,
      city,
      phone,
      province,
      area: county,
      address: detail,
      defaultflag
    }).then((data) => {
      prevPage.setData({ addresses: prevAdresses })
      wx.navigateBack({ delta: 1 }) 
    }).catch((err) => {
      console.log(err)
    })
  }
})