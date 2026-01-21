import { html, render } from "https://esm.sh/lit-html";
import { moveInstrumentation } from "../../scripts/scripts.js";
const COMPONENT_CLASS = "cmp__button";

function getItemsConfig(block) {
  const rows = [...block.children];

  const bannerEl = rows[0]; 
  const ifShowTitleEl = rows[1];
  const titleEl = rows[2];
  const ifShowProductStatusEl = rows[3];
  const productStatusEl = rows[4];
  const ifShowDescriptionEl = rows[5];
  const descriptionEl = rows[6];

  const bannerImgEl = bannerEl?.querySelector("picture");
  const ifShowTitle = ifShowTitleEl?.textContent?.trim().toLowerCase() || false;
  const title = titleEl?.textContent?.trim() || "";
  const ifShowProductStatus = ifShowProductStatusEl?.textContent?.trim().toLowerCase() || false;
  const productStatus = productStatusEl?.textContent?.trim() || "";
  const ifShowDescription = ifShowDescriptionEl?.textContent?.trim().toLowerCase() || false;
  const description = descriptionEl?.textContent?.trim() || "";

  return {
    source: block,
    sources: {
      title: titleEl,
      productStatus: productStatusEl,
      description: descriptionEl,
    },
    bannerImgEl: bannerImgEl,
    ifShowTitle: ifShowTitle === 'true',
    title: title,
    ifShowProductStatus: ifShowProductStatus === 'true',
    productStatus: productStatus,
    ifShowDescription: ifShowDescription === 'true',
    description: description,
  };
}
export default function decorate(block) {
  console.log(block.cloneNode(true));

  console.log(getItemsConfig(block));
  
  const cols = [...block.children];
  // block.classList.add(`columns-${cols.length}-cols`);

  // // setup image columns
  // [...block.children].forEach((row) => {
  //   [...row.children].forEach((col) => {
  //     const pic = col.querySelector('picture');
  //     if (pic) {
  //       const picWrapper = pic.closest('div');
  //       if (picWrapper && picWrapper.children.length === 1) {
  //         // picture is only content in column
  //         picWrapper.classList.add('columns-img-col');
  //       }
  //     }
  //   });
  // });
}
