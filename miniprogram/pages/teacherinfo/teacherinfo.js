// teacherinfo/teacherinfo.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    let result = await  db.collection('teacherinfo').get()
    let list = result.data
    this.setData({
      list:list
    })

  },
  backhome(){
    wx.navigateBack({
      delta:1
    })
  }
})