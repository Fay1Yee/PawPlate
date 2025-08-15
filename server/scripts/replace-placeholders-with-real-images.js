#!/usr/bin/env node

/**
 * 占位符图片替换脚本
 * 将抖音小程序中的占位符图片替换为AI生成的真实图片
 */

const fs = require('fs').promises;
const path = require('path');

// 真实图片映射配置
const realImageMappings = {
  // 产品图片映射
  products: {
    'Adult_Cat_Food_2kg_placeholder.svg': 'ai-generated/products/Premium_adult_cat_fo_8b9e8d4b_1755175718531.svg',
    'Cat_Nutrition_Paste_placeholder.svg': 'ai-generated/products/Cat_nutrition_paste__3b202467_1755175724209.svg',
    'Cat_Treats_500g_placeholder.svg': 'ai-generated/products/Luxury_cat_treats_pa_b30c5bd8_1755175721575.svg',
    'Cat_Vitamins_placeholder.svg': 'ai-generated/products/Cat_vitamin_suppleme_db7e5603_1755175726443.svg'
  },
  
  // 食谱图片映射
  recipes: {
    'Recipe_Default_placeholder.svg': 'ai-generated/recipes/recipe_healthy_cat_meal_realistic_1755175900968.svg',
    '鸡肉蔬菜营养餐_placeholder.svg': 'ai-generated/recipes/Chicken_and_vegetabl_637b6b85_1755175744936.svg',
    '三文鱼藜麦饭_placeholder.svg': 'ai-generated/recipes/Fresh_salmon_delight_fd850e9c_1755175737439.svg',
    '鱼肉蛋花粥_placeholder.svg': 'ai-generated/recipes/Nutritious_fish_and__e1d62954_1755175739675.svg',
    '鸡肉南瓜粥_placeholder.svg': 'ai-generated/recipes/Turkey_feast_with_br_2e27819d_1755175742303.svg'
  },
  
  // 英雄图片映射
  heroes: {
    'Hero_Background_Cat_placeholder.svg': 'ai-generated/heroes/hero_home_cat_realistic_1755175900969.svg',
    'Hero_Background_Dog_placeholder.svg': 'ai-generated/heroes/hero_home_dog_realistic_1755175900970.svg'
  },
  
  // 头像和图标映射
  avatars: {
    'Pet_Profile_Avatar_placeholder.svg': 'ai-generated/heroes/Adorable_orange_tabb_5028525c_1755175729057.svg',
    'Profile_Icon_placeholder.svg': 'ai-generated/heroes/Cute_golden_retrieve_574d02b7_1755175732157.svg'
  }
};

