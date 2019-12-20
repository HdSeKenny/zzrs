const UserService = require('../../services/user')
const model = require('../choose-address/model/model.js')
const { Toast } = require('../../utils/util.js')
const app = getApp()

let show = false
let item = {}

Page({
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
    
    isAddAddress: false,
    navData: {
      showCapsule: 1,
    },
  },

  onLoad: function (options) {
    const hasOptions = Object.keys(options).length
    wx.setNavigationBarTitle({
      title: hasOptions ? '修改地址' : '增加地址'
    })
    
    if (hasOptions) {
      const { id, name, phone, province, city, area, address, defaultflag } = options
      this.setData({
        hasOptions: true,
        address: {
          id: parseInt(id),
          name,
          phone: parseInt(phone),
          province,
          city,
          district: area,
          county: area,
          detail: address,
          areaString: `${province} ${city} ${area}`,
          defaultflag
        }
      })
    }
    else {
      this.setData({
        isAddAddress: true
      })
    }
  },
  onReady: function (e) {
    var that = this;
    model.updateAreaData(that, 0, e);
  },
  translate: function (e) {
    model.animationEvents(this, 0, true, 400);
  },
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
    console.log(e)
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
    if (!name || !phone || !province || !county || !detail || !city) {
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

    const newAddr = {
      name,
      city,
      phone,
      province,
      area: county,
      address: detail,
      defaultflag: parseInt(defaultflag)
    }

    if (this.data.hasOptions) {
      newAddr.id = currentAddress.id
    }
    
    UserService.addUserContact(newAddr).then((data) => {
      prevPage.setData({ addresses: prevAdresses })
      wx.navigateBack({ delta: 1 }) 
    }).catch((err) => {})
  },
  checkboxChange() {
    const newAddr = this.data.address
    const isDefault = newAddr.defaultflag === '1' || newAddr.defaultflag === 1
    newAddr.defaultflag = isDefault ? 0 : 1
    this.setData({address: newAddr})
  }
})