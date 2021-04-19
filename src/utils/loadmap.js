/* eslint-disable */
export function loadAMap() {
  return new Promise((resolve, reject) => {
    if (window.AMap) {
      resolve(window.AMap)
    }
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://webapi.amap.com/maps?v=2.0&key=9a30153b24a92e6b3136253da83fc528&callback=init'
    script.onerror = reject
    document.head.appendChild(script)
    window.init = () => {
      resolve(window.AMap)
    }
  })
}
