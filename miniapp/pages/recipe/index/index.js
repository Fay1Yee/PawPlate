// pages/recipe/index/index.js
const api = require('../../../services/api.js');

Page({
  data: {
    recipe: {}
  },
  onLoad: function(options) {
    const recipeId = options.id;
    this.fetchRecipe(recipeId);
  },
  fetchRecipe: function(id) {
    console.log('获取菜谱详情，ID:', id);
    api.getRecipeById(id).then(res => {
      console.log('菜谱详情API响应:', res);
      if (res && res.id) {
        this.setData({ recipe: res });
      } else {
        // 使用模拟数据作为后备
        const mockRecipe = {
          id: id,
          name: '鸡肉蔬菜营养餐',
          description: '这是一道营养均衡的宠物食品，富含蛋白质和维生素，适合所有年龄段的狗狗。',
          prepTime: 15,
          cookTime: 30,
          difficulty: '简单',
          image: 'http://localhost:3000/images/ai-generated/recipes/鸡肉南瓜宠物餐_新鲜鸡胸肉和南瓜块_摆放_2e982d9a_1755119257964.svg',
          ingredients: [
            { name: '鸡胸肉', amount: '200g' },
            { name: '胡萝卜', amount: '1根' },
            { name: '西兰花', amount: '100g' },
            { name: '米饭', amount: '1碗' }
          ],
          steps: [
            { number: 1, description: '将鸡胸肉切丁，胡萝卜和西兰花切小块' },
            { number: 2, description: '将鸡胸肉煮熟' },
            { number: 3, description: '将胡萝卜和西兰花焯水' },
            { number: 4, description: '将所有食材混合，加入米饭拌匀' }
          ]
        };
        this.setData({ recipe: mockRecipe });
      }
    }).catch(err => {
      console.error('获取菜谱详情失败:', err);
      // 使用模拟数据作为后备
      const mockRecipe = {
        id: id,
        name: '鸡肉蔬菜营养餐',
        description: '这是一道营养均衡的宠物食品，富含蛋白质和维生素，适合所有年龄段的狗狗。',
        prepTime: 15,
        cookTime: 30,
        difficulty: '简单',
        image: '/images/recipe1.jpg',
        ingredients: [
          { name: '鸡胸肉', amount: '200g' },
          { name: '胡萝卜', amount: '1根' },
          { name: '西兰花', amount: '100g' },
          { name: '米饭', amount: '1碗' }
        ],
        steps: [
          { number: 1, description: '将鸡胸肉切丁，胡萝卜和西兰花切小块' },
          { number: 2, description: '将鸡胸肉煮熟' },
          { number: 3, description: '将胡萝卜和西兰花焯水' },
          { number: 4, description: '将所有食材混合，加入米饭拌匀' }
        ]
      };
      this.setData({ recipe: mockRecipe });
    });
  },
  customize: function() {
    const recipe = this.data.recipe;
    if (!recipe || !recipe.id) {
      tt.showToast({
        title: '菜谱信息不完整',
        icon: 'none'
      });
      return;
    }
    
    // 构建跳转参数
    const params = {
      recipeId: recipe.id,
      recipeName: recipe.name || '营养餐'
    };
    
    // 如果有食材信息，也传递过去
    if (recipe.ingredients && recipe.ingredients.length > 0) {
      params.ingredients = encodeURIComponent(JSON.stringify(recipe.ingredients));
    }
    
    // 构建URL参数字符串
    const paramString = Object.keys(params)
      .map(key => `${key}=${params[key]}`)
      .join('&');
    
    console.log('Navigate to AI customization page, params:', params);
    
    tt.navigateTo({ 
      url: `/pages/ai/form/index?${paramString}`
    });
  },
  buy: function() {
    api.purchaseLink(this.data.recipe.ingredients).then(res => {
      if (res.success) {
        tt.showToast({ title: res.data.cart_url });
      }
    });
  },
  favorite: function() {
    // Implement local storage for favorites
    tt.setStorageSync('favorites', [...tt.getStorageSync('favorites') || [], this.data.recipe.id]);
    tt.showToast({ title: 'Favorited' });
  }
});