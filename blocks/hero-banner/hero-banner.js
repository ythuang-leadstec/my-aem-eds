import { html, render } from "https://esm.sh/lit-html";
import { loadSwiper } from "../../libs/3rd-party.js";
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
/**
 * get hero banner items configuration from the block children rows
 * @param {block} block
 * @returns
 */
function getItemsConfig(block) {

  const items = [...block.children].slice(1).map((row) => {
    const cols = [...row.children];

    const imageElPc = cols[0]?.querySelector("picture");
    let videoLinkPc = null,
      videoLinkMb = null,
      isImgAsset = false;
    if (imageElPc) {
      const img = imageElPc.querySelector("img");
      if (img) img.classList.add(`pc-banner`);
      isImgAsset = true;
    } else {
      videoLinkPc = cols[0]?.querySelector("a")?.getAttribute("href");
    }
    let imageElMb = cols[2]?.querySelector("picture");
    if (imageElMb) {
      const img = imageElMb.querySelector("img");
      if (img) img.classList.add(`mb-banner`);
    } else if (imageElPc) {
      imageElMb = imageElPc.cloneNode(true);
      const img = imageElMb.querySelector("img");
      if (img) img.classList.remove("pc-banner");
      if (img) img.classList.add("mb-banner");
    } else {
      const specificMbLink = cols[2]?.querySelector("a")?.getAttribute("href");
      videoLinkMb = specificMbLink ? specificMbLink : videoLinkPc;
    }
    // console.log(row);
    
    return {
      banner: {
        source: row,
        sources: {
          title: cols[4],
          description: cols[5],
          btn: cols[6]
        },
        assets: {
          isImgAsset: isImgAsset,
          imagePc: imageElPc,
          imageAltPc: cols[1]?.textContent?.trim(),
          imageMb: imageElMb,
          imageAltMb: cols[3]?.textContent?.trim(),
          videoLinkPc: videoLinkPc,
          videoLinkMb: videoLinkMb,
        },
        title: cols[4]?.textContent?.trim(),
        description: cols[5]?.textContent?.trim(),
        btnLabel: cols[6]?.textContent?.trim(),
        btnLink: cols[7]?.textContent?.trim(),
      },
      thumb: {
        source: row,
        sources: {
          navTitle: cols[8],
        },
        navTitle: cols[8]?.textContent?.trim(),
      },
    };
  });
  return items;
}

/**
 * set asset template
 * @param {object} assetConfig 
 * @returns 
 */
function setAssetTemplate(assetConfig) {
  if (assetConfig.isImgAsset) {
    return html`
    <div class="banner__images">
      ${assetConfig.imagePc} ${assetConfig.imageMb}
    </div>
    `;
  } else {
    return html`
    <div class="banner__video">
        <video src="${assetConfig.videoLinkPc}" class="pc-banner" autoplay muted loop></video>
        <video src="${assetConfig.videoLinkMb}" class="mb-banner" autoplay muted loop></video>
    </div>
    `;
  }
}
/**
 * banner item template
 * @param {object} bannerItemConfig
 * @returns
 */
function setBannerTemplate(bannerItemConfig) {
  return html` <div class="swiper-slide cmp__hero-banner__slide">
    ${setAssetTemplate(bannerItemConfig.assets)}
    <div class="banner__content component-layout">
      <div class="banner__content__wrapper">
        <div class="banner__box">
          <div class="banner__title headline-2" data-inst="title" .innerHTML=${bannerItemConfig.title}></div>
          <div class="banner__subtitle headline-4" data-inst="description" .innerHTML=${bannerItemConfig.description}>
          </div>
        </div>
        <a href="${bannerItemConfig.btnLink}" class="banner__btn body-1" data-inst="btn" .innerHTML=${bannerItemConfig.btnLabel}>
        </a>
      </div>
    </div>
    <div class="cmp__hero-banner__mask"></div>
  </div>`;
}

/**
 * thumb item template
 * @param {object} bannerItemConfig
 * @param {number} index
 * @returns
 */
