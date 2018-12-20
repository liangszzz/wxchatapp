const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    biz_order_no: '',
    imageData: '',
    isValidate: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let biz_order_no = options.biz_order_no;
    this.setData({
      biz_order_no: biz_order_no
    })
  },

  previewImage: function() {
    let that = this;
    let videoBase64String = ''
    let biz_order_no = this.data.biz_order_no
    wx.chooseImage({
      count: 1, //一次只允许一张
      sizeType: ['original', 'compressed'], //可选择原图或缩略图
      sourceType: ['album', 'camera'], //访问相册、相机
      success: function(res) {
        let tempFilePaths = res.tempFilePaths;
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            videoBase64String = res.data
            that.setData({
              imageData: 'data:image/png;base64,' + videoBase64String
            })

            wx.request({
              url: app.globalData.http_url_head + "face/verify",
              method: 'POST',
              header: {
                token: app.globalData.userInfo.token
              },
              data: {
                bizOrderNo: biz_order_no,
                videoBase64String: videoBase64String
              },
              success: function(res) {
                if (res.statusCode == 200 && res.data.code == 0) {
                  wx.showToast({
                    title: '人脸验证成功',
                  })
                  that.setData({
                    isValidate: true
                  })
                }else{
                  wx.showToast({
                    title: '人脸验证失败，请点击照片重新上传',
                    icon: 'none',
                    duration: 2000
                  })
                }
              },
              fail: function() {
                console.log("服务器异常")
              }
            })
          }
        })


      },
    })
  },


  toNext: function() {
    if (this.data.isValidate == false) {
      wx.showToast({
        title: '请先完成人脸验证',
        icon: 'none',
        duration: 2000
      })
      return false;
    }

    wx.navigateTo({
      url: '../sign/sign?biz_order_no=' + this.data.biz_order_no + '&page_type=1&channel_type=1'
    })
  }


})