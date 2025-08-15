// Recipe detail page logic
const recipes = require('../../data/recipes.js');
const homeData = require('../../data/home.js');

Page({
  data: {
    recipe: null,
    ingredientIcons: homeData.ingredientIcons,
    isFavorited: false,
    servings: 1
  },
  
  onLoad(options) {
    const recipeId = parseInt(options.id);
    this.loadRecipe(recipeId);
  },
  
  loadRecipe(id) {
    const recipe = recipes.find(r => r.id === id);
    
    if (recipe) {
      this.setData({
        recipe: recipe
      });
      this.checkFavoriteStatus(id);
    } else {
      tt.showToast({
        title: 'Recipe not found',
        icon: 'none'
      });
    }
  },
  
  checkFavoriteStatus(id) {
    // Check if already favorited
    const favorites = tt.getStorageSync('favorites') || [];
    this.setData({
      isFavorited: favorites.includes(id)
    });
  },
  
  addToFavorites() {
    const { recipe, isFavorited } = this.data;
    let favorites = tt.getStorageSync('favorites') || [];
    
    if (isFavorited) {
      favorites = favorites.filter(id => id !== recipe.id);
      tt.showToast({ title: 'Removed from favorites', icon: 'none' });
    } else {
      favorites.push(recipe.id);
      tt.showToast({ title: 'Added to favorites', icon: 'success' });
    }
    
    tt.setStorageSync('favorites', favorites);
    this.setData({ isFavorited: !isFavorited });
  },
  
  onServingsChange(e) {
    const servings = parseInt(e.detail.value);
    this.setData({ servings });
  },
  
  onStartCooking() {
    tt.showToast({
      title: 'Let\'s start cooking!',
      icon: 'success'
    });
  },
  
  onShareRecipe() {
    return {
      title: `Recommended Recipe: ${this.data.recipe.title_en || this.data.recipe.name}`,
      path: `/pages/RecipeDetail/RecipeDetail?id=${this.data.recipe.id}`
    };
  }
});