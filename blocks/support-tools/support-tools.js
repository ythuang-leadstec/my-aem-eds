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
    let text = null;
    if (textCol) {
      text = textCol.firstElementChild;
      if (text) {
        text.classList.add(`${COMPONENT_CLASS}__text`, "rt-dark-900", "headline-6");
      }
    }
    return {
      source: row,
      link: linkCol?.textContent?.trim() || "",
      icon: picture,
      text: text,
    };
  });
}

/**
 * Template for a single slide item
 * @param {object} config
 */
function renderItem(config) {
  return html`
    <div class="swiper-slide">
      <a class="${COMPONENT_CLASS}__item" href="${config.link}">
        ${config.icon}${config.text}
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

  // If few slides, always static mode
  if (slideCount <= 4) {
    block.classList.add("is-static-mode");
    block.querySelectorAll(".swiper-button-next, .swiper-button-prev").forEach(
      (btn) => (btn.style.display = "none")
    );
    return;
  }

  let swiperInstance = null;

  const handleSwiperState = async () => {
    const isMobile = window.innerWidth < 768; // Tablet breakpoint

    if (isMobile) {
      if (swiperInstance) {
        swiperInstance.destroy(true, true);
        swiperInstance = null;
      }
      return;
    }

    if (!swiperInstance) {
      loadSwiper().then((Swiper) => {
        // Re-check just in case state changed during async import
        if (window.innerWidth < 768) return;

        swiperInstance = new Swiper(swiperContainer, {
          slidesPerView: 4,
          spaceBetween: 16,
          navigation: {
            nextEl: block.querySelector(".swiper-button-next"),
            prevEl: block.querySelector(".swiper-button-prev"),
          },
          breakpoints: {
            768: { slidesPerView: 4, spaceBetween: 16 },
            1024: { slidesPerView: 4, spaceBetween: 17.3 },
            1280: { slidesPerView: 4, spaceBetween: 17 },
            1440: { slidesPerView: 4, spaceBetween: 61 },
            1920: { slidesPerView: 4, spaceBetween: 140 },
          },
        });
      });
    } else {
      swiperInstance.update();
    }
  };

  // Initial Check
  handleSwiperState();

  // Watch for breakpoint changes
  const resizeObserver = new ResizeObserver(() => {
    handleSwiperState();
  });
  resizeObserver.observe(document.body);
}

export default async function decorate(block) {
  const items = getItemsConfig(block);
  block.classList.add(COMPONENT_CLASS);

  // Main Template
  const template = html`
    <div class="${COMPONENT_CLASS}__container">
      <div class="component-layout">
        <div class="${COMPONENT_CLASS}__swiper">
          <div class="swiper-container">
            <div class="swiper-wrapper ${COMPONENT_CLASS}__wrapper">
              ${items.map(renderItem)}
            </div>
          </div>
          <div class="swiper-button-prev"></div>
          <div class="swiper-button-next"></div>
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
  });

  initSwiper(block);
}