// 更新小程序图片引用
async function updateMiniappImageReferences() {
  console.log('🔄 开始替换小程序中的占位符图片引用...');
  
  const miniappDir = path.join(__dirname, '../../miniapp');
  const serverPublicDir = path.join(__dirname, '../public/images');
  
  // 需要更新的文件类型
  const fileExtensions = ['.html', '.js', '.json', '.ttml', '.ttss', '.wxss', '.wxml'];
  
  let totalReplacements = 0;
  
  // 递归查找并更新文件
  async function processDirectory(dirPath) {
    const items = await fs.readdir(dirPath, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item.name);
      
      if (item.isDirectory()) {
        // 跳过node_modules等目录
        if (!['node_modules', '.git', 'dist', 'build'].includes(item.name)) {
          await processDirectory(fullPath);
        }
      } else if (fileExtensions.some(ext => item.name.endsWith(ext))) {
        await processFile(fullPath);
      }
    }
  }
  
  // 处理单个文件
  async function processFile(filePath) {
    try {
      let content = await fs.readFile(filePath, 'utf8');
      let modified = false;
      let fileReplacements = 0;
      
      // 遍历所有映射类别
      Object.entries(realImageMappings).forEach(([category, mappings]) => {
        Object.entries(mappings).forEach(([placeholder, realImage]) => {
          // 创建多种可能的引用模式
          const patterns = [
            // 直接文件名引用
            new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
            // 带路径的引用
            new RegExp(`/images/products/${placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g'),
            new RegExp(`images/products/${placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g'),
            // 服务器URL引用
            new RegExp(`http://localhost:3000/images/products/${placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g')
          ];
          
          patterns.forEach(pattern => {
            if (pattern.test(content)) {
              const replacement = `http://localhost:3000/images/${realImage}`;
              content = content.replace(pattern, replacement);
              modified = true;
              fileReplacements++;
            }
          });
        });
      });
      
      // 如果文件被修改，写回文件
      if (modified) {
        await fs.writeFile(filePath, content, 'utf8');
        console.log(`✅ 更新文件: ${path.relative(miniappDir, filePath)} (${fileReplacements} 处替换)`);
        totalReplacements += fileReplacements;
      }
      
    } catch (error) {
      console.error(`❌ 处理文件失败: ${filePath}`, error.message);
    }
  }
  
  // 开始处理
  await processDirectory(miniappDir);
  
  console.log('\n' + '='.repeat(50));
  console.log('🎉 占位符图片替换完成！');
  console.log(`📊 总共替换: ${totalReplacements} 处引用`);
  
  return totalReplacements;
}

// 更新图片映射配置文件
async function updateImageMappingFiles() {
  console.log('🔄 更新图片映射配置文件...');
  
  const mappingFiles = [
    path.join(__dirname, '../../miniapp/utils/generated-images.js'),
    path.join(__dirname, '../../miniapp/utils/imageMapping.js')
  ];
  
  for (const mappingFile of mappingFiles) {
    try {
      if (await fs.access(mappingFile).then(() => true).catch(() => false)) {
        let content = await fs.readFile(mappingFile, 'utf8');
        let modified = false;
        
        // 替换占位符引用为真实图片
        Object.entries(realImageMappings).forEach(([category, mappings]) => {
          Object.entries(mappings).forEach(([placeholder, realImage]) => {
            // 简单的字符串替换，避免复杂的正则表达式
            if (content.includes(placeholder)) {
              content = content.replace(
                new RegExp(placeholder, 'g'),
                `http://localhost:3000/images/${realImage}`
              );
              modified = true;
            }
          });
        });
        
        if (modified) {
          await fs.writeFile(mappingFile, content, 'utf8');
          console.log(`✅ 更新映射文件: ${path.basename(mappingFile)}`);
        }
      }
    } catch (error) {
      console.error(`❌ 更新映射文件失败: ${mappingFile}`, error.message);
    }
  }
}

// 主执行函数
async function main() {
  console.log('🚀 开始替换占位符图片为真实AI生成图片...');
  console.log('📁 目标目录: /miniapp/');
  console.log('🎯 替换策略: 占位符 → AI生成图片\n');
  
  try {
    // 1. 更新小程序文件中的图片引用
    const replacements = await updateMiniappImageReferences();
    
    // 2. 更新图片映射配置文件
    await updateImageMappingFiles();
    
    console.log('\n🎊 所有占位符图片替换任务完成！');
    console.log('\n📋 替换摘要:');
    console.log(`   - 文件引用替换: ${replacements} 处`);
    console.log('   - 映射文件已更新');
    console.log('   - 食材图标已生成并集成');
    
    console.log('\n🌐 现在可以访问以下URL查看效果:');
    console.log('   🔗 http://localhost:8080 (小程序预览)');
    console.log('   🔗 http://localhost:3000/images/ingredient-icons/ (食材图标)');
    
  } catch (error) {
    console.error('❌ 替换过程中出现错误:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main()
    .then(() => {
      console.log('\n✨ 任务完成！');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ 执行失败:', error);
      process.exit(1);
    });
}

module.exports = {
  updateMiniappImageReferences,
  updateImageMappingFiles,
  realImageMappings
};