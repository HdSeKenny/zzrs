const request = require('./request')

function getGoodsList(data) {
  return request.post('/wechat/onlook/findOnlookByCategory', data)
}

function getGoodDetail(data) {
  return request.post('/goodsku/findGoodSkuDetail', data)
}

function findGoodOnlook(data) {
  return request.post('/goodsku/findGoodOnlook', data)
}

function getCartGoods() {
  return request.post('/wechat/order/findMyonlookRecord', data)
}

function buyGood() {
  return request.post('/wechat/onlook/buyGood', data)
}

module.exports = {
  getGoodsList,
  getGoodDetail,
  findGoodOnlook,
  getCartGoods
}