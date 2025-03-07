import axios from 'axios';
import dotenv from 'dotenv';
import { formatError } from '../utils/helpers.js';

// 加载环境变量
dotenv.config();

/**
 * 网络搜索工具定义
 */
export const WEB_SEARCH_TOOL = {
  name: "web_search",
  description: "使用配置的搜索引擎进行网络搜索。支持Brave、Google和Bing搜索引擎。",
  inputSchema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "搜索查询（必填）"
      },
      engine: {
        type: "string",
        description: "搜索引擎（brave、google、bing或local），默认为local"
      },
      count: {
        type: "number",
        description: "结果数量（1-20，默认10）",
        default: 10
      }
    },
    required: ["query"]
  }
};

/**
 * 执行网络搜索
 * @param {Object} args 搜索参数
 * @returns {Promise<string>} 搜索结果
 */
export async function performWebSearch(args) {
  try {
    const { query, engine = 'local', count = 10 } = args;
    
    // 验证查询
    if (!query || typeof query !== 'string' || query.trim() === '') {
      return "错误：搜索查询不能为空";
    }

    // 根据指定的引擎执行搜索
    switch (engine.toLowerCase()) {
      case 'brave':
        return await searchWithBrave(query, count);
      case 'google':
        return await searchWithGoogle(query, count);
      case 'bing':
        return await searchWithBing(query, count);
      case 'local':
      default:
        return `本地模式：无法执行实际的网络搜索。\n\n您的搜索查询是: "${query}"\n\n要执行实际的网络搜索，请配置API密钥并指定搜索引擎（brave、google或bing）。`;
    }
  } catch (error) {
    console.error('网络搜索错误:', error);
    return `搜索时发生错误: ${formatError(error)}`;
  }
}

/**
 * 使用Brave搜索
 * @param {string} query 搜索查询
 * @param {number} count 结果数量
 * @returns {Promise<string>} 搜索结果
 */
async function searchWithBrave(query, count) {
  const apiKey = process.env.BRAVE_API_KEY;
  
  if (!apiKey) {
    return "错误：未配置Brave API密钥。请在.env文件中设置BRAVE_API_KEY。";
  }
  
  try {
    const response = await axios.get('https://api.search.brave.com/res/v1/web/search', {
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip',
        'X-Subscription-Token': apiKey
      },
      params: {
        q: query,
        count: Math.min(count, 20)
      }
    });
    
    const results = response.data.web?.results || [];
    
    if (results.length === 0) {
      return `Brave搜索未找到与"${query}"匹配的结果。`;
    }
    
    return formatWebResults(results, query, 'Brave');
  } catch (error) {
    console.error('Brave搜索错误:', error);
    return `Brave搜索时发生错误: ${formatError(error)}`;
  }
}

/**
 * 使用Google搜索
 * @param {string} query 搜索查询
 * @param {number} count 结果数量
 * @returns {Promise<string>} 搜索结果
 */
async function searchWithGoogle(query, count) {
  const apiKey = process.env.GOOGLE_API_KEY;
  const cseId = process.env.GOOGLE_CSE_ID;
  
  if (!apiKey || !cseId) {
    return "错误：未配置Google API密钥或CSE ID。请在.env文件中设置GOOGLE_API_KEY和GOOGLE_CSE_ID。";
  }
  
  try {
    const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
      params: {
        key: apiKey,
        cx: cseId,
        q: query,
        num: Math.min(count, 10)
      }
    });
    
    const results = response.data.items || [];
    
    if (results.length === 0) {
      return `Google搜索未找到与"${query}"匹配的结果。`;
    }
    
    // 转换Google结果格式
    const formattedResults = results.map(item => ({
      title: item.title,
      url: item.link,
      description: item.snippet
    }));
    
    return formatWebResults(formattedResults, query, 'Google');
  } catch (error) {
    console.error('Google搜索错误:', error);
    return `Google搜索时发生错误: ${formatError(error)}`;
  }
}

/**
 * 使用Bing搜索
 * @param {string} query 搜索查询
 * @param {number} count 结果数量
 * @returns {Promise<string>} 搜索结果
 */
async function searchWithBing(query, count) {
  const apiKey = process.env.BING_API_KEY;
  
  if (!apiKey) {
    return "错误：未配置Bing API密钥。请在.env文件中设置BING_API_KEY。";
  }
  
  try {
    const response = await axios.get('https://api.bing.microsoft.com/v7.0/search', {
      headers: {
        'Ocp-Apim-Subscription-Key': apiKey
      },
      params: {
        q: query,
        count: Math.min(count, 50)
      }
    });
    
    const results = response.data.webPages?.value || [];
    
    if (results.length === 0) {
      return `Bing搜索未找到与"${query}"匹配的结果。`;
    }
    
    // 转换Bing结果格式
    const formattedResults = results.map(item => ({
      title: item.name,
      url: item.url,
      description: item.snippet
    }));
    
    return formatWebResults(formattedResults, query, 'Bing');
  } catch (error) {
    console.error('Bing搜索错误:', error);
    return `Bing搜索时发生错误: ${formatError(error)}`;
  }
}

/**
 * 格式化网络搜索结果
 * @param {Array} results 搜索结果
 * @param {string} query 搜索查询
 * @param {string} engine 搜索引擎
 * @returns {string} 格式化的结果
 */
function formatWebResults(results, query, engine) {
  const header = `${engine}搜索找到 ${results.length} 个与"${query}"匹配的结果:\n\n`;
  
  const formattedResults = results.map((result, index) => {
    return `[${index + 1}] ${result.title || '无标题'}\n链接: ${result.url || '无链接'}\n描述: ${result.description || result.snippet || '无描述'}\n`;
  }).join('\n');
  
  return header + formattedResults;
} 