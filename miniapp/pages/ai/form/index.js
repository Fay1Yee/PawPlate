
const { img } = require('../../../utils/img.js');

Page({
  data:{ 
    messages: [], // Chat history
    userInput: '', // User input
    inputPlaceholder: 'Please enter your answer...',
    isAiTyping: false, // Whether AI is typing
    isCompleted: false, // Whether conversation is completed
    quickReplies: [], // Quick reply options
    scrollTop: 0, // Scroll position
    currentQuestion: 0, // Current question index
    petInfo: {}, // Collected pet information
    loading: false,
    recipeId: '',
    recipeName: '',
    chatHeroUrl: '', // Chat page hero image
    // AI question flow
    questions: [
      {
        id: 'species',
        question: 'Hello! I am an AI nutritionist, and I am delighted to customize exclusive nutrition meals for your pet. First, please tell me what type of pet you have?',
        quickReplies: ['Cat', 'Dog', 'Other'],
        type: 'choice'
      },
      {
        id: 'breed',
        question: 'Please tell me the specific breed of your pet, which will help me better understand its nutritional needs.',
        quickReplies: [],
        type: 'text'
      },
      {
        id: 'age',
        question: 'How old is your pet? Please tell me its age (in months).',
        quickReplies: ['Under 3 months', '3-6 months', '6-12 months', '1-3 years', '3-7 years', 'Over 7 years'],
        type: 'age'
      },
      {
        id: 'weight',
        question: 'Please tell me your pet\'s weight (in kilograms), which is important for calculating nutritional ratios.',
        quickReplies: ['1-3kg', '3-5kg', '5-10kg', '10-20kg', 'Over 20kg'],
        type: 'weight'
      },
      {
        id: 'allergies',
        question: 'Does your pet have any allergies or foods it cannot eat? If none, please answer "None".',
        quickReplies: ['None', 'Chicken allergy', 'Beef allergy', 'Seafood allergy', 'Grain allergy'],
        type: 'text'
      },
      {
        id: 'activity',
        question: 'How is your pet\'s usual activity level? This will affect its calorie needs.',
        quickReplies: ['Very low activity', 'Moderate activity', 'High activity', 'Very active'],
        type: 'choice'
      },
      {
        id: 'health',
        question: 'Does your pet currently have any special health conditions that need attention? Such as obesity, indigestion, etc.',
        quickReplies: ['Good health condition', 'Needs weight loss', 'Sensitive digestion', 'Coat care', 'Joint protection'],
        type: 'text'
      }
    ]
  },
  async onLoad(options) {
    // Get passed parameters
    this.setData({
      recipeId: options.id || 'cat_001',
      recipeName: options.name || 'Default Recipe'
    });
    
    // Load chat page hero image
    await this.loadChatHeroImage();
    
    // Start conversation
    this.startConversation();
  },

  async loadChatHeroImage() {
    try {
      const chatHeroPrompt = 'AI chat assistant scene, warm conversation atmosphere, yellow glass interface elements, centered composition';
      const chatHeroUrl = await img('hero.chat', chatHeroPrompt, { size: '750x420', format: 'webp' });
      this.setData({ chatHeroUrl });
    } catch (error) {
      console.error('Failed to load chat hero image:', error);
    }
  },
  
  // Start conversation
  startConversation() {
    const firstQuestion = this.data.questions[0];
    this.addAiMessage(firstQuestion.question, firstQuestion.quickReplies);
  },
  
  // Add AI message
  addAiMessage(content, quickReplies = []) {
    const message = {
      role: 'ai',
      content: content,
      time: this.formatTime(new Date())
    };
    
    this.setData({
      isAiTyping: true
    });
    
    // 模拟AI思考时间
    setTimeout(() => {
      this.setData({
        messages: [...this.data.messages, message],
        quickReplies: quickReplies,
        isAiTyping: false
      });
      this.scrollToBottom();
    }, 1000);
  },
  
  // 添加用户消息
  addUserMessage(content) {
    const message = {
      role: 'user',
      content: content,
      time: this.formatTime(new Date())
    };
    
    this.setData({
      messages: [...this.data.messages, message],
      userInput: '',
      quickReplies: []
    });
    this.scrollToBottom();
  },
  
  // 处理用户输入
  onInputChange(e) {
    this.setData({
      userInput: e.detail.value
    });
  },
  
  // 发送消息
  sendMessage() {
    const input = this.data.userInput.trim();
    if (!input || this.data.isAiTyping) return;
    
    this.addUserMessage(input);
    this.processUserAnswer(input);
  },
  
  // 选择快捷回复
  selectQuickReply(e) {
    const reply = e.currentTarget.dataset.reply;
    this.addUserMessage(reply);
    this.processUserAnswer(reply);
  },
   
   // 处理用户回答
   processUserAnswer(answer) {
     const currentQ = this.data.questions[this.data.currentQuestion];
     const petInfo = { ...this.data.petInfo };
     
     // 根据问题类型处理答案
     switch (currentQ.id) {
       case 'species':
         petInfo.species = this.normalizeSpecies(answer);
         break;
       case 'breed':
         petInfo.breed = answer;
         break;
       case 'age':
         petInfo.age = this.parseAge(answer);
         break;
       case 'weight':
         petInfo.weight = this.parseWeight(answer);
         break;
       case 'allergies':
         petInfo.allergies = answer === '无' ? [] : [answer];
         break;
       case 'activity':
         petInfo.activityLevel = answer;
         break;
       case 'health':
         petInfo.healthConditions = answer;
         break;
     }
     
     this.setData({ petInfo });
     
     // 继续下一个问题或完成对话
     const nextQuestionIndex = this.data.currentQuestion + 1;
     if (nextQuestionIndex < this.data.questions.length) {
       this.setData({ currentQuestion: nextQuestionIndex });
       const nextQuestion = this.data.questions[nextQuestionIndex];
       
       // 根据前面的回答动态调整问题
       let question = nextQuestion.question;
       let quickReplies = [...nextQuestion.quickReplies];
       
       if (nextQuestion.id === 'breed' && petInfo.species) {
         question = `What breed is your ${petInfo.species === 'cat' ? 'cat' : 'dog'}?`;
       if (petInfo.species === 'cat') {
         quickReplies = ['British Shorthair', 'American Shorthair', 'Ragdoll', 'Siamese', 'Persian', 'Domestic Shorthair'];
       } else {
         quickReplies = ['Golden Retriever', 'Labrador', 'Poodle', 'Husky', 'Border Collie', 'Mixed Breed'];
       }
       }
       
       setTimeout(() => {
         this.addAiMessage(question, quickReplies);
       }, 500);
     } else {
       // Conversation completed
       this.completeConversation();
     }
   },
   
   // Complete conversation
   completeConversation() {
     const summary = this.generateSummary();
     setTimeout(() => {
       this.addAiMessage(summary, []);
       this.setData({ isCompleted: true });
     }, 500);
   },
   
   // Generate summary
   generateSummary() {
     const { petInfo } = this.data;
     return `Great! I have learned about your pet's basic information:\n\n🐾 Type: ${petInfo.species === 'cat' ? 'Cat' : 'Dog'}\n🏷️ Breed: ${petInfo.breed}\n📅 Age: ${petInfo.age} months\n⚖️ Weight: ${petInfo.weight}kg\n🚫 Allergies: ${Array.isArray(petInfo.allergies) ? petInfo.allergies.join(', ') : petInfo.allergies}\n🏃 Activity Level: ${petInfo.activityLevel}\n💊 Health Condition: ${petInfo.healthConditions}\n\nNow I will customize exclusive nutrition meals for your pet!`;
   },
   
   // Helper methods
   normalizeSpecies(answer) {
     if (answer.toLowerCase().includes('cat')) return 'cat';
     if (answer.toLowerCase().includes('dog')) return 'dog';
     return 'other';
   },
   
   parseAge(answer) {
     if (answer.includes('Under 3 months')) return 2;
     if (answer.includes('3-6 months')) return 4;
     if (answer.includes('6-12 months')) return 9;
     if (answer.includes('1-3 years')) return 24;
     if (answer.includes('3-7 years')) return 60;
     if (answer.includes('Over 7 years')) return 84;
     
     // Try to extract number from text
     const match = answer.match(/(\d+)/);
     return match ? parseInt(match[1]) : 12;
   },
   
   parseWeight(answer) {
     if (answer.includes('1-3kg')) return 2;
     if (answer.includes('3-5kg')) return 4;
     if (answer.includes('5-10kg')) return 7;
     if (answer.includes('10-20kg')) return 15;
     if (answer.includes('Over 20kg')) return 25;
     
     // Try to extract number from text
     const match = answer.match(/(\d+(?:\.\d+)?)/);
     return match ? parseFloat(match[1]) : 5;
   },
   
   formatTime(date) {
     const hours = date.getHours().toString().padStart(2, '0');
     const minutes = date.getMinutes().toString().padStart(2, '0');
     return `${hours}:${minutes}`;
   },
   
   scrollToBottom() {
     setTimeout(() => {
       this.setData({
         scrollTop: 999999
       });
     }, 100);
   },
   
   // Generate custom result
   generateResult() {
     if (this.data.loading) return;
     
     this.setData({ loading: true });
     
     // Call backend AI customization API
     tt.request({
       url: 'http://localhost:3000/api/ai/customize',
       method: 'POST',
       data: {
         recipeId: this.data.recipeId,
         recipeName: this.data.recipeName,
         originalIngredients: [],
         petInfo: this.data.petInfo
       },
       success: (res) => {
         this.setData({ loading: false });
         if (res.data && res.data.success) {
           const resultData = encodeURIComponent(JSON.stringify(res.data));
           tt.navigateTo({ 
             url: `/pages/ai/result/index?data=${resultData}` 
           });
         } else {
           tt.showToast({ title: 'Customization failed, please try again', icon: 'none' });
         }
       },
       fail: () => {
         this.setData({ loading: false });
         tt.showToast({ title: 'Network error, please try again', icon: 'none' });
       }
     });
   },

   formSubmit: function(e) {
     const formData = e.detail.value;
     console.log('表单提交数据:', formData);
     
     // 验证表单数据
     if (!formData.weight || !formData.age) {
       wx.showToast({
         title: '请填写完整信息',
         icon: 'none'
       });
       return;
     }
     
     // 处理表单数据
     const petInfo = {
       weight: formData.weight,
       age: formData.age,
       allergies: formData.allergies || 'None'
     };
     
     // 保存宠物信息并跳转到结果页面
     this.setData({ petInfo });
     this.generateResult();
   }
});
