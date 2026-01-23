import { html, render } from "https://esm.sh/lit-html";
import { moveInstrumentation } from "../../scripts/scripts.js";

const COMPONENT_CLASS = "cmp__img-with-text";

/**
 * Render buttons or links based on layout configuration
 * @param {Array} links - Array of link objects
 * @param {string} layout - 'group' or 'normal'
 * @param {string} position - CSS class for alignment
 */
function renderButtons(links, layout, position) {
  if (!links.length) return null;

  const isGroup = layout === "group";
  const wrapperClass = isGroup
    ? `${COMPONENT_CLASS}__text-link-group`
    : `${COMPONENT_CLASS}__button-wrapper`;
  const btnClass = isGroup
    ? `${COMPONENT_CLASS}__text-link subtitle-1 is-with-arrow`
    : `${COMPONENT_CLASS}__button body-1`;

  return html`
    <div class="${wrapperClass} ${position}" data-inst="button-wrapper">
      ${links.map(
    (link) => html`
          <a href="${link.href}" title="${link.title}" class="${btnClass}">
            ${link.text}
          </a>
        `
  )}
    </div>
  `;
}

export default function decorate(block) {
  if (!block.children.length) return;

  // Destructure config rows for better readability
  const [
    positionRow, // 0: Image Position
    imageRow, // 1: Image
    titleRow, // 2: Title
    descRow, // 3: Description
    btnLayoutRow, // 4: Button Layout
    btnContentRow, // 5: Button Content
    btnPosRow, // 6: Button Position
  ] = [...block.children].map((row) => row.firstElementChild);

  // Configuration Parsing
  const isReverse = positionRow?.textContent?.trim() === "image-right";
  const buttonLayout = btnLayoutRow?.textContent?.trim() || "normal";
  const buttonPosition = btnPosRow?.textContent?.trim() || "is-align-left";

  // Content Extraction
  const picture = imageRow?.querySelector("picture");
  if (picture) {
    picture.querySelector("img")?.classList.add(`${COMPONENT_CLASS}__image`);
  }

  const title = titleRow?.innerHTML || "";
  const description = descRow?.innerHTML || "";

  const links = btnContentRow
    ? [...btnContentRow.querySelectorAll("a")].map((a) => ({
      href: a.href,
      text: a.textContent,
      title: a.title,
    }))
    : [];

  const template = html`
    <div class="${COMPONENT_CLASS}__container component-layout">
      <div class="${COMPONENT_CLASS}__image-wrapper">${picture}</div>
      <div class="${COMPONENT_CLASS}__content">
        <div
          class="${COMPONENT_CLASS}__title headline-4"
          .innerHTML=${title}
        ></div>
        <p
          class="${COMPONENT_CLASS}__description rt-dark-800 body-1"
          .innerHTML=${description}
        ></p>
        ${renderButtons(links, buttonLayout, buttonPosition)}
      </div>
    </div>
  `;

  block.classList.add(COMPONENT_CLASS);
  if (isReverse) {
    block.classList.add(`${COMPONENT_CLASS}--reverse`);
  }

  block.innerHTML = "";
  render(template, block);

  // Restore Instrumentation
  const instrumentationMap = [
    { source: imageRow, selector: `.${COMPONENT_CLASS}__image-wrapper` },
    { source: titleRow, selector: `.${COMPONENT_CLASS}__title` },
    { source: descRow, selector: `.${COMPONENT_CLASS}__description` },
    { source: btnContentRow, selector: `[data-inst="button-wrapper"]` }
  ];

  instrumentationMap.forEach(({ source, selector }) => {
    const target = block.querySelector(selector);
    console.log(source);
    
    console.log(target);
    
    if (source && target) {
      moveInstrumentation(source, target);
    }
  });
}
