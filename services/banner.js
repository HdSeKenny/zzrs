const request = require('./request')

function getHomeSliders() {
  return request.post('/bizBanner/findBannerList', {status: 1})
}

module.exports = {
  getHomeSliders
}