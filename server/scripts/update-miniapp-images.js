#!/usr/bin/env node

/**
 * 小程序图片更新脚本
 * 将生成的AI图片集成到小程序前端
 */

const fs = require('fs');
const path = require('path');

// 路径配置
const MINIAPP_ROOT = path.join(__dirname, '../../miniapp');
const AI_IMAGES_DIR = path.join(__dirname, '../public/images/ai-generated');
const SERVER_BASE_URL = 'http://localhost:3000';

// 图片映射配置
const IMAGE_MAPPINGS = {
  // 商品图片
  'products': {
    'Adult_Cat_Food_2kg_placeholder.svg': '成年猫粮包装袋_现代简约设计_温暖橙黄色_f941d018_1755119244534.svg',
    'Cat_Treats_500g_placeholder.svg': '猫咪零食包装盒_精美设计_暖黄色包装_上_6739026b_1755119246792.svg',
    'Cat_Nutrition_Paste_placeholder.svg': '猫咪营养膏包装管_专业医疗级设计_蓝白色_c651173b_1755119249023.svg',
    'Cat_Vitamins_placeholder.svg': '猫咪维生素瓶装_透明瓶身_彩色标签_健康_425d3ea4_1755119251257.svg'
  },
  // 英雄图片
  'heroes': {
    'home_cat_hero.svg': '可爱橘猫坐在现代厨房里_旁边有精美宠物食_9f691e63_1755119253493.svg',
    'home_dog_hero.svg': '可爱金毛犬坐在现代厨房里_旁边有精美宠物_e338e6c4_1755119255730.svg'
  },
  // 食谱图片
  'recipes': {
    'chicken_pumpkin_recipe.svg': '鸡肉南瓜宠物餐_新鲜鸡胸肉和南瓜块_摆放_2e982d9a_1755119257964.svg',
    'salmon_vegetables_recipe.svg': '三文鱼蔬菜宠物餐_新鲜三文鱼片配胡萝卜和_beafd8bd_1755119260203.svg'
  }
};

// 需要更新的文件列表
const FILES_TO_UPDATE = [
  // 首页
  {
    path: 'pages/index/index.wxml',
    updates: [
      {
        search: '/images/products/Adult_Cat_Food_2kg_placeholder.svg',
        replace: `${SERVER_BASE_URL}/images/ai-generated/products/成年猫粮包装袋_现代简约设计_温暖橙黄色_f941d018_1755119244534.svg`
      },
      {
        search: '/images/products/Cat_Treats_500g_placeholder.svg', 
        replace: `${SERVER_BASE_URL}/images/ai-generated/products/猫咪零食包装盒_精美设计_暖黄色包装_上_6739026b_1755119246792.svg`
      }
    ]
  },
  // AI结果页
  {
    path: 'pages/AIResult/AIResult.wxml',
    updates: [
      {
        search: '/images/products/Cat_Nutrition_Paste_placeholder.svg',
        replace: `${SERVER_BASE_URL}/images/ai-generated/products/猫咪营养膏包装管_专业医疗级设计_蓝白色_c651173b_1755119249023.svg`
      },
      {
        search: '/images/products/Cat_Vitamins_placeholder.svg',
        replace: `${SERVER_BASE_URL}/images/ai-generated/products/猫咪维生素瓶装_透明瓶身_彩色标签_健康_425d3ea4_1755119251257.svg`
      }
    ]
  },
  // 食谱页面
  {
    path: 'pages/recipes/recipes.wxml',
    updates: [
      {
        search: '/images/recipes/chicken_pumpkin_recipe.svg',
        replace: `${SERVER_BASE_URL}/images/ai-generated/recipes/鸡肉南瓜宠物餐_新鲜鸡胸肉和南瓜块_摆放_2e982d9a_1755119257964.svg`
      },
      {
        search: '/images/recipes/salmon_vegetables_recipe.svg',
        replace: `${SERVER_BASE_URL}/images/ai-generated/recipes/三文鱼蔬菜宠物餐_新鲜三文鱼片配胡萝卜和_beafd8bd_1755119260203.svg`
      }
    ]
  }
];

