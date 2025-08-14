
Component({
  properties: { 
    items: { 
      type: Array, 
      value: [],
      observer: function(newVal) {
        this.processItems(newVal);
      }
    } 
  },
  data: {
    pagedItems: [],
    current: 0
  },
  methods: {
    processItems(items) {
      const pagedItems = [];
      for (let i = 0; i < items.length; i += 2) {
        pagedItems.push(items.slice(i, i + 2));
      }
      this.setData({ pagedItems });
    },
    swiperChange(e) {
      this.setData({ current: e.detail.current });
    },
    buy(e) {
      const sku = e.currentTarget.dataset.id;
      const item = this.data.items.find(i => i.sku === sku) || {};
      tt.navigateTo({ 
        url: `/pages/purchase/handoff/index?sku=${encodeURIComponent(sku)}&platform=${item.platform || ''}` 
      });
    }
  }
});
