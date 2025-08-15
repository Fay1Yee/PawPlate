// 豆包大模型AI服务
const https = require('https');

class DoubaoAIService {
  constructor() {
    // 豆包大模型配置
    this.apiKey = process.env.DOUBAO_API_KEY || 'e779c50a-bc8c-4673-ada3-30c4e7987018';
    this.baseUrl = 'https://ark.cn-beijing.volces.com/api/v3';
    this.modelId = 'doubao-seed-1-6-250615'; // 豆包模型ID
  }

  // 调用豆包大模型生成定制菜谱
  async customizeRecipeWithAI(params) {
    const { recipeId, recipeName, originalIngredients, petInfo } = params;
    
    const prompt = this.buildPrompt(recipeName, originalIngredients, petInfo);
    
    try {
      const response = await this.callDoubaoAPI(prompt);
      return this.parseAIResponse(response);
    } catch (error) {
      console.error('豆包AI调用失败:', error);
      // 降级到规则引擎
      return this.fallbackToRuleEngine(originalIngredients, petInfo);
    }
  }

  // 构建提示词
  buildPrompt(recipeName, ingredients, petInfo) {
    const { weight, age, allergies, breed, activityLevel, healthConditions } = petInfo;
    
    // 确保ingredients是数组
    const ingredientsArray = Array.isArray(ingredients) ? ingredients : [];
    const ingredientsList = ingredientsArray.map(ing => `${ing.name}: ${ing.amount}`).join(', ');
    
    // 确保allergies是数组
    const allergiesArray = Array.isArray(allergies) ? allergies : 
                          (typeof allergies === 'string' && allergies !== '无' && allergies !== '') ? 
                          allergies.split(',').map(item => item.trim()) : [];
    
    return `你是一位专业的宠物营养师，请根据以下信息为宠物定制营养餐：

原始菜谱：${recipeName}
原始配料：${ingredientsList || '鸡胸肉: 200g, 胡萝卜: 100g'}

宠物信息：
- 体重：${weight}kg
- 年龄：${age}岁
- 过敏项：${allergiesArray.length > 0 ? allergiesArray.join(', ') : '无'}
- 品种：${breed || '未知'}
- 活动量：${activityLevel || '中等'}
- 健康状况：${healthConditions || '健康'}

请提供：
1. 调整后的配料清单（包含具体重量，单位为克）
2. 营养分析
3. 喂食建议
4. 注意事项

请以JSON格式返回，格式如下：
{
  "ingredients": [
    {"name": "配料名", "amount": "重量g", "nutrition": "营养价值"}
  ],
  "nutritionAnalysis": "营养分析文本",
  "feedingAdvice": "喂食建议",
  "precautions": "注意事项"
}`;
  }

  // 调用豆包API
  async callDoubaoAPI(prompt) {
    return new Promise((resolve, reject) => {
      const postData = JSON.stringify({
        model: this.modelId,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      });

      const options = {
        hostname: 'ark.cn-beijing.volces.com',
        port: 443,
        path: '/api/v3/chat/completions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            resolve(response);
          } catch (error) {
            reject(error);
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.write(postData);
      req.end();
    });
  }

  // 解析AI响应
  parseAIResponse(response) {
    try {
      console.log('豆包API原始响应:', JSON.stringify(response, null, 2));
      
      // 检查响应结构
      if (!response || !response.choices || !Array.isArray(response.choices) || response.choices.length === 0) {
        console.error('豆包API响应结构异常:', response);
        throw new Error('API响应结构异常');
      }
      
      const content = response.choices[0].message.content;
      console.log('豆包API返回内容:', content);
      
      // 尝试提取JSON部分
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const aiResult = JSON.parse(jsonMatch[0]);
        return {
          success: true,
          data: {
            customizedRecipe: {
              name: "AI定制营养餐",
              ingredients: aiResult.ingredients,
              nutritionAnalysis: aiResult.nutritionAnalysis,
              feedingAdvice: aiResult.feedingAdvice,
              precautions: aiResult.precautions,
              aiGenerated: true
            }
          }
        };
      }
    } catch (error) {
      console.error('AI响应解析失败:', error);
    }
    
    // 解析失败时返回错误
    throw new Error('AI响应格式错误');
  }

  // 规则引擎降级方案
  fallbackToRuleEngine(ingredients, petInfo) {
    const { weight, age, allergies } = petInfo;
    
    // 确保ingredients是数组
    const ingredientsArray = Array.isArray(ingredients) ? ingredients : [
      { name: '鸡胸肉', amount: '200g' },
      { name: '胡萝卜', amount: '100g' }
    ];
    
    // 确保allergies是数组
    const allergiesArray = Array.isArray(allergies) ? allergies : 
                          (typeof allergies === 'string' && allergies !== '无' && allergies !== '') ? 
                          allergies.split(',').map(item => item.trim()) : [];
    
    // 基础体重比例计算（假设基础配方适合10kg宠物）
    const weightRatio = weight / 10;
    
    // 年龄调整系数
    let ageMultiplier = 1;
    if (age < 1) ageMultiplier = 1.2; // 幼犬需要更多营养
    else if (age > 7) ageMultiplier = 0.9; // 老年犬减少摄入
    
    const adjustedIngredients = ingredientsArray.map(ingredient => {
      // 过敏检查
      if (allergiesArray.includes(ingredient.name)) {
        return {
          name: `${ingredient.name} (已替换)`,
          amount: "0g",
          nutrition: "过敏项已移除"
        };
      }
      
      // 计算调整后的重量
      const baseAmount = parseFloat(ingredient.amount) || 100;
      const adjustedAmount = Math.round(baseAmount * weightRatio * ageMultiplier);
      
      return {
        name: ingredient.name,
        amount: `${adjustedAmount}g`,
        nutrition: "根据体重年龄调整"
      };
    });

    return {
      success: true,
      data: {
        customizedRecipe: {
          name: "智能定制营养餐",
          ingredients: adjustedIngredients,
          nutritionAnalysis: `根据${weight}kg体重和${age}岁年龄调整配方`,
          feedingAdvice: `建议每日分2-3次喂食，观察宠物反应`,
          precautions: allergiesArray.length > 0 ? `注意避免过敏项：${allergiesArray.join(', ')}` : "注意观察宠物食用反应",
          aiGenerated: false
        }
      }
    };
  }
}

module.exports = new DoubaoAIService();