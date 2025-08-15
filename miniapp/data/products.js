// Product data
const products = [
  {
    id: 1,
    name: 'Premium Adult Cat Food',
    image: 'http://localhost:3000/images/ai-generated/products/product_adult_cat_food_realistic_1755175900966.svg',
    price: 128.00,
    originalPrice: 158.00,
    description: 'Nutritionally balanced cat food designed for adult cats with premium protein',
    category: 'Main Food',
    rating: 4.8,
    reviews: 1256,
    features: ['High Protein', 'Easy Digest', 'Balanced Nutrition', 'Natural & Additive-Free'],
    specifications: {
      weight: '2kg',
      ageGroup: 'Adult Cat',
      flavor: 'Chicken Flavor'
    }
  },
  {
    id: 2,
    name: 'Delicious Cat Treats',
    image: 'http://localhost:3000/images/ai-generated/products/product_cat_treats_realistic_1755175900967.svg',
    price: 35.00,
    originalPrice: 45.00,
    description: 'Natural and healthy cat treats, perfect for training rewards with crispy texture',
    category: 'Treats',
    rating: 4.9,
    reviews: 892,
    features: ['Natural Ingredients', 'Crispy Texture', 'Training Special', 'Nutritious'],
    specifications: {
      weight: '500g',
      ageGroup: 'All Ages',
      flavor: 'Mixed Flavors'
    }
  },
  {
    id: 3,
    name: 'Cat Nutrition Paste',
    image: 'http://localhost:3000/images/ai-generated/products/product_cat_nutrition_paste_realistic_1755175900968.svg',
    price: 68.00,
    originalPrice: 88.00,
    description: 'Quick nutrition supplement, boosts immunity, especially suitable for kittens and senior cats',
    category: 'Nutrition',
    rating: 4.7,
    reviews: 634,
    features: ['Fast Absorption', 'Immune Boost', 'Suitable for Young & Senior', 'Easy Feeding'],
    specifications: {
      weight: '120g',
      ageGroup: 'All Ages',
      flavor: 'Fish Flavor'
    }
  },
  {
    id: 4,
    name: 'Cat Vitamins',
    image: 'http://localhost:3000/images/ai-generated/products/product_cat_vitamins_realistic_1755175900968.svg',
    price: 89.00,
    originalPrice: 109.00,
    description: 'Comprehensive vitamin supplement, promotes healthy growth and enhances coat shine',
    category: 'Health Supplements',
    rating: 4.6,
    reviews: 445,
    features: ['Complete Nutrition', 'Growth Promotion', 'Coat Care', 'Scientific Formula'],
    specifications: {
      weight: '60 tablets',
      ageGroup: 'Adult Cat',
      flavor: 'Flavorless'
    }
  }
];

module.exports = products;