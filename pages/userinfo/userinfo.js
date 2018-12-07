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
    wx_app_confirm: '',
    bank_list: [],
    bank_list_index: '',
    channel_type:2
  },

  /**
   * 生命周期函数--监听页面加载
   * fromType 1：从列表页进入详情页 2：从我的页面个人资料页进入
   */
  onLoad: function(options) {
    let that = this;
    let wx_app_confirm = '';
    let channel_type = options.channel_type;
    let fromType = options.fromType;
    let biz_order_no = options.biz_order_no;
    if (fromType == 2) {
      wx_app_confirm = options.wx_app_confirm; //使用订单状态区分页面显示 修改按钮和返回按钮
    }
    that.initValidate()
    let imglist = that.data.imglist;
    let helthIndex = that.data.helthIndex;
    let idIndex = that.data.idIndex;
    let eduIndex = that.data.eduIndex;
    let clientIndex = that.data.clientIndex;
    let bankIndex = that.data.bankIndex;
    let marriageIndex = that.data.marriageIndex;
    let bank_list_index = that.data.bank_list_index;
    //请求后台获取相关信息
    wx.request({
      url: app.globalData.http_url_head + "user/query",
      header: {
        token: app.globalData.userInfo.token
      },
      method: 'POST',
      data: {
        biz_order_no: biz_order_no,
        channel_type: channel_type
      },
      success: function(res) {
        if (res.statusCode == 200 && res.data.code == 0) {
          let clUserInfo = res.data.dataMap.clUserInfo; //用户基本信息
          let clContactInfoList = res.data.dataMap.clContactInfoList; //联系人信息
          let clAttachmentInfoList = res.data.dataMap.clAttachmentInfoList; //附件信息
          let bank_list = res.data.dataMap.bank_list; //银行名称列表
          let bankName = clUserInfo.bank_name;
          for (let index in bank_list) {
            if (bank_list[index] == clUserInfo.bank_name) {
              bank_list_index = index
            }
          }
          for (let index in clAttachmentInfoList) {
            imglist[index] = clAttachmentInfoList[index].fast_dfs_path
          }
          let helthArray = res.data.dataMap.health; //身体状况
          for (let index in helthArray) {
            if (helthArray[index].value == clUserInfo.health_status) {
              helthIndex = index;
            }
          }
          let idArray = res.data.dataMap.identity_type; //身份类型
          for (let index in idArray) {
            if (idArray[index].value == clUserInfo.identity_type) {
              idIndex = index;
            }
          }
          let eduArray = res.data.dataMap.degree; //最高学历
          for (let index in eduArray) {
            if (eduArray[index].value == clUserInfo.degree) {
              eduIndex = index;
            }
          }
          let clientArray = res.data.dataMap.customerInfo; //客户职业信息
          for (let index in clientArray) {
            if (clientArray[index].value == clUserInfo.customer_professional_info) {
              clientIndex = index;
            }
          }
          let bankArray = res.data.dataMap.bankCards; //银行卡类型
          for (let index in bankArray) {
            if (bankArray[index].value == clUserInfo.bank_card_type) {
              bankIndex = index;
            }
          }
          let marriageArray = res.data.dataMap.marital_status; //婚姻状况
          for (let index in idArray) {
            if (marriageArray[index].value == clUserInfo.marital_status) {
              marriageIndex = index;
            }
          }
          let relationIndexArray = that.data.relationIndexArray;
          let relationshipArray = res.data.dataMap.relationShip; //社会关系
          for (let i in clContactInfoList) {
            let relation = clContactInfoList[i].contact_relationship;
            for (let index in relationshipArray) {
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
            wx_app_confirm: wx_app_confirm,
            bank_list: bank_list,
            bank_list_index: bank_list_index,
            channel_type: channel_type
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
    let that = this;
    let imglist = that.data.imglist;
    let currentUrl = e.target.dataset.src;
    if (currentUrl == '' || currentUrl == null) { //缺少图片
      wx.chooseImage({
        count: 1, //一次只允许一张
        sizeType: ['original', 'compressed'], //可选择原图或缩略图
        sourceType: ['album', 'camera'], //访问相册、相机
        success: function(res) {
          let tempFilePaths = res.tempFilePaths;
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
              biz_order_no: that.data.clUserInfo.biz_order_no,
              formType: 1
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
    let that = this;
    let fromType = that.data.fromType;
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

    let health_status = this.data.helthArray[data.health_status].value;
    let identity_type = this.data.idArray[data.identity_type].value;
    let degree = this.data.eduArray[data.degree].value;
    let customer_professional_info = this.data.clientArray[data.customer_professional_info].value;
    let bank_card_type = this.data.bankArray[data.bank_card_type].value;
    let marital_status = this.data.marriageArray[data.marital_status].value;

    data.health_status = health_status;
    data.identity_type = identity_type;
    data.degree = degree;
    data.customer_professional_info = customer_professional_info;
    data.bank_card_type = bank_card_type;
    data.marital_status = marital_status;

    let clContactInfoList = this.data.clContactInfoList;
    let contactArray = [];
    for (let index in clContactInfoList) {
      let item = new Object();
      let name = 'contact_name_' + index;
      let phone = 'contact_phone_' + index;
      let relationShip = 'contact_relationship_' + index;
      let contact_name = data[name];
      let contact_phone = data[phone];
      let contact_relationship = this.data.relationshipArray[data[relationShip]].value;
      item.contact_name = contact_name;
      item.contact_phone = contact_phone;
      item.contact_relationship = contact_relationship;
      contactArray[index] = item;
    }
    data.contactArray = contactArray;

    data.channel_type = this.data.channel_type;
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
          if (fromType == 1) {
            wx.navigateTo({
              url: '../carinfo/carinfo?biz_order_no=' + that.data.clUserInfo.biz_order_no + '&fromType=1&channel_type=' + that.data.channel_type,
            })
          } else {
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
    let relationIndexArray = this.data.relationIndexArray;
    relationIndexArray[e.target.dataset.id] = e.detail.value;
    this.setData({
      relationIndexArray: relationIndexArray
    })
  },

  binddateChange: function(e) {
    let clUserInfo = this.data.clUserInfo;
    clUserInfo.certificate_expiry_date = e.detail.value
    this.setData({
      clUserInfo: clUserInfo
    })
  },

  bindbankNameChange: function(e) {
    this.setData({
      bank_list_index: e.detail.value
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