const { apiService } = require('../configs/index.js')
const { baseUrl, header } = apiService

const request = {
  post: (target, data) => new Promise((resolve, reject) => {
    const options = {
      url: `${baseUrl}${target}`,
      method: 'POST',
      data,
      header,
      success: (res) => {
        // console.log(res.data)
        let _data = res.data.data
        if (!_data) {
          _data = {}
        }
        _data.msg = res.data.msg
        resolve(_data)
      },
      fail: (err) => {
        reject(err)
      }
    };
    
    if (wx.getStorageSync('token')) {
      options.header.AUTHORIZATION = `${wx.getStorageSync('token')}`
    }
    else {
      console.log('== Application does not have a token ! ==')
    }

    wx.request(options);
  }),

  get: (target, data) => new Promise((resolve, reject) => {
    const options = {
      url: `${baseUrl}${target}`,
      method: 'GET',
      data,
      header,
      success: (res) => {
        resolve(res.data.data)
      },
      fail: (err) => {
        reject(err)
      }
    };

    if (wx.getStorageSync('token')) {
      options.header.AUTHORIZATION = `${wx.getStorageSync('token')}`
    }

    wx.request(options);
  }),
}

module.exports = request