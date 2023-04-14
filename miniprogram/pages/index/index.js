// index.js
const app = getApp()
const db = wx.cloud.database()
const { envList } = require('../../envList.js');
const _ = db.command
Page({
  data: {
    inputValue:""
  },
  async onLoad(){
    let result = await db.collection('user').get()
    if (result.data.length === 0){
      var date = new Date()     // 获取当前时间日期
      var month = (date.getMonth() + 1).toString()   // 获取月份
      var day = date.getDate().toString()//  获取星期
      day = this.changestringlength(day)
      month = this.changestringlength(month)
      let userID = "Goluck" + month + day + Math.random().toString().substr(2, 2)
      app.globalData.userID = userID 
      app.globalData.islogin = true
      db.collection('user').add({
         data:{
           "isVIP": false,
           "userID" : userID
         }
       })

    }
    else{
    app.globalData.islogin = true
    app.globalData.userID = result.data[0].userID
    app.globalData.isVIP = result.data[0].isVIP
    app.globalData.cardtype = result.data[0].cardtype ? result.data[0].cardtype : "新规套餐"
    app.globalData.classtype = result.data[0].classtype ? result.data[0].classtype : "新规"
    app.globalData.num = result.data[0].num ? result.data[0].num : 0
    app.globalData.allowedNum = result.data[0].allowedNum
    app.globalData.pianonum = result.data[0].pianonum
    app.globalData.name = result.data[0].name ? result.data[0].name : "新规会员"

    }
  },

  async onReady(){
    let result= await db.collection('user').get()
    let data= await db.collection('pianoinfo').get()
    let info = data.data[0].info
    let content = data.data[0].content
    let pianonum = result.data[0].pianonum
    if (pianonum > 0){
      app.globalData.showmodel = true
    }
    this.setData({
      showmodel : app.globalData.showmodel,
      info : info,
      content : content
    })
  },

  changestringlength (e){
    var result 
    if (e.length === 1){
      result = "0" + e
      return result
    }
    else {
      return e 
    }
  },

  async attendclass(){
    let result = await db.collection('pianolog').where({
      userID:app.globalData.userID
    }).get()
    if(this.inputValue){
      if(result.data.length === 0){
        db.collection('user').where({
          userID:app.globalData.userID
        }).update({
          data: {
            pianonum: _.inc(-1)
          },
        })
        db.collection('pianolog').add({
          data:{
            "userID" : app.globalData.userID,
            "name" : app.globalData.name,
            "date" : this.inputValue,
            "classtype" : app.globalData.classtype,
            "pianonum" : app.globalData.pianonum,
            "isAttend" : "上课"
          }
        })
        this.hide1()
      }
      else{
        wx.showToast({
          title: '当前课程已预约',
          icon:"error"
        })
        this.hide1()
      }
    }
    else{
      wx.showToast({
        title: '请输入日期',
        icon:"error"
      })
    }
  
  },

  async abendclass(){
    let result = await db.collection('pianolog').where({
      userID:app.globalData.userID
    }).get()
    if(this.inputValue){
      if(result.data.length === 0){
        db.collection('user').where({
          userID:app.globalData.userID
        }).update({
          data: {
            allowedNum: _.inc(-1)
          },
        })
        db.collection('pianolog').add({
          data:{
            "userID" : app.globalData.userID,
            "name" : app.globalData.name,
            "date" : this.inputValue,
            "classtype" : app.globalData.classtype,
            "pianonum" : app.globalData.pianonum,
            "isAttend" : "请假"
          }
        })
        this.hide1()
      }
      else{
        wx.showToast({
          title: '当前课程已请假',
          icon:"error"
        })
        this.hide1()
      }
    }
    else{
      wx.showToast({
        title: '请输入日期',
        icon:"error"
      })
    }
  
  },

  hide1(){
    app.globalData.showmodel = false
    this.setData({
      showmodel : app.globalData.showmodel,
      shownextmodel : false,
      showbeforemodel : false
    })
  },

  bindKeyInput: function (e) {
      this.inputValue = e.detail.value
  },

  attend(){
    this.setData({
      showbeforemodel : true
    })
  },

  abend(){
    if (app.globalData.allowedNum > 0){
      this.setData({
        shownextmodel : true
      })
    }
    else{
      wx.showToast({
        title: '请假次数不足',
        icon:"error"
      })
    }
  },

  navi_book(){
    app.globalData.isTrail = false
    if (app.globalData.isVIP){
    wx.navigateTo({
      url: '../book/book',
    })
  }
  else{
    wx.showToast({
      title: '会员卡已过期',
      icon:'error'
    })
  }
  },

  navi_trail(){
    app.globalData.isTrail = true
    wx.navigateTo({
      url: '../book/book',
    })
  },

  navi_user(){
    wx.navigateTo({
      url: '../user/user',
    })
  },

  navi_info(){
    wx.navigateTo({
      url: '../classinfo/classinfo',
    })
  }
});
