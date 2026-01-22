import { html, render } from "https://esm.sh/lit-html";
import { moveInstrumentation } from "../../scripts/scripts.js";

const COMPONENT_CLASS = "cmp__button";

function getItemsConfig(block) {
  const rows = [...block.children];

  const styleRow = rows[0]; 
  const labelRow = rows[1];
  const linkRow = rows[2];
  const iconRow = rows[3];
  const hoverIconRow = rows[4];

  const style = styleRow?.textContent?.trim().toLowerCase() || "primary-m";
  const label = labelRow?.textContent?.trim() || "";
  const link = linkRow?.textContent?.trim() || "#";
  const pictureEl = iconRow?.querySelector("picture");
  const hoverPictureEl = hoverIconRow?.querySelector("picture");

  return {
    source: block,
    sources: {
      label: labelRow,
    },
    style: style,
    link: link,
    pictureEl: pictureEl,
    hoverPictureEl: hoverPictureEl,
    label: label,
  };
}

export default function decorate(block) {
  const config = getItemsConfig(block);
  
  if (!config) return;
  let buttonHtml;
  if (config.style === "icon") {
    buttonHtml = html`
      <a class="btn-icon btn-icon--primary" href="${config.link}"> ${config.pictureEl} </a>
    `;
  } else if (config.style === "text-icon") {
    buttonHtml = html`
      <a class="btn-text-icon btn-text-icon--primary" href="${config.link}">
        ${config.pictureEl}
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

  const template = html`
    <div class="${COMPONENT_CLASS}__container component-layout">
      <div class="${COMPONENT_CLASS}__wrapper">${buttonHtml}</div>
    </div>
  `;


  block.innerHTML = "";
  block.classList.add(COMPONENT_CLASS);

  render(template, block);
}
