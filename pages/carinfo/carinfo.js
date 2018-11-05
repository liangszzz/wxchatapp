const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    clCarInfo:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var idCard = app.globalData.userInfo.idcard;
    //请求后台获取相关信息
    wx.request({
      url: app.globalData.http_url_head + "car/query/" + idCard,
      header: {
        token: app.globalData.userInfo.token
      },
      method: 'POST',
      success: function(res) {
        if (res.statusCode == 200 && res.data.code == 0) {
          var clCarInfo = res.data.dataMap.clCarInfo; //车辆基本信息
          console.log(clCarInfo);
          var carList = res.data.dataMap.carList; //车辆照片
          console.log(carList);
          var cardriveListList = res.data.dataMap.cardriveListList; //行驶证
          console.log(cardriveListList);
          var registerList = res.data.dataMap.registerList //机动车登记证书
          console.log(registerList);
          
          that.setData({
            clCarInfo: clCarInfo,  
          })
        }
      },
      fail: function() {
        console.log("获取后台失败！");
      }
    })
  },

})