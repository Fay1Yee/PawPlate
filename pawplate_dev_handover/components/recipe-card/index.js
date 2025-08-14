
Component({
  properties:{ item: { type:Object, value:{} } },
  methods:{ open(e){ const id = e.currentTarget.dataset.id; tt.navigateTo({ url: `/pages/recipe/index?id=${id}` }); } }
});
