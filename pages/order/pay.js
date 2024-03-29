const UserService = require('../../services/user')

async function unitedPayRequest (payParams, goodData) {
  // "prepay_id=wx192338501021972f31d1bbaa1648747900"
  const { appId, nonceStr, packageValue, paySign, signType, timeStamp } = payParams
  const { body } = goodData

  let openParams = wx.getStorageSync('open_params')
  if (!openParams) {
    const userInfo = app.globalData.userInfo
    const serverUserInfo = await UserService.getUserInfo(userInfo)
    openParams = {
      openid: serverUserInfo.openid
    }
  }

  //统一支付签名
  // var appid = '';//appid必填
  // var body = '';//商品名必填
  var mch_id = '';//商户号必填
  // var nonce_str = util.randomString();//随机字符串，不长于32位。  
  var notify_url = '';//通知地址必填
  var total_fee = parseInt(0.01 * 100); //价格，这是一分钱
  var trade_type = "JSAPI";
  var key = ''; //商户key必填，在商户后台获得
  var out_trade_no = '';//自定义订单号必填

  var unifiedPayment = 'appid=' + appid + '&body=' + body + '&mch_id=' + mch_id + '&nonce_str=' + nonceStr + '&notify_url=' + notify_url + '&openid=' + openid + '&out_trade_no=' + out_trade_no + '&total_fee=' + total_fee + '&trade_type=' + trade_type + '&key=' + key;
  
  var sign = md5.md5(unifiedPayment).toUpperCase();
  

  //封装统一支付xml参数
  var formData = "<xml>";
  formData += "<appid>" + appid + "</appid>";
  formData += "<body>" + body + "</body>";
  formData += "<mch_id>" + mch_id + "</mch_id>";
  formData += "<nonce_str>" + nonceStr + "</nonce_str>";
  formData += "<notify_url>" + notify_url + "</notify_url>";
  formData += "<openid>" + openid + "</openid>";
  formData += "<out_trade_no>" + that.data.ordernum + "</out_trade_no>";
  formData += "<total_fee>" + total_fee + "</total_fee>";
  formData += "<trade_type>" + trade_type + "</trade_type>";
  formData += "<sign>" + sign + "</sign>";
  formData += "</xml>";
  // console.log("formData", formData);
  //统一支付
  wx.request({
    url: 'https://api.mch.weixin.qq.com/pay/unifiedorder', //别忘了把api.mch.weixin.qq.com域名加入小程序request白名单，这个目前可以加
    method: 'POST',
    head: 'application/x-www-form-urlencoded',
    data: formData, //设置请求的 header
    success: function (res) {
      // console.log("返回商户", res.data);
      var result_code = util.getXMLNodeValue('result_code', res.data.toString("utf-8"));
      var resultCode = result_code.split('[')[2].split(']')[0];
      if (resultCode == 'FAIL') {
        var err_code_des = util.getXMLNodeValue('err_code_des', res.data.toString("utf-8"));
        var errDes = err_code_des.split('[')[2].split(']')[0];
        wx.showToast({
          title: errDes,
          icon: 'none',
          duration: 3000
        })
      } else {
        //发起支付
        var prepay_id = util.getXMLNodeValue('prepay_id', res.data.toString("utf-8"));
        var tmp = prepay_id.split('[');
        var tmp1 = tmp[2].split(']');
        //签名  
        var key = '';//商户key必填，在商户后台获得
        var appId = '';//appid必填
        var timeStamp = util.createTimeStamp();
        var nonceStr = util.randomString();
        var stringSignTemp = "appId=" + appId + "&nonceStr=" + nonceStr + "&package=prepay_id=" + tmp1[0] + "&signType=MD5&timeStamp=" + timeStamp + "&key=" + key;
        // console.log("签名字符串", stringSignTemp);
        var sign = md5.md5(stringSignTemp).toUpperCase();
        // console.log("签名", sign);
        var param = { "timeStamp": timeStamp, "package": 'prepay_id=' + tmp1[0], "paySign": sign, "signType": "MD5", "nonceStr": nonceStr }
        // console.log("param小程序支付接口参数", param);
        that.processPay(param);
      }

    },
  })
}

  /* 小程序支付 */
function processPay(param) {
  wx.requestPayment({
    timeStamp: param.timeStamp,
    nonceStr: param.nonceStr,
    package: param.package,
    signType: param.signType,
    paySign: param.paySign,
    success: function (res) {
      // success
      // console.log("wx.requestPayment返回信息", res);
      wx.showModal({
        title: '支付成功',
        content: '您将在“微信支付”官方号中收到支付凭证',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          } else if (res.cancel) {
          }
        }
      })
    },
    fail: function () {
      // console.log("支付失败");
    },
    complete: function () {
      // console.log("支付完成(成功或失败都为完成)");
    }
  })
}

module.exports = {
  processPay
}