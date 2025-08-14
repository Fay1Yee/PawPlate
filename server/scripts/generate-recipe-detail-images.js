const path = require('path');
const RealImageService = require('../services/realImageService');

// 加载环境变量
require('dotenv').config();

// 初始化图片生成服务
const imageService = new RealImageService();

// 食谱详情页面图片配置
const recipeDetailImages = [
  {
    key: 'recipe.detail.cat_001',
    prompt: 'Pumpkin chicken porridge for cats, detailed food photography, steamed chicken breast pieces mixed with mashed pumpkin in a ceramic pet bowl, garnished with cat nutrition powder, warm lighting, appetizing presentation, high resolution food styling',
    category: 'recipe-details',
    size: '1024x1024',
    style: 'realistic',
    service: 'doubao' // 使用豆包服务
  },
  {
    key: 'recipe.detail.dog_001',
    prompt: 'Salmon quinoa bowl for dogs, professional food photography, fresh salmon pieces with cooked quinoa, diced carrots and broccoli florets arranged in modern pet bowl, natural lighting, nutritious and colorful presentation',
    category: 'recipe-details',
    size: '1024x1024',
    style: 'realistic',
    service: 'doubao' // 使用豆包服务
  },
  {
    key: 'recipe.detail.chicken_veggie_bowl',
    prompt: 'Chicken and vegetable bowl detailed view, lean chicken breast with fresh broccoli, carrots and herbs, beautifully arranged in modern pet bowl, professional food photography, soft natural lighting',
    category: 'recipe-details',
    size: '1024x1024',
    style: 'realistic',
    service: 'doubao'
  },
  {
    key: 'recipe.detail.tuna_surprise',
    prompt: 'Tuna surprise with sweet potato detailed presentation, fresh tuna chunks with roasted sweet potato cubes, artfully plated on slate serving dish, professional food styling, natural lighting',
    category: 'recipe-details',
    size: '1024x1024',
    style: 'realistic',
    service: 'doubao'
  },
  {
    key: 'recipe.detail.salmon_vegetables',
    prompt: 'Salmon and vegetables pet meal close-up, fresh salmon fillet with colorful vegetables including carrots, broccoli and green beans, arranged on white ceramic plate, professional food photography',
    category: 'recipe-details',
    size: '1024x1024',
    style: 'realistic',
    service: 'doubao'
  },
  {
    key: 'recipe.detail.beef_rice',
    prompt: 'Beef and rice pet meal detailed view, lean ground beef mixed with brown rice and vegetables, served in elegant pet bowl, warm lighting, appetizing food presentation',
    category: 'recipe-details',
    size: '1024x1024',
    style: 'realistic',
    service: 'doubao'
  }
];

// 生成缺失图片的主函数
async function generateRecipeDetailImages() {
  console.log('开始生成食谱详情页面图片...');
  console.log(`总共需要生成 ${recipeDetailImages.length} 张图片`);
  
  let successCount = 0;
  let failureCount = 0;
  
  for (let i = 0; i < recipeDetailImages.length; i++) {
    const config = recipeDetailImages[i];
    console.log(`\n[${i + 1}/${recipeDetailImages.length}] 正在生成: ${config.key}`);
    console.log(`提示词: ${config.prompt}`);
    console.log(`服务: ${config.service}`);
    
    try {
      const result = await imageService.generateImage(config.prompt, {
        category: config.category,
        size: config.size,
        style: config.style,
        service: config.service
      });
      
      if (result.success) {
        console.log(`✅ 成功生成: ${result.filename}`);
        console.log(`   URL: ${result.url}`);
        successCount++;
      } else {
        console.log(`❌ 生成失败: ${result.error}`);
        failureCount++;
      }
    } catch (error) {
      console.error(`❌ 生成过程中出错: ${error.message}`);
      failureCount++;
    }
    
    // 添加延迟避免API限制
    if (i < recipeDetailImages.length - 1) {
      console.log('等待 2 秒...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log('\n=== 生成完成 ===');
  console.log(`成功: ${successCount}/${recipeDetailImages.length}`);
  console.log(`失败: ${failureCount}/${recipeDetailImages.length}`);
  
  if (successCount > 0) {
    console.log('\n生成的图片可以通过以下URL访问:');
    console.log('http://localhost:3000/images/ai-generated/');
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  generateRecipeDetailImages()
    .then(() => {
      console.log('\n脚本执行完成');
      process.exit(0);
    })
    .catch(error => {
      console.error('脚本执行失败:', error);
      process.exit(1);
    });
}

module.exports = { generateRecipeDetailImages };