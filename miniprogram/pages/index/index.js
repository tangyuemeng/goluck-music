// index.js
const app = getApp()
const { envList } = require('../../envList.js');

Page({
  data: {

  },
  onLoad(){},

  navi_book(){
    wx.navigateTo({
      url: '../book/book',
    })
  },

});
