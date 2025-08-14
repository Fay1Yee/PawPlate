const app = getApp();
const store = require('../../store/app.js');
const api = require('../../services/api.js');
const img = require('../../utils/img.js');

Page({
  data: {
    petProfile: {},
    recommendations: []
  },
  
  onLoad() {
    // 页面加载时获取宠物信息和推荐食谱
    this.loadPetProfile();
    this.loadRecommendations();
  },
  
  loadPetProfile() {
    const petProfile = store.getters.getPetProfile();
    this.setData({
      petProfile: petProfile || {}
    });
  },
  
  loadRecommendations() {
    const petProfile = this.data.petProfile;
    
    if (!petProfile || !petProfile.type || !petProfile.age) {
      wx.showToast({
        title: '请先完善宠物信息',
        icon: 'none'
      });
      return;
    }
    
    wx.showLoading({
      title: '生成推荐中...'
    });
    
    api.generateRecommendations(petProfile)
      .then(recommendations => {
        // 为推荐菜谱添加图片URL
        const recommendationsWithImages = recommendations.map(recipe => {
          let imageUrl = img.get('recipes.default');
          
          // 根据菜谱名称匹配图片
          if (recipe.name.includes('鸡肉') || recipe.name.includes('鸡胸肉')) {
            imageUrl = img.get('recipes.cat_001');
          } else if (recipe.name.includes('三文鱼') || recipe.name.includes('鱼')) {
            imageUrl = img.get('recipes.dog_001');
          } else if (recipe.name.includes('牛肉')) {
            imageUrl = img.get('stickers.beef');
          } else if (recipe.name.includes('南瓜')) {
            imageUrl = img.get('stickers.pumpkin');
          }
          
          return {
            ...recipe,
            image: imageUrl
          };
        });
        
        this.setData({
          recommendations: recommendationsWithImages
        });
        wx.hideLoading();
      })
      .catch(err => {
        console.error('生成推荐失败:', err);
        wx.hideLoading();
        wx.showToast({
          title: '生成推荐失败',
          icon: 'none'
        });
        
        // 使用模拟数据作为后备
        const mockRecommendations = [
          {
            id: 1,
            name: '鸡肉蔬菜营养餐',
            description: '富含蛋白质和维生素，适合所有年龄段的狗狗',
            cookTime: 30,
            difficulty: '简单',
            image: 'http://localhost:3000/images/ai-generated/recipes/鸡肉南瓜宠物餐_新鲜鸡胸肉和南瓜块_摆放_2e982d9a_1755119257964.svg'
          },
          {
            id: 2,
            name: '三文鱼美毛餐',
            description: '富含Omega-3脂肪酸，帮助宠物美毛护肤',
            cookTime: 45,
            difficulty: '中等',
            image: 'http://localhost:3000/images/ai-generated/recipes/三文鱼蔬菜宠物餐_新鲜三文鱼片配胡萝卜和_beafd8bd_1755119260203.svg'
          },
          {
            id: 3,
            name: '低脂减肥餐',
            description: '专为超重宠物设计，低脂高纤维',
            cookTime: 35,
            difficulty: '简单',
            image: 'http://localhost:3000/images/ai-generated/recipes/鸡肉南瓜宠物餐_新鲜鸡胸肉和南瓜块_摆放_2e982d9a_1755119257964.svg'
          }
        ];
        
        this.setData({
          recommendations: mockRecommendations
        });
      });
  },
  
  goToRecipeDetail(e) {
    const recipeId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/RecipeDetail/RecipeDetail?id=${recipeId}`
    });
  },
  
  recreateRecommendations() {
    // 重新生成推荐逻辑
    wx.showToast({
      title: '正在重新生成推荐...',
      icon: 'loading',
      duration: 1000
    });
    
    // 模拟重新加载推荐
    setTimeout(() => {
      this.loadRecommendations();
      wx.showToast({
        title: '推荐已更新',
        icon: 'success'
      });
    }, 1000);
  }
});