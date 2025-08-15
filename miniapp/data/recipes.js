// Recipe data
const recipes = [
  {
    id: 1,
    name: 'Healthy Chicken Vegetable Bowl',
    image: '/images/recipes/chicken-pumpkin-bowl.jpg',
    description: 'Nutritionally balanced chicken and vegetable combination, rich in protein and vitamins',
    ingredients: ['Chicken Breast', 'Carrot', 'Broccoli', 'Rice'],
    cookingTime: '30 minutes',
    difficulty: 'Easy',
    nutrition: {
      protein: '28%',
      fat: '12%',
      fiber: '4%',
      moisture: '10%'
    }
  },
  {
    id: 2,
    name: 'Fresh Salmon Delight',
    image: '/images/recipes/salmon_avocado_bowl.jpg',
    description: 'Omega-3 rich salmon that promotes coat shine',
    ingredients: ['Salmon', 'Pumpkin', 'Oats'],
    cookingTime: '25 minutes',
    difficulty: 'Easy',
    nutrition: {
      protein: '32%',
      fat: '15%',
      fiber: '3%',
      moisture: '8%'
    }
  },
  {
    id: 3,
    name: 'Nutritious Fish Rice',
    image: '/images/recipes/fish-sweet-potato.jpg',
    description: 'Easy-to-digest fish with rice, suitable for sensitive stomachs',
    ingredients: ['Cod Fish', 'Rice', 'Carrot'],
    cookingTime: '35 minutes',
    difficulty: 'Medium',
    nutrition: {
      protein: '25%',
      fat: '10%',
      fiber: '5%',
      moisture: '12%'
    }
  },
  {
    id: 4,
    name: 'Turkey Broccoli Feast',
    image: '/images/recipes/turkey-rice-medley.jpg',
    description: 'Low-fat, high-protein turkey with fresh vegetables',
    ingredients: ['Turkey Breast', 'Broccoli', 'Sweet Potato'],
    cookingTime: '40 minutes',
    difficulty: 'Medium',
    nutrition: {
      protein: '30%',
      fat: '8%',
      fiber: '6%',
      moisture: '11%'
    }
  }
];

module.exports = recipes;