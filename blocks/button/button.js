import { html, render } from "https://esm.sh/lit-html";
import { moveInstrumentation } from "../../scripts/scripts.js";

export default function decorate(block) {
  if (!block.children.length) return;

  const cols = [...block.children];
  const styleEL = cols[0];
  const picture = cols[1];
  const labelEl = cols[2];
  const linkEl = cols[3];
  const alignEl = cols[4];

  const style = styleEL?.textContent?.trim().toLowerCase() || "primary-m";
  const label = labelEl?.textContent?.trim() || "";
  const link = linkEl?.textContent?.trim() || "#";
  let align = alignEl?.textContent?.trim().toLowerCase() || "left";

  // 处理对齐方式值，确保只使用align值部分
  if (align.startsWith("is-align-")) {
    align = align.replace("is-align-", "");
  }

  let buttonHtml;
  if (["primary-m", "secondary-m", "secondary-s"].includes(style)) {
    buttonHtml = html`
      <a class="btn btn--${style} body-1" href="${link}">${label}</a>
    `;
  } else if (style === "icon") {
    buttonHtml = html`
      <a class="btn-icon btn-icon--primary" href="${link}"> ${picture} </a>
    `;
  } else if (style === "text-icon") {
    buttonHtml = html`
      <a class="btn-text-icon btn-text-icon--primary" href="${link}">
        ${picture}
        <span class="body-1">${label}</span>
      </a>
    `;
  } else {
    // 默认返回primary-m按钮
    buttonHtml = html`
      <a class="btn btn--primary-m body-1" href="${link}">${label}</a>
    `;
  }

  // 创建最终模板，设置对齐类名
  const template = html`
    <div class="cmp__button__container component-layout">
      <div class="cmp__button__wrapper is-align-${align}">${buttonHtml}</div>
    </div>
  `;

  // 添加组件类名
  block.classList.add("cmp__button");

  // 清空块内容并渲染模板
  block.innerHTML = "";
  render(template, block);

  // 恢复Instrumentation以支持内联编辑
  const instrumentationMap = [
    { index: 0, selector: ".cmp__button__wrapper" }, // style
    { index: 1, selector: ".btn-text-icon svg, .btn-icon svg" }, // picture
    { index: 2, selector: ".btn, .btn-text-icon span" }, // label
    { index: 3, selector: ".btn, .btn-icon, .btn-text-icon" }, // link
  ];

  instrumentationMap.forEach(({ index, selector }) => {
    const source = cols[index];
    const target = block.querySelector(selector);
    if (source && target) {
      moveInstrumentation(source, target);
    }
  });
}
