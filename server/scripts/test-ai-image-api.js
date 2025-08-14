#!/usr/bin/env node

/**
 * AI图片生成API测试脚本
 * 测试真实的AI图片生成服务
 */

const axios = require('axios');

// 服务器配置
const SERVER_URL = 'http://localhost:3000';
const API_BASE = `${SERVER_URL}/api/real-genimage`;

// 测试用例
const TEST_CASES = [
  {
    name: '生成单张商品图片',
    endpoint: '/generate',
    method: 'POST',
    data: {
      prompt: '可爱的橘猫猫粮包装袋，现代简约设计，温暖橙色调',
      options: {
        category: 'products',
        size: '512x512',
        style: 'realistic',
        service: 'stability'
      }
    }
  },
  {
    name: '批量生成小程序图片',
    endpoint: '/generate-miniapp',
    method: 'POST',
    data: {}
  },
  {
    name: '获取生成状态',
    endpoint: '/status',
    method: 'GET'
  },
  {
    name: '获取已生成图片列表',
    endpoint: '/images',
    method: 'GET'
  }
];

// 发送HTTP请求
async function makeRequest(testCase) {
  const url = `${API_BASE}${testCase.endpoint}`;
  
  try {
    console.log(`\n🔄 测试: ${testCase.name}`);
    console.log(`📡 ${testCase.method} ${url}`);
    
    if (testCase.data && Object.keys(testCase.data).length > 0) {
      console.log(`📝 请求数据:`, JSON.stringify(testCase.data, null, 2));
    }
    
    const config = {
      method: testCase.method,
      url: url,
      timeout: 60000 // 60秒超时
    };
    
    if (testCase.method === 'POST' && testCase.data) {
      config.data = testCase.data;
    }
    
    const startTime = Date.now();
    const response = await axios(config);
    const duration = Date.now() - startTime;
    
    console.log(`✅ 成功 (${duration}ms)`);
    console.log(`📊 状态码: ${response.status}`);
    console.log(`📄 响应:`, JSON.stringify(response.data, null, 2));
    
    return {
      success: true,
      status: response.status,
      data: response.data,
      duration
    };
    
  } catch (error) {
    console.log(`❌ 失败`);
    
    if (error.response) {
      console.log(`📊 状态码: ${error.response.status}`);
      console.log(`📄 错误响应:`, JSON.stringify(error.response.data, null, 2));
      
      return {
        success: false,
        status: error.response.status,
        error: error.response.data,
        duration: 0
      };
    } else if (error.code === 'ECONNREFUSED') {
      console.log(`🔌 连接被拒绝 - 服务器可能未启动`);
      
      return {
        success: false,
        error: '服务器连接失败',
        duration: 0
      };
    } else {
      console.log(`💥 请求错误:`, error.message);
      
      return {
        success: false,
        error: error.message,
        duration: 0
      };
    }
  }
}

// 检查服务器状态
async function checkServerHealth() {
  try {
    console.log('🏥 检查服务器健康状态...');
    const response = await axios.get(`${SERVER_URL}/api/real-genimage/status`, {
      timeout: 5000
    });
    
    console.log('✅ 服务器在线');
    console.log('🔑 API密钥状态:', response.data.services);
    
    return true;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ 服务器离线 - 请先启动服务器');
      console.log('💡 运行命令: npm start');
    } else {
      console.log('⚠️  服务器健康检查失败:', error.message);
    }
    
    return false;
  }
}

// 运行所有测试
async function runAllTests() {
  console.log('🚀 AI图片生成API测试工具');
  console.log('=' .repeat(50));
  
  // 检查服务器状态
  const serverOnline = await checkServerHealth();
  if (!serverOnline) {
    console.log('\n❌ 无法连接到服务器，测试终止');
    return;
  }
  
  console.log('\n🧪 开始API测试...');
  
  const results = [];
  
  for (let i = 0; i < TEST_CASES.length; i++) {
    const testCase = TEST_CASES[i];
    const result = await makeRequest(testCase);
    
    results.push({
      name: testCase.name,
      ...result
    });
    
    // 在测试之间添加延迟
    if (i < TEST_CASES.length - 1) {
      console.log('⏳ 等待 2 秒...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  // 统计结果
  const successCount = results.filter(r => r.success).length;
  const failureCount = results.length - successCount;
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 测试结果统计');
  console.log(`✅ 成功: ${successCount}/${results.length}`);
  console.log(`❌ 失败: ${failureCount}/${results.length}`);
  console.log(`⏱️  总耗时: ${totalDuration}ms`);
  
  if (successCount > 0) {
    console.log('\n✅ 成功的测试:');
    results.filter(r => r.success).forEach(r => {
      console.log(`   🟢 ${r.name} (${r.duration}ms)`);
    });
  }
  
  if (failureCount > 0) {
    console.log('\n❌ 失败的测试:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   🔴 ${r.name}: ${r.error}`);
    });
  }
  
  console.log('\n💡 提示:');
  if (failureCount === 0) {
    console.log('   🎉 所有测试通过！AI图片生成服务运行正常');
  } else {
    console.log('   🔧 部分测试失败，请检查服务器配置和API密钥');
    console.log('   📄 查看 .env 文件确保API密钥配置正确');
  }
  
  console.log(`   🌐 图片访问地址: ${SERVER_URL}/images/ai-generated/`);
}

// 运行特定测试
async function runSpecificTest(testName) {
  const testCase = TEST_CASES.find(t => t.name.includes(testName));
  
  if (!testCase) {
    console.log(`❌ 未找到测试: ${testName}`);
    console.log('📋 可用测试:');
    TEST_CASES.forEach((t, i) => {
      console.log(`   ${i + 1}. ${t.name}`);
    });
    return;
  }
  
  console.log(`🎯 运行特定测试: ${testCase.name}`);
  console.log('=' .repeat(50));
  
  const serverOnline = await checkServerHealth();
  if (!serverOnline) {
    console.log('\n❌ 无法连接到服务器，测试终止');
    return;
  }
  
  const result = await makeRequest(testCase);
  
  console.log('\n📊 测试结果:');
  if (result.success) {
    console.log(`✅ 测试通过 (${result.duration}ms)`);
  } else {
    console.log(`❌ 测试失败: ${result.error}`);
  }
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length > 0) {
    // 运行特定测试
    await runSpecificTest(args[0]);
  } else {
    // 运行所有测试
    await runAllTests();
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main().catch(error => {
    console.error('💥 测试脚本执行失败:', error.message);
    process.exit(1);
  });
}

module.exports = {
  runAllTests,
  runSpecificTest,
  checkServerHealth,
  main
};