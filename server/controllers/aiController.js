const aiService = require('../services/aiService');

// AI定制菜谱接口
const customizeRecipe = async (req, res) => {
  try {
    const { recipeId, recipeName, originalIngredients, petInfo } = req.body;
    
    console.log('收到AI定制请求:', { recipeId, recipeName, originalIngredients, petInfo });
    
    // 验证必要参数
    if (!petInfo || !petInfo.weight || !petInfo.age) {
      return res.status(400).json({
        success: false,
        message: '请提供完整的宠物信息（体重和年龄）'
      });
    }
    
    // 处理过敏信息，确保是数组格式
    let allergiesArray = [];
    if (petInfo.allergies) {
      if (Array.isArray(petInfo.allergies)) {
        allergiesArray = petInfo.allergies;
      } else if (typeof petInfo.allergies === 'string' && petInfo.allergies !== '无' && petInfo.allergies !== '') {
        allergiesArray = petInfo.allergies.split(',').map(item => item.trim());
      }
    }
    
    // 标准化宠物信息
    const normalizedPetInfo = {
      species: petInfo.species || 'cat',
      weight: parseFloat(petInfo.weight),
      age: parseFloat(petInfo.age),
      allergies: allergiesArray,
      breed: petInfo.breed || '未知品种',
      activityLevel: petInfo.activityLevel || '适中活动',
      healthConditions: petInfo.healthConditions || '健康状况良好'
    };
    
    // 调用豆包AI服务
    const result = await aiService.customizeRecipeWithAI({
      recipeId,
      recipeName: recipeName || '营养餐',
      originalIngredients: originalIngredients || [
        { name: '鸡胸肉', amount: '200g' },
        { name: '胡萝卜', amount: '100g' },
        { name: '西兰花', amount: '100g' },
        { name: '米饭', amount: '150g' }
      ],
      petInfo: normalizedPetInfo
    });
    
    // 格式化返回结果，确保与前端期望的格式一致
    const formattedResult = {
      success: true,
      data: {
        adjusted_portion_g: calculateTotalPortion(result.data.customizedRecipe.ingredients),
        feeding_frequency_per_day: calculateFeedingFrequency(normalizedPetInfo),
        adjusted_ingredients: result.data.customizedRecipe.ingredients.map(ing => ({
          name: ing.name,
          grams: parseFloat(ing.amount) || 0
        })),
        alt_ingredients: generateAlternatives(allergiesArray, normalizedPetInfo),
        nutritionAnalysis: result.data.customizedRecipe.nutritionAnalysis,
        feedingAdvice: result.data.customizedRecipe.feedingAdvice,
        precautions: result.data.customizedRecipe.precautions
      }
    };
    
    console.log('AI定制结果:', formattedResult);
    res.json(formattedResult);
    
  } catch (error) {
    console.error('AI定制失败:', error);
    res.status(500).json({
      success: false,
      message: '定制失败，请稍后重试',
      error: error.message
    });
  }
};

// 计算总分量
function calculateTotalPortion(ingredients) {
  return ingredients.reduce((total, ing) => {
    const amount = parseFloat(ing.amount) || 0;
    return total + amount;
  }, 0);
}

// 计算喂食频率
function calculateFeedingFrequency(petInfo) {
  if (petInfo.age < 6) return 4; // 幼犬/幼猫
  if (petInfo.age < 12) return 3; // 青年期
  return 2; // 成年期
}

// 生成替代食材建议
function generateAlternatives(allergies, petInfo) {
  const alternatives = [];
  
  if (allergies.includes('鸡肉') || allergies.includes('鸡胸肉')) {
    alternatives.push('鸭肉', '火鸡肉');
  }
  
  if (allergies.includes('牛肉')) {
    alternatives.push('羊肉', '鹿肉');
  }
  
  if (allergies.includes('海鲜')) {
    alternatives.push('淡水鱼', '鸡肉');
  }
  
  if (allergies.includes('谷物')) {
    alternatives.push('红薯', '土豆', '豌豆');
  }
  
  // 根据宠物种类添加默认建议
  if (petInfo.species === 'cat') {
    alternatives.push('三文鱼', '鸡肝', '牛磺酸补充剂');
  } else {
    alternatives.push('胡萝卜', '蓝莓', '南瓜');
  }
  
  return alternatives.slice(0, 3); // 最多返回3个建议
}

// 获取AI推荐菜谱
const getRecommendations = async (req, res) => {
  try {
    const { petInfo } = req.body;
    
    // 这里可以调用豆包AI生成推荐菜谱
    // 暂时返回模拟数据
    const recommendations = [
      {
        id: 'ai_rec_1',
        name: 'AI推荐：幼犬成长餐',
        description: '专为幼犬设计的高蛋白营养餐',
        ingredients: [
          { name: '鸡胸肉', amount: '150g', nutrition: '高蛋白' },
          { name: '三文鱼', amount: '50g', nutrition: 'Omega-3' },
          { name: '红薯', amount: '100g', nutrition: '碳水化合物' }
        ],
        aiGenerated: true
      },
      {
        id: 'ai_rec_2',
        name: 'AI推荐：老年犬养护餐',
        description: '适合老年犬的易消化营养餐',
        ingredients: [
          { name: '鸡肉泥', amount: '120g', nutrition: '易消化蛋白' },
          { name: '南瓜', amount: '80g', nutrition: '纤维素' },
          { name: '胡萝卜', amount: '60g', nutrition: '维生素A' }
        ],
        aiGenerated: true
      }
    ];
    
    res.json({
      success: true,
      data: recommendations
    });
    
  } catch (error) {
    console.error('获取推荐失败:', error);
    res.status(500).json({
      success: false,
      message: '获取推荐失败',
      error: error.message
    });
  }
};

module.exports = {
  customizeRecipe,
  getRecommendations
};