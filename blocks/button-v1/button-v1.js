import { html, render } from "https://esm.sh/lit-html";
import { moveInstrumentation } from "../../scripts/scripts.js";

function getItemsConfig(block) {
  console.log(block.cloneNode(true));
  const row = block.firstElementChild;
  if (!row) return null;

  console.log(row);
  
  const cols = [...row.children];
  const styleEL = cols[0];
  const picture = cols[1];
  const labelEl = cols[2];
  const linkEl = cols[3];

  const style = styleEL?.textContent?.trim().toLowerCase() || "primary-m";
  const label = labelEl?.textContent?.trim() || "";
  const link = linkEl?.textContent?.trim() || "#";
  const pictureEl = picture.querySelector("picture");

  return {
    source: row,
    sources: {
      label: labelEl,
    },
    style: style,
    link: link,
    pictureEl: pictureEl,
    label: label,
  };
}

export default function decorate(block) {
  console.log(block);
  
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
