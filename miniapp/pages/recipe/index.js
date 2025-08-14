const { img } = require('../../utils/img.js');

Page({
  data: { recipe: {} },
  async onLoad(query) {
    const id = query.id || 'cat_001';
    
    // Local recipe data
    const recipes = [
      {
        "recipe_id": "cat_001",
        "species": "cat",
        "title_en": "Pumpkin Chicken Porridge (Cat)",
        "imageUrl": await img('recipes.cat_001'),
        "ingredients": [
          {"name": "Chicken Breast", "grams": 120},
          {"name": "Pumpkin", "grams": 100},
          {"name": "Cat Nutrition Powder", "grams": 5},
          {"name": "Water", "grams": 300}
        ],
        "steps_en": "1. Dice chicken breast and blanch; 2. Steam pumpkin and mash; 3. Simmer until soft; 4. Turn off heat, add nutrition powder and mix well, cool before feeding.",
        "cautions_en": "Do not add salt, oil, onions, garlic, chocolate, grapes or xylitol."
      },
      {
        "recipe_id": "dog_001", 
        "species": "dog",
        "title_en": "Salmon Quinoa Bowl (Dog)",
        "imageUrl": await img('recipes.dog_001'),
        "ingredients": [
          {"name": "Salmon", "grams": 120},
          {"name": "Quinoa", "grams": 60},
          {"name": "Carrot", "grams": 60},
          {"name": "Broccoli", "grams": 60}
        ],
        "steps_en": "1. Remove skin and bones from salmon, steam; 2. Cook quinoa; 3. Dice carrot and broccoli, blanch; 4. Mix well and cool.",
        "cautions_en": "Ensure salmon is fully cooked; introduce small amounts initially."
      }
    ];
    
    const hit = recipes.find(r => r.recipe_id === id) || recipes[0];
    this.setData({ recipe: hit });
  },
  
  goAI(){ 
    const id = this.data.recipe.recipe_id;
    const name = this.data.recipe.title_en;
    tt.navigateTo({ url: `/pages/ai/form/index?id=${id}&name=${name}`}); 
  },
  
  goBuy(){ 
    const firstIngredient = this.data.recipe.ingredients?.[0];
    if (firstIngredient) {
      const sku = `${firstIngredient.name}_${firstIngredient.grams}g`;
      tt.navigateTo({ url: `/pages/purchase/handoff/index?sku=${sku}&platform=ddmc`});
    } else {
      tt.navigateTo({ url: '/pages/purchase/handoff/index'});
    }
  }
});
