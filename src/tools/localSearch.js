import fs from 'fs/promises';
import path from 'path';
import { formatError, truncateText } from '../utils/helpers.js';

/**
 * 本地搜索工具定义
 */
export const LOCAL_SEARCH_TOOL = {
  name: "local_search",
  description: "在本地文件中搜索内容。可以指定文件类型和搜索路径。",
  inputSchema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "搜索查询（必填）"
      },
      path: {
        type: "string",
        description: "搜索路径，默认为当前目录",
        default: "."
      },
      fileTypes: {
        type: "array",
        items: {
          type: "string"
        },
        description: "要搜索的文件类型（例如：['.txt', '.md', '.js']），默认搜索所有文件",
        default: []
      },
      maxResults: {
        type: "number",
        description: "最大结果数量，默认为10",
        default: 10
      }
    },
    required: ["query"]
  }
};

/**
 * 执行本地文件搜索
 * @param {Object} args 搜索参数
 * @returns {Promise<string>} 搜索结果
 */
export async function performLocalSearch(args) {
  try {
    const { query, path: searchPath = '.', fileTypes = [], maxResults = 10 } = args;
    
    // 验证查询
    if (!query || typeof query !== 'string' || query.trim() === '') {
      return "错误：搜索查询不能为空";
    }

    // 搜索结果
    const results = [];
    
    // 递归搜索文件
    await searchDirectory(searchPath, query, fileTypes, results, maxResults);
    
    // 格式化结果
    if (results.length === 0) {
      return `未找到与"${query}"匹配的结果。`;
    }
    
    return formatResults(results, query);
  } catch (error) {
    console.error('本地搜索错误:', error);
    return `搜索时发生错误: ${formatError(error)}`;
  }
}

/**
 * 递归搜索目录
 * @param {string} dirPath 目录路径
 * @param {string} query 搜索查询
 * @param {Array<string>} fileTypes 文件类型
 * @param {Array} results 结果数组
 * @param {number} maxResults 最大结果数
 */
async function searchDirectory(dirPath, query, fileTypes, results, maxResults) {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      // 如果已达到最大结果数，停止搜索
      if (results.length >= maxResults) {
        break;
      }
      
      const fullPath = path.join(dirPath, entry.name);
      
      // 跳过隐藏文件和目录
      if (entry.name.startsWith('.')) {
        continue;
      }
      
      if (entry.isDirectory()) {
        // 递归搜索子目录
        await searchDirectory(fullPath, query, fileTypes, results, maxResults);
      } else if (entry.isFile()) {
        // 检查文件类型
        const ext = path.extname(entry.name).toLowerCase();
        if (fileTypes.length > 0 && !fileTypes.includes(ext)) {
          continue;
        }
        
        // 读取文件内容并搜索
        try {
          const content = await fs.readFile(fullPath, 'utf-8');
          if (content.toLowerCase().includes(query.toLowerCase())) {
            // 找到匹配，添加到结果
            results.push({
              path: fullPath,
              content: extractMatchContext(content, query),
              type: ext || '未知'
            });
          }
        } catch (err) {
          // 忽略无法读取的文件
          console.warn(`无法读取文件 ${fullPath}: ${err.message}`);
        }
      }
    }
  } catch (err) {
    console.warn(`无法读取目录 ${dirPath}: ${err.message}`);
  }
}

/**
 * 提取匹配上下文
 * @param {string} content 文件内容
 * @param {string} query 搜索查询
 * @returns {string} 带有上下文的匹配内容
 */
function extractMatchContext(content, query) {
  const lowerContent = content.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerContent.indexOf(lowerQuery);
  
  if (index === -1) {
    return truncateText(content);
  }
  
  // 提取匹配周围的上下文
  const contextStart = Math.max(0, index - 100);
  const contextEnd = Math.min(content.length, index + query.length + 100);
  let extractedContent = content.substring(contextStart, contextEnd);
  
  // 添加省略号表示截断
  if (contextStart > 0) {
    extractedContent = '...' + extractedContent;
  }
  if (contextEnd < content.length) {
    extractedContent = extractedContent + '...';
  }
  
  return extractedContent;
}

/**
 * 格式化搜索结果
 * @param {Array} results 搜索结果
 * @param {string} query 搜索查询
 * @returns {string} 格式化的结果
 */
function formatResults(results, query) {
  const header = `找到 ${results.length} 个与"${query}"匹配的结果:\n\n`;
  
  const formattedResults = results.map((result, index) => {
    return `[${index + 1}] 文件: ${result.path}\n类型: ${result.type}\n内容: ${result.content}\n`;
  }).join('\n');
  
  return header + formattedResults;
} 