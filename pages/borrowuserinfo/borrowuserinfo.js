import WxValidate from '../../assets/plugins/wx-validate/WxValidate'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    biz_order_no: '',
    imglist: [],
    helthIndex: 0,
    helthArray: [],
    idIndex: 0,
    idArray: [],
    eduIndex: 2,
    eduArray: [],
    clientIndex: 2,
    clientArray: [],
    bankIndex: 0,
    bankArray: [],
    marriageIndex: 0,
    marriageArray: [],
    relationshipArray: [],
    relationIndex: 0,
    bank_list: [],
    bank_list_index: 0,
    certificate_expiry_date: '2018-01-01',
    brrowUserArray: ['请选择', '消费', '汽车', '医美', '旅游', '教育', '3C', '家装', '租房', '租赁', '农业'],
    brrowUserIndex: 1,
    clUserInfo: {},
    clBaseInfo: {},
    clContactInfo: {},
    able:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    that.initValidate()
    let imglist = that.data.imglist;
    let helthIndex = that.data.helthIndex;
    let idIndex = that.data.idIndex;
    let eduIndex = that.data.eduIndex;
    let clientIndex = that.data.clientIndex;
    let bankIndex = that.data.bankIndex;
    let marriageIndex = that.data.marriageIndex;
    let bank_list_index = that.data.bank_list_index;
    let clUserInfo = that.data.clUserInfo;
    let clBaseInfo = that.data.clBaseInfo;
    let clContactInfo = that.data.clContactInfo;
    let brrowUserIndex = that.data.brrowUserIndex;
    let relationIndex = that.data.relationIndex;
    //请求后台获取相关信息
    wx.request({
      url: app.globalData.http_url_head + "borrow/toBorrow/" + app.globalData.userInfo.openId,
      header: {
        token: app.globalData.userInfo.token
      },
      method: 'POST',
      success: function(res) {
        if (res.statusCode == 200 && res.data.code == 0) {

          let biz_order_no = res.data.dataMap.biz_order_no; //内单号
          let bank_list = res.data.dataMap.bank_list; //银行名称列表
          let helthArray = res.data.dataMap.health; //身体状况
          let idArray = res.data.dataMap.identity_type; //身份类型
          let eduArray = res.data.dataMap.degreeS; //最高学历
          let clientArray = res.data.dataMap.customerInfo; //客户职业信息
          let bankArray = res.data.dataMap.bankCards; //银行卡类型
          let marriageArray = res.data.dataMap.marital_status; //婚姻状况
          let relationshipArray = res.data.dataMap.relationShip; //社会关系

          if (biz_order_no == null || biz_order_no == '') { //说明已经存在数据
          
            clBaseInfo = res.data.dataMap.clBaseInfo;
            brrowUserIndex = clBaseInfo.borrow_usage; //贷款用途

            biz_order_no = clBaseInfo.biz_order_no;
            clUserInfo = res.data.dataMap.clUserInfo;

            for (let index in clientArray) {
              if (clientArray[index].value == clUserInfo.customer_professional_info) {
                clientIndex = index;
              }
            }

            for (let index in helthArray) {
              if (helthArray[index].value == clUserInfo.health_status) {
                helthIndex = index
              }
            }

            for (let index in idArray) {
              if (idArray[index].value == clUserInfo.identity_type) {
                idIndex = index;
              }
            }

            for (let index in eduArray) {
              if (eduArray[index].value == clUserInfo.degree) {
                eduIndex = index;
              }
            }

            for (let index in marriageArray) {
              if (marriageArray[index].value == clUserInfo.marital_status) {
                marriageIndex = index;
              }
            }

            for (let index in bankArray) {
              if (bankArray[index].value == clUserInfo.bank_card_type) {
                bankIndex = index;
              }
            }

            for (let index in bank_list) {
              if (bank_list[index] == clUserInfo.bank_name) {
                bank_list_index = index
              }
            }

            for (var index in res.data.dataMap.attachmentInfoList) {
              imglist[index] = res.data.dataMap.attachmentInfoList[index].file_path
            }

            clContactInfo = res.data.dataMap.clContactInfo;
            for (let index in relationshipArray) {
              if (relationshipArray[index].value == clContactInfo.contact_relationship) {
                relationIndex = index;
              }
            }

          }

          let able = that.data.able;
          if (app.globalData.userInfo.idcard != null && app.globalData.userInfo.idcard != ''){
            clUserInfo.idcard = app.globalData.userInfo.idcard
            able = true
          }

          that.setData({
            biz_order_no: biz_order_no,
            imglist: imglist,
            helthArray: helthArray,
            idArray: idArray,
            eduArray: eduArray,
            clientArray: clientArray,
            bankArray: bankArray,
            marriageArray: marriageArray,
            relationshipArray: relationshipArray,
            bank_list: bank_list,
            clUserInfo: clUserInfo,
            clContactInfo: clContactInfo,
            clBaseInfo: clBaseInfo,

            bank_list_index: bank_list_index,
            relationIndex: relationIndex,
            brrowUserIndex: brrowUserIndex,
            helthIndex: helthIndex,
            clientIndex: clientIndex,
            bankIndex: bankIndex,
            idIndex: idIndex,
            eduIndex: eduIndex,
            marriageIndex: marriageIndex,

            able: able
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
              biz_order_no: that.data.biz_order_no,
              formType: 0
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
    var fromType = that.data.fromType;
    let data = e.detail.value

    if (this.data.imglist.length < 2) {
      wx.showToast({
        title: '缺少图片信息，请上传图片',
        icon: 'none',
        duration: 2000 //持续的时间
      })
      return false
    }
    /**
     * 传入表单数据，调用验证方法
     * 
    */
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
    let contact_relationship = this.data.relationshipArray[this.data.relationIndex].value;
    data.health_status = health_status;
    data.identity_type = identity_type;
    data.degree = degree;
    data.customer_professional_info = customer_professional_info;
    data.bank_card_type = bank_card_type;
    data.marital_status = marital_status;
    data.certificate_expiry_date = that.data.certificate_expiry_date;
    data.contact_relationship = contact_relationship;
    data.openid = app.globalData.userInfo.openId;
    data.borrow_usage = this.data.brrowUserIndex;

    /**
     * 后台保存数据
     */
    wx.request({
      url: app.globalData.http_url_head + 'borrow/saveUserInfo',
      header: {
        token: app.globalData.userInfo.token
      },
      data: {
        data: data
      },
      method: "post",
      success: function(res) {
        if (res.data.code == 0 && res.statusCode == 200) {
            wx.navigateTo({
              url: '../borrowcarinfo/borrowcarinfo?biz_order_no=' + that.data.biz_order_no,
            })
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
      user_name: {
        required: true
      },
      idcard: {
        required: true
      },
      idcard_address: {
        required: true,
      },
      residential_address: {
        required: true,
      },
      phone_no: {
        required: true
      },
      company_name: {
        required: true,
      },
      company_phone_no: {
        required: true,
      },
      bank_account: {
        required: true,
      },
      reserve_phone_no: {
        required: true,
      },
      wechat: {
        required: true,
      },
      contact_name: {
        required: true
      },
      contact_phone: {
        required: true
      }
    }

    // 验证字段的提示信息，若不传则调用默认的信息
    const messages = {
      user_name: {
        required: "真实姓名不能为空"
      },
      idcard: {
        required: "身份证不能为空"
      },
      idcard_address: {
        required: "身份证地址不能为空",
      },
      residential_address: {
        required: "现居住地址不能为空",
      },
      phone_no: {
        required: "手机号码不能为空"
      },
      company_name: {
        required: "公司名称不能为空",
      },
      company_phone_no: {
        required: "公司电话不能为空",
      },
      bank_account: {
        required: "银行卡号不能为空",
      },
      reserve_phone_no: {
        required: "预留手机号码不能为空",
      },
      wechat: {
        required: "微信号不能为空",
      },
      contact_name: {
        required: "联系人姓名不能为空"
      },
      contact_phone: {
        required: "联系人电话不能为空"
      }
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
    this.setData({
      relationIndex: e.detail.value
    })
  },

  binddateChange: function(e) {
    this.setData({
      certificate_expiry_date: e.detail.value
    })
  },

  bindbankNameChange: function(e) {
    this.setData({
      bank_list_index: e.detail.value
    })
  },

  bindUseChange: function(e) {
    if (e.detail.value == 0) {
      wx.showToast({
        title: '请选择正确借款用途',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    this.setData({
      brrowUserIndex: e.detail.value
    })
  }

})