import { html, render } from "https://esm.sh/lit-html";
import { loadSwiper } from "../../libs/3rd-party.js";
import { moveInstrumentation } from "../../scripts/scripts.js";

const COMPONENT_CLASS = "cmp__support-tools";

/**
 * Extract configuration from block rows
 * @param {HTMLElement} block
 * @returns {Array} List of item configurations
 */
function getItemsConfig(block) {
  return [...block.children].map((row) => {
    const [linkCol, iconCol, textCol] = row.children;

    const picture = iconCol?.querySelector("picture");
    if (picture) {
      picture.classList.add(`${COMPONENT_CLASS}__icon`);
    }

    return {
      source: row,
      link: linkCol?.textContent?.trim() || "",
      icon: picture,
      iconMb: picture ? picture.cloneNode(true) : null,
      text: textCol?.innerHTML || "",
    };
  });
}

/**
 * Template for a single slide item (Desktop/Swiper)
 * @param {object} config
 */
function renderSlide(config) {
  return html`
    <div class="swiper-slide">
      <a class="cmp__support-tools__item" href="${config.link}">
        ${config.icon}
        <div
          class="cmp__support-tools__text rt-dark-900 headline-6"
          .innerHTML=${config.text}
        ></div>
      </a>
    </div>
  `;
}

/**
 * Template for a single static item (Mobile)
 * @param {object} config
 */
function renderStaticItem(config) {
  return html`
    <div>
      <a class="cmp__support-tools__item" href="${config.link}">
        ${config.iconMb}
        <span
          class="cmp__support-tools__text rt-dark-800 headline-6"
          .innerHTML=${config.text}
        ></span>
      </a>
    </div>
  `;
}

/**
 * Initialize Swiper logic
 * @param {HTMLElement} block
 */
function initSwiper(block) {
  const swiperContainer = block.querySelector(".swiper-container");
  const slideCount = block.querySelectorAll(".swiper-slide").length;

  // Set CSS variables for layout
  block.style.setProperty("--desktop-cols", Math.max(1, slideCount));
  block.style.setProperty(
    "--mobile-cols",
    Math.max(1, Math.min(slideCount, 2))
  );

  // If few slides, disable navigation and enable static mode
  if (slideCount <= 4) {
    block.classList.add("is-static-mode");
    block.querySelectorAll(".swiper-button-next, .swiper-button-prev").forEach(
      (btn) => (btn.style.display = "none")
    );
    return;
  }

  // Load and initialize functionality
  loadSwiper().then((Swiper) => {
    const swiper = new Swiper(swiperContainer, {
      slidesPerView: 2,
      centeredSlides: false,
      navigation: {
        nextEl: block.querySelector(".swiper-button-next"),
        prevEl: block.querySelector(".swiper-button-prev"),
      },
      observer: true,
      observeParents: true,
      breakpoints: {
        0: { slidesPerView: 2, spaceBetween: 16 },
        768: { slidesPerView: 4, spaceBetween: 16 },
        1024: { slidesPerView: 4, spaceBetween: 17.3 },
        1280: { slidesPerView: 4, spaceBetween: 17 },
        1440: { slidesPerView: 4, spaceBetween: 61 },
        1920: { slidesPerView: 4, spaceBetween: 140 },
      },
    });

    const resizeObserver = new ResizeObserver(() => swiper.update());
    resizeObserver.observe(swiperContainer);
  });
}

export default async function decorate(block) {
  const items = getItemsConfig(block);
  block.classList.add(COMPONENT_CLASS);

  // Main Template
  const template = html`
    <div class="${COMPONENT_CLASS}__container">
      <div class="component-layout">
        <!-- Desktop Swiper View -->
        <div class="${COMPONENT_CLASS}__swiper">
          <div class="swiper-container">
            <div class="swiper-wrapper ${COMPONENT_CLASS}__wrapper">
              ${items.map(renderSlide)}
            </div>
          </div>
          <div class="swiper-button-prev"></div>
          <div class="swiper-button-next"></div>
        </div>

        <!-- Mobile Static View -->
        <div class="${COMPONENT_CLASS}__static-list static-list">
          ${items.map(renderStaticItem)}
        </div>
      </div>
    </div>
  `;

  block.innerHTML = "";
  render(template, block);

  // Restore Instrumentation
  items.forEach((item, index) => {
    const slide = block.querySelectorAll(
      `.${COMPONENT_CLASS}__wrapper .swiper-slide`
    )[index];
    if (!item.source || !slide) return;

    moveInstrumentation(item.source, slide);

    // Instrument text column if it exists (col index 2)
    const textCol = item.source.children[2];
    const textTarget = slide.querySelector(`.${COMPONENT_CLASS}__text`);
    if (textCol && textTarget) {
      moveInstrumentation(textCol, textTarget);
    }
  });

  initSwiper(block);
}
