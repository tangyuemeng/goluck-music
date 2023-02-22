// pages/book/book.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.calculateWeek()

  },

  dealTime: function (num) {     // num：未来天数
    var time = new Date()     // 获取当前时间日期
    var date = new Date(time.setDate(time.getDate() + num)).getDate()  //这里先获取日期，在按需求设置日期，最后获取需要的
    var month = time.getMonth() + 1   // 获取月份
    var day = time.getDay()   //  获取星期
    var id 
    switch (day) {             //  格式化
      case 0: day = "周日", id  = 0
        break
      case 1: day = "周一", id  = 1
        break
      case 2: day = "周二", id  = 2
        break
      case 3: day = "周三", id  = 3
        break
      case 4: day = "周四", id  = 4
        break
      case 5: day = "周五", id  = 5
        break
      case 6: day = "周六", id  = 6
        break
    }
    var obj = {
      date: date,
      day: day,
      month: month,
      newday:month + '-' + date,
      id : id
    }
    return obj      // 返回对象
  },

  calculateWeek(){
    var arr = []
    for (let i = 0; i < 7; i++) {
      arr.push(this.dealTime(i))
    }
    this.setData({
      arr:arr
    })
  },

})