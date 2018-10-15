//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: []
  },
  onPullDownRefresh:function(){
    console.log("###上拉")
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  }
})
