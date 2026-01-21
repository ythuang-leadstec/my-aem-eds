import { html, render } from "https://esm.sh/lit-html";
import { moveInstrumentation } from "../../scripts/scripts.js";
const COMPONENT_CLASS = "cmp__text";

function getItemsConfig(block) {
  const rows = [...block.children];

  const bannerEl = rows[0];
  const fontStyleEl = rows[1];
  const contentEl = rows[2];

  const ifShowInfoStatusEl = rows[3];
  const infoStatusLinkEL = rows[4];
  const statusIconEL = rows[5];
  const infoEl = rows[6];

  const bannerImgEl = bannerEl?.querySelector("picture");
  const fontStyle = fontStyleEl?.textContent?.trim() || "headline-1";
  const ifShowInfoStatus =
    ifShowInfoStatusEl?.textContent?.trim().toLowerCase() || false;
  const info = infoEl?.textContent?.trim() || "";
  const infoStatusLink =
    infoStatusLinkEL?.textContent?.trim().toLowerCase() || "";
  const icon = statusIconEL
    ? querySelector("img")?.src
    : "../../../assets/images/icons/status-yellow.svg";

  let content = "";
  const contentParagraph = contentEl?.firstElementChild?.querySelector("p");

  if (contentParagraph) {
    content = contentParagraph.innerHTML;

    if (ifShowInfoStatus && info && infoStatusLink) {
      content += `<a href="${infoStatusLink}" class="${COMPONENT_CLASS}__info caption">${info}</a>`;
    }
  }
  return {
    source: block,
    sources: {
      content: contentEl,
      info: infoEl,
    },
    bannerImgEl: bannerImgEl,
    fontStyle: fontStyle,
    content: content,
    ifShowInfoStatus: ifShowInfoStatus === "true",
    info: info,
    infoStatusLink: infoStatusLink,
    icon: icon,
  };
}
export default function decorate(block) {
  console.log(block.cloneNode(true));

  const config = getItemsConfig(block);
  console.log(config);

  if (!config) return;
  const textHTML = html`
    <div class="${COMPONENT_CLASS}" style="--icon: url(${config.icon});">
      <div class="${COMPONENT_CLASS}-container component-layout">
        <div class="headline-3 is-relative" .innerHTML=${config.content}></div>
      </div>
    </div>
  `;
  block.innerHTML = "";
  block.classList.add(COMPONENT_CLASS);

  render(textHTML, block);
}
