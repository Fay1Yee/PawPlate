const homeData = require('../../data/home.js');
const recipes = require('../../data/recipes.js');
const products = require('../../data/products.js');

Page({
  data: {
    // Video recipe data
    videoRecipe: {
      name: 'Salmon & Sweet Potato Bowl',
      ingredients: [
        { name: 'Salmon', g: 150 },
        { name: 'Sweet Potato', g: 100 },
        { name: 'Spinach', g: 30 },
        { name: 'Olive Oil', g: 5 }
      ]
    },
    ingredientIcons: {},

    // Product carousel data
    productPages: [],
    currentProductPage: 0,

    // Daily tips array
    dailyTips: [
      'Regular exercise helps maintain your pet\'s healthy weight and mental well-being. Try 30 minutes of activity daily!',
      'Fresh water should always be available for your pet. Change it daily to ensure cleanliness.',
      'Dental health is crucial! Brush your pet\'s teeth regularly or provide dental chews.',
      'Mental stimulation is as important as physical exercise. Try puzzle toys and training games.',
      'Regular vet check-ups help catch health issues early. Schedule annual wellness exams.',
      'A balanced diet with proper portions prevents obesity and ensures optimal nutrition.'
    ],
    currentTipIndex: 0,

    // Today's recommended recipe
    currentRecipe: null,

    // Waterfall flow recommended recipes
    recommendedRecipes: [],

    // Two-column waterfall flow data
    leftColumnItems: [],
    rightColumnItems: [],

    // Pet feeding short video data
    petVideos: [],

    // User active days
    activeDays: 15
  },

  onLoad() {
    this.loadIngredientIcons();
    this.loadCurrentRecipe();
    this.loadProducts();
    this.loadRecommendedRecipes(); // 这个函数内部会调用distributeWaterfallItems
    this.loadPetVideos();
    this.startProductCarousel();
    this.startTipCarousel();
  },

  onShow() {
    // Refresh data when page is shown
    this.loadCurrentRecipe();
  },

  // Load ingredient icon mapping
  loadIngredientIcons() {
    const ingredientIcons = homeData.ingredientIcons || {
      'Salmon': '/images/ingredients/salmon.svg',
      'Sweet Potato': '/images/ingredients/sweet_potato.svg',
      'Spinach': '/images/ingredients/spinach.svg',
      'Olive Oil': '/images/ingredients/olive_oil.svg',
      'Chicken': '/images/ingredients/chicken.svg',
      'Rice': '/images/ingredients/rice.svg',
      'Carrots': '/images/ingredients/carrot.svg',
      'Peas': '/images/ingredients/peas.svg'
    };
    this.setData({ ingredientIcons });
  },

  loadCurrentRecipe() {
    // Load today's recommended recipe
    const recipeData = recipes[0] || {
      id: 1,
      name: 'Chicken & Rice Meal',
      description: 'A nutritious and balanced meal for your pet',
      image: '/images/recipes/pumpkin_chicken_porridge.jpg',
      difficulty: 'Easy',
      cookingTime: '30 min',
      ingredients: ['Chicken', 'Rice', 'Carrots', 'Peas']
    };
    
    // Convert to format needed by template
    const currentRecipe = {
      ...recipeData,
      cookTime: recipeData.cookingTime || '30 min',
      servings: 2,
      calories: 350
    };
    
    this.setData({ 
      currentRecipe,
      ingredientIcons: homeData.ingredientIcons || {}
    });
  },

  loadProducts() {
    // Simulate product data, display 2 products per page
    const allProducts = [
      { id: 1, name: 'Premium Cat Food 2kg', price: 89, image: '/images/products/premium-cat-food-2kg.jpg' },
      { id: 2, name: 'Cat Treats 300g', price: 25, image: '/images/products/cat-treats-300g.jpg' },
      { id: 3, name: 'Nutrition Paste 120g', price: 35, image: '/images/products/nutrition-paste-120g.jpg' },
      { id: 4, name: 'Hairball Paste 100g', price: 28, image: '/images/products/hairball-paste-100g.jpg' },
      { id: 5, name: 'Cat Vitamins 30pcs', price: 45, image: '/images/products/cat-vitamins-30pcs.jpg' },
      { id: 6, name: 'Probiotics 15g', price: 38, image: '/images/products/probiotics-15g.jpg' },
      { id: 7, name: 'Dental Treats 200g', price: 32, image: '/images/products/dental-treats-200g.jpg' },
      { id: 8, name: 'Omega-3 Supplement', price: 55, image: '/images/products/omega3-supplement.jpg' }
    ];
    
    const productsPerPage = 1;
    const productPages = [];
    
    for (let i = 0; i < allProducts.length; i += productsPerPage) {
      productPages.push(allProducts.slice(i, i + productsPerPage));
    }
    
    this.setData({ productPages });
  },

  loadRecommendedRecipes() {
    // Waterfall flow recommended recipe data - using AI-generated realistic images
    const recommendedRecipes = [
      {
        id: 1,
        name: 'Tuna & Quinoa Delight',
        image: '/images/ai-generated/tuna-quinoa-delight.jpg',
        cookTime: '25 min',
        difficulty: 'Easy'
      },
      {
        id: 2,
        name: 'Beef & Vegetable Stew',
        image: '/images/ai-generated/beef-vegetable-stew.jpg',
        cookTime: '45 min',
        difficulty: 'Medium'
      },
      {
        id: 3,
        name: 'Chicken & Pumpkin Bowl',
        image: '/images/ai-generated/chicken-pumpkin-bowl.jpg',
        cookTime: '30 min',
        difficulty: 'Easy'
      },
      {
        id: 4,
        name: 'Fish & Sweet Potato',
        image: '/images/ai-generated/fish-sweet-potato.jpg',
        cookTime: '35 min',
        difficulty: 'Easy'
      },
      {
        id: 5,
        name: 'Turkey & Rice Medley',
        image: '/images/ai-generated/turkey-rice-medley.jpg',
        cookTime: '40 min',
        difficulty: 'Medium'
      },
      {
        id: 6,
        name: 'Lamb & Barley Feast',
        image: '/images/ai-generated/lamb-barley-feast.jpg',
        cookTime: '50 min',
        difficulty: 'Hard'
      }
    ];
    
    this.setData({ recommendedRecipes }, () => {
      // 确保在数据设置完成后再分配瀑布流项目
      this.distributeWaterfallItems();
    });
  },

  loadPetVideos() {
    const petVideos = [
      {
        id: 'v1',
        type: 'video',
        title: 'Proper Cat Feeding Tutorial',
        thumbnail: '/images/videos/cat-feeding.jpeg',
        duration: '2:30',
        views: '12.5K',
        likes: '856',
        videoUrl: '/videos/cat-feeding-tips.mp4'
      },
      {
        id: 'v2',
        type: 'video',
        title: 'Dog Training & Feeding Tips',
        thumbnail: '/images/videos/dog-training.jpeg',
        duration: '5:12',
        views: '8.9K',
        likes: '642',
        videoUrl: '/videos/dog-meal-prep.mp4'
      },
      {
        id: 'v3',
        type: 'video',
        title: 'Daily Rabbit Care Guide',
        thumbnail: '/images/videos/rabbit-care.jpeg',
        duration: '3:45',
        views: '6.2K',
        likes: '423',
        videoUrl: '/videos/senior-pet-treats.mp4'
      },
      {
        id: 'v4',
        type: 'video',
        title: 'Bird Nutrition & Feeding Methods',
        thumbnail: '/images/videos/bird-feeding.jpeg',
        duration: '4:18',
        views: '15.3K',
        likes: '1.2K',
        videoUrl: '/videos/puppy-feeding.mp4'
      }
    ];
    
    this.setData({ petVideos }, () => {
      this.distributeWaterfallItems();
    });
  },

  distributeWaterfallItems() {
    // Merge recipe and video data
    const recipes = this.data.recommendedRecipes.map(recipe => ({
      ...recipe,
      type: 'recipe'
    }));
    
    const videos = this.data.petVideos;
    
    // Mix all content
    const allItems = [...recipes, ...videos];
    
    // Randomly shuffle order
    for (let i = allItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allItems[i], allItems[j]] = [allItems[j], allItems[i]];
    }
    
    // Distribute to two columns, try to maintain height balance
    const leftColumn = [];
    const rightColumn = [];
    
    allItems.forEach((item, index) => {
      if (index % 2 === 0) {
        leftColumn.push(item);
      } else {
        rightColumn.push(item);
      }
    });
    
    this.setData({
      leftColumnItems: leftColumn,
      rightColumnItems: rightColumn
    });
  },

  // Product carousel control
  startProductCarousel() {
    setInterval(() => {
      const { productPages, currentProductPage } = this.data;
      const nextPage = (currentProductPage + 1) % productPages.length;
      this.setData({ currentProductPage: nextPage });
    }, 4000);
  },

  switchProductPage(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ currentProductPage: index });
  },

  // Video recipe related functions
  viewVideoRecipe() {
    // Navigate to recipe detail page with ID 1
    tt.navigateTo({
      url: '/pages/RecipeDetail/RecipeDetail?id=1'
    });
  },

  // Daily tip carousel
  startTipCarousel() {
    setInterval(() => {
      const { dailyTips, currentTipIndex } = this.data;
      const nextIndex = (currentTipIndex + 1) % dailyTips.length;
      this.setData({ currentTipIndex: nextIndex });
    }, 5000); // Switch tips every 5 seconds
  },

  // Navigate to recipe detail
  goToRecipe(e) {
    const recipeId = e.currentTarget.dataset.id;
    tt.navigateTo({
      url: `/pages/RecipeDetail/RecipeDetail?id=${recipeId}`
    });
  },

  // Navigate to product detail for purchase
  buyProduct(e) {
    const productId = e.currentTarget.dataset.id;
    tt.navigateTo({
      url: `/pages/purchase/handoff/index?id=${productId}`
    });
  },

  // Navigate to AI customization form
  goToAICustomize() {
    tt.navigateTo({
      url: '/pages/ai/form/index',
    });
  },

  playVideo(e) {
    // Video click functionality removed - no navigation
    // Videos are now display-only content
  },

  // Navigate to profile page
  goToProfile() {
    tt.navigateTo({
      url: '/pages/Profile/index'
    });
  }
});
