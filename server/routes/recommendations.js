const express = require('express');
const router = express.Router();

// 模拟推荐算法
const generateRecommendations = (petProfile) => {
  // 简单的推荐逻辑，根据宠物类型和年龄推荐
  const recommendations = [];
  
  if (petProfile.type === '狗狗') {
    if (petProfile.age < 12) {
      recommendations.push({
        id: 1,
        name: '幼犬营养餐',
        description: '专为幼犬设计，促进骨骼发育',
        cookTime: 30,
        difficulty: '简单',
        image: '/images/recipe1.jpg'
      });
    } else if (petProfile.age > 84) {
      recommendations.push({
        id: 2,
        name: '老年犬低脂餐',
        description: '低脂易消化，适合老年犬',
        cookTime: 35,
        difficulty: '简单',
        image: '/images/recipe2.jpg'
      });
    } else {
      recommendations.push({
        id: 3,
        name: '成犬鸡肉蔬菜餐',
        description: '营养均衡，适合成年犬',
        cookTime: 40,
        difficulty: '中等',
        image: '/images/recipe3.jpg'
      });
    }
  } else if (petProfile.type === '猫咪') {
    if (petProfile.age < 12) {
      recommendations.push({
        id: 4,
        name: '幼猫营养餐',
        description: '高蛋白，促进幼猫成长',
        cookTime: 25,
        difficulty: '简单',
        image: '/images/recipe4.jpg'
      });
    } else if (petProfile.age > 120) {
      recommendations.push({
        id: 5,
        name: '老年猫低磷餐',
        description: '低磷配方，保护肾脏',
        cookTime: 30,
        difficulty: '简单',
        image: '/images/recipe5.jpg'
      });
    } else {
      recommendations.push({
        id: 6,
        name: '成猫三文鱼餐',
        description: '富含Omega-3，美毛护肤',
        cookTime: 35,
        difficulty: '中等',
        image: '/images/recipe6.jpg'
      });
    }
  }
  
  return recommendations;
};

// 生成推荐食谱
router.post('/', (req, res) => {
  const petProfile = req.body;
  
  // 验证输入
  if (!petProfile || !petProfile.type || !petProfile.age) {
    return res.status(400).json({
      success: false,
      message: '宠物信息不完整'
    });
  }
  
  // 生成推荐
  const recommendations = generateRecommendations(petProfile);
  
  res.json({
    success: true,
    data: recommendations
  });
});

module.exports = router;