// 检查文件是否存在
function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch (error) {
    return false;
  }
}

// 读取文件内容
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    throw new Error(`读取文件失败: ${filePath} - ${error.message}`);
  }
}

// 写入文件内容
function writeFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  } catch (error) {
    throw new Error(`写入文件失败: ${filePath} - ${error.message}`);
  }
}

// 更新单个文件
function updateFile(fileConfig) {
  const filePath = path.join(MINIAPP_ROOT, fileConfig.path);
  
  if (!fileExists(filePath)) {
    console.log(`⚠️  文件不存在，跳过: ${fileConfig.path}`);
    return { success: false, reason: '文件不存在' };
  }
  
  console.log(`📝 更新文件: ${fileConfig.path}`);
  
  let content = readFile(filePath);
  let updateCount = 0;
  
  // 应用所有更新
  fileConfig.updates.forEach((update, index) => {
    if (content.includes(update.search)) {
      content = content.replace(new RegExp(update.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), update.replace);
      updateCount++;
      console.log(`   ✅ [${index + 1}] 已替换: ${update.search.substring(0, 50)}...`);
    } else {
      console.log(`   ⚠️  [${index + 1}] 未找到: ${update.search.substring(0, 50)}...`);
    }
  });
  
  if (updateCount > 0) {
    writeFile(filePath, content);
    console.log(`   📊 完成 ${updateCount}/${fileConfig.updates.length} 个更新`);
    return { success: true, updateCount };
  } else {
    console.log(`   ℹ️  无需更新`);
    return { success: true, updateCount: 0 };
  }
}

// 检查AI图片是否存在
function checkAIImages() {
  console.log('🔍 检查AI生成的图片...');
  
  const categories = ['products', 'heroes', 'recipes'];
  const missingImages = [];
  
  categories.forEach(category => {
    const categoryDir = path.join(AI_IMAGES_DIR, category);
    
    if (!fs.existsSync(categoryDir)) {
      console.log(`❌ 目录不存在: ${category}`);
      missingImages.push(`目录: ${category}`);
      return;
    }
    
    const files = fs.readdirSync(categoryDir);
    console.log(`📁 ${category}: 找到 ${files.length} 个文件`);
    
    if (files.length === 0) {
      missingImages.push(`${category} 目录为空`);
    }
  });
  
  if (missingImages.length > 0) {
    console.log('⚠️  缺失的图片:');
    missingImages.forEach(missing => console.log(`   - ${missing}`));
    return false;
  }
  
  console.log('✅ 所有AI图片检查通过');
  return true;
}

// 创建图片映射文件
function createImageMapping() {
  const mappingFile = path.join(MINIAPP_ROOT, 'utils/imageMapping.js');
  
  // 确保utils目录存在
  const utilsDir = path.dirname(mappingFile);
  if (!fs.existsSync(utilsDir)) {
    fs.mkdirSync(utilsDir, { recursive: true });
  }
  
  const mappingContent = `/**
 * AI生成图片映射配置
 * 自动生成，请勿手动修改
 */

const SERVER_BASE_URL = '${SERVER_BASE_URL}';

// AI生成的图片映射
const AI_IMAGE_MAPPING = {
  // 商品图片
  products: {
    'Adult_Cat_Food_2kg': '成年猫粮包装袋_现代简约设计_温暖橙黄色_f941d018_1755119244534.svg',
    'Cat_Treats_500g': '猫咪零食包装盒_精美设计_暖黄色包装_上_6739026b_1755119246792.svg',
    'Cat_Nutrition_Paste': '猫咪营养膏包装管_专业医疗级设计_蓝白色_c651173b_1755119249023.svg',
    'Cat_Vitamins': '猫咪维生素瓶装_透明瓶身_彩色标签_健康_425d3ea4_1755119251257.svg'
  },
  
  // 英雄图片
  heroes: {
    'home_cat': '可爱橘猫坐在现代厨房里_旁边有精美宠物食_9f691e63_1755119253493.svg',
    'home_dog': '可爱金毛犬坐在现代厨房里_旁边有精美宠物_e338e6c4_1755119255730.svg'
  },
  
  // 食谱图片
  recipes: {
    'chicken_pumpkin': '鸡肉南瓜宠物餐_新鲜鸡胸肉和南瓜块_摆放_2e982d9a_1755119257964.svg',
    'salmon_vegetables': '三文鱼蔬菜宠物餐_新鲜三文鱼片配胡萝卜和_beafd8bd_1755119260203.svg'
  }
};

// 获取AI图片URL
function getAIImageUrl(category, key) {
  const mapping = AI_IMAGE_MAPPING[category];
  if (!mapping || !mapping[key]) {
    console.warn(\`AI图片未找到: \${category}/\${key}\`);
    return null;
  }
  
  return \`\${SERVER_BASE_URL}/images/ai-generated/\${category}/\${mapping[key]}\`;
}

// 获取商品图片URL
function getProductImageUrl(productKey) {
  return getAIImageUrl('products', productKey);
}

// 获取英雄图片URL
function getHeroImageUrl(heroKey) {
  return getAIImageUrl('heroes', heroKey);
}

// 获取食谱图片URL
function getRecipeImageUrl(recipeKey) {
  return getAIImageUrl('recipes', recipeKey);
}

module.exports = {
  AI_IMAGE_MAPPING,
  getAIImageUrl,
  getProductImageUrl,
  getHeroImageUrl,
  getRecipeImageUrl
};
`;
  
  writeFile(mappingFile, mappingContent);
  console.log(`📄 创建图片映射文件: ${mappingFile}`);
}

