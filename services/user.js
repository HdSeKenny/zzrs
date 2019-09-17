const request = require('./request')


function login(data) {
  return request.get('/wxminiapi/login', data)
}

function getUserMessages(data) {
  return request.post('/app/transmessage/findTransMessageByUserId', data)
}

function getUserInfo(res) {
  return request.get('/wechat/user/info', {
    rawData: res.rawData,
    encryptedData: res.encryptedData,
    iv: res.iv,
    signature: res.signature
  })
}

function getUserDefaultAddress() {
  return request.post('/wechat/user/findDefaultBizUserContact', {
    defaultflag: 1
  })
}

function findCurrentUser() {
  return request.post('/wechat/user/findCurrentUser')
}

function addUserContact(data) {
  return request.post('/wechat/user/insertOrUpdateContact', data)
}

function findBizUserContactByUser(data) {
  return request.post('/wechat/user/findBizUserContactByUser', data)
  
}

module.exports = {
  login,
  getUserMessages,
  getUserInfo,
  getUserDefaultAddress,
  findCurrentUser,
  addUserContact,
  findBizUserContactByUser
}