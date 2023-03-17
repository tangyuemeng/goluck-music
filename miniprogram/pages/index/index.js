// index.js
const app = getApp()
const db = wx.cloud.database()
const { envList } = require('../../envList.js');

Page({
  data: {

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
    console.log(app.globalData.userID)
    console.log(app.globalData.vip)
    console.log(app.globalData.cardtype)
    console.log(app.globalData.num)
    console.log(app.globalData.nickName)
    }
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


  navi_book(){
    app.globalData.isTrail = false
    wx.navigateTo({
      url: '../book/book',
    })
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
