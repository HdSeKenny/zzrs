const { $Toast } = require('../iview/dist/base/index');

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const Toast = {
  warning: msg => {
    setTimeout(() => {
      $Toast({
        content: msg,
        type: 'warning',
        duration: 3
      })
    }, 500)
  },
  hide: () => {
    $Toast.hide()
  },
  error: msg => {
    setTimeout(() => {
      $Toast({
        content: msg,
        type: 'error',
        duration: 3
      })
    }, 500)
  }
}

const keepDecimalSpaces = (value, num) => {
  return Math.round(value * (Math.pow(10, num))) / (Math.pow(10, num))
}

module.exports = {
  formatTime,
  Toast,
  keepDecimalSpaces
}
