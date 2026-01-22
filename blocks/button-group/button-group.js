import { html, render } from "https://esm.sh/lit-html";
import { moveInstrumentation } from "../../scripts/scripts.js";

const COMPONENT_CLASS = "cmp__button-group";

/**
 * get button group configuration from the block first row
 * @param {block} block
 * @returns
 */
function getButtonGroupConfig(block) {
  const firstRow = block.firstElementChild;
  if (!firstRow) return { align: "left" };

  const firstCol = firstRow.firstElementChild;
  const align = firstCol?.textContent?.trim().toLowerCase() || "left";

  return { align };
}

/**
 * parse a single row into an item configuration
 * @param {HTMLElement} row
 * @returns {object}
 */
function parseItemConfig(row) {
  const cols = [...row.children];
  const [
    btnStyle,     // 0: Button Style
    btnLabelCol,    // 1: Button Label
    btnLinkCol,     // 2: Button Link
    btnIconCol,    // 3: Button Icon
    btnHoverIconCol,     // 4: Button Hover Icon
  ] = cols;
  let hoverIconEl = null;
  let iconEl = null;
  if (btnIconCol) {
    iconEl = btnIconCol.querySelector("picture");
    if (iconEl) iconEl.querySelector("img").classList.add("icon");
  }
  if (btnHoverIconCol) {
    hoverIconEl = btnHoverIconCol.querySelector("picture");
    if (hoverIconEl) hoverIconEl.querySelector("img").classList.add("hover-icon");
  }
  return {
    style: btnStyle?.textContent?.trim().toLowerCase() || "primary-m",
    label: btnLabelCol?.textContent?.trim() || "",
    link: btnLinkCol?.textContent?.trim() || "#",
    icon: iconEl,
    hoverIcon: hoverIconEl,
  };
}

/**
 * set button template
 * @param {object} config
 * @returns
 */
function setButtonTemplate(config) {
  console.log(config);
  let buttonHtml;
  if (config.style === "icon") {
    buttonHtml = html`
      <a class="btn-icon btn-icon--primary ${config.hoverIcon ? "is-have-hover-icon" : ""}" href="${config.link}"> ${config.icon} ${config.hoverIcon}</a>
    `;
  } else if (config.style === "text-icon") {
    buttonHtml = html`
      <a class="btn-text-icon btn-text-icon--primary" href="${config.link}">
        ${config.icon}
        ${config.hoverIcon}
        <span class="body-1" data-inst="label">${config.label}</span>
      </a>
    `;
  } else {
    buttonHtml = html`
      <a class="btn btn--${config.style} body-1" href="${config.link}" data-inst="label"
        >${config.label}</a
      >
    `;
  }
  return buttonHtml;
}
export default function decorate(block) {
  const config = getButtonGroupConfig(block);

  if (!config) return;

  const rows = [...block.children];
  const items = rows.slice(1).map(parseItemConfig);

  console.log(items);


  const template = html`
    <div class="${COMPONENT_CLASS} ${items.length > 1 ? `${COMPONENT_CLASS}--multiple-buttons` : ""}">
      <div class="${COMPONENT_CLASS}__container component-layout">
        <div class="${COMPONENT_CLASS}__wrapper is-align-${config.align}">
          ${items.map((item) => setButtonTemplate(item))}
        </div>
      </div>
    </div>
  `;

  block.innerHTML = "";
  block.classList.add(COMPONENT_CLASS);

  render(template, block);
}
