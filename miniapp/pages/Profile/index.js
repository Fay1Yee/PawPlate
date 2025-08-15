const app = getApp();
const store = require('../../store/app.js');

Page({
  data: {
    user: {},
    petProfile: {},
    favoritedRecipes: [],
    // Pet profile data
    profile: {
      name: 'Orange',
      avatar: '/images/e802aa65c735bb665914e18bfa000010.jpg',
      species: 'Cat',
      breed: 'British Shorthair',
      age_months: 12,
      weight_kg: 3.8
    },
    
    // Favorites list data
    favorites: [
      {
        id: 1,
        name: 'Pumpkin Chicken Porridge',
        type: 'recipe',
        image: '/images/recipes/pumpkin_chicken_porridge.jpg'
      },
      {
        id: 2,
        name: 'Salmon Avocado Bowl',
        type: 'recipe',
        image: '/images/recipes/salmon_avocado_bowl.jpg'
      },
      {
        id: 3,
        name: 'Chicken Pumpkin Bowl',
        type: 'recipe',
        image: '/images/recipes/chicken-pumpkin-bowl.jpg'
      },
      {
        id: 4,
        name: 'Beef Vegetable Stew',
        type: 'recipe',
        image: '/images/recipes/beef-vegetable-stew.jpg'
      }
    ],
    
    // AI customization history data
    aiHistory: [
      {
        id: 1,
        date: '2023-12-15',
        recipeName: 'Chicken Pumpkin Porridge',
        petName: 'Orange'
      },
      {
        id: 2,
        date: '2023-12-10',
        recipeName: 'Salmon Avocado Bowl',
        petName: 'Orange'
      },
      {
        id: 3,
        date: '2023-12-05',
        recipeName: 'Beef Carrot Porridge',
        petName: 'Orange'
      }
    ]
  },

  onLoad() {
    // 页面加载时可以从缓存或服务器获取数据
    this.loadProfileData();
  },
  
  onShow() {
    // Update user info, pet info and favorites list when page shows
    this.loadUserProfile();
    this.loadPetProfile();
    this.loadFavoritedRecipes();
  },
  
  loadProfileData() {
    // Logic to load data from server or local storage can be added here
    console.log('Loading profile data');
    // Example: Get data from local storage
    // const profileData = tt.getStorageSync('profileData');
    // if (profileData) {
    //   this.setData({ profile: profileData });
    // }
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
    // 如果store中没有收藏数据，使用默认的收藏列表
    if (favoritedRecipes.length === 0) {
      const defaultFavorites = [
        {
          id: 1,
          name: 'Pumpkin Chicken Porridge',
          type: 'recipe',
          image: '/images/recipes/pumpkin_chicken_porridge.jpg'
        },
        {
          id: 2,
          name: 'Salmon Avocado Bowl',
          type: 'recipe',
          image: '/images/recipes/salmon_avocado_bowl.jpg'
        },
        {
          id: 3,
          name: 'Chicken Pumpkin Bowl',
          type: 'recipe',
          image: '/images/recipes/chicken-pumpkin-bowl.jpg'
        },
        {
          id: 4,
          name: 'Beef Vegetable Stew',
          type: 'recipe',
          image: '/images/recipes/beef-vegetable-stew.jpg'
        }
      ];
      this.setData({
        favorites: defaultFavorites,
        favoritedRecipes: defaultFavorites
      });
    } else {
      this.setData({
        favorites: favoritedRecipes,
        favoritedRecipes: favoritedRecipes
      });
    }
  },
  
  editPetProfile() {
    tt.navigateTo({
      url: '/pages/ai/form/index'
    });
  },
  
  addPetProfile() {
    tt.navigateTo({
      url: '/pages/ai/form/index'
    });
  },
  
  // Edit pet profile
  editProfile() {
    tt.showToast({
      title: 'Profile editing feature in development',
      icon: 'none'
    });
    // 实际实现可以跳转到编辑页面
    // tt.navigateTo({
    //   url: '/pages/ProfileEdit/index'
    // });
  },
  
  // View favorite recipe or product
  viewFavorite(e) {
    const id = e.currentTarget.dataset.id;
    const favorite = this.data.favorites.find(item => item.id === id);
    
    if (favorite) {
      if (favorite.type === 'recipe') {
        // Navigate to recipe detail page
        tt.navigateTo({
          url: `/pages/RecipeDetail/index?id=${id}`
        });
      } else {
        // Navigate to product detail page
        tt.navigateTo({
          url: `/pages/ProductDetail/index?id=${id}`
        });
      }
    }
  },
  
  // View AI customization history
  viewHistory(e) {
    const id = e.currentTarget.dataset.id;
    // Navigate to AI customization result page
    tt.navigateTo({
      url: `/pages/AIResult/index?id=${id}`
    });
  },
  
  goToRecipeDetail(e) {
    const recipeId = e.currentTarget.dataset.id;
    tt.navigateTo({
      url: `/pages/RecipeDetail/RecipeDetail?id=${recipeId}`
    });
  },
  
  clearCache() {
    tt.showModal({
      title: 'Clear Cache',
      content: 'Are you sure you want to clear all cached data?',
      success: (res) => {
        if (res.confirm) {
          // Clear cache logic
          tt.clearStorage({
            success: () => {
              tt.showToast({
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
    tt.showModal({
      title: 'About App',
      content: 'Pet Food Recommendation Mini App v1.0.0\n\nProviding personalized pet food recommendations for you',
      showCancel: false
    });
  }
});