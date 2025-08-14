
Page({
  data:{
    videoMeta:{}, nowRecipe:{ ingredients:[] }, productItems:[], reco:[]
  },
  onLoad(query){
    const rid = query.rid || 'cat_001';
    const species = query.species || 'cat';
    const title = query.title || '';
    this.setData({ videoMeta:{ title, species } });
    tt.request({ url:'/assets/data/recipes.json', success:(res)=>{
      const list = res.data || [];
      const now = list.find(x=>x.recipe_id===rid) || list[0];
      const reco = list.filter(x=>x.recipe_id!==now.recipe_id).slice(0,6);
      this.setData({ nowRecipe: now, reco });
    }});
    const items = species==='dog' ? [
      { name:'成犬全价粮 2kg', sku:'dogfood_basic_2kg' },
      { name:'幼犬奶糕 1.5kg', sku:'dogfood_puppy_1_5kg' }
    ]:[
      { name:'成猫全价粮 2kg', sku:'catfood_basic_2kg' },
      { name:'幼猫发育粮 1.5kg', sku:'catfood_kitten_1_5kg' }
    ];
    this.setData({ productItems: items });
  },
  goDetail(){ const id=this.data.nowRecipe.recipe_id; tt.navigateTo({ url:`/pages/recipe/index?id=${id}` }); },
  goAI(){ const id=this.data.nowRecipe.recipe_id; tt.navigateTo({ url:`/pages/ai/chat/index?id=${id}` }); }
});
