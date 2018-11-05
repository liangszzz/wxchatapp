// pages/personal/personal.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imglist:[],
    clContactInfoList:[],
    clUserInfo:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var idCard = app.globalData.userInfo.idcard;
    var imglist = that.data.imglist;
    //请求后台获取相关信息
    wx.request({
      url: app.globalData.http_url_head + "user/query/"+idCard,
      header: {
        token: app.globalData.userInfo.token
      },
      method: 'POST',
      success: function(res) {
        if (res.statusCode == 200 && res.data.code == 0) {
          var clUserInfo = res.data.dataMap.clUserInfo;
          console.log(clUserInfo);
          var clContactInfoList = res.data.dataMap.clContactInfoList;
          console.log(clContactInfoList);
          var clAttachmentInfoList = res.data.dataMap.clAttachmentInfoList;
          console.log(clAttachmentInfoList);
          for (var index in clAttachmentInfoList) {
            imglist[index] = clAttachmentInfoList[index].fast_dfs_path
          }
          that.setData({
            clUserInfo: clUserInfo,
            imglist: imglist,
            clContactInfoList: clContactInfoList,
          })
        }
      },
      fail: function() {
        console.log("获取后台失败！");
      }
    })
  },
  /**
     * 预览身份证
     */
  previewImage: function (e) {
    var currentUrl = e.target.dataset.src;
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接
      urls: this.data.imglist // 需要预览的图片http链接列表
    })
  },

  /**
   * 提交
   */
  formSubmit: function (e) {
    var openId = this.data.userInfo.openId;
    var biz_order_no = this.data.biz_order_no;
    var formId = e.detail.formId;
  },
})