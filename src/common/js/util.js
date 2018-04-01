/* 解析url参数
@example ?id-12345&a=b
@return Object {
    id: 12345,
    a: b
} */

export function urlParse () {
//   把url参数部分 解析成对象
  let url = window.location.search
  let obj = {}
  let reg = /[?&][^?&]+=[^?&]+/g
  let arr = url.match(reg)
  // ['?id=12345', '&a=b']
  if (arr) {
    arr.forEach((item) => {
      let tempArr = item.substring(1).split('=')
      let key = decodeURIComponent(tempArr[0]) // id
      let val = decodeURIComponent(tempArr[1]) // 12345
      obj[key] = val
    })
  }
  return obj
}
