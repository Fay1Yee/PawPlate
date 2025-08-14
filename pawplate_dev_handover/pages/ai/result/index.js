
Page({
  data:{ result:{ adjusted_portion_g:0, adjusted_ingredients:[], feeding_frequency_per_day:2, alt_ingredients:[] } },
  onLoad(opts){
    const form = opts.form ? JSON.parse(decodeURIComponent(opts.form)) : {};
    const base = form.species === 'dog' ? [
      {name:'三文鱼', grams:120},{name:'藜麦', grams:60},{name:'胡萝卜', grams:60},{name:'西兰花', grams:60}
    ]:[
      {name:'鸡胸肉', grams:120},{name:'南瓜', grams:100},{name:'猫用营养粉', grams:5}
    ];
    const weight = parseFloat(form.weight_kg || '3.5');
    const ratio = Math.max(0.6, Math.min(1.6, weight/3.5));
    const adjusted = base.map(i=>({...i, grams: Math.round(i.grams*ratio)}));
    const total = adjusted.reduce((s,i)=>s+i.grams,0);
    this.setData({ result:{ adjusted_portion_g: total, adjusted_ingredients: adjusted, feeding_frequency_per_day:(weight>10?3:2), alt_ingredients:['南瓜泥','红薯泥'] }});
  },
  goBuy(){ tt.navigateTo({ url:'/pages/purchase/handoff/index'}); },
  goRecipe(){ tt.navigateBack(); }
});
