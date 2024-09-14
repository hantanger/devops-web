export default function (canvasRef) {
  let canvas
  var starsCount = 300 // 星星数量
  let stars = []
  let interval
  let context

  function start() {
    // 初始化
    canvas = canvasRef.value
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    context = canvas.getContext('2d')
    stars = [] // 数组存放随机生成的星星数据（x,y,大小，颜色，速度）

    clearInterval(interval)
    makeStars()
    interval = setInterval(function () {
      // 定时刷新星星数据
      canvas ? drawStars() : clearInterval(interval)
    }, 50)
  }

  // 随机生成星星数据
  function makeStars() {
    for (var i = 0; i < starsCount; i++) {
      const x = Math.random() * canvas.offsetWidth
      const y = Math.random() * canvas.offsetHeight
      const radius = Math.random() * 0.8
      const color =
        'rgba(' +
        Math.random() * 255 +
        ',' +
        Math.random() * 255 +
        ',' +
        Math.random() * 255 +
        ',0.8)'
      const speed = Math.random() * 0.5
      const arr = { x: x, y: y, radius: radius, color: color, speed: speed } // （x,y,大小，颜色，速度）
      stars.push(arr) // 随机生成的星星数据存在这里
    }
  }

  // 把星星画到画布上
  function drawStars() {
    context.fillStyle = '#0e1729'
    context.fillRect(0, 0, canvas.width, canvas.height)
    for (let i = 0; i < stars.length; i++) {
      let x = stars[i].x - stars[i].speed
      if (x < -2 * stars[i].radius) x = canvas.width
      stars[i].x = x
      const y = stars[i].y
      const radius = stars[i].radius
      context.beginPath()
      context.arc(x, y, radius * 2, 0, 2 * Math.PI)
      context.fillStyle =
        'rgba(' +
        Math.random() * 255 +
        ',' +
        Math.random() * 255 +
        ',' +
        Math.random() * 255 +
        ',0.8)'
      context.fill()
    }
  }

  function stop() {
    window.removeEventListener('resize', resize)
  }

  function resize() {
    start()
  }

  window.addEventListener('resize', resize)

  return {
    start,
    stop,
  }
}
