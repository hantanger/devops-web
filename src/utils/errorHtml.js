export default function (str) {
  if (!str) return
  let arr = str.split('\r\n')
  arr = arr.map((item) => {
    if (/error|exception/i.test(item)) {
      return `<div class="u-error">${item}</div>`
    } else {
      return `<div>${item}</div>`
    }
  })
  return arr.join('')
}
