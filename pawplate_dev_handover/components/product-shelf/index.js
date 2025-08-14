
Component({
  properties: { items: { type: Array, value: [] } },
  methods: {
    buy(e){ const sku = e.currentTarget.dataset.id; tt.showToast({ title: '购买 ' + sku, icon: 'none' }); }
  }
});