// 主函数
async function main() {
  console.log('🚀 PawPlate 小程序图片更新工具');
  console.log('=' .repeat(50));
  
  try {
    // 检查AI图片
    if (!checkAIImages()) {
      console.log('\n💡 提示: 请先运行图片生成脚本:');
      console.log('   node scripts/generate-miniapp-images.js');
      return;
    }
    
    // 创建图片映射文件
    createImageMapping();
    
    // 更新文件
    console.log('\n📝 开始更新小程序文件...');
    
    const results = [];
    for (const fileConfig of FILES_TO_UPDATE) {
      try {
        const result = updateFile(fileConfig);
        results.push({
          file: fileConfig.path,
          ...result
        });
      } catch (error) {
        console.error(`❌ 更新失败: ${fileConfig.path} - ${error.message}`);
        results.push({
          file: fileConfig.path,
          success: false,
          error: error.message
        });
      }
    }
    
    // 统计结果
    const successCount = results.filter(r => r.success).length;
    const totalUpdates = results.reduce((sum, r) => sum + (r.updateCount || 0), 0);
    
    console.log('\n' + '='.repeat(50));
    console.log('🎉 小程序图片更新完成！');
    console.log(`📊 统计信息:`);
    console.log(`   - 处理文件: ${results.length}`);
    console.log(`   - 成功更新: ${successCount}`);
    console.log(`   - 总替换数: ${totalUpdates}`);
    
    if (successCount > 0) {
      console.log('\n✅ 更新成功的文件:');
      results.filter(r => r.success && r.updateCount > 0).forEach(r => {
        console.log(`   📄 ${r.file}: ${r.updateCount} 个更新`);
      });
    }
    
    const failedFiles = results.filter(r => !r.success);
    if (failedFiles.length > 0) {
      console.log('\n❌ 更新失败的文件:');
      failedFiles.forEach(r => {
        console.log(`   📄 ${r.file}: ${r.error || r.reason}`);
      });
    }
    
    console.log('\n🌐 AI图片访问地址:');
    console.log(`   🔗 ${SERVER_BASE_URL}/images/ai-generated/`);
    
    console.log('\n💡 使用提示:');
    console.log('   - 图片映射文件已创建: miniapp/utils/imageMapping.js');
    console.log('   - 可在小程序中使用 getProductImageUrl() 等函数获取图片URL');
    console.log('   - 重启小程序开发服务器以查看更新效果');
    
  } catch (error) {
    console.error('❌ 更新失败:', error.message);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main().catch(error => {
    console.error('💥 脚本执行失败:', error.message);
    process.exit(1);
  });
}

module.exports = {
  updateFile,
  checkAIImages,
  createImageMapping,
  main
};