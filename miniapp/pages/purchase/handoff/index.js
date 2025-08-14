Page({
  onLoad(opts){
    this.platform = opts.platform || 'ddmc';
    this.sku = opts.sku || '';
    this.setData({
      platform: this.platform,
      sku: this.sku,
      platformName: this.platform === 'ddmc' ? 'DingDong' : 'JD Daojia'
    });
  },
  open(p){
    const platform = p || this.platform;
    // Recommended: Call real API to generate shopping cart link
    // tt.request({ 
    //   url:'/api/purchase/link', 
    //   method:'POST', 
    //   data:{ ingredients:[{name:this.sku, grams:0}], city:'SH', platform }, 
    //   success:({data}) => data.cart_url ? tt.openSchema({ schema: data.cart_url }) : this.copyFallback() 
    // });
    // Fallback (demo)
    this.copyFallback();
  },
  copyFallback(){
    const platformName = this.platform === 'ddmc' ? 'DingDong' : 'JD Daojia';
    tt.setClipboardData({ 
      data: `Please search SKU in ${platformName}: ${this.sku}` 
    });
    tt.showToast({ 
      title:'List copied', 
      icon:'none' 
    });
  }
});