#!/usr/bin/env node

/**
 * 更新小程序中的图片引用为真实AI生成的图片
 */

const fs = require('fs').promises;
const path = require('path');

// 新生成的真实AI图片映射
const realImageMapping = {
  // 产品图片
  'product.adult_cat_food': 'http://localhost:3000/images/ai-generated/products/成年猫粮包装袋_现代简约设计_温暖橙黄色_f941d018_1755119899774.png',
  'product.cat_treats': 'http://localhost:3000/images/ai-generated/products/猫咪零食包装盒_精美设计_暖黄色包装_上_6739026b_1755119907865.png',
  'product.cat_nutrition_paste': 'http://localhost:3000/images/ai-generated/products/猫咪营养膏包装管_专业医疗级设计_蓝白色_c651173b_1755119915407.png',
  'product.cat_vitamins': 'http://localhost:3000/images/ai-generated/products/猫咪维生素瓶装_透明瓶身_彩色标签_健康_425d3ea4_1755119922271.png',
  
  // 英雄图片
  'hero.home_cat': 'http://localhost:3000/images/ai-generated/heroes/可爱橘猫坐在现代厨房里_旁边有精美宠物食_9f691e63_1755119931206.png',
  'hero.home_dog': 'http://localhost:3000/images/ai-generated/heroes/可爱金毛犬坐在现代厨房里_旁边有精美宠物_e338e6c4_1755119941208.png',
  
  // 食谱图片
  'recipe.chicken_pumpkin': 'http://localhost:3000/images/ai-generated/recipes/鸡肉南瓜宠物餐_新鲜鸡胸肉和南瓜块_摆放_2e982d9a_1755119951024.png',
  'recipe.salmon_vegetables': 'http://localhost:3000/images/ai-generated/recipes/三文鱼蔬菜宠物餐_新鲜三文鱼片配胡萝卜和_beafd8bd_1755119957910.png'
};

// 需要更新的文件列表
const filesToUpdate = [
  {
    path: '../miniapp/pages/AIResult/AIResult.js',
    type: 'js'
  },
  {
    path: '../miniapp/store/app.js',
    type: 'js'
  },
  {
    path: '../miniapp/utils/generated-images.js',
    type: 'js'
  },
  {
    path: '../miniapp/pages/RecipeDetail/RecipeDetail.js',
    type: 'js'
  },
  {
    path: '../miniapp/pages/recipe/index/index.js',
    type: 'js'
  }
];

// 旧图片URL到新图片URL的映射
const urlMapping = {
  'http://localhost:3000/images/ai-generated/recipes/鸡肉南瓜宠物餐_新鲜鸡胸肉和南瓜块_摆放_2e982d9a_1755119257964.svg': realImageMapping['recipe.chicken_pumpkin'],
  'http://localhost:3000/images/ai-generated/recipes/三文鱼蔬菜宠物餐_新鲜三文鱼片配胡萝卜和_beafd8bd_1755119260203.svg': realImageMapping['recipe.salmon_vegetables'],
  'http://localhost:3000/images/ai-generated/products/成年猫粮包装袋_现代简约设计_温暖橙黄色_f941d018_1755119244534.svg': realImageMapping['product.adult_cat_food'],
  'http://localhost:3000/images/ai-generated/products/猫咪零食包装盒_精美设计_暖黄色包装_上_6739026b_1755119246792.svg': realImageMapping['product.cat_treats'],
  'http://localhost:3000/images/ai-generated/products/猫咪营养膏包装管_专业医疗级设计_蓝白色_c651173b_1755119249023.svg': realImageMapping['product.cat_nutrition_paste'],
  'http://localhost:3000/images/ai-generated/products/猫咪维生素瓶装_透明瓶身_彩色标签_健康_425d3ea4_1755119251257.svg': realImageMapping['product.cat_vitamins']
};

async function updateFile(filePath) {
  try {
    const fullPath = path.resolve(__dirname, filePath);
    console.log(`📝 更新文件: ${fullPath}`);
    
    const content = await fs.readFile(fullPath, 'utf8');
    let updatedContent = content;
    let hasChanges = false;
    
    // 替换所有匹配的URL
    for (const [oldUrl, newUrl] of Object.entries(urlMapping)) {
      if (updatedContent.includes(oldUrl)) {
        updatedContent = updatedContent.replace(new RegExp(oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newUrl);
        hasChanges = true;
        console.log(`  ✅ 替换: ${path.basename(oldUrl)} -> ${path.basename(newUrl)}`);
      }
    }
    
    if (hasChanges) {
      await fs.writeFile(fullPath, updatedContent, 'utf8');
      console.log(`  💾 文件已更新`);
    } else {
      console.log(`  ⏭️  无需更新`);
    }
    
    return hasChanges;
  } catch (error) {
    console.error(`❌ 更新文件失败 ${filePath}:`, error.message);
    return false;
  }
}

async function updateImageMapping() {
  try {
    const mappingPath = path.resolve(__dirname, '../miniapp/utils/imageMapping.js');
    console.log(`📝 更新图片映射文件: ${mappingPath}`);
    
    const mappingContent = `// AI生成图片映射
// 自动生成，请勿手动修改

const imageMapping = ${JSON.stringify(realImageMapping, null, 2)};

module.exports = imageMapping;
`;
    
    await fs.writeFile(mappingPath, mappingContent, 'utf8');
    console.log(`  ✅ 图片映射文件已更新`);
    return true;
  } catch (error) {
    console.error(`❌ 更新图片映射失败:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🔄 更新小程序图片引用为真实AI生成图片...');
  console.log('=' .repeat(50));
  
  let totalUpdated = 0;
  
  // 更新图片映射文件
  const mappingUpdated = await updateImageMapping();
  if (mappingUpdated) totalUpdated++;
  
  // 更新各个文件
  for (const file of filesToUpdate) {
    const updated = await updateFile(file.path);
    if (updated) totalUpdated++;
  }
  
  console.log('\n🎉 更新完成!');
  console.log(`📊 总共更新了 ${totalUpdated} 个文件`);
  console.log('\n🖼️  现在小程序将显示真实的AI生成图片!');
  console.log('💡 请刷新小程序预览查看效果');
}

if (require.main === module) {
  main().catch(error => {
    console.error('💥 更新失败:', error.message);
    process.exit(1);
  });
}

module.exports = { main, updateFile, updateImageMapping, realImageMapping };