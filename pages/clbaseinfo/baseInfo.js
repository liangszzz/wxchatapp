//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        page: 1, //当前第几页
        limit: 7, // 每页显示数量
        hasMoreData: false, // 是否存在更多数据
        loadMore: false, //加载更多，默认false，隐藏
        orderList: [], //存放订单数据
        remainingPrincipal: 0,
    },
    //事件处理函数
    detail: function(e) {
        //获取前台页面data-id存放的值
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../infodetail/detail?id=' + id,
        })
    },
    onLoad: function() {
        var that=this;
        setTimeout(function() {
            wx.request({
                url: app.globalData.http_url_head + "/user/orders",
                header: {
                    token: app.globalData.userInfo.token
                },
                data: {
                    idcard: '640502199411209870'
                },
                method: "POST",
                success: result => {
                    console.log(result);
                    that.setData({
                        remainingPrincipal: result.data.entity.remainingPrincipalTotal,
                        orderList: result.data.entity.orders
                    });
                },
                fail: result => {
                    console.log(result)
                }
            })
        }, 500)


        //使用模拟数据进行测试
        // var res = [{
        //   id: '1433223',
        //   title: '订单号：132121123',
        //   create_time: '2018.10.11',
        //   content: "尊敬用户：您的订单12312312放款成功"
        // }]

        // if (10 > this.data.limit) {
        //   this.setData({
        //     orderList: res,
        //     loadMore: true
        //   })
        // } else {
        //   this.setData({
        //     orderList: res,
        //     hasMoreData: true
        //   })
        // }

    },
    getUserInfo: function(e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    }
})