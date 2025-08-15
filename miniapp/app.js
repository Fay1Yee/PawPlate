App({
  globalData: {
    user: null,
    petProfile: null,
    favoritedRecipes: []
  },
  
  onLaunch() {
    // Execute when mini app initializes
    console.log('Pet Food Recommendation Mini App started');
    
    // Set home page to newly created Home page
    tt.setStorageSync('homePage', 'pages/Home/index');
  },
  
  onShow() {
    // Execute when mini app starts or enters foreground from background
  },
  
  onHide() {
    // Execute when mini app enters background from foreground
  }
});