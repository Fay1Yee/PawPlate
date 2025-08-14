const app = getApp();
const store = require('../../store/app.js');

Page({
  data: {
    petTypes: ['狗狗', '猫咪'],
    petTypeIndex: 0,
    breed: '',
    age: '',
    weight: '',
    allergies: '',
    specialNeeds: ''
  },
  
  onLoad() {
    // 页面加载时获取用户宠物信息（如果已存在）
    const petProfile = store.getters.getPetProfile();
    if (petProfile) {
      this.setData({
        petTypeIndex: petProfile.type === '狗狗' ? 0 : 1,
        breed: petProfile.breed || '',
        age: petProfile.age || '',
        weight: petProfile.weight || '',
        allergies: petProfile.allergies || '',
        specialNeeds: petProfile.specialNeeds || ''
      });
    }
  },
  
  onPetTypeChange(e) {
    this.setData({
      petTypeIndex: e.detail.value
    });
  },
  
  onBreedInput(e) {
    this.setData({
      breed: e.detail.value
    });
  },
  
  onAgeInput(e) {
    this.setData({
      age: e.detail.value
    });
  },
  
  onWeightInput(e) {
    this.setData({
      weight: e.detail.value
    });
  },
  
  onAllergiesInput(e) {
    this.setData({
      allergies: e.detail.value
    });
  },
  
  onSpecialNeedsInput(e) {
    this.setData({
      specialNeeds: e.detail.value
    });
  },
  
  submitForm() {
    // 表单验证
    if (!this.data.breed) {
      wx.showToast({
        title: '请输入宠物品种',
        icon: 'none'
      });
      return;
    }
    
    if (!this.data.age) {
      wx.showToast({
        title: '请输入宠物年龄',
        icon: 'none'
      });
      return;
    }
    
    if (!this.data.weight) {
      wx.showToast({
        title: '请输入宠物体重',
        icon: 'none'
      });
      return;
    }
    
    // 保存宠物信息到全局状态
    const petProfile = {
      type: this.data.petTypes[this.data.petTypeIndex],
      breed: this.data.breed,
      age: parseFloat(this.data.age),
      weight: parseFloat(this.data.weight),
      allergies: this.data.allergies,
      specialNeeds: this.data.specialNeeds
    };
    
    store.actions.updatePetProfile(petProfile);
    
    // 跳转到AI结果页面
    wx.navigateTo({
      url: '/pages/AIResult/AIResult'
    });
  }
});