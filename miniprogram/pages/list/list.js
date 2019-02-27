// miniprogram/pages/list/list.js
function mGetDate() {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var d = new Date(year, month, 0);
  return d.getDate();
}


function mGetMonth() {
  var date = new Date();
  var month = date.getMonth() + 1;
  return month;
}


function getshichagn(d, tday, zhangdanDay, huangkuanDay) {
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

  /**
   * 页面的初始数据
   */
  data: {
    yinhang: '',
    huangkuanDay: '',
    zhangdanDay: '',
    month: '',
    showdata: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.setData({
      yinhang: options.yinhang,
      huangkuanDay: options.huangkuanDay,
      zhangdanDay: options.zhangdanDay,
      month: mGetMonth()
    })

    var d = mGetDate();
    var rd = [];
    var arrStr = '';
    for (var i = 1; i <= d; i++) {
      arrStr = {
        d: i,
        s: getshichagn(d, i, this.data.zhangdanDay, this.data.huangkuanDay)
      };
      rd.push(arrStr);
    }
    that.setData({
      showdata: rd
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})