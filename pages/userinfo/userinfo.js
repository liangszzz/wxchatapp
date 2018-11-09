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
    userInfo: {},
    fromType: 1, // 1：订单页进入 2：我的页面进入
    helthIndex: 0,
    helthArray: [],
    idIndex: 0,
    idArray: [],
    eduIndex: 0,
    eduArray: [],
    clientIndex: 0,
    clientArray: [],
    bankIndex: 0,
    bankArray: [],
    marriageIndex: 0,
    marriageArray: [],
    relationshipArray: [],
    relationIndexArray: [],
    orderStatus: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var idcard = '';
    var biz_order_no = '';
    var orderStatus = '';
    var fromType = options.fromType;
    biz_order_no = options.biz_order_no;
    if (fromType == 2) {
      orderStatus = options.orderStatus;
    }
    that.initValidate()
    var imglist = that.data.imglist;
    var helthIndex = that.data.helthIndex;
    var idIndex = that.data.idIndex;
    var eduIndex = that.data.eduIndex;
    var clientIndex = that.data.clientIndex;
    var bankIndex = that.data.bankIndex;
    var marriageIndex = that.data.marriageIndex;
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
          var clUserInfo = res.data.dataMap.clUserInfo; //用户基本信息
          var clContactInfoList = res.data.dataMap.clContactInfoList; //联系人信息
          var clAttachmentInfoList = res.data.dataMap.clAttachmentInfoList; //附件信息
          for (var index in clAttachmentInfoList) {
            imglist[index] = clAttachmentInfoList[index].fast_dfs_path
          }
          var helthArray = res.data.dataMap.health; //身体状况
          for (var index in helthArray) {
            if (helthArray[index].value == clUserInfo.health_status) {
              helthIndex = index;
            }
          }
          var idArray = res.data.dataMap.identity_type; //身份类型
          for (var index in idArray) {
            if (idArray[index].value == clUserInfo.identity_type) {
              idIndex = index;
            }
          }
          var eduArray = res.data.dataMap.degreeS; //最高学历
          for (var index in eduArray) {
            if (eduArray[index].value == clUserInfo.degree) {
              eduIndex = index;
            }
          }
          var clientArray = res.data.dataMap.customerInfo; //客户职业信息
          for (var index in clientArray) {
            if (clientArray[index].value == clUserInfo.customer_professional_info) {
              clientIndex = index;
            }
          }
          var bankArray = res.data.dataMap.bankCards; //银行卡类型
          for (var index in bankArray) {
            if (bankArray[index].value == clUserInfo.bank_card_type) {
              bankIndex = index;
            }
          }
          var marriageArray = res.data.dataMap.marital_status; //婚姻状况
          for (var index in idArray) {
            if (marriageArray[index].value == clUserInfo.marital_status) {
              marriageIndex = index;
            }
          }
          var relationIndexArray = that.data.relationIndexArray;
          var relationshipArray = res.data.dataMap.relationShip; //社会关系
          for (var i in clContactInfoList) {
            var relation = clContactInfoList[i].contact_relationship;
            for (var index in relationshipArray) {
              if (relation == relationshipArray[index].value) {
                relationIndexArray[i] = index
              }
            }
          }
          that.setData({
            clUserInfo: clUserInfo,
            imglist: imglist,
            clContactInfoList: clContactInfoList,
            fromType: fromType,
            helthArray: helthArray,
            idArray: idArray,
            eduArray: eduArray,
            clientArray: clientArray,
            bankArray: bankArray,
            marriageArray: marriageArray,
            helthIndex: helthIndex,
            idIndex: idIndex,
            clientIndex,
            clientIndex,
            bankIndex: bankIndex,
            eduIndex: eduIndex,
            marriageIndex: marriageIndex,
            relationshipArray: relationshipArray,
            relationIndexArray: relationIndexArray,
            orderStatus: orderStatus
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
              file_type: "1",
              biz_order_no: that.data.clUserInfo.biz_order_no
            },
            success: function(res) {
              let data = JSON.parse(res.data);
              if (res.statusCode == 200 && data.code == 0) {
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
    var fromType =that.data.fromType;
    let data = e.detail.value
    if (this.data.imglist.length < 2) {
      wx.showToast({
        title: '缺少图片信息，请上传图片',
        icon: 'none',
        duration: 2000 //持续的时间
      })
      return false
    }
    // 传入表单数据，调用验证方法
    if (!this.WxValidate.checkForm(data)) {
      const error = this.WxValidate.errorList[0];
      wx.showToast({
        title: error.msg,
        icon: 'none',
        duration: 2000 //持续的时间
      })
      return false
    }

    var health_status = this.data.helthArray[data.health_status].value;
    var identity_type = this.data.idArray[data.identity_type].value;
    var degree = this.data.eduArray[data.degree].value;
    var customer_professional_info = this.data.clientArray[data.customer_professional_info].value;
    var bank_card_type = this.data.bankArray[data.bank_card_type].value;
    var marital_status = this.data.marriageArray[data.marital_status].value;

    data.health_status = health_status;
    data.identity_type = identity_type;
    data.degree = degree;
    data.customer_professional_info = customer_professional_info;
    data.bank_card_type = bank_card_type;
    data.marital_status = marital_status;

    var clContactInfoList = this.data.clContactInfoList;
    var contactArray = [];
    for (var index in clContactInfoList) {
      var item = new Object();
      var name = 'contact_name_' + index;
      var phone = 'contact_phone_' + index;
      var relationShip = 'contact_relationship_' + index;
      var contact_name = data[name];
      var contact_phone = data[phone];
      var contact_relationship = this.data.relationshipArray[data[relationShip]].value;
      item.contact_name = contact_name;
      item.contact_phone = contact_phone;
      item.contact_relationship = contact_relationship;
      contactArray[index] = item;
    }
    data.contactArray = contactArray;
    //后台保存数据
    wx.request({
      url: app.globalData.http_url_head + 'user/save',
      header: {
        token: app.globalData.userInfo.token
      },
      data: {
        data: data
      },
      method: "post",
      success: function(res) {
        if (res.data.code == 0 && res.statusCode == 200) {
          if (fromType == 1){
            wx.navigateTo({
              url: '../carinfo/carinfo?biz_order_no=' + that.data.clUserInfo.biz_order_no + '&fromType=1',
            })
          }else{
            wx.showToast({
              title: '修改成功',
              icon: 'success',
              duration: 2000
            })
          }
        }
      },
      fail: function() {
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
      bank_account: {
        required: true,
      },
      personal_income: {
        required: true,
      },
      bank_name: {
        required: true,
      },
      certificate_expiry_date: {
        required: true,
      },
      company_name: {
        required: true,
      },
      company_phone_no: {
        required: true,
      },
      reserve_phone_no: {
        required: true,
      },
      residential_address: {
        required: true,
      },
      wechat: {
        required: true,
      },
    }

    // 验证字段的提示信息，若不传则调用默认的信息
    const messages = {
      idcard_address: {
        required: "身份证地址不能为空",
      },
      bank_account: {
        required: "银行卡号不能为空",
      },
      bank_name: {
        required: "开户行名称不能为空",
      },
      certificate_expiry_date: {
        required: "证件到期时间不能为空",
      },
      company_name: {
        required: "公司名称不能为空",
      },
      company_phone_no: {
        required: "公司电话不能为空",
      },
      reserve_phone_no: {
        required: "预留手机号码不能为空",
      },
      residential_address: {
        required: "现居住地址不能为空",
      },
      wechat: {
        required: "微信号不能为空",
      },
      personal_income: {
        required: "个人年总收入不能为空",
      },
    }
    // 创建实例对象
    this.WxValidate = new WxValidate(rules, messages)
  },


  /**
   * 所有选择监听
   */
  bindHelthChange: function(e) {
    this.setData({
      helthIndex: e.detail.value
    })
  },
  bindidChange: function(e) {
    this.setData({
      idIndex: e.detail.value
    })
  },
  bindeduChange: function(e) {
    this.setData({
      eduIndex: e.detail.value
    })
  },
  bindclientChange: function(e) {
    this.setData({
      clientIndex: e.detail.value
    })
  },
  bindbankChange: function(e) {
    this.setData({
      bankIndex: e.detail.value
    })
  },
  bindmarriageChange: function(e) {
    this.setData({
      marriageIndex: e.detail.value
    })
  },

  bindshipChange: function(e) {
    var relationIndexArray = this.data.relationIndexArray;
    relationIndexArray[e.target.dataset.id] = e.detail.value;
    this.setData({
      relationIndexArray: relationIndexArray
    })
  },

  binddateChange:function(e){
    var clUserInfo = this.data.clUserInfo;
    clUserInfo.certificate_expiry_date = e.detail.value
    this.setData({
      clUserInfo: clUserInfo
    })
  },

  /**
   * 返回按钮
   */
  back: function() {
    wx.navigateBack({
      delta: 1
    })
  }

})