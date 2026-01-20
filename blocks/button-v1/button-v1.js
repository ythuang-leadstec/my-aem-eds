import { html, render } from "https://esm.sh/lit-html";
import { moveInstrumentation } from "../../scripts/scripts.js";

function getItemsConfig(block) {
  console.log(block.cloneNode(true));
  
  const rows = [...block.children];

  const styleRow = rows[0]; 
  const labelRow = rows[1];
  const linkRow = rows[2];
  const iconRow = rows[3];
  const hoverIconRow = rows[4];

  const style = styleRow?.textContent?.trim().toLowerCase() || "primary-m";
  const pictureEl = iconRow?.querySelector("picture");
  const hoverPictureEl = hoverIconRow?.querySelector("picture");
  
  const label = labelRow?.textContent?.trim() || "";
  const link = linkRow?.textContent?.trim() || "#";

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
    html`
      <a class="btn btn--${config.style} body-1" href="${config.link}" data-inst="label"
        >${config.label}</a
      >
    `;
  }

  const template = html`
    <div class="cmp__button__container component-layout">
      <div class="cmp__button__wrapper">${buttonHtml}</div>
    </div>
  `;

  block.classList.add("cmp__button");

  block.innerHTML = "";
  render(template, block);
  const btn = block.querySelector('a');
  if(config.source) {
    moveInstrumentation(config.source, btn);
  }
}
