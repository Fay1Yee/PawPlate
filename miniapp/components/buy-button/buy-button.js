Component({
  properties: {
    text: {
      type: String,
      value: 'Buy'
    },
    type: {
      type: String,
      value: 'primary'
    },
    url: {
      type: String,
      value: ''
    }
  },
  
  data: {},
  
  methods: {
    onBuyTap() {
      if (this.data.url) {
        // Navigate to purchase link
        wx.navigateTo({
          url: this.data.url
        });
      } else {
        // 显示提示信息
        wx.showToast({
          title: 'Redirecting to purchase page',
          icon: 'none'
        });
      }
    }
  }
});