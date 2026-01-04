import { html, render } from 'https://esm.sh/lit-html';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * 从 DOM 行中提取内容列的辅助函数。
 * 处理基于文档的创作（扁平结构）和通用编辑器预览（通常嵌套在包装器中）之间 DOM 结构的差异。
 */
function getRowContent(row) {
  let cols = [...row.children];
  // 检查行是否有单个子元素，且该子元素也是容器（通用编辑器包装器）
  if (cols.length === 1 && cols[0].children.length > 1) {
    return [...cols[0].children];
  }
  return cols;
}

/**
 * 从块包装器中提取配置（块选项/样式）。
 */
function extractConfig(block) {
  return {
    className: [...block.classList].find(c => c.startsWith('bg-')) || ''
  };
}

/**
 * 将原始 DOM 行转换为干净的数据对象。
 */
function extractItemData(row) {
  const [quoteCol, authorCol, descCol] = getRowContent(row);

  return {
    sourceRow: row, // 对行（项）的引用，用于选择
    quote: quoteCol?.innerHTML || '',
    author: authorCol?.innerHTML || '',
    desc: descCol?.innerHTML || ''
  };
}

/**
 * 使用 lit-html 生成整个块的 HTML 模板。
 */
function renderTemplate(items, config) {
  return html`
    <div class="quote-container ${config.className}">
      <div class="quotes-list">
        ${items.map((item, index) => html`
          <div class="quote-item-wrapper" data-index="${index}">
            <blockquote .innerHTML=${item.quote}></blockquote>
            ${item.author ? html`<cite>- <span .innerHTML=${item.author}></span></cite>` : ''}
            ${item.desc ? html`<p .innerHTML=${item.desc}></p>` : ''}
          </div>
        `)}
      </div>
    </div>
  `;
}

/**
 * 应用通用编辑器的监测。
 * 标准行为：仅监测项包装器。
 */
function applyInstrumentation(block, items) {
  const newItems = block.querySelectorAll('.quote-item-wrapper');
  
  newItems.forEach((newItem) => {
    const index = newItem.dataset.index;
    const originalItem = items[index];
    
    if (originalItem) {
      // 标准 EDS 模式：监测项包装器（li 或 div）
      moveInstrumentation(originalItem.sourceRow, newItem);
    }
  });
}

/**
 * 主装饰器函数
 */
export default function decorate(block) {
  console.log('decorate quotes', block.children);
  const config = extractConfig(block);
  const items = [...block.children].map(extractItemData);
  const template = renderTemplate(items, config);
  
  block.replaceChildren();
  render(template, block);
  
  applyInstrumentation(block, items);
}
