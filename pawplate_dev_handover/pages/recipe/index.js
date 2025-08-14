
Page({
  data: { recipe: {} },
  onLoad(query) {
    const id = query.id || 'cat_001';
    tt.request({
      url: '/assets/data/recipes.json',
      success: (res)=>{
        const hit = res.data.find(r=>r.recipe_id===id) || res.data[0];
        this.setData({ recipe: hit });
      }
    });
  },
  goAI(){ const id=this.data.recipe.recipe_id; tt.navigateTo({ url:`/pages/ai/form/index?id=${id}`}); },
  goBuy(){ tt.navigateTo({ url:'/pages/purchase/handoff/index'}); }
});
