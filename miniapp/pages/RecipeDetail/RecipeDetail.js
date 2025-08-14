const app = getApp();
const store = require('../../store/app.js');
const img = require('../../utils/img.js');
const api = require('../../services/api.js');

Page({
  data: {
    recipe: {},
    isFavorited: false
  },
  
  onLoad(options) {
    const recipeId = options.id;
    if (recipeId) {
      this.getRecipeDetail(recipeId);
      this.checkIfFavorited(recipeId);
    }
  },
  
  onShow() {
    // Check if favorited when page shows
    this.checkIfFavorited();
  },
  
  getRecipeDetail(id) {
    wx.showLoading({
      title: 'Loading...'
    });
    
    api.getRecipeById(id)
      .then(recipe => {
        // 为食谱设置AI生成的详情图片
        if (recipe.recipe_id) {
          const detailImageKey = `recipe.detail.${recipe.recipe_id}`;
          const detailImage = img.get(detailImageKey);
          if (detailImage && !detailImage.includes('data:image/svg+xml')) {
            recipe.image = detailImage;
          }
        }
        
        this.setData({
          recipe: recipe
        });
        wx.hideLoading();
      })
      .catch(err => {
        console.error('Failed to get recipe details:', err);
        wx.hideLoading();
        wx.showToast({
          title: 'Failed to get recipe details',
          icon: 'none'
        });
        
        // Use mock data as fallback
        const mockRecipe = {
          id: id,
          recipe_id: id, // 添加recipe_id用于图片匹配
          name: 'Chicken Vegetable Nutrition Meal',
          description: 'This is a nutritionally balanced pet food, rich in protein and vitamins, suitable for dogs of all ages.',
          prepTime: 15,
          cookTime: 30,
          difficulty: 'Easy',
          image: img.get(`recipe.detail.${id}`) || 'http://localhost:3000/images/ai-generated/recipes/鸡肉南瓜宠物餐_新鲜鸡胸肉和南瓜块_摆放_2e982d9a_1755119257964.svg',
          ingredients: [
            { name: 'Chicken Breast', amount: '200g' },
            { name: 'Carrot', amount: '1 piece' },
            { name: 'Broccoli', amount: '100g' },
            { name: 'Rice', amount: '1 bowl' }
          ],
          steps: [
            { number: 1, description: 'Dice the chicken breast, cut carrot and broccoli into small pieces' },
            { number: 2, description: 'Cook the chicken breast until done' },
            { number: 3, description: 'Blanch the carrot and broccoli' },
            { number: 4, description: 'Mix all ingredients together, add rice and stir well' }
          ]
        };
        
        this.setData({
          recipe: mockRecipe
        });
      });
  },
  
  checkIfFavorited() {
    // Check if current recipe is favorited
    const favoritedRecipes = store.getters.getFavoritedRecipes();
    const isFavorited = favoritedRecipes.some(item => item.id === this.data.recipe.id);
    this.setData({
      isFavorited: isFavorited
    });
  },
  
  addToFavorites() {
    // Add to favorites
    if (this.data.isFavorited) {
      store.actions.removeFavorite(this.data.recipe.id);
      this.setData({
        isFavorited: false
      });
      wx.showToast({
        title: 'Removed from favorites',
        icon: 'success'
      });
    } else {
      store.actions.addFavorite(this.data.recipe);
      this.setData({
        isFavorited: true
      });
      wx.showToast({
        title: 'Added to favorites',
        icon: 'success'
      });
    }
  }
});