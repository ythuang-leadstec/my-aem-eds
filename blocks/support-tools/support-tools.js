import { html, render } from "https://esm.sh/lit-html";
import { loadSwiper } from "../../scripts/3rd-party.js";
import { moveInstrumentation } from "../../scripts/scripts.js";

const COMPONENT_CLASS = "cmp__support-tools";

/**
 * get items config from block rows
 * @param {HTMLElement} block
 */
function getItemsConfig(block) {
  const items = [...block.children].map((row) => {
    const cols = [...row.children];

    let icon = null;
    const imgEl = cols[1]?.querySelector("picture");
    if (imgEl) {
      const img = imgEl.querySelector("img");
      if (img) img.className = "cmp__support-tools__icon";
      icon = imgEl;
    }
    return {
      source: row,
      link: cols[0]?.textContent?.trim() || "",
      icon: icon, // Store the DOM element
      iconMb: icon ? icon.cloneNode(true) : null,
      // iconMb: icon ? icon.cloneNode(true) : null, // Needed if you render it twice!
      text: cols[2]?.innerHTML || "",
    };
  });

  return items;
}

/**
 * set support tool pc template
 * @param {object} config
 * @returns
 */
function setSupportToolPcTemplate(config) {
  console.log(config.icon);

  const template = html`
    <div class="swiper-slide">
      <a class="cmp__support-tools__item" href="${config.link}">
        ${config.icon}
        <div class="cmp__support-tools__text rt-dark-800 headline-6"
          .innerHTML=${config.text}></div
        >
      </a>
    </div>
  `;

  console.log(template);
  return template;
}

/**
 * set support tool mb template
 * @param {object} config
 * @returns
 */
function setSupportToolMbTemplate(config) {
  return html`
    <div>
      <a class="cmp__support-tools__item" href="${config.link}">
        ${config.iconMb}
        <span class="cmp__support-tools__text rt-dark-800 headline-6"
          >${config.text}</span
        >
      </a>
    </div>
  `;
}
/**
 * set support tools template
 * @param {object} itemsConfig
 * @returns
 */
function setSupportToolsTemplate(itemsConfig) {
  return html`
    <div class="cmp__support-tools__container">
      <div class="component-layout">
        <div class="cmp__support-tools__swiper">
          <div class="swiper-container">
            <div class="swiper-wrapper cmp__support-tools__wrapper">
              ${itemsConfig.map((item) => setSupportToolPcTemplate(item))}
            </div>
          </div>

          <div class="swiper-button-prev"></div>
          <div class="swiper-button-next"></div>
        </div>

        <!-- 只有在手机端才会显示 -->
        <div class="cmp__support-tools__static-list static-list">
          ${itemsConfig.map((item) => setSupportToolMbTemplate(item))}
        </div>
      </div>
    </div>
  `;
}
/**
 * set swiper
 * @param {HTMLElement} block 
 * @returns 
 */
function setSwiper(block) {
  const swiperContainer = block.querySelector(".swiper-container");
  const slides = block.querySelectorAll(".swiper-slide");
  const slidesCount = slides.length;

  block.style.setProperty("--desktop-cols", Math.max(1, slidesCount));
  block.style.setProperty(
    "--mobile-cols",
    Math.max(1, Math.min(slidesCount, 2))
  );

  if (slidesCount <= 4) {
    const navButtons = block.querySelectorAll(
      ".swiper-button-next, .swiper-button-prev"
    );
    navButtons.forEach((btn) => (btn.style.display = "none"));
    block.classList.add("is-static-mode");
    return;
  }

  loadSwiper().then((Swiper) => {
    new Swiper(swiperContainer, {
      slidesPerView: 2,
      centeredSlides: false,
      navigation: {
        nextEl: block.querySelector(".swiper-button-next"),
        prevEl: block.querySelector(".swiper-button-prev"),
      },
      breakpoints: {
        0: {
          slidesPerView: 2,
          spaceBetween: 16,
        },
        768: {
          slidesPerView: 4,
          spaceBetween: 16,
        },
        1024: {
          slidesPerView: 4,
          spaceBetween: 17.3,
        },
        1280: {
          slidesPerView: 4,
          spaceBetween: 17,
        },
        1440: {
          slidesPerView: 4,
          spaceBetween: 61,
        },
        1920: {
          slidesPerView: 4,
          spaceBetween: 140,
        },
      },
    });
  });
}
export default async function decorate(block) {
  // console.log(block);

  const itemsConfig = getItemsConfig(block);

  const template = setSupportToolsTemplate(itemsConfig);
  block.innerHTML = "";
  block.classList.add(COMPONENT_CLASS);
  render(template, block);

  itemsConfig.forEach((item, index) => {
    const supportToolSlide = block.querySelectorAll(
      ".cmp__support-tools__wrapper .swiper-slide"
    )[index];
    if (item.source && supportToolSlide) {
      moveInstrumentation(item.source, supportToolSlide);
      const cols = [...item.source.children];
      if (cols[1]) {
        const target = supportToolSlide.querySelector("picture");
        if (target) {
          moveInstrumentation(cols[1], target);
        }
      }

      if (cols[2]) {
        const target = supportToolSlide.querySelector(
          ".cmp__support-tools__text"
        );
        if (target) {
          moveInstrumentation(cols[2], target);
        }
      }
    }
  });
  setSwiper(block);
}
