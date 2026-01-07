import { html, render } from "https://esm.sh/lit-html";
import { moveInstrumentation } from "../../scripts/scripts.js";

export default function decorate(block) {
  console.log(block);
  
  if (!block.children.length) return;

  const field = [...block.children].map((row) => row.firstElementChild);

  const imagePositionClasses =
      field[0]?.textContent?.trim().toLowerCase() || "",
    alignConfig = imagePositionClasses.includes("image-right")
      ? "image-right"
      : "image-left",
    picture = field[1]?.querySelector("picture"),
    title = field[2]?.innerHTML || "",
    description = field[3]?.innerHTML || "",
    buttonLayout = field[4]?.textContent || "normal",
    buttonContentContainer = field[5],
    buttonPosition = field[6]?.textContent || "is-align-left";

  const isReverse = alignConfig === "image-right";

  if (picture) {
    const img = picture.querySelector("img");
    if (img) img.className = "cmp__img-with-text__image";
  }

  const links = buttonContentContainer
    ? [...buttonContentContainer.querySelectorAll("a")].map((a) => ({
        href: a.href,
        text: a.textContent,
        title: a.title,
      }))
    : [];

  const template = html`
    <div class="cmp__img-with-text__container component-layout">
      <div class="cmp__img-with-text__image-wrapper">${picture}</div>
      <div class="cmp__img-with-text__content">
        <div
          class="cmp__img-with-text__title headline-4"
          .innerHTML=${title}
        ></div>
        <p
          class="cmp__img-with-text__description rt-dark-800 body-1"
          .innerHTML=${description}
        ></p>

        ${buttonLayout === "group"
          ? html` <div
              class="cmp__img-with-text__text-link-group ${buttonPosition}"
            >
              ${links.map(
                (link) => html`
                  <a
                    href="${link.href}"
                    title="${link.title}"
                    class="cmp__img-with-text__text-link subtitle-1 is-with-arrow"
                    >${link.text}</a
                  >
                `
              )}
            </div>`
          : html` <div
              class="cmp__img-with-text__button-wrapper ${buttonPosition}"
            >
              ${links.map(
                (link) => html`
                  <a
                    href="${link.href}"
                    title="${link.title}"
                    class="cmp__img-with-text__button body-1"
                    >${link.text}</a
                  >
                `
              )}
            </div>`}
      </div>
    </div>
  `;
  // block.classList.add("cmp__img-with-text");
  if (isReverse) {
    block.classList.add("cmp__img-with-text--reverse");
  }

  block.innerHTML = "";
  render(template, block);

  // Restore Instrumentation for Inline Editing using a mapping array
  const instrumentationMap = [
    { index: 1, selector: ".cmp__img-with-text__image-wrapper" },
    { index: 2, selector: ".cmp__img-with-text__title" },
    { index: 3, selector: ".cmp__img-with-text__description" },
  ];

  instrumentationMap.forEach(({ index, selector }) => {
    const source = field[index];
    const target = block.querySelector(selector);
    if (source && target) {
      moveInstrumentation(source, target);
    }
  });
}

