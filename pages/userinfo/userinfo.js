import WxValidate from '../../assets/plugins/wx-validate/WxValidate'
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
    //从订单页进入传bizOrderNo,如果是从我的页面进入传idCard,再区分页面按钮是下一步还是修改，如果是修改再判断状态值，非19不显示修改按钮
    var that = this;
    that.initValidate()
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
    if (currentUrl == '') {//缺少图片
      wx.chooseImage({
        count:1,//一次只允许一张
        sizeType: ['original', 'compressed'],  //可选择原图或缩略图
        sourceType: ['album', 'camera'], //访问相册、相机
        success: function(res) {
          var tempFilePaths = res.tempFilePaths;
          //图片上传
          wx.uploadFile({
            url: this.globalData.http_url_head + 'attachmentInfo/uploadFile',
            filePath: tempFilePaths[0],
            name: 'file',
            header: {
              "Content-Type": "multipart/form-data",
              token: app.globalData.userInfo.token
            },
            formData:{ //传图片的类型，外单号，内单号
            },
            success:function(res){
              console.log(res);
            },
            fail:function(){
              console.log("身份证照上传失败！");
            }
          })
        },
      })
    }else{
      wx.previewImage({
        current: currentUrl, // 当前显示图片的http链接
        urls: this.data.imglist // 需要预览的图片http链接列表
      })
    } 
  },

  /**
   * 提交
   */
  formSubmit: function (e) {
    var openId = this.data.userInfo.openId;
    var formId = e.detail.formId;
    let data = e.detail.value
    console.log(data)
    // 传入表单数据，调用验证方法
    if (!this.WxValidate.checkForm(data)) {
      const error = this.WxValidate.errorList[0]
      console.log(error);
      return false
    }
  },

  initValidate() {
    // 验证字段的规则
    const rules = {
      gender: {
        required: true,
      },
      assistance: {
        required: true,
        assistance: true,
      },
      email: {
        required: true,
        email: true,
      },
      tel: {
        required: true,
        tel: true,
      },
      idcard: {
        required: true,
        idcard: true,
      },
      password: {
        required: true,
        minlength: 6,
        maxlength: 15,
      },
      confirmPassword: {
        required: true,
        minlength: 6,
        maxlength: 15,
        equalTo: 'password',
      },
      countryIndex: {
        required: true,
      },
      slider: {
        required: true,
        min: 40,
        max: 80,
      },
      agree: {
        required: true,
      },
      textarea: {
        required: true,
        contains: '自愿',
      },
    }

    // 验证字段的提示信息，若不传则调用默认的信息
    const messages = {
      gender: {
        required: '请选择性别',
      },
      assistance: {
        required: '请勾选1-2个敲码助手',
      },
      email: {
        required: '请输入邮箱',
        email: '请输入正确的邮箱',
      },
      tel: {
        required: '请输入手机号',
        tel: '请输入正确的手机号',
      },
      idcard: {
        required: '请输入身份证号码',
        idcard: '请输入正确的身份证号码',
      },
      password: {
        required: '请输入新密码',
        minlength: '密码长度不少于6位',
        maxlength: '密码长度不多于15位',
      },
      confirmPassword: {
        required: '请输入确认密码',
        minlength: '密码长度不少于6位',
        maxlength: '密码长度不多于15位',
        equalTo: '确认密码和新密码保持一致',
      },
      countryIndex: {
        required: '请选择国家/地区',
      },
      slider: {
        required: '请选择年龄',
        min: '年龄不小于18',
        max: '年龄不大于60',
      },
      agree: {
        required: '请同意我们的声明',
      },
      textarea: {
        required: '请输入文本',
        contains: '请输入文本（必须含有自愿两字）',
      },
    }
    // 创建实例对象
    this.WxValidate = new WxValidate(rules, messages)
  },
})