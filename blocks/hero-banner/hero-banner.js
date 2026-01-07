import { html, render } from "https://esm.sh/lit-html";
import { moveInstrumentation } from "../../scripts/scripts.js";

export default function decorate(block) {
  if (!block.children.length) return;

  // Use block children (rows) directly to access fields
  const field = [...block.children].map((row) => row.firstElementChild);
  console.log(field);

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
  console.log(
    imagePositionClasses,
    alignConfig,
    picture,
    title,
    description,
    buttonLayout,
    buttonContentContainer,
    buttonPosition
  );

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
  block.className = "cmp__img-with-text";
  if (isReverse) {
    block.classList.add("cmp__img-with-text--reverse");
  }

  block.innerHTML = "";
  render(template, block);

  const newContainer = block.querySelector(".cmp__img-with-text__container");
  if (newContainer && block.firstElementChild) {
    moveInstrumentation(block.firstElementChild, newContainer);
  }
}
