import { html, render } from "https://esm.sh/lit-html";
import { moveInstrumentation } from "../../scripts/scripts.js";

function getItemsConfig(block) {
  console.log(block.cloneNode(true));
  
  const cols = [...block.children];
  const styleEL = cols[0];
  const picture = cols[1];
  const labelEl = cols[2];
  const linkEl = cols[3];

  const style = styleEL?.textContent?.trim().toLowerCase() || "primary-m";
  const label = labelEl?.textContent?.trim() || "";
  const link = linkEl?.textContent?.trim() || "#";
  const pictureEl = picture.querySelector("picture");

  return {
    sources: {
      label: labelEl
    },
    style: style,
    link: link,
    pictureEl: pictureEl,
    label: label
  }
}

export default function decorate(block) {
  if (!block.children.length) return;

  const { sources, style, link, pictureEl, label } = getItemsConfig(block);
  let buttonHtml;
  if (["primary-m", "secondary-m", "secondary-s"].includes(style)) {
    buttonHtml = html`
      <a class="btn btn--${style} body-1" href="${link}" data-inst="label"
        >${label}</a
      >
    `;
  } else if (style === "icon") {
    buttonHtml = html`
      <a class="btn-icon btn-icon--primary" href="${link}"> ${pictureEl} </a>
    `;
  } else if (style === "text-icon") {
    buttonHtml = html`
      <a class="btn-text-icon btn-text-icon--primary" href="${link}">
        ${pictureEl}
        <span class="body-1" data-inst="label">${label}</span>
      </a>
    `;
  } else {
    buttonHtml = html`
      <a class="btn btn--primary-m body-1" href="${link}" data-inst="label"
        >${label}</a
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
  
  const wrapperTarget = block.querySelector(".cmp__button__wrapper");
  if(block.children[0]) {
    moveInstrumentation(block.children[0], wrapperTarget);
  }
  if(sources.label) {
    labelTarget = block.querySelector("[data-inst='label']");
    moveInstrumentation(sources.label, labelTarget);
  }
}
