//index.js
const app = getApp()

function mGetDate() {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var d = new Date(year, month, 0);
  return d.getDate();
}

function compare(propertyName) {
  return function (object1, object2) {
    var value1 = object1[propertyName];
    var value2 = object2[propertyName];
    if (value2 > value1) {
      return 1;
    } else if (value2 < value1) {
      return -1;
    } else {
      return 0;
    }
  }
}

function getshichang(d, tday, zhangdanDay, huangkuanDay) {
  var shichang = 0;
  if (Number(huangkuanDay) > Number(zhangdanDay)) {
    if (tday > Number(zhangdanDay)) {
      shichang = Number(d) - Number(tday);
      shichang += Number(huangkuanDay);
    } else {
      shichang = Number(zhangdanDay) - Number(tday);
      shichang += Number(huangkuanDay) - Number(zhangdanDay);
    }

  } else {
    if (tday > Number(zhangdanDay)) {
      shichang = Number(d) - Number(tday);
      shichang += Number(huangkuanDay);
      shichang += 30;
    } else {
      shichang = Number(d) - Number(tday);
      shichang += Number(huangkuanDay);
    }

  }
  return shichang;
}

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    queryResult: [],
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    getUserInfo: true,
  },

  getUserInfo: function (e) {
    let userInfo = e.detail.userInfo
    console.log(userInfo)
    this.setData({
      userInfo: userInfo,
      getUserInfo: false
    })
  },

  onLoad: function () {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }


    wx.showLoading({
      title: '数据加载中...',
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })

    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('card').where({
      _openid: this.data.openid
    }).get({
      success: res => {
        // this.setData({
        //   queryResult: res.data
        // })

        var date = new Date();
        var myDayDate = date.getDate()
        var d = mGetDate();
        console.log(d);

        console.log('[数据库] [查询记录] 成功: ', res)
        console.log(myDayDate)

        var data = [];
        if (res.data.length == 0) {
          wx.hideLoading()
          wx.showModal({
            title: '提示',
            content: '您还没用添加任何信用卡哦\r\n添加信用卡后您将可以看到今日刷卡后剩余还款期限，从而选择最合适的信用卡去刷\r\n快去添加吧',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/card/card'
                })
                console.log('用户点击确定')
              }
            }
          });
        }

        res.data.forEach(function (item) {
          var shichang = getshichang(d, myDayDate, item.zhangdanDay, item.huangkuanDay);

          var s = {};
          s.yinhang = item.yinhang;
          s._id = item._id;
          s.huangkuanDay = item.huangkuanDay;
          s.zhangdanDay = item.zhangdanDay;
          s.shichang = shichang;
          data.push(s);
        })

        data.sort(compare("shichang"));
        this.setData({
          queryResult: data
        })
        wx.hideLoading()
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        wx.hideLoading()
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  onShow: function () {

    this.onLoad();
  },
  openAlert: function () {
    wx.showModal({
      content: '弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
      }
    });
  },

  onGetUserInfo: function (e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  deleteFun: function (event) {
    var id = event.currentTarget.dataset.id
    console.info(id);

    const db = wx.cloud.database()
    db.collection('card').doc(id).remove({
      success: res => {
        wx.showToast({
          title: '删除成功',
        })
        this.onLoad();
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '删除失败',
        })
        console.error('[数据库] [删除记录] 失败：', err)
      }
    })
  }

})