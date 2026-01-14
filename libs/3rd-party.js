import { loadCSS } from "../scripts/aem.js";

/**
 * 通用 Swiper 加载器
 * @returns {Promise<Class>} Swiper 类
 */
export async function loadSwiper() {
  loadCSS(`${window.hlx.codeBasePath}/libs/swiper/swiper.min.css`);
  const mod = await import("./swiper/swiper.esm.browser.bundle.min.js");
  return mod.default;
}
