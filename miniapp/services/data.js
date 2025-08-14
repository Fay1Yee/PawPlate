import recipes from '../assets/data/recipes.json';
import skuMap from '../assets/data/skuMap.json';

export function getRecipeById(id) {
  return recipes.find(recipe => recipe.recipe_id === id);
}

export function getSkuByIngredient(name, city) {
  const citySkus = skuMap[city];
  if (!citySkus) {
    return null;
  }
  return citySkus.find(sku => sku.ingredient_name === name);
}