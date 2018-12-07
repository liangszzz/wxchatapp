import WxValidate from '../../assets/plugins/wx-validate/WxValidate'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    clRiskInfo: {},
    clCarInfo: {},
    carlist: [],
    dengjiList: [],
    xingshiList: [],
    formType: 1, // 1：订单页进入 2：我的页面进入
    accidentIndex: 0,
    accidentArray: [],
    hasIndex: 0,
    hasArray: ['否', '是'],
    fromType: '',
    wx_app_confirm: '',
    channel_type:2
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let biz_order_no = options.biz_order_no;
    let fromType = options.fromType;
    let wx_app_confirm = '';
    let channel_type = options.channel_type;
    if (fromType == 2) {
      wx_app_confirm = options.wx_app_confirm;
    }
    let carlist = that.data.carlist;
    let dengjiList = that.data.dengjiList;
    let xingshiList = that.data.xingshiList;
    let accidentArray = that.data.accidentArray;
    that.initValidate();
    //请求后台获取相关信息
    wx.request({
      url: app.globalData.http_url_head + "car/query",
      header: {
        token: app.globalData.userInfo.token
      },
      data: {
        biz_order_no: biz_order_no,
        channel_type: channel_type
      },
      method: 'POST',
      success: function(res) {
        if (res.statusCode == 200 && res.data.code == 0) {
          let clRiskInfo = res.data.dataMap.clRiskInfo; //风控信息，用于获取车辆估值
          let clCarInfo = res.data.dataMap.clCarInfo; //车辆基本信息
          let carList = res.data.dataMap.carList; //车辆照片
          for (let index in carList) {
            carlist[index] = carList[index].fast_dfs_path
          }
          let cardriveListList = res.data.dataMap.cardriveListList; //行驶证
          for (let index in cardriveListList) {
            xingshiList[index] = cardriveListList[index].fast_dfs_path
          }
          let registerList = res.data.dataMap.registerList //机动车登记证书
          for (let index in registerList) {
            dengjiList[index] = registerList[index].fast_dfs_path
          }
          let accidentTypes = res.data.dataMap.accidentTypes;
          for (let index in accidentTypes) {
            accidentArray[index] = accidentTypes[index].label
          }
          let accidentIndex = clCarInfo.accident_type;
          let hasIndex = clCarInfo.major_accident;
          that.setData({
            clRiskInfo: clRiskInfo,
            clCarInfo: clCarInfo,
            carlist: carlist,
            xingshiList: xingshiList,
            dengjiList: dengjiList,
            accidentArray: accidentArray,
            accidentIndex: accidentIndex,
            hasIndex: hasIndex,
            wx_app_confirm: wx_app_confirm,
            fromType: options.fromType,
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
   * 车辆照片预览
   */
  previewImageCar: function(e) {
    let currentUrl = e.target.dataset.src;
    if (currentUrl == '' || currentUrl == null) { //缺少图片
      this.chooseImg(7, );
    } else {
      wx.previewImage({
        current: currentUrl, // 当前显示图片的http链接
        urls: this.data.carlist // 需要预览的图片http链接列表
      })
    }
  },

  /**
   * 抵押登记证预览
   */
  previewImageDeng: function(e) {
    let currentUrl = e.target.dataset.src;
    if (currentUrl == '' || currentUrl == null) { //缺少图片
      this.chooseImg(4);
    } else {
      wx.previewImage({
        current: currentUrl, // 当前显示图片的http链接
        urls: this.data.dengjiList // 需要预览的图片http链接列表
      })
    }
  },

  /**
   * 行驶证预览
   */
  previewImageXing: function(e) {
    let currentUrl = e.target.dataset.src;
    if (currentUrl == '' || currentUrl == null) { //缺少图片
      this.chooseImg(14);
    } else {
      wx.previewImage({
        current: currentUrl, // 当前显示图片的http链接
        urls: this.data.xingshiList // 需要预览的图片http链接列表
      })
    }
  },

  /**
   * 缺少图片上传图片公用方法
   */
  chooseImg: function(file_type) {
    let that = this;
    let carlist = that.data.carlist;
    let dengjiList = that.data.dengjiList;
    let xingshiList = that.data.xingshiList;
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
          formData: {
            file_type: file_type,
            biz_order_no: that.data.clCarInfo.biz_order_no,
            formType: 1
          },
          success: function(res) {
            let data = JSON.parse(res.data);
            if (res.statusCode == 200 && data.code == 0) {
              if (file_type == 7) { //车辆照片
                carlist[carlist.length] = data.entity.file_path;
                that.setData({
                  carlist: carlist
                })
              } else if (file_type == 4) { //抵押登记照片
                dengjiList[dengjiList.length] = data.entity.file_path;
                that.setData({
                  dengjiList: dengjiList
                })
              } else {
                xingshiList[xingshiList.length] = data.entity.file_path;
                that.setData({
                  xingshiList: xingshiList
                })
              }
            }
          },
          fail: function() {
            console.log("身份证照上传失败！");
          }
        })
      },
    })
  },

  /**
   * 下一步
   */
  formSubmit: function(e) {
    let fromType = this.data.fromType;
    //先检查图片是否存在
    if (this.data.carlist.length < 1 || this.data.dengjiList.length < 1 || this.data.xingshiList.length < 2) {
      wx.showToast({
        title: '缺少图片信息，请上传图片',
        icon: 'none',
        duration: 2000 //持续的时间
      })
      return false
    }
    let data = e.detail.value;
    data.channel_type = this.data.channel_type
    // 传入表单数据，调用验证方法
    if (!this.WxValidate.checkForm(data)) {
      const error = this.WxValidate.errorList[0]
      wx.showToast({
        title: error.msg,
        icon: 'none',
        duration: 2000 //持续的时间
      })
      return false
    }
    let that = this;
    //后台保存数据
    wx.request({
      url: app.globalData.http_url_head + 'car/save',
      header: {
        token: app.globalData.userInfo.token
      },
      data: {
        data: data
      },
      method: "post",
      success: function(res) {
        if (res.statusCode == 200 && res.data.code == 0) {
          if (fromType == 1){
            wx.navigateTo({
              url: '../sign/sign?biz_order_no=' + that.data.clCarInfo.biz_order_no + '&channel_type=' + that.data.channel_type,
            })
          }else{
            wx.showToast({
              title: '修改成功',
              icon: 'success',
              duration: 2000
            })
          } 
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000 //持续的时间
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
      car_no: {
        required: true,
      },
      car_brand: {
        required: true,
      },
      car_color: {
        required: true,
      },
      car_driving_mileage: {
        required: true,
      },
      car_engine_no: {
        required: true,
      },
      car_model: {
        required: true,
      },
      car_service_life: {
        required: true,
      },
      car_cost: {
        required: true,
      }
    }

    // 验证字段的提示信息，若不传则调用默认的信息
    const messages = {
      car_no: {
        required: '车牌号码不能为空',
      },
      car_brand: {
        required: "车辆品牌不能为空",
      },
      car_color: {
        required: "车辆颜色不能为空",
      },
      car_driving_mileage: {
        required: "车辆行驶里程不能为空",
      },
      car_engine_no: {
        required: "发动机号不能为空",
      },
      car_model: {
        required: "车辆型号不能为空",
      },
      car_service_life: {
        required: "车辆使用年限不能为空",
      },
      car_cost: {
        required: "车辆估值不能为空",
      }
    }
    // 创建实例对象
    this.WxValidate = new WxValidate(rules, messages)
  },

  /**
   * 选择监听
   */
  bindhasChange: function(e) {
    this.setData({
      hasIndex: e.detail.value
    })
  },
  bindaccidentChange: function(e) {
    this.setData({
      accidentIndex: e.detail.value
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