function setThumbTemplate(bannerItemConfig, index) {
  return html` <div
    class="swiper-slide cmp__hero-banner__thumb ${index === 0 ? "cmp__hero-banner__thumb--active" : ""}"
  >
    <div class="thumb__content subtitle-1" data-inst="navTitle" .innerHTML=${bannerItemConfig.navTitle}></div>
  </div>`;
}
/**
 * hero banner template
 * @param {object} bannerItemsConfig
 * @param {object} heroBannerConfig
 * @returns
 */
function setHeroBannerTemplate(bannerItemsConfig, heroBannerConfig) {
  return html`
    <div class="cmp__hero-banner__container">
      <div class="banner-swiper">
        <div class="swiper-container">
          <div class="swiper-wrapper">
            ${bannerItemsConfig.map((item) => setBannerTemplate(item.banner))}
          </div>
          <div class="swiper-actions">
            <div class="swiper-actions__wrapper component-layout">
              <div class="swiper-pagination"></div>
              <div class="swiper-button-prev"></div>
              <div class="swiper-button-next"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="thumb-swiper">
        <div class="thumb-swiper__wrapper component-layout">
          <div class="swiper-container swiper-container-thumbs">
            <div class="swiper-wrapper cmp__hero-banner__thumbs">
              ${bannerItemsConfig.map((item, index) => setThumbTemplate(item.thumb, index))}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * set hero banner swiper
 * @param {block} block
 */
function setSwiper(block) {
  loadSwiper().then((Swiper) => {
    const bannerSwiper = block.querySelector(".banner-swiper");
    const thumbSwiper = block.querySelector(".thumb-swiper");
    const bannerSwiperContainer =
      bannerSwiper.querySelector(".swiper-container");
    const thumbSwiperContainer = thumbSwiper.querySelector(".swiper-container");

    // 获取thumb slide的数量
    const thumbSlidesCount =
      thumbSwiperContainer.querySelectorAll(".swiper-slide").length;
    const bannerSlidesCount =
      bannerSwiperContainer.querySelectorAll(".swiper-slide").length;

    let thumbSwiperInstance = null;
    let bannerSwiperInstance = null;

    // 如果slide数量大于1，才初始化thumb swiper
    if (thumbSlidesCount > 1) {
      thumbSwiper.classList.add("thumb-swiper-enabled");
      const swiperOptions = {
        loop: false, // thumb不使用loop模式
        slidesPerView: thumbSlidesCount <= 4 ? thumbSlidesCount : 4,
        spaceBetween: 24,
        centeredSlides: false,
        watchSlidesVisibility: true,
        observer: true,
        observeParents: true,
        allowTouchMove: false, // 禁用手动滑动
        // 禁用导航按钮和滚动条
        navigation: false,
        scrollbar: false,
      };

      thumbSwiperInstance = new Swiper(thumbSwiperContainer, swiperOptions);
    }

    if (bannerSlidesCount > 1) {
      // 初始化banner swiper，移除thumbs选项
      bannerSwiperInstance = new Swiper(bannerSwiperContainer, {
        loop: bannerSlidesCount > 1,
        observer: true,
        observeParents: true,
        autoplay: {
          disableOnInteraction: true,
          delay: 40000,
        },
        speed: 1200,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: bannerSwiperContainer.querySelector(".swiper-button-next"),
          prevEl: bannerSwiperContainer.querySelector(".swiper-button-prev"),
        },
        // 添加slideChange事件实现手动联动
        on: {
          slideChange: function () {
            if (thumbSwiperInstance) {
              // 移除所有thumb slide的active类名
              Array.from(thumbSwiperInstance.slides).forEach((slide) => {
                slide.classList.remove("cmp__hero-banner__thumb--active");
              });

              const activeIndex = this.realIndex;

              // 为对应的thumb slide添加active类名
              if (thumbSwiperInstance.slides[activeIndex]) {
                thumbSwiperInstance.slides[activeIndex].classList.add(
                  "cmp__hero-banner__thumb--active"
                );
              }

              // 当slide数量大于4时，实现滑动窗口逻辑
              if (bannerSlidesCount > 4) {
                const currentThumbIndex = thumbSwiperInstance.activeIndex; // thumb当前显示的第一个索引
                const visibleRange = 4; // 固定显示4个

                // 计算当前可视范围：currentThumbIndex 到 currentThumbIndex + 3
                const visibleStart = currentThumbIndex;
                const visibleEnd = currentThumbIndex + visibleRange - 1;

                // 如果activeIndex超出当前可视范围，需要移动thumb
                if (activeIndex > visibleEnd) {
                  // 向右移动：移动到activeIndex成为可视范围的最后一个
                  const newThumbIndex = activeIndex - visibleRange + 1;
                  thumbSwiperInstance.slideTo(newThumbIndex, 1200);
                } else if (activeIndex < visibleStart) {
                  // 向左移动：移动到activeIndex成为可视范围的第一个
                  thumbSwiperInstance.slideTo(activeIndex, 1200);
                }
              }
            }
          },
        },
      });
    }

    // 添加thumb swiper的点击事件，实现反向联动
    if (thumbSwiperInstance && bannerSwiperInstance) {
      thumbSwiperInstance.on("click", function () {
        if (thumbSwiperInstance.clickedSlide) {
          // 获取被点击slide的真实索引
          Array.from(thumbSwiperInstance.slides).forEach((slide) => {
            slide.classList.remove("cmp__hero-banner__thumb--active");
          });
          thumbSwiperInstance.clickedSlide.classList.add(
            "cmp__hero-banner__thumb--active"
          );

          const clickedIndex = thumbSwiperInstance.clickedIndex;

          if (bannerSwiperInstance.params.loop) {
            bannerSwiperInstance.slideToLoop(clickedIndex, 1200);
          } else {
            bannerSwiperInstance.slideTo(clickedIndex, 1200);
          }
        }
      });
    } else {
      // 仅1张banner时，隐藏左右导航按钮
      const container = bannerSwiperContainer.closest(
        ".cmp__hero-banner__container"
      );
      if (container) {
        container.classList.add("single-banner");
        const nextBtn = container.querySelector(".swiper-button-next");
        const prevBtn = container.querySelector(".swiper-button-prev");
        if (nextBtn) nextBtn.style.display = "none";
        if (prevBtn) prevBtn.style.display = "none";
      }
    }
  });
}
export default async function decorate(block) {
  console.log('--- Original Block with UE Props ---');
  console.log(block.cloneNode(true));
  
  const heroBannerConfig = getHeroBannerConfig(block);
  const bannerItemsConfig = getItemsConfig(block);

  const heroBannerTemplate = setHeroBannerTemplate(
    bannerItemsConfig,
    heroBannerConfig
  );

  block.innerHTML = "";
  block.classList.add(COMPONENT_CLASS);
  render(heroBannerTemplate, block);

  // Restore Instrumentation
  const bannerSlides = block.querySelectorAll(".banner-swiper .swiper-slide");
  const thumbSlides = block.querySelectorAll(".thumb-swiper .swiper-slide");
  bannerItemsConfig.forEach((item, index) => {
    const bannerSlide = bannerSlides[index];
    const thumbSlide = thumbSlides[index];
    if (item.banner.source && bannerSlide) {
      // Clone the source row BEFORE moveInstrumentation consumes its attributes
      // This allows us to use the same resource ID for the thumb slide
      const thumbSourceClone = item.banner.source.cloneNode(false);

      moveInstrumentation(item.banner.source, bannerSlide);
      
      if (item.banner.sources) {
        const { title, description, btn } = item.banner.sources;
        [
          { source: title, selector: '[data-inst="title"]' },
          { source: description, selector: '[data-inst="description"]' },
          { source: btn, selector: '[data-inst="btn"]' },
        ].forEach(({ source, selector }) => {
          const target = bannerSlide.querySelector(selector);
          // console.log(source);
          
          if (source.firstElementChild && target) {
            moveInstrumentation(source.firstElementChild, target);
          }
        });
      }

      if (item.thumb.source && thumbSlide) {
        moveInstrumentation(thumbSourceClone, thumbSlide);
        if (item.thumb.sources) {
          const { navTitle } = item.thumb.sources;
          const target = thumbSlide.querySelector('[data-inst="navTitle"]');
          if (navTitle.firstElementChild && target) {
             moveInstrumentation(navTitle.firstElementChild, target);
          }
        }
      }

    }
  });

  setSwiper(block);
}
