const img = require('../../utils/img.js');

Page({
  data: {
    recipes: []
  },

  onLoad() {
    this.loadRecipes();
  },

  onShow() {
    this.loadRecipes();
  },

  loadRecipes() {
    const app = getApp();
    // Call action in store to fetch all recipes
    app.store.actions.fetchAllRecipes();
    // Get recipe data from store
    const recipes = app.store.getters.getAllRecipes();
    
    // Add image URLs to recipes
    const recipesWithImages = recipes.map(recipe => {
      let imageUrl = img.get('recipes.default');
      
      // Match images based on recipe ID or name
      if (recipe.id === 'cat_001' || recipe.name.includes('Cat')) {
        imageUrl = img.get('recipes.cat_001');
      } else if (recipe.id === 'dog_001' || recipe.name.includes('Dog')) {
        imageUrl = img.get('recipes.dog_001');
      } else if (recipe.name.includes('Chicken')) {
        imageUrl = img.get('stickers.chicken');
      } else if (recipe.name.includes('Salmon') || recipe.name.includes('Fish')) {
        imageUrl = img.get('stickers.salmon');
      }
      
      return {
        ...recipe,
        image: imageUrl
      };
    });
    
    this.setData({
      recipes: recipesWithImages
    });
  },

  goToRecipeDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/RecipeDetail/RecipeDetail?id=${id}`
    });
  }
});