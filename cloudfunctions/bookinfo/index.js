// 云函数入口文件
// const cloud = require('wx-server-sdk')

// cloud.init()
const rq = require('request-promise')

// 云函数入口函数
exports.main = async (event, context) => {
  const res = rq('https://api.douban.com/v2/book/isbn/' + event.isbn).then(html => {
    return html;
  }).catch(err => {
    console.log(err)
  })
  return res;
}