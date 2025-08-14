const path = require('path');
const fs = require('fs');

const recipesFilePath = path.join(__dirname, '../../miniapp/assets/data/recipes.json');
const generatedImages = require('../../miniapp/utils/generated-images.js');

const getRecipeById = (req, res) => {
  const recipeId = req.params.id;
  fs.readFile(recipesFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Error reading recipes data' });
    }
    const recipes = JSON.parse(data);
    const recipe = recipes.find(r => r.recipe_id === recipeId);
    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }
    
    // 使用AI生成的详情图片
    const detailImageKey = `recipe.detail.${recipe.recipe_id}`;
    if (generatedImages[detailImageKey]) {
      recipe.image = generatedImages[detailImageKey];
    } else {
      // 如果没有AI生成的图片，保持原有的imageUrl
      recipe.image = recipe.imageUrl;
    }
    
    res.json({ success: true, data: recipe });
  });
};

module.exports = {
  getRecipeById,
};