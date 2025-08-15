// 首页数据
const homeData = {
  heroImages: {
    cat: 'http://localhost:3000/images/ai-generated/heroes/hero_home_cat_realistic_1755175900969.svg',
    dog: 'http://localhost:3000/images/ai-generated/heroes/hero_home_dog_realistic_1755175900970.svg'
  },
  
  banners: [
    {
      id: 1,
      image: 'http://localhost:3000/images/ai-generated/heroes/hero_home_cat_realistic_1755175900969.svg',
      title: '专业宠物营养定制',
      subtitle: 'AI智能推荐，为您的爱宠量身定制',
      action: 'navigateToAI'
    },
    {
      id: 2,
      image: 'http://localhost:3000/images/ai-generated/heroes/hero_home_dog_realistic_1755175900970.svg',
      title: '精选优质食材',
      subtitle: '新鲜天然，营养均衡',
      action: 'navigateToProducts'
    }
  ],
  
  categories: [
    {
      id: 1,
      name: '主粮',
      icon: '/images/icons/main-food.svg',
      count: 12
    },
    {
      id: 2,
      name: '零食',
      icon: '/images/icons/treats.svg',
      count: 8
    },
    {
      id: 3,
      name: '营养品',
      icon: '/images/icons/nutrition.svg',
      count: 6
    },
    {
      id: 4,
      name: '保健品',
      icon: '/images/icons/health.svg',
      count: 4
    }
  ],
  
  ingredientIcons: {
    "鸡胸肉": {
        "englishName": "chicken_breast",
        "path": "/images/ingredients/chicken_breast.svg",
        "category": "protein"
    },
    "火鸡胸肉": {
        "englishName": "turkey_breast",
        "path": "/images/ingredients/turkey_breast.svg",
        "category": "protein"
    },
    "牛肉": {
        "englishName": "beef",
        "path": "/images/ingredients/beef.svg",
        "category": "protein"
    },
    "三文鱼": {
        "englishName": "salmon",
        "path": "/images/ingredients/salmon.svg",
        "category": "protein"
    },
    "鳕鱼": {
        "englishName": "cod",
        "path": "/images/ingredients/cod.svg",
        "category": "protein"
    },
    "南瓜": {
        "englishName": "pumpkin",
        "path": "/images/ingredients/pumpkin.svg",
        "category": "vegetable"
    },
    "红薯": {
        "englishName": "sweet_potato",
        "path": "/images/ingredients/sweet_potato.svg",
        "category": "vegetable"
    },
    "胡萝卜": {
        "englishName": "carrot",
        "path": "/images/ingredients/carrot.svg",
        "category": "vegetable"
    },
    "西兰花": {
        "englishName": "broccoli",
        "path": "/images/ingredients/broccoli.svg",
        "category": "vegetable"
    },
    "西葫芦": {
        "englishName": "zucchini",
        "path": "/images/ingredients/zucchini.svg",
        "category": "vegetable"
    },
    "大米": {
        "englishName": "rice",
        "path": "/images/ingredients/rice.svg",
        "category": "grain"
    },
    "燕麦片": {
        "englishName": "oats",
        "path": "/images/ingredients/oats.svg",
        "category": "grain"
    },
    "藜麦": {
        "englishName": "quinoa",
        "path": "/images/ingredients/quinoa.svg",
        "category": "grain"
    },
    "土豆": {
        "englishName": "potato",
        "path": "/images/ingredients/potato.svg",
        "category": "vegetable"
    },
    "猫用营养粉": {
        "englishName": "cat_nutrition_powder",
        "path": "/images/ingredients/cat_nutrition_powder.svg",
        "category": "supplement"
    }
}
};

module.exports = homeData;