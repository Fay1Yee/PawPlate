// Recipe list page logic
const recipes = require('../../data/recipes.js');
const homeData = require('../../data/home.js');

Page({
  data: {
    recipes: [],
    filteredRecipes: [],
    searchKeyword: '',
    selectedDifficulty: 'all',
    ingredientIcons: homeData.ingredientIcons
  },
  
  onLoad() {
    this.loadRecipes();
  },
  
  loadRecipes() {
    this.setData({
      recipes: recipes,
      filteredRecipes: recipes
    });
  },
  
  onSearchInput(e) {
    const keyword = e.detail.value;
    this.setData({ searchKeyword: keyword });
    this.filterRecipes();
  },
  
  onDifficultyChange(e) {
    const difficulty = e.currentTarget.dataset.difficulty;
    this.setData({ selectedDifficulty: difficulty });
    this.filterRecipes();
  },
  
  filterRecipes() {
    const { recipes, searchKeyword, selectedDifficulty } = this.data;
    let filtered = recipes;
    
    if (searchKeyword) {
      filtered = filtered.filter(recipe => 
        recipe.name.includes(searchKeyword) || 
        recipe.ingredients.some(ingredient => ingredient.includes(searchKeyword))
      );
    }
    
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(recipe => recipe.difficulty === selectedDifficulty);
    }
    
    this.setData({ filteredRecipes: filtered });
  },
  
  onRecipeClick(e) {
    const recipeId = e.currentTarget.dataset.id;
    tt.navigateTo({
      url: `/pages/RecipeDetail/RecipeDetail?id=${recipeId}`
    });
  }
});