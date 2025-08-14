const BASE_URL = 'http://localhost:3000/api';

// 获取所有菜谱
const getAllRecipes = () => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}/recipes`,
      method: 'GET',
      success(res) {
        if (res.data.success) {
          resolve(res.data.data);
        } else {
          reject(res.data.message || '获取菜谱失败');
        }
      },
      fail(err) {
        reject(err.errMsg || '网络请求失败');
      }
    });
  });
};

// 根据ID获取特定菜谱
const getRecipeById = (id) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}/recipes/${id}`,
      method: 'GET',
      success(res) {
        if (res.data.success) {
          resolve(res.data.data);
        } else {
          reject(res.data.message || '获取菜谱详情失败');
        }
      },
      fail(err) {
        reject(err.errMsg || '网络请求失败');
      }
    });
  });
};

// 生成推荐食谱
const generateRecommendations = (petProfile) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}/recommendations`,
      method: 'POST',
      data: petProfile,
      success(res) {
        if (res.data.success) {
          resolve(res.data.data);
        } else {
          reject(res.data.message || '生成推荐失败');
        }
      },
      fail(err) {
        reject(err.errMsg || '网络请求失败');
      }
    });
  });
};

const customizeRecipe = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}/ai/customize`,
      method: 'POST',
      data,
      success(res) {
        if (res.data.success) {
          resolve(res.data);
        } else {
          reject(res.data.message || '定制失败');
        }
      },
      fail(err) {
        reject(err.errMsg || '网络请求失败');
      }
    });
  });
};

const purchaseLink = (ingredients) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}/purchase/link`,
      method: 'POST',
      data: { ingredients },
      success(res) {
        if (res.data.success) {
          resolve(res.data);
        } else {
          reject(res.data.message || '生成购买链接失败');
        }
      },
      fail(err) {
        reject(err.errMsg || '网络请求失败');
      }
    });
  });
};

module.exports = {
  getAllRecipes,
  getRecipeById,
  generateRecommendations,
  customizeRecipe,
  purchaseLink
};