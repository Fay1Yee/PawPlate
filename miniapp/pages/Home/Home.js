Page({
  data: {
    petProfile: null,
    dailyTip: 'Ensure your pet has adequate water intake daily, which is very important for maintaining health.'
  },

  onLoad() {
    this.loadPetProfile();
  },

  onShow() {
    this.loadPetProfile();
  },

  loadPetProfile() {
    const app = getApp();
    const petProfile = app.store.getters.getPetProfile();
    this.setData({
      petProfile
    });
  },

  editPetProfile() {
    wx.navigateTo({
      url: '/pages/PetProfile/PetProfile'
    });
  },

  goToAIConsultation() {
    wx.navigateTo({
      url: '/pages/AIConsultation/AIConsultation'
    });
  },

  goToRecipeList() {
    wx.navigateTo({
      url: '/pages/RecipeList/RecipeList'
    });
  },

  goToFavorites() {
    wx.navigateTo({
      url: '/pages/Favorites/Favorites'
    });
  }
});