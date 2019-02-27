Page({
  data: {
    countries: ["中信", "广发", "交通", "浦发", "招商", "工商"],
    day: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
      "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
      "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"
    ],

    countryIndex: 0,
    zhangdanIndex: 0,
    huangkuanIndex: 0

  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindCountryChange: function (e) {
    console.log('picker country 发生选择改变，携带值为', e.detail.value);

    this.setData({
      countryIndex: e.detail.value
    })
  },

  bindZhangDanChange: function (e) {
    console.log('picker country 发生选择改变，携带值为', e.detail.value);

    this.setData({
      zhangdanIndex: e.detail.value
    })
  },


  bindHuanKuanChange: function (e) {
    console.log('picker country 发生选择改变，携带值为', e.detail.value);

    this.setData({
      huangkuanIndex: e.detail.value
    })
  },
  confirm: function () {
    console.log(this.data.countries[this.data.countryIndex]);
    console.log(this.data.day[this.data.huangkuanIndex]);

    const db = wx.cloud.database()
    db.collection('card').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
        yinhang: this.data.countries[this.data.countryIndex],
        zhangdanDay: this.data.day[this.data.zhangdanIndex],
        huangkuanDay: this.data.day[this.data.huangkuanIndex],
      },
      success: function (res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res),
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 1000
          })

        setTimeout(function () {
          wx.navigateBack()
        }, 1100)



      }
    })
  },
});