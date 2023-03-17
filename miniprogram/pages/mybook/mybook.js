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
    console.log(list)
  },

  cancelClass:function(e){
    console.log(e.currentTarget.dataset.classid)
    var time = new Date()
    var date = new Date(time.setDate(time.getDate() + 0)).getDate()
    var month = time.getMonth() + 1
    var hour = new Date().getHours();
    date = month + '-' + date
    if (e.currentTarget.dataset.date === date)   
    {
      wx.showToast({
        title: '已超过可取消时间',
        icon : 'error'
        })
        return
    }
  
   wx.showModal({
    content: '确定取消吗？',
    confirmText: "确定",
    cancelText: "取消",
    success:function(res){
    if (res.confirm){   
         db.collection('classlog').where({classid:e.currentTarget.dataset.id,userID:app.globalData.userID}).remove({
      })

      if (app.globalData.cardtype != "受け放題"){
      db.collection('user').where({
      }).update({
        data: {
          num: _.inc(1)
        },
      })
      }
        wx.navigateBack({
             delta: 1,
        })
    }
  }
})
  },

  backhome(){
    wx.navigateBack({
      delta:1
    })
  }
})