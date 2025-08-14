// 全局状态管理

const state = {
  user: null,
  petProfile: null,
  favoritedRecipes: [],
  recipes: [],
  // 可以添加更多全局状态
};

const getters = {
  getUser: () => state.user,
  getPetProfile: () => state.petProfile,
  getFavoritedRecipes: () => state.favoritedRecipes,
  getAllRecipes: () => state.recipes,
};

const mutations = {
  setUser: (userData) => {
    state.user = userData;
  },
  setPetProfile: (petData) => {
    state.petProfile = petData;
  },
  setFavoritedRecipes: (recipes) => {
    state.favoritedRecipes = recipes;
  },
  addFavoriteRecipe: (recipe) => {
    if (!state.favoritedRecipes.some(item => item.id === recipe.id)) {
      state.favoritedRecipes.push(recipe);
    }
  },
  removeFavoriteRecipe: (recipeId) => {
    state.favoritedRecipes = state.favoritedRecipes.filter(item => item.id !== recipeId);
  },
  setRecipes: (recipes) => {
    state.recipes = recipes;
  },
};

const actions = {
  updateUser: (userData) => {
    mutations.setUser(userData);
  },
  updatePetProfile: (petData) => {
    mutations.setPetProfile(petData);
  },
  updateFavoritedRecipes: (recipes) => {
    mutations.setFavoritedRecipes(recipes);
  },
  addFavorite: (recipe) => {
    mutations.addFavoriteRecipe(recipe);
  },
  removeFavorite: (recipeId) => {
    mutations.removeFavoriteRecipe(recipeId);
  },
  resetState: () => {
    mutations.setUser({});
    mutations.setPetProfile({});
    mutations.setFavoritedRecipes([]);
  },
  // 获取所有菜谱
  fetchAllRecipes: () => {
    // 在实际应用中，这里应该调用API获取菜谱数据
    // 暂时使用模拟数据
    const mockRecipes = [
      {
        id: 1,
        name: '鸡肉蔬菜营养餐',
        description: '富含蛋白质和维生素，适合所有年龄段的狗狗',
        prepTime: 15,
        cookTime: 30,
        difficulty: '简单',
        image: 'http://localhost:3000/images/ai-generated/recipes/鸡肉南瓜宠物餐_新鲜鸡胸肉和南瓜块_摆放_2e982d9a_1755119257964.svg'
      },
      {
        id: 2,
        name: '三文鱼美毛餐',
        description: '富含Omega-3脂肪酸，帮助宠物美毛护肤',
        prepTime: 20,
        cookTime: 45,
        difficulty: '中等',
        image: 'http://localhost:3000/images/ai-generated/recipes/三文鱼蔬菜宠物餐_新鲜三文鱼片配胡萝卜和_beafd8bd_1755119260203.svg'
      },
      {
        id: 3,
        name: '低脂减肥餐',
        description: '专为超重宠物设计，低脂高纤维',
        prepTime: 15,
        cookTime: 35,
        difficulty: '简单',
        image: 'http://localhost:3000/images/ai-generated/recipes/鸡肉南瓜宠物餐_新鲜鸡胸肉和南瓜块_摆放_2e982d9a_1755119257964.svg'
      }
    ];
    mutations.setRecipes(mockRecipes);
  }
};

module.exports = {
  state,
  getters,
  mutations,
  actions,
};