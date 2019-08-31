const { apiService } = require('../configs/index.js')
const { baseUrl, header } = apiService

const $http = {
  post: (target, data) => new Promise((resolve, reject) => {
    wx.request({
      url: `${baseUrl}${target}`,
      method: 'POST',
      data,
      header,
      success: (res) => {
        resolve(res.data.data)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

const GoodService = {
  getGoodsList: (data) => $http.post('/goodsku/findOnlookByCategory', data),
  getGoodDetail: (data) => $http.post('/goodsku/findGoodSkuDetail', data),
  findGoodOnlook: (data) => $http.post('/goodsku/findGoodOnlook', data),
  getCartGoods: (data) => $http.post('/wechat/order/findMyonlookRecord', data)
}

const UserService = {
  getUserMessage: (data) => $http.post('/app/transmessage/findTransMessageByUserId', data)
}
module.exports = {
  GoodService,
  UserService
}