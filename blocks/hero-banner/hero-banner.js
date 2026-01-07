import { html, render } from "https://esm.sh/lit-html";
import { loadSwiper } from "../../scripts/3rd-party.js";
import { moveInstrumentation } from "../../scripts/scripts.js";

const COMPONENT_CLASS = "cmp__hero-banner";

/**
 * get hero banner configuration from the block first row
 * @param {block} block
 * @returns
 */
function getHeroBannerConfig(block) {
  const firstRow = block.children[0];
  const heroBannerConfigRows = [...firstRow.children].map(
    (row) => row.firstElementChild
  );
  const autoPlay =
    heroBannerConfigRows[0]?.textContent?.trim().toLowerCase() === "true";
  return { autoplay: autoPlay };
}

function getBannerItemsConfig(block) {
  const items = [...block.children].slice(1).map((row) => {
    const cols = [...row.children];
    console.log(row);

    const imageElPc = cols[0]?.querySelector("picture");
    if (imageElPc) {
      const img = imageElPc.querySelector("img");
      if (img) img.classList.add(`pc-banner`);
    }
    const imageElMb = cols[2]?.querySelector("picture");
    if (imageElMb) {
      const img = imageElMb.querySelector("img");
      if (img) img.classList.add(`mb-banner`);
    }
    return {
      source: row,
      imagePc: imageElPc,
      imageAltPc: cols[1]?.textContent?.trim(),
      imageMb: imageElMb,
      imageAltMb: cols[3]?.textContent?.trim(),
      title: cols[4]?.textContent?.trim(),

      description: cols[5]?.textContent?.trim(),
      ctaLabel: cols[6]?.textContent?.trim(),
      ctaLink: cols[7]?.textContent?.trim(),
      navTitle: cols[8]?.textContent?.trim(),
    };
  });
  console.log(items);

  return items;
}

/**
 * banner item template
 * @param {object} bannerItemConfig
 * @returns
 */
function bannerTemplate(bannerItemConfig) {
  return html` <div class="swiper-slide hero-banner__slide">
    <div class="banner__images">
      ${bannerItemConfig.imagePc} ${bannerItemConfig.imageMb}
    </div>
    <div class="banner__content component-layout">
      <div class="banner__content__wrapper">
        <div class="banner__box">
          <div class="banner__title headline-2">${bannerItemConfig.title}</div>
          <div class="banner__subtitle headline-4">
            ${bannerItemConfig.description}
          </div>
        </div>
        <a href="${bannerItemConfig.ctaLink}" class="banner__btn body-1"
          >${bannerItemConfig.ctaLabel}</a
        >
      </div>
    </div>
    <div class="hero-banner__mask"></div>
  </div>`;
}

function thumbTemplate(bannerItemConfig) {
  return html` <div
    class="swiper-slide hero-banner__thumb hero-banner__thumb--active"
  >
    <div class="thumb__content subtitle-1">${bannerItemConfig.navTitle}</div>
  </div>`;
}

