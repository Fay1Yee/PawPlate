
Page({
  data:{ 
    result:{ adjusted_portion_g:0, adjusted_ingredients:[], feeding_frequency_per_day:2, alt_ingredients:[] },
    customizedRecipe: null,
    explanation: '',
    nutritionAnalysis: null
  },
  onLoad(opts){
    if (opts.data) {
      // Data from backend API
      try {
        const apiData = JSON.parse(decodeURIComponent(opts.data));
        if (apiData.success && apiData.customizedRecipe) {
          this.setData({
            customizedRecipe: apiData.customizedRecipe,
            explanation: apiData.explanation || '',
            nutritionAnalysis: apiData.nutritionAnalysis || null,
            result: {
              adjusted_portion_g: apiData.customizedRecipe.totalWeight || 0,
              adjusted_ingredients: apiData.customizedRecipe.ingredients || [],
              feeding_frequency_per_day: apiData.customizedRecipe.feedingFrequency || 2,
              alt_ingredients: apiData.customizedRecipe.alternatives || []
            }
          });
          return;
        }
      } catch (e) {
        console.error('Failed to parse API data:', e);
      }
    }
    
    // Fallback to original logic
    const form = opts.form ? JSON.parse(decodeURIComponent(opts.form)) : {};
    const base = form.species === 'dog' ? [
      {name:'Salmon', grams:120},{name:'Quinoa', grams:60},{name:'Carrot', grams:60},{name:'Broccoli', grams:60}
    ]:[
      {name:'Chicken Breast', grams:120},{name:'Pumpkin', grams:100},{name:'Cat Nutrition Powder', grams:5}
    ];
    const weight = parseFloat(form.weight_kg || '3.5');
    const ratio = Math.max(0.6, Math.min(1.6, weight/3.5));
    const adjusted = base.map(i=>({...i, grams: Math.round(i.grams*ratio)}));
    const total = adjusted.reduce((s,i)=>s+i.grams,0);
    this.setData({ 
      result:{ 
        adjusted_portion_g: total, 
        adjusted_ingredients: adjusted, 
        feeding_frequency_per_day:(weight>10?3:2), 
        alt_ingredients:['Pumpkin Puree','Sweet Potato Puree'] 
      }
    });
  },
  goBuy(){ 
    // Pass SKU information of the first ingredient
    const firstIngredient = this.data.result.adjusted_ingredients[0];
    if (firstIngredient) {
      const sku = `${firstIngredient.name}_${firstIngredient.grams}g`;
      tt.navigateTo({ url:`/pages/purchase/handoff/index?sku=${sku}&platform=ddmc`});
    } else {
      tt.navigateTo({ url:'/pages/purchase/handoff/index'});
    }
  },
  goRecipe(){ tt.navigateBack(); }
});
