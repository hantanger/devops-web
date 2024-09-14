function fillZero(str, len) {
  const newStr = '0000' + str
  return newStr.substring(newStr.length - len)
}

function extractProps(d) {
  return {
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    day: d.getDate(),
    hour: d.getHours(),
    minute: d.getMinutes(),
    milliseconds: d.getMilliseconds(),
  }
}

function isDateStr(str) {
  return (
    typeof str === 'string' &&
    /[0-9]{4}[-/][0-9]{1,2}[-/][0-9]{1,2}.*/.test(str)
  )
}

function isNumber(d) {
  return typeof d === 'number'
}
function isDate(d) {
  return d instanceof Date
}

/**
 * 美化时间显示
 * @param {String | Number | Date} originArg 需要转换的时间
 * @param {Date} nDate 可选，相对的时间，默认为new Date()
 * @returns 美化后的时间字符串
 */
export function friendlyTime(originArg, nDate) {
  let originDate = null
  if (isDateStr(originArg)) {
    // 字符串
    originDate =
      originArg.indexOf('T') > 0
        ? new Date(originArg)
        : new Date(originArg.replace(/-/g, '/'))
  } else if (isDate(originArg)) {
    // 日期
    originDate = originArg
  } else if (isNumber(originArg)) {
    // 数字
    originDate = new Date(originArg)
  } else {
    return ''
  }
  const nowDate = nDate || new Date()
  const originObj = extractProps(originDate)
  const timeLength = originDate - nowDate

  if (timeLength < 0) {
    // 如果为过去时
    if (timeLength > -60000) {
      // 如果小于1分钟，显示几秒前
      return `${Math.round(Math.abs(timeLength) / 1000)}秒前`
    } else if (timeLength <= -60000 && timeLength > -3600000) {
      // 如果小于60分钟，显示几分钟前
      return `${Math.round(Math.abs(timeLength) / 60000)}分钟前`
    } else if (timeLength <= -3600000 && timeLength > -86400000) {
      // 如果小于24小时，显示几小时前
      return `${Math.round(Math.abs(timeLength) / 3600000)}小时前`
    } else if (timeLength <= -86400000 && timeLength > -2592000000) {
      // 如果小于30天，显示几天前
      return `${Math.round(Math.abs(timeLength) / 86400000)}天前`
    } else if (timeLength <= -2592000000 && timeLength > -31536000000) {
      // 如果小于1年，显示几个月前
      return `${Math.round(Math.abs(timeLength) / 2592000000)}个月前`
    }
  } else {
    if (timeLength > 86400000) {
      // 如果大于1天，显示几天后
      return `${Math.round(timeLength / 86400000)}天后`
    } else {
      return '今天'
    }
  }

  // 否则，显示年月日
  return `${originObj.year}-${fillZero(originObj.month, 2)}-${fillZero(
    originObj.day,
    2
  )}`
}

/**
 * 日期时间的格式化
 * @param {String | Number | Date} d 需要转换的时间
 * @param {String} fmt 格式化字符串，如'yyyy-MM-dd hh:mm:ss'
 * @returns 格式化后的时间字符串
 */
export function formatTime(d, fmt) {
  let originDate = null
  if (isDateStr(d)) {
    originDate =
      d.indexOf('T') > 0 ? new Date(d) : new Date(d.replace(/-/g, '/'))
  } else if (isDate(d)) {
    originDate = d
  } else if (isNumber(d)) {
    originDate = new Date(d)
  } else {
    return ''
  }
  const dateObj = extractProps(originDate)
  if (/yyyy/.test(fmt)) fmt = fmt.replace(/yyyy/, dateObj.year)
  if (/MM/.test(fmt)) fmt = fmt.replace(/MM/, fillZero(dateObj.month, 2))
  if (/dd/.test(fmt)) fmt = fmt.replace(/dd/, fillZero(dateObj.day, 2))
  if (/hh/.test(fmt)) fmt = fmt.replace(/hh/, fillZero(dateObj.hour, 2))
  if (/mm/.test(fmt)) fmt = fmt.replace(/mm/, fillZero(dateObj.minute, 2))
  if (/ss/.test(fmt)) fmt = fmt.replace(/ss/, fillZero(dateObj.minute, 2))
  return fmt
}