function heroBannerTemplate(bannerTemplate, thumbTemplate, heroBannerConfig) {
  return html`
    <div class="hero-banner">
      <div class="hero-banner__container">
        <div class="banner-swiper">
          <div class="swiper-container">
            <div class="swiper-wrapper">
              <div class="swiper-actions">
                <div class="swiper-actions__wrapper component-layout">
                  <div class="swiper-pagination"></div>
                  <div class="swiper-button-prev"></div>
                  <div class="swiper-button-next"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
export default async function decorate(block) {
  const heroBannerConfig = getHeroBannerConfig(block);
  const bannerItemsConfig = getBannerItemsConfig(block);
  console.log(bannerItemsConfig);

  const bannerItemsTemplates = bannerItemsConfig.map((item) =>
    bannerTemplate(item)
  );
  // 3. Define Template
  // const template = html`
  //   <div class="swiper">
  //     <div class="swiper-wrapper">
  //       ${items.map(
  //         (item, index) => html`
  //           <div class="swiper-slide">
  //             <div class="${COMPONENT_CLASS}__media">${item.image}</div>
  //             <div class="${COMPONENT_CLASS}__content">
  //               <div class="${COMPONENT_CLASS}__text-container">
  //                 ${item.title
  //                   ? html`<h2
  //                       class="${COMPONENT_CLASS}__title"
  //                       .innerHTML=${item.title}
  //                     ></h2>`
  //                   : ""}
  //                 ${item.description
  //                   ? html`<p
  //                       class="${COMPONENT_CLASS}__description"
  //                       .innerHTML=${item.description}
  //                     ></p>`
  //                   : ""}
  //                 ${item.ctaLabel && item.ctaLink
  //                   ? html` <a
  //                       href="${item.ctaLink}"
  //                       class="${COMPONENT_CLASS}__cta button primary"
  //                       title="${item.ctaLabel}"
  //                     >
  //                       ${item.ctaLabel}
  //                     </a>`
  //                   : ""}
  //               </div>
  //             </div>
  //           </div>
  //         `
  //       )}
  //     </div>

  //     <div class="${COMPONENT_CLASS}__navigation">
  //       <div class="${COMPONENT_CLASS}__pagination custom-pagination">
  //         ${items.map(
  //           (item, index) => html`
  //             <button
  //               type="button"
  //               class="${COMPONENT_CLASS}__nav-item"
  //               data-index="${index}"
  //             >
  //               <span class="${COMPONENT_CLASS}__nav-title"
  //                 >${item.navTitle || `Slide ${index + 1}`}</span
  //               >
  //               <span class="${COMPONENT_CLASS}__nav-progress"></span>
  //             </button>
  //           `
  //         )}
  //       </div>
  //     </div>
  //   </div>
  // `;

  // 4. Render
  block.innerHTML = "";
  block.classList.add(COMPONENT_CLASS);
  // render(template, block);

  // 5. Restore Instrumentation
  // items.forEach((item, index) => {
  //   const slide = block.querySelectorAll(".swiper-slide")[index];
  //   const navItem = block.querySelectorAll(`.${COMPONENT_CLASS}__nav-item`)[
  //     index
  //   ];
  //   // Map source row elements to new DOM elements
  //   if (item.source) {
  //     const cols = item.source.children;
  //     // Image (Col 0) -> Slide Media Wrapper
  //     if (cols[0])
  //       moveInstrumentation(
  //         cols[0],
  //         slide.querySelector(`.${COMPONENT_CLASS}__media`)
  //       );

  //     // Title (Col 2) -> h2
  //     if (cols[2] && slide.querySelector(`.${COMPONENT_CLASS}__title`)) {
  //       moveInstrumentation(
  //         cols[2],
  //         slide.querySelector(`.${COMPONENT_CLASS}__title`)
  //       );
  //     }

  //     // Description (Col 3) -> p
  //     if (cols[3] && slide.querySelector(`.${COMPONENT_CLASS}__description`)) {
  //       moveInstrumentation(
  //         cols[3],
  //         slide.querySelector(`.${COMPONENT_CLASS}__description`)
  //       );
  //     }

  //     // CTA (Col 4) -> a (Button)
  //     if (cols[4] && slide.querySelector(`.${COMPONENT_CLASS}__cta`)) {
  //       moveInstrumentation(
  //         cols[4],
  //         slide.querySelector(`.${COMPONENT_CLASS}__cta`)
  //       );
  //     }

  //     // Nav Title (Col 6) -> Nav Item Button Title
  //     if (cols[6] && navItem) {
  //       moveInstrumentation(
  //         cols[6],
  //         navItem.querySelector(`.${COMPONENT_CLASS}__nav-title`)
  //       );
  //     }
  //   }
  // });

  // 6. Initialize Swiper
  // const Swiper = await loadSwiper();
  // if (Swiper) {
  //   new Swiper(block.querySelector(".swiper"), {
  //     slidesPerView: 1,
  //     loop: items.length > 1,
  //     autoplay: autoplay
  //       ? {
  //           delay: 5000,
  //           disableOnInteraction: false,
  //         }
  //       : false,
  //     effect: "fade",
  //     fadeEffect: {
  //       crossFade: true,
  //     },
  //     on: {
  //       init: function (swiper) {
  //         const buttons = block.querySelectorAll(
  //           `.${COMPONENT_CLASS}__nav-item`
  //         );
  //         buttons.forEach((btn, idx) => {
  //           btn.addEventListener("click", () => {
  //             swiper.slideToLoop(idx);
  //           });
  //         });

  //         const updateActive = () => {
  //           buttons.forEach((b) => b.classList.remove("active"));
  //           if (buttons[swiper.realIndex])
  //             buttons[swiper.realIndex].classList.add("active");
  //         };
  //         swiper.on("slideChange", updateActive);
  //         updateActive();
  //       },
  //     },
  //   });
  // }
}
