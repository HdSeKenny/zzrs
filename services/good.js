const request = require('./request')

function getGoodsList(data) {
  return request.post('/wechat/onlook/findOnlookByCategory', data)
}

function getGoodDetail(data) {
  return request.post('/goodsku/findGoodSkuDetail', data)
}

function findGoodOnlook(data) {
  return request.post('/wechat/onlook/findGoodOnlook', data)
}

function weChatFindGoodOnlook(data) {
  return request.post('/wechat/onlook/findGoodOnlook', data)
}

function getCartGoods(data) {
  return request.post('/wechat/order/findMyonlookRecord', data)
}

function buyGood(data) {
  return request.post('/wechat/onlook/buyGood', data)
}

function getMyCoupon(data) {
  return request.post('/wechat/coupon/findMyCouponRecord', data)
}

function onLookGood(data) {
  return request.post('/wechat/onlook/onlookGoodOrder', data)
}

function payAgain(data) {
  return request.post('/wechat/onlook/payAgain', data)
}

function findOrderDetail(data) {
  return request.post('/wechat/order/findOrderDetail', data)
}

module.exports = {
  getGoodsList,
  getGoodDetail,
  findGoodOnlook,
  getCartGoods,
  weChatFindGoodOnlook,
  buyGood,
  getMyCoupon,
  onLookGood,
  payAgain,
  findOrderDetail
}