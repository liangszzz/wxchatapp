import WxValidate from '../../assets/plugins/wx-validate/WxValidate'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imglist: [],
    clContactInfoList: [],
    clUserInfo: {},
    userInfo:{},
    fromType: '', // 1：订单页进入 2：我的页面进入
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var idcard = '';
    var biz_order_no = '';
    var fromType = that.data.fromType;
    if (options.idcard != '' && options.idcard != null) { //从我的页面进入
      fromType = 2;
      idcard = options.idcard
    } else { //订单页进入传bizOrderNo
      fromType = 1;
      biz_order_no = options.biz_order_no;
    }
    that.initValidate()
    var imglist = that.data.imglist;
    //请求后台获取相关信息
    wx.request({
      url: app.globalData.http_url_head + "user/query",
      header: {
        token: app.globalData.userInfo.token
      },
      method: 'POST',
      data: {
        biz_order_no: biz_order_no,
        idcard: idcard
      },
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
            fromType: fromType
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
  previewImage: function(e) {
    var that = this;
    var imglist = that.data.imglist;
    var currentUrl = e.target.dataset.src;
    if (currentUrl == '' || currentUrl == null) { //缺少图片
      wx.chooseImage({
        count: 1, //一次只允许一张
        sizeType: ['original', 'compressed'], //可选择原图或缩略图
        sourceType: ['album', 'camera'], //访问相册、相机
        success: function(res) {
          var tempFilePaths = res.tempFilePaths;
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
              file_type:"1",
              biz_order_no: that.data.clUserInfo.biz_order_no
            },
            success: function(res) {
              let data = JSON.parse(res.data);
              if(res.statusCode == 200 && data.code == 0){
                imglist[imglist.length] = data.entity.file_path;
                that.setData({
                  imglist: imglist
                })
              }
            },
            fail: function() {
              console.log("身份证照上传失败！");
            }
          })
        },
      })
    } else {
      wx.previewImage({
        current: currentUrl, // 当前显示图片的http链接
        urls: this.data.imglist // 需要预览的图片http链接列表
      })
    }
  },

  /**
   * 提交
   */
  formSubmit: function(e) {
    var that = this;
    var openId = app.globalData.userInfo.openId;
    var formId = e.detail.formId;
    let data = e.detail.value
    console.log(data);
    if(this.data.imglist.length<2){
      wx.showToast({
        title: '缺少图片信息，请上传图片',
        icon: 'none',
        duration: 2000 //持续的时间
      })
      return false
    }
    // 传入表单数据，调用验证方法
    if (!this.WxValidate.checkForm(data)) {
      const error = this.WxValidate.errorList[0]
      console.log(error);
      return false
    }
    //后台保存数据
    wx.request({
      url: app.globalData.http_url_head+'user/save',
      header:{
        token:app.globalData.userInfo.token
      },
      data:{
        data:data
      },
      method:"post",
      success:function(res){
        wx.navigateTo({
          url: '../carinfo/carinfo?biz_order_no=' + that.data.clUserInfo.biz_order_no,
        })
        
      },
      fail:function(){
        console.log("数据保存失败")
      }
    })
   
  },

  initValidate() {
    // 验证字段的规则
    const rules = {
      idcard_address: {
        required: true,
      },
    }

    // 验证字段的提示信息，若不传则调用默认的信息
    const messages = {
      idcard_address: {
        required: '身份证居住地址不能为空',
      },
    }
    // 创建实例对象
    this.WxValidate = new WxValidate(rules, messages)
  },
})