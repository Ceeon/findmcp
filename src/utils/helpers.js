/**
 * 格式化搜索结果为易于阅读的文本
 * @param {Array} results 搜索结果数组
 * @returns {string} 格式化后的文本
 */
export function formatSearchResults(results) {
  if (!results || results.length === 0) {
    return "未找到任何结果。";
  }

  return results
    .map((result, index) => {
      return `[${index + 1}] ${result.title || "无标题"}\n${
        result.url ? `链接: ${result.url}\n` : ""
      }${result.snippet || result.content || "无描述"}\n`;
    })
    .join("\n");
}

/**
 * 截断文本到指定长度
 * @param {string} text 要截断的文本
 * @param {number} maxLength 最大长度
 * @returns {string} 截断后的文本
 */
export function truncateText(text, maxLength = 200) {
  if (!text || text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + "...";
}

/**
 * 从错误对象中提取有用的错误信息
 * @param {Error} error 错误对象
 * @returns {string} 格式化的错误信息
 */
export function formatError(error) {
  if (!error) {
    return "发生未知错误";
  }

  if (typeof error === "string") {
    return error;
  }

  const message = error.message || "未知错误";
  const stack = error.stack ? `\n堆栈跟踪: ${error.stack}` : "";
  const code = error.code ? `\n错误代码: ${error.code}` : "";

  return `${message}${code}${stack}`;
}

/**
 * 验证搜索查询
 * @param {string} query 搜索查询
 * @returns {boolean} 是否有效
 */
export function isValidQuery(query) {
  return typeof query === "string" && query.trim().length > 0;
}

/**
 * 安全地解析JSON
 * @param {string} jsonString JSON字符串
 * @param {any} defaultValue 解析失败时的默认值
 * @returns {any} 解析结果
 */
export function safeJsonParse(jsonString, defaultValue = {}) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("JSON解析错误:", error);
    return defaultValue;
  }
} 