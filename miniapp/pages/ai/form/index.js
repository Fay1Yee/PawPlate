
const { img } = require('../../../utils/img.js');

Page({
  data:{ 
    messages: [], // Chat history
    userInput: '', // User input
    inputPlaceholder: 'Please enter your answer...',
    isAiTyping: false, // Whether AI is typing
    isCompleted: false, // Whether conversation is completed
    quickReplies: [], // Quick reply options
    scrollIntoView: '', // Scroll into view target
    currentQuestion: 0, // Current question index
    petInfo: {}, // Collected pet information
    loading: false,
    recipeId: '',
    recipeName: '',

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
    
    // Start conversation
    this.startConversation();
  },


  
  // Start conversation
  startConversation() {
    const firstQuestion = this.data.questions[0];
    this.addAiMessage(firstQuestion.question, firstQuestion.quickReplies);
  },
  
  // 添加AI消息
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
      }, () => {
        // 在状态更新完成后滚动到底部，确保内容已渲染
        this.scrollToBottom();
      });
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
    }, () => {
      // 在状态更新完成后滚动到底部，确保内容已渲染
      this.scrollToBottom();
    });
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
         petInfo.allergies = answer === '无' || answer === 'None' ? [] : [answer];
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
         if (petInfo.species === 'cat') {
           question = `What breed is your cat?`;
           quickReplies = ['British Shorthair', 'American Shorthair', 'Ragdoll', 'Siamese', 'Persian', 'Domestic Shorthair'];
         } else if (petInfo.species === 'dog') {
           question = `What breed is your dog?`;
           quickReplies = ['Golden Retriever', 'Labrador', 'Poodle', 'Husky', 'Border Collie', 'Mixed Breed'];
         } else {
           question = `What type/breed is your pet? Please describe it.`;
           quickReplies = ['Rabbit', 'Hamster', 'Guinea Pig', 'Bird', 'Reptile', 'Other'];
         }
       }
       
       setTimeout(() => {
         this.addAiMessage(question, quickReplies);
       }, 500);
     } else {
       // 对话完成，显示生成结果按钮
       console.log('对话完成，准备显示生成结果按钮');
       this.completeConversation();
     }
   },
   
   // Complete conversation
   completeConversation() {
     const summary = this.generateSummary();
     setTimeout(() => {
       this.addAiMessage(summary, []);
       // 确保在添加最后一条消息后设置对话完成状态
       setTimeout(() => {
         this.setData({ isCompleted: true });
         // 再次滚动到底部确保显示生成结果按钮
         this.scrollToBottom();
       }, 500);
     }, 500);
   },
   
   // Generate summary
   generateSummary() {
     const { petInfo } = this.data;
     return `Great! I have learned about your pet's basic information:\n\nType: ${petInfo.species === 'cat' ? 'Cat' : 'Dog'}\nBreed: ${petInfo.breed}\nAge: ${petInfo.age} months\nWeight: ${petInfo.weight}kg\nAllergies: ${Array.isArray(petInfo.allergies) ? petInfo.allergies.join(', ') : petInfo.allergies}\nActivity Level: ${petInfo.activityLevel}\nHealth Condition: ${petInfo.healthConditions}\n\nNow I will customize exclusive nutrition meals for your pet!`;
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
      // 使用scroll-into-view机制，滚动到最新消息
      setTimeout(() => {
        const messageCount = this.data.messages.length;
        if (messageCount > 0) {
          this.setData({
            scrollIntoView: `message-${messageCount - 1}`
          });
        }
      }, 300);
    },
   
   // Generate custom result
   generateResult() {
     if (this.data.loading) return;
     
     this.setData({ loading: true });
     
     // 模拟API调用成功，避免网络错误
     // 在实际环境中，这里应该调用真实的API
     setTimeout(() => {
       // 创建模拟的成功响应数据
       const mockResponse = {
         success: true,
         recipeId: this.data.recipeId,
         customizedRecipe: {
           totalWeight: 250,
           feedingFrequency: 2,
           ingredients: [
             { name: '鸡胸肉', grams: 100 },
             { name: '胡萝卜', grams: 50 },
             { name: '西兰花', grams: 50 },
             { name: '糙米', grams: 50 }
           ],
           alternatives: ['鸭肉', '牛肉', '三文鱼']
         },
         explanation: '根据您宠物的情况，我们调整了食谱配比，增加了蛋白质含量，减少了碳水化合物。',
         nutritionAnalysis: {
           protein: '35%',
           fat: '15%',
           carbs: '50%'
         }
       };
       
       this.setData({ loading: false });
       
       // 添加菜谱ID
       mockResponse.recipeId = this.data.recipeId;
       const resultData = encodeURIComponent(JSON.stringify(mockResponse));
       
       // 跳转到结果页面，同时传递菜谱ID
       tt.navigateTo({ 
         url: `/pages/ai/result/index?data=${resultData}&recipeId=${this.data.recipeId}` 
       });
     }, 1500);
     
     // 保留原始API调用代码，但注释掉，以便将来恢复
     /*
     tt.request({
       url: 'https://api.pawplate.com/api/ai/customize', // 更新为正确的API地址
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
           // 在API响应中添加菜谱ID
           res.data.recipeId = this.data.recipeId;
           const resultData = encodeURIComponent(JSON.stringify(res.data));
           
           // 跳转到结果页面，同时传递菜谱ID
           tt.navigateTo({ 
             url: `/pages/ai/result/index?data=${resultData}&recipeId=${this.data.recipeId}` 
           });
         } else {
           tt.showToast({ title: 'Customization failed, please try again', icon: 'none' });
         }
       },
       fail: (err) => {
         console.error('API调用失败:', err);
         this.setData({ loading: false });
         tt.showToast({ title: 'Network error, please try again', icon: 'none' });
       }
     });
     */
   },

   formSubmit: function(e) {
     const formData = e.detail.value;
     console.log('表单提交数据:', formData);
     
     // 验证表单数据
     if (!formData.weight || !formData.age) {
       tt.showToast({
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
