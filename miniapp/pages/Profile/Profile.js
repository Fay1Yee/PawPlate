const app = getApp();
const store = require('../../store/app.js');

Page({
  data: {
    user: {},
    petProfile: {},
    favoritedRecipes: []
  },
  
  onShow() {
    // Update user info, pet info and favorites list when page shows
    this.loadUserProfile();
    this.loadPetProfile();
    this.loadFavoritedRecipes();
  },
  
  loadUserProfile() {
    const user = store.getters.getUser();
    this.setData({
      user: user || {}
    });
  },
  
  loadPetProfile() {
    const petProfile = store.getters.getPetProfile();
    this.setData({
      petProfile: petProfile || {}
    });
  },
  
  loadFavoritedRecipes() {
    const favoritedRecipes = store.getters.getFavoritedRecipes();
    this.setData({
      favoritedRecipes: favoritedRecipes || []
    });
  },
  
  editPetProfile() {
    wx.navigateTo({
      url: '/pages/AIForm/AIForm'
    });
  },
  
  addPetProfile() {
    wx.navigateTo({
      url: '/pages/AIForm/AIForm'
    });
  },
  
  goToRecipeDetail(e) {
    const recipeId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/RecipeDetail/RecipeDetail?id=${recipeId}`
    });
  },
  
  clearCache() {
    wx.showModal({
      title: 'Clear Cache',
      content: 'Are you sure you want to clear all cached data?',
      success: (res) => {
        if (res.confirm) {
          // Clear cache logic
          wx.clearStorage({
            success: () => {
              wx.showToast({
                title: 'Cache cleared',
                icon: 'success'
              });
              // Reset state
              store.actions.resetState();
              // Reload data
              this.loadUserProfile();
              this.loadPetProfile();
              this.loadFavoritedRecipes();
            }
          });
        }
      }
    });
  },
  
  aboutApp() {
    wx.showModal({
      title: 'About App',
      content: 'Pet Food Recommendation Mini App v1.0.0\n\nProviding personalized pet food recommendations for you',
      showCancel: false
    });
  }
});