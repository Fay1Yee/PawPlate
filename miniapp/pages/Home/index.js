
const T = require('../../utils/tokens.js');
Page({
  data: {
    padding: T.spacing.lg
  },

  onBuyProduct: function(e) {
    const product = e.currentTarget.dataset.product;
    console.log('购买商品:', product);
    
    // 显示购买确认
    wx.showModal({
      title: '购买确认',
      content: `确定要购买 ${product} 吗？`,
      success: function(res) {
        if (res.confirm) {
          // 用户点击确定
          wx.showToast({
            title: '购买成功！',
            icon: 'success',
            duration: 2000
          });
          // 这里可以添加实际的购买逻辑
        }
      }
    });
  }
});
