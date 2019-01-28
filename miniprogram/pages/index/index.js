//index.js
const app = getApp()
const db = wx.cloud.database()
const book = db.collection('mybook')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    book_list: [],
    isAuth:false
  },

  goBook: function (event) {
    console.log(event)
    const id = event.target.dataset.id;
    wx.navigateTo({
      url: '../bookDetail/bookDetail?id=' + id,
    })
  },
  scanCode: function (event) {
    // 只允许从相机扫码
    wx.scanCode({
      onlyFromCamera: true,
      scanType: 'barCode',
      success: (res) => {
        console.log(res.result)
        wx.cloud.callFunction({
          // 云函数名称
          name: 'bookinfo',
          // 传给云函数的参数
          data: {
            isbn: res.result
          },
          success: function (res) {
            const bookString = res.result
            console.log(JSON.parse(bookString)) // 3
            const db = wx.cloud.database()
            const book = db.collection('mybook')
            //插入数据
            db.collection('mybook').add({
              // data 字段表示需新增的 JSON 数据
              data: JSON.parse(bookString)
            }).then(res => {
              console.log(res)
              if (res.errMsg == 'collection.add:ok') {
                wx.showToast({
                  title: '添加成功',
                  icon: 'success',
                  duration: 2000
                })
              }
            }).catch(err => {
              console.log(err)
            })
          },
          fail: err => {
            console.error(err)
          }
        })
      },
      fail: res => {
        console.log(res)
      }
    })
    // https://api.douban.com/v2/book/isbn/9787802205383
  },
  onGotUserInfo(e) {
    var _this=this
    console.log(e)
    console.log(e.detail.errMsg)
    console.log(e.detail.userInfo)
    console.log(e.detail.rawData)
    //插入用户信息数据
    if (e.detail.errMsg =='getUserInfo:ok'){
      db.collection('userInfo').add({
        // data 字段表示需新增的 JSON 数据
        data: e.detail.userInfo
      }).then(res => {
        console.log(res)
        _this.setData({
          isAuth: true
        })
      }).catch(err => {
        console.log(err)
      })
    }else{
      wx.showToast({
        title: '请授权后在体验小程序',
        icon:'none'
      })
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.getSetting({
      success(res) {
        console.log(res)
        console.log(res.authSetting)
        var auth = res.authSetting
        if (res.authSetting['scope.userInfo']){
          _this.setData({
            isAuth:true
          })
        }
        // res.authSetting = {
        //   "scope.userInfo": true,
        //   "scope.userLocation": true
        // }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var _this = this;
    db.collection('mybook').get({
      success: res => {
        console.log(res.data)
        this.setData({
          book_list: res.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})