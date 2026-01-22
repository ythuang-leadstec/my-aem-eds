import { html, render } from "https://esm.sh/lit-html";
import { unsafeHTML } from "https://esm.sh/lit-html/directives/unsafe-html.js";
import { moveInstrumentation } from "../../scripts/scripts.js";

const COMPONENT_CLASS = "cmp__text";


function getItemsConfig(block) {
  console.log(block.cloneNode(true));
  const [
    bannerEl,
    fontStyleEl,
    contentEl,
    ifShowInfoStatusEl,
    infoStatusLinkEl,
    statusIconEl,
    infoEl,
  ] = [...block.children];

  // 1. Extract banner image
  const bannerImg = bannerEl?.querySelector("img")?.src || "";

  // 2. Extract font style (default: headline-1)
  const fontStyle = fontStyleEl?.textContent?.trim() || "headline-1";

  // 3. Extract content (keep original HTML for rich text)
  // Note: Do not concatenate info link here, logic moved to template layer
  const contentHtml = contentEl?.querySelector("p")?.textContent?.trim() || "";

  // 4. Extract status toggle
  const showInfoStatus =
    ifShowInfoStatusEl?.textContent?.trim().toLowerCase() === "true";

  // 5. Extract link and text
  const infoStatusLink = infoStatusLinkEl?.textContent?.trim() || "";
  const infoText = infoEl?.textContent?.trim() || "";

  // 6. Extract icon (support svg image or default value)
  const iconSrc =
    statusIconEl?.querySelector("img")?.src || "../../icons/status-yellow.svg";

  return {
    bannerImg,
    fontStyle,
    contentHtml,
    showInfoStatus,
    infoStatusLink,
    infoText,
    iconSrc,
    sources: {
      content: contentEl,
      info: infoEl,
      banner: bannerEl,
    },
  };
}

export default function decorate(block) {
  const config = getItemsConfig(block);
  if (!config) return;

  const template = html`
    <div
      class="${COMPONENT_CLASS}"
      style="--text-icon: url('${config.iconSrc}');"
    >
      <div class="${COMPONENT_CLASS}-container component-layout">
        <div class="${config.fontStyle} is-relative">
          ${unsafeHTML(config.contentHtml)}
          ${config.showInfoStatus && config.infoText
            ? html`
                <a
                  href="${config.infoStatusLink}"
                  class="${COMPONENT_CLASS}__info caption"
                >
                  ${config.infoText}
                </a>
              `
            : null}
        </div>
      </div>

      ${config.bannerImg
        ? html`
            <div class="${COMPONENT_CLASS}__banner">
              <img src="${config.bannerImg}" alt=""/>
            </div>
          `
        : null}
    </div>
  `;

  block.innerHTML = "";
  block.classList.add(COMPONENT_CLASS);
  render(template, block);
}
