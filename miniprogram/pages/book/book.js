// pages/book/book.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date:null
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

  async tabSelect(e) {
    var classlist
    var xqj = String(e.currentTarget.dataset.id)
    this.data.date = String(e.currentTarget.dataset.date)
    if (app.globalData.isTrail){
    let cacheresult = await db.collection('classlog').get()
    let result = await db.collection('class-trail').where({xqj:xqj}).get()
    classlist = result.data
    console.log(classlist)
    this.setData({
      classlist : classlist
    })
  }
  else{
    let cacheresult = await db.collection('classlog').get()
    let result = await db.collection('class').where({xqj:xqj}).get()
    classlist = result.data
    console.log(classlist)
    this.setData({
      classlist : classlist
    })
  }
  },

  async openAppointment(e) {
    let result = await db.collection('user').get()
    let num = result.data[0].num
     let date = this.data.date
     console.log(date)
      if (num > 0 || app.globalData.cardtype === "受け放題"){
      let classlog = await db.collection('classlog').where({
        classid:e.currentTarget.dataset.id,
        userID:app.globalData.userID
      }).get()
        wx.showModal({
          title:"确定预约吗？",
          confirmText: "确定",
          cancelText: "取消",
          success: function (res) {
            if (res.confirm) {
              wx.showToast({
                title: '预约成功',
              })
              if (app.globalData.cardtype != "受け放題"){
              db.collection('user').where({
              }).update({
                data: {
                  num: _.inc(-1)
                },
              })
            }
              db.collection('classlog').add({ 
                data : {
                "classid": e.currentTarget.dataset.id,
                "userID" : app.globalData.userID,
                "classtype" : app.globalData.classtype,
                "time":e.currentTarget.dataset.time,
                "classname":e.currentTarget.dataset.classname,
                "teacher":e.currentTarget.dataset.teacher,
                "date":date,
              }
            })
            } 
          }
        })

    }
    else{
      wx.showToast({
        title: '当月次数已用完',
        icon : 'error',
        duration : 1000,
        success:function() {
          setTimeout(function() {
            //要延时执行的代码
            wx.redirectTo({
              url: '../index/index',
            })
          }, 1000) //延迟时间
        },
      })
    }
},

async openTrail(e) {
  let result = await db.collection('user').get()
  let trailnum = result.data[0].trailnum
   let date = this.data.date
    if (trailnum > 0){
      wx.showModal({
        title:"确定预约吗？",
        confirmText: "确定",
        cancelText: "取消",
        success: function (res) {
          if (res.confirm) {
            wx.showToast({
              title: '预约成功',
            })
            db.collection('user').where({
            }).update({
              data: {
                trailnum: _.inc(-1)
              },
            })
            db.collection('traillog').add({ 
              data : {
              "classid": e.currentTarget.dataset.id,
              "userID" : app.globalData.userID,
              "classtype" : app.globalData.classtype,
              "time":e.currentTarget.dataset.time,
              "classname":e.currentTarget.dataset.classname,
              "teacher":e.currentTarget.dataset.teacher,
              "date":date,
            }
          })
          } 
        }
      })

  }
  else{
    wx.showToast({
      title: '体验次数已用完',
      icon : 'error',
      duration : 1000,
      success:function() {
        setTimeout(function() {
          //要延时执行的代码
          wx.redirectTo({
            url: '../index/index',
          })
        }, 1000) //延迟时间
      },
    })
  }
},

  async checkClasstype(e){
    if (app.globalData.isTrail){
      this.openTrail(e)
    }
    else{
      let result = await db.collection('user').get()
      let log = await db.collection('classlog').where({
        classid:e.currentTarget.dataset.id,
      }).get()
      let classtype = result.data[0].classtype
      let logs = log.data
      if (classtype === "private"){
        if (logs.length == 0){
          this.openAppointment(e)
        }
        else{
          wx.showToast({
            title: '人数已满',
            icon : 'error'
          })
        }
      }
      else{
        if (logs[0].classtype === "private"){
          wx.showToast({
            title: '人数已满',
            icon : 'error'
          })
        }
        else{
          this.openAppointment(e)
        }
      }
    }
  },

  backhome(){
    wx.navigateBack({
      delta:1
    })
  },

})