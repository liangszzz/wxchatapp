const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    biz_order_no: '',
    imageData: '',
    able: true
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
        that.uploadImage(tempFilePaths)

      }
    })
  },

  uploadImage: function(tempFilePaths) {
    let that = this
    //图片上传
    wx.uploadFile({
      url: app.globalData.http_url_head + 'attachmentInfo/uploadFile',
      filePath: tempFilePaths[0],
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data",
        token: app.globalData.userInfo.token
      },
      formData: { //传图片的类型，内单号
        file_type: 100,
        biz_order_no: this.data.biz_order_no,
        formType: 0
      },
      success: function(res) {
        let data = JSON.parse(res.data);
        if (res.statusCode == 200 && data.code == 0) {
          that.setData({
            imageData: data.msg
          })
          that.validate(tempFilePaths)
        }
      },
      fail: function() {
        console.log("脸部照片上传失败！");
      }
    })
  },

  validate: function (tempFilePaths) {
    let biz_order_no = this.data.biz_order_no
    let videoBase64String=''
    let that = this
    wx.getFileSystemManager().readFile({
      filePath: tempFilePaths[0], //选择图片返回的相对路径
      encoding: 'base64', //编码格式
      success: res => { //成功的回调
        videoBase64String = res.data
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
          success: function (res) {
            if (res.statusCode == 200 && res.data.code == 0) {
              wx.showToast({
                title: '人脸验证成功',
              })
              that.setData({
                able: false
              })
            } else {
              wx.showToast({
                title: '人脸验证失败，请点击照片重新上传',
                icon: 'none',
                duration: 2000
              })
            }
          },
          fail: function () {
            console.log("服务器异常")
          }
        })
      }
    })

  },


  toNext: function() {

    wx.navigateTo({
      url: '../sign/sign?biz_order_no=' + this.data.biz_order_no + '&page_type=1&channel_type=1'
    })
  }


})