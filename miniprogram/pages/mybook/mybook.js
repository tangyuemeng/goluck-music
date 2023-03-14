// pages/mybook/mybook.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  async onLoad(){
    let result = await db.collection('classlog').where({
      userID:app.globalData.userID
    }).get()
    let list = result.data
    this.setData({
      list : list
    })

  },

  backhome(){
    wx.navigateBack({
      delta:1
    })
  }
})